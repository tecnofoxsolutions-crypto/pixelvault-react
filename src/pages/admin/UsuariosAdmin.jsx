// DUEÑO: Jim (tarjeta HU-49, reasignada desde Maximiliano). Listado de usuarios con búsqueda y filtro por rol.
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import db from '../../data/db.js'
import roles from '../../data/roles.js'
import { useAuth } from '../../context/AuthContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'

const claseRol = (rol) => roles.find((r) => r.nombre === rol)?.clase ?? 'text-bg-secondary'

export default function UsuariosAdmin() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario: sesion } = useAuth()

  const [usuarios, setUsuarios] = useState(() => db.getAll('usuarios'))
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [mensaje, setMensaje] = useState(location.state?.mensaje ?? '')

  // El mensaje de "creado/actualizado" se muestra una sola vez
  useEffect(() => {
    if (location.state?.mensaje) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])

  const texto = busqueda.trim().toLowerCase()
  const visibles = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre} ${u.apellidos}`.toLowerCase()
    const coincideTexto = !texto || nombreCompleto.includes(texto) || u.correo.toLowerCase().includes(texto) || u.rut.includes(texto)
    const coincideRol = !filtroRol || u.rol === filtroRol
    return coincideTexto && coincideRol
  })

  const esYo = (u) => String(u.id) === String(sesion?.id)

  function cambiarEstado(u) {
    db.update('usuarios', u.id, { activo: !u.activo })
    setUsuarios(db.getAll('usuarios'))
    setMensaje(`La cuenta de ${u.nombre} ${u.apellidos} quedó ${u.activo ? 'desactivada' : 'activa'}.`)
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 text-light mb-0">Usuarios</h1>
          <p className="text-secondary small mb-0">Mostrando {visibles.length} de {usuarios.length} usuarios</p>
        </div>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">+ Nuevo usuario</Link>
      </div>

      <AlertMessage tipo="success" mensaje={mensaje} onCerrar={() => setMensaje('')} />

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-7">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre, correo o RUT"
            aria-label="Buscar usuario"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-5">
          <select className="form-select" aria-label="Filtrar por rol" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
            <option value="">Todos los roles</option>
            {roles.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
          </select>
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">No hay usuarios que coincidan con la búsqueda.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col" className="d-none d-md-table-cell">RUT</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="fw-semibold">
                      {u.nombre} {u.apellidos}
                      {esYo(u) && <span className="badge text-bg-light ms-1">Tú</span>}
                    </div>
                    <div className="small text-secondary">{u.correo}</div>
                  </td>
                  <td className="d-none d-md-table-cell text-nowrap">{u.rut}</td>
                  <td><span className={`badge ${claseRol(u.rol)}`}>{u.rol}</span></td>
                  <td>
                    <span className={`badge ${u.activo ? 'text-bg-success' : 'text-bg-danger'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-info me-1">Editar</Link>
                    <Link to={`/admin/usuarios/${u.id}/compras`} className="btn btn-sm btn-outline-light me-1">Compras</Link>
                    <button
                      type="button"
                      className={`btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => cambiarEstado(u)}
                      disabled={esYo(u)}
                      title={esYo(u) ? 'No puedes desactivar tu propia cuenta' : undefined}
                    >
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
