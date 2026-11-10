// DUEÑO: Emanuel (HU-37). Elección entre retiro en tienda (gratis) y despacho a domicilio.
// Props: valor ('retiro' | 'despacho'), onCambiar(nuevoValor)
import { formatoCLP } from '../../utils/formatoCLP.js'
import { COSTO_DESPACHO } from './despacho.js'

const opciones = [
  { valor: 'retiro', titulo: 'Retiro en tienda', detalle: 'Gratis' },
  { valor: 'despacho', titulo: 'Despacho a domicilio (RM)', detalle: formatoCLP(COSTO_DESPACHO) },
]

export default function DeliveryOptions({ valor, onCambiar }) {
  return (
    <fieldset>
      <legend className="h5 text-info mb-3">3. Tipo de entrega</legend>
      <div className="row g-2">
        {opciones.map((opcion) => (
          <div className="col-12 col-md-6" key={opcion.valor}>
            <label className={`card card-resumen p-3 h-100 ${valor === opcion.valor ? 'border-info' : ''}`}>
              <span className="form-check mb-0">
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipoEntrega"
                  value={opcion.valor}
                  checked={valor === opcion.valor}
                  onChange={() => onCambiar(opcion.valor)}
                />
                <span className="form-check-label fw-semibold">{opcion.titulo}</span>
              </span>
              <span className="small text-secondary ms-4">{opcion.detalle}</span>
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
