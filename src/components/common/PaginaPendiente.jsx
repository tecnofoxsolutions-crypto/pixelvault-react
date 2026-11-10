// Marcador temporal para páginas que todavía no se programan. Cada dueño lo reemplaza por su página real.
export default function PaginaPendiente({ titulo, responsable, tarjeta, ruta }) {
  return (
    <div className="container py-5">
      <div className="card bg-dark border-secondary text-light">
        <div className="card-body">
          <h1 className="h3">{titulo}</h1>
          <p className="text-secondary mb-1">Página pendiente · Ruta: <code>{ruta}</code></p>
          <p className="text-secondary mb-0">
            Responsable: <strong className="text-info">{responsable}</strong> · Tarjeta Trello: <strong>{tarjeta}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
