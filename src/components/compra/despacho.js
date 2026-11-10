// DUEÑO: Emanuel (HU-37). Costo de envío según el tipo de entrega ('retiro' | 'despacho').
export const COSTO_DESPACHO = 4000

export function calcularDespacho(tipoEntrega) {
  return tipoEntrega === 'despacho' ? COSTO_DESPACHO : 0
}
