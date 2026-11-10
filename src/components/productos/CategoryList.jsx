// DUEÑO: Maximiliano (HU-34/31). Fila de tarjetas de categorías; se usa en Categorías y en Home.
import CategoryCard from './CategoryCard.jsx'

export default function CategoryList({ categorias, productos }) {
  return (
    <div className="row g-3">
      {categorias.map((categoria) => (
        <div className="col-6 col-md-4 col-lg-2" key={categoria.id}>
          <CategoryCard
            categoria={categoria}
            cantidad={productos.filter((p) => String(p.categoriaId) === String(categoria.id)).length}
          />
        </div>
      ))}
    </div>
  )
}
