// Carrusel "⭐ Títulos Destacados" de la portada. Creado por Maximiliano (HU-31), rediseñado en CF-01:
// - Cada juego va en una tarjeta con borde dorado animado y estrella, como en la Evaluación 1.
// - Las flechas van FUERA de la tarjeta (antes la izquierda tapaba el botón "Ver juego") y son más visibles.
// La diapositiva visible se controla con estado de React (indice) y avanza sola cada 6 segundos.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import db from '../../data/db.js'
import PriceTag from './PriceTag.jsx'
import PlataformaBadge from './PlataformaBadge.jsx'

export default function CarruselDestacados({ productos }) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const total = productos.length

  function irA(nuevo) {
    setIndice((nuevo + total) % total) // el % hace que después del último vuelva al primero
  }

  // Avance automático (se detiene con el mouse encima); se limpia al cambiar de diapositiva o salir de la página
  useEffect(() => {
    if (total < 2 || pausado) return undefined
    const intervalo = setInterval(() => setIndice((i) => (i + 1) % total), 6000)
    return () => clearInterval(intervalo)
  }, [indice, total, pausado])

  if (total === 0) return null
  const p = productos[indice]
  const categoria = db.getById('categorias', p.categoriaId)

  return (
    <section className="mb-5" aria-labelledby="titulo-destacados">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 id="titulo-destacados" className="h4 font-arcade text-warning mb-0">⭐ Títulos Destacados</h2>
        <Link className="small" to="/productos">Ver catálogo completo →</Link>
      </div>

      <div className="carrusel-destacados" onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}>
        <button type="button" className="btn-carrusel" onClick={() => irA(indice - 1)} aria-label="Juego anterior">‹</button>

        <article className="card card-juego card-destacado-estrella flex-grow-1" aria-live="polite">
          <span className="badge-estrella-mario" aria-hidden="true">⭐</span>
          <div className="row g-0 align-items-center p-3 p-md-4">
            <div className="col-12 col-md-5 text-center mb-3 mb-md-0">
              <Link to={`/productos/${p.id}`}>
                <img src={p.imagen} alt={p.nombre} className="img-fluid rounded carrusel-img" />
              </Link>
            </div>
            <div className="col-12 col-md-7 ps-md-4">
              <div className="d-flex flex-wrap gap-1 mb-2">
                <PlataformaBadge plataforma={p.plataforma} />
                {categoria && <span className="badge text-bg-dark border border-secondary">{categoria.nombre}</span>}
                <span className="badge text-bg-warning">Destacado</span>
              </div>
              <h3 className="h2 text-light">{p.nombre}</h3>
              <p className="text-secondary d-none d-md-block">{p.descripcion}</p>
              <PriceTag producto={p} grande />
              <Link className="btn btn-warning fw-bold mt-3" to={`/productos/${p.id}`}>Ver juego</Link>
            </div>
          </div>
        </article>

        <button type="button" className="btn-carrusel" onClick={() => irA(indice + 1)} aria-label="Juego siguiente">›</button>
      </div>

      <div className="d-flex justify-content-center gap-2 mt-3">
        {productos.map((producto, i) => (
          <button
            key={producto.id}
            type="button"
            className={`punto-carrusel ${i === indice ? 'activo' : ''}`}
            aria-label={`Ver ${producto.nombre}`}
            aria-current={i === indice}
            onClick={() => irA(i)}
          />
        ))}
      </div>
    </section>
  )
}
