// Selector con etiqueta y mensaje de error bajo el campo.
// Las opciones pueden ser textos o pares { valor, texto }:
//   opciones={['RM', 'Valparaíso']}
//   opciones={categorias.map(c => ({ valor: c.id, texto: c.nombre }))}
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
        {opciones.map((opcion) => {
          const valor = typeof opcion === 'object' ? opcion.valor : opcion
          const texto = typeof opcion === 'object' ? opcion.texto : opcion
          return <option key={valor} value={valor}>{texto}</option>
        })}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}
