// DUEÑO: Maximiliano (HU-32). Mensaje cuando una lista queda vacía, con un botón opcional.
export default function EmptyState({ mensaje, textoBoton, onAccion }) {
  return (
    <div className="text-center py-5 border border-secondary rounded">
      <p className="fs-5 text-secondary mb-3">{mensaje}</p>
      {textoBoton && onAccion && (
        <button type="button" className="btn btn-outline-info" onClick={onAccion}>
          {textoBoton}
        </button>
      )}
    </div>
  )
}
