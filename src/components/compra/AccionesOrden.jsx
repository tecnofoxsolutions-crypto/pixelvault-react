// Botón con el siguiente paso de la orden (CF-10). Se usa en la boleta del admin y en "Mis entregas" del repartidor.
// Props:
//   orden           → orden de db.js
//   usuario         → usuario en sesión (decide qué botones puede usar)
//   onCambio(orden, mensaje) → avisa al padre con la orden actualizada
import { useState } from 'react'
import ConfirmModal from '../common/ConfirmModal.jsx'
import { cambiarEstado, puedeCancelar, repartidoresActivos, siguientePaso } from './ordenes.js'
import { comprimirImagen } from '../../utils/imagen.js'

export default function AccionesOrden({ orden, usuario, onCambio }) {
  const paso = siguientePaso(orden)
  const repartidores = repartidoresActivos()
  const [repartidorId, setRepartidorId] = useState(orden.repartidorId ? String(orden.repartidorId) : '')
  const [foto, setFoto] = useState(null)
  // Comentario opcional del repartidor al entregar (ej: "Recibido por el conserje"); lo ve el cliente
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')
  const [confirmarCancelar, setConfirmarCancelar] = useState(false)

  const puedeAvanzar = paso && paso.roles.includes(usuario?.rol)
  // El repartidor solo puede mover las órdenes que tiene asignadas
  const esSuyaOAdmin = usuario?.rol !== 'Repartidor' || String(orden.repartidorId) === String(usuario?.id)

  async function elegirFoto(evento) {
    setError('')
    try {
      setFoto(await comprimirImagen(evento.target.files[0]))
    } catch (e) {
      setFoto(null)
      setError(e.message)
    }
  }

  function avanzar() {
    if (paso.accion === 'asignar' && !repartidorId) {
      setError('Elige un repartidor antes de asignar la orden')
      return
    }
    if (paso.pideFoto && !foto) {
      setError('Sube una foto del paquete entregado como comprobante')
      return
    }
    const extra = {}
    if (paso.accion === 'asignar') extra.repartidorId = Number(repartidorId)
    if (paso.pideFoto) {
      extra.fotoEntrega = foto
      extra.comentarioEntrega = comentario.trim()
    }

    const actualizada = cambiarEstado(orden, paso.estadoNuevo, usuario, extra)
    const repartidor = repartidores.find((r) => String(r.id) === repartidorId)
    const detalle = paso.accion === 'asignar' && repartidor ? ` (repartidor: ${repartidor.nombre} ${repartidor.apellidos})` : ''
    setError('')
    setFoto(null)
    setComentario('')
    onCambio(actualizada, `La orden ${orden.numero} pasó a "${paso.estadoNuevo}"${detalle}.`)
  }

  function cancelar() {
    const actualizada = cambiarEstado(orden, 'Cancelada', usuario)
    setConfirmarCancelar(false)
    onCambio(actualizada, `La orden ${orden.numero} fue cancelada.`)
  }

  if (!paso && !puedeCancelar(orden, usuario)) {
    return <p className="text-secondary small mb-0">Esta orden ya terminó su recorrido: no hay más pasos.</p>
  }

  return (
    <div className="d-flex flex-column gap-2">
      {puedeAvanzar && esSuyaOAdmin && (
        <div className="d-flex flex-wrap align-items-end gap-2">
          {paso.accion === 'asignar' && (
            <div>
              <label htmlFor={`repartidor-${orden.id}`} className="form-label small mb-1">Repartidor</label>
              <select
                id={`repartidor-${orden.id}`}
                className="form-select form-select-sm"
                value={repartidorId}
                onChange={(e) => setRepartidorId(e.target.value)}
              >
                <option value="">Elige un repartidor</option>
                {repartidores.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre} {r.apellidos}</option>
                ))}
              </select>
            </div>
          )}
          {paso.pideFoto && (
            <>
              <div>
                <label htmlFor={`foto-${orden.id}`} className="form-label small mb-1">Foto de la entrega</label>
                <input id={`foto-${orden.id}`} type="file" accept="image/*" capture="environment" className="form-control form-control-sm" onChange={elegirFoto} />
              </div>
              <div className="flex-grow-1">
                <label htmlFor={`comentario-${orden.id}`} className="form-label small mb-1">Comentario para el cliente (opcional)</label>
                <input
                  id={`comentario-${orden.id}`}
                  type="text"
                  maxLength={200}
                  className="form-control form-control-sm"
                  placeholder="Ej: Recibido por el conserje"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>
            </>
          )}
          <button type="button" className="btn btn-success btn-sm" onClick={avanzar}>
            {paso.texto} →
          </button>
        </div>
      )}

      {paso && !(puedeAvanzar && esSuyaOAdmin) && (
        <p className="text-secondary small mb-0">
          Siguiente paso: <strong>{paso.texto}</strong> (lo hace: {paso.roles.join(' o ')}).
        </p>
      )}

      {foto && <img src={foto} alt="Vista previa de la foto de entrega" className="rounded border border-secondary" style={{ maxWidth: 160 }} />}
      {error && <div className="text-danger small">{error}</div>}

      {puedeCancelar(orden, usuario) && (
        <div>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setConfirmarCancelar(true)}>
            Cancelar orden
          </button>
        </div>
      )}

      <ConfirmModal
        abierto={confirmarCancelar}
        titulo="Cancelar orden"
        mensaje={`¿Seguro que quieres cancelar la orden ${orden.numero}? No se puede deshacer.`}
        textoConfirmar="Cancelar orden"
        onConfirmar={cancelar}
        onCancelar={() => setConfirmarCancelar(false)}
      />
    </div>
  )
}
