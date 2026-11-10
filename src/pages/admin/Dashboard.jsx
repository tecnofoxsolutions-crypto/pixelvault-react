// DUEÑO: Jim (tarjeta HU-44). Resumen del Panel Staff: cada rol ve las métricas de su trabajo (CF-11).
import { Link } from 'react-router-dom'
import db from '../../data/db.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { seccionesPara } from '../../data/permisos.js'
import { formatoCLP } from '../../utils/formatoCLP.js'
import StatCard from '../../components/admin/StatCard.jsx'
import AccesoRapido from '../../components/admin/AccesoRapido.jsx'

// Tarjetas de métricas según el rol. Cada una: { titulo, valor, detalle, icono, color }
function metricasPara(usuario) {
  const ordenes = db.getAll('ordenes')
  const productos = db.getAll('productos')

  switch (usuario.rol) {
    case 'Administrador': {
      const usuarios = db.getAll('usuarios')
      const totalVendido = ordenes.filter((o) => o.estado !== 'Cancelada').reduce((suma, o) => suma + o.total, 0)
      return [
        { titulo: 'Compras', valor: ordenes.length, detalle: `Total vendido: ${formatoCLP(totalVendido)}`, icono: '🛒', color: 'primary' },
        { titulo: 'Productos', valor: productos.length, detalle: `Unidades en stock: ${productos.reduce((s, p) => s + p.stock, 0)}`, icono: '📦', color: 'success' },
        { titulo: 'Usuarios', valor: usuarios.length, detalle: `Clientes: ${usuarios.filter((u) => u.rol === 'Cliente').length} · Staff: ${usuarios.filter((u) => u.rol !== 'Cliente').length}`, icono: '👥', color: 'warning' },
      ]
    }
    case 'Operador':
      return [
        { titulo: 'Por preparar', valor: ordenes.filter((o) => o.estado === 'En preparación').length, detalle: 'Órdenes recién compradas', icono: '📥', color: 'warning' },
        { titulo: 'En ruta', valor: ordenes.filter((o) => ['Asignado a repartidor', 'En camino'].includes(o.estado)).length, detalle: 'Asignadas o en camino', icono: '🛵', color: 'primary' },
        { titulo: 'Para retiro', valor: ordenes.filter((o) => o.estado === 'Lista para retiro').length, detalle: 'Esperando al cliente en tienda', icono: '🏪', color: 'success' },
      ]
    case 'Editor': {
      const articulos = db.getAll('blog')
      return [
        { titulo: 'Artículos', valor: articulos.length, detalle: 'Publicados en el blog', icono: '📝', color: 'primary' },
        { titulo: 'Tus artículos', valor: articulos.filter((a) => a.autor === `${usuario.nombre} ${usuario.apellidos}`).length, detalle: 'Escritos por ti', icono: '✍️', color: 'success' },
      ]
    }
    case 'Repartidor': {
      const mias = ordenes.filter((o) => String(o.repartidorId) === String(usuario.id))
      return [
        { titulo: 'Por entregar', valor: mias.filter((o) => ['Asignado a repartidor', 'En camino'].includes(o.estado)).length, detalle: 'Asignadas a ti', icono: '🛵', color: 'warning' },
        { titulo: 'Entregadas', valor: mias.filter((o) => o.estado === 'Entregada').length, detalle: 'Con foto de comprobante', icono: '✅', color: 'success' },
      ]
    }
    default:
      return []
  }
}

export default function Dashboard() {
  const { usuario } = useAuth()

  const metricas = metricasPara(usuario)
  const productos = db.getAll('productos')
  const criticos = productos.filter((p) => p.stock <= p.stockCritico)
  const agotados = criticos.filter((p) => p.stock === 0).length
  const veProductos = ['Administrador', 'Operador'].includes(usuario.rol)

  // Accesos rápidos: las secciones del rol (sin el propio dashboard) más la tienda
  const accesos = [
    ...seccionesPara(usuario).filter((s) => s.clave !== 'dashboard'),
    { to: '/', icono: '🏪', texto: 'Tienda', descripcion: 'Ver la tienda como la ven los clientes.' },
  ]

  return (
    <div>
      <h1 className="h3 text-light mb-1">Dashboard</h1>
      <p className="text-secondary mb-4">
        Hola {usuario.nombre}, estás en el Panel Staff como <strong className="text-info">{usuario.rol}</strong>.
      </p>

      {veProductos && criticos.length > 0 && (
        <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
          <span>
            ⚠️ Hay <strong>{criticos.length}</strong> {criticos.length === 1 ? 'producto' : 'productos'} con stock crítico
            {agotados > 0 && <> ({agotados} {agotados === 1 ? 'agotado' : 'agotados'})</>}.
          </span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-dark">Ver listado</Link>
        </div>
      )}

      <div className="row g-3 mb-4">
        {metricas.map((m) => (
          <div className={`col-12 ${metricas.length === 2 ? 'col-md-6' : 'col-md-4'}`} key={m.titulo}>
            <StatCard {...m} />
          </div>
        ))}
      </div>

      <h2 className="h5 text-light mb-3">Accesos rápidos</h2>
      <div className="row g-3">
        {accesos.map((acceso) => (
          <div className="col-6 col-lg-4 col-xl-3" key={acceso.to}>
            <AccesoRapido to={acceso.to} icono={acceso.icono} titulo={acceso.texto} descripcion={acceso.descripcion} />
          </div>
        ))}
      </div>
    </div>
  )
}
