// DUEÑO: Maximiliano. Hook reutilizable: agrega un producto al carrito y guarda el aviso que se muestra en pantalla.
import { useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'

export default function useAgregarAlCarrito() {
  const { agregar } = useCart()
  const [aviso, setAviso] = useState(null)

  function agregarAlCarrito(producto) {
    const respuesta = agregar(producto, 1)
    setAviso({
      tipo: respuesta.ok ? 'success' : 'danger',
      mensaje: respuesta.ok ? `${producto.nombre} se agregó al carrito` : respuesta.mensaje,
    })
  }

  return { aviso, cerrarAviso: () => setAviso(null), agregarAlCarrito }
}
