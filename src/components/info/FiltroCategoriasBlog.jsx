// DUEÑO: Maximiliano (HU-41). Botones para filtrar el blog por categoría.
export default function FiltroCategoriasBlog({ categorias, seleccionada, onSeleccionar }) {
  const opciones = [{ valor: '', texto: 'Todos' }, ...categorias]
  return (
    <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar por categoría">
      {opciones.map((opcion) => (
        <button
          key={opcion.valor || 'todos'}
          type="button"
          className={`btn btn-sm ${seleccionada === opcion.valor ? 'btn-info' : 'btn-outline-info'}`}
          onClick={() => onSeleccionar(opcion.valor)}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  )
}
