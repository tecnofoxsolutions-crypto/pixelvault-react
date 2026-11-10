// DUEÑO: Maximiliano (HU-41). Tarjeta de un artículo en el listado del blog.
import { Link } from 'react-router-dom'

export default function BlogCard({ articulo }) {
  return (
    <div className="card card-juego h-100">
      <img src={articulo.imagen} className="card-img-top card-blog-img" alt={articulo.titulo} />
      <div className="card-body d-flex flex-column">
        <span className={`badge ${articulo.badgeColor} align-self-start mb-2`}>{articulo.nombreCategoria}</span>
        <h2 className="h5 card-title">{articulo.titulo}</h2>
        <p className="small text-secondary mb-2">
          {articulo.autor} · {articulo.fecha} · {articulo.tiempoLectura}
        </p>
        <p className="card-text flex-grow-1">{articulo.resumen}</p>
        <Link to={`/blog/${articulo.id}`} className="btn btn-outline-info align-self-start">
          Leer más
        </Link>
      </div>
    </div>
  )
}
