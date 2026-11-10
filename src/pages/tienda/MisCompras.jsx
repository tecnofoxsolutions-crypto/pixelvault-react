// DUEÑO: Emanuel (HU-43). Página /mis-compras: órdenes del cliente con sesión.
// El detalle se abre en la misma página con ?orden=<numero> y reutiliza la boleta de HU-38.
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import db from '../../data/db.js'
import Boleta from '../../components/compra/Boleta.jsx'
import OrdersTable from '../../components/compra/OrdersTable.jsx'
import { ordenarPorFecha } from '../../components/compra/ordenes.js'
import { formatoCLP } from '../../utils/formatoCLP.js'

export default function MisCompras() {
  // La ruta está protegida: si llegamos aquí siempre hay usuario
  const { usuario } = useAuth()
  const [parametros] = useSearchParams()
  const numeroElegido = parametros.get('orden')

  // Solo las órdenes de este usuario
  const misOrdenes = ordenarPorFecha(db.getAll('ordenes').filter((o) => String(o.usuarioId) === String(usuario.id)))
  const totalComprado = misOrdenes.reduce((suma, o) => suma + o.total, 0)

  if (numeroElegido) {
    const orden = misOrdenes.find((o) => String(o.numero) === numeroElegido)
    return (
      <div className="container py-4 py-md-5">
        <Link to="/mis-compras" className="d-inline-block mb-3 no-imprimir">← Volver a mis compras</Link>
        {orden ? (
          <>
            <Boleta orden={orden} />
            <button type="button" className="btn btn-primary btn-arcade mt-4 no-imprimir" onClick={() => window.print()}>
              Imprimir boleta
            </button>
          </>
        ) : (
          <div className="alert alert-warning">Orden no encontrada en tus compras.</div>
        )}
      </div>
    )
  }

  return (
    <div className="container py-4 py-md-5">
      <h1 className="h3 font-arcade text-light mb-1">Mis compras</h1>
      <p className="text-secondary small mb-4">
        {misOrdenes.length} {misOrdenes.length === 1 ? 'compra' : 'compras'} · Total {formatoCLP(totalComprado)}
      </p>

      {misOrdenes.length === 0 ? (
        <div className="card card-juego p-5 text-center">
          <p className="fs-5 mb-3">Todavía no tienes compras</p>
          <div>
            <Link to="/productos" className="btn btn-primary btn-arcade">Ver productos</Link>
          </div>
        </div>
      ) : (
        <OrdersTable
          ordenes={misOrdenes}
          mostrarCliente={false}
          rutaDetalle={(orden) => `/mis-compras?orden=${orden.numero}`}
        />
      )}
    </div>
  )
}
