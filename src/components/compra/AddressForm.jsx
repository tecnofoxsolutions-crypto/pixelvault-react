// DUEÑO: Emanuel (HU-37). Dirección de entrega con región → comunas.
// Props: datos ({ calle, depto, region, comuna, indicaciones }), errores, onCambiar(campo, valor), onTocar(campo)
import regiones from '../../data/regiones.js'
import FormField from '../common/FormField.jsx'
import SelectField from '../common/SelectField.jsx'

export default function AddressForm({ datos, errores, onCambiar, onTocar }) {
  // Las comunas dependen de la región elegida
  const comunas = regiones.find((r) => r.nombre === datos.region)?.comunas ?? []

  function propsDeCampo(campo) {
    return {
      id: campo,
      value: datos[campo],
      error: errores[campo],
      onChange: (evento) => onCambiar(campo, evento.target.value),
      onBlur: () => onTocar(campo),
    }
  }

  return (
    <fieldset>
      <legend className="h5 text-info mb-3">2. Dirección de entrega</legend>
      <div className="row">
        <div className="col-12 col-md-8">
          <FormField {...propsDeCampo('calle')} label="Calle y número" requerido autoComplete="address-line1" />
        </div>
        <div className="col-12 col-md-4">
          <FormField {...propsDeCampo('depto')} label="Depto. (opcional)" autoComplete="address-line2" />
        </div>
        <div className="col-12 col-md-6">
          <SelectField
            {...propsDeCampo('region')}
            label="Región"
            requerido
            opciones={regiones.map((r) => r.nombre)}
            placeholder="Selecciona una región"
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectField
            {...propsDeCampo('comuna')}
            label="Comuna"
            requerido
            opciones={comunas}
            placeholder={datos.region ? 'Selecciona una comuna' : 'Primero elige la región'}
            disabled={!datos.region}
          />
        </div>
        <div className="col-12">
          <label htmlFor="indicaciones" className="form-label">Indicaciones para la entrega (opcional)</label>
          <textarea
            id="indicaciones"
            className={`form-control ${errores.indicaciones ? 'is-invalid' : ''}`}
            rows="2"
            placeholder="Ej: dejar en conserjería"
            value={datos.indicaciones}
            onChange={(evento) => onCambiar('indicaciones', evento.target.value)}
            onBlur={() => onTocar('indicaciones')}
          />
          {errores.indicaciones && <div className="invalid-feedback">{errores.indicaciones}</div>}
        </div>
      </div>
    </fieldset>
  )
}
