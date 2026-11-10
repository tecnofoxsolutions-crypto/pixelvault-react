// DUEÑO: Emanuel (HU-38). Boleta de una orden. Se reutiliza en pago exitoso, mis compras y el admin de órdenes.
// Props: orden (objeto orden de db.js)
import OrderSummaryTable from './OrderSummaryTable.jsx'
import EstadoBadge from './EstadoBadge.jsx'
import { formatearFecha } from './ordenes.js'
import '../carrito/carrito.css'
import './boleta.css'

export default function Boleta({ orden }) {
  const { cliente, direccion } = orden
  const esDespacho = orden.tipoEntrega === 'despacho'

  return (
    <article className="boleta card card-resumen">
      <div className="card-body p-3 p-md-4">
        <header className="d-flex flex-wrap justify-content-between align-items-start gap-2 border-bottom border-secondary pb-3 mb-3">
          <div>
            <div className="h5 font-arcade mb-1">
              <span className="text-info">Pixel</span>Vault
            </div>
            <div className="small text-secondary">Boleta electrónica · Tienda de videojuegos físicos</div>
          </div>
          <div className="text-md-end">
            <div className="fw-bold">Orden {orden.numero}</div>
            <div className="small text-secondary">{formatearFecha(orden.fecha)}</div>
            <EstadoBadge estado={orden.estado} />
          </div>
        </header>

        <div className="row g-3 mb-3">
          <section className="col-12 col-md-6">
            <h2 className="h6 text-info">Cliente</h2>
            <p className="mb-0">
              {cliente.nombre} {cliente.apellidos}
              <br />
              <span className="text-secondary">{cliente.correo}</span>
            </p>
          </section>
          <section className="col-12 col-md-6">
            <h2 className="h6 text-info">{esDespacho ? 'Despacho a domicilio' : 'Retiro en tienda'}</h2>
            <p className="mb-0">
              {direccion.calle}
              {direccion.depto && `, ${direccion.depto}`}
              <br />
              {direccion.comuna}, {direccion.region}
              {direccion.indicaciones && (
                <>
                  <br />
                  <span className="small text-secondary">Indicaciones: {direccion.indicaciones}</span>
                </>
              )}
            </p>
          </section>
        </div>

        <OrderSummaryTable
          items={orden.items}
          subtotal={orden.subtotal}
          despacho={orden.despacho}
          total={orden.total}
          textoTotal="Total pagado"
        />
      </div>
    </article>
  )
}
