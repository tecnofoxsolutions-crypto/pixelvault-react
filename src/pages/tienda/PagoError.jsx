// DUEÑO: Emanuel (HU-39). Página /compra/error: el pago fue rechazado. El carrito y el stock no se tocaron.
// El checkout manda el motivo y el detalle por el state de la navegación.
import { Link, useLocation } from 'react-router-dom'
import OrderSummaryTable from '../../components/compra/OrderSummaryTable.jsx'
import '../../components/carrito/carrito.css'

export default function PagoError() {
  const { state } = useLocation()
  const detalle = state?.detalle

  return (
    <div className="container py-4 py-md-5">
      <div className="alert alert-danger" role="alert">
        <h1 className="h4 alert-heading mb-1">No se pudo realizar el pago</h1>
        <p className="mb-0">
          <strong>Motivo:</strong> {state?.motivo ?? 'No hay información de un intento de pago reciente.'}
        </p>
        <p className="small mb-0 mt-2">Tu carrito sigue intacto y no se realizó ningún cobro.</p>
      </div>

      {detalle && (
        <div className="card card-resumen mb-4">
          <div className="card-body">
            <h2 className="h5 font-arcade text-info mb-3">Detalle de la compra</h2>
            <p className="mb-3">
              {detalle.cliente.nombre} {detalle.cliente.apellidos} · {detalle.cliente.correo}
              <br />
              <span className="text-secondary">
                {detalle.tipoEntrega === 'despacho' ? 'Despacho a' : 'Retiro en tienda · Dirección:'}{' '}
                {detalle.direccion.calle}, {detalle.direccion.comuna}, {detalle.direccion.region}
              </span>
            </p>
            <OrderSummaryTable
              items={detalle.items}
              subtotal={detalle.subtotal}
              despacho={detalle.despacho}
              total={detalle.total}
            />
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2">
        <Link to="/checkout" className="btn btn-primary btn-arcade">Volver a realizar el pago</Link>
        <Link to="/carrito" className="btn btn-outline-light">Revisar el carrito</Link>
      </div>
    </div>
  )
}
