// Tarjeta clicable que lleva a una sección del admin.
// <AccesoRapido to="/admin/ordenes" icono="🧾" titulo="Órdenes" descripcion="..." />
import { Link } from 'react-router-dom'

export default function AccesoRapido({ to, icono, titulo, descripcion }) {
  return (
    <Link to={to} className="card card-juego h-100 text-decoration-none text-center p-3">
      <div className="fs-2 mb-1" aria-hidden="true">{icono}</div>
      <div className="fw-bold text-light">{titulo}</div>
      <div className="small text-secondary">{descripcion}</div>
    </Link>
  )
}
