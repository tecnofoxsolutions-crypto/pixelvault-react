// DUEÑO: Emanuel (HU-45). Datos y ayudas para mostrar órdenes.
export const ESTADOS_ORDEN = ['En preparación', 'Enviado', 'Entregado', 'Cancelado']

// Clase de Bootstrap para el badge de cada estado
export const CLASES_ESTADO = {
  'En preparación': 'text-bg-warning',
  Enviado: 'text-bg-info',
  Entregado: 'text-bg-success',
  Cancelado: 'text-bg-danger',
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
