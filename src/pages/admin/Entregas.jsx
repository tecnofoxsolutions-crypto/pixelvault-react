// DUEÑO: Jim (CF-12). Página /admin/entregas, solo para el rol Repartidor:
// sus órdenes asignadas, con los botones "Iniciar ruta" y "Marcar entregada" (con foto).
import { useState } from 'react'
import db from '../../data/db.js'
import { useAuth } from '../../context/AuthContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import AccionesOrden from '../../components/compra/AccionesOrden.jsx'
import EstadoBadge from '../../components/compra/EstadoBadge.jsx'
import { formatearFecha, ordenarPorFecha } from '../../components/compra/ordenes.js'

const PENDIENTES = ['Asignado a repartidor', 'En camino']

export default function Entregas() {
  const { usuario } = useAuth()
  const leerMias = () => ordenarPorFecha(db.getAll('ordenes').filter((o) => String(o.repartidorId) === String(usuario.id)))

  const [ordenes, setOrdenes] = useState(leerMias)
  const [pestana, setPestana] = useState('pendientes')
  const [aviso, setAviso] = useState('')

  const pendientes = ordenes.filter((o) => PENDIENTES.includes(o.estado))
  const entregadas = ordenes.filter((o) => o.estado === 'Entregada')
  const visibles = pestana === 'pendientes' ? pendientes : entregadas

  function alCambiar(_actualizada, mensaje) {
    setOrdenes(leerMias())
    setAviso(mensaje)
  }

  return (
    <div>
      <h1 className="h3 text-light mb-1">Mis entregas</h1>
      <p className="text-secondary small mb-3">Pedidos que te asignaron. Inicia la ruta al salir y marca la entrega con una foto del paquete.</p>

      <AlertMessage tipo="success" mensaje={aviso} onCerrar={() => setAviso('')} />

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button type="button" className={`nav-link ${pestana === 'pendientes' ? 'active' : ''}`} onClick={() => setPestana('pendientes')}>
            Pendientes <span className="badge text-bg-warning ms-1">{pendientes.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link ${pestana === 'entregadas' ? 'active' : ''}`} onClick={() => setPestana('entregadas')}>
            Entregadas <span className="badge text-bg-success ms-1">{entregadas.length}</span>
          </button>
        </li>
      </ul>

      {visibles.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">
          {pestana === 'pendientes' ? 'No tienes entregas pendientes. 🎉' : 'Todavía no has completado entregas.'}
        </div>
      ) : (
        <div className="row g-3">
          {visibles.map((orden) => (
            <div className="col-12 col-lg-6" key={orden.id}>
              <article className="card card-juego h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <h2 className="h5 text-light mb-0">{orden.numero}</h2>
                      <div className="small text-secondary">{formatearFecha(orden.fecha)}</div>
                    </div>
                    <EstadoBadge estado={orden.estado} />
                  </div>

                  <p className="mb-1">
                    <strong>{orden.cliente.nombre} {orden.cliente.apellidos}</strong>
                  </p>
                  <p className="small mb-1">
                    📍 {orden.direccion.calle}{orden.direccion.depto && `, depto ${orden.direccion.depto}`} · {orden.direccion.comuna}
                  </p>
                  {orden.direccion.indicaciones && (
                    <p className="small text-warning mb-1">📝 {orden.direccion.indicaciones}</p>
                  )}
                  <ul className="small text-secondary mb-3 ps-3">
                    {orden.items.map((item) => (
                      <li key={item.productoId}>{item.cantidad} × {item.nombre}</li>
                    ))}
                  </ul>

                  {orden.estado === 'Entregada' ? (
                    orden.fotoEntrega ? (
                      <img src={orden.fotoEntrega} alt={`Entrega de ${orden.numero}`} className="rounded border border-secondary img-fluid" style={{ maxHeight: 160 }} />
                    ) : (
                      <p className="small text-secondary mb-0">Entregada (sin foto registrada).</p>
                    )
                  ) : (
                    <AccionesOrden orden={orden} usuario={usuario} onCambio={alCambiar} />
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
