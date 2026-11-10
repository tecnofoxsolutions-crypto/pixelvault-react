// DUEÑO: Jim (tarjeta HU-51). Los cálculos están en utils/reportes.js; aquí solo se elige el rango y se muestra.
import { useState } from 'react'
import db from '../../data/db.js'
import { formatoCLP } from '../../utils/formatoCLP.js'
import { masVendidos, ordenesDelPeriodo, resumenVentas, valorInventario, ventasPorCategoria } from '../../utils/reportes.js'
import StatCard from '../../components/admin/StatCard.jsx'

const rangos = [
  { dias: 7, texto: 'Últimos 7 días' },
  { dias: 30, texto: 'Últimos 30 días' },
  { dias: null, texto: 'Todo' },
]

export default function Reportes() {
  const [dias, setDias] = useState(30)

  const productos = db.getAll('productos')
  const categorias = db.getAll('categorias')
  const ordenes = ordenesDelPeriodo(db.getAll('ordenes'), dias)

  const resumen = resumenVentas(ordenes)
  const porCategoria = ventasPorCategoria(ordenes, productos, categorias)
  const top = masVendidos(ordenes, 5)
  const inventario = valorInventario(productos)

  return (
    <div>
      <div className="encabezado-panel d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 text-light mb-0">Reportes</h1>
          <p className="text-secondary small mb-0">Ventas sin contar órdenes canceladas.</p>
        </div>
        <div className="btn-group" role="group" aria-label="Rango de fechas">
          {rangos.map((r) => (
            <button
              key={r.texto}
              type="button"
              className={`btn btn-sm ${dias === r.dias ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setDias(r.dias)}
              aria-pressed={dias === r.dias}
            >
              {r.texto}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard titulo="Total vendido" valor={formatoCLP(resumen.totalVendido)} icono="💰" color="success" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard titulo="Órdenes" valor={resumen.cantidadOrdenes} icono="🧾" color="primary" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard titulo="Ticket promedio" valor={formatoCLP(resumen.ticketPromedio)} icono="🎟️" color="info" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard titulo="Valor del inventario" valor={formatoCLP(inventario)} detalle="A precio de venta actual" icono="📦" color="warning" />
        </div>
      </div>

      {ordenes.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">
          Sin ventas en este período. Prueba con un rango más amplio.
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="card card-juego h-100">
              <div className="card-body">
                <h2 className="h5 text-light mb-3">Ventas por categoría</h2>
                {porCategoria.map((c) => (
                  <div key={c.nombre} className="mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-light">{c.nombre}</span>
                      <span className="text-secondary">{formatoCLP(c.monto)} · {c.porcentaje}%</span>
                    </div>
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label={`Ventas de ${c.nombre}`}
                      aria-valuenow={c.porcentaje}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div className="progress-bar bg-info" style={{ width: `${c.porcentaje}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card card-juego h-100">
              <div className="card-body">
                <h2 className="h5 text-light mb-3">Top {top.length} más vendidos</h2>
                <div className="table-responsive">
                  <table className="table table-dark table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Producto</th>
                        <th scope="col" className="text-center">Unidades</th>
                        <th scope="col" className="text-end">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top.map((p, indice) => (
                        <tr key={p.productoId}>
                          <td>{indice + 1}</td>
                          <td>{p.nombre}</td>
                          <td className="text-center">{p.unidades}</td>
                          <td className="text-end text-nowrap">{formatoCLP(p.monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
