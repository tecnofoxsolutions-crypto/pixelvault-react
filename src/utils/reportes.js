// Cálculos de los reportes del admin. Son funciones puras: reciben arreglos de db.js y devuelven resultados,
// sin leer ni guardar nada. Así la página Reportes solo se encarga de mostrar.

const DIA_EN_MS = 24 * 60 * 60 * 1000

// Órdenes no canceladas dentro del rango. dias = null → todas.
export function ordenesDelPeriodo(ordenes, dias, hoy = new Date()) {
  const desde = dias ? hoy.getTime() - dias * DIA_EN_MS : null
  return ordenes.filter((o) => o.estado !== 'Cancelado' && (!desde || new Date(o.fecha).getTime() >= desde))
}

// Total vendido, cantidad de órdenes y ticket promedio
export function resumenVentas(ordenes) {
  const totalVendido = ordenes.reduce((suma, o) => suma + o.total, 0)
  return {
    totalVendido,
    cantidadOrdenes: ordenes.length,
    ticketPromedio: ordenes.length ? Math.round(totalVendido / ordenes.length) : 0,
  }
}

// [{ nombre, monto, porcentaje }] ordenado de mayor a menor. Usa el subtotal de cada item (sin despacho).
export function ventasPorCategoria(ordenes, productos, categorias) {
  const montos = {}
  ordenes.forEach((orden) => {
    orden.items.forEach((item) => {
      const producto = productos.find((p) => p.id === item.productoId)
      const categoria = categorias.find((c) => c.id === producto?.categoriaId)
      const nombre = categoria?.nombre ?? 'Sin categoría'
      montos[nombre] = (montos[nombre] ?? 0) + item.precio * item.cantidad
    })
  })

  const total = Object.values(montos).reduce((suma, monto) => suma + monto, 0)
  return Object.entries(montos)
    .map(([nombre, monto]) => ({ nombre, monto, porcentaje: total ? Math.round((monto / total) * 100) : 0 }))
    .sort((a, b) => b.monto - a.monto)
}

// Los productos con más unidades vendidas: [{ productoId, nombre, unidades, monto }]
export function masVendidos(ordenes, limite = 5) {
  const porProducto = {}
  ordenes.forEach((orden) => {
    orden.items.forEach((item) => {
      const actual = porProducto[item.productoId] ?? { productoId: item.productoId, nombre: item.nombre, unidades: 0, monto: 0 }
      actual.unidades += item.cantidad
      actual.monto += item.precio * item.cantidad
      porProducto[item.productoId] = actual
    })
  })
  return Object.values(porProducto)
    .sort((a, b) => b.unidades - a.unidades || b.monto - a.monto)
    .slice(0, limite)
}

// Valor del inventario a precio de venta (usa el precio de oferta si existe)
export function valorInventario(productos) {
  return productos.reduce((suma, p) => suma + (p.precioOferta ?? p.precio) * p.stock, 0)
}
