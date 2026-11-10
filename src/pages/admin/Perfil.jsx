// DUEÑO: Emanuel (HU-52). Página /admin/perfil: el usuario en sesión edita sus datos y su contraseña.
// No depende del layout: si Jim agrega /perfil para clientes en la tienda, se puede reutilizar tal cual.
import { useAuth } from '../../context/AuthContext.jsx'
import db from '../../data/db.js'
import PerfilForm from '../../components/perfil/PerfilForm.jsx'
import CambioClaveForm from '../../components/perfil/CambioClaveForm.jsx'
import { formatearRut } from '../../utils/validaciones.js'
import '../../components/carrito/carrito.css'

export default function Perfil() {
  const { usuario, refrescarUsuario } = useAuth()

  // Guarda los datos personales. Revisa que el correo y el RUT no sean de otro usuario.
  function guardarDatos(datos) {
    const otros = db.getAll('usuarios').filter((u) => String(u.id) !== String(usuario.id))
    const correo = datos.correo.trim().toLowerCase()
    const rut = formatearRut(datos.rut)
    if (otros.some((u) => u.correo?.toLowerCase() === correo)) {
      return { ok: false, error: 'Ese correo ya pertenece a otra cuenta.' }
    }
    if (otros.some((u) => formatearRut(u.rut) === rut)) {
      return { ok: false, error: 'Ese RUT ya pertenece a otra cuenta.' }
    }

    db.update('usuarios', usuario.id, {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      rut,
      correo,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
    })
    // db.js no avisa a React: se vuelve a leer el usuario para que la barra muestre el nombre nuevo
    refrescarUsuario()
    return { ok: true }
  }

  // Cambia la contraseña solo si la actual es correcta (se compara con lo guardado en db.js)
  function cambiarClave({ claveActual, claveNueva }) {
    const guardado = db.getById('usuarios', usuario.id)
    if (guardado.clave !== claveActual) {
      return { ok: false, error: 'La contraseña actual no es correcta.' }
    }
    db.update('usuarios', usuario.id, { clave: claveNueva })
    refrescarUsuario()
    return { ok: true }
  }

  return (
    <div className="container-fluid px-0">
      <h1 className="h3 text-light mb-1">Mi perfil</h1>
      <p className="text-secondary small mb-4">
        Usuario <strong>{usuario.usuario}</strong> · {usuario.rol}
      </p>

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="card card-resumen p-3 p-md-4 h-100">
            <PerfilForm usuario={usuario} onGuardar={guardarDatos} />
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="card card-resumen p-3 p-md-4 h-100">
            <CambioClaveForm onCambiar={cambiarClave} />
          </div>
        </div>
      </div>
    </div>
  )
}
