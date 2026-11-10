# Cambios finales antes de la entrega

**Responsable:** Jim · **Fecha:** 2026-11-10

Jim arma la versión final del proyecto e implementa los cambios de este documento, **aunque toquen archivos de Emanuel o Maximiliano**. Aquí está qué cambia, por qué y qué tiene que saber cada uno para explicarlo en la defensa.

---

## ⚠️ Reglas mientras se hacen estos cambios

1. **Emanuel y Maximiliano: no editen código en `src/`.** Solo hagan `git pull`. Si encuentran un error, avísenle a Jim por el grupo en vez de corregirlo, para no generar conflictos de Git.
2. Pueden seguir editando **solo documentación**: el ERS V2 (`docs/ERS_V2.*`) y sus guías de defensa (`docs/guia-defensa-<nombre>.md`).
3. **Después de cada `pull`, limpien los datos del navegador:** consola → `localStorage.clear(); sessionStorage.clear()` → recargar. La forma de las órdenes cambia (ver CF-10) y se sube la versión de datos para que se recarguen solos, pero conviene limpiar igual.
4. **Agentes:** lean este archivo completo antes de responder preguntas sobre el proyecto. **Los 16 cambios ya están en `main` (✅).** Después de hacer pull, limpien los datos del navegador (punto 3).

---

## Resumen

| ID | Cambio | Área (dueño original) | Estado |
|---|---|---|---|
| CF-01 | Home rediseñado como en la Evaluación 1 | Tienda (Maximiliano) | ✅ |
| CF-02 | Desplegable "Productos" en el header con Ofertas y Categorías | Header (Maximiliano) | ✅ |
| CF-03 | Carrito oculto mientras está vacío y "Registrarse" | Header (Maximiliano) | ✅ |
| CF-04 | Categoría visible en las tarjetas y filtro "Solo ofertas" | Catálogo (Maximiliano) | ✅ |
| CF-05 | Categorías y Ofertas reutilizan el catálogo | Catálogo (Maximiliano) | ✅ |
| CF-06 | Nosotros como en la Evaluación 1 | Tienda (Maximiliano) | ✅ |
| CF-07 | Contacto como en la Evaluación 1 | Tienda (Maximiliano) | ✅ |
| CF-08 | Corrección: el checkout no autocompletaba los datos del cliente | Compra (Emanuel) | ✅ |
| CF-09 | Números de orden correlativos `PV-000001` | Órdenes (Emanuel) | ✅ |
| CF-10 | Flujo de estados de la orden con botón "siguiente estado" | Órdenes (Emanuel) | ✅ |
| CF-11 | Panel staff por rol: cada rol ve solo lo suyo | Admin (Jim) | ✅ |
| CF-12 | Panel del repartidor: sus entregas asignadas | Nuevo (Jim) | ✅ |
| CF-13 | Panel del editor: CRUD del blog | Nuevo (Jim) | ✅ |
| CF-14 | Historial de movimientos (solo administradores) | Nuevo (Jim) | ✅ |
| CF-15 | Usuarios divididos en Clientes y Staff | Admin (Jim) | ✅ |
| CF-16 | El staff entra directo al panel al iniciar sesión | Sesión (Jim) | ✅ |
| CF-17 | Tipo de entrega en los listados, botón "Detalles" y comprobante de entrega para el cliente | Órdenes (Emanuel) | ✅ |
| CF-18 | Imagen de producto: archivo o URL (no ambos) y encuadre para la tarjeta de la tienda | Admin (Jim) | ✅ |
| CF-19 | Fondo con patrón gamer e imágenes propias de las categorías | Estilo (Jim) | ✅ |

---

## Decisión importante: Categorías y Ofertas se mantienen como vistas

Se propuso eliminarlas porque el catálogo ya tiene filtros, pero **el Anexo 1 de la Evaluación 2 las exige**:
- En el diagrama de la tienda (Figura 3), "CATEGORÍAS → CATEGORÍA #1" y "OFERTAS" están en verde, que es como se marcan las vistas nuevas de esta entrega.
- El texto dice: "Categorías: vista que separa los productos por categorías" y "Ofertas: vista que muestra todos los productos en ofertas".

