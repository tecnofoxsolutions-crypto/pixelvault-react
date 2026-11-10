// Selector con etiqueta y mensaje de error bajo el campo.
// <SelectField id="region" label="Región" value={region} onChange={...} opciones={['RM', 'Valparaíso']} error={errores.region} requerido />
export default function SelectField({ id, label, value, onChange, opciones, error, requerido, placeholder = 'Selecciona una opción', ...resto }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
        {requerido && <span className="text-danger"> *</span>}
      </label>
      <select
        id={id}
        name={id}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        {...resto}
      >
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>{opcion}</option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}
