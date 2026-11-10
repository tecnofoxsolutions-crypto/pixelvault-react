// DUEÑO: Jim (tarjeta HU-44).
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const secciones = [
  { to: '/admin', texto: 'Dashboard', exacto: true },
  { to: '/admin/ordenes', texto: 'Órdenes' },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/categorias', texto: 'Categorías' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
  { to: '/admin/reportes', texto: 'Reportes' },
  { to: '/admin/perfil', texto: 'Perfil' },
]

export default function AdminSidebar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <div className="fw-bold text-light">PixelVault Admin</div>
        <div className="small text-secondary">{usuario?.nombre} · {usuario?.rol}</div>
      </div>
      <nav className="nav nav-pills flex-md-column flex-row flex-wrap gap-1">
        {secciones.map((s) => (
          <NavLink key={s.to} to={s.to} end={s.exacto} className="nav-link py-1">
            {s.texto}
          </NavLink>
        ))}
      </nav>
      <div className="d-flex flex-md-column gap-2">
        <Link to="/" className="btn btn-outline-light btn-sm">Ir a la tienda</Link>
        <button className="btn btn-danger btn-sm" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </div>
  )
}
