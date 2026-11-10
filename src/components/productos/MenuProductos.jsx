// Desplegable "Productos" del header (CF-02): todos los productos, ofertas y categorías.
// Reemplaza al antiguo desplegable "Categorías" de Maximiliano (TEC-03).
// "Categorías" lleva a /categorias, donde se elige una; la lista de categorías no se repite aquí.
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const opciones = [
  { to: '/productos', texto: '🎮 Todos los productos', exacto: true },
  { to: '/ofertas', texto: '🔥 Ofertas', clase: 'text-warning' },
  { to: '/categorias', texto: '🏷️ Categorías' },
]

export default function MenuProductos({ onElegir }) {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
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
        {opciones.map((opcion) => (
          <li key={opcion.to}>
            <NavLink className={`dropdown-item ${opcion.clase ?? ''}`} to={opcion.to} end={opcion.exacto} onClick={elegir}>
              {opcion.texto}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  )
}
