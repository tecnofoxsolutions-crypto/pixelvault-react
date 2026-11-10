# Especificación de Requisitos de Software (ERS) — PixelVault

**Versión 2.0** — Evaluación Parcial 2, DSY1104 Desarrollo Fullstack II (Duoc UC)
**Responsable del documento:** Emanuel Reyes (TEC-07) · **Aportes:** Jim Charles, Maximiliano Peral

> Este documento se armó a partir de `docs/backlog.md`, `docs/plan.md`, `docs/ficha-tecnica.md`, `docs/CAMBIOS-FINALES.md`, el código del repositorio y el ERS V1 de la Evaluación 1.

## Control de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 2026-09-15 | Equipo PixelVault | Documento base de la Evaluación 1 según el Anexo 4: tienda en HTML + Bootstrap + JavaScript nativo |
| 1.5 | 2026-09-18 | Equipo PixelVault | Roles Operador, Repartidor y Editor; blog; trazabilidad de pedidos |
| 1.9 | 2026-09-21 | Equipo PixelVault | Versión final de la Evaluación 1 (HU-01 a HU-30): despacho $4.000, códigos por consola, tickets `PVT-000001`, logística en etapas, panel de Staff |
| 2.0 (borrador) | 2026-11-10 | Emanuel Reyes | Migración a React, nuevas vistas de tienda y administración (HU-31 a HU-52), modelo de datos con CRUD |
| 2.0 | 2026-11-10 | Equipo PixelVault | Cambios finales CF-01 a CF-20: permisos por rol en el Panel Staff, flujo de órdenes `PV-000001` con repartidor y foto de entrega, historial de movimientos, compra con creación de cuenta, encuadre de imágenes y trazabilidad con el ERS V1 |

---

## 1. Introducción

### 1.1 Propósito
Este documento describe los requisitos de PixelVault, una tienda en línea de videojuegos en formato físico. La versión 2 actualiza la especificación de la Evaluación 1 por el cambio de tecnología a **React** y agrega las vistas y funciones que exige la Evaluación 2:
- categorías y ofertas;
- checkout con dirección;
- pago exitoso y pago con error;
- un panel de administración completo (Panel Staff).

Está dirigido al docente (Product Owner), al equipo de desarrollo y a quien mantenga el sistema después.

### 1.2 Alcance
PixelVault es una aplicación web de una sola página (SPA), **solo frontend**, que permite:
- **A los visitantes y clientes:** explorar el catálogo, buscar y filtrar, ver categorías y ofertas, armar un carrito, crear su cuenta al comprar, elegir despacho o retiro, ver la boleta, seguir el estado de sus pedidos y editar su perfil.
- **Al personal de la tienda (Panel Staff):** cada rol trabaja solo en lo suyo.
  - **Administrador:** todo el panel.
  - **Operador:** órdenes, productos y stock crítico.
  - **Editor:** blog.
  - **Repartidor:** sus entregas, con foto y comentario.

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
| Panel Staff | Panel `/admin` para el personal; cada rol ve solo sus secciones |
| HU | Historia de usuario · **RF** requisito funcional · **RNF** requisito no funcional |
| CF | Cambio final aplicado antes de la entrega (`docs/CAMBIOS-FINALES.md`) |
| CA | Criterio de aceptación (formato *Dado… Cuando… Entonces…*) |
| CLP | Peso chileno, mostrado como `$34.990` |
| Stock crítico | Umbral bajo el cual un producto debe reponerse (`stock <= stockCritico`) |

### 1.4 Referencias
- ERS V1 de PixelVault (Evaluación 1): `ERS_Especificacion_Requisitos.md` e `Historias_de_Usuario.md`, septiembre de 2026, sobre la plantilla "DSY1104 Evaluación Parcial 1 - Anexo 4 ERS".
- Instrucciones de la Evaluación Parcial 2, DSY1104 (Duoc UC), Anexo 1.
- `docs/backlog.md`: historias con criterios de aceptación completos.
- `docs/plan.md`: plan de desarrollo y reparto del equipo.
- `docs/ficha-tecnica.md`: stack y estructura del proyecto.
- `docs/CAMBIOS-FINALES.md`: cambios CF-01 a CF-20.
- Repositorio: https://github.com/tecnofoxsolutions-crypto/pixelvault-react
- Tablero Trello: https://trello.com/b/b9v2jK3p/pixel-vault

### 1.5 Visión general del documento
- **Sección 2:** el producto y su contexto.
- **Sección 3:** requisitos funcionales y no funcionales, incluida la relación con las historias del ERS V1.
- **Sección 4:** arquitectura de la versión React (rutas, componentes y modelo de datos).
- **Sección 5:** estrategia de verificación y casos de prueba manuales.
- **Sección 6:** trazabilidad con el enunciado.

---

## 2. Descripción general

