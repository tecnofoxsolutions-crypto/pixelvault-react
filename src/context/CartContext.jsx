// DUEÑO: Emanuel (tarjeta TEC-05). Versión básica del esqueleto: Emanuel la completa sin cambiar los nombres de la API.
// Uso: const { items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadItems } = useCart()
// Cada item: { productoId, nombre, precio, cantidad, imagen, stock }
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const CLAVE_CARRITO = 'pixelvault_carrito'

function cargarCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) ?? []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(cargarCarrito)

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
  }, [items])

  // Recibe un producto de db.js. Usa el precio de oferta si existe. Devuelve { ok, mensaje }
  function agregar(producto, cantidad = 1) {
    const existente = items.find((it) => it.productoId === producto.id)
    const enCarrito = existente ? existente.cantidad : 0
    if (enCarrito + cantidad > producto.stock) {
      return { ok: false, mensaje: `Solo quedan ${producto.stock} unidades disponibles` }
    }

    const precio = producto.precioOferta ?? producto.precio
    setItems((actuales) =>
      existente
        ? actuales.map((it) =>
            it.productoId === producto.id ? { ...it, cantidad: it.cantidad + cantidad } : it
          )
        : [
            ...actuales,
            {
              productoId: producto.id,
              nombre: producto.nombre,
              precio,
              cantidad,
              imagen: producto.imagen,
              stock: producto.stock,
            },
          ]
    )
    return { ok: true, mensaje: `${producto.nombre} agregado al carrito` }
  }

  function quitar(productoId) {
    setItems((actuales) => actuales.filter((it) => it.productoId !== productoId))
  }

  function cambiarCantidad(productoId, cantidad) {
    if (cantidad <= 0) return quitar(productoId)
    setItems((actuales) =>
      actuales.map((it) =>
        it.productoId === productoId ? { ...it, cantidad: Math.min(cantidad, it.stock) } : it
      )
    )
  }

  function vaciar() {
    setItems([])
  }

  const total = items.reduce((suma, it) => suma + it.precio * it.cantidad, 0)
  const cantidadItems = items.reduce((suma, it) => suma + it.cantidad, 0)

  const valor = { items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadItems }
  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export function useCart() {
  const contexto = useContext(CartContext)
  if (!contexto) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return contexto
}
