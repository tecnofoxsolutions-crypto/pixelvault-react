// Insignia que distingue despacho a domicilio de retiro en tienda. Props: tipoEntrega ('despacho' | 'retiro')
// En celulares muestra solo el ícono (el texto queda para lectores de pantalla).
export default function TipoEntregaBadge({ tipoEntrega }) {
  const despacho = tipoEntrega === 'despacho'
  return (
    <span className={`badge ${despacho ? 'text-bg-info' : 'text-bg-secondary'}`} title={despacho ? 'Despacho a domicilio' : 'Retiro en tienda'}>
      <span aria-hidden="true">{despacho ? '🚚' : '🏪'}</span>
      <span className="d-none d-sm-inline ms-1">{despacho ? 'Despacho' : 'Retiro'}</span>
      <span className="visually-hidden d-sm-none">{despacho ? 'Despacho a domicilio' : 'Retiro en tienda'}</span>
    </span>
  )
}
