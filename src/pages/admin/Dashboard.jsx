// DUEÑO: Jim (tarjeta HU-44).
import { Link } from 'react-router-dom'
import db from '../../data/db.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatoCLP } from '../../utils/formatoCLP.js'
import StatCard from '../../components/admin/StatCard.jsx'
import AccesoRapido from '../../components/admin/AccesoRapido.jsx'

const accesos = [
  { to: '/admin/ordenes', icono: '🧾', titulo: 'Órdenes', descripcion: 'Seguimiento de las compras y sus boletas.' },
  { to: '/admin/productos', icono: '📦', titulo: 'Productos', descripcion: 'Inventario, precios y ofertas del catálogo.' },
  { to: '/admin/categorias', icono: '🏷️', titulo: 'Categorías', descripcion: 'Organiza los productos para navegar mejor.' },
  { to: '/admin/usuarios', icono: '👥', titulo: 'Usuarios', descripcion: 'Cuentas de clientes y del personal.' },
  { to: '/admin/reportes', icono: '📊', titulo: 'Reportes', descripcion: 'Ventas por categoría y más vendidos.' },
  { to: '/admin/perfil', icono: '🙍', titulo: 'Perfil', descripcion: 'Tus datos personales y contraseña.' },
  { to: '/', icono: '🏪', titulo: 'Tienda', descripcion: 'Ver la tienda como la ven los clientes.' },
]

export default function Dashboard() {
  const { usuario } = useAuth()

  const ordenes = db.getAll('ordenes')
  const productos = db.getAll('productos')
  const usuarios = db.getAll('usuarios')

  const ordenesValidas = ordenes.filter((o) => o.estado !== 'Cancelado')
  const totalVendido = ordenesValidas.reduce((suma, o) => suma + o.total, 0)
  const unidadesEnStock = productos.reduce((suma, p) => suma + p.stock, 0)
  const clientes = usuarios.filter((u) => u.rol === 'Cliente').length
  const criticos = productos.filter((p) => p.stock <= p.stockCritico)
  const agotados = criticos.filter((p) => p.stock === 0).length

  return (
    <div>
      <h1 className="h3 text-light mb-1">Dashboard</h1>
      <p className="text-secondary mb-4">Hola {usuario?.nombre}, este es el resumen de la tienda.</p>

      {criticos.length > 0 && (
        <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
          <span>
            ⚠️ Hay <strong>{criticos.length}</strong> {criticos.length === 1 ? 'producto' : 'productos'} con stock crítico
            {agotados > 0 && <> ({agotados} {agotados === 1 ? 'agotado' : 'agotados'})</>}.
          </span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-dark">Ver listado</Link>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <StatCard titulo="Compras" valor={ordenes.length} detalle={`Total vendido: ${formatoCLP(totalVendido)}`} icono="🛒" color="primary" />
        </div>
        <div className="col-12 col-md-4">
          <StatCard titulo="Productos" valor={productos.length} detalle={`Unidades en stock: ${unidadesEnStock}`} icono="📦" color="success" />
        </div>
        <div className="col-12 col-md-4">
          <StatCard titulo="Usuarios" valor={usuarios.length} detalle={`Clientes registrados: ${clientes}`} icono="👥" color="warning" />
        </div>
      </div>

      <h2 className="h5 text-light mb-3">Accesos rápidos</h2>
      <div className="row g-3">
        {accesos.map((acceso) => (
          <div className="col-6 col-lg-4 col-xl-3" key={acceso.to}>
            <AccesoRapido {...acceso} />
          </div>
        ))}
      </div>
    </div>
  )
}
