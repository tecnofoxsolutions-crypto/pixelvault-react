# Guía para agentes y desarrolladores — PixelVault React

> ## ⚠️ ETAPA FINAL — LEER PRIMERO [`docs/CAMBIOS-FINALES.md`](docs/CAMBIOS-FINALES.md)
> Todas las páginas están terminadas. **Jim arma la versión final** y aplica los cambios CF-01 a CF-21 en cualquier archivo, incluidos los de Emanuel y Maximiliano.
> - **Emanuel y Maximiliano: no editen código en `src/`**, solo hagan `git pull`. Si encuentran un error, avísenle a Jim. Pueden editar solo documentación (`docs/ERS_V2.*` y su `docs/guia-defensa-<nombre>.md`).
> - Ese documento explica qué cambió, por qué, los campos nuevos del contrato (órdenes `PV-000001`, flujo de estados, colección `movimientos`, permisos por rol) y qué preparar para la defensa.
> - La tabla de dueños de abajo ya no restringe a Jim; sirve para saber quién hizo originalmente cada parte.

Proyecto de la **Evaluación Parcial 2 de DSY1104 Desarrollo Fullstack II (Duoc UC)**: migrar a React la tienda de videojuegos físicos PixelVault (Evaluación 1 en HTML + Bootstrap + JS) y agregar las vistas nuevas que pide el enunciado.

**Entrega: mañana.** Tres desarrolladores trabajan en paralelo, cada uno sobre **sus propios archivos**, y suben a `main` a medida que terminan.

- Tablero Trello (tareas y criterios de aceptación): https://trello.com/b/b9v2jK3p/pixel-vault
- Plan completo: [`docs/plan.md`](docs/plan.md) · Backlog con historias y criterios: [`docs/backlog.md`](docs/backlog.md) · Stack: [`docs/ficha-tecnica.md`](docs/ficha-tecnica.md)
- **Pruebas con Jasmine/Karma: descartadas por el docente.** No crear tests ni configurar Karma. Cada tarea se verifica a mano con el checklist de su tarjeta.

## Antes de empezar (agente)

1. Pregunta a la persona **quién es** (Jim, Emanuel o Maximiliano) si no lo sabes.
2. Lee su columna en Trello o la sección "Tareas por persona" de abajo y trabaja **solo en sus archivos**.
3. Cada tarjeta trae criterios de aceptación: cúmplelos todos antes de dar la tarea por terminada.
4. No cambies los nombres de funciones, rutas ni campos del **contrato** (más abajo). Los otros dos programan contra ellos.

## Cómo correr el proyecto

```bash
npm install
npm run api      # terminal 1: API json-server en http://localhost:3001 (datos en db.json)
npm run dev      # terminal 2: http://localhost:5173
npm run build    # verificar que compila antes de pushear
```

Stack: React 18 + Vite 5 + React Router 6 + Bootstrap 5.3.3 (CSS y JS importados en `src/main.jsx`). Los datos viven en `db.json`, servidos por **json-server** como API REST (`src/data/api.js`); las páginas los usan a través de `src/data/db.js` (CF-21).

Para volver a los datos iniciales: detener la API, `npm run db:reset` y volver a encenderla.

## Dueños de archivos (no editar archivos ajenos)

Si necesitas un cambio en un archivo de otro, **avisa al dueño por el grupo**. Así no hay conflictos de Git.

| Dueño | Archivos |
|---|---|
| **Jim** | `index.html`, `src/data/*` (excepto `regiones.js`), `src/routes/*`, `src/context/AuthContext.jsx`, `src/utils/*`, `src/components/common/*`, `src/components/auth/*`, `src/components/layout/AdminLayout.jsx`, `src/components/layout/AdminSidebar.jsx`, `src/components/admin/*`, `src/main.jsx`, `src/App.jsx`, `package.json` · Páginas: `tienda/Login`, `tienda/Registro`, `admin/Dashboard`, `admin/ProductosAdmin`, `admin/ProductoForm`, `admin/StockCritico`, `admin/Reportes`, `admin/CategoriasAdmin`, `admin/UsuariosAdmin`, `admin/UsuarioForm` (reasignadas desde Maximiliano) |
| **Emanuel** | `src/context/CartContext.jsx`, `src/data/regiones.js`, `src/components/carrito/*`, `src/components/compra/*` · Páginas: `tienda/Carrito`, `tienda/Checkout`, `tienda/PagoExitoso`, `tienda/PagoError`, `tienda/MisCompras`, `admin/Ordenes`, `admin/BoletaDetalle`, `admin/HistorialUsuario`, `admin/Perfil` · Documento ERS V2 |
| **Maximiliano** | `src/components/layout/TiendaLayout.jsx`, `Navbar.jsx`, `Footer.jsx`, `src/components/productos/*`, `src/styles/estilos.css`, `public/img/*` · Páginas: `tienda/Home`, `tienda/Productos`, `tienda/ProductoDetalle`, `tienda/Categorias`, `tienda/Ofertas`, `tienda/Blog`, `tienda/BlogDetalle`, `tienda/Nosotros`, `tienda/Contacto`, `tienda/NotFound` |

