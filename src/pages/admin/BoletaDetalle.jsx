// DUEÑO: Emanuel (HU-45). Página /admin/ordenes/:numero: boleta completa y cambio de estado.
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import Boleta from '../../components/compra/Boleta.jsx'
import { ESTADOS_ORDEN } from '../../components/compra/ordenes.js'

function buscarOrden(numero) {
  return db.getAll('ordenes').find((o) => String(o.numero) === numero) ?? null
}

export default function BoletaDetalle() {
  const { numero } = useParams()
  const [orden, setOrden] = useState(() => buscarOrden(numero))
  const [nuevoEstado, setNuevoEstado] = useState(orden?.estado ?? '')
  const [aviso, setAviso] = useState(null)

  if (!orden) {
    return (
      <div className="text-center py-5">
        <h1 className="h3 text-light">Orden no encontrada</h1>
        <p className="text-secondary">No existe una orden con el número #{numero}.</p>
        <Link to="/admin/ordenes" className="btn btn-primary">Volver a órdenes</Link>
      </div>
    )
  }

  function guardarEstado(evento) {
    evento.preventDefault()
    const actualizada = db.update('ordenes', orden.id, { estado: nuevoEstado })
    // db.js no avisa a React: se guarda el resultado en el estado para volver a dibujar
    setOrden(actualizada)
    setAviso({ tipo: 'success', mensaje: `La orden #${orden.numero} quedó "${nuevoEstado}".` })
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 no-imprimir">
        <div>
          <h1 className="h3 text-light mb-0">Orden #{orden.numero}</h1>
          <Link to="/admin/ordenes" className="small">← Volver a órdenes</Link>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {orden.usuarioId && (
            <Link to={`/admin/usuarios/${orden.usuarioId}/compras`} className="btn btn-outline-light">
              Compras del cliente
            </Link>
          )}
          <button type="button" className="btn btn-outline-info" onClick={() => window.print()}>
            Imprimir boleta
          </button>
        </div>
      </div>

      <div className="no-imprimir">
        <AlertMessage tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={() => setAviso(null)} />
      </div>

      <form className="row g-2 align-items-end mb-4 no-imprimir" onSubmit={guardarEstado}>
        <div className="col-12 col-sm-6 col-lg-4">
          <label htmlFor="estadoOrden" className="form-label">Estado de la orden</label>
          <select
            id="estadoOrden"
            className="form-select"
            value={nuevoEstado}
            onChange={(evento) => setNuevoEstado(evento.target.value)}
          >
            {ESTADOS_ORDEN.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-auto">
          <button type="submit" className="btn btn-primary w-100" disabled={nuevoEstado === orden.estado}>
            Guardar estado
          </button>
        </div>
      </form>

      <Boleta orden={orden} />
    </>
  )
}
