// Línea de tiempo con los cambios de estado de una orden (CF-10). Props: orden
import EstadoBadge from './EstadoBadge.jsx'
import { formatearFecha } from './ordenes.js'

export default function HistorialEstados({ orden }) {
  const registros = orden.historialEstados ?? []
  if (registros.length === 0) return null

  return (
    <ol className="list-unstyled mb-0">
      {registros.map((r, indice) => (
        <li key={indice} className="d-flex flex-wrap align-items-center gap-2 small mb-2">
          <EstadoBadge estado={r.estado} />
          <span className="text-secondary">{formatearFecha(r.fecha)}</span>
          <span className="text-light">· {r.usuarioNombre}</span>
        </li>
      ))}
    </ol>
  )
}
