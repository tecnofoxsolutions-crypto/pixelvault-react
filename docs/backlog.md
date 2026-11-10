# Backlog — PixelVault React (Evaluación Parcial 2)

Los IDs de historias siguen la numeración de la Evaluación 1 (que llegó a HU-30), para que el ERS V2 quede trazable.
Las pruebas con Jasmine y Karma fueron descartadas por el docente: cada elemento se valida con **verificación manual** hecha por un integrante distinto al que lo desarrolló.

**Estimación:** S = 1 punto (≈ medio día), M = 2 puntos (≈ 1 día), L = 3 puntos (≈ 1,5 días).
**Responsables:** Jim (J), Emanuel (E), Maximiliano (M).

## Resumen

| ID | Título | Tipo | Prioridad | Est. | Resp. | Sprint |
|---|---|---|---|---|---|---|
| TEC-01 | Crear proyecto React y repositorio | TEC | Must | S | J | 0 |
| TEC-02 | Crear base de datos simulada con CRUD | TEC | Must | M | J | 0 |
| TEC-03 | Crear layouts, navegación y rutas | TEC | Must | M | M | 0 |
| TEC-04 | Implementar sesión y rutas protegidas | TEC | Must | M | J | 0 |
| TEC-05 | Implementar estado global del carrito | TEC | Must | M | E | 0 |
| TEC-06 | Migrar estilos y crear componentes comunes | TEC | Must | S | M | 0 |
| HU-31 | Ver la página de inicio | HU | Must | M | M | 1 |
| HU-32 | Explorar y filtrar productos | HU | Must | M | M | 1 |
| HU-33 | Ver el detalle de un producto | HU | Must | S | M | 1 |
| HU-34 | Navegar productos por categoría | HU | Must | M | M | 1 |
| HU-35 | Ver productos en oferta | HU | Must | S | M | 1 |
| HU-36 | Gestionar el carrito de compras | HU | Must | M | E | 1 |
| HU-37 | Completar el checkout con dirección de entrega | HU | Must | L | E | 1 |
| HU-38 | Ver la compra exitosa con su boleta | HU | Must | M | E | 1 |
| HU-39 | Ver el pago rechazado y reintentar | HU | Must | S | E | 1 |
| HU-40 | Iniciar sesión y registrarse | HU | Must | M | J | 1 |
| HU-41 | Leer el blog y el detalle de cada artículo | HU | Should | S | M | 1 |
| HU-42 | Ver Nosotros y enviar un contacto | HU | Should | S | M | 1 |
| HU-43 | Consultar mis compras | HU | Should | S | E | 1 |
| HU-44 | Ver el dashboard de administración | HU | Must | M | J | 2 |
| HU-45 | Gestionar órdenes y ver boletas | HU | Must | M | E | 2 |
| HU-46 | Administrar productos | HU | Must | L | J | 2 |
| HU-47 | Listar productos con stock crítico | HU | Must | S | J | 2 |
| HU-48 | Administrar categorías | HU | Must | S | M | 2 |
| HU-49 | Administrar usuarios | HU | Must | M | M | 2 |
| HU-50 | Ver el historial de compras de un usuario | HU | Should | S | E | 2 |
| HU-51 | Ver reportes de ventas e inventario | HU | Should | M | J | 2 |
| HU-52 | Editar mi perfil | HU | Could | S | E | 2 |
| MEJ-01 | Revisar diseño responsivo en todas las vistas | MEJ | Must | M | M | 3 |
| TEC-07 | Actualizar el ERS a la versión 2 | TEC | Must | M | E | 3 |
| TEC-08 | Preparar el repositorio y el paquete de entrega | TEC | Must | S | J | 3 |
| TEC-09 | Preparar la presentación y la defensa individual | TEC | Must | M | Todos | 3 |

**Carga por persona:** Jim 16 pts · Emanuel 17 pts · Maximiliano 18 pts (+ TEC-09 compartida).

---

## Tareas técnicas (Sprint 0 — base)

### TEC-01 · Crear proyecto React y repositorio
Tipo: TEC | Prioridad: Must | Estimación: S | Responsable: Jim
Contexto: todas las demás tarjetas dependen de que exista el proyecto y el repo.
Criterios de aceptación:
  CA1 Dado el repo clonado Cuando se ejecuta `npm install` y `npm run dev` Entonces la app abre en `http://localhost:5173` sin errores en consola.
  CA2 Dado `package.json` Entonces incluye `react`, `react-dom`, `react-router-dom` y `bootstrap` con versión fija.
  CA3 Dado GitHub Entonces el repo es **público**, tiene rama `main` y los 3 integrantes son colaboradores.
  CA4 Dado el README Entonces explica cómo instalar, ejecutar y las credenciales de prueba.
  CA5 Dado `main` Cuando alguien intenta un push directo Entonces se le pide usar Pull Request (regla de rama activa).
