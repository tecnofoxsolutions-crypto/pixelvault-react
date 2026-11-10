// Tarjeta de métrica del dashboard. Solo muestra lo que recibe por props.
// <StatCard titulo="Compras" valor={12} detalle="Total vendido: $500.000" icono="🛒" color="primary" />
export default function StatCard({ titulo, valor, detalle, icono, color = 'primary' }) {
  return (
    <div className={`card text-bg-${color} border-0 shadow-sm h-100`}>
      <div className="card-body d-flex align-items-center gap-3">
        <span className="display-6" aria-hidden="true">{icono}</span>
        <div>
          <div className="small text-uppercase fw-semibold opacity-75">{titulo}</div>
          <div className="fs-2 fw-bold lh-1">{valor}</div>
          {detalle && <div className="small mt-1">{detalle}</div>}
        </div>
      </div>
    </div>
  )
}
