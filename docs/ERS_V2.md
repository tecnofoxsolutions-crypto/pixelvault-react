# Especificación de Requisitos de Software (ERS) — PixelVault

**Versión 2.0 · BORRADOR** — Evaluación Parcial 2, DSY1104 Desarrollo Fullstack II (Duoc UC)
**Responsable del documento:** Emanuel Reyes (TEC-07) · **Aportes:** Jim Charles, Maximiliano Peral

> **Estado:** borrador armado desde `docs/backlog.md`, `docs/plan.md`, `docs/ficha-tecnica.md` y el código del repositorio.
> Las marcas **[PENDIENTE: …]** indican lo que falta completar con el ERS V1 (Evaluación 1) o con los aportes del equipo.
> La versión final se entrega en Word con el formato del Anexo 4 (TEC-07 CA4).

## Control de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | [PENDIENTE: fecha ERS V1] | Equipo PixelVault | Primera versión: tienda en HTML + Bootstrap + JavaScript nativo (HU-01 a HU-30) |
| 2.0 | 2026-11-10 | Emanuel Reyes | Migración a React, nuevas vistas de tienda y administración (HU-31 a HU-52), modelo de datos con CRUD, pruebas automatizadas fuera de alcance |

---

## 1. Introducción

### 1.1 Propósito
Este documento describe los requisitos de PixelVault, una tienda en línea de videojuegos en formato físico. La versión 2 actualiza la especificación de la Evaluación 1 por el cambio de tecnología a **React** y agrega las vistas y funciones que exige la Evaluación 2: categorías, ofertas, checkout con dirección, pago exitoso y con error, y un panel de administración completo.

Está dirigido al docente (Product Owner), al equipo de desarrollo y a quien mantenga el sistema después.

### 1.2 Alcance
PixelVault es una aplicación web de una sola página (SPA), **solo frontend**, que permite:
- **A los visitantes y clientes:** explorar el catálogo, buscar y filtrar, ver categorías y ofertas, armar un carrito, comprar con despacho o retiro, ver la boleta y consultar sus compras.
- **A los administradores:** ver un resumen del negocio y administrar productos, categorías, usuarios y órdenes, además de revisar stock crítico y reportes.

No hay backend ni pagos reales: los datos se guardan en el navegador (`localStorage`) y el pago es simulado.

### 1.3 Definiciones, siglas y abreviaturas

| Término | Significado |
|---|---|
| SPA | Single Page Application: la página no se recarga al navegar |
| Componente | Pieza reutilizable de interfaz en React (función que devuelve JSX) |
| Props | Datos que un componente recibe de su componente padre |
| State | Datos propios de un componente que, al cambiar, vuelven a dibujarlo (`useState`) |
| Context | Estado global compartido por varios componentes (`AuthContext`, `CartContext`) |
| `db.js` | Módulo que simula una base de datos con funciones CRUD sobre `localStorage` |
| CRUD | Crear, leer, actualizar y eliminar (create, read, update, delete) |
| HU | Historia de usuario · **RF** requisito funcional · **RNF** requisito no funcional |
| CA | Criterio de aceptación (formato *Dado… Cuando… Entonces…*) |
| CLP | Peso chileno, mostrado como `$34.990` |
| Stock crítico | Umbral bajo el cual un producto debe reponerse (`stock <= stockCritico`) |

### 1.4 Referencias
- ERS versión 1.0 de PixelVault (Evaluación 1). [PENDIENTE: nombre exacto del archivo y fecha]
- Instrucciones de la Evaluación Parcial 2, DSY1104 (Duoc UC).
- `docs/backlog.md`: historias con criterios de aceptación completos.
- `docs/plan.md`: plan de desarrollo y reparto del equipo.
- `docs/ficha-tecnica.md`: stack y estructura del proyecto.
- Repositorio: https://github.com/tecnofoxsolutions-crypto/pixelvault-react
- Tablero Trello: https://trello.com/b/b9v2jK3p/pixel-vault