**Solución:** las rutas `/categorias`, `/categorias/:id` y `/ofertas` siguen existiendo, pero se llega a ellas desde el desplegable de "Productos" (CF-02) y por dentro **reutilizan el mismo componente del catálogo** con un filtro ya aplicado (CF-05). Se cumple el requisito sin duplicar código.

---

## Tienda

### CF-01 · Home como en la Evaluación 1
**Qué cambia:**
- **Presentación arriba** (como el `index.html` de la Evaluación 1): insignia "Tienda especializada", título "Videojuegos Físicos para Coleccionistas", texto descriptivo y dos botones: **Ver catálogo completo** → `/productos` y **Conoce PixelVault** → `/nosotros`. Este título es el `h1` de la página (antes el Home no tenía `h1`).
- **Carrusel = "Destacados ⭐"**: muestra los productos con `destacado: true`, con **borde amarillo y estrella** (clase `card-destacado-estrella` de `estilos.css`, la misma de la Evaluación 1).
- **Flechas del carrusel visibles** y **fuera de la tarjeta**: antes la flecha izquierda tapaba el botón "Ver juego".
- **Tres características** como en la Evaluación 1: *Ediciones Físicas Originales*, *Control Estricto de Stock* y *Comunidad y Cultura Gamer*, con **efecto de borde RGB** animado.
- **Se quitan** las secciones "Categorías" y "Destacados" de abajo, porque repetían el carrusel y el catálogo.

**Por qué:** recuperar la identidad de la Evaluación 1 y evitar contenido repetido en la portada.
**Archivos:** `pages/tienda/Home.jsx`, `components/productos/CarruselDestacados.jsx`, nuevo `components/info/CaracteristicaCard.jsx`, `styles/estilos.css`. Se eliminó `components/productos/useAgregarAlCarrito.js` porque ya nadie lo usaba.

### CF-02 · Desplegable "Productos" en el header
**Qué cambia:** el enlace "Productos" pasa a ser un desplegable con:
- Todos los productos → `/productos`
- 🔥 Ofertas → `/ofertas`
- 🏷️ Categorías → `/categorias` (ahí se elige la categoría; el desplegable no las lista una por una)

Se quitan "Categorías" y "Ofertas" como enlaces sueltos del menú.
**Por qué:** dejar el menú más limpio sin perder las vistas que pide el Anexo 1.
**Archivos:** `components/layout/Navbar.jsx` y el nuevo `components/productos/MenuProductos.jsx`, que reemplaza a `MenuCategorias.jsx` (se eliminó).

### CF-03 · Carrito oculto mientras está vacío y "Registrarse"
**Qué cambia:**
- El botón "Carrito $X" del header solo aparece cuando hay al menos un producto (`cantidadItems > 0`).
- El botón "Crear cuenta" pasa a decir **"Registrarse"**.

**Por qué:** un carrito en $0 no aporta nada. La página `/carrito` sigue existiendo, con su mensaje de carrito vacío.
**Archivos:** `components/layout/Navbar.jsx`.

### CF-04 · Categoría en las tarjetas y filtro "Solo ofertas"
**Qué cambia:**
- Cada tarjeta de juego (`ProductCard`) muestra su **categoría**, además de la plataforma.
- El filtro de precios del catálogo agrega la opción **"Solo ofertas"**: muestra los productos con `precioOferta` menor que `precio`.

**Por qué:** que la categoría se vea sin entrar al detalle, y que las ofertas también se encuentren desde el catálogo.
**Archivos:** `components/productos/ProductCard.jsx`, `components/productos/ProductFilters.jsx`, `pages/tienda/Productos.jsx`.

