// DUEÑO: Emanuel (HU-50). Página /admin/usuarios/:id/compras: compras de un usuario y su total acumulado.
import { Link, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import OrdersTable from '../../components/compra/OrdersTable.jsx'
import { ordenarPorFecha } from '../../components/compra/ordenes.js'
import { formatoCLP } from '../../utils/formatoCLP.js'

export default function HistorialUsuario() {
  const { id } = useParams()
  const usuario = db.getById('usuarios', id)

  if (!usuario) {
    return (
      <div className="text-center py-5">
        <h1 className="h3 text-light">Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-primary">Volver a usuarios</Link>
      </div>
    )
  }

  const ordenes = ordenarPorFecha(db.getAll('ordenes').filter((o) => String(o.usuarioId) === String(usuario.id)))
  const totalAcumulado = ordenes.reduce((suma, o) => suma + o.total, 0)

  return (
    <>
      <div className="encabezado-panel mb-3">
        <Link to="/admin/usuarios" className="small">← Volver a usuarios</Link>
        <h1 className="h3 text-light mb-0 mt-1">
          Compras de {usuario.nombre} {usuario.apellidos}
        </h1>
        <p className="text-secondary small mb-0">
          {usuario.correo} · {usuario.rol}
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-3">
          <div className="card card-juego p-3 h-100">
            <div className="small text-secondary">Compras</div>
            <div className="fs-4 fw-bold">{ordenes.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-3">
          <div className="card card-juego p-3 h-100">
            <div className="small text-secondary">Total acumulado</div>
            <div className="fs-4 fw-bold text-info">{formatoCLP(totalAcumulado)}</div>
          </div>
        </div>
      </div>

      {ordenes.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">Este usuario aún no tiene compras.</div>
      ) : (
        <OrdersTable
          ordenes={ordenes}
          mostrarCliente={false}
          rutaDetalle={(orden) => `/admin/ordenes/${orden.numero}`}
        />
      )}
    </>
  )
}