Impacto técnico: estructura de carpetas de `docs/ficha-tecnica.md`, `.gitignore` con `node_modules`.
Dependencias: ninguna.
Verificación manual: Emanuel y Maximiliano clonan y levantan el proyecto en su equipo.

### TEC-02 · Crear base de datos simulada con CRUD
Tipo: TEC | Prioridad: Must | Estimación: M | Responsable: Jim
Contexto: el enunciado exige un archivo JS que actúe como base de datos con funciones CRUD conectadas a los componentes.
Criterios de aceptación:
  CA1 Dado `src/data/seed.js` Entonces contiene los productos, usuarios, pedidos y artículos de blog de la Eval 1, más una colección `categorias` y el campo `precioOferta` (o `null`) en cada producto.
  CA2 Dado `src/data/db.js` Entonces expone `getAll`, `getById`, `create`, `update` y `remove` para cada colección.
  CA3 Dado un `localStorage` vacío Cuando la app arranca Entonces se cargan los datos semilla una sola vez.
  CA4 Dado un producto creado con `create` Cuando se recarga la página Entonces el producto sigue existiendo.
  CA5 Dado `getById` con un id inexistente Entonces devuelve `null` sin lanzar error.
  CA6 Dado `src/data/regiones.js` Entonces contiene las 16 regiones de Chile con sus comunas.
Impacto técnico: `src/data/seed.js`, `src/data/db.js`, `src/data/regiones.js`.
Dependencias: TEC-01.
Verificación manual: desde la consola del navegador, crear, editar y eliminar un producto y revisar `localStorage`.

### TEC-03 · Crear layouts, navegación y rutas
Tipo: TEC | Prioridad: Must | Estimación: M | Responsable: Maximiliano
Contexto: la Eval 2 pide navegación entre vistas con React; hoy cada página repite su barra de navegación.
Criterios de aceptación:
  CA1 Dado `AppRouter.jsx` Entonces define todas las rutas del plan (tienda y `/admin/*`), aunque algunas muestren un componente temporal.
  CA2 Dado cualquier ruta de la tienda Entonces se ve `Navbar` (logo, buscador, Home, Categorías, Ofertas, Nosotros, Blog, Contacto, botón Carrito con total) y `Footer`.
  CA3 Dado cualquier ruta `/admin/*` Entonces se ve `AdminSidebar` en lugar de la barra de la tienda.
  CA4 Dado un ancho menor a 992 px Entonces la barra se colapsa en un menú hamburguesa.
  CA5 Dada una ruta inexistente Entonces se muestra la página `NotFound` con un enlace al inicio.
  CA6 Dado un clic en un enlace del menú Entonces cambia la vista sin recargar la página (`<Link>`/`<NavLink>`).
Impacto técnico: `components/layout/*`, `routes/AppRouter.jsx`, `App.jsx`.
Dependencias: TEC-01.
Verificación manual: recorrer todas las rutas en escritorio y en vista móvil.

### TEC-04 · Implementar sesión y rutas protegidas
Tipo: TEC | Prioridad: Must | Estimación: M | Responsable: Jim
Criterios de aceptación:
  CA1 Dado `AuthContext` Entonces expone `usuario`, `login(usuario, clave)`, `logout()` y `tieneRol(rol)`.
  CA2 Dado un usuario sin sesión Cuando entra a `/admin` Entonces es redirigido a `/login`.
  CA3 Dado un usuario con rol Cliente Cuando entra a `/admin` Entonces ve un mensaje de acceso denegado y un enlace a la tienda.
  CA4 Dado un administrador con sesión Cuando recarga la página Entonces la sesión se mantiene (`sessionStorage`).
  CA5 Dada una sesión iniciada Entonces la barra muestra el nombre del usuario y "Cerrar sesión" en lugar de "Iniciar sesión / Crear cuenta".
Impacto técnico: `context/AuthContext.jsx`, `routes/ProtectedRoute.jsx`, `Navbar`.
Dependencias: TEC-02, TEC-03.
Verificación manual: probar los 5 roles de demo heredados de la Eval 1.

### TEC-05 · Implementar estado global del carrito
Tipo: TEC | Prioridad: Must | Estimación: M | Responsable: Emanuel
Criterios de aceptación:
  CA1 Dado `CartContext` Entonces expone `items`, `agregar(producto)`, `quitar(id)`, `cambiarCantidad(id, n)`, `vaciar()`, `total` y `cantidadItems`.
  CA2 Dado un producto agregado dos veces Entonces aparece una sola línea con cantidad 2.
  CA3 Dado un producto con `precioOferta` Entonces el carrito usa el precio de oferta.
  CA4 Dada una cantidad mayor al stock disponible Entonces no se permite y se informa el máximo.
  CA5 Dado un cambio en el carrito Entonces el botón "Carrito $X" de la barra se actualiza al instante y el carrito persiste al recargar.
