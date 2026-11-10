// Página /admin/ordenes/:numero: boleta completa y avance de la orden por su flujo de estados.
// Creada por Emanuel (HU-45); el cambio de estado por lista se reemplazó por el botón "siguiente paso" (CF-10).
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import { useAuth } from '../../context/AuthContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import Boleta from '../../components/compra/Boleta.jsx'
import AccionesOrden from '../../components/compra/AccionesOrden.jsx'
import HistorialEstados from '../../components/compra/HistorialEstados.jsx'

function buscarOrden(numero) {
  return db.getAll('ordenes').find((o) => String(o.numero) === numero) ?? null
}

export default function BoletaDetalle() {
  const { numero } = useParams()
  const { usuario } = useAuth()
  const [orden, setOrden] = useState(() => buscarOrden(numero))
  const [aviso, setAviso] = useState('')

  if (!orden) {
    return (
      <div className="text-center py-5">
        <h1 className="h3 text-light">Orden no encontrada</h1>
        <p className="text-secondary">No existe una orden con el código {numero}.</p>
        <Link to="/admin/ordenes" className="btn btn-primary">Volver a órdenes</Link>
      </div>
    )
  }

  const repartidor = orden.repartidorId ? db.getById('usuarios', orden.repartidorId) : null

  // db.js no avisa a React: se guarda la orden actualizada en el estado para volver a dibujar
  function alCambiar(actualizada, mensaje) {
    setOrden(actualizada)
    setAviso(mensaje)
  }

  return (
    <>
      <div className="encabezado-panel d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 no-imprimir">
        <div>
          <h1 className="h3 text-light mb-0">Orden {orden.numero}</h1>
          <Link to="/admin/ordenes" className="small">← Volver a órdenes</Link>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {orden.usuarioId && usuario?.rol === 'Administrador' && (
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
        <AlertMessage tipo="success" mensaje={aviso} onCerrar={() => setAviso('')} />

        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-6">
            <div className="card card-juego h-100">
              <div className="card-body">
                <h2 className="h6 text-info mb-3">Avanzar la orden</h2>
                <AccionesOrden orden={orden} usuario={usuario} onCambio={alCambiar} />
                {repartidor && (
                  <p className="small text-secondary mt-3 mb-0">
                    Repartidor asignado: <strong className="text-light">{repartidor.nombre} {repartidor.apellidos}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card card-juego h-100">
              <div className="card-body">
                <h2 className="h6 text-info mb-3">Historial de estados</h2>
                <HistorialEstados orden={orden} />
                {/* La foto y el comentario de la entrega se ven en la boleta (ComprobanteEntrega) */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Boleta orden={orden} />
    </>
  )
}
