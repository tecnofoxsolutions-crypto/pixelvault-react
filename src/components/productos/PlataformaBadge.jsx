// DUEÑO: Maximiliano (HU-32). Insignia de color según la plataforma del juego.
const clases = {
  'PlayStation 5': 'badge-ps5',
  'Xbox Series X': 'badge-xbox',
  'Nintendo Switch': 'badge-switch',
  PC: 'badge-pc',
}

export default function PlataformaBadge({ plataforma }) {
  return <span className={`badge badge-arcade ${clases[plataforma] ?? 'bg-secondary'}`}>{plataforma}</span>
}
