// DUEÑO: Jim (tarjeta HU-44). Muestra solo las secciones del rol del usuario (CF-11, data/permisos.js).
// En escritorio el menú siempre se ve. En móvil se abre y cierra con el botón "Menú" (estado `abierto`).
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { seccionesPara } from '../../data/permisos.js'

export default function AdminSidebar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-bold text-light font-arcade small"><span className="text-info">Pixel</span>Vault <span className="text-warning">Staff</span></div>
          <div className="small text-secondary">{usuario?.nombre} · {usuario?.rol}</div>
        </div>
        <button
          type="button"
          className="btn btn-outline-light btn-sm d-md-none"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          aria-controls="menuAdmin"
        >
          {abierto ? '✕ Cerrar' : '☰ Menú'}
        </button>
      </div>

      <div id="menuAdmin" className={`${abierto ? 'd-block' : 'd-none'} d-md-block mt-3`}>
        <nav className="nav nav-pills flex-column gap-1 mb-3">
          {seccionesPara(usuario).map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.exacto}
              className="nav-link py-2"
              onClick={() => setAbierto(false)}
            >
              <span className="me-2" aria-hidden="true">{s.icono}</span>{s.texto}
            </NavLink>
          ))}
        </nav>
        <div className="d-grid gap-2">
          <Link to="/" className="btn btn-outline-light btn-sm">🏪 Ir a la tienda</Link>
          <button className="btn btn-danger btn-sm" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  )
}
