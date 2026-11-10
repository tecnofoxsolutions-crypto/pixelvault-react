// DUEÑO: Maximiliano (HU-32). Grilla de productos: recibe el arreglo por props y dibuja un ProductCard por cada uno.
// Se reutiliza en Productos, Home, Categorías, Ofertas y en los relacionados del detalle.
import ProductCard from './ProductCard.jsx'

export default function ProductList({ productos, onAgregar }) {
  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className="col-12 col-md-6 col-lg-3" key={producto.id}>
          <ProductCard producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  )
}
