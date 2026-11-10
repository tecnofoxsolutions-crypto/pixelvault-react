// DUEÑO: Emanuel (HU-36). Ventana de confirmación con el estilo de los modales de Bootstrap.
// Se controla desde React con la prop `mostrar` (no usa el JavaScript de Bootstrap).
// Props: mostrar, titulo, mensaje, textoConfirmar, onConfirmar(), onCancelar()
import { useEffect } from 'react'

export default function ConfirmModal({ mostrar, titulo, mensaje, textoConfirmar = 'Confirmar', onConfirmar, onCancelar }) {
  // Cerrar con la tecla Escape mientras está abierto
  useEffect(() => {
    if (!mostrar) return
    function alPresionar(evento) {
      if (evento.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [mostrar, onCancelar])

  if (!mostrar) return null

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="tituloConfirmar">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-secondary">
            <div className="modal-header">
              <h2 className="modal-title h5" id="tituloConfirmar">{titulo}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancelar} />
            </div>
            <div className="modal-body">
              <p className="mb-0">{mensaje}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-light" onClick={onCancelar} autoFocus>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirmar}>
                {textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onCancelar} />
    </>
  )
}
