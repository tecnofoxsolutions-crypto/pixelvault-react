// DUEÑO: Emanuel (HU-36). Una fila de la tabla del carrito.
// Props: item (línea del carrito), onCambiarCantidad(productoId, nuevaCantidad), onEliminar(productoId)
import { Link } from 'react-router-dom'
import { formatoCLP } from '../../utils/formatoCLP.js'

export default function CartItemRow({ item, onCambiarCantidad, onEliminar }) {
  const subtotal = item.precio * item.cantidad
  const enElMaximo = item.cantidad >= item.stock

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-3">
          {/* En celulares se ocultan la imagen y el precio unitario para que quepan cantidad y subtotal */}
          <img src={item.imagen} alt="" className="carrito-img rounded border border-secondary d-none d-sm-block" />
          <Link to={`/productos/${item.productoId}`} className="text-light text-decoration-none fw-semibold">
            {item.nombre}
          </Link>
        </div>
      </td>
      <td className="text-nowrap d-none d-sm-table-cell">{formatoCLP(item.precio)}</td>
      <td>
        <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${item.nombre}`}>
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => onCambiarCantidad(item.productoId, item.cantidad - 1)}
            aria-label="Restar uno"
          >
            −
          </button>
          <span className="btn btn-outline-light disabled carrito-cantidad">{item.cantidad}</span>
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => onCambiarCantidad(item.productoId, item.cantidad + 1)}
            disabled={enElMaximo}
            aria-label="Sumar uno"
          >
            +
          </button>
        </div>
        {enElMaximo && <div className="small text-warning mt-1">Máx. {item.stock}</div>}
      </td>
      <td className="text-nowrap fw-bold text-info">{formatoCLP(subtotal)}</td>
      <td className="text-end">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onEliminar(item.productoId)}
          aria-label={`Eliminar ${item.nombre}`}
        >
          <span className="d-none d-sm-inline">Eliminar</span>
          <span className="d-sm-none" aria-hidden="true">✕</span>
        </button>
      </td>
    </tr>
  )
}
