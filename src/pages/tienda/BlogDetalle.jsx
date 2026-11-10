// DUEÑO: Maximiliano (HU-41). Artículo completo del blog en /blog/:id.
import { Link, useNavigate, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import EmptyState from '../../components/productos/EmptyState.jsx'

export default function BlogDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const articulo = db.getById('blog', id)

  if (!articulo) {
    return (
      <div className="container py-5">
        <EmptyState mensaje="Artículo no encontrado" textoBoton="Volver al blog" onAccion={() => navigate('/blog')} />
      </div>
    )
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
          <li className="breadcrumb-item active text-truncate" aria-current="page">{articulo.titulo}</li>
        </ol>
      </nav>
      <article className="mx-auto" style={{ maxWidth: '50rem' }}>
        <span className={`badge ${articulo.badgeColor} mb-2`}>{articulo.nombreCategoria}</span>
        <h1 className="h2 mb-2">{articulo.titulo}</h1>
        <p className="text-secondary small mb-4">
          {articulo.autor} · {articulo.fecha} · {articulo.tiempoLectura}
        </p>
        <img src={articulo.imagen} alt={articulo.titulo} className="img-fluid rounded mb-4 w-100 imagen-articulo" />
        <div className="cuerpo-articulo" dangerouslySetInnerHTML={{ __html: articulo.cuerpo }} />
        <Link to="/blog" className="btn btn-outline-info mt-4">← Volver al blog</Link>
      </article>
    </div>
  )
}
