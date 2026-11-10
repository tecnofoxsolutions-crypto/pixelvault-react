// DUEÑO: Emanuel (HU-52). Cambio de contraseña: exige la contraseña actual.
// Props: onCambiar({ claveActual, claveNueva }) → { ok, error }
import { useState } from 'react'
import AlertMessage from '../common/AlertMessage.jsx'
import FormField from '../common/FormField.jsx'
import { requerido, validarLargo } from '../../utils/validaciones.js'

const vacio = { claveActual: '', claveNueva: '', confirmacion: '' }

function validar(form) {
  return {
    claveActual: requerido(form.claveActual, 'tu contraseña actual'),
    claveNueva:
      requerido(form.claveNueva, 'la nueva contraseña') ??
      validarLargo(form.claveNueva, 6, 30, 'La nueva contraseña') ??
      (form.claveNueva === form.claveActual ? 'La nueva contraseña debe ser distinta a la actual' : null),
    confirmacion:
      requerido(form.confirmacion, 'la confirmación') ??
      (form.confirmacion !== form.claveNueva ? 'Las contraseñas no coinciden' : null),
  }
}

export default function CambioClaveForm({ onCambiar }) {
  const [form, setForm] = useState(vacio)
  const [intentoGuardar, setIntentoGuardar] = useState(false)
  const [resultado, setResultado] = useState(null)

  const errores = validar(form)

  function cambiar(evento) {
    const { name, value } = evento.target
    setForm((actual) => ({ ...actual, [name]: value }))
    setResultado(null)
  }

  function guardar(evento) {
    evento.preventDefault()
    setIntentoGuardar(true)
    if (Object.values(errores).some(Boolean)) return

    const respuesta = onCambiar({ claveActual: form.claveActual, claveNueva: form.claveNueva })
    setResultado(respuesta)
    if (respuesta.ok) {
      // Se limpia el formulario para no dejar contraseñas escritas en pantalla
      setForm(vacio)
      setIntentoGuardar(false)
    }
  }

  const propsDeCampo = (campo) => ({
    id: campo,
    type: 'password',
    value: form[campo],
    onChange: cambiar,
    error: intentoGuardar ? errores[campo] : null,
    requerido: true,
    maxLength: 30,
  })

  return (
    <form onSubmit={guardar} noValidate>
      <h2 className="h5 text-info mb-3">Cambiar contraseña</h2>
      {resultado && (
        <AlertMessage
          tipo={resultado.ok ? 'success' : 'danger'}
          mensaje={resultado.ok ? 'Tu contraseña se actualizó.' : resultado.error}
          onCerrar={() => setResultado(null)}
        />
      )}
      <FormField {...propsDeCampo('claveActual')} label="Contraseña actual" autoComplete="current-password" />
      <FormField {...propsDeCampo('claveNueva')} label="Nueva contraseña" autoComplete="new-password" placeholder="Mínimo 6 caracteres" />
      <FormField {...propsDeCampo('confirmacion')} label="Confirmar nueva contraseña" autoComplete="new-password" />
      <button type="submit" className="btn btn-outline-info">Cambiar contraseña</button>
    </form>
  )
}
