// Órdenes: estados, código PV, flujo de estados y ayudas para mostrarlas.
// Creado por Emanuel (HU-45); flujo de estados y códigos PV agregados por Jim (CF-09 y CF-10, ver docs/CAMBIOS-FINALES.md).
import db from '../../data/db.js'

export const ESTADOS_ORDEN = ['En preparación', 'Asignado a repartidor', 'En camino', 'Lista para retiro', 'Entregada', 'Cancelada']

// Clase de Bootstrap para el badge de cada estado
export const CLASES_ESTADO = {
  'En preparación': 'text-bg-warning',
  'Asignado a repartidor': 'text-bg-info',
  'En camino': 'text-bg-primary',
  'Lista para retiro': 'text-bg-primary',
  Entregada: 'text-bg-success',
  Cancelada: 'text-bg-danger',
}

// Código correlativo: si la última es PV-000004, la siguiente es PV-000005
export function siguienteCodigo(ordenes) {
  const numeros = ordenes.map((o) => Number(String(o.numero).replace('PV-', '')) || 0)
  const siguiente = Math.max(0, ...numeros) + 1
  return `PV-${String(siguiente).padStart(6, '0')}`
}

// Flujo de estados. Despacho: preparación → asignado → en camino → entregada.
// Retiro en tienda: preparación → lista para retiro → entregada.
// Devuelve el próximo paso de la orden, o null si ya terminó.
//   accion       → identificador del paso
//   texto        → texto del botón
//   estadoNuevo  → estado al que pasa la orden
//   roles        → quién puede hacerlo
export function siguientePaso(orden) {
  const despacho = orden.tipoEntrega === 'despacho'
  switch (orden.estado) {
    case 'En preparación':
      return despacho
        ? { accion: 'asignar', texto: 'Asignar repartidor', estadoNuevo: 'Asignado a repartidor', roles: ['Administrador', 'Operador'] }
        : { accion: 'listaRetiro', texto: 'Marcar lista para retiro', estadoNuevo: 'Lista para retiro', roles: ['Administrador', 'Operador'] }
    case 'Asignado a repartidor':
      return { accion: 'iniciarRuta', texto: 'Iniciar ruta', estadoNuevo: 'En camino', roles: ['Administrador', 'Repartidor'] }
    case 'En camino':
      return { accion: 'entregar', texto: 'Marcar entregada', estadoNuevo: 'Entregada', roles: ['Administrador', 'Repartidor'], pideFoto: true }
    case 'Lista para retiro':
      return { accion: 'entregarRetiro', texto: 'Entregar al cliente', estadoNuevo: 'Entregada', roles: ['Administrador', 'Operador'] }
    default:
      return null
  }
}

// Solo el Administrador puede cancelar, y solo antes de que el pedido salga a ruta
export function puedeCancelar(orden, usuario) {
  return usuario?.rol === 'Administrador' && ['En preparación', 'Asignado a repartidor', 'Lista para retiro'].includes(orden.estado)
}

// Cambia el estado, deja el registro en historialEstados y devuelve la orden actualizada.
// extra: { repartidorId } al asignar o { fotoEntrega } al entregar.
export function cambiarEstado(orden, estadoNuevo, usuario, extra = {}) {
  const registro = {
    estado: estadoNuevo,
    fecha: new Date().toISOString(),
    usuarioId: usuario?.id ?? null,
    usuarioNombre: usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Sistema',
  }
  return db.update('ordenes', orden.id, {
    ...extra,
    estado: estadoNuevo,
    historialEstados: [...(orden.historialEstados ?? []), registro],
  })
}

// Repartidores activos (para el selector de "Asignar repartidor")
export function repartidoresActivos() {
  return db.getAll('usuarios').filter((u) => u.rol === 'Repartidor' && u.activo)
}

// formatearFecha('2026-11-05T19:45:00.000Z') → '5 de noviembre de 2026, 4:45 p. m.'
export function formatearFecha(iso, conHora = true) {
  const opciones = conHora ? { dateStyle: 'long', timeStyle: 'short' } : { dateStyle: 'medium' }
  return new Date(iso).toLocaleString('es-CL', opciones)
}

// Órdenes de la más nueva a la más antigua
export function ordenarPorFecha(ordenes) {
  return [...ordenes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}
