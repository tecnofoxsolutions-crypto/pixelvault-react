# PixelVault React

Tienda de videojuegos físicos migrada a React. Evaluación Parcial 2 de **DSY1104 Desarrollo Fullstack II**, Duoc UC.

**Equipo:** Jim Charles · Emanuel Reyes · Maximiliano Peral
**Repositorio:** https://github.com/tecnofoxsolutions-crypto/pixelvault-react

## Ejecutar

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # versión de producción en dist/
```

Los datos viven en `localStorage`. Para volver a los datos iniciales, ejecuta `localStorage.clear()` en la consola del navegador y recarga.

## Tecnologías

- React 18 + Vite 5
- React Router 6 (rutas públicas, rutas protegidas por sesión y por rol)
- Bootstrap 5.3.3 (diseño responsivo, tema oscuro)
- `localStorage` como base de datos simulada (`src/data/db.js`, con funciones CRUD e historial de movimientos)
- Context API: `AuthContext` (sesión y roles) y `CartContext` (carrito)

## Funcionalidades

### Tienda (público)

- Home con carrusel de destacados, categorías y ofertas.
- Catálogo con búsqueda (`/productos?q=`), filtros, detalle de producto y productos relacionados.
- Vistas de Categorías y Ofertas (precio tachado y % de descuento), con acceso desde el desplegable "Productos".
- Blog, Nosotros, Contacto (genera un ticket `PVT-000001`) y página 404.
- Carrito con control de stock y precios de oferta.
- Checkout con validaciones en vivo, región → comuna, retiro en tienda o despacho ($4.000).
  - Sin sesión, la compra crea la cuenta del cliente.
- Pago exitoso con boleta imprimible y pago con error (permite reintentar sin perder el carrito).
- Registro, login, "Mis compras" (estado del pedido, foto y comentario de entrega) y "Mi perfil".

### Panel Staff (`/admin`)

Cada rol ve solo sus secciones:

| Rol | Acceso |
|---|---|
| Administrador | Todo |
| Operador | Órdenes, productos y stock crítico |
| Editor | Blog |
| Repartidor | Mis entregas (iniciar ruta y entregar con foto y comentario) |

- Dashboard con métricas por rol y accesos rápidos.
- CRUD de productos (imagen por URL o archivo, con encuadre editable), categorías, usuarios (clientes y staff) y artículos del blog.
- Stock crítico y reportes de ventas por categoría y más vendidos.
- Órdenes con código `PV-000001`, flujo de estados: En preparación → Asignado a repartidor → En camino → Entregada (o Lista para retiro). Incluye historial de estados y asignación de repartidor.
- Historial (bitácora) de todos los movimientos del sistema.

## Estructura

```text
src/
├── data/          # db.js (CRUD), seed.js (datos iniciales), permisos.js, regiones.js
├── context/       # AuthContext (sesión) y CartContext (carrito)
├── routes/        # AppRouter y ProtectedRoute
├── components/    # layout, common, productos, carrito, compra, admin, perfil, auth
├── pages/
│   ├── tienda/    # vistas públicas
│   └── admin/     # Panel Staff
├── utils/         # formatoCLP, validaciones, imagen, movimientos
└── styles/        # estilos.css
```

## Usuarios de prueba

| Usuario | Clave | Rol |
|---|---|---|
| Jim / Emanuel / Maximiliano | `admin` | Administrador |
| fernando | `operador` | Operador |
| adriana | `editor` | Editor |
| ilie | `repartidor` | Repartidor |
| francisco | `cliente` | Cliente (con órdenes de ejemplo) |

La página de login también muestra estas cuentas para entrar con un clic.

## Documentación

- [ERS V2](docs/ERS_V2.md) ([.docx](docs/ERS_V2.docx))
- [Cambios finales (CF-01 a CF-20)](docs/CAMBIOS-FINALES.md)
- [Plan de desarrollo](docs/plan.md) · [Backlog](docs/backlog.md) · [Ficha técnica](docs/ficha-tecnica.md)
- [Guía del equipo](AGENTS.md)
- [Tablero Trello](https://trello.com/b/b9v2jK3p/pixel-vault)
