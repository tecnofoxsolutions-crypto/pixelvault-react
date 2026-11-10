// DUEÑO: Jim (tarjeta HU-48, reasignada desde Maximiliano). Crear, editar y eliminar categorías.
import { useState } from 'react'
import db from '../../data/db.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import CategoryForm from '../../components/admin/CategoryForm.jsx'

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState(() => db.getAll('categorias'))
  const [enEdicion, setEnEdicion] = useState(null)
  const [aEliminar, setAEliminar] = useState(null)
  const [aviso, setAviso] = useState({ tipo: 'success', texto: '' })
  // Cambia en cada guardado para que el formulario se vacíe (forma parte de su key)
  const [guardados, setGuardados] = useState(0)

  const productos = db.getAll('productos')
  const cantidadProductos = (categoriaId) => productos.filter((p) => String(p.categoriaId) === String(categoriaId)).length

  // Nombres de las demás categorías (al editar, la propia puede mantener su nombre)
  const nombresExistentes = categorias
    .filter((c) => !enEdicion || c.id !== enEdicion.id)
    .map((c) => c.nombre.toLowerCase())

  function guardar(datos) {
    if (enEdicion) {
      db.update('categorias', enEdicion.id, datos)
      setAviso({ tipo: 'success', texto: `Categoría "${datos.nombre}" actualizada.` })
    } else {
      db.create('categorias', datos)
      setAviso({ tipo: 'success', texto: `Categoría "${datos.nombre}" creada. Ya aparece en la tienda.` })
    }
    setCategorias(db.getAll('categorias'))
    setEnEdicion(null)
    setGuardados((n) => n + 1)
  }

  function pedirEliminar(categoria) {
    const cantidad = cantidadProductos(categoria.id)
    if (cantidad > 0) {
      setAviso({
        tipo: 'danger',
        texto: `No se puede eliminar "${categoria.nombre}": tiene ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}. Cámbialos de categoría primero.`,
      })
      return
    }
    setAEliminar(categoria)
  }

  function confirmarEliminacion() {
    db.remove('categorias', aEliminar.id)
    setCategorias(db.getAll('categorias'))
    setAviso({ tipo: 'success', texto: `Categoría "${aEliminar.nombre}" eliminada.` })
    if (enEdicion?.id === aEliminar.id) setEnEdicion(null)
    setAEliminar(null)
  }

  return (
    <div>
      <h1 className="h3 text-light mb-1">Categorías</h1>
      <p className="text-secondary small mb-3">Organizan el catálogo y aparecen en la página Categorías de la tienda.</p>

      <AlertMessage tipo={aviso.tipo} mensaje={aviso.texto} onCerrar={() => setAviso({ ...aviso, texto: '' })} />

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card card-juego">
            <div className="card-body">
              <h2 className="h5 text-light mb-3">{enEdicion ? `Editar: ${enEdicion.nombre}` : 'Nueva categoría'}</h2>
              {/* La key reinicia el formulario al cambiar de categoría y después de cada guardado */}
              <CategoryForm
                key={`${enEdicion?.id ?? 'nueva'}-${guardados}`}
                categoria={enEdicion}
                nombresExistentes={nombresExistentes}
                onGuardar={guardar}
                onCancelar={() => setEnEdicion(null)}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col" className="text-center">Productos</th>
                  <th scope="col" className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id} className={enEdicion?.id === c.id ? 'table-active' : ''}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {c.imagen ? (
                          <img src={c.imagen} alt="" width="40" height="40" className="rounded object-fit-cover" />
                        ) : (
                          <span className="d-inline-block rounded bg-secondary" style={{ width: 40, height: 40 }} />
                        )}
                        <span className="fw-semibold">{c.nombre}</span>
                      </div>
                    </td>
                    <td className="text-center"><span className="badge text-bg-secondary">{cantidadProductos(c.id)}</span></td>
                    <td className="text-end text-nowrap">
                      <button type="button" className="btn btn-sm btn-outline-info me-1" onClick={() => setEnEdicion(c)}>Editar</button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => pedirEliminar(c)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        abierto={aEliminar !== null}
        titulo="Eliminar categoría"
        mensaje={aEliminar && <>¿Seguro que quieres eliminar <strong>{aEliminar.nombre}</strong>? Esta acción no se puede deshacer.</>}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  )
}
