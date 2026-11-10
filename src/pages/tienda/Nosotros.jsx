// Nosotros. Creada por Maximiliano (HU-42) y completada como en la Evaluación 1 (CF-06):
// historia de PixelVault, misión y visión con más estilo, y equipo con chips de estilo gamer.
import TeamMemberCard from '../../components/info/TeamMemberCard.jsx'

const EQUIPO = [
  { id: 1, nombre: 'Jim Charles', rol: 'Administración y datos', foto: '/img/jim_charles.jpg', descripcion: 'Arquitectura del proyecto React, base de datos simulada, sesión con roles y Panel Staff.' },
  { id: 2, nombre: 'Emanuel Reyes', rol: 'Carrito y compras', foto: '/img/emanuel_reyes.jpg', descripcion: 'Carrito, checkout con región y comuna, pago simulado, boletas y órdenes.' },
  { id: 3, nombre: 'Maximiliano Peral', rol: 'Tienda y catálogo', foto: '/img/maximiliano_peral.jpg', descripcion: 'Tienda pública: catálogo con filtros, detalle de producto, blog y diseño responsivo.' },
]

const PILARES = [
  {
    icono: '🎯',
    titulo: 'Nuestra Misión',
    color: 'info',
    texto: 'Conectar a la comunidad gamer y coleccionista con un inventario verificado de títulos físicos originales, garantizando transparencia de stock, cajas en perfecto estado y una experiencia de compra ágil y moderna.',
  },
  {
    icono: '👁️',
    titulo: 'Nuestra Visión',
    color: 'success',
    texto: 'Ser el punto de encuentro y la tienda de referencia en Chile para quienes buscan preservar la memoria del videojuego físico, combinando la mística de una tienda retro con tecnología web de punta.',
  },
]

export default function Nosotros() {
  return (
    <div className="container py-4">
      {/* Historia (como el nosotros.html de la Evaluación 1) */}
      <section className="hero-steam p-4 p-md-5 mb-5">
        <div className="row align-items-center g-4 position-relative" style={{ zIndex: 1 }}>
          <div className="col-12 col-lg-7">
            <span className="badge text-bg-info badge-arcade mb-3">Nuestra Historia</span>
            <h1 className="display-6 fw-bold text-light">Preservando el Arte de los Videojuegos Físicos</h1>
            <p className="text-secondary">
              PixelVault nació como un tributo al coleccionismo gamer: el valor de abrir una caja sellada, contemplar el arte
              de portada, hojear un manual y colocar un disco o cartucho original en tu consola.
            </p>
            <p className="text-secondary mb-0">
              En un mundo donde todo migra a servicios efímeros, creemos que los verdaderos jugadores valoran poseer sus
              historias favoritas en sus estanterías. Nos especializamos en ediciones estándar, cajas metálicas (Steelbooks)
              y cartuchos para consolas de última generación y PC.
            </p>
          </div>
          <div className="col-12 col-lg-5 text-center">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80"
              alt="Colección de videojuegos físicos"
              className="img-fluid rounded border border-secondary shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="row g-4 mb-5">
        {PILARES.map((pilar) => (
          <div key={pilar.titulo} className="col-12 col-md-6">
            <article className={`card card-pilar card-pilar-${pilar.color} h-100`}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="icono-pilar" aria-hidden="true">{pilar.icono}</span>
                  <h2 className={`h4 font-arcade text-${pilar.color} mb-0`}>{pilar.titulo}</h2>
                </div>
                <p className="card-text text-light mb-0">{pilar.texto}</p>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <h2 className="font-arcade h4 text-light mb-1">Equipo de Desarrollo</h2>
        <p className="text-secondary small mb-0">Proyecto académico · DSY1104 Desarrollo Fullstack II · Evaluación Parcial 2</p>
      </div>
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
