// DUEÑO: Jim (tarjeta HU-49, reasignada desde Maximiliano). Página para /admin/usuarios/nuevo y /admin/usuarios/:id/editar.
import { Link, useNavigate, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import { useAuth } from '../../context/AuthContext.jsx'
import UserForm from '../../components/admin/UserForm.jsx'

export default function UsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario: sesion, refrescarUsuario } = useAuth()

  const esEdicion = Boolean(id)
  const usuario = esEdicion ? db.getById('usuarios', id) : null

  if (esEdicion && !usuario) {
    return (
      <div className="text-center py-5">
        <h1 className="h4 text-light">Usuario no encontrado</h1>
        <p className="text-secondary">No existe un usuario con el id {id}.</p>
        <Link to="/admin/usuarios" className="btn btn-outline-info">Volver a usuarios</Link>
      </div>
    )
  }

  const esUsuarioActual = esEdicion && String(usuario.id) === String(sesion?.id)
  const otrosUsuarios = db.getAll('usuarios').filter((u) => !esEdicion || String(u.id) !== String(id))

  function guardar(datos) {
    if (esEdicion) {
      db.update('usuarios', id, datos)
      // Si el admin se editó a sí mismo, se actualiza su nombre en el sidebar
      if (esUsuarioActual) refrescarUsuario()
    } else {
      db.create('usuarios', { ...datos, usuario: datos.correo })
    }
    const accion = esEdicion ? 'actualizado' : 'creado'
    navigate('/admin/usuarios', { state: { mensaje: `Usuario ${datos.nombre} ${datos.apellidos} ${accion} correctamente.` } })
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin/usuarios">Usuarios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{esEdicion ? 'Editar' : 'Nuevo'}</li>
        </ol>
      </nav>
      <h1 className="h3 text-light mb-4 encabezado-panel">
        {esEdicion ? `Editar: ${usuario.nombre} ${usuario.apellidos}` : 'Nuevo usuario'}
      </h1>

      <div className="card card-juego">
        <div className="card-body">
          {/* La key reinicia el formulario al pasar de "editar" a "nuevo" o entre usuarios */}
          <UserForm
            key={id ?? 'nuevo'}
            usuario={usuario}
            otrosUsuarios={otrosUsuarios}
            esUsuarioActual={esUsuarioActual}
            onGuardar={guardar}
            onCancelar={() => navigate('/admin/usuarios')}
          />
        </div>
      </div>
    </div>
  )
}