Impacto técnico: `context/CartContext.jsx`, `Navbar`.
Dependencias: TEC-02.
Verificación manual: agregar, cambiar cantidades y recargar.

### TEC-06 · Migrar estilos y crear componentes comunes
Tipo: TEC | Prioridad: Must | Estimación: S | Responsable: Maximiliano
Criterios de aceptación:
  CA1 Dado `styles/estilos.css` Entonces conserva el tema Steam + 16-bit de la Eval 1 y se importa una sola vez en `main.jsx`.
  CA2 Dados los componentes `AlertMessage`, `FormField`, `ConfirmModal` y `EmptyState` Entonces reciben todo por props (texto, tipo, función `onClick`/`onConfirm`) y no tienen datos fijos.
  CA3 Dado `utils/formatoCLP.js` Cuando recibe `34990` Entonces devuelve `$34.990`.
  CA4 Dado `utils/validaciones.js` Entonces valida correo, RUT chileno y campos obligatorios, devolviendo el mensaje de error o `null`.
Impacto técnico: `components/common/*`, `utils/*`, `styles/estilos.css`, `public/img/`.
Dependencias: TEC-01.
Verificación manual: página temporal que muestre cada componente con distintas props.

---

## Historias de usuario — Tienda (Sprint 1)

### HU-31 · Ver la página de inicio
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Maximiliano
Como visitante, quiero ver una portada con novedades y categorías, para descubrir rápido qué ofrece la tienda.
Criterios de aceptación:
  CA1 Dado `/` Entonces se ve un carrusel Bootstrap con al menos 3 juegos destacados (`destacado: true`).
  CA2 Dado `/` Entonces se ve una sección "Categorías" con una tarjeta por categoría que lleva a `/categorias/:id`.
  CA3 Dado `/` Entonces se ve una grilla de destacados hecha con `ProductList` (mismo componente que en Productos).
  CA4 Dado un ancho de 375 px Entonces las tarjetas se ven en 1 columna; en 768 px en 2; en 1280 px en 3 o 4.
Impacto técnico: `pages/tienda/Home.jsx`, reutiliza `ProductList`/`ProductCard`.
Dependencias: TEC-02, TEC-03, HU-32 (`ProductCard`).
Verificación manual: revisar en los 3 anchos.

### HU-32 · Explorar y filtrar productos
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Maximiliano
Como cliente, quiero buscar y filtrar el catálogo, para encontrar el juego que busco.
Criterios de aceptación:
  CA1 Dado `/productos` Entonces se listan todos los productos activos usando `ProductList`, que recibe el arreglo por props y dibuja un `ProductCard` por elemento.
  CA2 Dado un texto en el buscador de la barra Cuando se presiona "Buscar" Entonces navega a `/productos?q=texto` y solo muestra los productos cuyo nombre contiene el texto (sin distinguir mayúsculas).
  CA3 Dados los filtros de plataforma, categoría y rango de precio Cuando cambian Entonces la lista se actualiza sin recargar (estado del componente).
  CA4 Dado un filtro sin resultados Entonces se muestra `EmptyState` con el texto "No encontramos juegos con esos filtros" y un botón para limpiarlos.
  CA5 Dado un producto con stock 0 Entonces su botón "Añadir" está deshabilitado y dice "Agotado".
Impacto técnico: `pages/tienda/Productos.jsx`, `components/productos/ProductCard.jsx`, `ProductList.jsx`, `ProductFilters.jsx`.
Dependencias: TEC-02, TEC-03, TEC-05, TEC-06.
Verificación manual: combinar búsqueda y filtros.

### HU-33 · Ver el detalle de un producto
Tipo: HU | Prioridad: Must | Estimación: S | Responsable: Maximiliano
Como cliente, quiero abrir la ficha de un juego, para ver su descripción, precio y stock antes de comprar.
Criterios de aceptación:
  CA1 Dado un clic en "Ver detalle" Entonces navega a `/productos/:id` (ya no es una ventana emergente).
  CA2 Dada la ficha Entonces muestra imagen, nombre, plataforma, categoría, descripción, precio (con precio original tachado si está en oferta) y stock.
  CA3 Dado un selector de cantidad Cuando se presiona "Añadir al carrito" Entonces se agrega esa cantidad y se muestra un aviso de confirmación.
  CA4 Dado un id inexistente en la URL Entonces muestra "Producto no encontrado" y un enlace a `/productos`.
  CA5 Dada la ficha Entonces muestra hasta 4 productos relacionados de la misma categoría.
