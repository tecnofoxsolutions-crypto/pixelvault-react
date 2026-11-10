// Formulario de categoría para crear (categoria = null) o editar.
// Props: categoria, nombresExistentes (de las otras categorías, en minúsculas), onGuardar(datos), onCancelar()
import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import { requerido, validarLargo } from '../../utils/validaciones.js'

function validar(form, nombresExistentes) {
  return {
    nombre:
      requerido(form.nombre, 'el nombre') ??
      validarLargo(form.nombre, 2, 40, 'El nombre') ??
      (nombresExistentes.includes(form.nombre.trim().toLowerCase()) ? 'Ya existe una categoría con ese nombre' : null),
  }
}

export default function CategoryForm({ categoria, nombresExistentes, onGuardar, onCancelar }) {
  const esNueva = !categoria
  const [form, setForm] = useState({ nombre: categoria?.nombre ?? '', imagen: categoria?.imagen ?? '' })
  const [intentoEnviar, setIntentoEnviar] = useState(false)

  const errores = validar(form, nombresExistentes)
  // El error del nombre aparece apenas se escribe algo, o al intentar guardar
  const errorNombre = form.nombre || intentoEnviar ? errores.nombre : null

  function cambiar(evento) {
    const { name, value } = evento.target
    setForm((actual) => ({ ...actual, [name]: value }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    setIntentoEnviar(true)
    if (errores.nombre) return
    onGuardar({ nombre: form.nombre.trim(), imagen: form.imagen.trim() })
  }

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <FormField id="nombre" label="Nombre" value={form.nombre} onChange={cambiar} error={errorNombre} requerido maxLength={40} />
      <FormField id="imagen" label="Imagen (opcional)" value={form.imagen} onChange={cambiar} placeholder="/img/sf6.jpg" />
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">{esNueva ? 'Crear categoría' : 'Guardar cambios'}</button>
        {!esNueva && <button type="button" className="btn btn-outline-light" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}
