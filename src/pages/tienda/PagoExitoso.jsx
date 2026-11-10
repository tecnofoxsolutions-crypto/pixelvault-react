// DUEÑO: Emanuel (HU-38). Página /compra/exito/:numero: confirmación y boleta de la compra.
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import db from '../../data/db.js'
import Boleta from '../../components/compra/Boleta.jsx'
import { formatoCLP } from '../../utils/formatoCLP.js'

export default function PagoExitoso() {
  const { numero } = useParams()
  const { usuario } = useAuth()
  const orden = db.getAll('ordenes').find((o) => String(o.numero) === numero)

  if (!orden) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 text-light mb-3">Orden no encontrada</h1>
        <p className="text-secondary">No existe una compra con el número #{numero}.</p>
        <Link to="/productos" className="btn btn-primary btn-arcade">Ir a productos</Link>
      </div>
    )
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="alert alert-success no-imprimir" role="status">
        <h1 className="h4 alert-heading mb-1">Se ha realizado la compra nro #{orden.numero}</h1>
        <p className="mb-0">
          Código de orden: <strong>{orden.numero}</strong> · Total pagado: <strong>{formatoCLP(orden.total)}</strong>
        </p>
      </div>

      <Boleta orden={orden} />

      <div className="d-flex flex-wrap gap-2 mt-4 no-imprimir">
        <button type="button" className="btn btn-primary btn-arcade" onClick={() => window.print()}>
          Imprimir boleta
        </button>
        <Link to="/productos" className="btn btn-outline-light">Seguir comprando</Link>
        {usuario && <Link to="/mis-compras" className="btn btn-outline-info">Ver mis compras</Link>}
      </div>
    </div>
  )
}
