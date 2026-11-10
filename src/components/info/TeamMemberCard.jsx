// Tarjeta de un integrante del equipo. Creada por Maximiliano (HU-42); el área va en un chip de estilo gamer (CF-06).
export default function TeamMemberCard({ integrante }) {
  return (
    <div className="card card-juego h-100 text-center">
      <div className="card-body">
        <img src={integrante.foto} alt={integrante.nombre} className="rounded-circle foto-equipo border border-2 border-info mb-3" />
        <h3 className="h5 card-title mb-2">{integrante.nombre}</h3>
        <span className="chip-gamer mb-3">{integrante.rol}</span>
        <p className="card-text small text-secondary mt-3 mb-0">{integrante.descripcion}</p>
      </div>
    </div>
  )
}