### 2.1 Perspectiva del producto
La versión 1 era un sitio de 8 páginas HTML con Bootstrap 5.3.3 y JavaScript nativo dentro de cada página. La versión 2 **reemplaza todas esas páginas** por una aplicación React y conserva las reglas de negocio de la versión 1.

| Aspecto | Versión 1 (Eval 1) | Versión 2 (Eval 2) |
|---|---|---|
| Tecnología | HTML + Bootstrap + JS nativo | React 18 + Vite 5 + React Router 6 + Bootstrap 5.3.3 |
| Navegación | Un archivo `.html` por página | Rutas de React Router, sin recargar la página |
| Detalle de producto y de blog | Ventana emergente | Ruta propia (`/productos/:id`, `/blog/:id`) |
| Datos | `<script>` dentro de cada página + `localStorage` | `src/data/db.js` con CRUD genérico sobre `localStorage` |
| Estado compartido | Variables globales | `AuthContext` (sesión) y `CartContext` (carrito) |
| Compra | Carrito con registro obligatorio y despacho $4.000 | Checkout con región/comuna, tipo de entrega, creación de cuenta y pago simulado con éxito o error |
| Administración | Panel de Staff en `catalogo.html` y `blog.html`: CRUD de juegos, destacados, usuarios, blog, pedidos y auditoría | Panel Staff en `/admin` con una vista por sección y permisos por rol |

**Funciones de la versión 1 que se mantienen** (ahora en React):
- Despacho de $4.000.
- Códigos de inventario por consola (`PS5-015`).
- Órdenes `PV-000001` con logística en etapas y foto de entrega.
- Tickets `PVT-000001`.
- Roles Operador, Editor y Repartidor.
- Bitácora de movimientos.
- Cuentas demo clickeables.
- Efecto de estrella en los destacados.
- Transición CRT al cargar.

**Funciones que quedan fuera:**
- Suscripción al boletín (HU-17).
- Modal de términos y condiciones (parte de HU-25).
- Contador numérico de pedidos pendientes en el menú (HU-27).

### 2.2 Funciones del producto
- **Catálogo:** inicio con carrusel, listado con búsqueda y filtros, detalle, categorías y ofertas.
- **Compra:**
  - Carrito persistente y checkout con validaciones; sin sesión, la compra crea la cuenta del cliente.
  - Pago simulado y boleta imprimible.
  - Mis compras con seguimiento, foto y comentario de entrega.
- **Cuenta:** registro, inicio de sesión con cuentas de demostración y edición del perfil (clientes y staff).
- **Contenido:** blog con detalle de artículos, nosotros, contacto con número de ticket.
- **Panel Staff:**
  - Dashboard por rol.
  - CRUD de productos (imagen por URL o archivo, con encuadre), categorías, usuarios (clientes y staff) y artículos del blog.
  - Stock crítico.
  - Órdenes con flujo de estados y asignación de repartidor.
  - Entregas del repartidor.
  - Historial de compras por usuario, reportes e historial de movimientos.

### 2.3 Características de los usuarios

| Rol | Descripción | Acceso |
|---|---|---|
| Visitante | Sin sesión | Tienda pública y carrito. Para pagar crea su cuenta en el mismo checkout |
| Cliente | Cuenta propia (registro o checkout) | Lo anterior + datos precargados en el checkout + Mis compras + Mi perfil |
| Administrador | Dueño de la tienda | Todo el Panel Staff |
| Operador | Bodega y ventas | Órdenes (preparar, asignar repartidor, marcar retiro), productos y stock crítico |
| Editor | Contenido | Blog (crear, editar y eliminar artículos) |
| Repartidor | Despacho a domicilio | Mis entregas: iniciar ruta y marcar la entrega con foto y comentario |

Todo el staff entra directo al Panel Staff al iniciar sesión, y cada uno tiene su perfil en `/admin/perfil`.

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
- Las imágenes subidas desde el equipo se comprimen y se guardan dentro de `localStorage`, que tiene un límite de unos 5 MB.

---

## 3. Requisitos específicos

Los IDs siguen la numeración de la versión 1, que llegó a HU-30. Los criterios completos están en `docs/backlog.md`. **Prioridad:** Must (obligatorio), Should (importante), Could (opcional).

### 3.1 Requisitos de la versión 1

