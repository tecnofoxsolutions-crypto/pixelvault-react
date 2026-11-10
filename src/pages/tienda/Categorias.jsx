// Vista Categorías (exigida en el Anexo 1 de la Evaluación 2). Creada por Maximiliano (HU-34).
// /categorias muestra las categorías para elegir; /categorias/:id reutiliza el catálogo con esa categoría ya filtrada (CF-05).
import { Link, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import CategoryList from '../../components/productos/CategoryList.jsx'
import Productos from './Productos.jsx'

export default function Categorias() {
  const { id } = useParams()
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

  const migas = (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
        <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
        <li className="breadcrumb-item active" aria-current="page">{categoria.nombre}</li>
      </ol>
    </nav>
  )

  // key={id}: al pasar de una categoría a otra, React crea el catálogo de nuevo con el filtro correcto
  return (
    <Productos
      key={id}
      titulo={categoria.nombre}
      descripcion={`Juegos físicos de ${categoria.nombre}.`}
      filtroInicial={{ categoriaId: id }}
      migas={migas}
    />
  )
}
