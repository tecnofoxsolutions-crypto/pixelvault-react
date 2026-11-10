// DUEÑO: Maximiliano (HU-42). Tarjeta de un integrante del equipo.
export default function TeamMemberCard({ integrante }) {
  return (
    <div className="card card-juego h-100 text-center">
      <div className="card-body">
        <img src={integrante.foto} alt={integrante.nombre} className="rounded-circle foto-equipo mb-3" />
        <h3 className="h5 card-title mb-1">{integrante.nombre}</h3>
        <p className="text-info small mb-2">{integrante.rol}</p>
        <p className="card-text small">{integrante.descripcion}</p>
      </div>
    </div>
  )
}