| HU V1 | Historia | Estado en V2 | Dónde |
|---|---|---|---|
| HU-01 | Catálogo con tarjetas y filtros | Se mantiene | HU-32 |
| HU-02 | Ficha técnica en modal | Se reemplaza: ruta propia | HU-33 |
| HU-03 | Control de stock en carrito y bodega | Se mantiene | HU-36, RN-02 |
| HU-04 | Carrito y simulación de checkout | Se reemplaza por el flujo completo | HU-36 a HU-39 |
| HU-05 | Alta y edición de videojuegos | Se mantiene | HU-46 |
| HU-06 | Gestión desde la lista y desde el modal | Se reemplaza: listado con acciones y formulario propio | HU-46 |
| HU-07 | Métricas de inventario para administradores | Se mantiene | HU-44, HU-51 |
| HU-08 | Inicio de sesión con control de seguridad | Se mantiene | HU-40 |
| HU-09 | Presentación del equipo | Se mantiene | HU-42 (Nosotros) |
| HU-10 | Cuentas demo clickeables en el login | Se mantiene | HU-40 (`CuentasDemo`) |
| HU-11 | Transición retro CRT | Se mantiene (al cargar la aplicación) | `estilos.css` |
| HU-12 | Gestión de destacados | Se mantiene (campo `destacado`) | HU-46 |
| HU-13 | Vitrina de destacados (carrusel) | Se mantiene | HU-31 |
| HU-14 | Efecto "Super Estrella" en destacados | Se mantiene | HU-31 |
| HU-15 | CRUD del blog | Se mantiene | HU-53 |
| HU-16 | Gestión de usuarios y accesos | Se mantiene | HU-49 |
| HU-17 | Suscripción al boletín | Fuera de alcance | — |
| HU-18 | Matriz de roles y accesos | Se mantiene | HU-54 |
| HU-19 | Auditoría e historial de movimientos | Se mantiene | HU-55 |
| HU-20 | Seguimiento de pedidos y Mis compras | Se mantiene | HU-43, HU-45 |
| HU-21 | Carátulas desde el dispositivo | Se mantiene (URL o archivo, no ambos) | HU-46 |
| HU-22 | Compra como invitado o con invitación a registro | Se reemplaza por HU-24 | HU-57 |
| HU-23 | Repartidor con foto de entrega | Se mantiene | HU-56 |
| HU-24 | Registro obligatorio para comprar | Se mantiene: la cuenta se crea en el checkout | HU-57 |
| HU-25 | Órdenes `PV-000001` y modal de términos | Se mantiene el código `PV`; el modal de términos queda fuera | HU-38 |
| HU-26 | Asignado a repartidor → En camino | Se mantiene | HU-45, HU-56 |
| HU-27 | Contador de pedidos en el menú | Fuera de alcance (el Dashboard muestra las métricas por rol) | HU-44 |
| HU-28 | Cambio de rol con selector y auditoría | Se mantiene | HU-49, HU-55 |
| HU-29 | Tickets `PVT-000001` e IDs correlativos | Se mantiene | HU-42, `db.js` |
| HU-30 | Despacho $4.000 y códigos por plataforma | Se mantiene | RN-03, HU-46 |

### 3.2 Requisitos funcionales — Tienda

| ID | Requisito | Criterios principales | Prior. | Resp. |
|---|---|---|---|---|
| HU-31 | Ver la página de inicio | Carrusel con los destacados (efecto estrella); tarjetas de categorías que llevan a `/categorias/:id`; grilla de destacados con `ProductList`; 1, 2 y 3–4 columnas en 375, 768 y 1280 px | Must | Maximiliano |
| HU-32 | Explorar y filtrar productos | `ProductList` recibe el arreglo por props; búsqueda desde la barra (`/productos?q=`); filtros por plataforma, categoría, precio y "solo ofertas" sin recargar; la tarjeta muestra la categoría; mensaje si no hay resultados; "Agotado" sin stock | Must | Maximiliano |
| HU-33 | Ver el detalle de un producto | Ruta `/productos/:id`; imagen, plataforma, categoría, descripción, precio (tachado si hay oferta) y stock; selector de cantidad; "Producto no encontrado"; hasta 4 relacionados | Must | Maximiliano |
| HU-34 | Navegar por categoría | `/categorias` y `/categorias/:id` con imagen propia por categoría; acceso desde el desplegable "Productos"; mensaje si la categoría está vacía; las categorías nuevas del admin aparecen sin tocar código | Must | Maximiliano |
| HU-35 | Ver productos en oferta | Solo productos con `precioOferta < precio`; precio original tachado e insignia con % de descuento; acceso desde el desplegable "Productos"; mensaje si no hay ofertas | Must | Maximiliano |
| HU-36 | Gestionar el carrito | Tabla con imagen, nombre, precio, cantidad (− / +), subtotal y eliminar (`CartItemRow`); total al instante; "Limpiar" pide confirmación; el botón del carrito en la barra solo aparece con productos; persiste al recargar | Must | Emanuel |
| HU-37 | Checkout con dirección de entrega | Resumen (`OrderSummaryTable`) y total destacado; nombre*, apellidos*, correo*, calle*, depto., región*, comuna*, indicaciones, tipo de entrega; comunas según la región; autocompletado con la sesión; errores bajo cada campo; carrito vacío redirige a `/carrito`; despacho suma $4.000 | Must | Emanuel |
| HU-38 | Compra exitosa con boleta | Crea la orden con código `PV-000001` correlativo, descuenta stock y vacía el carrito; muestra "Se ha realizado la compra nro #…"; boleta con cliente, dirección, tipo de entrega, productos y total; impresión con `window.print()` sin barra de navegación; "Orden no encontrada" | Must | Emanuel |
| HU-39 | Pago rechazado y reintento | Rechazo si falta stock al pagar o si se marca "Simular pago rechazado"; muestra el motivo; **no** vacía el carrito ni descuenta stock; "Volver a realizar el pago" regresa al checkout con el formulario lleno | Must | Emanuel |
| HU-40 | Iniciar sesión y registrarse | El staff va al Panel Staff y el cliente a la tienda; "Usuario o contraseña incorrectos"; registro con RUT, correo, contraseña, región y comuna validados mientras se escribe; correo repetido rechazado; panel de cuentas demo | Must | Jim |
| HU-41 | Blog y detalle de artículo | Listado con imagen, título, autor, fecha y resumen, con filtro por categoría; detalle en `/blog/:id`; "Artículo no encontrado" | Should | Maximiliano |
| HU-42 | Nosotros y contacto | Misión, visión y equipo generado desde un arreglo; contacto guardado en `db.js` con ticket correlativo `PVT-000001`; mensaje de máximo 500 caracteres | Should | Maximiliano |
| HU-43 | Consultar mis compras | `/mis-compras` exige sesión; lista solo las órdenes propias con código, fecha, total, tipo de entrega y estado; "Detalles" abre la boleta con el historial de estados y, si fue despacho, la foto y el comentario del repartidor | Should | Emanuel |
| HU-57 | Crear cuenta al comprar | Sin sesión, el checkout pide además RUT, contraseña y confirmación; valida que el correo y el RUT no existan; al pagar crea la cuenta de Cliente con la sesión iniciada y la orden queda asociada a ella; las contraseñas no se guardan en el borrador | Must | Jim (CF-20) |
| HU-58 | Editar mi perfil (cliente) | El botón con el nombre en la barra abre `/perfil`; mismos campos y reglas que HU-52 | Should | Jim (CF-20) |

