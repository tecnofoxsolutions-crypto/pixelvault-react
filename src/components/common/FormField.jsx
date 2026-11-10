// Campo de formulario con etiqueta y mensaje de error bajo el input.
// <FormField id="correo" label="Correo" value={correo} onChange={e => setCorreo(e.target.value)} error={errores.correo} requerido />
export default function FormField({ id, label, type = 'text', value, onChange, error, requerido, ...resto }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
        {requerido && <span className="text-danger"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        {...resto}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}
