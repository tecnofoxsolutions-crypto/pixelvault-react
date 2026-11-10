// DUEÑO: Maximiliano (HU-33). Botones − / + para elegir cuántas unidades agregar, sin pasar del stock.
export default function SelectorCantidad({ cantidad, maximo, onCambiar }) {
  return (
    <div className="input-group" style={{ maxWidth: '9rem' }}>
      <button
        type="button"
        className="btn btn-outline-secondary"
        aria-label="Quitar una unidad"
        disabled={cantidad <= 1}
        onClick={() => onCambiar(cantidad - 1)}
      >
        −
      </button>
      <input
        type="number"
        className="form-control text-center"
        aria-label="Cantidad"
        min="1"
        max={maximo}
        value={cantidad}
        onChange={(e) => {
          const valor = Number(e.target.value)
          if (valor >= 1 && valor <= maximo) onCambiar(valor)
        }}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        aria-label="Agregar una unidad"
        disabled={cantidad >= maximo}
        onClick={() => onCambiar(cantidad + 1)}
      >
        +
      </button>
    </div>
  )
}
