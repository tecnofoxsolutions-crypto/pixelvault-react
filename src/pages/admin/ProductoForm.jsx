// DUEÑO: Jim (tarjeta HU-46). Página para /admin/productos/nuevo y /admin/productos/:id/editar.
// Decide si crea o actualiza; el formulario en sí está en components/admin/ProductForm.jsx.
import { Link, useNavigate, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import ProductForm from '../../components/admin/ProductForm.jsx'

export default function ProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)
  const producto = esEdicion ? db.getById('productos', id) : null

  if (esEdicion && !producto) {
    return (
      <div className="text-center py-5">
        <h1 className="h4 text-light">Producto no encontrado</h1>
        <p className="text-secondary">No existe un producto con el id {id}.</p>
        <Link to="/admin/productos" className="btn btn-outline-info">Volver a productos</Link>
      </div>
    )
  }

  const categorias = db.getAll('categorias')
  // Códigos de los demás productos (al editar, el propio código sí se puede mantener)
  const codigosExistentes = db
    .getAll('productos')
    .filter((p) => !esEdicion || String(p.id) !== String(id))
    .map((p) => p.codigo.toUpperCase())

  function guardar(datos) {
    if (esEdicion) {
      db.update('productos', id, datos)
    } else {
      db.create('productos', datos)
    }
    const accion = esEdicion ? 'actualizado' : 'creado'
    navigate('/admin/productos', { state: { mensaje: `Producto "${datos.nombre}" ${accion} correctamente.` } })
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{esEdicion ? 'Editar' : 'Nuevo'}</li>
        </ol>
      </nav>
      <h1 className="h3 text-light mb-4">{esEdicion ? `Editar: ${producto.nombre}` : 'Nuevo producto'}</h1>

      <div className="card card-juego">
        <div className="card-body">
          {/* La key obliga a React a crear un formulario nuevo al pasar de "editar" a "nuevo" (o entre productos) */}
          <ProductForm
            key={id ?? 'nuevo'}
            producto={producto}
            categorias={categorias}
            codigosExistentes={codigosExistentes}
            onGuardar={guardar}
            onCancelar={() => navigate('/admin/productos')}
          />
        </div>
      </div>
    </div>
  )
}
