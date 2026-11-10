// DUEÑO: Emanuel (HU-37). Datos de la persona que compra.
// Props: datos ({ nombre, apellidos, correo }), errores, onCambiar(campo, valor), onTocar(campo)
import FormField from '../common/FormField.jsx'

export default function CustomerForm({ datos, errores, onCambiar, onTocar }) {
  // Props comunes de cada campo: valor, error y los avisos al padre
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
      <legend className="h5 text-info mb-3">1. Tus datos</legend>
      <div className="row">
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('nombre')} label="Nombre" requerido autoComplete="given-name" />
        </div>
        <div className="col-12 col-md-6">
          <FormField {...propsDeCampo('apellidos')} label="Apellidos" requerido autoComplete="family-name" />
        </div>
        <div className="col-12">
          <FormField {...propsDeCampo('correo')} label="Correo" type="email" requerido autoComplete="email" />
        </div>
      </div>
    </fieldset>
  )
}
