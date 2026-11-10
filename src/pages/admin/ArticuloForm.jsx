// DUEÑO: Jim (CF-13). Página /admin/blog/nuevo y /admin/blog/:id/editar (Editor y Administrador).
import { Link, useNavigate, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import { useAuth } from '../../context/AuthContext.jsx'
import ArticleForm from '../../components/admin/ArticleForm.jsx'
import { fechaArticulo } from '../../utils/articulos.js'

export default function ArticuloForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const esEdicion = Boolean(id)
  const articulo = esEdicion ? db.getById('blog', id) : null

  if (esEdicion && !articulo) {
    return (
      <div className="text-center py-5">
        <h1 className="h4 text-light">Artículo no encontrado</h1>
        <Link to="/admin/blog" className="btn btn-outline-info">Volver al blog</Link>
      </div>
    )
  }

  function guardar(datos) {
    if (esEdicion) {
      db.update('blog', id, datos)
    } else {
      db.create('blog', { ...datos, fecha: fechaArticulo() })
    }
    navigate('/admin/blog', { state: { mensaje: `Artículo "${datos.titulo}" ${esEdicion ? 'actualizado' : 'publicado'}.` } })
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin/blog">Blog</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{esEdicion ? 'Editar' : 'Nuevo'}</li>
        </ol>
      </nav>
      <h1 className="h3 text-light mb-4 encabezado-panel">{esEdicion ? 'Editar artículo' : 'Nuevo artículo'}</h1>

      <div className="card card-juego">
        <div className="card-body">
          {/* La key reinicia el formulario al pasar de "editar" a "nuevo" o entre artículos */}
          <ArticleForm
            key={id ?? 'nuevo'}
            articulo={articulo}
            autorPorDefecto={`${usuario.nombre} ${usuario.apellidos}`}
            onGuardar={guardar}
            onCancelar={() => navigate('/admin/blog')}
          />
        </div>
      </div>
    </div>
  )
}
