// Qué ve cada rol en el Panel Staff (CF-11). Es la única fuente: la usan el router, el menú lateral y el dashboard.
// Para dar o quitar acceso a una sección basta con cambiar su lista de roles aquí.
export const ROLES_STAFF = ['Administrador', 'Operador', 'Editor', 'Repartidor']

export const SECCIONES_STAFF = [
  { clave: 'dashboard', to: '/admin', texto: 'Dashboard', icono: '🏠', exacto: true, roles: ROLES_STAFF, descripcion: 'Resumen de tu trabajo.' },
  { clave: 'ordenes', to: '/admin/ordenes', texto: 'Órdenes', icono: '🧾', roles: ['Administrador', 'Operador'], descripcion: 'Preparar, asignar y seguir las compras.' },
  { clave: 'entregas', to: '/admin/entregas', texto: 'Mis entregas', icono: '🛵', roles: ['Repartidor'], descripcion: 'Pedidos asignados a ti: ruta y entrega.' },
  { clave: 'productos', to: '/admin/productos', texto: 'Productos', icono: '📦', roles: ['Administrador', 'Operador'], descripcion: 'Inventario, precios y ofertas.' },
  { clave: 'categorias', to: '/admin/categorias', texto: 'Categorías', icono: '🏷️', roles: ['Administrador'], descripcion: 'Organiza el catálogo.' },
  { clave: 'blog', to: '/admin/blog', texto: 'Blog', icono: '📝', roles: ['Administrador', 'Editor'], descripcion: 'Publica y edita artículos.' },
  { clave: 'usuarios', to: '/admin/usuarios', texto: 'Usuarios', icono: '👥', roles: ['Administrador'], descripcion: 'Clientes y personal.' },
  { clave: 'reportes', to: '/admin/reportes', texto: 'Reportes', icono: '📊', roles: ['Administrador'], descripcion: 'Ventas por categoría y más vendidos.' },
  { clave: 'historial', to: '/admin/historial', texto: 'Historial', icono: '📜', roles: ['Administrador'], descripcion: 'Bitácora de movimientos del sistema.' },
  { clave: 'perfil', to: '/admin/perfil', texto: 'Perfil', icono: '🙍', roles: ROLES_STAFF, descripcion: 'Tus datos y contraseña.' },
]

// Roles que pueden entrar a una sección: rolesDe('ordenes') → ['Administrador', 'Operador']
export function rolesDe(clave) {
  return SECCIONES_STAFF.find((s) => s.clave === clave)?.roles ?? ['Administrador']
}

export function esStaff(usuario) {
  return Boolean(usuario && ROLES_STAFF.includes(usuario.rol))
}

// Secciones que ve un usuario en el menú lateral y en los accesos rápidos
export function seccionesPara(usuario) {
  return SECCIONES_STAFF.filter((s) => usuario && s.roles.includes(usuario.rol))
}