### 1.5 Visión general del documento
La sección 2 describe el producto y su contexto. La sección 3 detalla los requisitos funcionales y no funcionales. La sección 4 resume la arquitectura de la versión React: rutas, componentes y modelo de datos. La sección 5 explica la estrategia de verificación. La sección 6 muestra la trazabilidad con el enunciado.

---

## 2. Descripción general

### 2.1 Perspectiva del producto
La versión 1 era un sitio de varias páginas HTML con Bootstrap 5.3.3 y JavaScript nativo. La versión 2 **reemplaza todas esas páginas** por una aplicación React:

| Aspecto | Versión 1 (Eval 1) | Versión 2 (Eval 2) |
|---|---|---|
| Tecnología | HTML + Bootstrap + JS nativo | React 18 + Vite 5 + React Router 6 + Bootstrap 5.3.3 |
| Navegación | Un archivo `.html` por página | Rutas de React Router, sin recargar la página |
| Detalle de producto y de blog | Ventana emergente | Ruta propia (`/productos/:id`, `/blog/:id`) |
| Datos | `<script>` dentro de cada página + `localStorage` | `src/data/db.js` con CRUD genérico sobre `localStorage` |
| Estado compartido | Variables globales | `AuthContext` (sesión) y `CartContext` (carrito) |
| Compra | Carrito sin dirección | Checkout con datos del cliente, región/comuna y tipo de entrega; pago simulado con éxito o error |
| Administración | [PENDIENTE: qué existía en V1] | Dashboard, productos, stock crítico, categorías, usuarios, órdenes y boletas, reportes y perfil |

[PENDIENTE: confirmar con el ERS V1 qué funciones de la versión 1 se mantienen sin cambios.]

### 2.2 Funciones del producto
- **Catálogo:** inicio con carrusel, listado con búsqueda y filtros, detalle, categorías y ofertas.
- **Compra:** carrito persistente, checkout con validaciones, pago simulado, boleta imprimible, mis compras.
- **Cuenta:** registro, inicio de sesión con cuentas de demostración y edición del perfil.
- **Contenido:** blog con detalle de artículos, nosotros, contacto con número de ticket.
- **Administración:** dashboard, CRUD de productos, categorías y usuarios, stock crítico, órdenes con cambio de estado, historial de compras por usuario y reportes.

### 2.3 Características de los usuarios

| Rol | Descripción | Acceso |
|---|---|---|
| Visitante | Sin sesión | Tienda pública, carrito y checkout |
| Cliente | Cuenta propia creada en el registro | Lo anterior + datos precargados en el checkout + Mis compras |
| Administrador | Personal de la tienda | Todo, incluido el panel `/admin` |
| Operador, Editor, Repartidor | Roles heredados de la versión 1 | Tienda con sesión. [PENDIENTE: definir si tendrán permisos propios en `/admin`; hoy el panel es solo para Administrador] |

### 2.4 Restricciones
- Debe usar **React** y **Bootstrap**, y ser responsivo (móvil, tablet y escritorio).
- Los datos deben venir de **un archivo JavaScript con funciones CRUD** conectado a la interfaz.
- Sin backend: la persistencia es `localStorage` y la sesión, `sessionStorage`.
- Plazo de una semana, 3 desarrolladores, repositorio público en GitHub.
- Presentación de 15 minutos con defensa individual del código.

### 2.5 Suposiciones y dependencias
- El navegador tiene JavaScript y `localStorage` habilitados.
- Los datos semilla se cargan la primera vez y se pueden restaurar con `localStorage.clear()`.
- El pago es simulado: no hay pasarela real ni cobros.
- Los datos de cada navegador son independientes (no se comparten entre equipos).

---

## 3. Requisitos específicos

Los IDs siguen la numeración de la versión 1, que llegó a HU-30. Los criterios completos están en `docs/backlog.md`. **Prioridad:** Must (obligatorio), Should (importante), Could (opcional).

