// Panel de cuentas de prueba. Al hacer clic en una, avisa al padre con onSeleccionar(cuenta).
// Color y texto corto de la insignia de cada rol (el texto completo no cabe en móvil)
const insigniaPorRol = {
  Administrador: { clase: 'text-bg-primary', texto: 'Admin' },
  Operador: { clase: 'text-bg-info', texto: 'Operador' },
  Editor: { clase: 'text-bg-warning', texto: 'Editor' },
  Repartidor: { clase: 'text-bg-secondary', texto: 'Repartidor' },
  Cliente: { clase: 'text-bg-success', texto: 'Cliente' },
}

export default function CuentasDemo({ cuentas, onSeleccionar }) {
  return (
    <div className="card card-juego p-3 mt-3 border-secondary">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-1">
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-warning text-dark font-arcade" style={{ fontSize: '0.6rem' }}>MODO DEMO</span>
          <span className="small fw-bold text-light">Cuentas de prueba</span>
        </div>
        <small className="text-info">Clic para autocompletar</small>
      </div>

      <div className="row g-2">
        {cuentas.map((cuenta) => (
          <div className="col-6 col-sm-4" key={cuenta.usuario}>
            <button
              type="button"
              className="btn-demo-user w-100 h-100 p-2 rounded text-start border-0"
              onClick={() => onSeleccionar(cuenta)}
              title={`Usar la cuenta de ${cuenta.usuario}`}
            >
              <span className="d-flex align-items-center justify-content-between gap-1 mb-1">
                <span className="fw-bold text-light text-truncate small">{cuenta.usuario}</span>
                <span className={`badge ${insigniaPorRol[cuenta.rol]?.clase ?? 'text-bg-secondary'}`} style={{ fontSize: '0.6rem' }}>
                  {insigniaPorRol[cuenta.rol]?.texto ?? cuenta.rol}
                </span>
              </span>
              <span className="d-block text-secondary font-mono" style={{ fontSize: '0.7rem' }}>clave: {cuenta.clave}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
