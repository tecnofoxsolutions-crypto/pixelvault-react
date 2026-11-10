// DUEÑO: Maximiliano (HU-41). Listado de artículos del blog con filtro por categoría.
import { useState } from 'react'
import db from '../../data/db.js'
import BlogCard from '../../components/info/BlogCard.jsx'
import FiltroCategoriasBlog from '../../components/info/FiltroCategoriasBlog.jsx'

export default function Blog() {
  const [articulos] = useState(() => db.getAll('blog'))
  const [categoria, setCategoria] = useState('')

  const categorias = articulos.reduce((lista, a) => {
    if (!lista.some((c) => c.valor === a.categoria)) lista.push({ valor: a.categoria, texto: a.nombreCategoria })
    return lista
  }, [])
  const visibles = categoria ? articulos.filter((a) => a.categoria === categoria) : articulos

  return (
    <div className="container py-4">
      <h1 className="font-arcade h3 mb-2">Blog Pixel Vault</h1>
      <p className="text-secondary mb-4">Noticias, guías de colección y preservación del formato físico.</p>
      <FiltroCategoriasBlog categorias={categorias} seleccionada={categoria} onSeleccionar={setCategoria} />
      <div className="row g-4">
        {visibles.map((articulo) => (
          <div key={articulo.id} className="col-12 col-md-6 col-lg-4">
            <BlogCard articulo={articulo} />
          </div>
        ))}
      </div>
    </div>
  )
}