### CF-05 · Categorías y Ofertas reutilizan el catálogo
**Qué cambia:**
- `/categorias/:id` muestra el catálogo con el filtro de esa categoría ya aplicado, y con el nombre de la categoría como título.
- `/ofertas` muestra el catálogo con "Solo ofertas" ya aplicado.
- `/categorias` (sin id) muestra las tarjetas de categorías para elegir una.

**Por qué:** cumplir la vista exigida sin mantener tres listados distintos.
**Para la defensa:** es un buen ejemplo de **componente reutilizable con props**: el mismo catálogo recibe `filtroInicial` y `titulo` y se comporta distinto según la ruta.
**Archivos:** `pages/tienda/Productos.jsx`, `pages/tienda/Categorias.jsx`, `pages/tienda/Ofertas.jsx`.

### CF-06 · Nosotros como en la Evaluación 1
**Qué cambia:**
- Vuelve la **historia de PixelVault** ("Nuestra Historia · Preservando el Arte de los Videojuegos Físicos", con sus dos párrafos e imagen).
- **Misión y Visión** con un estilo más trabajado: tarjetas con ícono, borde de color y efecto al pasar el mouse.
- Las áreas del equipo ("Administración y datos", "Carrito y compras", "Tienda y catálogo") pasan a ser **chips de estilo gamer** (fuente arcade, borde de neón).

**Por qué:** devolverle a la página el contenido y el estilo que ya tenía la Evaluación 1.
**Archivos:** `pages/tienda/Nosotros.jsx`, `components/info/TeamMemberCard.jsx`, `styles/estilos.css`.

