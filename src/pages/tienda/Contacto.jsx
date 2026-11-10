// Contacto. Creada por Maximiliano (HU-42) y completada como en la Evaluación 1 (CF-07):
// encabezado con texto explicativo, formulario, datos de bodega y retiro, y preguntas frecuentes.
// El mensaje se guarda en db.js y entrega un ticket correlativo PVT-000001.
import { useState } from 'react'
import db from '../../data/db.js'
import ContactForm from '../../components/info/ContactForm.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'

export function formatoTicket(id) {
  return `PVT-${String(id).padStart(6, '0')}`
}

const DATOS_BODEGA = [
  { icono: '🏬', titulo: 'Ubicación central', texto: 'Paseo Huérfanos #1230, Local 16-B (Galería Arcade), Santiago Centro, Chile.' },
  { icono: '⏰', titulo: 'Horario de atención', texto: 'Lunes a viernes: 10:30 a 19:30 hrs. Sábados: 11:00 a 16:30 hrs. Domingos y festivos cerrado.' },
  { icono: '📧', titulo: 'Correo de operaciones', texto: 'contacto@pixelvault.cl' },
  { icono: '💬', titulo: 'Mesa de ayuda gamer', texto: '+56 9 8765 4321 (WhatsApp y llamadas)' },
]

const PREGUNTAS = [
  {
    pregunta: '¿Los videojuegos son nuevos y sellados de fábrica?',
    respuesta: 'Sí. Todo el catálogo regular son copias físicas nuevas con su precinto oficial de PlayStation, Nintendo o Xbox. Si una edición de colección es seminueva, se indica en su ficha.',
  },
  {
    pregunta: '¿Hacen envíos a regiones?',
    respuesta: 'Sí, despachamos a todo Chile con una tarifa fija de $4.000. También puedes retirar gratis en nuestra tienda de Santiago Centro.',
  },
  {
    pregunta: '¿Cómo garantizan el stock?',
    respuesta: 'El inventario se valida en tiempo real: si un juego tiene 2 copias, no se pueden pedir 3. Al pagar se vuelve a revisar el stock antes de confirmar la compra.',
  },
  {
    pregunta: '¿Cómo sigo mi pedido?',
    respuesta: 'Inicia sesión y entra a "Mis compras". Ahí verás el estado de cada orden: en preparación, asignada a repartidor, en camino o entregada.',
  },
]

export default function Contacto() {
  const [ticket, setTicket] = useState(null)
  // Pregunta frecuente abierta (null = todas cerradas)
  const [abierta, setAbierta] = useState(0)

  function guardar(datos) {
    const nuevo = db.create('contactos', { ...datos, fecha: new Date().toISOString(), estado: 'Pendiente' })
    const numero = formatoTicket(nuevo.id)
    db.update('contactos', nuevo.id, { ticket: numero })
    setTicket(numero)
  }

  return (
    <div className="container py-4">
      <header className="text-center mb-4">
        <span className="badge text-bg-info badge-arcade mb-2">Canal Directo</span>
        <h1 className="h2 fw-bold text-light font-arcade mb-2">Contacto & Soporte PixelVault</h1>
        <p className="text-secondary mx-auto mb-0" style={{ maxWidth: 680 }}>
          ¿Buscas una edición coleccionista específica, tienes dudas sobre el stock en bodega o necesitas ayuda con un envío?
          Déjanos un mensaje y te responderemos dentro de 48 horas hábiles.
        </p>
      </header>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card card-neon h-100">
            <div className="card-body p-4">
              <h2 className="h5 text-light mb-3">✉️ Envíanos tu consulta</h2>
              <AlertMessage
                tipo="success"
                mensaje={ticket && `Mensaje enviado. Tu número de ticket es ${ticket}.`}
                onCerrar={() => setTicket(null)}
              />
              <ContactForm onEnviar={guardar} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5 d-flex flex-column gap-4">
          <section className="card card-neon">
            <div className="card-body p-4">
              <h2 className="h5 text-info mb-3">📍 Datos de bodega y retiro</h2>
              <ul className="list-unstyled mb-0">
                {DATOS_BODEGA.map((dato) => (
                  <li key={dato.titulo} className="d-flex gap-3 mb-3">
                    <span className="fs-4" aria-hidden="true">{dato.icono}</span>
                    <div>
                      <div className="fw-semibold text-light small">{dato.titulo}</div>
                      <div className="text-secondary small">{dato.texto}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card card-neon">
            <div className="card-body p-4">
              <h2 className="h5 text-warning mb-3">❓ Preguntas frecuentes</h2>
              <div className="accordion accordion-flush">
                {PREGUNTAS.map((p, i) => (
                  <div className="accordion-item bg-transparent" key={p.pregunta}>
                    <h3 className="accordion-header">
                      <button
                        type="button"
                        className={`accordion-button bg-transparent small ${abierta === i ? '' : 'collapsed'}`}
                        aria-expanded={abierta === i}
                        onClick={() => setAbierta(abierta === i ? null : i)}
                      >
                        {p.pregunta}
                      </button>
                    </h3>
                    <div className={`accordion-collapse collapse ${abierta === i ? 'show' : ''}`}>
                      <div className="accordion-body small text-secondary">{p.respuesta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
