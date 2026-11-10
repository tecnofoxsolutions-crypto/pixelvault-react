// DUEÑO: Jim (tarjeta HU-47). Productos con stock igual o menor a su stock crítico, los agotados primero.
import { Link } from 'react-router-dom'
import db from '../../data/db.js'

export default function StockCritico() {
  const categorias = db.getAll('categorias')
  const nombreCategoria = (id) => categorias.find((c) => String(c.id) === String(id))?.nombre ?? 'Sin categoría'

  const criticos = db
    .getAll('productos')
    .filter((p) => p.stock <= p.stockCritico)
    .sort((a, b) => a.stock - b.stock)

  const agotados = criticos.filter((p) => p.stock === 0).length

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Stock crítico</li>
        </ol>
      </nav>

      <h1 className="h3 text-light mb-1">Productos con stock crítico</h1>
      <p className="text-secondary mb-3">
        Productos cuyo stock es igual o menor al mínimo definido. Repón primero los agotados.
      </p>

      {criticos.length === 0 ? (
        <div className="alert alert-success">✅ Todo el inventario está sobre su stock crítico.</div>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge text-bg-danger fs-6">{agotados} agotados</span>
            <span className="badge text-bg-warning fs-6">{criticos.length - agotados} en el límite</span>
          </div>

          <div className="table-responsive">
            <table className="table table-dark align-middle">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col" className="d-none d-md-table-cell">Categoría</th>
                  <th scope="col" className="text-center">Stock</th>
                  <th scope="col" className="text-center">Mínimo</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="text-end">Acción</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => {
                  const agotado = p.stock === 0
                  return (
                    <tr key={p.id} className={agotado ? 'table-danger' : 'table-warning'}>
                      <td>
                        <div className="fw-semibold">{p.nombre}</div>
                        <div className="small"><code>{p.codigo}</code> · {p.plataforma}</div>
                      </td>
                      <td className="d-none d-md-table-cell">{nombreCategoria(p.categoriaId)}</td>
                      <td className="text-center fw-bold">{p.stock}</td>
                      <td className="text-center">{p.stockCritico}</td>
                      <td>{agotado ? 'Agotado' : 'En el límite'}</td>
                      <td className="text-end">
                        <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-dark">Editar</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
