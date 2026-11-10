// Formulario de producto: sirve para crear (producto = null) y para editar (producto = objeto de db.js).
// Props:
//   producto           → producto a editar, o null para uno nuevo
//   categorias         → [{ id, nombre }] para el selector
//   codigosExistentes  → códigos ya usados por otros productos (no se pueden repetir)
//   onGuardar(datos)   → el padre decide si crea o actualiza en db.js
//   onCancelar()
import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import SelectField from '../common/SelectField.jsx'
import plataformas from '../../data/plataformas.js'
import { requerido, validarLargo } from '../../utils/validaciones.js'

const productoVacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  precioOferta: '',
  stock: '',
  stockCritico: '2',
  categoriaId: '',
  plataforma: '',
  imagen: '',
  activo: true,
  destacado: false,
}

// Convierte el producto de db.js al formato del formulario (los inputs trabajan con textos)
function aFormulario(producto) {
  if (!producto) return productoVacio
  return {
    ...productoVacio,
    ...producto,
    precio: String(producto.precio),
    precioOferta: producto.precioOferta == null ? '' : String(producto.precioOferta),
    stock: String(producto.stock),
    stockCritico: String(producto.stockCritico),
    categoriaId: String(producto.categoriaId),
  }
}

// Siguiente código libre para una plataforma: si existe PS5-0004, devuelve PS5-0005
function siguienteCodigo(plataforma, codigosExistentes) {
  const prefijo = plataformas.find((p) => p.nombre === plataforma)?.prefijo
  if (!prefijo) return ''
  const numeros = codigosExistentes
    .filter((c) => c.startsWith(prefijo + '-'))
    .map((c) => Number(c.split('-')[1]) || 0)
  const siguiente = Math.max(0, ...numeros) + 1
  return `${prefijo}-${String(siguiente).padStart(4, '0')}`
}

function esEnteroNoNegativo(valor) {
  return /^\d+$/.test(String(valor).trim())
}

function validar(form, codigosExistentes) {
  const precio = Number(form.precio)
  const oferta = form.precioOferta.trim() === '' ? null : Number(form.precioOferta)

  return {
    codigo:
      requerido(form.codigo, 'el código') ??
      (codigosExistentes.includes(form.codigo.trim().toUpperCase()) ? 'Ya existe un producto con este código' : null),
    nombre: requerido(form.nombre, 'el nombre') ?? validarLargo(form.nombre, 3, 100, 'El nombre'),
    descripcion: requerido(form.descripcion, 'la descripción') ?? validarLargo(form.descripcion, 10, 500, 'La descripción'),
    precio:
      requerido(form.precio, 'el precio') ??
      (!Number.isInteger(precio) || precio <= 0 ? 'El precio debe ser un número entero mayor a 0' : null),
    precioOferta:
      oferta === null
        ? null
        : !Number.isInteger(oferta) || oferta <= 0
          ? 'El precio de oferta debe ser un número entero mayor a 0'
          : oferta >= precio
            ? 'El precio de oferta debe ser menor al precio normal'
            : null,
    stock:
      requerido(form.stock, 'el stock') ??
      (!esEnteroNoNegativo(form.stock) ? 'El stock debe ser un número entero, 0 o mayor (no puede ser negativo)' : null),
    stockCritico:
      requerido(form.stockCritico, 'el stock crítico') ??
      (!esEnteroNoNegativo(form.stockCritico) ? 'El stock crítico debe ser un número entero, 0 o mayor' : null),
    categoriaId: requerido(form.categoriaId, 'la categoría'),
    plataforma: requerido(form.plataforma, 'la plataforma'),
    imagen: requerido(form.imagen, 'la imagen'),
  }
}

