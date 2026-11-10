// DUEÑO: Jim (tarjeta HU-44). Las páginas /admin/* se dibujan dentro del <Outlet />.
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <aside className="col-12 col-md-3 col-lg-2 bg-dark border-end border-secondary p-3">
          <AdminSidebar />
        </aside>
        <main className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