### 3.1 Requisitos de la versión 1
[PENDIENTE: copiar o resumir aquí HU-01 a HU-30 del ERS V1 e indicar, para cada una, si se mantiene, se reemplaza por una HU nueva (por ejemplo, el detalle en ventana emergente pasa a HU-33) o queda fuera.]

### 3.2 Requisitos funcionales — Tienda

| ID | Requisito | Criterios principales | Prior. | Resp. |
|---|---|---|---|---|
| HU-31 | Ver la página de inicio | Carrusel Bootstrap con ≥ 3 destacados; tarjetas de categorías que llevan a `/categorias/:id`; grilla de destacados con `ProductList`; 1, 2 y 3–4 columnas en 375, 768 y 1280 px | Must | Maximiliano |
| HU-32 | Explorar y filtrar productos | `ProductList` recibe el arreglo por props; búsqueda desde la barra (`/productos?q=`); filtros por plataforma, categoría y precio sin recargar; mensaje si no hay resultados; productos sin stock muestran "Agotado" | Must | Maximiliano |
| HU-33 | Ver el detalle de un producto | Ruta `/productos/:id`; imagen, plataforma, categoría, descripción, precio (tachado si hay oferta) y stock; selector de cantidad; "Producto no encontrado"; hasta 4 relacionados | Must | Maximiliano |
| HU-34 | Navegar por categoría | `/categorias` y `/categorias/:id`; desplegable en la barra; mensaje si la categoría está vacía; las categorías nuevas del admin aparecen sin tocar código | Must | Maximiliano |
| HU-35 | Ver productos en oferta | Solo productos con `precioOferta < precio`; precio original tachado e insignia con % de descuento; mensaje si no hay ofertas | Must | Maximiliano |
| HU-36 | Gestionar el carrito | Tabla con imagen, nombre, precio, cantidad (− / +), subtotal y eliminar (`CartItemRow`); total al instante; "Limpiar" pide confirmación; carrito vacío deshabilita "Comprar ahora"; persiste al recargar | Must | Emanuel |
| HU-37 | Checkout con dirección de entrega | Resumen (`OrderSummaryTable`) y total destacado; nombre*, apellidos*, correo*, calle*, depto., región*, comuna*, indicaciones, tipo de entrega; comunas según la región; autocompletado con la sesión; errores bajo cada campo; carrito vacío redirige a `/carrito`; despacho suma $4.000 | Must | Emanuel |
| HU-38 | Compra exitosa con boleta | Crea la orden con número correlativo, descuenta stock y vacía el carrito; "Se ha realizado la compra nro #…"; boleta con cliente, dirección, productos y total pagado; impresión con `window.print()` sin barra de navegación; "Orden no encontrada" | Must | Emanuel |
| HU-39 | Pago rechazado y reintento | Rechazo si falta stock al pagar o si se marca "Simular pago rechazado"; muestra el motivo y el detalle; **no** vacía el carrito ni descuenta stock; "Volver a realizar el pago" regresa al checkout con el formulario lleno | Must | Emanuel |
| HU-40 | Iniciar sesión y registrarse | Administrador va a `/admin` y cliente a `/`; "Usuario o contraseña incorrectos"; registro con RUT, correo, contraseña, región y comuna validados mientras se escribe; correo repetido rechazado; panel de cuentas demo | Must | Jim |
| HU-41 | Blog y detalle de artículo | Listado con imagen, título, autor, fecha y resumen; detalle en `/blog/:id`; "Artículo no encontrado" | Should | Maximiliano |
| HU-42 | Nosotros y contacto | Misión, visión y equipo generado desde un arreglo; contacto guardado en `db.js` con ticket correlativo `PVT-000001`; mensaje de máximo 500 caracteres | Should | Maximiliano |
| HU-43 | Consultar mis compras | `/mis-compras` exige sesión; lista solo las órdenes propias con número, fecha, total y estado; abre la boleta de cada una | Should | Emanuel |

### 3.3 Requisitos funcionales — Administración
Todas las rutas `/admin/*` exigen sesión con rol **Administrador**.

