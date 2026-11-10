// Checkout sin sesión: el comprador crea su cuenta (Cliente) junto con la compra.
// Nombre, apellidos, correo y dirección ya se piden en el resto del checkout; aquí solo faltan RUT y contraseña.
// Props: datos ({ rut, clave, confirmacion }), errores, onCambiar(campo, valor), onTocar(campo)
import { Link } from 'react-router-dom'
import FormField from '../common/FormField.jsx'

export default function CuentaNuevaForm({ datos, errores, onCambiar, onTocar }) {
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
    <fieldset className="border border-info rounded p-3">
      <legend className="h5 text-info mb-1 float-none w-auto px-2">Crea tu cuenta para comprar</legend>
      <p className="small text-secondary">
        Con tu cuenta podrás seguir el estado de tu pedido en "Mis compras". ¿Ya tienes una?{' '}
        <Link to="/login" state={{ desde: '/checkout' }}>Inicia sesión</Link> y completamos tus datos.
      </p>
      <div className="row">
        <div className="col-12 col-md-4">
          <FormField {...propsDeCampo('rut')} label="RUT" requerido maxLength={12} placeholder="12345678-9" />
        </div>
        <div className="col-12 col-md-4">
          <FormField {...propsDeCampo('clave')} label="Contraseña" type="password" requerido maxLength={30} autoComplete="new-password" placeholder="Mínimo 6 caracteres" />
        </div>
        <div className="col-12 col-md-4">
          <FormField {...propsDeCampo('confirmacion')} label="Repite la contraseña" type="password" requerido maxLength={30} autoComplete="new-password" />
        </div>
      </div>
    </fieldset>
  )
}
