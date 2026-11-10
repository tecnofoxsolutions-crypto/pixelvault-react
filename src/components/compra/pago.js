// DUEÑO: Emanuel (HU-38/39). Pago simulado: crea la orden o devuelve el motivo del rechazo.
import db from '../../data/db.js'
import { calcularDespacho } from './despacho.js'

// Clave del formulario de checkout guardado en sessionStorage (para reintentar sin perder los datos)
export const CLAVE_BORRADOR_CHECKOUT = 'pixelvault_checkout'

// Revisa en db.js que cada producto siga existiendo y tenga stock suficiente.
// Devuelve el texto del problema o null si todo está bien.
function revisarStock(items) {
  for (const item of items) {
    const producto = db.getById('productos', item.productoId)
    if (!producto || !producto.activo) return `${item.nombre} ya no está disponible.`
    if (producto.stock < item.cantidad) {
      return producto.stock === 0
        ? `${item.nombre} se quedó sin stock.`
        : `Solo quedan ${producto.stock} unidades de ${item.nombre} y pediste ${item.cantidad}.`
    }
  }
  return null
}

// Número correlativo: el mayor número existente + 1
function siguienteNumero() {
  const numeros = db.getAll('ordenes').map((orden) => Number(orden.numero) || 0)
  return numeros.length > 0 ? Math.max(...numeros) + 1 : 20261001
}

// Arma el objeto orden con la forma del contrato (ver AGENTS.md)
function armarOrden({ form, items, usuario }) {
  const subtotal = items.reduce((suma, it) => suma + it.precio * it.cantidad, 0)
  const despacho = calcularDespacho(form.tipoEntrega)
  return {
    numero: siguienteNumero(),
    fecha: new Date().toISOString(),
    usuarioId: usuario?.id ?? null,
    cliente: { nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), correo: form.correo.trim() },
    direccion: {
      calle: form.calle.trim(),
      depto: form.depto.trim(),
      region: form.region,
      comuna: form.comuna,
      indicaciones: form.indicaciones.trim(),
    },
    tipoEntrega: form.tipoEntrega,
    items: items.map(({ productoId, nombre, precio, cantidad, imagen }) => ({ productoId, nombre, precio, cantidad, imagen })),
    subtotal,
    despacho,
    total: subtotal + despacho,
    estado: 'En preparación',
  }
}

// Procesa el pago. Si se rechaza, no se toca ni la base de datos ni el carrito.
// Devuelve { ok: true, orden } o { ok: false, motivo, detalle }
export function procesarPago({ form, items, usuario, simularRechazo }) {
  const orden = armarOrden({ form, items, usuario })

  if (simularRechazo) {
    return { ok: false, motivo: 'El medio de pago fue rechazado (simulación de demostración).', detalle: orden }
  }
  const problemaStock = revisarStock(items)
  if (problemaStock) {
    return { ok: false, motivo: `Stock insuficiente: ${problemaStock}`, detalle: orden }
  }

  // Pago aprobado: se guarda la orden y se descuenta el stock de cada producto
  const creada = db.create('ordenes', orden)
  items.forEach((item) => {
    const producto = db.getById('productos', item.productoId)
    db.update('productos', item.productoId, { stock: producto.stock - item.cantidad })
  })
  return { ok: true, orden: creada }
}