| ID | Requisito | Criterios principales | Prior. | Resp. |
|---|---|---|---|---|
| HU-44 | Dashboard | Tarjetas (`StatCard`) de compras, productos y usuarios calculadas desde `db.js`; accesos rápidos; alerta de stock crítico; barra lateral con la sección activa y "Cerrar sesión" | Must | Jim |
| HU-45 | Órdenes y boletas | Tabla con número, fecha, cliente, total y estado; filtro por estado y búsqueda por cliente al instante; "Ver boleta" en `/admin/ordenes/:numero`; cambio de estado (En preparación, Enviado, Entregado, Cancelado) guardado en `db.js` | Must | Emanuel |
| HU-46 | Administrar productos | Listado con acciones; un mismo `ProductForm` crea y edita (recibe el producto por props); valida precio > 0, stock ≥ 0, nombre y oferta < precio; eliminar pide confirmación; los cambios se ven en la tienda | Must | Jim |
| HU-47 | Stock crítico | Solo productos con `stock <= stockCritico`; sin stock en rojo y en el límite en amarillo; acceso a "Editar" | Must | Jim |
| HU-48 | Administrar categorías | Lista con cantidad de productos; crear y editar con nombre válido y no repetido; no se elimina una categoría con productos | Must | Jim (reasignada desde Maximiliano) |
| HU-49 | Administrar usuarios | Lista con RUT, nombre, correo, rol y estado, con búsqueda; un mismo `UserForm` crea y edita; RUT y correo válidos y únicos; el administrador no puede desactivarse a sí mismo; acceso al historial de compras | Must | Jim (reasignada desde Maximiliano) |
| HU-50 | Historial de compras de un usuario | `/admin/usuarios/:id/compras` con las órdenes del usuario y total acumulado; "Este usuario aún no tiene compras"; enlace a cada boleta | Should | Emanuel |
| HU-51 | Reportes | Total vendido, cantidad de órdenes, ticket promedio y ventas por categoría con barras de progreso; 5 más vendidos y valor del inventario; rango de 7 días, 30 días o todo; "Sin ventas en este período" | Should | Jim |
| HU-52 | Editar mi perfil | Muestra los datos del usuario en sesión; guarda los cambios en `db.js` y actualiza la barra; cambiar la contraseña exige la actual | Could | Emanuel |

### 3.4 Requisitos técnicos

| ID | Requisito | Prior. | Resp. |
|---|---|---|---|
| TEC-01 | Proyecto React con Vite y repositorio público en GitHub | Must | Jim |
| TEC-02 | Base de datos simulada `db.js` con CRUD sobre `localStorage` y datos semilla de la Eval 1 | Must | Jim |
| TEC-03 | Layouts de tienda y admin, barra de navegación (buscador, desplegable de categorías, menú móvil) y rutas | Must | Maximiliano |
| TEC-04 | Sesión simulada y rutas protegidas por rol (`ProtectedRoute`) | Must | Jim |
| TEC-05 | Estado global del carrito (`CartContext`): stock, ofertas y persistencia | Must | Emanuel |
| TEC-06 | Estilos de la Eval 1 migrados y componentes comunes | Must | Maximiliano |
| TEC-07 | ERS versión 2 (este documento) | Must | Emanuel |
| TEC-08 | README, paquete .zip y entrega en AVA | Must | Jim |
| TEC-09 | Presentación y defensa individual | Must | Todos |
| MEJ-01 | Revisión responsiva de todas las vistas en 375, 768 y 1280 px | Must | Maximiliano |

### 3.5 Requisitos no funcionales