Impacto técnico: `pages/tienda/ProductoDetalle.jsx`, `useParams`.
Dependencias: HU-32.

### HU-34 · Navegar productos por categoría
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Maximiliano
Como cliente, quiero ver los productos agrupados por categoría, para explorar por género.
Criterios de aceptación:
  CA1 Dado `/categorias` Entonces se ve una fila de tarjetas, una por cada categoría de `db.js`, con imagen y nombre.
  CA2 Dado un clic en una categoría Entonces navega a `/categorias/:id` y se muestra el título de la categoría con sus productos.
  CA3 Dado el menú "Categorías" de la barra Entonces es un desplegable con todas las categorías.
  CA4 Dada una categoría sin productos Entonces se muestra "Aún no hay juegos en esta categoría".
  CA5 Dada una categoría creada desde el admin (HU-48) Entonces aparece aquí sin tocar el código.
Impacto técnico: `pages/tienda/Categorias.jsx`, `Navbar` (dropdown).
Dependencias: HU-32, TEC-02.

### HU-35 · Ver productos en oferta
Tipo: HU | Prioridad: Must | Estimación: S | Responsable: Maximiliano
Como cliente, quiero ver todas las ofertas en un solo lugar, para aprovechar descuentos.
Criterios de aceptación:
  CA1 Dado `/ofertas` Entonces solo se listan productos con `precioOferta` menor que `precio`.
  CA2 Dado un producto en oferta Entonces su tarjeta muestra el precio original tachado, el precio de oferta y una insignia con el % de descuento.
  CA3 Dado que no hay ofertas Entonces se muestra `EmptyState` "No hay ofertas activas".
Impacto técnico: `pages/tienda/Ofertas.jsx`, `ProductCard` (prop `mostrarDescuento`), `components/productos/PriceTag.jsx`.
Dependencias: HU-32, TEC-02.

### HU-36 · Gestionar el carrito de compras
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Emanuel
Como cliente, quiero revisar y modificar mi carrito, para decidir qué compro.
Criterios de aceptación:
  CA1 Dado `/carrito` Entonces se ve una tabla con imagen, nombre, precio, cantidad (botones − y +), subtotal y botón "Eliminar" por línea (`CartItemRow`).
  CA2 Dado un clic en + o − Entonces cambian la cantidad, el subtotal y el total al instante.
  CA3 Dado un clic en "Limpiar" Entonces se pide confirmación (`ConfirmModal`) y luego se vacía el carrito.
  CA4 Dado un carrito vacío Entonces se muestra "Tu carrito está vacío" con un botón a `/productos`, y "Comprar ahora" está deshabilitado.
  CA5 Dado un clic en "Comprar ahora" Entonces navega a `/checkout`.
Impacto técnico: `pages/tienda/Carrito.jsx`, `components/carrito/*`.
Dependencias: TEC-05, TEC-06.

### HU-37 · Completar el checkout con dirección de entrega
Tipo: HU | Prioridad: Must | Estimación: L | Responsable: Emanuel
Como cliente, quiero ingresar mis datos y dirección, para recibir mi compra.
Contexto: en la Eval 1 el carrito no pedía dirección; la Eval 2 lo exige.
Criterios de aceptación:
  CA1 Dado `/checkout` Entonces se ve el resumen de productos (`OrderSummaryTable`) y el total a pagar destacado.
  CA2 Dado el formulario Entonces pide nombre*, apellidos*, correo*, calle*, departamento (opcional), región*, comuna*, indicaciones (opcional) y tipo de entrega (retiro gratis o despacho RM $4.000).
  CA3 Dado un cambio de región Entonces el selector de comunas muestra solo las comunas de esa región.
  CA4 Dado un usuario con sesión iniciada Entonces nombre, apellidos, correo y dirección se completan solos con sus datos.
  CA5 Dado un campo obligatorio vacío o un correo inválido Cuando se presiona "Pagar ahora" Entonces no avanza y el campo muestra el error en rojo bajo el input.
  CA6 Dado un carrito vacío Cuando se entra a `/checkout` Entonces redirige a `/carrito`.
  CA7 Dado el tipo de entrega "Despacho" Entonces el total suma $4.000; con "Retiro" no.
Impacto técnico: `pages/tienda/Checkout.jsx`, `components/compra/CustomerForm.jsx`, `AddressForm.jsx`, `data/regiones.js`, `utils/validaciones.js`.
Dependencias: HU-36, TEC-04.

