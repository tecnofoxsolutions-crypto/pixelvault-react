// DUEÑO: Maximiliano (HU-42). Misión, visión y equipo generado desde un arreglo.
import TeamMemberCard from '../../components/info/TeamMemberCard.jsx'

const EQUIPO = [
  { id: 1, nombre: 'Jim Charles', rol: 'Administración y datos', foto: '/img/jim_charles.jpg', descripcion: 'Arma la base del proyecto, el inicio de sesión y el panel de administración.' },
  { id: 2, nombre: 'Emanuel Reyes', rol: 'Carrito y compras', foto: '/img/emanuel_reyes.jpg', descripcion: 'Se encarga del carrito, el checkout, el pago y las boletas.' },
  { id: 3, nombre: 'Maximiliano Peral', rol: 'Tienda y catálogo', foto: '/img/maximiliano_peral.jpg', descripcion: 'Diseña la tienda pública: catálogo, categorías, ofertas y portada.' },
]

const PILARES = [
  { titulo: 'Misión', texto: 'Ofrecer videojuegos en formato físico originales, a precios justos y con despacho a todo Chile, para que cada jugador sea dueño real de su colección.' },
  { titulo: 'Visión', texto: 'Ser la tienda de referencia en Chile para coleccionistas y jugadores que valoran el disco y el cartucho como parte de la historia del videojuego.' },
]

export default function Nosotros() {
  return (
    <div className="container py-4">
      <h1 className="font-arcade h3 mb-4">Nosotros</h1>
      <div className="row g-4 mb-5">
        {PILARES.map((pilar) => (
          <div key={pilar.titulo} className="col-12 col-md-6">
            <div className="card card-juego h-100">
              <div className="card-body">
                <h2 className="h5 text-info">{pilar.titulo}</h2>
                <p className="card-text mb-0">{pilar.texto}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="font-arcade h4 mb-4">Nuestro equipo</h2>
      <div className="row g-4">
        {EQUIPO.map((integrante) => (
          <div key={integrante.id} className="col-12 col-md-4">
            <TeamMemberCard integrante={integrante} />
          </div>
        ))}
      </div>
    </div>
  )
}
