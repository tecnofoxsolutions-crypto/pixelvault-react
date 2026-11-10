// DUEÑO: Emanuel (HU-37). Tabla con el detalle de una compra. Se reutiliza en checkout, pago exitoso/error y boletas.
// Props: items ([{ productoId, nombre, precio, cantidad }]), subtotal, despacho, total, textoTotal (opcional)
import { formatoCLP } from '../../utils/formatoCLP.js'

export default function OrderSummaryTable({ items, subtotal, despacho, total, textoTotal = 'Total' }) {
  return (
    <div className="table-responsive">
      <table className="table table-dark table-sm align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col" className="text-center">Cant.</th>
            <th scope="col" className="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productoId}>
              <td>
                {item.nombre}
                <div className="small text-secondary">{formatoCLP(item.precio)} c/u</div>
              </td>
              <td className="text-center">{item.cantidad}</td>
              <td className="text-end text-nowrap">{formatoCLP(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="text-secondary">Subtotal</td>
            <td className="text-end text-nowrap">{formatoCLP(subtotal)}</td>
          </tr>
          <tr>
            <td colSpan="2" className="text-secondary">Despacho</td>
            <td className="text-end text-nowrap">{despacho > 0 ? formatoCLP(despacho) : 'Gratis'}</td>
          </tr>
          <tr>
            <th colSpan="2" scope="row">{textoTotal}</th>
            <td className="text-end text-nowrap fs-5 fw-bold text-info">{formatoCLP(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
