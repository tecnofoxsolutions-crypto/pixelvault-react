// DUEÑO: Maximiliano (HU-34). /categorias muestra todas; /categorias/:id muestra los juegos de una categoría.
import { Link, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import CategoryList from '../../components/productos/CategoryList.jsx'
import ProductList from '../../components/productos/ProductList.jsx'
import EmptyState from '../../components/productos/EmptyState.jsx'
import useAgregarAlCarrito from '../../components/productos/useAgregarAlCarrito.js'

export default function Categorias() {
  const { id } = useParams()
  const { aviso, cerrarAviso, agregarAlCarrito } = useAgregarAlCarrito()
  const categorias = db.getAll('categorias')
  const productos = db.getAll('productos').filter((p) => p.activo)

  // Sin id en la URL: listado de categorías
  if (!id) {
    return (
      <div className="container py-4">
        <h1 className="h2 font-arcade text-light mb-1">Categorías</h1>
        <p className="text-secondary">Explora el catálogo por género.</p>
        <CategoryList categorias={categorias} productos={productos} />
      </div>
    )
  }

  const categoria = categorias.find((c) => String(c.id) === id)

  if (!categoria) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 text-light">Categoría no encontrada</h1>
        <Link className="btn btn-outline-info mt-2" to="/categorias">Ver todas las categorías</Link>
      </div>
    )
  }

  const deLaCategoria = productos.filter((p) => String(p.categoriaId) === id)

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{categoria.nombre}</li>
        </ol>
      </nav>
      <h1 className="h2 font-arcade text-light mb-1">{categoria.nombre}</h1>
      <p className="text-secondary">{deLaCategoria.length} juegos</p>

      {aviso && <AlertMessage tipo={aviso.tipo} mensaje={aviso.mensaje} onCerrar={cerrarAviso} />}

      {deLaCategoria.length > 0 ? (
        <ProductList productos={deLaCategoria} onAgregar={agregarAlCarrito} />
      ) : (
        <EmptyState mensaje="Aún no hay juegos en esta categoría" />
      )}
    </div>
  )
}
