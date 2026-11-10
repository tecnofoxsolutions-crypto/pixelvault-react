# Ficha técnica — PixelVault React (Evaluación Parcial 2, DSY1104)

Proyecto de origen: `Evaluacion 1/tienda_videojuegos` (HTML + Bootstrap 5.3.3 + JS nativo).
Proyecto destino: aplicación React nueva que reemplaza esas páginas.

| Campo | Valor | Origen |
|---|---|---|
| Plataforma(s) | Web (SPA), solo frontend. Sin backend en esta evaluación | detectado (instrucciones Eval 2) |
| Lenguaje(s) y versión | JavaScript ES2022 + JSX | supuesto |
| Framework(s) / UI | React 18 + Vite 5 + React Router 6 + Bootstrap 5.3.3 (CSS y bundle JS por npm) | React y Bootstrap detectados (exigidos); Vite y Router supuestos |
| Arquitectura y patrón | Componentes funcionales con hooks. Capas: `data/` (base simulada + CRUD) → `context/` (estado global: sesión y carrito) → `components/` (piezas reutilizables) → `pages/` (vistas por ruta). Una responsabilidad por componente | supuesto (sigue la recomendación "Single Responsibility" del enunciado) |
| Persistencia / BD | Archivo `src/data/db.js` con datos semilla y funciones CRUD, que guarda en `localStorage`. Reutiliza los datos semilla de la Eval 1 (productos, usuarios, pedidos, blog) | detectado (exigido) + Eval 1 usa `localStorage` |
| Autenticación / roles | Login simulado contra `db.js`; sesión en `sessionStorage`. Roles: Administrador, Operador, Editor, Repartidor, Cliente (heredados de Eval 1). Rutas `/admin/*` protegidas por rol | detectado (Eval 1) |
| Integraciones / APIs externas | Ninguna. Pago simulado (éxito/error) | supuesto |
| Testing | **Jasmine/Karma descartados por el docente.** Verificación manual con checklist por historia | indicado por el usuario |
| Convenciones | Componentes en PascalCase (`ProductCard.jsx`), hooks `useX`, utilidades en camelCase. Ramas `feature/HU-xx-descripcion`, PR a `main` revisado por otro integrante. Commits en español: `feat(HU-34): ...` | supuesto |
| Restricciones | Plazo 1 semana, 3 desarrolladores, repo GitHub público, responsivo (móvil/tablet/escritorio), presentación 15 min + 5 de preguntas | detectado (instrucciones Eval 2) |

## Estructura de carpetas propuesta

```text
pixelvault-react/
├── public/img/                  # Carátulas y avatares (copiados de Eval 1)
├── src/
│   ├── data/
│   │   ├── seed.js              # Datos iniciales: productos, categorías, usuarios, pedidos, blog
│   │   ├── db.js                # CRUD genérico sobre localStorage (getAll, getById, create, update, remove)
│   │   └── regiones.js          # Regiones y comunas de Chile para el checkout
│   ├── context/
│   │   ├── AuthContext.jsx      # Usuario en sesión, login, logout, rol
│   │   └── CartContext.jsx      # Carrito: agregar, quitar, cambiar cantidad, vaciar, total
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, AdminSidebar, TiendaLayout, AdminLayout
│   │   ├── productos/           # ProductCard, ProductList, ProductFilters, PriceTag
│   │   ├── carrito/             # CartItemRow, CartSummary
│   │   ├── compra/              # OrderSummaryTable, CustomerForm, AddressForm
│   │   ├── admin/               # StatCard, DataTable, ProductForm, UserForm, CategoryForm
│   │   └── common/              # AlertMessage, FormField, ConfirmModal, EmptyState
│   ├── pages/
│   │   ├── tienda/              # Home, Productos, ProductoDetalle, Categorias, Ofertas, Carrito,
│   │   │                        # Checkout, PagoExitoso, PagoError, Login, Registro, Nosotros,
│   │   │                        # Blog, BlogDetalle, Contacto, MisCompras, NotFound
│   │   └── admin/               # Dashboard, Ordenes, BoletaDetalle, ProductosAdmin, ProductoForm,
│   │                            # StockCritico, Categorias, Usuarios, UsuarioForm,
│   │                            # HistorialUsuario, Reportes, Perfil
│   ├── routes/
│   │   ├── AppRouter.jsx        # Todas las rutas
│   │   └── ProtectedRoute.jsx   # Bloquea rutas según rol
│   ├── utils/                   # formatoCLP.js, validaciones.js (RUT, correo, campos obligatorios)
│   ├── styles/estilos.css       # Tema Steam + 16-bit de Eval 1
│   ├── App.jsx
│   └── main.jsx                 # Importa bootstrap.min.css y bootstrap.bundle.js
├── docs/                        # Esta ficha, backlog, plan, ERS V2
├── package.json
└── README.md
```