### HU-38 · Ver la compra exitosa con su boleta
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Emanuel
Como cliente, quiero ver la confirmación y la boleta, para tener respaldo de mi compra.
Criterios de aceptación:
  CA1 Dado un formulario válido Cuando se presiona "Pagar ahora" y el pago se aprueba Entonces se crea una orden en `db.js` con número correlativo, se descuenta el stock, se vacía el carrito y se navega a `/compra/exito/:numero`.
  CA2 Dada la vista de éxito Entonces muestra "Se ha realizado la compra nro #…", código de orden, datos del cliente, dirección, productos y "Total pagado".
  CA3 Dado un clic en "Imprimir boleta" Entonces se abre el diálogo de impresión del navegador (`window.print()`) con una vista sin barra de navegación.
  CA4 Dado un número de orden inexistente en la URL Entonces muestra "Orden no encontrada".
Impacto técnico: `pages/tienda/PagoExitoso.jsx`, `db.js` (colección `ordenes`), reutiliza `OrderSummaryTable`.
Dependencias: HU-37.

### HU-39 · Ver el pago rechazado y reintentar
Tipo: HU | Prioridad: Must | Estimación: S | Responsable: Emanuel
Como cliente, quiero saber si mi pago falló, para volver a intentarlo sin perder mis datos.
Contexto: el pago es simulado. Se rechaza si al pagar ya no hay stock suficiente, o si se marca la casilla de demostración "Simular pago rechazado".
Criterios de aceptación:
  CA1 Dado un pago rechazado Entonces navega a `/compra/error` con "No se pudo realizar el pago", el detalle de la compra y el motivo.
  CA2 Dado un pago rechazado Entonces el carrito **no** se vacía y el stock **no** se descuenta.
  CA3 Dado un clic en "Volver a realizar el pago" Entonces vuelve a `/checkout` con el formulario ya lleno.
Impacto técnico: `pages/tienda/PagoError.jsx`, estado del checkout guardado temporalmente.
Dependencias: HU-37.

### HU-40 · Iniciar sesión y registrarse
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Jim
Como visitante, quiero crear una cuenta e iniciar sesión, para comprar más rápido y ver mis pedidos.
Criterios de aceptación:
  CA1 Dado `/login` con credenciales válidas Entonces inicia sesión; un administrador va a `/admin` y un cliente a `/`.
  CA2 Dadas credenciales inválidas Entonces se muestra "Usuario o contraseña incorrectos" y no se inicia sesión.
  CA3 Dado `/registro` Entonces pide nombre, apellidos, RUT, correo, contraseña, confirmación, región, comuna y dirección, todo controlado con `useState`.
  CA4 Dado un RUT o correo inválido, o contraseñas distintas Entonces se muestra el error bajo el campo mientras el usuario escribe.
  CA5 Dado un correo ya registrado Entonces se muestra "Este correo ya tiene una cuenta".
  CA6 Dado un registro válido Entonces se crea el usuario con rol Cliente, se inicia sesión y se navega a `/`.
  CA7 Dado `/login` Entonces se mantiene el panel de cuentas de demostración de la Eval 1.
Impacto técnico: `pages/tienda/Login.jsx`, `Registro.jsx`, `AuthContext`, `utils/validaciones.js`.
Dependencias: TEC-04, TEC-06.

### HU-41 · Leer el blog y el detalle de cada artículo
Tipo: HU | Prioridad: Should | Estimación: S | Responsable: Maximiliano
Como visitante, quiero leer los artículos del blog, para informarme sobre videojuegos.
Criterios de aceptación:
  CA1 Dado `/blog` Entonces se lista cada artículo con imagen, título, autor, fecha y resumen.
  CA2 Dado un clic en "Leer más" Entonces navega a `/blog/:id` con el artículo completo (ya no es ventana emergente).
  CA3 Dado un id inexistente Entonces muestra "Artículo no encontrado".
Impacto técnico: `pages/tienda/Blog.jsx`, `BlogDetalle.jsx`.
Dependencias: TEC-02, TEC-03.

### HU-42 · Ver Nosotros y enviar un contacto
Tipo: HU | Prioridad: Should | Estimación: S | Responsable: Maximiliano
Como visitante, quiero conocer al equipo y escribirles, para resolver dudas.
Criterios de aceptación:
  CA1 Dado `/nosotros` Entonces se ve misión, visión y una tarjeta por integrante generada desde un arreglo (no HTML repetido).
  CA2 Dado `/contacto` con nombre, correo y mensaje válidos Cuando se envía Entonces se guarda en `db.js` y se muestra el ticket `PVT-000001` correlativo.
  CA3 Dado un mensaje de más de 500 caracteres o un correo inválido Entonces no se envía y se muestra el error.
