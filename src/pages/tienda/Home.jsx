// DUEÑO: Maximiliano (HU-31). Portada: carrusel de destacados, categorías y grilla de destacados.
import { Link } from 'react-router-dom'
import db from '../../data/db.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import CarruselDestacados from '../../components/productos/CarruselDestacados.jsx'
import CategoryList from '../../components/productos/CategoryList.jsx'
import ProductList from '../../components/productos/ProductList.jsx'
import useAgregarAlCarrito from '../../components/productos/useAgregarAlCarrito.js'

export default function Home() {
  const { aviso, cerrarAviso, agregarAlCarrito } = useAgregarAlCarrito()
  const productos = db.getAll('productos').filter((p) => p.activo)
  const destacados = productos.filter((p) => p.destacado)
  const categorias = db.getAll('categorias')

  return (
    <div className="container py-4">
      <CarruselDestacados productos={destacados.slice(0, 5)} />

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 font-arcade text-light mb-0">Categorías</h2>
          <Link className="small" to="/categorias">Ver todas</Link>
        </div>
        <CategoryList categorias={categorias} productos={productos} />
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 font-arcade text-light mb-0">Destacados</h2>
          <Link className="small" to="/productos">Ver catálogo completo</Link>
        </div>
        {aviso && <AlertMessage tipo={aviso.tipo} mensaje={aviso.mensaje} onCerrar={cerrarAviso} />}
        <ProductList productos={destacados} onAgregar={agregarAlCarrito} />
      </section>
    </div>
  )
}