### 3.3 Requisitos funcionales — Panel Staff
Todas las rutas `/admin/*` exigen sesión con un rol del staff, y cada sección exige los roles de `src/data/permisos.js` (HU-54).

| ID | Requisito | Criterios principales | Prior. | Resp. |
|---|---|---|---|---|
| HU-44 | Dashboard | Tarjetas (`StatCard`) calculadas desde `db.js` según el rol; accesos rápidos solo a las secciones permitidas; alerta de stock crítico; barra lateral con la sección activa y "Cerrar sesión" | Must | Jim |
| HU-45 | Órdenes y boletas | Tabla con código, fecha, cliente, tipo de entrega, total y estado; filtros por estado y tipo de entrega, y búsqueda por cliente; "Detalles" en `/admin/ordenes/:numero`; botón "siguiente estado" según el flujo (RN-04), asignación de repartidor e historial de estados | Must | Emanuel / Jim (CF-10, CF-17) |
| HU-46 | Administrar productos | Listado con acciones; un mismo `ProductForm` crea y edita; código automático por plataforma (`PS5-015`); imagen por URL **o** archivo, con editor de encuadre; valida precio > 0, stock ≥ 0, nombre y oferta < precio; eliminar pide confirmación | Must | Jim |
| HU-47 | Stock crítico | Solo productos con `stock <= stockCritico`; sin stock en rojo y en el límite en amarillo; acceso a "Editar" | Must | Jim |
| HU-48 | Administrar categorías | Lista con cantidad de productos; crear y editar con nombre válido y no repetido; no se elimina una categoría con productos | Must | Jim |
| HU-49 | Administrar usuarios | Pestañas Clientes y Staff con búsqueda; un mismo `UserForm` crea y edita, con selector de rol; RUT y correo válidos y únicos; el administrador no puede desactivarse a sí mismo; acceso al historial de compras | Must | Jim |
| HU-50 | Historial de compras de un usuario | `/admin/usuarios/:id/compras` con las órdenes del usuario y el total acumulado; "Este usuario aún no tiene compras"; enlace a cada boleta | Should | Emanuel |
| HU-51 | Reportes | Total vendido, cantidad de órdenes, ticket promedio y ventas por categoría con barras; 5 más vendidos y valor del inventario; rango de 7 días, 30 días o todo; "Sin ventas en este período" | Should | Jim |
| HU-52 | Editar mi perfil (staff) | Muestra los datos del usuario en sesión; guarda los cambios en `db.js` y actualiza la barra; correo y RUT únicos; cambiar la contraseña exige la actual | Could | Emanuel |
| HU-53 | Administrar el blog | `/admin/blog` para Administrador y Editor; crear, editar y eliminar artículos con imagen y categoría; los cambios se ven en `/blog` | Should | Jim (CF-13) |
| HU-54 | Permisos por rol | Cada sección del panel declara sus roles en `permisos.js`; el menú lateral y los accesos rápidos muestran solo lo permitido; entrar por URL a una sección sin permiso muestra "Acceso denegado" | Must | Jim (CF-11) |
| HU-55 | Historial de movimientos | Cada `create`, `update` y `remove` de `db.js` queda en la colección `movimientos` con fecha, usuario, rol y detalle legible; vista `/admin/historial` (solo Administrador) con filtros por categoría y texto | Should | Jim (CF-14) |
| HU-56 | Entregas del repartidor | `/admin/entregas` muestra solo las órdenes asignadas al repartidor en sesión; "Iniciar ruta" pasa a "En camino"; "Marcar entregada" exige una foto (comprimida) y acepta un comentario opcional | Must | Jim (CF-12) |

