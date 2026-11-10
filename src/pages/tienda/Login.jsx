// DUEÑO: Jim (tarjeta HU-40).
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { esStaff } from '../../data/permisos.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import FormField from '../../components/common/FormField.jsx'
import CuentasDemo from '../../components/auth/CuentasDemo.jsx'
import cuentasDemo from '../../data/cuentasDemo.js'

export default function Login() {
  const { usuario, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [identificador, setIdentificador] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  // Página a la que el usuario intentaba entrar antes de que lo mandaran al login
  const destino = location.state?.desde

  function manejarEnvio(evento) {
    evento.preventDefault()
    if (!identificador.trim() || !clave) {
      setError('Ingresa tu usuario o correo y tu contraseña')
      return
    }

    const resultado = login(identificador, clave)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    // Todo el staff entra directo al Panel Staff (CF-16); el cliente vuelve a la tienda
    if (esStaff(resultado.usuario)) {
      navigate(destino?.startsWith('/admin') ? destino : '/admin')
    } else {
      navigate(destino && !destino.startsWith('/admin') ? destino : '/')
    }
  }

  function usarCuentaDemo(cuenta) {
    setIdentificador(cuenta.usuario)
    setClave(cuenta.clave)
    setError('')
  }

  if (usuario) {
    return (
      <div className="container py-5" style={{ maxWidth: 480 }}>
        <div className="card card-juego p-4 text-center">
          <h1 className="h4 text-light">Ya iniciaste sesión</h1>
          <p className="text-secondary">Estás conectado como <strong className="text-info">{usuario.nombre}</strong> ({usuario.rol}).</p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Link to={esStaff(usuario) ? '/admin' : '/'} className="btn btn-primary">Continuar</Link>
            <button className="btn btn-outline-light" onClick={logout}>Cerrar sesión</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: 480 }}>
      <div className="text-center mb-3">
        <span className="h4 fw-bold font-arcade"><span className="text-info">Pixel</span>Vault</span>
        <p className="text-secondary small mb-0">Ingresa con tus credenciales para continuar.</p>
      </div>

      <div className="card card-juego shadow">
        <div className="card-body p-4">
          <h1 className="h4 mb-3 text-light">Iniciar sesión</h1>

          {destino && !error && (
            <AlertMessage tipo="info" mensaje="Inicia sesión para continuar a la página que pediste." />
          )}
          <AlertMessage tipo="danger" mensaje={error} onCerrar={() => setError('')} />

          <form onSubmit={manejarEnvio} noValidate>
            <FormField
              id="identificador"
              label="Usuario o correo"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              autoComplete="username"
              maxLength={60}
              autoFocus
            />
            <FormField
              id="clave"
              label="Contraseña"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              maxLength={30}
            />
            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">Entrar a PixelVault</button>
          </form>

          <p className="text-center small mb-0">
            <span className="text-secondary">¿No tienes una cuenta? </span>
            <Link to="/registro" className="text-info fw-bold text-decoration-none">Regístrate aquí</Link>
          </p>
        </div>
      </div>

      <CuentasDemo cuentas={cuentasDemo} onSeleccionar={usarCuentaDemo} />
    </div>
  )
}
