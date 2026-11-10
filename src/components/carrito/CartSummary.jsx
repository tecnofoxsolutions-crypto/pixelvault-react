// DUEÑO: Emanuel (HU-36). Tarjeta con el resumen del carrito y los botones de acción.
// Props: cantidadItems, total, onComprar(), onLimpiar()
import { Link } from 'react-router-dom'
import { formatoCLP } from '../../utils/formatoCLP.js'

export default function CartSummary({ cantidadItems, total, onComprar, onLimpiar }) {
  const vacio = cantidadItems === 0

  return (
    <div className="card card-resumen shadow">
      <div className="card-body">
        <h2 className="h5 font-arcade text-info mb-3">Resumen</h2>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">Productos</span>
          <span>{cantidadItems} {cantidadItems === 1 ? 'unidad' : 'unidades'}</span>
        </div>
        <div className="d-flex justify-content-between border-top border-secondary pt-2 mb-1">
          <span className="fw-bold">Total</span>
          <span className="fs-4 fw-bold text-info">{formatoCLP(total)}</span>
        </div>
        <p className="small text-secondary mb-3">El despacho se elige en el siguiente paso.</p>

        <div className="d-grid gap-2">
          <button type="button" className="btn btn-primary btn-arcade py-2" onClick={onComprar} disabled={vacio}>
            Comprar ahora
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={onLimpiar} disabled={vacio}>
            Limpiar carrito
          </button>
          <Link to="/productos" className="btn btn-link text-secondary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
