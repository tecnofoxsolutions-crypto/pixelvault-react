// DUEÑO: Emanuel (HU-45). Etiqueta de color con el estado de una orden. Props: estado
import { CLASES_ESTADO } from './ordenes.js'

export default function EstadoBadge({ estado }) {
  return <span className={`badge ${CLASES_ESTADO[estado] ?? 'text-bg-secondary'}`}>{estado}</span>
}
