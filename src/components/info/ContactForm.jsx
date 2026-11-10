// DUEÑO: Maximiliano (HU-42). Formulario de contacto con validación mientras se escribe.
import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import SelectField from '../common/SelectField.jsx'
import { requerido, validarCorreo, validarLargo } from '../../utils/validaciones.js'

export const MAX_MENSAJE = 500
const ASUNTOS = ['Consulta sobre un producto', 'Estado de mi pedido', 'Reclamo o devolución', 'Otro']
const VACIO = { nombre: '', correo: '', asunto: '', mensaje: '' }

function validar(datos) {
  return {
    nombre: requerido(datos.nombre, 'tu nombre') || validarLargo(datos.nombre, 3, 60, 'El nombre'),
    correo: validarCorreo(datos.correo),
    asunto: requerido(datos.asunto, 'el asunto'),
    mensaje: requerido(datos.mensaje, 'el mensaje') || validarLargo(datos.mensaje, 10, MAX_MENSAJE, 'El mensaje'),
  }
}

export default function ContactForm({ onEnviar }) {
  const [datos, setDatos] = useState(VACIO)
  const [tocados, setTocados] = useState({})
  const errores = validar(datos)
  const hayErrores = Object.values(errores).some(Boolean)

  function cambiar(e) {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
    setTocados({ ...tocados, [name]: true })
  }

  function enviar(e) {
    e.preventDefault()
    if (hayErrores) {
      setTocados({ nombre: true, correo: true, asunto: true, mensaje: true })
      return
    }
    onEnviar({ ...datos, nombre: datos.nombre.trim(), correo: datos.correo.trim(), mensaje: datos.mensaje.trim() })
    setDatos(VACIO)
    setTocados({})
  }

  const error = (campo) => (tocados[campo] ? errores[campo] : null)

  return (
    <form onSubmit={enviar} noValidate>
      <FormField id="nombre" label="Nombre" value={datos.nombre} onChange={cambiar} error={error('nombre')} requerido />
      <FormField id="correo" label="Correo" type="email" value={datos.correo} onChange={cambiar} error={error('correo')} requerido />
      <SelectField id="asunto" label="Asunto" value={datos.asunto} onChange={cambiar} opciones={ASUNTOS} error={error('asunto')} requerido />
      <div className="mb-3">
        <label htmlFor="mensaje" className="form-label">
          Mensaje<span className="text-danger"> *</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="5"
          className={`form-control ${error('mensaje') ? 'is-invalid' : ''}`}
          value={datos.mensaje}
          onChange={cambiar}
        />
        {error('mensaje') && <div className="invalid-feedback">{error('mensaje')}</div>}
        <div className={`form-text text-end ${datos.mensaje.length > MAX_MENSAJE ? 'text-danger' : ''}`}>
          {datos.mensaje.length}/{MAX_MENSAJE}
        </div>
      </div>
      <button type="submit" className="btn btn-info w-100">Enviar mensaje</button>
    </form>
  )
}
