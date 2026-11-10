// DUEÑO: Maximiliano. Funciones de precio compartidas por las tarjetas, el detalle y los filtros.

// Un producto está en oferta si tiene precioOferta y es menor que el precio normal
export function estaEnOferta(producto) {
  return producto.precioOferta != null && producto.precioOferta < producto.precio
}

// Precio que paga el cliente
export function precioFinal(producto) {
  return estaEnOferta(producto) ? producto.precioOferta : producto.precio
}

// Porcentaje de descuento redondeado, ej: 39990 → 29990 = 25
export function porcentajeDescuento(producto) {
  if (!estaEnOferta(producto)) return 0
  return Math.round((1 - producto.precioOferta / producto.precio) * 100)
}