Cada página ya existe como marcador (`PaginaPendiente`) con su ruta registrada en `src/routes/AppRouter.jsx`. Solo hay que reemplazar el contenido del archivo. Si un componente nuevo es solo tuyo, créalo en tu carpeta de `src/components/`.

## Contrato (no cambiar sin avisar)

### Datos — `src/data/db.js`

```js
import db from '../../data/db.js'

db.getAll('productos')               // arreglo (copia de lo cargado desde la API)
db.getById('productos', id)          // objeto o null
db.create('productos', objeto)       // asigna id y devuelve el creado
db.update('productos', id, cambios)  // devuelve el actualizado o null
db.remove('productos', id)           // true si eliminó
```

Colecciones: `productos`, `categorias`, `usuarios`, `ordenes`, `blog`, `contactos`.

`db.js` no avisa a React cuando cambia. Después de crear, editar o eliminar, vuelve a leer con `db.getAll(...)` y guarda el resultado en el `useState` del componente.

### Forma de los datos

```js
// producto
{ id, codigo, nombre, categoriaId, plataforma, precio, precioOferta /* número o null */, stock, stockCritico, descripcion, imagen /* '/img/x.jpg' */, activo, destacado }
// categoria
{ id, nombre, imagen }
// usuario  — rol: 'Administrador' | 'Operador' | 'Editor' | 'Repartidor' | 'Cliente'
{ id, usuario, rut, nombre, apellidos, correo, clave, rol, region, comuna, direccion, activo }
// orden    — tipoEntrega: 'retiro' | 'despacho' · estado: 'En preparación' | 'Enviado' | 'Entregado' | 'Cancelado'
{ id, numero, fecha /* ISO */, usuarioId /* o null */, cliente: { nombre, apellidos, correo },
  direccion: { calle, depto, region, comuna, indicaciones }, tipoEntrega,
  items: [{ productoId, nombre, precio, cantidad, imagen }], subtotal, despacho, total, estado }
// articulo de blog — 'cuerpo' es HTML (mostrar con dangerouslySetInnerHTML)
{ id, slug, categoria, nombreCategoria, titulo, autor, fecha, tiempoLectura, imagen, resumen, cuerpo }
// contacto
{ id, ticket /* 'PVT-000001' */, nombre, correo, mensaje, fecha }
```

Para buscar una orden por número: `db.getAll('ordenes').find(o => String(o.numero) === numero)`.

### Contexts

```js
import { useAuth } from '../../context/AuthContext.jsx'
const { usuario, login, logout, registrar, tieneRol, refrescarUsuario } = useAuth()
// login(usuarioOCorreo, clave) → { ok, error, usuario }
// registrar(datos)             → { ok, error, usuario }  (crea rol 'Cliente' y deja la sesión iniciada)
// tieneRol('Administrador') o tieneRol(['Administrador', 'Operador'])

import { useCart } from '../../context/CartContext.jsx'
const { items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadItems } = useCart()
// agregar(producto, cantidad = 1) → { ok, mensaje }  (usa precioOferta si existe y no supera el stock)
```

### Utilidades y componentes comunes

