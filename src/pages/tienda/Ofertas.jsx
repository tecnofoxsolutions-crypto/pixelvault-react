// DUEÑO: Maximiliano (HU-35). Solo los juegos con precioOferta menor al precio normal.
import db from '../../data/db.js'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import ProductList from '../../components/productos/ProductList.jsx'
import EmptyState from '../../components/productos/EmptyState.jsx'
import useAgregarAlCarrito from '../../components/productos/useAgregarAlCarrito.js'
import { estaEnOferta, porcentajeDescuento } from '../../components/productos/precios.js'

export default function Ofertas() {
  const { aviso, cerrarAviso, agregarAlCarrito } = useAgregarAlCarrito()
  // Ordenadas de mayor a menor descuento
  const ofertas = db
    .getAll('productos')
    .filter((p) => p.activo && estaEnOferta(p))
    .sort((a, b) => porcentajeDescuento(b) - porcentajeDescuento(a))

  return (
    <div className="container py-4">
      <h1 className="h2 font-arcade text-warning mb-1">Ofertas</h1>
      <p className="text-secondary">Descuentos por tiempo limitado en ediciones físicas.</p>

      {aviso && <AlertMessage tipo={aviso.tipo} mensaje={aviso.mensaje} onCerrar={cerrarAviso} />}

      {ofertas.length > 0 ? (
        <ProductList productos={ofertas} onAgregar={agregarAlCarrito} />
      ) : (
        <EmptyState mensaje="No hay ofertas activas" />
      )}
    </div>
  )
}
