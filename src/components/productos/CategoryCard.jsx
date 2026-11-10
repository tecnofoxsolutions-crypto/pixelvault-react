// DUEÑO: Maximiliano (HU-34). Tarjeta de una categoría con su imagen y cantidad de juegos.
import { Link } from 'react-router-dom'

export default function CategoryCard({ categoria, cantidad }) {
  return (
    <Link to={`/categorias/${categoria.id}`} className="text-decoration-none">
      <div className="card card-juego h-100">
        <img src={categoria.imagen} alt={categoria.nombre} className="card-img-top card-categoria-img" />
        <div className="card-body text-center">
          <h3 className="h6 text-light mb-1">{categoria.nombre}</h3>
          <span className="small text-secondary">{cantidad} {cantidad === 1 ? 'juego' : 'juegos'}</span>
        </div>
      </div>
    </Link>
  )
}