```js
import { formatoCLP } from '../../utils/formatoCLP.js'          // formatoCLP(34990) → "$34.990"
import { requerido, validarCorreo, validarRut, validarLargo, formatearRut } from '../../utils/validaciones.js'
// devuelven el texto del error o null:
//   requerido(valor, 'la región')          → 'Completa la región'   (pasa el campo en minúscula y con artículo)
//   validarLargo(valor, 6, 30, 'La clave') → 'La clave debe tener al menos 6 caracteres'
//   formatearRut('12.345.678-5')           → '12345678-5' (así se guarda en db.js)

import AlertMessage from '../../components/common/AlertMessage.jsx' // <AlertMessage tipo="danger" mensaje="..." onCerrar={fn} />
import FormField from '../../components/common/FormField.jsx'       // input con label y error bajo el campo
import SelectField from '../../components/common/SelectField.jsx'   // <select> con label y error; opciones={['A', 'B']} o [{ valor, texto }]
import ConfirmModal from '../../components/common/ConfirmModal.jsx' // confirmación antes de eliminar (ver uso abajo)
```

```jsx
// ConfirmModal: se abre cuando `abierto` es true. Ejemplo completo en pages/admin/ProductosAdmin.jsx
const [aEliminar, setAEliminar] = useState(null)
<ConfirmModal
  abierto={aEliminar !== null}
  titulo="Eliminar categoría"
  mensaje={`¿Seguro que quieres eliminar ${aEliminar?.nombre}?`}
  textoConfirmar="Eliminar"
  onConfirmar={() => { db.remove('categorias', aEliminar.id); setCategorias(db.getAll('categorias')); setAEliminar(null) }}
  onCancelar={() => setAEliminar(null)}
/>
```

`src/pages/admin/ProductosAdmin.jsx` + `src/components/admin/ProductForm.jsx` son el ejemplo de CRUD completo (listado con búsqueda, un mismo formulario para crear y editar, eliminar con confirmación). Sirven de modelo para categorías y usuarios. `src/data/plataformas.js` tiene las plataformas que vende la tienda.

`src/pages/tienda/Registro.jsx` es un ejemplo completo de formulario con validación en vivo (errores bajo el campo apenas se toca) y selector región → comuna. Úsalo como referencia para el checkout y el formulario de usuarios.

El tema oscuro de Bootstrap está activo en toda la app (`data-bs-theme="dark"` en `index.html`): no hace falta poner `bg-dark` a los inputs.

### Rutas

| Ruta | Página | Dueño |
|---|---|---|
| `/` | Home | Maximiliano |
| `/productos` (acepta `?q=texto`) · `/productos/:id` | Productos · ProductoDetalle | Maximiliano |
| `/categorias` · `/categorias/:id` | Categorias (misma página) | Maximiliano |
| `/ofertas` | Ofertas | Maximiliano |
| `/blog` · `/blog/:id` | Blog · BlogDetalle | Maximiliano |
| `/nosotros` · `/contacto` · `*` | Nosotros · Contacto · NotFound | Maximiliano |
| `/carrito` · `/checkout` | Carrito · Checkout | Emanuel |
| `/compra/exito/:numero` · `/compra/error` | PagoExitoso · PagoError | Emanuel |
| `/mis-compras` (requiere sesión) | MisCompras | Emanuel |
| `/login` · `/registro` | Login · Registro | Jim |
| `/admin` (solo Administrador) | Dashboard | Jim |
| `/admin/productos` · `/admin/productos/nuevo` · `/admin/productos/:id/editar` · `/admin/productos/criticos` | ProductosAdmin · ProductoForm · StockCritico | Jim |
| `/admin/reportes` | Reportes | Jim |
| `/admin/ordenes` · `/admin/ordenes/:numero` | Ordenes · BoletaDetalle | Emanuel |
| `/admin/usuarios/:id/compras` · `/admin/perfil` | HistorialUsuario · Perfil | Emanuel |
| `/admin/categorias` | CategoriasAdmin | Jim (reasignada) |
| `/admin/usuarios` · `/admin/usuarios/nuevo` · `/admin/usuarios/:id/editar` | UsuariosAdmin · UsuarioForm | Jim (reasignada) |

## Tareas por persona (orden sugerido)

Los criterios de aceptación de cada tarea están en su tarjeta de Trello y en `docs/backlog.md`. **MUST** primero; **SHOULD/COULD** solo si sobra tiempo.

