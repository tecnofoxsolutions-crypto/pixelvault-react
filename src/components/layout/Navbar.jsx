// DUEÑO: Maximiliano (tarjeta TEC-03). Versión básica del esqueleto: falta el buscador y el desplegable de categorías.
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { formatoCLP } from '../../utils/formatoCLP.js'

const enlaces = [
  { to: '/', texto: 'Home', exacto: true },
  { to: '/productos', texto: 'Productos' },
  { to: '/categorias', texto: 'Categorías' },
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blog', texto: 'Blog' },
  { to: '/contacto', texto: 'Contacto' },
]

export default function Navbar() {
  const { usuario, logout, tieneRol } = useAuth()
  const { total } = useCart()
  const navigate = useNavigate()

  function cerrarSesion() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">PixelVault</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {enlaces.map((enlace) => (
              <li className="nav-item" key={enlace.to}>
                <NavLink className="nav-link" to={enlace.to} end={enlace.exacto}>
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
            {usuario && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/mis-compras">Mis compras</NavLink>
              </li>
            )}
            {tieneRol('Administrador') && (
              <li className="nav-item">
                <NavLink className="nav-link text-warning" to="/admin">Admin</NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Link className="btn btn-success btn-sm" to="/carrito">
              Carrito {formatoCLP(total)}
            </Link>
            {usuario ? (
              <>
                <span className="text-secondary small">Hola, {usuario.nombre}</span>
                <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-info btn-sm" to="/login">Iniciar sesión</Link>
                <Link className="btn btn-primary btn-sm" to="/registro">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