### 3.4 Requisitos técnicos

| ID | Requisito | Prior. | Resp. |
|---|---|---|---|
| TEC-01 | Proyecto React con Vite y repositorio público en GitHub | Must | Jim |
| TEC-02 | Base de datos simulada `db.js` con CRUD sobre `localStorage` y datos semilla de la Eval 1 | Must | Jim |
| TEC-03 | Layouts de tienda y del Panel Staff, barra de navegación (buscador, desplegable "Productos", menú móvil) y rutas | Must | Maximiliano |
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
| RNF-01 | Usabilidad / responsivo | Todas las vistas se usan sin scroll horizontal en 375, 768 y 1280 px. Grillas con `row` / `col-*`, tablas con `table-responsive` y barra con `navbar-expand-lg` |
| RNF-02 | Rendimiento | La navegación entre rutas no recarga la página (React Router). Las listas y los filtros se actualizan al instante con el estado de React. Las fotos se comprimen antes de guardarse |
| RNF-03 | Persistencia | Catálogo, usuarios, órdenes, movimientos y carrito se mantienen al recargar (`localStorage`). La sesión dura mientras la pestaña esté abierta (`sessionStorage`) |
| RNF-04 | Seguridad (simulada) | Las rutas `/admin/*` exigen un rol del staff y cada sección, sus roles. `/mis-compras` y `/perfil` exigen sesión. Un cliente solo ve sus propias órdenes y un repartidor solo las suyas. Cambiar la contraseña exige la actual. *Al no haber backend, las contraseñas quedan en `localStorage`: no apto para producción* |
| RNF-05 | Integridad de datos | El pago verifica el stock contra `db.js` antes de crear la orden; un pago rechazado no modifica datos. RUT (dígito verificador) y correo se validan, y no se repiten entre usuarios |
| RNF-06 | Mantenibilidad | Componentes funcionales con hooks y una sola responsabilidad. Los datos llegan por props o Context; no hay listas escritas dentro de los componentes. Nombres en español |
| RNF-07 | Accesibilidad | Cada campo de formulario tiene su `label`, los errores se muestran bajo el campo y los botones que solo tienen ícono llevan `aria-label` |
| RNF-08 | Compatibilidad | Funciona en las versiones actuales de Chrome, Edge y Firefox. Requiere Node.js 18 o superior para desarrollar |
| RNF-09 | Localización | Interfaz en español de Chile, montos en CLP (`$34.990`) y fechas con formato `es-CL` |
| RNF-10 | Trazabilidad | Toda modificación de datos queda registrada con usuario y fecha en el historial de movimientos (últimos 500) |

### 3.6 Interfaces externas
- **Usuario:** interfaz web con el tema "Steam + 16-bit" de la versión 1 (`estilos.css`) sobre el modo oscuro de Bootstrap, con fondo de patrón gamer.
- **Hardware:** cualquier equipo con navegador moderno; cámara o archivos para la foto de entrega; impresora opcional para la boleta.
- **Software:** sin APIs externas. El pago es simulado.

---

## 4. Arquitectura de la versión React

### 4.1 Capas

```text
pages/        Vistas por ruta (tienda/ y admin/)
  └─ components/  Piezas reutilizables (layout, productos, carrito, compra, perfil, info, admin, auth, common)
       └─ context/   Estado global: AuthContext (sesión) y CartContext (carrito)
            └─ data/      db.js (CRUD sobre localStorage + historial), seed.js, permisos.js, regiones.js
```

Bootstrap 5.3.3 (CSS y JS) se importa una vez en `src/main.jsx`. Los datos semilla se cargan en `localStorage` la primera vez y cada vez que cambia `VERSION_DATOS` en `db.js`.

### 4.2 Mapa de rutas

