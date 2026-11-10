// Seguimiento y comprobante de una orden con despacho a domicilio. Props: orden
// - En camino o asignada: muestra quién la lleva.
// - Entregada: foto del paquete, comentario del repartidor, quién y cuándo la entregó.
// Las órdenes de retiro en tienda no muestran nada.
import db from '../../data/db.js'
import { formatearFecha } from './ordenes.js'

export default function ComprobanteEntrega({ orden }) {
  if (orden.tipoEntrega !== 'despacho' || !orden.repartidorId) return null

  const repartidor = db.getById('usuarios', orden.repartidorId)
  const nombreRepartidor = repartidor ? `${repartidor.nombre} ${repartidor.apellidos}` : 'nuestro repartidor'

  if (orden.estado !== 'Entregada') {
    return (
      <section className="alert alert-info small mb-3">
        🚚 <strong>{nombreRepartidor}</strong> está a cargo de tu despacho
        {orden.estado === 'En camino' ? ' y ya va en camino.' : '.'}
      </section>
    )
  }

  const entrega = [...(orden.historialEstados ?? [])].reverse().find((h) => h.estado === 'Entregada')

  return (
    <section className="card card-neon mb-3">
      <div className="card-body">
        <h2 className="h6 text-success mb-3">📦 Comprobante de entrega</h2>
        <div className="row g-3 align-items-start">
          <div className="col-12 col-sm-5">
            {orden.fotoEntrega ? (
              <img src={orden.fotoEntrega} alt={`Paquete entregado de la orden ${orden.numero}`} className="img-fluid rounded border border-secondary" />
            ) : (
              <div className="ratio ratio-4x3 bg-black rounded border border-secondary">
                <span className="d-flex align-items-center justify-content-center text-secondary small">Sin foto registrada</span>
              </div>
            )}
          </div>
          <div className="col-12 col-sm-7 small">
            <p className="mb-1">
              Entregado por <strong className="text-light">{nombreRepartidor}</strong>
            </p>
            {entrega && <p className="text-secondary mb-2">{formatearFecha(entrega.fecha)}</p>}
            {orden.comentarioEntrega ? (
              <blockquote className="border-start border-3 border-info ps-2 mb-0 fst-italic">“{orden.comentarioEntrega}”</blockquote>
            ) : (
              <p className="text-secondary mb-0">El repartidor no dejó comentarios.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