| ID | Categoría | Requisito |
|---|---|---|
| RNF-01 | Usabilidad / responsivo | Todas las vistas se usan sin scroll horizontal en 375, 768 y 1280 px. Grillas con `row` / `col-*`, tablas con `table-responsive` y barra con `navbar-expand-lg`. Sin anchos fijos en píxeles |
| RNF-02 | Rendimiento | La navegación entre rutas no recarga la página (React Router). Las listas y filtros se actualizan al instante con el estado de React |
| RNF-03 | Persistencia | Catálogo, usuarios, órdenes y carrito se mantienen al recargar (`localStorage`). La sesión dura mientras la pestaña esté abierta (`sessionStorage`) |
| RNF-04 | Seguridad (simulada) | Las rutas `/admin/*` exigen rol Administrador y `/mis-compras` exige sesión. Un cliente solo ve sus propias órdenes. Cambiar la contraseña exige la actual. *Al no haber backend, las contraseñas quedan en `localStorage`: no apto para producción* |
| RNF-05 | Integridad de datos | El pago verifica el stock contra `db.js` antes de crear la orden; un pago rechazado no modifica datos. RUT (dígito verificador) y correo se validan, y no se repiten entre usuarios |
| RNF-06 | Mantenibilidad | Componentes funcionales con hooks y una sola responsabilidad. Los datos llegan por props o Context; no hay listas escritas dentro de los componentes. Nombres en español |
| RNF-07 | Accesibilidad | Cada campo de formulario tiene su `label`, los errores se muestran bajo el campo y los botones que solo tienen ícono llevan `aria-label` |
| RNF-08 | Compatibilidad | Funciona en las versiones actuales de Chrome, Edge y Firefox. Requiere Node.js 18 o superior para desarrollar |
| RNF-09 | Localización | Interfaz en español de Chile, montos en CLP (`$34.990`) y fechas con formato `es-CL` |

### 3.6 Interfaces externas
- **Usuario:** interfaz web con el tema "Steam + 16-bit" de la versión 1 (`estilos.css`) sobre el modo oscuro de Bootstrap.
- **Hardware:** cualquier equipo con navegador moderno; impresora opcional para la boleta.
- **Software:** sin APIs externas. El pago es simulado.

---

## 4. Arquitectura de la versión React

### 4.1 Capas

```text
pages/        Vistas por ruta (tienda/ y admin/)
  └─ components/  Piezas reutilizables (layout, productos, carrito, compra, perfil, admin, common)
       └─ context/   Estado global: AuthContext (sesión) y CartContext (carrito)
            └─ data/      db.js (CRUD sobre localStorage), seed.js, regiones.js
```

Bootstrap 5.3.3 (CSS y JS) se importa una vez en `src/main.jsx`. Los datos semilla se cargan en `localStorage` la primera vez que se abre la aplicación.

### 4.2 Mapa de rutas

| Ruta | Vista | Acceso | HU |
|---|---|---|---|
| `/` | Inicio | Público | HU-31 |
| `/productos` (acepta `?q=`) · `/productos/:id` | Catálogo · Detalle | Público | HU-32, HU-33 |
| `/categorias` · `/categorias/:id` | Categorías | Público | HU-34 |
| `/ofertas` | Ofertas | Público | HU-35 |
| `/blog` · `/blog/:id` | Blog · Artículo | Público | HU-41 |
| `/nosotros` · `/contacto` | Nosotros · Contacto | Público | HU-42 |
| `/carrito` · `/checkout` | Carrito · Checkout | Público | HU-36, HU-37 |
| `/compra/exito/:numero` · `/compra/error` | Pago exitoso · Pago rechazado | Público | HU-38, HU-39 |
| `/login` · `/registro` | Inicio de sesión · Registro | Público | HU-40 |
| `/mis-compras` (acepta `?orden=`) | Mis compras y boleta | Con sesión | HU-43 |
| `/admin` | Dashboard | Administrador | HU-44 |
| `/admin/ordenes` · `/admin/ordenes/:numero` | Órdenes · Boleta | Administrador | HU-45 |
| `/admin/productos` · `/nuevo` · `/:id/editar` · `/criticos` | Productos · Formulario · Stock crítico | Administrador | HU-46, HU-47 |
| `/admin/categorias` | Categorías | Administrador | HU-48 |
| `/admin/usuarios` · `/nuevo` · `/:id/editar` · `/:id/compras` | Usuarios · Formulario · Historial | Administrador | HU-49, HU-50 |
| `/admin/reportes` | Reportes | Administrador | HU-51 |
| `/admin/perfil` | Mi perfil | Administrador | HU-52 |
| `*` | Página no encontrada (404) | Público | HU-42 |