export default function ProductForm({ producto, categorias, codigosExistentes, onGuardar, onCancelar }) {
  const esNuevo = !producto
  const [form, setForm] = useState(() => aFormulario(producto))
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)

  const errores = validar(form, codigosExistentes)
  const hayErrores = Object.values(errores).some(Boolean)

  function errorDe(campo) {
    return tocados[campo] || intentoEnviar ? errores[campo] : null
  }

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target
    const valor = type === 'checkbox' ? checked : value

    setForm((actual) => {
      const nuevo = { ...actual, [name]: valor }
      // En un producto nuevo, al elegir plataforma se propone el siguiente código libre
      if (esNuevo && name === 'plataforma') {
        nuevo.codigo = siguienteCodigo(valor, codigosExistentes)
      }
      return nuevo
    })
    setTocados((actual) => ({ ...actual, [name]: true }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    setIntentoEnviar(true)
    if (hayErrores) return

    onGuardar({
      codigo: form.codigo.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      precioOferta: form.precioOferta.trim() === '' ? null : Number(form.precioOferta),
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico),
      categoriaId: Number(form.categoriaId),
      plataforma: form.plataforma,
      imagen: form.imagen.trim(),
      activo: form.activo,
      destacado: form.destacado,
    })
  }

  const propsDeCampo = (campo) => ({ id: campo, value: form[campo], onChange: cambiar, error: errorDe(campo) })

  return (
    <form onSubmit={manejarEnvio} noValidate>
      {intentoEnviar && hayErrores && (
        <div className="alert alert-warning">Revisa los campos marcados en rojo.</div>
      )}

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="row">
            <div className="col-12 col-md-6">
              <SelectField
                {...propsDeCampo('plataforma')}
                label="Plataforma"
                requerido
                opciones={plataformas.map((p) => p.nombre)}
              />
            </div>
            <div className="col-12 col-md-6">
              <FormField {...propsDeCampo('codigo')} label="Código" requerido maxLength={12} placeholder="Se genera al elegir plataforma" />
            </div>
            <div className="col-12">
              <FormField {...propsDeCampo('nombre')} label="Nombre" requerido maxLength={100} />
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción <span className="text-danger">*</span></label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={3}
                maxLength={500}
                className={`form-control ${errorDe('descripcion') ? 'is-invalid' : ''}`}
                value={form.descripcion}
                onChange={cambiar}
              />
              {errorDe('descripcion') && <div className="invalid-feedback">{errorDe('descripcion')}</div>}
              <div className="form-text">{form.descripcion.length}/500 caracteres</div>
            </div>
            <div className="col-12 col-md-6">
              <SelectField
                {...propsDeCampo('categoriaId')}
                label="Categoría"
                requerido
                opciones={categorias.map((c) => ({ valor: String(c.id), texto: c.nombre }))}
              />
            </div>
            <div className="col-6 col-md-3">
              <FormField {...propsDeCampo('stock')} label="Stock" type="number" min="0" step="1" requerido />
            </div>
            <div className="col-6 col-md-3">
              <FormField {...propsDeCampo('stockCritico')} label="Stock crítico" type="number" min="0" step="1" requerido />
            </div>
            <div className="col-6">
              <FormField {...propsDeCampo('precio')} label="Precio (CLP)" type="number" min="1" step="1" requerido />
            </div>
            <div className="col-6">
              <FormField {...propsDeCampo('precioOferta')} label="Precio oferta (opcional)" type="number" min="1" step="1" placeholder="Sin oferta" />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <FormField {...propsDeCampo('imagen')} label="Imagen (ruta o URL)" requerido placeholder="/img/witcher3.jpg" />
          <div className="ratio ratio-4x3 bg-black rounded border border-secondary mb-3 overflow-hidden">
            {form.imagen ? (
              <img src={form.imagen} alt="Vista previa del producto" className="object-fit-contain" />
            ) : (
              <span className="d-flex align-items-center justify-content-center text-secondary small">Sin imagen</span>
            )}
          </div>
          <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" role="switch" id="activo" name="activo" checked={form.activo} onChange={cambiar} />
            <label className="form-check-label" htmlFor="activo">Visible en la tienda</label>
          </div>
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" role="switch" id="destacado" name="destacado" checked={form.destacado} onChange={cambiar} />
            <label className="form-check-label" htmlFor="destacado">Destacado en el inicio</label>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-light" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{esNuevo ? 'Crear producto' : 'Guardar cambios'}</button>
      </div>
    </form>
  )
}
