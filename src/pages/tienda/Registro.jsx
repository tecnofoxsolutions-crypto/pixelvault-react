// DUEÑO: Jim (tarjeta HU-40).
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import db from '../../data/db.js'
import regiones from '../../data/regiones.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import FormField from '../../components/common/FormField.jsx'
import SelectField from '../../components/common/SelectField.jsx'
import { formatearRut, requerido, validarCorreo, validarLargo, validarRut } from '../../utils/validaciones.js'

const formularioVacio = {
  nombre: '',
  apellidos: '',
  rut: '',
  correo: '',
  clave: '',
  confirmacion: '',
  region: '',
  comuna: '',
  direccion: '',
}

// Devuelve un objeto { campo: 'mensaje de error' | null } con todas las reglas del formulario
function validar(form) {
  const usuarios = db.getAll('usuarios')
  const rutRepetido = usuarios.some((u) => formatearRut(u.rut) === formatearRut(form.rut))
  const correoRepetido = usuarios.some((u) => u.correo?.toLowerCase() === form.correo.trim().toLowerCase())

  return {
    nombre: requerido(form.nombre, 'el nombre') ?? validarLargo(form.nombre, 2, 50, 'El nombre'),
    apellidos: requerido(form.apellidos, 'los apellidos') ?? validarLargo(form.apellidos, 2, 60, 'Los apellidos'),
    rut: validarRut(form.rut) ?? (rutRepetido ? 'Este RUT ya está registrado' : null),
    correo: validarCorreo(form.correo) ?? (correoRepetido ? 'Este correo ya tiene una cuenta' : null),
    clave: requerido(form.clave, 'la contraseña') ?? validarLargo(form.clave, 6, 30, 'La contraseña'),
    confirmacion:
      requerido(form.confirmacion, 'la confirmación') ??
      (form.confirmacion !== form.clave ? 'Las contraseñas no coinciden' : null),
    region: requerido(form.region, 'la región'),
    comuna: requerido(form.comuna, 'la comuna'),
    direccion: requerido(form.direccion, 'la dirección') ?? validarLargo(form.direccion, 5, 100, 'La dirección'),
  }
}

export default function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(formularioVacio)
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  const errores = validar(form)
  const comunas = regiones.find((r) => r.nombre === form.region)?.comunas ?? []

  // Un error solo se muestra si el usuario ya tocó el campo o intentó enviar
  function errorDe(campo) {
    return tocados[campo] || intentoEnviar ? errores[campo] : null
  }

  function cambiar(evento) {
    const { name, value } = evento.target
    setForm((actual) => ({
      ...actual,
      [name]: value,
      // Al cambiar de región, la comuna anterior deja de ser válida
      ...(name === 'region' ? { comuna: '' } : {}),
    }))
    setTocados((actual) => ({ ...actual, [name]: true }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    setIntentoEnviar(true)
    const hayErrores = Object.values(errores).some(Boolean)
    if (hayErrores) return

    const { confirmacion, ...datos } = form
    const resultado = registrar({
      ...datos,
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      rut: formatearRut(datos.rut),
      direccion: datos.direccion.trim(),
    })
    if (!resultado.ok) {
      setErrorGeneral(resultado.error)
      return
    }
    navigate('/')
  }

  const propsDeCampo = (campo) => ({ id: campo, value: form[campo], onChange: cambiar, error: errorDe(campo) })

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: 720 }}>
      <div className="card card-juego shadow">
        <div className="card-body p-4">
          <h1 className="h4 mb-1 text-light">Crear cuenta de cliente</h1>
          <p className="text-secondary small mb-4">Los campos con <span className="text-danger">*</span> son obligatorios.</p>

          <AlertMessage tipo="danger" mensaje={errorGeneral} onCerrar={() => setErrorGeneral('')} />
          {intentoEnviar && Object.values(errores).some(Boolean) && (
            <AlertMessage tipo="warning" mensaje="Revisa los campos marcados en rojo." />
          )}

          <form onSubmit={manejarEnvio} noValidate>
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
                <FormField {...propsDeCampo('clave')} label="Contraseña" type="password" requerido maxLength={30} autoComplete="new-password" placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="col-12 col-md-6">
                <FormField {...propsDeCampo('confirmacion')} label="Confirmar contraseña" type="password" requerido maxLength={30} autoComplete="new-password" />
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
                <FormField {...propsDeCampo('direccion')} label="Dirección" requerido maxLength={100} autoComplete="street-address" placeholder="Calle, número y depto." />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">Crear cuenta</button>
          </form>

          <p className="text-center small mb-0">
            <span className="text-secondary">¿Ya tienes una cuenta? </span>
            <Link to="/login" className="text-info fw-bold text-decoration-none">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
