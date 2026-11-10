// Base de datos simulada sobre localStorage.
// Cada colección (productos, categorias, usuarios, ordenes, blog, contactos) se guarda como un arreglo JSON.
//
// Uso:
//   import db from '../../data/db.js'
//   db.getAll('productos')
//   db.getById('productos', 3)
//   db.create('productos', { nombre: '...' })   // asigna id automáticamente
//   db.update('productos', 3, { stock: 10 })
//   db.remove('productos', 3)
import seed from './seed.js'

const PREFIJO = 'pixelvault_'
// Subir este número obliga a recargar los datos semilla en todos los navegadores
const VERSION_DATOS = '1'

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
  const siguienteId = datos.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
  const nuevo = { ...objeto, id: siguienteId }
  datos.push(nuevo)
  guardar(coleccion, datos)
  return nuevo
}

export function update(coleccion, id, cambios) {
  const datos = leer(coleccion)
  const indice = datos.findIndex((item) => mismoId(item.id, id))
  if (indice === -1) return null
  datos[indice] = { ...datos[indice], ...cambios, id: datos[indice].id }
  guardar(coleccion, datos)
  return datos[indice]
}

export function remove(coleccion, id) {
  const datos = leer(coleccion)
  const restantes = datos.filter((item) => !mismoId(item.id, id))
  guardar(coleccion, restantes)
  return restantes.length !== datos.length
}

const db = { getAll, getById, create, update, remove, reiniciar }

export default db