### 4.3 Estructura de componentes

| Carpeta | Componentes | Responsable |
|---|---|---|
| `layout/` | `TiendaLayout`, `Navbar`, `Footer`, `AdminLayout`, `AdminSidebar` | Maximiliano / Jim |
| `productos/` | `ProductCard`, `ProductList`, `ProductFilters`, `PriceTag`, `BuscadorProductos`, `MenuCategorias` [PENDIENTE: confirmar nombres finales con Maximiliano] | Maximiliano |
| `carrito/` | `CartItemRow` (props `item`, `onCambiarCantidad`, `onEliminar`), `CartSummary`, `ConfirmModal` | Emanuel |
| `compra/` | `CustomerForm`, `AddressForm`, `DeliveryOptions`, `OrderSummaryTable`, `Boleta`, `OrdersTable`, `EstadoBadge`; lógica `pago.js` (pago simulado) | Emanuel |
| `perfil/` | `PerfilForm`, `CambioClaveForm` | Emanuel |
| `admin/` | `StatCard`, `AccesoRapido`, `ProductForm`, `CategoryForm`, `UserForm` | Jim |
| `auth/` | `CuentasDemo` | Jim |
| `common/` | `AlertMessage`, `FormField`, `SelectField`, `ConfirmModal` | Jim |

### 4.4 Estado global (Contexts)

| Context | Expone | Persistencia |
|---|---|---|
| `AuthContext` | `usuario`, `login`, `logout`, `registrar`, `tieneRol`, `refrescarUsuario` | Id del usuario en `sessionStorage` |
| `CartContext` | `items`, `agregar`, `quitar`, `cambiarCantidad`, `vaciar`, `total`, `cantidadItems` | `localStorage` (clave `pixelvault_carrito`); al cargar se actualizan precio y stock desde `db.js` |

### 4.5 Modelo de datos (`db.js`)

`db.js` ofrece `getAll`, `getById`, `create` (asigna el id), `update` y `remove` sobre seis colecciones guardadas en `localStorage` con el prefijo `pixelvault_`.

| Colección | Campos |
|---|---|
| `productos` | `id`, `codigo`, `nombre`, `categoriaId`, `plataforma`, `precio`, `precioOferta` (número o `null`), `stock`, `stockCritico`, `descripcion`, `imagen`, `activo`, `destacado` |
| `categorias` | `id`, `nombre`, `imagen` |
| `usuarios` | `id`, `usuario`, `rut`, `nombre`, `apellidos`, `correo`, `clave`, `rol`, `region`, `comuna`, `direccion`, `activo` |
| `ordenes` | `id`, `numero` (correlativo), `fecha` (ISO), `usuarioId` (o `null`), `cliente {nombre, apellidos, correo}`, `direccion {calle, depto, region, comuna, indicaciones}`, `tipoEntrega` (`retiro` / `despacho`), `items [{productoId, nombre, precio, cantidad, imagen}]`, `subtotal`, `despacho`, `total`, `estado` |
| `blog` | `id`, `slug`, `categoria`, `nombreCategoria`, `badgeColor`, `titulo`, `autor`, `fecha`, `tiempoLectura`, `imagen`, `resumen`, `cuerpo` (HTML) |
| `contactos` | `id`, `ticket` (`PVT-000001`), `nombre`, `correo`, `mensaje`, `fecha` |

**Relaciones:** `producto.categoriaId → categoria.id` · `orden.usuarioId → usuario.id` · `orden.items[].productoId → producto.id`.

**Datos semilla:** 15 productos (4 en oferta y 2 en stock crítico), 6 categorías, 7 usuarios (uno por rol más los integrantes), 6 artículos y 2 órdenes de ejemplo. `regiones.js` contiene las 16 regiones de Chile con sus 346 comunas.

