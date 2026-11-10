// Capa de datos de PixelVault, conectada a la API REST de json-server (src/data/api.js, archivo db.json).
// Colecciones: productos, categorias, usuarios, ordenes, blog, contactos y movimientos.
//
// Cómo funciona:
// 1. Al abrir la app, inicializar() pide cada colección a la API (GET) y la deja en memoria.
// 2. Las páginas leen desde esa copia en memoria, por eso getAll y getById responden al instante.
// 3. Cada create, update y remove cambia la copia en memoria y envía el cambio a la API
//    (POST, PUT o DELETE), que lo guarda en db.json. Los envíos van en cola para respetar el orden.
//
// Uso (igual que antes de la API):
//   import db from '../../data/db.js'
//   db.getAll('productos')
//   db.getById('productos', 3)
//   db.create('productos', { nombre: '...' })   // asigna id automáticamente
//   db.update('productos', 3, { stock: 10 })
//   db.remove('productos', 3)
//
// Historial (CF-14): cada create, update y remove queda registrado en la colección 'movimientos',
// con el usuario que tiene la sesión iniciada. También se puede registrar a mano con db.registrarMovimiento(...).
import { api } from './api.js'
import { describirMovimiento } from '../utils/movimientos.js'

export const COLECCIONES = ['productos', 'categorias', 'usuarios', 'ordenes', 'blog', 'contactos', 'movimientos']
const MAX_MOVIMIENTOS = 500

// Copia en memoria de cada colección, cargada desde la API
const cache = {}

// Cola de envíos a la API: cada cambio espera al anterior para que lleguen en orden
let cola = Promise.resolve()
function enviar(tarea) {
  cola = cola.then(tarea).catch((error) => console.error('[API] No se pudo guardar el cambio:', error.message))
  return cola
}

function copiar(valor) {
  return valor == null ? valor : structuredClone(valor)
}

function leer(coleccion) {
  return cache[coleccion] ?? []
}

function mismoId(a, b) {
  return String(a) === String(b)
}

function siguienteId(datos) {
  return datos.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

// Carga todas las colecciones desde la API. main.jsx espera esta promesa antes de mostrar la app.
export async function inicializar() {
  const resultados = await Promise.all(COLECCIONES.map((c) => api.listar(c)))
  COLECCIONES.forEach((c, i) => {
    cache[c] = resultados[i]
  })
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
  const nuevo = {
    id: siguienteId(movimientos),
    fecha: new Date().toISOString(),
    usuarioId: usuario?.id ?? null,
    usuarioNombre: usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Visitante',
    rol: usuario?.rol ?? 'Visitante',
    categoria,
    accion,
    detalle,
  }
  movimientos.push(nuevo)
  cache.movimientos = movimientos
  enviar(() => api.crear('movimientos', nuevo))

  // Se guardan solo los últimos movimientos para que db.json no crezca sin límite
  while (cache.movimientos.length > MAX_MOVIMIENTOS) {
    const antiguo = cache.movimientos.shift()
    enviar(() => api.eliminar('movimientos', antiguo.id))
  }
}

function registrarCambio(coleccion, tipo, antes, despues) {
  if (coleccion === 'movimientos') return
  const movimiento = describirMovimiento(coleccion, tipo, antes, despues)
  if (movimiento) registrarMovimiento(movimiento.categoria, movimiento.accion, movimiento.detalle)
}

export function getAll(coleccion) {
  return copiar(leer(coleccion))
}

export function getById(coleccion, id) {
  return copiar(leer(coleccion).find((item) => mismoId(item.id, id)) ?? null)
}

export function create(coleccion, objeto) {
  const datos = leer(coleccion)
  const nuevo = { ...objeto, id: siguienteId(datos) }
  datos.push(nuevo)
  cache[coleccion] = datos
  enviar(() => api.crear(coleccion, nuevo))
  registrarCambio(coleccion, 'crear', null, nuevo)
  return copiar(nuevo)
}

export function update(coleccion, id, cambios) {
  const datos = leer(coleccion)
  const indice = datos.findIndex((item) => mismoId(item.id, id))
  if (indice === -1) return null
  const antes = datos[indice]
  const actualizado = { ...antes, ...cambios, id: antes.id }
  datos[indice] = actualizado
  enviar(() => api.reemplazar(coleccion, actualizado.id, actualizado))
  registrarCambio(coleccion, 'editar', antes, actualizado)
  return copiar(actualizado)
}

export function remove(coleccion, id) {
  const datos = leer(coleccion)
  const eliminado = datos.find((item) => mismoId(item.id, id))
  if (!eliminado) return false
  cache[coleccion] = datos.filter((item) => !mismoId(item.id, id))
  enviar(() => api.eliminar(coleccion, eliminado.id))
  registrarCambio(coleccion, 'eliminar', eliminado, null)
  return true
}

// Espera a que todos los cambios pendientes lleguen a la API
export function sincronizado() {
  return cola
}

const db = { getAll, getById, create, update, remove, registrarMovimiento, sincronizado }

export default db
