// DUEÑO: Maximiliano (tarjeta TEC-03). Desplegable "Categorías" del Navbar, generado desde db.js
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import db from '../../data/db.js'

export default function MenuCategorias({ onElegir }) {
  const [abierto, setAbierto] = useState(false)
  // Se lee en cada render: si el admin crea una categoría, aparece aquí sin tocar el código
  const categorias = db.getAll('categorias')

  function elegir() {
    setAbierto(false)
    if (onElegir) onElegir()
  }

  return (
    <li className="nav-item dropdown" onMouseLeave={() => setAbierto(false)}>
      <button
        type="button"
        className="nav-link dropdown-toggle border-0 bg-transparent"
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
      >
        Categorías
      </button>
      <ul className={`dropdown-menu ${abierto ? 'show' : ''}`}>
        <li>
          <NavLink className="dropdown-item" to="/categorias" end onClick={elegir}>
            Ver todas
          </NavLink>
        </li>
        <li><hr className="dropdown-divider" /></li>
        {categorias.map((categoria) => (
          <li key={categoria.id}>
            <Link className="dropdown-item" to={`/categorias/${categoria.id}`} onClick={elegir}>
              {categoria.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}