**Emanuel**
1. MUST · TEC-05 Completar `CartContext` (stock, ofertas, persistencia) sin cambiar su API
2. MUST · HU-36 Página del carrito (`CartItemRow` con props `item`, `onCambiarCantidad`, `onEliminar`)
3. MUST · HU-37 Checkout: datos del cliente + dirección con región → comunas (`regiones.js`), autocompletar si hay sesión, validaciones, despacho $4.000
4. MUST · HU-38/39 Pago exitoso (crea la orden, descuenta stock, vacía carrito, boleta con `window.print()`) y pago con error (no toca carrito ni stock, botón reintentar). El pago se rechaza si falta stock o si se marca la casilla de demo "Simular pago rechazado"
5. MUST · HU-45 Admin: órdenes con filtro y detalle de boleta con cambio de estado
6. SHOULD · HU-43/50 Mis compras e historial de compras por usuario
7. COULD · HU-52 Perfil — puedes reutilizar `components/admin/UserForm.jsx` con `esUsuarioActual={true}` (bloquea rol y estado) y `refrescarUsuario()` de `useAuth` después de guardar; ver `pages/admin/UsuarioForm.jsx`
8. MUST · TEC-07 ERS V2

**Maximiliano**
1. MUST · TEC-03 Navbar completo (buscador → `/productos?q=`, desplegable de categorías, menú hamburguesa), Footer
2. MUST · HU-32 `ProductCard`, `ProductList` (recibe el arreglo por props), filtros y búsqueda en `/productos`, grilla `col-12 col-md-6 col-lg-3`
3. MUST · HU-33 Detalle de producto con cantidad y relacionados
4. MUST · HU-34/35 Categorías y Ofertas (precio tachado + % de descuento)
5. MUST · HU-31 Home con carrusel Bootstrap, categorías y destacados
6. ~~MUST · HU-48/49 Admin de categorías y usuarios~~ → **reasignada a Jim** para que Maximiliano se concentre en la tienda pública
7. SHOULD · HU-41/42 Blog, Nosotros, Contacto (ticket `PVT-000001`) y 404
8. MUST · MEJ-01 Revisión responsiva final (375, 768 y 1280 px) y capturas

**Jim**
1. ✅ Esqueleto del proyecto (este repo)
2. ✅ MUST · HU-40 Login (con panel de cuentas demo) y registro
3. ✅ MUST · HU-44 Dashboard admin
4. ✅ MUST · HU-46 CRUD de productos (`ProductForm` para crear y editar)
5. ✅ MUST · HU-47 Stock crítico
6. ✅ SHOULD · HU-51 Reportes
7. ✅ MUST · HU-48/49 Admin de categorías y usuarios (reasignada desde Maximiliano)
8. MUST · TEC-08 README final, .zip y entrega en AVA

## Reglas de código

- Componentes funcionales con hooks. **Un componente = una responsabilidad**; si el JSX crece, divídelo.
- Los datos y funciones llegan por **props**; usa `useState` solo para el estado propio del componente.
- Nada de listas de productos o usuarios escritas dentro de un componente: todo sale de `db.js` o de un Context.
- Responsivo con clases de Bootstrap (`row`, `col-*`, `table-responsive`, `navbar-expand-lg`). Nada de anchos fijos en px.
- Navegación con `<Link>`, `<NavLink>` o `useNavigate()`. Nunca `<a href>` para rutas internas.
- Nombres en español, como el resto del proyecto. Componentes en PascalCase, funciones en camelCase.
- Comentarios solo donde ayudan a entender. Cada estudiante debe poder **explicar su código en la defensa**: prefiere código simple y legible.

## Git

Trabajamos directo sobre `main` porque cada uno toca archivos distintos.

```bash
git add <tus archivos>
git commit -m "feat(HU-37): checkout con región y comuna"
git pull --rebase origin main
git push origin main
```

- Commits chicos y frecuentes, con el ID de la tarjeta (`feat`, `fix`, `docs`). El docente revisa el historial de cada uno.
- Antes de pushear: `npm run build` sin errores.
- Nunca `git push --force`. Si hay conflicto en un archivo ajeno, no lo resuelvas: avisa al dueño.
- No subir `node_modules` ni `dist`.

## Usuarios de prueba

| Usuario | Clave | Rol |
|---|---|---|
| Jim / Emanuel / Maximiliano | `admin` | Administrador |
| fernando | `operador` | Operador |
| adriana | `editor` | Editor |
| ilie | `repartidor` | Repartidor |
| francisco | `cliente` | Cliente (tiene 2 órdenes de ejemplo) |

Productos con oferta: ids 2, 7, 8 y 12. En stock crítico: ids 3 (stock = crítico) y 6 (stock 0).
