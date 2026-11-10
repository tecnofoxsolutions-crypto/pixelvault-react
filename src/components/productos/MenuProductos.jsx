// Desplegable "Productos" del header (CF-02): todos los productos, ofertas y cada categoría.
// Reemplaza al antiguo desplegable "Categorías" de Maximiliano (TEC-03). Las categorías se leen de db.js.
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import db from '../../data/db.js'

export default function MenuProductos({ onElegir }) {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
  // Si el admin crea una categoría, aparece aquí sin tocar el código
  const categorias = db.getAll('categorias')
  const activo = ['/productos', '/ofertas', '/categorias'].some((ruta) => pathname.startsWith(ruta))

  function elegir() {
    setAbierto(false)
    if (onElegir) onElegir()
  }

  return (
    <li className="nav-item dropdown" onMouseLeave={() => setAbierto(false)}>
      <button
        type="button"
        className={`nav-link dropdown-toggle border-0 bg-transparent ${activo ? 'active' : ''}`}
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
      >
        Productos
      </button>
      <ul className={`dropdown-menu ${abierto ? 'show' : ''}`}>
        <li>
          <NavLink className="dropdown-item" to="/productos" end onClick={elegir}>🎮 Todos los productos</NavLink>
        </li>
        <li>
          <NavLink className="dropdown-item text-warning" to="/ofertas" onClick={elegir}>🔥 Ofertas</NavLink>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li><h6 className="dropdown-header">Categorías</h6></li>
        {categorias.map((categoria) => (
          <li key={categoria.id}>
            <NavLink className="dropdown-item" to={`/categorias/${categoria.id}`} onClick={elegir}>
              {categoria.nombre}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink className="dropdown-item small text-secondary" to="/categorias" end onClick={elegir}>Ver todas las categorías →</NavLink>
        </li>
      </ul>
    </li>
  )
}
