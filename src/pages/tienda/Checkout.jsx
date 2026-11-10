// DUEÑO: Emanuel (HU-37). Página /checkout: datos del cliente, dirección, tipo de entrega y resumen a pagar.
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import CustomerForm from '../../components/compra/CustomerForm.jsx'
import AddressForm from '../../components/compra/AddressForm.jsx'
import DeliveryOptions from '../../components/compra/DeliveryOptions.jsx'
import OrderSummaryTable from '../../components/compra/OrderSummaryTable.jsx'
import { calcularDespacho } from '../../components/compra/despacho.js'
import { CLAVE_BORRADOR_CHECKOUT, procesarPago } from '../../components/compra/pago.js'
import { formatoCLP } from '../../utils/formatoCLP.js'
import { requerido, validarCorreo, validarLargo } from '../../utils/validaciones.js'
import '../../components/carrito/carrito.css'

// El formulario se guarda en sessionStorage para no perderlo si el pago falla o el cliente vuelve al carrito
const CLAVE_BORRADOR = CLAVE_BORRADOR_CHECKOUT

const formularioVacio = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  depto: '',
  region: '',
  comuna: '',
  indicaciones: '',
  tipoEntrega: 'despacho',
}

// Prioridad: 1) lo que el cliente ya había escrito, 2) los datos del usuario con sesión, 3) vacío
function formularioInicial(usuario) {
  try {
    const borrador = JSON.parse(sessionStorage.getItem(CLAVE_BORRADOR))
    if (borrador) return { ...formularioVacio, ...borrador }
  } catch {
    // borrador dañado: se ignora
  }
  if (!usuario) return formularioVacio
  return {
    ...formularioVacio,
    nombre: usuario.nombre ?? '',
    apellidos: usuario.apellidos ?? '',
    correo: usuario.correo ?? '',
    calle: usuario.direccion ?? '',
    region: usuario.region ?? '',
    comuna: usuario.comuna ?? '',
  }
}

// Devuelve { campo: 'mensaje de error' | null } con todas las reglas del formulario
function validar(form) {
  return {
    nombre: requerido(form.nombre, 'el nombre') ?? validarLargo(form.nombre, 2, 50, 'El nombre'),
    apellidos: requerido(form.apellidos, 'los apellidos') ?? validarLargo(form.apellidos, 2, 60, 'Los apellidos'),
    correo: validarCorreo(form.correo),
    calle: requerido(form.calle, 'la calle y número') ?? validarLargo(form.calle, 5, 100, 'La dirección'),
    depto: validarLargo(form.depto, 0, 30, 'El depto.'),
    region: requerido(form.region, 'la región'),
    comuna: requerido(form.comuna, 'la comuna'),
    indicaciones: validarLargo(form.indicaciones, 0, 200, 'Las indicaciones'),
  }
}

export default function Checkout() {
  const { usuario } = useAuth()
  const { items, total: subtotal, vaciar } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => formularioInicial(usuario))
  const [tocados, setTocados] = useState({})
  const [intentoPagar, setIntentoPagar] = useState(false)
  const [simularRechazo, setSimularRechazo] = useState(false)
  const [aviso, setAviso] = useState(null)

  // Guardar el borrador cada vez que cambia el formulario
  useEffect(() => {
    sessionStorage.setItem(CLAVE_BORRADOR, JSON.stringify(form))
  }, [form])

  // Sin productos no hay nada que pagar
  if (items.length === 0) return <Navigate to="/carrito" replace />

  const despacho = calcularDespacho(form.tipoEntrega)
  const total = subtotal + despacho
  const errores = validar(form)
  const hayErrores = Object.values(errores).some(Boolean)

  // Un error solo se muestra si el campo ya se tocó o si se intentó pagar
  const erroresVisibles = Object.fromEntries(
    Object.entries(errores).map(([campo, error]) => [campo, tocados[campo] || intentoPagar ? error : null])
  )

  function cambiarCampo(campo, valor) {
    setForm((actual) => {
      const nuevo = { ...actual, [campo]: valor }
      // Si cambia la región, la comuna elegida ya no corresponde
      if (campo === 'region') nuevo.comuna = ''
      return nuevo
    })
  }

  function tocarCampo(campo) {
    setTocados((actual) => ({ ...actual, [campo]: true }))
  }

  function pagar(evento) {
    evento.preventDefault()
    setIntentoPagar(true)
    if (hayErrores) {
      setAviso({ tipo: 'danger', mensaje: 'Revisa los campos marcados en rojo antes de pagar.' })
      // Llevar al cliente al primer campo con error (el id de cada campo es su nombre)
      const primerError = Object.keys(errores).find((campo) => errores[campo])
      document.getElementById(primerError)?.focus()
      return
    }

    const resultado = procesarPago({ form, items, usuario, simularRechazo })
    if (!resultado.ok) {
      // Rechazado: el carrito y el borrador se mantienen para poder reintentar
      navigate('/compra/error', { state: { motivo: resultado.motivo, detalle: resultado.detalle } })
      return
    }
    // Aprobado: se navega a la boleta y se limpian el carrito y el borrador
    navigate(`/compra/exito/${resultado.orden.numero}`, { replace: true })
    sessionStorage.removeItem(CLAVE_BORRADOR)
    vaciar()
  }

  return (
    <div className="container py-4 py-md-5">
      <h1 className="h3 font-arcade text-light mb-4">Checkout</h1>

      <AlertMessage tipo={aviso?.tipo} mensaje={aviso?.mensaje} onCerrar={() => setAviso(null)} />

      <form className="row g-4" onSubmit={pagar} noValidate>
        <div className="col-12 col-lg-7">
          <div className="card card-resumen">
            <div className="card-body d-grid gap-3">
              {!usuario && (
                <p className="small text-secondary mb-0">
                  ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link> y completamos tus datos.
                </p>
              )}
              <CustomerForm datos={form} errores={erroresVisibles} onCambiar={cambiarCampo} onTocar={tocarCampo} />
              <AddressForm datos={form} errores={erroresVisibles} onCambiar={cambiarCampo} onTocar={tocarCampo} />
              <DeliveryOptions valor={form.tipoEntrega} onCambiar={(valor) => cambiarCampo('tipoEntrega', valor)} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card card-resumen shadow">
            <div className="card-body">
              <h2 className="h5 font-arcade text-info mb-3">Tu pedido</h2>
              <OrderSummaryTable items={items} subtotal={subtotal} despacho={despacho} total={total} />

              <div className="text-center border border-info rounded py-3 my-3">
                <div className="small text-secondary">Total a pagar</div>
                <div className="display-6 fw-bold text-info">{formatoCLP(total)}</div>
              </div>

              <div className="form-check mb-3">
                <input
                  id="simularRechazo"
                  className="form-check-input"
                  type="checkbox"
                  checked={simularRechazo}
                  onChange={(evento) => setSimularRechazo(evento.target.checked)}
                />
                <label htmlFor="simularRechazo" className="form-check-label small text-warning">
                  Demo: simular pago rechazado
                </label>
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-arcade py-2">
                  Pagar ahora
                </button>
                <Link to="/carrito" className="btn btn-link text-secondary">
                  Volver al carrito
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
