// Editor del encuadre de la imagen de un producto: se arrastra la imagen dentro de un recuadro del mismo
// tamaño que la tarjeta de la tienda, o se ajusta con los controles. Props: src, encuadre, onCambiar(encuadre)
import { useRef } from 'react'
import ImagenEncuadrada, { ENCUADRE_POR_DEFECTO } from '../productos/ImagenEncuadrada.jsx'

const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor))

export default function EditorEncuadre({ src, encuadre, onCambiar }) {
  const { x, y, zoom } = { ...ENCUADRE_POR_DEFECTO, ...encuadre }
  const arrastre = useRef(null)

  function iniciarArrastre(evento) {
    evento.currentTarget.setPointerCapture(evento.pointerId)
    arrastre.current = { inicioX: evento.clientX, inicioY: evento.clientY, x, y, ancho: evento.currentTarget.clientWidth, alto: evento.currentTarget.clientHeight }
  }

  // Arrastrar la imagen hacia la derecha muestra su parte izquierda (por eso se resta)
  function mover(evento) {
    const a = arrastre.current
    if (!a) return
    const nuevoX = limitar(a.x - ((evento.clientX - a.inicioX) / a.ancho) * 100, 0, 100)
    const nuevoY = limitar(a.y - ((evento.clientY - a.inicioY) / a.alto) * 100, 0, 100)
    onCambiar({ x: Math.round(nuevoX), y: Math.round(nuevoY), zoom })
  }

  function terminarArrastre() {
    arrastre.current = null
  }

  const cambiar = (campo) => (evento) => onCambiar({ x, y, zoom, [campo]: Number(evento.target.value) })

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="form-label small mb-0">Encuadre en la tienda</span>
        <button type="button" className="btn btn-link btn-sm p-0" onClick={() => onCambiar(ENCUADRE_POR_DEFECTO)}>Centrar</button>
      </div>

      <ImagenEncuadrada
        src={src}
        alt="Vista previa como en la tarjeta de la tienda"
        encuadre={{ x, y, zoom }}
        className="editor-encuadre rounded border border-secondary"
        onPointerDown={iniciarArrastre}
        onPointerMove={mover}
        onPointerUp={terminarArrastre}
        onPointerCancel={terminarArrastre}
        role="img"
        aria-label="Arrastra para elegir qué parte de la imagen se muestra"
      />
      <div className="form-text mb-2">Arrastra la imagen para elegir qué parte se ve en la tarjeta de la tienda.</div>

      <label htmlFor="encuadre-zoom" className="form-label small mb-0">Zoom: {Math.round(zoom * 100)}%</label>
      <input id="encuadre-zoom" type="range" className="form-range" min="1" max="2.5" step="0.05" value={zoom} onChange={cambiar('zoom')} />
      <label htmlFor="encuadre-x" className="form-label small mb-0">Posición horizontal: {x}%</label>
      <input id="encuadre-x" type="range" className="form-range" min="0" max="100" value={x} onChange={cambiar('x')} />
      <label htmlFor="encuadre-y" className="form-label small mb-0">Posición vertical: {y}%</label>
      <input id="encuadre-y" type="range" className="form-range" min="0" max="100" value={y} onChange={cambiar('y')} />
    </div>
  )
}
