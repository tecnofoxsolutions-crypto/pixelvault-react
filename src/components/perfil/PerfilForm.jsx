// DUEÑO: Emanuel (HU-52). Formulario de datos personales del usuario en sesión.
// Props: usuario (datos actuales), onGuardar(datos) → { ok, error }
import { useState } from 'react'
import regiones from '../../data/regiones.js'
import AlertMessage from '../common/AlertMessage.jsx'
import FormField from '../common/FormField.jsx'
import SelectField from '../common/SelectField.jsx'
import { requerido, validarCorreo, validarLargo, validarRut } from '../../utils/validaciones.js'

function validar(form) {
  return {
    nombre: requerido(form.nombre, 'el nombre') ?? validarLargo(form.nombre, 2, 50, 'El nombre'),
    apellidos: requerido(form.apellidos, 'los apellidos') ?? validarLargo(form.apellidos, 2, 60, 'Los apellidos'),
    rut: validarRut(form.rut),
    correo: validarCorreo(form.correo),
    region: requerido(form.region, 'la región'),
    comuna: requerido(form.comuna, 'la comuna'),
    direccion: requerido(form.direccion, 'la dirección') ?? validarLargo(form.direccion, 5, 100, 'La dirección'),
  }
}

export default function PerfilForm({ usuario, onGuardar }) {
  const [form, setForm] = useState({
    nombre: usuario.nombre ?? '',
    apellidos: usuario.apellidos ?? '',
    rut: usuario.rut ?? '',
    correo: usuario.correo ?? '',
    region: usuario.region ?? '',
    comuna: usuario.comuna ?? '',
    direccion: usuario.direccion ?? '',
  })
  const [intentoGuardar, setIntentoGuardar] = useState(false)
  const [resultado, setResultado] = useState(null)

  const errores = validar(form)
  const comunas = regiones.find((r) => r.nombre === form.region)?.comunas ?? []

  function cambiar(evento) {
    const { name, value } = evento.target
    setForm((actual) => ({ ...actual, [name]: value, ...(name === 'region' ? { comuna: '' } : {}) }))
    setResultado(null)
  }

  function guardar(evento) {
    evento.preventDefault()
    setIntentoGuardar(true)
    if (Object.values(errores).some(Boolean)) return
    setResultado(onGuardar(form))
  }

  // Los errores se muestran después del primer intento de guardar
  const propsDeCampo = (campo) => ({
    id: campo,
    value: form[campo],
    onChange: cambiar,
    error: intentoGuardar ? errores[campo] : null,
  })

  return (
    <form onSubmit={guardar} noValidate>
      <h2 className="h5 text-info mb-3">Datos personales</h2>
      {resultado && (
        <AlertMessage
          tipo={resultado.ok ? 'success' : 'danger'}
          mensaje={resultado.ok ? 'Tus datos se guardaron.' : resultado.error}
          onCerrar={() => setResultado(null)}
        />
      )}
      <div className="row">
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('nombre')} label="Nombre" requerido maxLength={50} autoComplete="given-name" />
        </div>
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('apellidos')} label="Apellidos" requerido maxLength={60} autoComplete="family-name" />
        </div>
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('rut')} label="RUT" requerido maxLength={12} placeholder="12345678-9" />
        </div>
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('correo')} label="Correo" type="email" requerido maxLength={80} autoComplete="email" />
        </div>
        <div className="col-12 col-md-6">
          <SelectField {...propsDeCampo('region')} label="Región" requerido opciones={regiones.map((r) => r.nombre)} />
        </div>
        <div className="col-12 col-md-6">
          <SelectField
            {...propsDeCampo('comuna')}
            label="Comuna"
            requerido
            opciones={comunas}
            disabled={!form.region}
            placeholder={form.region ? 'Selecciona una comuna' : 'Primero elige una región'}
          />
        </div>
        <div className="col-12">
          <FormField {...propsDeCampo('direccion')} label="Dirección" requerido maxLength={100} autoComplete="street-address" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Guardar datos</button>
    </form>
  )
}
