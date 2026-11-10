// Cada función devuelve el texto del error, o null si el valor es válido.
//   requerido(nombre, 'el nombre')   → 'Completa el nombre'
//   validarCorreo('hola@')            → 'Ingresa un correo válido (ej: nombre@dominio.cl)'
//   validarRut('12345678-5')          → null

export function requerido(valor, nombreCampo = 'este campo') {
  if (valor === null || valor === undefined || String(valor).trim() === '') {
    return `Completa ${nombreCampo}`
  }
  return null
}

export function validarCorreo(correo) {
  const vacio = requerido(correo, 'el correo')
  if (vacio) return vacio
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return formato.test(String(correo).trim()) ? null : 'Ingresa un correo válido (ej: nombre@dominio.cl)'
}

function limpiarRut(rut) {
  return String(rut ?? '').replace(/[.\-\s]/g, '').toUpperCase()
}

// Acepta 12.345.678-5, 12345678-5 o 123456785. Valida el dígito verificador (módulo 11).
export function validarRut(rut) {
  const vacio = requerido(rut, 'el RUT')
  if (vacio) return vacio
  const limpio = limpiarRut(rut)
  if (!/^\d{7,8}[\dK]$/.test(limpio)) return 'El RUT debe tener el formato 12345678-9'

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === esperado ? null : 'El RUT no es válido'
}

// formatearRut('12.345.678-5') → '12345678-5' (formato con que se guarda en db.js)
export function formatearRut(rut) {
  const limpio = limpiarRut(rut)
  if (limpio.length < 2) return limpio
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`
}

export function validarLargo(valor, min, max, nombreCampo = 'Este campo') {
  const largo = String(valor ?? '').trim().length
  if (largo < min) return `${nombreCampo} debe tener al menos ${min} caracteres`
  if (max && largo > max) return `${nombreCampo} no puede superar los ${max} caracteres`
  return null
}
