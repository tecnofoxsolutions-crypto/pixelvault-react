// Formulario de artículo del blog para crear (articulo = null) o editar (CF-13).
// Props: articulo, autorPorDefecto, onGuardar(datos), onCancelar()
import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import SelectField from '../common/SelectField.jsx'
import categoriasBlog from '../../data/categoriasBlog.js'
import { requerido, validarLargo } from '../../utils/validaciones.js'
import { comprimirImagen } from '../../utils/imagen.js'
import { crearSlug, htmlATexto, textoAHtml, tiempoLectura } from '../../utils/articulos.js'

function aFormulario(articulo, autorPorDefecto) {
  return {
    titulo: articulo?.titulo ?? '',
    categoria: articulo?.categoria ?? '',
    resumen: articulo?.resumen ?? '',
    contenido: articulo ? htmlATexto(articulo.cuerpo) : '',
    imagen: articulo?.imagen ?? '',
    autor: articulo?.autor ?? autorPorDefecto,
  }
}

function validar(form) {
  return {
    titulo: requerido(form.titulo, 'el título') ?? validarLargo(form.titulo, 5, 120, 'El título'),
    categoria: requerido(form.categoria, 'la categoría'),
    resumen: requerido(form.resumen, 'el resumen') ?? validarLargo(form.resumen, 20, 300, 'El resumen'),
    contenido: requerido(form.contenido, 'el contenido') ?? validarLargo(form.contenido, 50, 8000, 'El contenido'),
    imagen: requerido(form.imagen, 'la imagen'),
    autor: requerido(form.autor, 'el autor'),
  }
}

export default function ArticleForm({ articulo, autorPorDefecto, onGuardar, onCancelar }) {
  const esNuevo = !articulo
  const [form, setForm] = useState(() => aFormulario(articulo, autorPorDefecto))
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [errorImagen, setErrorImagen] = useState('')

  const errores = validar(form)
  const hayErrores = Object.values(errores).some(Boolean)
  const errorDe = (campo) => (tocados[campo] || intentoEnviar ? errores[campo] : null)

  function cambiar(evento) {
    const { name, value } = evento.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setTocados((actual) => ({ ...actual, [name]: true }))
  }

  // La imagen puede ser una URL o un archivo del equipo (se guarda comprimida en base64, como en la Evaluación 1)
  async function subirImagen(evento) {
    setErrorImagen('')
    try {
      const dataUrl = await comprimirImagen(evento.target.files[0], 1200)
      setForm((actual) => ({ ...actual, imagen: dataUrl }))
    } catch (e) {
      setErrorImagen(e.message)
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    setIntentoEnviar(true)
    if (hayErrores) return

    const categoria = categoriasBlog.find((c) => c.valor === form.categoria)
    onGuardar({
      titulo: form.titulo.trim(),
      slug: crearSlug(form.titulo),
      categoria: categoria.valor,
      nombreCategoria: categoria.texto,
      badgeColor: categoria.badgeColor,
      resumen: form.resumen.trim(),
      cuerpo: textoAHtml(form.contenido),
      tiempoLectura: tiempoLectura(form.contenido),
      imagen: form.imagen.trim(),
      autor: form.autor.trim(),
    })
  }

  const propsDeCampo = (campo) => ({ id: campo, value: form[campo], onChange: cambiar, error: errorDe(campo) })
  const esArchivo = form.imagen.startsWith('data:')

  return (
    <form onSubmit={manejarEnvio} noValidate>
      {intentoEnviar && hayErrores && <div className="alert alert-warning">Revisa los campos marcados en rojo.</div>}

      <div className="row">
        <div className="col-12 col-lg-8">
          <FormField {...propsDeCampo('titulo')} label="Título" requerido maxLength={120} />
          <div className="row">
            <div className="col-12 col-md-6">
              <SelectField {...propsDeCampo('categoria')} label="Categoría" requerido opciones={categoriasBlog.map((c) => ({ valor: c.valor, texto: c.texto }))} />
            </div>
            <div className="col-12 col-md-6">
              <FormField {...propsDeCampo('autor')} label="Autor" requerido maxLength={60} />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="resumen" className="form-label">Resumen <span className="text-danger">*</span></label>
            <textarea id="resumen" name="resumen" rows={2} maxLength={300} className={`form-control ${errorDe('resumen') ? 'is-invalid' : ''}`} value={form.resumen} onChange={cambiar} />
            {errorDe('resumen') && <div className="invalid-feedback">{errorDe('resumen')}</div>}
            <div className="form-text">Se muestra en la tarjeta del blog. {form.resumen.length}/300</div>
          </div>
          <div className="mb-3">
            <label htmlFor="contenido" className="form-label">Contenido <span className="text-danger">*</span></label>
            <textarea id="contenido" name="contenido" rows={10} className={`form-control ${errorDe('contenido') ? 'is-invalid' : ''}`} value={form.contenido} onChange={cambiar} />
            {errorDe('contenido') && <div className="invalid-feedback">{errorDe('contenido')}</div>}
            <div className="form-text">Separa los párrafos con una línea en blanco. {tiempoLectura(form.contenido)}</div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <FormField
            id="imagen"
            label="Imagen (URL)"
            requerido
            value={esArchivo ? '' : form.imagen}
            onChange={cambiar}
            error={errorDe('imagen')}
            placeholder={esArchivo ? 'Imagen subida desde el equipo' : 'https://… o /img/…'}
          />
          <div className="mb-3">
            <label htmlFor="archivoImagen" className="form-label small">…o súbela desde tu equipo</label>
            <input id="archivoImagen" type="file" accept="image/*" className="form-control form-control-sm" onChange={subirImagen} />
            <div className="form-text">Recomendado: 1200 × 675 px (16:9).</div>
            {errorImagen && <div className="text-danger small">{errorImagen}</div>}
          </div>
          <div className="ratio ratio-16x9 bg-black rounded border border-secondary mb-3 overflow-hidden">
            {form.imagen ? (
              <img src={form.imagen} alt="Vista previa de la portada" className="object-fit-cover" />
            ) : (
              <span className="d-flex align-items-center justify-content-center text-secondary small">Sin imagen</span>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-light" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{esNuevo ? 'Publicar artículo' : 'Guardar cambios'}</button>
      </div>
    </form>
  )
}
