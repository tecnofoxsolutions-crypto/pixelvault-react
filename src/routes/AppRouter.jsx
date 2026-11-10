// DUEÑO: Jim. Todas las rutas de la app. Si necesitas una ruta nueva, pídesela a Jim por el grupo.
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import TiendaLayout from '../components/layout/TiendaLayout.jsx'
import AdminLayout from '../components/layout/AdminLayout.jsx'

// Tienda — Maximiliano
import Home from '../pages/tienda/Home.jsx'
import Productos from '../pages/tienda/Productos.jsx'
import ProductoDetalle from '../pages/tienda/ProductoDetalle.jsx'
import Categorias from '../pages/tienda/Categorias.jsx'
import Ofertas from '../pages/tienda/Ofertas.jsx'
import Blog from '../pages/tienda/Blog.jsx'
import BlogDetalle from '../pages/tienda/BlogDetalle.jsx'
import Nosotros from '../pages/tienda/Nosotros.jsx'
import Contacto from '../pages/tienda/Contacto.jsx'
import NotFound from '../pages/tienda/NotFound.jsx'
// Tienda — Emanuel
import Carrito from '../pages/tienda/Carrito.jsx'
import Checkout from '../pages/tienda/Checkout.jsx'
import PagoExitoso from '../pages/tienda/PagoExitoso.jsx'
import PagoError from '../pages/tienda/PagoError.jsx'
import MisCompras from '../pages/tienda/MisCompras.jsx'
// Tienda — Jim
import Login from '../pages/tienda/Login.jsx'
import Registro from '../pages/tienda/Registro.jsx'

// Admin — Jim
import Dashboard from '../pages/admin/Dashboard.jsx'
import ProductosAdmin from '../pages/admin/ProductosAdmin.jsx'
import ProductoForm from '../pages/admin/ProductoForm.jsx'
import StockCritico from '../pages/admin/StockCritico.jsx'
import Reportes from '../pages/admin/Reportes.jsx'
// Admin — Emanuel
import Ordenes from '../pages/admin/Ordenes.jsx'
import BoletaDetalle from '../pages/admin/BoletaDetalle.jsx'
import HistorialUsuario from '../pages/admin/HistorialUsuario.jsx'
import Perfil from '../pages/admin/Perfil.jsx'
// Admin — Maximiliano
import CategoriasAdmin from '../pages/admin/CategoriasAdmin.jsx'
import UsuariosAdmin from '../pages/admin/UsuariosAdmin.jsx'
import UsuarioForm from '../pages/admin/UsuarioForm.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<TiendaLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:id" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetalle />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra/exito/:numero" element={<PagoExitoso />} />
        <Route path="/compra/error" element={<PagoError />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/mis-compras" element={<MisCompras />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['Administrador']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<ProductoForm />} />
        <Route path="productos/criticos" element={<StockCritico />} />
        <Route path="productos/:id/editar" element={<ProductoForm />} />
        <Route path="reportes" element={<Reportes />} />

        <Route path="ordenes" element={<Ordenes />} />
        <Route path="ordenes/:numero" element={<BoletaDetalle />} />
        <Route path="usuarios/:id/compras" element={<HistorialUsuario />} />
        <Route path="perfil" element={<Perfil />} />

        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="usuarios/nuevo" element={<UsuarioForm />} />
        <Route path="usuarios/:id/editar" element={<UsuarioForm />} />
      </Route>
    </Routes>
  )
}
