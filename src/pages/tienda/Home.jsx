// Portada. Creada por Maximiliano (HU-31) y rediseñada como en la Evaluación 1 (CF-01):
// presentación de la tienda, carrusel de títulos destacados y características con efecto RGB.
import { Link } from 'react-router-dom'
import db from '../../data/db.js'
import CarruselDestacados from '../../components/productos/CarruselDestacados.jsx'
import CaracteristicaCard from '../../components/info/CaracteristicaCard.jsx'

const caracteristicas = [
  {
    icono: '📦',
    titulo: 'Ediciones Físicas Originales',
    texto: 'Garantizamos carátulas en perfecto estado, sellos de fábrica y manuales originales de colección.',
  },
  {
    icono: '⚡',
    titulo: 'Control Estricto de Stock',
    texto: 'Inventario en tiempo real. Si está en la tienda, existe en nuestra bodega física listo para ti.',
  },
  {
    icono: '🎮',
    titulo: 'Comunidad y Cultura Gamer',
    texto: 'Pasión por los videojuegos clásicos de 16 bits y las superproducciones contemporáneas.',
  },
]

export default function Home() {
  const destacados = db.getAll('productos').filter((p) => p.activo && p.destacado)

  return (
    <div className="container py-4">
      {/* Presentación de la tienda (como el index.html de la Evaluación 1) */}
      <section className="hero-steam p-4 p-md-5 mb-5">
        <div className="row align-items-center g-4 position-relative" style={{ zIndex: 1 }}>
          <div className="col-12 col-lg-7">
            <span className="badge text-bg-info badge-arcade mb-3">Tienda especializada</span>
            <h1 className="display-5 fw-bold text-light">Videojuegos Físicos para Coleccionistas</h1>
            <p className="lead text-secondary">
              Explora nuestro catálogo de ediciones físicas, cajas especiales y cartuchos originales para PlayStation 5,
              Nintendo Switch, Xbox Series X y PC. Stock en bodega 100% garantizado con entrega inmediata.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/productos" className="btn btn-primary btn-lg">Ver Catálogo Completo</Link>
              <Link to="/nosotros" className="btn btn-outline-light btn-lg">Conoce PixelVault</Link>
            </div>
          </div>
          <div className="col-lg-5 d-none d-lg-block text-center">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
              alt="Consola retro con cartuchos físicos"
              className="img-fluid rounded shadow-lg border border-secondary"
              style={{ maxHeight: 260 }}
            />
          </div>
        </div>
      </section>

      <CarruselDestacados productos={destacados} />

      <section aria-label="Por qué elegir PixelVault">
        <div className="row g-4">
          {caracteristicas.map((c) => (
            <div className="col-12 col-md-4" key={c.titulo}>
              <CaracteristicaCard {...c} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
