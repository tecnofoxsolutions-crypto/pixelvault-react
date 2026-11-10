// Vista Ofertas (exigida en el Anexo 1 de la Evaluación 2). Creada por Maximiliano (HU-35).
// Desde CF-05 reutiliza el catálogo con el filtro "Solo ofertas" ya aplicado.
import Productos from './Productos.jsx'

export default function Ofertas() {
  return (
    <Productos
      titulo="🔥 Ofertas"
      descripcion="Descuentos por tiempo limitado en ediciones físicas."
      filtroInicial={{ precio: 'ofertas' }}
    />
  )
}