### 4.6 Reglas de negocio
- **RN-01** El carrito cobra `precioOferta` cuando existe y es menor que `precio`.
- **RN-02** No se puede agregar ni pedir más unidades que el stock disponible.
- **RN-03** El despacho a domicilio cuesta $4.000; el retiro en tienda es gratis.
- **RN-04** Una orden nueva queda "En preparación" y recibe el número correlativo siguiente al mayor existente.
- **RN-05** Solo un pago aprobado descuenta stock y vacía el carrito.
- **RN-06** Un producto está en stock crítico cuando `stock <= stockCritico`.
- **RN-07** No se elimina una categoría con productos asociados.

---

## 5. Verificación y pruebas

**Las pruebas unitarias con Jasmine y Karma quedaron fuera de alcance por decisión del docente**, y con ellas el documento de cobertura de pruebas.

En su lugar, cada historia se verifica **a mano** contra sus criterios de aceptación antes de pasar a "Hecho" en Trello (Definition of Done, `docs/plan.md` §4):
- Criterios de aceptación probados en el navegador.
- Sin errores nuevos en la consola.
- Revisión en 375, 768 y 1280 px.
- `npm run build` sin errores antes de cada `push` a `main`.

[PENDIENTE: agregar una tabla de casos de prueba manuales con su resultado si el formato del Anexo 4 la pide.]

---

## 6. Trazabilidad (enunciado → requisitos)

| Necesidad del enunciado | Requisitos |
|---|---|
| Migrar HTML a React con componentes reutilizables | TEC-01, TEC-03, TEC-06, HU-31 a HU-43 |
| Props y estado bien gestionados | TEC-04, TEC-05, HU-32, HU-36, HU-37, HU-40, HU-46 |
| Archivo JS de datos con CRUD | TEC-02, HU-46, HU-48, HU-49 |
| Persistencia conectada a la interfaz | TEC-02, TEC-05, HU-34, HU-46 |
| Responsivo con Bootstrap | TEC-03, HU-31, MEJ-01, RNF-01 |
| Vistas de categorías y ofertas | HU-34, HU-35, HU-48 |
| Checkout con dirección | HU-37 |
| Pago correcto y pago con error | HU-38, HU-39 |
| Detalle de producto y de blog | HU-33, HU-41 |
| Admin: dashboard, órdenes y boletas | HU-44, HU-45 |
| Admin: productos, stock crítico y reportes | HU-46, HU-47, HU-51 |
| Admin: categorías, usuarios e historial de compras | HU-48, HU-49, HU-50 |
| Admin: perfil | HU-52 |
| ERS V2 | TEC-07 |
| GitHub público y proyecto comprimido | TEC-01, TEC-08 |
| Presentación y defensa | TEC-09 |
| Pruebas Jasmine/Karma y documento de cobertura | **Fuera de alcance** (decisión docente) |

---

## Anexo A — Aportes por integrante

| Integrante | Área | Resumen |
|---|---|---|
| Jim Charles | Base del proyecto, sesión y administración de catálogo | [PENDIENTE: 3–4 líneas de Jim] |
| Emanuel Reyes | Flujo de compra, órdenes y ERS | Carrito global con validación de stock y ofertas; checkout con región → comuna y autocompletado con la sesión; pago simulado con creación de la orden, boleta imprimible y pago rechazado con reintento; administración de órdenes con cambio de estado, historial por usuario, mis compras y perfil |
| Maximiliano Peral | Tienda pública, UI y responsivo | [PENDIENTE: 3–4 líneas de Maximiliano] |

## Anexo B — Cuentas de demostración

| Usuario | Contraseña | Rol |
|---|---|---|
| Jim / Emanuel / Maximiliano | `admin` | Administrador |
| fernando | `operador` | Operador |
| adriana | `editor` | Editor |
| ilie | `repartidor` | Repartidor |
| francisco | `cliente` | Cliente (con 2 órdenes de ejemplo) |
