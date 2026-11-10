// DUEÑO: Maximiliano (tarjeta TEC-03). Pie de página de todas las páginas de la tienda.
import { Link } from 'react-router-dom'

const enlacesTienda = [
  { to: '/productos', texto: 'Productos' },
  { to: '/categorias', texto: 'Categorías' },
  { to: '/ofertas', texto: 'Ofertas' },
]
const enlacesAyuda = [
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blog', texto: 'Blog' },
  { to: '/contacto', texto: 'Contacto' },
]

function ListaEnlaces({ titulo, enlaces }) {
  return (
    <div className="col-6 col-md-3">
      <h2 className="h6 text-light">{titulo}</h2>
      <ul className="list-unstyled small mb-0">
        {enlaces.map((enlace) => (
          <li key={enlace.to} className="mb-1">
            <Link className="link-secondary text-decoration-none" to={enlace.to}>{enlace.texto}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="footer-steam py-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <p className="font-arcade text-light mb-2">PixelVault</p>
            <p className="small mb-0">
              Tienda de videojuegos físicos: ediciones de colección, cartuchos y cajas originales con despacho a todo Chile.
            </p>
          </div>
          <ListaEnlaces titulo="Tienda" enlaces={enlacesTienda} />
          <ListaEnlaces titulo="PixelVault" enlaces={enlacesAyuda} />
        </div>
        <hr className="border-secondary" />
        <p className="small text-center mb-0">
          © {anio} PixelVault · DSY1104 Desarrollo Fullstack II · Duoc UC
        </p>
      </div>
    </footer>
  )
}
