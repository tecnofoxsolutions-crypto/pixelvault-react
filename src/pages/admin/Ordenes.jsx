// DUEÑO: Emanuel (HU-45). Página /admin/ordenes: todas las órdenes con filtro por estado y búsqueda por cliente.
import { useState } from 'react'
import db from '../../data/db.js'
import OrdersTable from '../../components/compra/OrdersTable.jsx'
import { ESTADOS_ORDEN, ordenarPorFecha } from '../../components/compra/ordenes.js'
import { formatoCLP } from '../../utils/formatoCLP.js'

// ¿La orden coincide con el texto buscado? Busca en nombre, apellidos, correo y número.
function coincideBusqueda(orden, texto) {
  const buscado = texto.trim().toLowerCase()
  if (!buscado) return true
  const { nombre, apellidos, correo } = orden.cliente
  return [`${nombre} ${apellidos}`, correo, String(orden.numero)].some((valor) => valor.toLowerCase().includes(buscado))
}

export default function Ordenes() {
  // Se lee una vez al entrar a la página; el detalle es el que modifica el estado
  const [ordenes] = useState(() => ordenarPorFecha(db.getAll('ordenes')))
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroEntrega, setFiltroEntrega] = useState('')

  const visibles = ordenes.filter(
    (orden) =>
      (!filtroEstado || orden.estado === filtroEstado) &&
      (!filtroEntrega || orden.tipoEntrega === filtroEntrega) &&
      coincideBusqueda(orden, busqueda)
  )
  const totalVisibles = visibles.reduce((suma, orden) => suma + orden.total, 0)

  return (
    <>
      <div className="encabezado-panel mb-3">
        <h1 className="h3 text-light mb-0">Órdenes</h1>
        <p className="text-secondary small mb-0">
          Mostrando {visibles.length} de {ordenes.length} órdenes · Total {formatoCLP(totalVisibles)}
        </p>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-5">
          <label htmlFor="busquedaOrden" className="visually-hidden">Buscar por cliente</label>
          <input
            id="busquedaOrden"
            type="search"
            className="form-control"
            placeholder="Buscar por cliente, correo o número…"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </div>
        <div className="col-6 col-md-4">
          <label htmlFor="filtroEstado" className="visually-hidden">Filtrar por estado</label>
          <select
            id="filtroEstado"
            className="form-select"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS_ORDEN.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="filtroEntrega" className="visually-hidden">Filtrar por tipo de entrega</label>
          <select
            id="filtroEntrega"
            className="form-select"
            value={filtroEntrega}
            onChange={(evento) => setFiltroEntrega(evento.target.value)}
          >
            <option value="">Despacho y retiro</option>
            <option value="despacho">🚚 Solo despacho</option>
            <option value="retiro">🏪 Solo retiro</option>
          </select>
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">
          {ordenes.length === 0 ? 'Todavía no hay órdenes.' : 'Ninguna orden coincide con el filtro.'}
        </div>
      ) : (
        <OrdersTable ordenes={visibles} rutaDetalle={(orden) => `/admin/ordenes/${orden.numero}`} />
      )}
    </>
  )
}
