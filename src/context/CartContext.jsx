// DUEÑO: Emanuel (tarjeta TEC-05). Estado global del carrito, persistido en localStorage.
// Uso: const { items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadItems } = useCart()
// Cada item: { productoId, nombre, precio, cantidad, imagen, stock }
import { createContext, useContext, useEffect, useState } from 'react'
import db from '../data/db.js'

const CartContext = createContext(null)
const CLAVE_CARRITO = 'pixelvault_carrito'

// Precio que se cobra: el de oferta si existe y es menor que el normal
function precioFinal(producto) {
  const oferta = producto.precioOferta
  return oferta != null && oferta < producto.precio ? oferta : producto.precio
}

// Stock real del producto según db.js (el stock puede cambiar después de una compra o desde el admin)
function stockDisponible(productoId) {
  return db.getById('productos', productoId)?.stock ?? 0
}

function mensajeMaximo(stock) {
  return stock === 1 ? 'Solo queda 1 unidad disponible' : `Solo quedan ${stock} unidades disponibles`
}

// Al cargar la página, actualiza precio y stock de cada item con los datos de db.js
// y saca los productos que ya no existen, están inactivos o se quedaron sin stock.
function sincronizarConDb(items) {
  return items
    .map((item) => {
      const producto = db.getById('productos', item.productoId)
      if (!producto || !producto.activo || producto.stock <= 0) return null
      return {
        ...item,
        nombre: producto.nombre,
        imagen: producto.imagen,
        precio: precioFinal(producto),
        stock: producto.stock,
        cantidad: Math.min(item.cantidad, producto.stock),
      }
    })
    .filter(Boolean)
}

function cargarCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) ?? []
    return sincronizarConDb(guardado)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(cargarCarrito)

  // Cada vez que cambia el carrito se guarda en localStorage
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
  }, [items])

  // Recibe un producto de db.js. Devuelve { ok, mensaje } para que la vista muestre el resultado.
  function agregar(producto, cantidad = 1) {
    if (cantidad < 1) return { ok: false, mensaje: 'La cantidad debe ser al menos 1' }

    const stock = stockDisponible(producto.id)
    if (stock <= 0) return { ok: false, mensaje: `${producto.nombre} no tiene stock disponible` }

    const existente = items.find((it) => it.productoId === producto.id)
    const enCarrito = existente ? existente.cantidad : 0
    if (enCarrito + cantidad > stock) {
      const restantes = stock - enCarrito
      let mensaje = mensajeMaximo(stock)
      if (enCarrito > 0) {
        mensaje += restantes > 0 ? `. Puedes agregar ${restantes} más.` : ' y ya están en tu carrito.'
      }
      return { ok: false, mensaje }
    }

    if (existente) {
      setItems((actuales) =>
        actuales.map((it) =>
          it.productoId === producto.id ? { ...it, cantidad: it.cantidad + cantidad, stock } : it
        )
      )
    } else {
      const nuevo = {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: precioFinal(producto),
        cantidad,
        imagen: producto.imagen,
        stock,
      }
      setItems((actuales) => [...actuales, nuevo])
    }
    return { ok: true, mensaje: `${producto.nombre} agregado al carrito` }
  }

  function quitar(productoId) {
    setItems((actuales) => actuales.filter((it) => it.productoId !== productoId))
  }

  // Cambia la cantidad de una línea. Si supera el stock se deja en el máximo y se avisa.
  function cambiarCantidad(productoId, cantidad) {
    if (cantidad <= 0) {
      quitar(productoId)
      return { ok: true, mensaje: 'Producto eliminado del carrito' }
    }

    const stock = stockDisponible(productoId)
    const permitida = Math.min(cantidad, stock)
    setItems((actuales) =>
      actuales.map((it) => (it.productoId === productoId ? { ...it, cantidad: permitida, stock } : it))
    )

    if (cantidad > stock) return { ok: false, mensaje: mensajeMaximo(stock) }
    return { ok: true, mensaje: '' }
  }

  function vaciar() {
    setItems([])
  }

  // Valores derivados: se calculan en cada render, no se guardan en el estado
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