| Ruta | Vista | Acceso | HU |
|---|---|---|---|
| `/` | Inicio | Público | HU-31 |
| `/productos` (acepta `?q=`) · `/productos/:id` | Catálogo · Detalle | Público | HU-32, HU-33 |
| `/categorias` · `/categorias/:id` | Categorías | Público | HU-34 |
| `/ofertas` | Ofertas | Público | HU-35 |
| `/blog` · `/blog/:id` | Blog · Artículo | Público | HU-41 |
| `/nosotros` · `/contacto` | Nosotros · Contacto | Público | HU-42 |
| `/carrito` · `/checkout` | Carrito · Checkout | Público (el pago crea la cuenta si no hay sesión) | HU-36, HU-37, HU-57 |
| `/compra/exito/:numero` · `/compra/error` | Pago exitoso · Pago rechazado | Público | HU-38, HU-39 |
| `/login` · `/registro` | Inicio de sesión · Registro | Público | HU-40 |
| `/mis-compras` (acepta `?orden=`) | Mis compras y boleta | Con sesión | HU-43 |
| `/perfil` | Mi perfil (cliente) | Con sesión | HU-58 |
| `/admin` · `/admin/perfil` | Dashboard · Mi perfil | Todo el staff | HU-44, HU-52 |
| `/admin/ordenes` · `/admin/ordenes/:numero` | Órdenes · Detalle | Administrador, Operador | HU-45 |
| `/admin/entregas` | Mis entregas | Repartidor | HU-56 |
| `/admin/productos` · `/nuevo` · `/:id/editar` · `/criticos` | Productos · Formulario · Stock crítico | Administrador, Operador | HU-46, HU-47 |
| `/admin/categorias` | Categorías | Administrador | HU-48 |
| `/admin/blog` · `/nuevo` · `/:id/editar` | Blog | Administrador, Editor | HU-53 |
| `/admin/usuarios` · `/nuevo` · `/:id/editar` · `/:id/compras` | Usuarios · Formulario · Historial | Administrador | HU-49, HU-50 |
| `/admin/reportes` | Reportes | Administrador | HU-51 |
| `/admin/historial` | Historial de movimientos | Administrador | HU-55 |
| `*` | Página no encontrada (404) | Público | HU-42 |

### 4.3 Estructura de componentes

| Carpeta | Componentes | Responsable |
|---|---|---|
| `layout/` | `TiendaLayout`, `Navbar`, `Footer`, `AdminLayout`, `AdminSidebar` | Maximiliano / Jim |
| `productos/` | `ProductCard`, `ProductList`, `ProductFilters`, `PriceTag`, `PlataformaBadge`, `SelectorCantidad`, `CarruselDestacados`, `CategoryCard`, `CategoryList`, `BuscadorProductos`, `MenuProductos`, `ImagenEncuadrada`, `EmptyState` | Maximiliano |
| `info/` | `BlogCard`, `FiltroCategoriasBlog`, `TeamMemberCard`, `CaracteristicaCard`, `ContactForm` | Maximiliano |
| `carrito/` | `CartItemRow` (props `item`, `onCambiarCantidad`, `onEliminar`), `CartSummary`, `ConfirmModal` | Emanuel |
| `compra/` | `CustomerForm`, `CuentaNuevaForm`, `AddressForm`, `DeliveryOptions`, `OrderSummaryTable`, `Boleta`, `ComprobanteEntrega`, `OrdersTable`, `EstadoBadge`, `TipoEntregaBadge`, `AccionesOrden`, `HistorialEstados`; lógica `pago.js` y `ordenes.js` | Emanuel / Jim |
| `perfil/` | `PerfilForm`, `CambioClaveForm` | Emanuel |
| `admin/` | `StatCard`, `AccesoRapido`, `ProductForm`, `EditorEncuadre`, `CategoryForm`, `UserForm`, `ArticleForm` | Jim |
| `auth/` | `CuentasDemo` | Jim |
| `common/` | `AlertMessage`, `FormField`, `SelectField`, `ConfirmModal` | Jim |

### 4.4 Estado global (Contexts)

| Context | Expone | Persistencia |
|---|---|---|
| `AuthContext` | `usuario`, `login`, `logout`, `registrar`, `tieneRol`, `refrescarUsuario`, `esStaff` | Id del usuario en `sessionStorage` |
| `CartContext` | `items`, `agregar`, `quitar`, `cambiarCantidad`, `vaciar`, `total`, `cantidadItems` | `localStorage` (clave `pixelvault_carrito`); al cargar se actualizan precio y stock desde `db.js` |

### 4.5 Modelo de datos (`db.js`)

`db.js` ofrece `getAll`, `getById`, `create` (asigna el id), `update`, `remove` y `registrarMovimiento` sobre siete colecciones guardadas en `localStorage` con el prefijo `pixelvault_`. Cada cambio queda registrado automáticamente en `movimientos`.

