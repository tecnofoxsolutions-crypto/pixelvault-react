// Formulario de usuario para crear (usuario = null) o editar.
// Props:
//   usuario             → usuario a editar, o null para uno nuevo
//   otrosUsuarios       → el resto de los usuarios (para no repetir RUT ni correo)
//   esUsuarioActual     → true si el admin se está editando a sí mismo: no puede cambiar su rol ni desactivarse
//   onGuardar(datos), onCancelar()
import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import SelectField from '../common/SelectField.jsx'
import regiones from '../../data/regiones.js'
import roles from '../../data/roles.js'
import { formatearRut, requerido, validarCorreo, validarLargo, validarRut } from '../../utils/validaciones.js'

function aFormulario(usuario) {
  return {
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    rut: usuario?.rut ?? '',
    correo: usuario?.correo ?? '',
    clave: '',
    rol: usuario?.rol ?? 'Cliente',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    direccion: usuario?.direccion ?? '',
    activo: usuario?.activo ?? true,
  }
}

function validar(form, otrosUsuarios, esNuevo) {
  const rutRepetido = otrosUsuarios.some((u) => formatearRut(u.rut) === formatearRut(form.rut))
  const correoRepetido = otrosUsuarios.some((u) => u.correo?.toLowerCase() === form.correo.trim().toLowerCase())

  return {
    nombre: requerido(form.nombre, 'el nombre') ?? validarLargo(form.nombre, 2, 50, 'El nombre'),
    apellidos: requerido(form.apellidos, 'los apellidos') ?? validarLargo(form.apellidos, 2, 60, 'Los apellidos'),
    rut: validarRut(form.rut) ?? (rutRepetido ? 'Este RUT ya está registrado' : null),
    correo: validarCorreo(form.correo) ?? (correoRepetido ? 'Este correo ya está registrado' : null),
    // Al crear la contraseña es obligatoria; al editar, vacía significa "no cambiarla"
    clave: esNuevo || form.clave
      ? requerido(form.clave, 'la contraseña') ?? validarLargo(form.clave, 6, 30, 'La contraseña')
      : null,
    rol: requerido(form.rol, 'el rol'),
    region: requerido(form.region, 'la región'),
    comuna: requerido(form.comuna, 'la comuna'),
    direccion: requerido(form.direccion, 'la dirección') ?? validarLargo(form.direccion, 5, 100, 'La dirección'),
  }
}

export default function UserForm({ usuario, otrosUsuarios, esUsuarioActual = false, onGuardar, onCancelar }) {
  const esNuevo = !usuario
  const [form, setForm] = useState(() => aFormulario(usuario))
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)

  const errores = validar(form, otrosUsuarios, esNuevo)
  const hayErrores = Object.values(errores).some(Boolean)
  const comunas = regiones.find((r) => r.nombre === form.region)?.comunas ?? []

  function errorDe(campo) {
    return tocados[campo] || intentoEnviar ? errores[campo] : null
  }

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target
    setForm((actual) => ({
      ...actual,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'region' ? { comuna: '' } : {}),
    }))
    setTocados((actual) => ({ ...actual, [name]: true }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    setIntentoEnviar(true)
    if (hayErrores) return

    const datos = {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      rut: formatearRut(form.rut),
      correo: form.correo.trim().toLowerCase(),
      rol: form.rol,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
      activo: form.activo,
    }
    if (form.clave) datos.clave = form.clave
    onGuardar(datos)
  }

  const propsDeCampo = (campo) => ({ id: campo, value: form[campo], onChange: cambiar, error: errorDe(campo) })

  return (
    <form onSubmit={manejarEnvio} noValidate>
      {intentoEnviar && hayErrores && <div className="alert alert-warning">Revisa los campos marcados en rojo.</div>}
      {esUsuarioActual && (
        <div className="alert alert-info small">
          Estás editando tu propia cuenta: no puedes cambiar tu rol ni desactivarte.
        </div>
      )}

      <div className="row">
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('nombre')} label="Nombre" requerido maxLength={50} />
        </div>
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('apellidos')} label="Apellidos" requerido maxLength={60} />
        </div>
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('rut')} label="RUT" requerido maxLength={12} placeholder="12345678-9" />
        </div>
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('correo')} label="Correo" type="email" requerido maxLength={80} />
        </div>
        <div className="col-12 col-md-6">
          <FormField
            {...propsDeCampo('clave')}
            label={esNuevo ? 'Contraseña' : 'Nueva contraseña (opcional)'}
            type="password"
            requerido={esNuevo}
            maxLength={30}
            autoComplete="new-password"
            placeholder={esNuevo ? 'Mínimo 6 caracteres' : 'Déjala vacía para no cambiarla'}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectField
            {...propsDeCampo('rol')}
            label="Rol"
            requerido
            opciones={roles.map((r) => r.nombre)}
            disabled={esUsuarioActual}
          />
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
          <FormField {...propsDeCampo('direccion')} label="Dirección" requerido maxLength={100} />
        </div>
        <div className="col-12 mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="activo"
              name="activo"
              checked={form.activo}
              onChange={cambiar}
              disabled={esUsuarioActual}
            />
            <label className="form-check-label" htmlFor="activo">Cuenta activa (puede iniciar sesión)</label>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-light" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{esNuevo ? 'Crear usuario' : 'Guardar cambios'}</button>
      </div>
    </form>
  )
}
