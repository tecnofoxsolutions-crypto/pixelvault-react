// DUEÑO: Maximiliano (tarjeta TEC-03). Barra superior de todas las páginas de la tienda.
// Escritorio (≥ 992 px): fila 1 = logo, buscador, carrito y sesión; fila 2 = enlaces.
// Móvil (< 992 px): logo + botón hamburguesa; al abrirlo se ven enlaces, buscador, carrito y sesión.
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { formatoCLP } from '../../utils/formatoCLP.js'
import BuscadorProductos from '../productos/BuscadorProductos.jsx'
import MenuCategorias from '../productos/MenuCategorias.jsx'

const enlacesAntes = [
  { to: '/', texto: 'Home', exacto: true },
  { to: '/productos', texto: 'Productos' },
]
const enlacesDespues = [
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blog', texto: 'Blog' },
  { to: '/contacto', texto: 'Contacto' },
]

// Buscador + botón Carrito + botones de sesión. Se usa dos veces: en escritorio y dentro del menú móvil.
function AccionesNavbar({ alNavegar }) {
  const { usuario, logout } = useAuth()
  const { total, cantidadItems } = useCart()
  const navigate = useNavigate()

  function cerrarSesion() {
    logout()
    alNavegar()
    navigate('/')
  }

  return (
    <div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center">
      <BuscadorProductos onBuscar={alNavegar} />
      <div className="d-flex flex-wrap gap-2 align-items-center text-nowrap">
        <Link className="btn btn-success btn-sm" to="/carrito" onClick={alNavegar}>
          Carrito {formatoCLP(total)}
          {cantidadItems > 0 && <span className="badge bg-light text-dark ms-1">{cantidadItems}</span>}
        </Link>
        {usuario ? (
          <>
            <span className="text-secondary small">Hola, {usuario.nombre}</span>
            <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-info btn-sm" to="/login" onClick={alNavegar}>Iniciar sesión</Link>
            <Link className="btn btn-primary btn-sm" to="/registro" onClick={alNavegar}>Crear cuenta</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function Navbar() {
  const { usuario, tieneRol } = useAuth()
  // Estado del menú hamburguesa (solo se ve bajo 992 px por navbar-expand-lg)
  const [menuAbierto, setMenuAbierto] = useState(false)

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  function dibujarEnlaces(lista) {
    return lista.map((enlace) => (
      <li className="nav-item" key={enlace.to}>
        <NavLink className="nav-link" to={enlace.to} end={enlace.exacto} onClick={cerrarMenu}>
          {enlace.texto}
        </NavLink>
      </li>
    ))
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-steam sticky-top">
      <div className="container flex-wrap">
        <Link className="navbar-brand" to="/" onClick={cerrarMenu}>
          Pixel<span>Vault</span>
        </Link>

        {/* Fila 1 en escritorio */}
        <div className="d-none d-lg-flex ms-auto">
          <AccionesNavbar alNavegar={cerrarMenu} />
        </div>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="menuPrincipal"
          aria-expanded={menuAbierto}
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Fila 2 en escritorio / menú desplegable en móvil */}
        <div className={`collapse navbar-collapse w-100 ${menuAbierto ? 'show' : ''}`} id="menuPrincipal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {dibujarEnlaces(enlacesAntes)}
            <MenuCategorias onElegir={cerrarMenu} />
            {dibujarEnlaces(enlacesDespues)}
            {usuario && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/mis-compras" onClick={cerrarMenu}>Mis compras</NavLink>
              </li>
            )}
            {tieneRol('Administrador') && (
              <li className="nav-item">
                <NavLink className="nav-link text-warning" to="/admin" onClick={cerrarMenu}>Admin</NavLink>
              </li>
            )}
          </ul>
          <div className="d-lg-none pb-2">
            <AccionesNavbar alNavegar={cerrarMenu} />
          </div>
        </div>
      </div>
    </nav>
  )
}
