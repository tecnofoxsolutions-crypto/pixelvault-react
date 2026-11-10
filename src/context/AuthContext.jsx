// Sesión del usuario. Uso: const { usuario, login, logout, registrar, tieneRol } = useAuth()
import { createContext, useContext, useState } from 'react'
import db from '../data/db.js'

const AuthContext = createContext(null)
const CLAVE_SESION = 'pixelvault_sesion'

function cargarSesion() {
  const id = sessionStorage.getItem(CLAVE_SESION)
  return id ? db.getById('usuarios', id) : null
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(cargarSesion)

  // Inicia sesión con nombre de usuario o correo. Devuelve { ok, error }
  function login(identificador, clave) {
    const buscado = String(identificador ?? '').trim().toLowerCase()
    const encontrado = db
      .getAll('usuarios')
      .find((u) => u.usuario?.toLowerCase() === buscado || u.correo?.toLowerCase() === buscado)

    if (!encontrado || encontrado.clave !== clave) {
      return { ok: false, error: 'Usuario o contraseña incorrectos' }
    }
    if (!encontrado.activo) {
      return { ok: false, error: 'Tu cuenta está desactivada' }
    }
    sessionStorage.setItem(CLAVE_SESION, encontrado.id)
    setUsuario(encontrado)
    return { ok: true, usuario: encontrado }
  }

  function logout() {
    sessionStorage.removeItem(CLAVE_SESION)
    setUsuario(null)
  }

  // Crea un Cliente y deja la sesión iniciada. Las validaciones de formulario van en la página Registro.
  function registrar(datos) {
    const correo = String(datos.correo ?? '').trim().toLowerCase()
    const existe = db.getAll('usuarios').some((u) => u.correo?.toLowerCase() === correo)
    if (existe) return { ok: false, error: 'Este correo ya tiene una cuenta' }

    const nuevo = db.create('usuarios', {
      ...datos,
      correo,
      usuario: datos.usuario || correo,
      rol: 'Cliente',
      activo: true,
    })
    sessionStorage.setItem(CLAVE_SESION, nuevo.id)
    setUsuario(nuevo)
    return { ok: true, usuario: nuevo }
  }

  // tieneRol('Administrador') o tieneRol(['Administrador', 'Operador'])
  function tieneRol(roles) {
    if (!usuario) return false
    const lista = Array.isArray(roles) ? roles : [roles]
    return lista.includes(usuario.rol)
  }

  // Volver a leer el usuario desde db.js (por ejemplo después de editar el perfil)
  function refrescarUsuario() {
    setUsuario(cargarSesion())
  }

  const valor = { usuario, login, logout, registrar, tieneRol, refrescarUsuario }
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return contexto
}
