// DUEÑO: Maximiliano (tarjeta TEC-03). Buscador de la barra: envía el texto a /productos?q=texto
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
    <form className="d-flex my-2 my-lg-0" role="search" onSubmit={buscar}>
      <input
        className="form-control form-control-sm me-2 buscador-navbar"
        type="search"
        placeholder="Buscar juegos..."
        aria-label="Buscar juegos"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button className="btn btn-outline-info btn-sm" type="submit">Buscar</button>
    </form>
  )
}
