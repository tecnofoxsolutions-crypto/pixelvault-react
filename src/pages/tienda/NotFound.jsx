// DUEÑO: Maximiliano (HU-42). Página 404 para cualquier ruta inexistente.
import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <div className="container py-5 text-center">
      <p className="font-arcade display-4 text-info mb-3">404</p>
      <h1 className="h3 mb-3">Página no encontrada</h1>
      <p className="text-secondary mb-4">
        La dirección <code>{pathname}</code> no existe en Pixel Vault.
      </p>
      <Link to="/" className="btn btn-info">Volver al inicio</Link>
    </div>
  )
}
