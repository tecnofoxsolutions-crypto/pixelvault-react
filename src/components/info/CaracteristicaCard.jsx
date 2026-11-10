// Tarjeta de una característica de la tienda con borde RGB animado (CF-01). Props: icono, titulo, texto
export default function CaracteristicaCard({ icono, titulo, texto }) {
  return (
    <div className="card card-rgb h-100 text-center p-3">
      <div className="card-body">
        <div className="display-6 mb-2" aria-hidden="true">{icono}</div>
        <h3 className="h5 text-light">{titulo}</h3>
        <p className="card-text small text-secondary mb-0">{texto}</p>
      </div>
    </div>
  )
}
