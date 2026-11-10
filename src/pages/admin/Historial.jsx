// DUEÑO: Jim (CF-14). Página /admin/historial, solo Administrador: bitácora de todo lo que pasa en la página.
// Los movimientos se registran solos desde db.js (cada create, update y remove) y en el inicio/cierre de sesión.
import { useState } from 'react'
import db from '../../data/db.js'
import { CATEGORIAS_MOVIMIENTO } from '../../utils/movimientos.js'
import { formatearFecha } from '../../components/compra/ordenes.js'

const colorCategoria = {
  Sesión: 'text-bg-secondary',
  Órdenes: 'text-bg-success',
  Productos: 'text-bg-primary',
  Categorías: 'text-bg-info',
  Usuarios: 'text-bg-warning',
  Blog: 'text-bg-light',
  Contacto: 'text-bg-dark border',
  Sistema: 'text-bg-danger',
}

const POR_PAGINA = 25

export default function Historial() {
  const [movimientos] = useState(() => db.getAll('movimientos').slice().reverse())
  const [categoria, setCategoria] = useState('')
  const [usuario, setUsuario] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [mostrar, setMostrar] = useState(POR_PAGINA)

  const usuarios = [...new Set(movimientos.map((m) => m.usuarioNombre))].sort()
  const texto = busqueda.trim().toLowerCase()
  const visibles = movimientos.filter(
    (m) =>
      (!categoria || m.categoria === categoria) &&
      (!usuario || m.usuarioNombre === usuario) &&
      (!texto || `${m.accion} ${m.detalle}`.toLowerCase().includes(texto))
  )

  return (
    <div>
      <h1 className="h3 text-light mb-1">📜 Historial de movimientos</h1>
      <p className="text-secondary small mb-3">
        Bitácora de la plataforma: compras, cambios de estado, inventario, usuarios, blog y sesiones. {visibles.length} de {movimientos.length} movimientos.
      </p>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-5">
          <input type="search" className="form-control" placeholder="Buscar en acción o detalle" aria-label="Buscar movimiento" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" aria-label="Filtrar por categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS_MOVIMIENTO.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-6 col-md-4">
          <select className="form-select" aria-label="Filtrar por usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)}>
            <option value="">Todos los usuarios</option>
            {usuarios.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">No hay movimientos con esos filtros.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-dark table-sm table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Acción</th>
                  <th scope="col" className="d-none d-md-table-cell">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {visibles.slice(0, mostrar).map((m) => (
                  <tr key={m.id}>
                    <td className="small text-nowrap text-secondary">{formatearFecha(m.fecha)}</td>
                    <td><span className={`badge ${colorCategoria[m.categoria] ?? 'text-bg-secondary'}`}>{m.categoria}</span></td>
                    <td>
                      <div className="fw-semibold">{m.accion}</div>
                      <div className="small text-secondary">{m.detalle}</div>
                      <div className="small text-info d-md-none">{m.usuarioNombre} · {m.rol}</div>
                    </td>
                    <td className="d-none d-md-table-cell small">
                      {m.usuarioNombre}
                      <div className="text-secondary">{m.rol}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {mostrar < visibles.length && (
            <div className="text-center">
              <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setMostrar(mostrar + POR_PAGINA)}>
                Ver más ({visibles.length - mostrar} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