### CF-07 · Contacto como en la Evaluación 1
**Qué cambia:** la página vuelve a tener:
- Encabezado "Canal Directo · Contacto & Soporte PixelVault" con su texto explicativo.
- El formulario a la izquierda y, a la derecha, **Datos de Bodega y Retiro**: dirección (Paseo Huérfanos #1230, Local 16-B, Santiago Centro), horario, correo de operaciones y mesa de ayuda.
- **Preguntas frecuentes** en un acordeón de Bootstrap.
- Más estilo: tarjetas oscuras con borde de neón, como el resto de la tienda.

**Por qué:** a la página le faltaba información útil y estilo.
**Archivos:** `pages/tienda/Contacto.jsx`, `components/info/ContactForm.jsx`.

---

## Compra y órdenes

### CF-08 · Corrección: el checkout no autocompletaba los datos del cliente
**Problema:** el checkout guarda un borrador del formulario en `sessionStorage` (`pixelvault_checkout`) para no perder los datos si el pago falla. Pero ese borrador también se guardaba **vacío** cuando alguien entraba a `/checkout` sin productos o sin sesión. Después tenía prioridad sobre los datos del usuario, y el cliente con sesión veía todo en blanco.

**Corrección:**
- El formulario parte de los datos del usuario y encima pone **solo los campos que el cliente sí escribió** en el borrador.
- No se guarda el borrador cuando el carrito está vacío.
- Al cerrar sesión se borra el borrador, para que otro usuario en el mismo navegador no vea datos ajenos.

**Archivos:** `pages/tienda/Checkout.jsx`, `context/AuthContext.jsx`.

### CF-09 · Números de orden `PV-000001`
**Qué cambia:** cada orden tiene un **código correlativo** `PV-000001`, `PV-000002`, … (como en la Evaluación 1), calculado a partir del mayor existente. Se muestra en la boleta, en Mis compras, en el admin y en las URLs: `/compra/exito/PV-000003` y `/admin/ordenes/PV-000003`.
**Por qué:** un identificador legible y consistente con la Evaluación 1.
**Contrato:** el campo `numero` de la orden pasa a ser texto (`'PV-000001'`) en vez de número. Las órdenes de ejemplo de `seed.js` se convierten a `PV-000001` y `PV-000002`.
**Archivos:** `components/compra/pago.js`, `components/compra/ordenes.js`, `data/seed.js`, páginas de órdenes y boleta.

### CF-10 · Flujo de estados con botón "siguiente estado"
**Qué cambia:** el estado de la orden **ya no se elige de una lista**. Cada orden muestra un **botón con el siguiente paso**, según su tipo de entrega:

```text
Despacho a domicilio:
  En preparación ──[Asignar repartidor ▾]──▶ Asignado a repartidor ──[Iniciar ruta]──▶ En camino ──[Marcar entregada + foto]──▶ Entregada

Retiro en tienda:
  En preparación ──[Marcar lista para retiro]──▶ Lista para retiro ──[Entregar al cliente]──▶ Entregada

Cancelar: botón aparte, solo Administrador, solo antes de "En camino".
```

- "Asignar repartidor" pide **elegir a cuál** (lista de usuarios con rol Repartidor activos): elegir la persona no es lo mismo que elegir el estado.
- "Iniciar ruta" y "Marcar entregada" los hace **el repartidor** desde su panel (CF-12). El administrador también puede hacerlo si hace falta.
- Cada cambio queda guardado en la orden (`historialEstados`) y en el historial de movimientos (CF-14).

**Por qué:** evitar saltos de estado imposibles (por ejemplo, de "En preparación" directo a "Entregada") y replicar la logística de la Evaluación 1.

**Contrato:** nuevos campos de la orden:
```js
{
  numero: 'PV-000001',
  estado: 'En preparación' | 'Asignado a repartidor' | 'En camino' | 'Lista para retiro' | 'Entregada' | 'Cancelada',
  repartidorId: 6 | null,
  fotoEntrega: 'data:image/jpeg;base64,...' | null,
  historialEstados: [{ estado, fecha, usuarioId, usuarioNombre }],
  // ...el resto igual que antes
}
```
**Archivos:** `components/compra/ordenes.js` (define el flujo: `siguientePaso(orden)`), `pages/admin/Ordenes.jsx`, `pages/admin/BoletaDetalle.jsx`, `components/compra/EstadoBadge.jsx`, `utils/reportes.js` (las canceladas se siguen excluyendo).

### CF-19 · Fondo con patrón gamer e imágenes de categorías
**Qué cambia:**
- Toda la página (tienda y Panel Staff) tiene de fondo un **patrón de íconos gamer en pixel art** con la paleta de PixelVault, repetido y con una capa oscura encima para que no compita con el texto.
- Cada categoría tiene su **imagen propia** en pixel art, en `/categorias` y en el admin de categorías.

**Por qué:** darle identidad visual propia a la tienda.
**Detalle técnico:** las imágenes originales pesaban unos 2,5 MB cada una; se redujeron a 960 px de ancho (categorías) y 1024 px (fondo), entre 53 y 112 KB cada una, para que la página cargue rápido. Las originales quedaron fuera del repo, en `Evaluacion 2/imagenes-originales/`.
**Datos versión 4:** hay que limpiar el navegador otra vez para ver las imágenes nuevas de las categorías.
**Archivos:** `public/img/fondo-patron.jpg`, `public/img/categorias/*.jpg`, `styles/estilos.css` (fondo del `body`), `data/seed.js` y `data/db.js`.

### CF-18 · Imagen de producto: una sola fuente y encuadre
**Qué cambia:**
- En el formulario de producto se elige **🔗 URL o ruta** o **📁 Subir archivo**: se ve un solo campo a la vez, y al cambiar de modo se borra la imagen anterior, así nunca quedan las dos.
- Debajo aparece el **editor de encuadre**: un recuadro con la misma proporción que la tarjeta de la tienda donde se **arrastra la imagen** para elegir qué parte se ve, con controles de zoom (100 % a 250 %) y de posición horizontal y vertical, más un botón "Centrar".
- Las tarjetas de la tienda muestran la imagen con ese encuadre (por ejemplo, Red Dead ya puede mostrar el título en vez de solo la parte de arriba).

**Por qué:** algunas carátulas se cortaban mal en la tarjeta y no había cómo corregirlo.
**Contrato:** nuevo campo opcional del producto `encuadre: { x, y, zoom }` (x e y en % de 0 a 100). Si no existe, se centra la imagen.
**Para la defensa:** `ImagenEncuadrada` es el mismo componente en el editor y en la tienda, así lo que se ve al editar es lo que se publica. El encuadre usa `object-position` y `transform: scale` de CSS.
**Archivos:** nuevos `components/productos/ImagenEncuadrada.jsx` y `components/admin/EditorEncuadre.jsx`; `components/admin/ProductForm.jsx`, `components/productos/ProductCard.jsx`, `styles/estilos.css` y `utils/movimientos.js`.

### CF-17 · Tipo de entrega visible y comprobante para el cliente
**Qué cambia:**
- Las tablas de órdenes (admin, Mis compras e historial por usuario) tienen una columna **Entrega** con una insignia 🚚 Despacho o 🏪 Retiro. En el admin hay además un filtro "Solo despacho / Solo retiro".
- El botón "Ver boleta" ahora dice **"Detalles"**.
- Al marcar una orden como entregada, el repartidor puede dejar un **comentario para el cliente** (opcional), además de la foto.
- En el detalle de una orden con despacho, el **cliente ve el comprobante de entrega**: foto del paquete, comentario, quién la entregó y cuándo. Mientras va en camino, ve qué repartidor la lleva. Las órdenes de retiro no muestran comprobante.

**Por qué:** que el staff distinga de un vistazo qué órdenes salen a despacho, y que el cliente tenga respaldo de la entrega.
**Contrato:** nuevo campo opcional de la orden `comentarioEntrega` (texto). Datos versión 3: hay que limpiar el navegador otra vez.
**Archivos:** nuevos `components/compra/TipoEntregaBadge.jsx` y `components/compra/ComprobanteEntrega.jsx` (se muestra dentro de `Boleta.jsx`, así lo ven el cliente, el admin y el repartidor); `components/compra/OrdersTable.jsx`, `components/compra/AccionesOrden.jsx`, `pages/admin/Ordenes.jsx`, `pages/admin/Entregas.jsx`, `data/seed.js` y `data/db.js`.

---

## Panel staff (antes "panel de administración")

### CF-11 · Cada rol ve solo lo que le compete
**Qué cambia:** el panel `/admin` pasa a llamarse **Panel Staff**. El menú lateral y las rutas se filtran según el rol:

| Sección | Administrador | Operador | Editor | Repartidor |
|---|:-:|:-:|:-:|:-:|
| Dashboard (resumen según el rol) | ✅ | ✅ | ✅ | ✅ |
| Órdenes y boletas | ✅ | ✅ | | |
| Mis entregas (CF-12) | | | | ✅ |
| Productos y stock crítico | ✅ | ✅ | | |
| Categorías | ✅ | | | |
| Blog (CF-13) | ✅ | | ✅ | |
| Usuarios (CF-15) | ✅ | | | |
| Reportes | ✅ | | | |
| Historial de movimientos (CF-14) | ✅ | | | |
| Perfil | ✅ | ✅ | ✅ | ✅ |

- Si un rol entra por URL a una sección que no es suya, ve "Acceso denegado".
- El **Administrador conserva todas las vistas** que pide la Figura 10 del Anexo 1.
- El Cliente no entra al panel; en la tienda ve "Mis compras".

**Por qué:** replicar los permisos de la Evaluación 1 (RBAC) y que cada usuario vea solo sus herramientas.
**Contrato:** `ProtectedRoute` recibe `roles={[...]}` por ruta. La configuración de qué ve cada rol queda en un solo lugar: `data/permisos.js`.
**Archivos:** `routes/AppRouter.jsx`, `routes/ProtectedRoute.jsx`, `components/layout/AdminSidebar.jsx`, `pages/admin/Dashboard.jsx`, nuevo `data/permisos.js`.

### CF-12 · Panel del repartidor
**Qué cambia:** nueva sección **Mis entregas** (`/admin/entregas`), solo para el rol Repartidor. Muestra las órdenes asignadas a ese repartidor, con dirección, comuna, indicaciones y productos, y sus botones:
- **Iniciar ruta** → pasa la orden a "En camino".
- **Marcar entregada** → pide **subir una foto del paquete entregado** (se guarda como base64 con `FileReader`, como en la Evaluación 1) → pasa la orden a "Entregada".

Tiene dos pestañas: Pendientes y Entregadas. **Usuario de prueba:** `ilie` / `repartidor` (Ilie Flores, ya existe en los datos).
**Archivos:** nuevo `pages/admin/Entregas.jsx`; nuevo `components/compra/AccionesOrden.jsx` (el botón del siguiente paso, que comparten la boleta del admin y esta página); `utils/imagen.js` (comprime la foto para que quepa en localStorage).

### CF-13 · Panel del editor (blog)
**Qué cambia:** nueva sección **Blog** (`/admin/blog`) para Editor y Administrador: listado de artículos, **crear, editar y eliminar** (con confirmación). El formulario tiene título, categoría, resumen, contenido, imagen (URL o archivo del equipo, como en la Evaluación 1) y autor. El blog público (`/blog`) muestra los cambios al instante.
**Usuario de prueba:** `adriana` / `editor` (Adriana Quispe, ya existe en los datos).
**Archivos:** nuevos `pages/admin/BlogAdmin.jsx`, `pages/admin/ArticuloForm.jsx` (página), `components/admin/ArticleForm.jsx` (formulario), `data/categoriasBlog.js` y `utils/articulos.js`. Este último convierte el texto escrito a HTML **escapando las etiquetas**, para que nadie pueda inyectar código en el blog (que usa `dangerouslySetInnerHTML`).

### CF-14 · Historial de movimientos (solo administradores)
**Qué cambia:** nueva sección **Historial** (`/admin/historial`) con la bitácora de todo lo que pasa en la página, como el `historial.html` de la Evaluación 1. Muestra fecha, usuario, rol, categoría, acción y detalle, con filtros por categoría y usuario, y búsqueda.

**Cómo funciona:** se registra **de forma central en `db.js`**. Cada `create`, `update` y `remove` agrega un movimiento a la colección `movimientos`, con el usuario en sesión. Así no hubo que tocar cada página. También se registran el inicio y cierre de sesión, las compras y los cambios de estado de las órdenes.

**Contrato:** nueva colección `movimientos`:
```js
{ id, fecha, usuarioId, usuarioNombre, rol, categoria: 'Productos' | 'Órdenes' | 'Usuarios' | 'Blog' | 'Categorías' | 'Sesión', accion, detalle }
```
**Archivos:** `data/db.js` (nueva función `db.registrarMovimiento(categoria, accion, detalle)`), nuevos `pages/admin/Historial.jsx` y `utils/movimientos.js` (arma el texto legible de cada movimiento).

### CF-15 · Usuarios divididos en Clientes y Staff
**Qué cambia:** la sección Usuarios tiene **dos pestañas**:
- **Clientes:** rol Cliente, con el botón "Compras" (historial de compras).
- **Staff:** Administrador, Operador, Editor y Repartidor, con contadores por rol (como el "panel de staff unificado" de la Evaluación 1).

Crear, editar, activar y desactivar funciona igual que antes en ambas.
**Archivos:** `pages/admin/UsuariosAdmin.jsx`.

### CF-16 · El staff entra directo al panel
**Qué cambia:** al iniciar sesión, cualquier rol de staff (Administrador, Operador, Editor o Repartidor) va directo al **Panel Staff**. El Cliente vuelve a la tienda. En el header de la tienda, el staff ve un botón "Panel Staff".
**Archivos:** `pages/tienda/Login.jsx`, `components/layout/Navbar.jsx`, `data/permisos.js`.

---

## Datos: versión 2

Como cambia la forma de las órdenes y se agrega la colección `movimientos`, en `db.js` se sube `VERSION_DATOS` de `'1'` a `'2'` (y luego a `'3'` con CF-17). Al abrir la app con datos viejos, se recargan solos los datos semilla. Las compras de prueba que hayan hecho se pierden, que es lo esperado.

## Cuentas de prueba (sin cambios)

| Usuario | Clave | Rol | Qué probar |
|---|---|---|---|
| Jim / Emanuel / Maximiliano | `admin` | Administrador | Todo el panel, historial, usuarios |
| fernando | `operador` | Operador | Órdenes (preparar, asignar repartidor), productos |
| adriana | `editor` | Editor | Blog |
| ilie | `repartidor` | Repartidor | Mis entregas: iniciar ruta y marcar entregada con foto |
| francisco | `cliente` | Cliente | Compra completa y Mis compras |

## Qué preparar para la defensa

- **Maximiliano:** el Home, el header, el catálogo, Nosotros y Contacto cambiaron. Revisen juntos el nuevo `Productos.jsx`: ahora recibe `filtroInicial` y `titulo` por props y lo reutilizan Categorías y Ofertas (CF-05). Es un buen ejemplo de props.
- **Emanuel:** tus órdenes ahora siguen un flujo con `siguientePaso(orden)` en `ordenes.js` (CF-10) y tienen códigos PV (CF-09). Revisa también la corrección del checkout (CF-08): es un buen ejemplo de cómo se combinan dos fuentes de datos para el estado inicial de un formulario.
- **Jim:** permisos por rol (CF-11), historial central en `db.js` (CF-14) y los paneles de repartidor y editor (CF-12 y CF-13).

## CF-20 ✅ Perfil del cliente, compra con creación de cuenta y títulos del Panel Staff

- **Perfil del cliente:** el botón "👤 nombre" de la barra lleva a `/perfil` (cliente) o `/admin/perfil` (staff). `/perfil` reutiliza `pages/admin/Perfil.jsx` y exige sesión. "Mis compras" sigue en el menú.
- **Checkout sin sesión = crear cuenta:** si no hay sesión, el checkout pide además RUT, contraseña y su confirmación (`components/compra/CuentaNuevaForm.jsx`). Al pagar se llama a `registrar(...)`, la cuenta queda con la sesión iniciada y la orden se asocia a ese `usuarioId`. Se valida que el correo y el RUT no existan. Las contraseñas no se guardan en el borrador del checkout.
- **Títulos del Panel Staff:** la clase `.encabezado-panel` (en `estilos.css`) pone los títulos de cada sección en una tarjeta oscura con borde celeste para que no se pierdan con el fondo. Las migas de pan y "Accesos rápidos" también van en un recuadro.

## CF-21 ✅ API REST con json-server

El profesor pidió que la app funcione con **json-server** y tenga una API. Los datos ya no viven en `localStorage`:

- **`db.json`** es la base de datos. Se genera desde `src/data/seed.js` con `npm run db:reset`.
- **`npm run api`** levanta json-server en `http://localhost:3001`: `GET /productos`, `GET /productos/3`, `POST`, `PUT` y `DELETE`, igual para cada colección.
- **`src/data/api.js`** hace las llamadas con `fetch`. La URL se puede cambiar con `VITE_API_URL`.
- **`src/data/db.js`** mantiene **la misma API para las páginas** (`getAll`, `getById`, `create`, `update`, `remove`):
  - Al abrir la app, `inicializar()` pide todas las colecciones a la API (`main.jsx` espera antes de mostrar la tienda).
  - Las lecturas salen de esa copia en memoria.
  - Cada cambio se envía a la API (POST / PUT / DELETE), en cola para respetar el orden.
- Si la API está apagada, la app muestra "No se pudo conectar con la API" con el comando para encenderla.
- El carrito y la sesión siguen en el navegador (`localStorage` / `sessionStorage`), porque son de cada visitante.

**Para la defensa:** "db.js es nuestra capa de datos: al iniciar hace GET a cada recurso de la API y cada create/update/remove hace POST/PUT/DELETE con fetch. Las páginas no saben de HTTP: llaman a db.getAll o db.update, y db.js habla con json-server."