| Colección | Campos |
|---|---|
| `productos` | `id`, `codigo` (`PS5-015`), `nombre`, `categoriaId`, `plataforma`, `precio`, `precioOferta` (número o `null`), `stock`, `stockCritico`, `descripcion`, `imagen` (URL o imagen comprimida), `encuadre {x, y, zoom}`, `activo`, `destacado` |
| `categorias` | `id`, `nombre`, `imagen` |
| `usuarios` | `id`, `usuario`, `rut`, `nombre`, `apellidos`, `correo`, `clave`, `rol`, `region`, `comuna`, `direccion`, `activo` |
| `ordenes` | `id`, `numero` (`PV-000001`), `fecha` (ISO), `usuarioId`, `cliente {nombre, apellidos, correo}`, `direccion {calle, depto, region, comuna, indicaciones}`, `tipoEntrega` (`retiro` / `despacho`), `items [{productoId, nombre, precio, cantidad, imagen}]`, `subtotal`, `despacho`, `total`, `estado`, `repartidorId`, `fotoEntrega`, `comentarioEntrega`, `historialEstados [{estado, fecha, usuario}]` |
| `blog` | `id`, `slug`, `categoria`, `nombreCategoria`, `titulo`, `autor`, `fecha`, `tiempoLectura`, `imagen`, `resumen`, `cuerpo` (HTML) |
| `contactos` | `id`, `ticket` (`PVT-000001`), `nombre`, `correo`, `mensaje`, `fecha` |
| `movimientos` | `id`, `fecha`, `usuarioId`, `usuarioNombre`, `rol`, `categoria`, `accion`, `detalle` |

**Relaciones:**
- `producto.categoriaId → categoria.id`
- `orden.usuarioId → usuario.id`
- `orden.repartidorId → usuario.id`
- `orden.items[].productoId → producto.id`
- `movimiento.usuarioId → usuario.id`

**Datos semilla:**
- 15 productos (4 en oferta y 2 en stock crítico) y 6 categorías con imagen propia.
- 7 usuarios: uno por rol, más los integrantes.
- 6 artículos del blog.
- 4 órdenes de ejemplo en distintos estados.

`regiones.js` contiene las 16 regiones de Chile con sus comunas.

### 4.6 Reglas de negocio
- **RN-01** El carrito cobra `precioOferta` cuando existe y es menor que `precio`.
- **RN-02** No se puede agregar ni pedir más unidades que el stock disponible.
- **RN-03** El despacho a domicilio cuesta $4.000; el retiro en tienda es gratis.
- **RN-04** Una orden nueva queda "En preparación" con el código `PV` siguiente al mayor existente. Flujo:
  - Despacho: En preparación → Asignado a repartidor → En camino → Entregada.
  - Retiro: En preparación → Lista para retiro → Entregada.
  - Solo el Administrador cancela, y solo antes de salir a ruta. Cada cambio queda en `historialEstados`.
- **RN-05** Solo un pago aprobado descuenta stock y vacía el carrito.
- **RN-06** Un producto está en stock crítico cuando `stock <= stockCritico`.
- **RN-07** No se elimina una categoría con productos asociados.
- **RN-08** Para pagar se necesita una cuenta: sin sesión, el checkout la crea con rol Cliente.
- **RN-09** Una entrega a domicilio solo se marca "Entregada" con foto del paquete.
- **RN-10** El código de producto se genera por plataforma y no se repite.

---

## 5. Verificación y pruebas

**Las pruebas unitarias con Jasmine y Karma quedaron fuera de alcance por decisión del docente**, y con ellas el documento de cobertura de pruebas.

En su lugar, cada historia se verifica **a mano** contra sus criterios de aceptación antes de pasar a "Hecho" en Trello (Definition of Done, `docs/plan.md` §4):
- Criterios de aceptación probados en el navegador.
- Sin errores nuevos en la consola.
- Revisión en 375, 768 y 1280 px.
- `npm run build` sin errores antes de cada `push` a `main`.

### 5.1 Casos de prueba manuales

