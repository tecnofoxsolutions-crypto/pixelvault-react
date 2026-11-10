// DUEÑO: Jim (CF-13). Página /admin/blog: artículos del blog con crear, editar y eliminar (Editor y Administrador).
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import db from '../../data/db.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'

export default function BlogAdmin() {
  const location = useLocation()
  const navigate = useNavigate()

  const [articulos, setArticulos] = useState(() => db.getAll('blog'))
  const [busqueda, setBusqueda] = useState('')
  const [aEliminar, setAEliminar] = useState(null)
  const [mensaje, setMensaje] = useState(location.state?.mensaje ?? '')

  // El mensaje de "publicado/actualizado" se muestra una sola vez
  useEffect(() => {
    if (location.state?.mensaje) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])

  const texto = busqueda.trim().toLowerCase()
  const visibles = articulos
    .filter((a) => !texto || a.titulo.toLowerCase().includes(texto) || a.autor.toLowerCase().includes(texto))
    .sort((a, b) => b.id - a.id)

  function confirmarEliminacion() {
    db.remove('blog', aEliminar.id)
    setArticulos(db.getAll('blog'))
    setMensaje(`Artículo "${aEliminar.titulo}" eliminado.`)
    setAEliminar(null)
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 text-light mb-0">Blog</h1>
          <p className="text-secondary small mb-0">{articulos.length} artículos publicados</p>
        </div>
        <Link to="/admin/blog/nuevo" className="btn btn-primary">+ Nuevo artículo</Link>
      </div>

      <AlertMessage tipo="success" mensaje={mensaje} onCerrar={() => setMensaje('')} />

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Buscar por título o autor"
        aria-label="Buscar artículo"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {visibles.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">No hay artículos que coincidan.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Artículo</th>
                <th scope="col" className="d-none d-md-table-cell">Autor</th>
                <th scope="col" className="d-none d-lg-table-cell">Fecha</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={a.imagen} alt="" width="64" height="36" className="rounded object-fit-cover flex-shrink-0" />
                      <div>
                        <div className="fw-semibold">{a.titulo}</div>
                        <span className={`badge ${a.badgeColor}`}>{a.nombreCategoria}</span>
                      </div>
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell">{a.autor}</td>
                  <td className="d-none d-lg-table-cell text-nowrap">{a.fecha}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/blog/${a.id}`} className="btn btn-sm btn-outline-light me-1">Ver</Link>
                    <Link to={`/admin/blog/${a.id}/editar`} className="btn btn-sm btn-outline-info me-1">Editar</Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setAEliminar(a)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        abierto={aEliminar !== null}
        titulo="Eliminar artículo"
        mensaje={aEliminar && <>¿Seguro que quieres eliminar <strong>{aEliminar.titulo}</strong>? Dejará de verse en el blog.</>}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  )
}
