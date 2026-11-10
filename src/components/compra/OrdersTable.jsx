// DUEÑO: Emanuel (HU-45). Tabla de órdenes. Se reutiliza en el admin, en "Mis compras" y en el historial por usuario.
// Props: ordenes, rutaDetalle(orden) → ruta de la boleta, mostrarCliente (true por defecto)
import { Link } from 'react-router-dom'
import { formatoCLP } from '../../utils/formatoCLP.js'
import EstadoBadge from './EstadoBadge.jsx'
import { formatearFecha } from './ordenes.js'

export default function OrdersTable({ ordenes, rutaDetalle, mostrarCliente = true }) {
  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Número</th>
            <th scope="col" className="d-none d-sm-table-cell">Fecha</th>
            {mostrarCliente && <th scope="col">Cliente</th>}
            <th scope="col" className="text-end">Total</th>
            <th scope="col">Estado</th>
            <th scope="col" className="text-end d-none d-sm-table-cell">
              <span className="visually-hidden">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.numero}>
              {/* En celulares el número es el enlace a la boleta (la columna del botón se oculta) */}
              <td className="fw-semibold">
                <Link to={rutaDetalle(orden)} className="link-light">{orden.numero}</Link>
              </td>
              <td className="d-none d-sm-table-cell text-nowrap">{formatearFecha(orden.fecha, false)}</td>
              {mostrarCliente && (
                <td>
                  {orden.cliente.nombre} {orden.cliente.apellidos}
                  <div className="small text-secondary d-none d-md-block">{orden.cliente.correo}</div>
                </td>
              )}
              <td className="text-end text-nowrap">{formatoCLP(orden.total)}</td>
              <td><EstadoBadge estado={orden.estado} /></td>
              <td className="text-end d-none d-sm-table-cell">
                <Link to={rutaDetalle(orden)} className="btn btn-sm btn-outline-info text-nowrap">
                  Ver boleta
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
