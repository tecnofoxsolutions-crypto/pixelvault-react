// DUEÑO: Maximiliano (HU-32/35). Muestra el precio; si hay oferta, el original tachado y el % de descuento.
import { formatoCLP } from '../../utils/formatoCLP.js'
import { estaEnOferta, porcentajeDescuento } from './precios.js'

export default function PriceTag({ producto, grande = false }) {
  const claseTamano = grande ? 'fs-3' : 'fs-5'

  if (!estaEnOferta(producto)) {
    return <span className={`${claseTamano} fw-bold text-info`}>{formatoCLP(producto.precio)}</span>
  }

  return (
    <div className="d-flex flex-wrap align-items-center gap-2">
      <span className={`${claseTamano} fw-bold text-warning`}>{formatoCLP(producto.precioOferta)}</span>
      <del className="text-secondary small">{formatoCLP(producto.precio)}</del>
      <span className="badge bg-danger">-{porcentajeDescuento(producto)}%</span>
    </div>
  )
}
