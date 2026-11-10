// DUEÑO: Jim (tarjeta HU-46). Listado de productos con búsqueda, filtro por categoría, edición y eliminación.
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import db from '../../data/db.js'
import { formatoCLP } from '../../utils/formatoCLP.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'

// Color del stock: rojo si está agotado, amarillo si llegó al stock crítico
function claseStock(producto) {
  if (producto.stock === 0) return 'text-bg-danger'
  if (producto.stock <= producto.stockCritico) return 'text-bg-warning'
  return 'text-bg-secondary'
}

export default function ProductosAdmin() {
  const location = useLocation()
  const navigate = useNavigate()

  const [productos, setProductos] = useState(() => db.getAll('productos'))
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [aEliminar, setAEliminar] = useState(null)
  const [mensaje, setMensaje] = useState(location.state?.mensaje ?? '')

  const categorias = db.getAll('categorias')
  const nombreCategoria = (id) => categorias.find((c) => String(c.id) === String(id))?.nombre ?? 'Sin categoría'

  // El mensaje de "creado/actualizado" llega una sola vez: se borra del historial para que no reaparezca al recargar
  useEffect(() => {
    if (location.state?.mensaje) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])

  const texto = busqueda.trim().toLowerCase()
  const visibles = productos.filter((p) => {
    const coincideTexto = !texto || p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto)
    const coincideCategoria = !filtroCategoria || String(p.categoriaId) === filtroCategoria
    return coincideTexto && coincideCategoria
  })

  function confirmarEliminacion() {
    db.remove('productos', aEliminar.id)
    setProductos(db.getAll('productos'))
    setMensaje(`Producto "${aEliminar.nombre}" eliminado.`)
    setAEliminar(null)
  }

  return (
    <div>
      <div className="encabezado-panel d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 text-light mb-0">Productos</h1>
          <p className="text-secondary small mb-0">Mostrando {visibles.length} de {productos.length} productos</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-warning">⚠️ Stock crítico</Link>
          <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>
        </div>
      </div>

      <AlertMessage tipo="success" mensaje={mensaje} onCerrar={() => setMensaje('')} />

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-7">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o código"
            aria-label="Buscar producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-5">
          <select
            className="form-select"
            aria-label="Filtrar por categoría"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="card card-juego p-4 text-center text-secondary">
          No hay productos que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col" className="d-none d-md-table-cell">Categoría</th>
                <th scope="col" className="text-end">Precio</th>
                <th scope="col" className="text-end">Oferta</th>
                <th scope="col" className="text-center">Stock</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={p.imagen} alt="" width="48" height="48" className="rounded object-fit-cover flex-shrink-0" />
                      <div>
                        <div className="fw-semibold">{p.nombre}</div>
                        <div className="small text-secondary">
                          <code>{p.codigo}</code> · {p.plataforma}
                          {!p.activo && <span className="badge text-bg-secondary ms-1">Oculto</span>}
                          {p.destacado && <span className="badge text-bg-info ms-1">Destacado</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell">{nombreCategoria(p.categoriaId)}</td>
                  <td className="text-end text-nowrap">{formatoCLP(p.precio)}</td>
                  <td className="text-end text-nowrap">
                    {p.precioOferta ? <span className="text-success fw-semibold">{formatoCLP(p.precioOferta)}</span> : <span className="text-secondary">—</span>}
                  </td>
                  <td className="text-center"><span className={`badge ${claseStock(p)}`}>{p.stock}</span></td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-info me-1">Editar</Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setAEliminar(p)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        abierto={aEliminar !== null}
        titulo="Eliminar producto"
        mensaje={aEliminar && <>¿Seguro que quieres eliminar <strong>{aEliminar.nombre}</strong>? Dejará de verse en la tienda. Esta acción no se puede deshacer.</>}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  )
}
