// Ventana de confirmación. Se muestra cuando `abierto` es true; el padre decide qué hacer al confirmar o cancelar.
// <ConfirmModal abierto={!!aEliminar} titulo="Eliminar producto" mensaje="¿Seguro?" onConfirmar={eliminar} onCancelar={cerrar} />
export default function ConfirmModal({ abierto, titulo, mensaje, textoConfirmar = 'Confirmar', colorConfirmar = 'danger', onConfirmar, onCancelar }) {
  if (!abierto) return null

  // Clic fuera de la ventana (sobre el fondo oscuro) = cancelar
  function clicFuera(evento) {
    if (evento.target === evento.currentTarget) onCancelar()
  }

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloConfirmacion"
        onClick={clicFuera}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="tituloConfirmacion">{titulo}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancelar} />
            </div>
            <div className="modal-body">{mensaje}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-light" onClick={onCancelar}>Cancelar</button>
              <button type="button" className={`btn btn-${colorConfirmar}`} onClick={onConfirmar}>{textoConfirmar}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  )
}
