// DUEÑO: Maximiliano (HU-31). Carrusel Bootstrap de juegos destacados.
// La diapositiva visible se controla con estado de React (indice) y avanza sola cada 5 segundos.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PriceTag from './PriceTag.jsx'
import PlataformaBadge from './PlataformaBadge.jsx'

export default function CarruselDestacados({ productos }) {
  const [indice, setIndice] = useState(0)
  const total = productos.length

  function irA(nuevo) {
    setIndice((nuevo + total) % total) // el % hace que después del último vuelva al primero
  }

  // Avance automático; se limpia el intervalo al cambiar de diapositiva o salir de la página
  useEffect(() => {
    if (total < 2) return undefined
    const intervalo = setInterval(() => setIndice((i) => (i + 1) % total), 5000)
    return () => clearInterval(intervalo)
  }, [indice, total])

  if (total === 0) return null

  return (
    <div className="carousel slide hero-steam mb-5">
      <div className="carousel-indicators">
        {productos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={i === indice ? 'active' : ''}
            aria-label={`Ver ${p.nombre}`}
            aria-current={i === indice}
            onClick={() => irA(i)}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {productos.map((p, i) => (
          <div key={p.id} className={`carousel-item ${i === indice ? 'active' : ''}`}>
            <div className="row g-0 align-items-center px-4 pt-4 pb-5 p-md-5">
              <div className="col-12 col-md-7 order-2 order-md-1">
                <PlataformaBadge plataforma={p.plataforma} />
                <h2 className="display-6 text-light mt-2">{p.nombre}</h2>
                <p className="d-none d-md-block">{p.descripcion}</p>
                <PriceTag producto={p} grande />
                <Link className="btn btn-info mt-3 d-table" to={`/productos/${p.id}`}>Ver juego</Link>
              </div>
              <div className="col-12 col-md-5 order-1 order-md-2 text-center mb-3 mb-md-0">
                <img src={p.imagen} alt={p.nombre} className="img-fluid rounded carrusel-img" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" onClick={() => irA(indice - 1)}>
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={() => irA(indice + 1)}>
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  )
}
