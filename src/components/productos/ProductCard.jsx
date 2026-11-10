// DUEÑO: Maximiliano (HU-32). Tarjeta de un juego. Recibe el producto y la acción de agregar por props.
import { Link } from 'react-router-dom'
import PriceTag from './PriceTag.jsx'
import PlataformaBadge from './PlataformaBadge.jsx'

export default function ProductCard({ producto, onAgregar }) {
  const agotado = producto.stock <= 0

  return (
    <div className="card card-juego h-100">
      <Link to={`/productos/${producto.id}`}>
        <img src={producto.imagen} className="card-img-top card-juego-img" alt={producto.nombre} />
      </Link>
      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <PlataformaBadge plataforma={producto.plataforma} />
        </div>
        <h3 className="h6 card-title text-light">{producto.nombre}</h3>
        <div className="mt-auto">
          <PriceTag producto={producto} />
          <p className={`small mb-2 ${agotado ? 'text-danger' : 'text-secondary'}`}>
            {agotado ? 'Sin stock' : `Stock: ${producto.stock}`}
          </p>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-info btn-sm flex-fill" to={`/productos/${producto.id}`}>
              Ver detalle
            </Link>
            <button
              type="button"
              className="btn btn-success btn-sm flex-fill"
              disabled={agotado}
              onClick={() => onAgregar(producto)}
            >
              {agotado ? 'Agotado' : 'Añadir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