Impacto técnico: `pages/tienda/Nosotros.jsx`, `Contacto.jsx`.
Dependencias: TEC-02, TEC-06.

### HU-43 · Consultar mis compras
Tipo: HU | Prioridad: Should | Estimación: S | Responsable: Emanuel
Como cliente con sesión, quiero ver mis compras anteriores, para seguir mis pedidos.
Criterios de aceptación:
  CA1 Dado `/mis-compras` con sesión de cliente Entonces lista solo sus órdenes con número, fecha, total y estado.
  CA2 Dado un clic en una orden Entonces muestra su boleta (reutiliza la vista de HU-38).
  CA3 Dado un usuario sin sesión Entonces redirige a `/login`.
Impacto técnico: `pages/tienda/MisCompras.jsx`.
Dependencias: HU-38, TEC-04.

---

## Historias de usuario — Administración (Sprint 2)

### HU-44 · Ver el dashboard de administración
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Jim
Como administrador, quiero un resumen del negocio al entrar, para saber cómo va la tienda.
Criterios de aceptación:
  CA1 Dado `/admin` Entonces se ven 3 `StatCard` (Compras, Productos, Usuarios) calculadas desde `db.js`, no escritas a mano.
  CA2 Dado `/admin` Entonces se ven accesos rápidos a Órdenes, Productos, Categorías, Usuarios, Reportes, Perfil y Tienda.
  CA3 Dado que hay productos en stock crítico Entonces aparece una alerta con la cantidad y un enlace a HU-47.
  CA4 Dado `AdminSidebar` Entonces resalta la sección actual y tiene "Cerrar sesión".
Impacto técnico: `pages/admin/Dashboard.jsx`, `components/admin/StatCard.jsx`.
Dependencias: TEC-03, TEC-04.

### HU-45 · Gestionar órdenes y ver boletas
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Emanuel
Como administrador, quiero ver todas las órdenes y sus boletas, para hacer seguimiento de las ventas.
Criterios de aceptación:
  CA1 Dado `/admin/ordenes` Entonces una tabla (`DataTable`) muestra número, fecha, cliente, total y estado de cada orden.
  CA2 Dado un filtro por estado o búsqueda por cliente Entonces la tabla se actualiza al instante.
  CA3 Dado un clic en "Ver boleta" Entonces navega a `/admin/ordenes/:numero` con el detalle completo (reutiliza `OrderSummaryTable`).
  CA4 Dado el detalle Cuando se cambia el estado (En preparación, Enviado, Entregado, Cancelado) Entonces se guarda en `db.js`.
Impacto técnico: `pages/admin/Ordenes.jsx`, `BoletaDetalle.jsx`, `components/admin/DataTable.jsx`.
Dependencias: HU-38, HU-44.

### HU-46 · Administrar productos
Tipo: HU | Prioridad: Must | Estimación: L | Responsable: Jim
Como administrador, quiero crear, ver, editar y eliminar productos, para mantener el catálogo al día.
Criterios de aceptación:
  CA1 Dado `/admin/productos` Entonces se listan los productos con código, nombre, categoría, precio, precio oferta, stock y acciones.
  CA2 Dado `/admin/productos/nuevo` Entonces el formulario (`ProductForm`) pide código, nombre, descripción, precio, precio oferta, stock, stock crítico, categoría (selector desde `db.js`), plataforma e imagen.
  CA3 Dado un precio ≤ 0, stock negativo, nombre vacío o precio oferta ≥ precio Entonces no se guarda y se muestra el error en el campo.
  CA4 Dado `/admin/productos/:id/editar` Entonces el mismo `ProductForm` aparece precargado (recibe el producto por props).
  CA5 Dado un clic en "Eliminar" Entonces pide confirmación y luego el producto desaparece de la lista y de la tienda.
  CA6 Dado un producto creado o editado Entonces el cambio se ve en `/productos` sin recargar.
Impacto técnico: `pages/admin/ProductosAdmin.jsx`, `ProductoForm.jsx`, `components/admin/ProductForm.jsx`.
Dependencias: HU-44, TEC-02.

### HU-47 · Listar productos con stock crítico
Tipo: HU | Prioridad: Must | Estimación: S | Responsable: Jim
Como administrador, quiero ver qué productos están por agotarse, para reponerlos a tiempo.
Criterios de aceptación:
  CA1 Dado `/admin/productos/criticos` Entonces solo se listan productos con `stock <= stockCritico`.
  CA2 Dado un producto con stock 0 Entonces su fila se marca en rojo; si está en el límite, en amarillo.
  CA3 Dado un clic en "Editar" Entonces lleva al formulario de HU-46.
