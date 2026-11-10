// DUEÑO: Emanuel (HU-36). Página /carrito: revisar, modificar y vaciar el carrito.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import CartItemRow from '../../components/carrito/CartItemRow.jsx'
import CartSummary from '../../components/carrito/CartSummary.jsx'
import ConfirmModal from '../../components/carrito/ConfirmModal.jsx'
import '../../components/carrito/carrito.css'

export default function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar, total, cantidadItems } = useCart()
  const navigate = useNavigate()

  // Estado propio de la página: el aviso que se muestra y si el modal de "Limpiar" está abierto
  const [aviso, setAviso] = useState(null)
  const [confirmandoLimpiar, setConfirmandoLimpiar] = useState(false)

  function manejarCambioCantidad(productoId, nuevaCantidad) {
    const resultado = cambiarCantidad(productoId, nuevaCantidad)
    setAviso(resultado.ok ? null : { tipo: 'warning', mensaje: resultado.mensaje })
  }

  function manejarEliminar(productoId) {
    const item = items.find((it) => it.productoId === productoId)
    quitar(productoId)
    setAviso({ tipo: 'info', mensaje: `${item.nombre} se eliminó del carrito` })
  }

  function confirmarLimpiar() {
    vaciar()
    setConfirmandoLimpiar(false)
    setAviso({ tipo: 'info', mensaje: 'Se vació el carrito' })
  }

  return (
    <div className="container py-4 py-md-5">
      <h1 className="h3 font-arcade text-light mb-4">Carrito de compras</h1>

      <AlertMessage tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={() => setAviso(null)} />

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {items.length === 0 ? (
            <div className="card card-resumen text-center p-5">
              <p className="fs-5 mb-3">Tu carrito está vacío</p>
              <div>
                <Link to="/productos" className="btn btn-primary btn-arcade">
                  Ver productos
                </Link>
              </div>
            </div>
          ) : (
            <div className="table-responsive card card-resumen">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col" className="d-none d-sm-table-cell">Precio</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col" className="text-end">
                      <span className="visually-hidden">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <CartItemRow
                      key={item.productoId}
                      item={item}
                      onCambiarCantidad={manejarCambioCantidad}
                      onEliminar={manejarEliminar}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-12 col-lg-4">
          <CartSummary
            cantidadItems={cantidadItems}
            total={total}
            onComprar={() => navigate('/checkout')}
            onLimpiar={() => setConfirmandoLimpiar(true)}
          />
        </div>
      </div>

      <ConfirmModal
        mostrar={confirmandoLimpiar}
        titulo="Limpiar carrito"
        mensaje="¿Seguro que quieres quitar todos los productos del carrito?"
        textoConfirmar="Sí, vaciar"
        onConfirmar={confirmarLimpiar}
        onCancelar={() => setConfirmandoLimpiar(false)}
      />
    </div>
  )
}
