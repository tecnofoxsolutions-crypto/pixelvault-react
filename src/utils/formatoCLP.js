// formatoCLP(34990) → "$34.990"
export function formatoCLP(valor) {
  const numero = Math.round(Number(valor) || 0)
  return '$' + numero.toLocaleString('es-CL')
}

export default formatoCLP