Impacto técnico: `pages/admin/StockCritico.jsx`, reutiliza `DataTable`.
Dependencias: HU-46.

### HU-48 · Administrar categorías
Tipo: HU | Prioridad: Must | Estimación: S | Responsable: Maximiliano
Como administrador, quiero crear y editar categorías, para organizar el catálogo.
Criterios de aceptación:
  CA1 Dado `/admin/categorias` Entonces se listan las categorías con la cantidad de productos de cada una.
  CA2 Dado el formulario Cuando se crea o edita una categoría con nombre válido Entonces se guarda y aparece en la tienda (HU-34).
  CA3 Dado un nombre vacío o repetido Entonces no se guarda y se muestra el error.
  CA4 Dada una categoría con productos asociados Cuando se intenta eliminar Entonces se impide y se explica el motivo.
Impacto técnico: `pages/admin/Categorias.jsx`, `components/admin/CategoryForm.jsx`.
Dependencias: HU-44, TEC-02.

### HU-49 · Administrar usuarios
Tipo: HU | Prioridad: Must | Estimación: M | Responsable: Maximiliano
Como administrador, quiero crear, ver y editar usuarios, para gestionar el acceso al sistema.
Criterios de aceptación:
  CA1 Dado `/admin/usuarios` Entonces se listan con RUT, nombre, correo, rol y estado, con búsqueda por nombre o correo.
  CA2 Dado `/admin/usuarios/nuevo` y `/admin/usuarios/:id/editar` Entonces un mismo `UserForm` sirve para crear y editar.
  CA3 Dado un RUT o correo inválido o repetido Entonces no se guarda y se muestra el error.
  CA4 Dado el administrador en sesión Cuando intenta desactivarse o quitarse el rol a sí mismo Entonces se impide.
  CA5 Dado `/admin/usuarios/:id` Entonces se ve el detalle con botones "Editar" e "Historial de compras".
Impacto técnico: `pages/admin/Usuarios.jsx`, `UsuarioForm.jsx`, `components/admin/UserForm.jsx`.
Dependencias: HU-44, HU-40 (validaciones compartidas).

### HU-50 · Ver el historial de compras de un usuario
Tipo: HU | Prioridad: Should | Estimación: S | Responsable: Emanuel
Como administrador, quiero ver las compras de un cliente, para atender sus consultas.
Criterios de aceptación:
  CA1 Dado `/admin/usuarios/:id/compras` Entonces se listan las órdenes de ese usuario con total acumulado.
  CA2 Dado un usuario sin compras Entonces se muestra "Este usuario aún no tiene compras".
  CA3 Dado un clic en una orden Entonces lleva a su boleta (HU-45).
Impacto técnico: `pages/admin/HistorialUsuario.jsx`.
Dependencias: HU-45, HU-49.

### HU-51 · Ver reportes de ventas e inventario
Tipo: HU | Prioridad: Should | Estimación: M | Responsable: Jim
Como administrador, quiero ver reportes, para tomar decisiones de compra y precios.
Criterios de aceptación:
  CA1 Dado `/admin/reportes` Entonces se ven: total vendido, cantidad de órdenes, ticket promedio y ventas por categoría (barras de progreso Bootstrap).
  CA2 Dado el reporte Entonces se ven los 5 productos más vendidos y el valor total del inventario.
  CA3 Dado un selector de rango (7 días, 30 días, todo) Entonces los números se recalculan.
  CA4 Dado que no hay órdenes en el rango Entonces se muestra "Sin ventas en este período".
Impacto técnico: `pages/admin/Reportes.jsx`, funciones de cálculo en `utils/reportes.js`.
Dependencias: HU-45, HU-46.

### HU-52 · Editar mi perfil
Tipo: HU | Prioridad: Could | Estimación: S | Responsable: Emanuel
Como usuario con sesión, quiero editar mis datos, para mantenerlos al día y que el checkout se complete bien.
Criterios de aceptación:
  CA1 Dado `/admin/perfil` (o `/perfil` para clientes) Entonces se muestran los datos del usuario en sesión.
  CA2 Dado un cambio válido Cuando se guarda Entonces se actualiza en `db.js` y en la barra de navegación.
  CA3 Dado un cambio de contraseña Entonces exige la contraseña actual correcta.
Impacto técnico: `pages/admin/Perfil.jsx`, reutiliza `UserForm` en modo perfil.
Dependencias: HU-49.

---

## Mejoras y cierre (Sprint 3)

