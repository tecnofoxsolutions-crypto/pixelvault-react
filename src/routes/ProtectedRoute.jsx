// Protege rutas por sesión y rol.
// <ProtectedRoute />                          → solo pide sesión iniciada
// <ProtectedRoute roles={['Administrador']} /> → además exige uno de esos roles
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ roles, children }) {
  const { usuario, tieneRol } = useAuth()
  const ubicacion = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (roles && !tieneRol(roles)) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 text-light">Acceso denegado</h1>
        <p className="text-secondary">Tu cuenta no tiene permisos para ver esta sección.</p>
        <Link to="/" className="btn btn-outline-info">Volver a la tienda</Link>
      </div>
    )
  }

  return children ?? <Outlet />
}
