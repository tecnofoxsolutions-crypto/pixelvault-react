// Buscador de la barra: envía el texto a /productos?q=texto. Creado por Maximiliano (TEC-03).
// El campo y el botón van unidos (input-group) para que se vean como una sola pieza.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BuscadorProductos({ onBuscar }) {
  const [texto, setTexto] = useState('')
  const navigate = useNavigate()

  function buscar(evento) {
    evento.preventDefault() // evita que el formulario recargue la página
    const limpio = texto.trim()
    navigate(limpio ? `/productos?q=${encodeURIComponent(limpio)}` : '/productos')
    setTexto('')
    if (onBuscar) onBuscar() // avisa al Navbar para cerrar el menú en móvil
  }

  return (
    <form className="input-group input-group-sm buscador-navbar" role="search" onSubmit={buscar}>
      <input
        className="form-control"
        type="search"
        placeholder="Buscar juegos..."
        aria-label="Buscar juegos"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button className="btn btn-info" type="submit" aria-label="Buscar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" />
        </svg>
      </button>
    </form>
  )
}
