// Barra superior de todas las páginas de la tienda. Creada por Maximiliano (TEC-03).
// Escritorio (≥ 992 px): fila 1 = logo, buscador, carrito y sesión; fila 2 = enlaces.
// Móvil (< 992 px): logo + botón hamburguesa; al abrirlo se ven enlaces, buscador, carrito y sesión.
// CF-02: "Productos" es un desplegable con Ofertas y Categorías. CF-03: el carrito solo aparece si tiene productos.
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { formatoCLP } from '../../utils/formatoCLP.js'
import BuscadorProductos from '../productos/BuscadorProductos.jsx'
import MenuProductos from '../productos/MenuProductos.jsx'

const enlacesAntes = [{ to: '/', texto: 'Home', exacto: true }]
const enlacesDespues = [
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blog', texto: 'Blog' },
  { to: '/contacto', texto: 'Contacto' },
]

// Buscador + botón Carrito + botones de sesión. Se usa dos veces: en escritorio y dentro del menú móvil.
// Todo va en altura "sm" y alineado al centro para que se vea como un solo bloque:
// [buscador] | [carrito] [👤 nombre ⏻]   o, sin sesión,   [buscador] | [Iniciar sesión] [Registrarse]
function AccionesNavbar({ alNavegar }) {
  const { usuario, logout, esStaff } = useAuth()
  const { total, cantidadItems } = useCart()
  const navigate = useNavigate()

  function cerrarSesion() {
    logout()
    alNavegar()
    navigate('/')
  }

  return (
    <div className="acciones-navbar">
      <BuscadorProductos onBuscar={alNavegar} />
      <span className="separador-navbar d-none d-lg-block" aria-hidden="true" />
      <div className="d-flex flex-wrap gap-2 align-items-center text-nowrap">
        {cantidadItems > 0 && (
          <Link className="btn btn-success btn-sm d-inline-flex align-items-center gap-1" to="/carrito" onClick={alNavegar}>
            🛒 {formatoCLP(total)}
            <span className="badge bg-light text-dark">{cantidadItems}</span>
          </Link>
        )}
        {usuario ? (
          // Nombre y cerrar sesión unidos en un solo grupo de botones
          <div className="btn-group btn-group-sm" role="group" aria-label="Tu cuenta">
            <Link
              className="btn btn-outline-light chip-usuario"
              to={esStaff ? '/admin/perfil' : '/mis-compras'}
              onClick={alNavegar}
              title={esStaff ? 'Mi perfil' : 'Mis compras'}
            >
              👤 {usuario.nombre}
            </Link>
            <button type="button" className="btn btn-outline-danger" onClick={cerrarSesion} title="Cerrar sesión">
              Salir
            </button>
          </div>
        ) : (
          <>
            <Link className="btn btn-outline-info btn-sm" to="/login" onClick={alNavegar}>Iniciar sesión</Link>
            <Link className="btn btn-primary btn-sm" to="/registro" onClick={alNavegar}>Registrarse</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function Navbar() {
  const { usuario, esStaff } = useAuth()
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
            <MenuProductos onElegir={cerrarMenu} />
            {dibujarEnlaces(enlacesDespues)}
            {usuario && !esStaff && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/mis-compras" onClick={cerrarMenu}>Mis compras</NavLink>
              </li>
            )}
            {esStaff && (
              <li className="nav-item">
                <NavLink className="nav-link text-warning fw-semibold" to="/admin" onClick={cerrarMenu}>🛠️ Panel Staff</NavLink>
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