### MEJ-01 · Revisar diseño responsivo en todas las vistas
Tipo: MEJ | Prioridad: Must | Estimación: M | Responsable: Maximiliano
Contexto: la rúbrica evalúa el diseño responsivo con Bootstrap en ambos indicadores de React.
Criterios de aceptación:
  CA1 Dada cada ruta Entonces se revisa en 375 px, 768 px y 1280 px sin scroll horizontal ni texto cortado.
  CA2 Dadas las tablas del admin y del carrito Entonces usan `table-responsive` en móvil.
  CA3 Dado `AdminSidebar` en móvil Entonces se convierte en un menú desplegable (offcanvas).
  CA4 Dada la revisión Entonces quedan capturas de las 3 resoluciones de 4 vistas clave para la presentación.
Dependencias: Sprints 1 y 2 terminados.

### TEC-07 · Actualizar el ERS a la versión 2
Tipo: TEC | Prioridad: Must | Estimación: M | Responsable: Emanuel (cada integrante aporta su área)
Criterios de aceptación:
  CA1 Dado el ERS de la Eval 1 Entonces se agregan los requerimientos de HU-31 a HU-52 y se marca el cambio de tecnología a React.
  CA2 Dado el ERS V2 Entonces incluye el mapa de rutas, la estructura de componentes y el modelo de datos de `db.js`.
  CA3 Dado el ERS V2 Entonces indica que las pruebas Jasmine/Karma quedaron fuera de alcance por decisión docente.
  CA4 Dado el documento Entonces se entrega en Word (formato del Anexo 4 de la Eval 1).
Dependencias: Sprint 2 terminado.

### TEC-08 · Preparar el repositorio y el paquete de entrega
Tipo: TEC | Prioridad: Must | Estimación: S | Responsable: Jim
Criterios de aceptación:
  CA1 Dado el repo Entonces es público, `main` contiene la versión final y el README está actualizado con rutas y credenciales.
  CA2 Dado el historial Entonces se ven commits y PRs de los 3 integrantes (lo revisa el docente en la defensa).
  CA3 Dado el .zip Entonces no incluye `node_modules` y funciona con `npm install && npm run dev`.
  CA4 Dados los entregables Entonces se suben a AVA: enlace GitHub, .zip y ERS V2.

### TEC-09 · Preparar la presentación y la defensa individual
Tipo: TEC | Prioridad: Must | Estimación: M | Responsable: Todos
Contexto: la presentación vale 60% y es **individual**; cada integrante debe saber explicar React, props, state y Bootstrap con su propio código.
Criterios de aceptación:
  CA1 Dada la presentación Entonces dura 15 minutos: 5 de arquitectura y estructura, 7 de demo del flujo (compra completa + admin), 3 de componentes y responsivo.
  CA2 Dado cada integrante Entonces muestra al menos un componente suyo con props y otro con state (ver tabla de defensa en `plan.md`).
  CA3 Dado un ensayo completo cronometrado Entonces dura menos de 15 minutos.
  CA4 Dada la guía de preguntas Entonces cada uno responde sin leer: diferencia props/state, qué hace `useEffect`, cómo funciona React Router, cómo persiste `db.js`, qué clases de Bootstrap dan el responsivo.

---

## Trazabilidad (necesidad → elementos)

| Necesidad del enunciado | Elementos |
|---|---|
| Migrar HTML a React con componentes reutilizables | TEC-01, TEC-03, TEC-06, HU-31 a HU-43 |
| Props y estado bien gestionados | TEC-04, TEC-05, HU-32, HU-36, HU-37, HU-40, HU-46 |
| Archivo JS de datos con CRUD | TEC-02, HU-46, HU-48, HU-49 |
| Persistencia conectada a la interfaz | TEC-02, TEC-05, HU-34 CA5, HU-46 CA6 |
| Responsivo con Bootstrap | TEC-03 CA4, HU-31 CA4, MEJ-01 |
| Vista Categorías | HU-34, HU-48 |
| Vista Ofertas | HU-35 |
| Checkout con dirección | HU-37 |
| Pago correcto / pago con error | HU-38, HU-39 |
| Detalle de producto y de blog | HU-33, HU-41 |
| Admin: dashboard | HU-44 |
| Admin: órdenes y boletas | HU-45 |
| Admin: productos, nuevo, editar, críticos, reportes | HU-46, HU-47, HU-51 |
| Admin: categorías | HU-48 |
| Admin: usuarios, editar, historial de compras | HU-49, HU-50 |
| Admin: perfil | HU-52 |
| Formularios avanzados, filtros, navegación mejorada | HU-32, HU-37, HU-40, HU-45 |
| ERS V2 | TEC-07 |
| GitHub público y proyecto comprimido | TEC-01, TEC-08 |
| Presentación 15 min + preguntas | TEC-09 |
| Pruebas Jasmine/Karma y documento de cobertura | **Fuera de alcance** (descartado por el docente) |
