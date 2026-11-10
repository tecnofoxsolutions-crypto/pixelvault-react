// DUEÑO: Maximiliano (HU-42). Guarda el mensaje en db.js y entrega un ticket correlativo PVT-000001.
import { useState } from 'react'
import db from '../../data/db.js'
import ContactForm from '../../components/info/ContactForm.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'

export function formatoTicket(id) {
  return `PVT-${String(id).padStart(6, '0')}`
}

export default function Contacto() {
  const [ticket, setTicket] = useState(null)

  function guardar(datos) {
    const nuevo = db.create('contactos', { ...datos, fecha: new Date().toISOString(), estado: 'Pendiente' })
    const numero = formatoTicket(nuevo.id)
    db.update('contactos', nuevo.id, { ticket: numero })
    setTicket(numero)
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          <h1 className="font-arcade h3 mb-2">Contacto</h1>
          <p className="text-secondary mb-4">Escríbenos y te responderemos dentro de 48 horas hábiles.</p>
          <AlertMessage
            tipo="success"
            mensaje={ticket && `Mensaje enviado. Tu número de ticket es ${ticket}.`}
            onCerrar={() => setTicket(null)}
          />
          <div className="card card-juego">
            <div className="card-body">
              <ContactForm onEnviar={guardar} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
