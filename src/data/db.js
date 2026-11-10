// Base de datos simulada sobre localStorage.
// Cada colección (productos, categorias, usuarios, ordenes, blog, contactos, movimientos) se guarda como un arreglo JSON.
//
// Uso:
//   import db from '../../data/db.js'
//   db.getAll('productos')
//   db.getById('productos', 3)
//   db.create('productos', { nombre: '...' })   // asigna id automáticamente
//   db.update('productos', 3, { stock: 10 })
//   db.remove('productos', 3)
//
// Historial (CF-14): cada create, update y remove queda registrado solo en la colección 'movimientos',
// con el usuario que tiene la sesión iniciada. También se puede registrar a mano con db.registrarMovimiento(...).
import seed from './seed.js'
import { describirMovimiento } from '../utils/movimientos.js'

const PREFIJO = 'pixelvault_'
// Subir este número obliga a recargar los datos semilla en todos los navegadores.
// '2': órdenes con código PV y flujo de estados, y colección movimientos (docs/CAMBIOS-FINALES.md)
// '3': comentario de entrega del repartidor (comentarioEntrega)
const VERSION_DATOS = '3'
const MAX_MOVIMIENTOS = 500

function clave(coleccion) {
  return PREFIJO + coleccion
}

function leer(coleccion) {
  try {
    const crudo = localStorage.getItem(clave(coleccion))
    return crudo ? JSON.parse(crudo) : []
  } catch {
    return []
  }
}

function guardar(coleccion, datos) {
  localStorage.setItem(clave(coleccion), JSON.stringify(datos))
}

function mismoId(a, b) {
  return String(a) === String(b)
}

function siguienteId(datos) {
  return datos.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

// Usuario con la sesión iniciada (la sesión la guarda AuthContext en sessionStorage)
function usuarioEnSesion() {
  const id = sessionStorage.getItem('pixelvault_sesion')
  return id ? leer('usuarios').find((u) => mismoId(u.id, id)) ?? null : null
}

// Agrega una entrada al historial de movimientos
export function registrarMovimiento(categoria, accion, detalle) {
  const usuario = usuarioEnSesion()
  const movimientos = leer('movimientos')
  movimientos.push({
    id: siguienteId(movimientos),
    fecha: new Date().toISOString(),
    usuarioId: usuario?.id ?? null,
    usuarioNombre: usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Visitante',
    rol: usuario?.rol ?? 'Visitante',
    categoria,
    accion,
    detalle,
  })
  // Se guardan solo los últimos movimientos para no llenar localStorage
  guardar('movimientos', movimientos.slice(-MAX_MOVIMIENTOS))
}

function registrarCambio(coleccion, tipo, antes, despues) {
  if (coleccion === 'movimientos') return
  const movimiento = describirMovimiento(coleccion, tipo, antes, despues)
  if (movimiento) registrarMovimiento(movimiento.categoria, movimiento.accion, movimiento.detalle)
}

export function inicializar() {
  if (localStorage.getItem(clave('version')) === VERSION_DATOS) return
  Object.entries(seed).forEach(([coleccion, datos]) => guardar(coleccion, datos))
  localStorage.setItem(clave('version'), VERSION_DATOS)
}

// Vuelve todos los datos al estado inicial (útil antes de una demo)
export function reiniciar() {
  localStorage.removeItem(clave('version'))
  inicializar()
}

export function getAll(coleccion) {
  return leer(coleccion)
}

export function getById(coleccion, id) {
  return leer(coleccion).find((item) => mismoId(item.id, id)) ?? null
}

export function create(coleccion, objeto) {
  const datos = leer(coleccion)
  const nuevo = { ...objeto, id: siguienteId(datos) }
  datos.push(nuevo)
  guardar(coleccion, datos)
  registrarCambio(coleccion, 'crear', null, nuevo)
  return nuevo
}

export function update(coleccion, id, cambios) {
  const datos = leer(coleccion)
  const indice = datos.findIndex((item) => mismoId(item.id, id))
  if (indice === -1) return null
  const antes = datos[indice]
  datos[indice] = { ...antes, ...cambios, id: antes.id }
  guardar(coleccion, datos)
  registrarCambio(coleccion, 'editar', antes, datos[indice])
  return datos[indice]
}

export function remove(coleccion, id) {
  const datos = leer(coleccion)
  const eliminado = datos.find((item) => mismoId(item.id, id))
  if (!eliminado) return false
  guardar(coleccion, datos.filter((item) => !mismoId(item.id, id)))
  registrarCambio(coleccion, 'eliminar', eliminado, null)
  return true
}

const db = { getAll, getById, create, update, remove, reiniciar, registrarMovimiento }

export default db