| ID | Caso | Pasos | Resultado esperado | Resultado |
|---|---|---|---|---|
| CP-01 | Búsqueda desde la barra | Escribir "zelda" en el buscador y presionar Enter | `/productos?q=zelda` muestra solo los juegos que coinciden | OK |
| CP-02 | Filtro de ofertas | Abrir Productos → Ofertas | Solo productos con oferta, precio tachado y % de descuento | OK |
| CP-03 | Límite de stock | Agregar al carrito más unidades que el stock | El botón + se bloquea y aparece un aviso | OK |
| CP-04 | Validación del checkout | Pagar con campos vacíos | Errores bajo cada campo y foco en el primero | OK |
| CP-05 | Compra sin sesión | Completar el checkout con RUT y contraseña nuevos y pagar | Se crea la cuenta Cliente, queda la sesión iniciada y la orden `PV` queda asociada | OK |
| CP-06 | Correo o RUT repetido | Checkout sin sesión con un RUT ya registrado | "Este RUT ya está registrado"; no se crea nada | OK |
| CP-07 | Pago rechazado | Marcar "Simular pago rechazado" y pagar | Vista de error; el carrito y el stock no cambian; "Volver a realizar el pago" recupera el formulario | OK |
| CP-08 | Boleta | Pagar con despacho | Boleta con código `PV`, dirección, despacho $4.000 y total; imprimir oculta la barra | OK |
| CP-09 | Permisos por rol | Entrar como `adriana` (Editor) a `/admin/productos` | Muestra "Acceso denegado"; el menú solo muestra Dashboard, Blog y Perfil | OK |
| CP-10 | Flujo de despacho | Operador asigna a `ilie`; Repartidor inicia la ruta y entrega con foto | Estados En preparación → Asignado → En camino → Entregada, con el historial | OK |
| CP-11 | Comprobante para el cliente | `francisco` abre Detalles de PV-000001 en Mis compras | Ve la foto y el comentario de la entrega | OK |
| CP-12 | CRUD de productos | Crear un producto con imagen desde archivo y ajustar el encuadre | Código automático por plataforma; la tarjeta de la tienda muestra el encuadre elegido | OK |
| CP-13 | Stock crítico | Abrir Productos → Stock crítico | Aparecen los ids 3 (en el límite) y 6 (agotado) | OK |
| CP-14 | Historial | Editar un producto y abrir Historial | El movimiento aparece con usuario, rol y detalle | OK |
| CP-15 | Perfil | Cambiar el nombre desde el botón del usuario | La barra muestra el nombre nuevo; la contraseña exige la actual | OK |
| CP-16 | Responsivo | Revisar Home, Catálogo, Checkout y Panel Staff en 375, 768 y 1280 px | Sin scroll horizontal; menú hamburguesa en móvil | OK |

---

## 6. Trazabilidad (enunciado → requisitos)

| Necesidad del enunciado | Requisitos |
|---|---|
| Migrar HTML a React con componentes reutilizables | TEC-01, TEC-03, TEC-06, HU-31 a HU-43 |
| Props y estado bien gestionados | TEC-04, TEC-05, HU-32, HU-36, HU-37, HU-40, HU-46 |
| Archivo JS de datos con CRUD | TEC-02, HU-46, HU-48, HU-49, HU-53 |
| Persistencia conectada a la interfaz | TEC-02, TEC-05, HU-34, HU-46, HU-55 |
| Responsivo con Bootstrap | TEC-03, HU-31, MEJ-01, RNF-01 |
| Vistas de categorías y ofertas | HU-34, HU-35, HU-48 |
| Checkout con dirección | HU-37, HU-57 |
| Pago correcto y pago con error | HU-38, HU-39 |
| Detalle de producto y de blog | HU-33, HU-41 |
| Admin: dashboard, órdenes y boletas | HU-44, HU-45, HU-56 |
| Admin: productos, stock crítico y reportes | HU-46, HU-47, HU-51 |
| Admin: categorías, usuarios e historial de compras | HU-48, HU-49, HU-50 |
| Admin: perfil | HU-52, HU-58 |
| Continuidad con el ERS V1 | Sección 3.1, HU-53 a HU-56 |
| ERS V2 | TEC-07 |
| GitHub público y proyecto comprimido | TEC-01, TEC-08 |
| Presentación y defensa | TEC-09 |
| Pruebas Jasmine/Karma y documento de cobertura | **Fuera de alcance** (decisión docente); verificación manual en la sección 5.1 |

---

## Anexo A — Aportes por integrante

| Integrante | Área | Resumen |
|---|---|---|
| Jim Charles | Base del proyecto, sesión, Panel Staff y armado final | Esqueleto React + Vite, `db.js` con CRUD e historial, datos semilla y rutas protegidas. Login con cuentas demo y registro. Dashboard, CRUD de productos (código automático, imagen por URL o archivo con encuadre), stock crítico, reportes, categorías, usuarios y blog. Permisos por rol, panel del repartidor, flujo de órdenes `PV` e integración final CF-01 a CF-20 |
| Emanuel Reyes | Flujo de compra, órdenes y ERS | Carrito global con validación de stock y ofertas; checkout con región → comuna y autocompletado con la sesión; pago simulado con creación de la orden, boleta imprimible y pago rechazado con reintento; administración de órdenes, historial por usuario, mis compras y perfil |
| Maximiliano Peral | Tienda pública, UI y responsivo | Barra de navegación con buscador, desplegable "Productos" y menú móvil; footer. Home con carrusel de destacados, catálogo con filtros, detalle con relacionados, categorías y ofertas. Blog, Nosotros, Contacto con ticket y 404; estilos Steam + 16-bit y revisión responsiva |

## Anexo B — Cuentas de demostración

| Usuario | Contraseña | Rol |
|---|---|---|
| Jim / Emanuel / Maximiliano | `admin` | Administrador |
| fernando | `operador` | Operador |
| adriana | `editor` | Editor |
| ilie | `repartidor` | Repartidor |
| francisco | `cliente` | Cliente (con órdenes de ejemplo) |
