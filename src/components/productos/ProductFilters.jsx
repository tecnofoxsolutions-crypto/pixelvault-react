// DUEÑO: Maximiliano (HU-32). Filtros del catálogo. El estado vive en la página Productos;
// este componente solo lo muestra y avisa los cambios con onCambiar (componente controlado).
import plataformas from '../../data/plataformas.js'

// 'ofertas' no es un rango: deja solo los productos en oferta (CF-04)
export const rangosPrecio = [
  { valor: '', texto: 'Todos los precios', min: 0, max: Infinity },
  { valor: 'ofertas', texto: '🔥 Solo ofertas', min: 0, max: Infinity, soloOfertas: true },
  { valor: 'hasta-30', texto: 'Hasta $30.000', min: 0, max: 30000 },
  { valor: '30-40', texto: '$30.000 a $40.000', min: 30000, max: 40000 },
  { valor: 'mas-40', texto: 'Más de $40.000', min: 40000, max: Infinity },
]

export default function ProductFilters({ filtros, categorias, onCambiar, onLimpiar }) {
  function cambiar(evento) {
    onCambiar({ ...filtros, [evento.target.name]: evento.target.value })
  }

  return (
    <div className="row g-2 align-items-end mb-4">
      <div className="col-12 col-md-6 col-lg-3">
        <label className="form-label small" htmlFor="filtro-texto">Nombre</label>
        <input
          id="filtro-texto"
          name="texto"
          type="search"
          className="form-control"
          placeholder="Ej: zelda"
          value={filtros.texto}
          onChange={cambiar}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-3">
        <label className="form-label small" htmlFor="filtro-plataforma">Plataforma</label>
        <select id="filtro-plataforma" name="plataforma" className="form-select" value={filtros.plataforma} onChange={cambiar}>
          <option value="">Todas</option>
          {plataformas.map((p) => (
            <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-6 col-lg-2">
        <label className="form-label small" htmlFor="filtro-categoria">Categoría</label>
        <select id="filtro-categoria" name="categoriaId" className="form-select" value={filtros.categoriaId} onChange={cambiar}>
          <option value="">Todas</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-6 col-lg-2">
        <label className="form-label small" htmlFor="filtro-precio">Precio</label>
        <select id="filtro-precio" name="precio" className="form-select" value={filtros.precio} onChange={cambiar}>
          {rangosPrecio.map((r) => (
            <option key={r.valor} value={r.valor}>{r.texto}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-lg-2 d-grid">
        <button type="button" className="btn btn-outline-secondary" onClick={onLimpiar}>Limpiar filtros</button>
      </div>
    </div>
  )
}
