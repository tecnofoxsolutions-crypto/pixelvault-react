# Guía de defensa — Jim Charles

Evaluación Parcial 2 · DSY1104 Desarrollo Fullstack II. La presentación vale **60 %** y es **individual**: cada uno explica su propio código.

Qué evalúa la rúbrica en la presentación (y qué parte te toca mostrar):

| Indicador | Peso | Qué esperan ver | Tu material |
|---|---|---|---|
| IE2.1.3 Diseño con un framework JS | 15 % | Cómo se estructuró una app frontend moderna | Estructura de carpetas, Vite, React Router, `db.js` |
| IE2.1.4 Componentes React, props, state y Bootstrap | 20 % | Componentes con props y estado bien manejados, diseño responsivo | `ProductForm`, `StatCard`, `AdminSidebar`, grillas del admin |
| IE2.2.2 y IE2.3.2 Pruebas unitarias | 25 % | — | **Descartado por el docente** (ver la pregunta 20) |

---

## 1. Guion de tus 5 minutos

Antes de empezar: navegador abierto en `http://localhost:5173/login`, VS Code con los archivos de la sección 2 en pestañas y los datos limpios (ver la sección 5).

| Min | Qué dices | Qué muestras |
|---|---|---|
| 0:00–1:00 | "Migramos la tienda de HTML a una SPA en React con Vite. Usamos React Router para navegar sin recargar y Bootstrap 5 para el diseño responsivo. No hay backend: `db.js` simula la base de datos sobre localStorage con un CRUD completo." | Árbol de `src/`: `data`, `context`, `routes`, `components`, `pages` |
| 1:00–2:00 | "Las rutas están en un solo archivo. La tienda y el admin tienen layouts distintos, y el admin está protegido por rol." | [AppRouter.jsx](../src/routes/AppRouter.jsx) líneas 47 y 75–77 · [ProtectedRoute.jsx](../src/routes/ProtectedRoute.jsx) líneas 12 y 15 |
| 2:00–2:45 | **Demo:** entrar a `/admin` sin sesión (redirige al login) → clic en la cuenta demo de francisco (cliente) → `/admin` dice "Acceso denegado" → cerrar sesión → entrar con Jim → dashboard | Navegador |
| 2:45–4:15 | **Demo CRUD:** Productos → Nuevo → elegir PlayStation 5 (el código se genera solo) → precio 0 y stock −1 (muestra errores) → corregir → crear → editar el stock → eliminar con confirmación | Navegador + [ProductForm.jsx](../src/components/admin/ProductForm.jsx) |
| 4:15–5:00 | "Ejemplo de props: `StatCard` solo muestra lo que recibe. Ejemplo de state: el menú del sidebar en móvil." Achicar la ventana: las tarjetas pasan de 3 columnas a 1 y aparece el botón Menú | [StatCard.jsx](../src/components/admin/StatCard.jsx) · [AdminSidebar.jsx](../src/components/layout/AdminSidebar.jsx) línea 20 · DevTools en modo móvil |

Si sobra tiempo: Reportes → cambiar entre 7 días, 30 días y todo (el state `dias` recalcula todo).

---

## 2. Tu código: qué mostrar y cómo explicarlo

### Arranque de la app — [main.jsx](../src/main.jsx)
- Línea 5–6: importa el CSS y el JS de Bootstrap. El JS hace funcionar el menú hamburguesa y el carrusel.
- Línea 13: `inicializar()` carga los datos semilla en localStorage la primera vez.
- Línea 17: `<BrowserRouter>` envuelve la app para que funcione React Router.

### Rutas — [AppRouter.jsx](../src/routes/AppRouter.jsx)
- **Rutas anidadas:** todas las páginas de la tienda están dentro de `<Route element={<TiendaLayout />}>` (línea 47). El layout dibuja Navbar y Footer una sola vez, y la página cambia dentro de su `<Outlet />`.
- **Parámetros:** `/productos/:id` (línea 50); la página lee el id con `useParams()`.
- **Protección:** el bloque `/admin` (líneas 75–77) está envuelto en `<ProtectedRoute roles={['Administrador']}>`.

### Rutas protegidas — [ProtectedRoute.jsx](../src/routes/ProtectedRoute.jsx)
- Sin sesión: `<Navigate to="/login" state={{ desde: ... }} />` (línea 12). Guarda la página pedida para volver a ella después del login.
- Con sesión pero sin el rol: muestra "Acceso denegado" (línea 15).

### Base de datos simulada — [db.js](../src/data/db.js)
- Cinco funciones: `getAll` (50), `getById` (54), `create` (58), `update` (67) y `remove` (76). Todas reciben el nombre de la colección: `db.getAll('productos')`.
- Cada colección se guarda como JSON en localStorage (`pixelvault_productos`, etc.).
- `create` calcula el siguiente id buscando el mayor y sumando 1.
- **Frase clave:** "Si mañana tenemos backend, solo cambiamos el interior de estas 5 funciones por `fetch` a la API; los componentes no se enteran."

### Sesión — [AuthContext.jsx](../src/context/AuthContext.jsx)
- `createContext` (línea 5) + `useState` del usuario (línea 14) + `useAuth()` (línea 73).
- Cualquier componente sabe quién está conectado sin pasar props por todos los niveles (por ejemplo, el Navbar y el sidebar).
- La sesión va en **sessionStorage** (se borra al cerrar el navegador). Los datos van en **localStorage** (persisten).

### Formulario de producto — el mejor ejemplo de props + state
[ProductForm.jsx](../src/components/admin/ProductForm.jsx):
- **Props** (línea 91): `producto` (o `null` si es nuevo), `categorias`, `codigosExistentes`, `onGuardar`, `onCancelar`.
- **State** (líneas 93–94): `form` (lo que se escribe), `tocados` (qué campos ya tocaste) y `intentoEnviar`.
- **Componente controlado:** cada input tiene `value={form.x}` y `onChange={cambiar}` (línea 104). React es la única fuente del valor.
- **Validación** en una función aparte (`validar`, línea 58). Los errores se calculan en cada render y se muestran bajo el campo solo si ya lo tocaste (`errorDe`, línea 100).
- **Código automático:** al elegir plataforma en un producto nuevo se propone el siguiente código libre (línea 112).
- **El formulario no sabe guardar:** llama a `onGuardar(datos)` y el padre decide.

[ProductoForm.jsx](../src/pages/admin/ProductoForm.jsx) (la página):
- Decide si es `db.update` (línea 32) o `db.create` (línea 34) según haya `id` en la URL.
- `key={id ?? 'nuevo'}` (línea 54): obliga a React a crear un formulario nuevo al pasar de "editar" a "nuevo". Sin la key, React reutilizaría el componente y quedarían los datos anteriores.

### Listado de productos — [ProductosAdmin.jsx](../src/pages/admin/ProductosAdmin.jsx)
- 5 estados (líneas 20–24): productos, búsqueda, filtro, producto a eliminar y mensaje.
- `visibles` (línea 35) **no es estado**: se calcula filtrando en cada render. No hay que guardar dos veces lo mismo.
- `useEffect` (línea 30): borra el mensaje de "creado correctamente" del historial para que no reaparezca al recargar.
- Eliminar: guarda el producto en `aEliminar`, eso abre el `ConfirmModal` (línea 139), y al confirmar llama a `db.remove` y vuelve a leer la lista (línea 41).

### Componentes que solo usan props
- [StatCard.jsx](../src/components/admin/StatCard.jsx): `{ titulo, valor, detalle, icono, color }`. Se usa 3 veces en el dashboard y 4 en reportes con datos distintos.
- [CuentasDemo.jsx](../src/components/auth/CuentasDemo.jsx): recibe `cuentas` y `onSeleccionar`. Al hacer clic, avisa al padre (Login), que rellena sus propios campos. Es un ejemplo de **comunicación de hijo a padre**.

### State simple — [AdminSidebar.jsx](../src/components/layout/AdminSidebar.jsx)
- `const [abierto, setAbierto] = useState(false)` (línea 20).
- Clase `${abierto ? 'd-block' : 'd-none'} d-md-block` (línea 45): en móvil depende del estado; desde `md` siempre se ve.

### Registro con validación en vivo — [Registro.jsx](../src/pages/tienda/Registro.jsx)
- `validar` (línea 25): RUT con dígito verificador (módulo 11), correo, contraseñas iguales, y RUT y correo no repetidos.
- Las comunas se derivan de la región elegida (línea 55): al cambiar la región, la lista cambia sola.

### Reportes — [reportes.js](../src/utils/reportes.js) + [Reportes.jsx](../src/pages/admin/Reportes.jsx)
- Los cálculos son **funciones puras**: reciben arreglos y devuelven resultados, sin tocar la pantalla ni localStorage. Son fáciles de probar y de reutilizar.
- La página solo guarda `dias` en su estado (línea 15); al cambiarlo se recalcula todo.

### Bootstrap responsivo (en tus pantallas)
| Clase | Dónde | Qué hace |
|---|---|---|
| `row` + `col-12 col-md-4` | Dashboard (línea 49) | 1 columna en móvil, 3 desde 768 px |
| `col-6 col-lg-4 col-xl-3` | Accesos rápidos | 2, 3 o 4 tarjetas por fila según el ancho |
| `d-none d-md-table-cell` | Tablas del admin | Oculta la columna Categoría en móvil |
| `table-responsive` | Tablas | La tabla se desplaza sola sin romper la página |
| `d-none d-md-block` | Sidebar | Menú colapsable en móvil |
| `data-bs-theme="dark"` | `index.html` | Tema oscuro de Bootstrap 5.3 en toda la app |

---

## 3. Preguntas probables y cómo responderlas

**1. ¿Diferencia entre props y state?**
Las props vienen del padre y el componente no las cambia (como parámetros de una función). El state es memoria propia del componente: cuando cambia con su `set...`, React vuelve a dibujar. Ejemplo: `StatCard` solo tiene props; `ProductForm` recibe el producto por props y guarda lo que escribes en su state.

**2. ¿Qué hace `useState`?**
Devuelve el valor actual y una función para cambiarlo: `const [abierto, setAbierto] = useState(false)`. Al llamar `setAbierto(true)` el componente se vuelve a renderizar con el valor nuevo.

**3. ¿Para qué sirve `useEffect`?**
Para efectos secundarios después de dibujar: guardar en localStorage, leer la URL, timers. En el carrito de Emanuel guarda los items en localStorage cada vez que cambian (`[items]` es la lista de dependencias). En mi listado de productos limpia el mensaje del historial.

**4. ¿Qué es un Context y por qué lo usaron?**
Es estado compartido sin pasar props por cada nivel. La sesión (`AuthContext`) y el carrito (`CartContext`) los necesitan el Navbar, el checkout, el admin, etc. Con `useAuth()` cualquier componente lo lee.

**5. ¿Cómo funciona React Router?**
La app es una sola página (SPA). `<Link>` cambia la URL sin recargar y React Router muestra el componente de esa ruta. Usamos `useParams` (leer `:id`), `useNavigate` (navegar desde código, por ejemplo después de guardar), `<Outlet />` (rutas anidadas) y `<Navigate />` (redirigir).

**6. ¿Por qué `<Link>` y no `<a href>`?**
`<a href>` recarga toda la página: se pierde el estado y se vuelve a descargar todo. `<Link>` solo cambia la vista.

**7. ¿Dónde se guardan los datos? ¿Qué pasa si recargo?**
En localStorage, a través de `db.js`. Al recargar siguen ahí. La sesión está en sessionStorage, que se mantiene al recargar pero se borra al cerrar el navegador.

**8. ¿Cómo cumplieron "archivo JS con CRUD"?**
`src/data/db.js` con `getAll`, `getById`, `create`, `update` y `remove`, más `seed.js` con los datos iniciales. Lo usan todos los componentes. La demo del CRUD completo es el admin de productos.

**9. ¿Qué es un componente controlado?**
Un input cuyo valor lo maneja React: `value={form.nombre}` + `onChange`. Así se puede validar mientras escribes y el formulario siempre sabe su contenido.

**10. ¿Cómo validan los formularios?**
Con una función `validar(form)` que devuelve un objeto con el error de cada campo (o `null`). Se recalcula en cada render. El error se muestra bajo el campo con `is-invalid` e `invalid-feedback` de Bootstrap, solo si el campo ya se tocó o si se intentó enviar.

**11. ¿Qué es la prop `key`?**
Le dice a React qué elemento es cuál. En listas (`productos.map`) evita errores al reordenar; en `ProductoForm` la uso para forzar un formulario nuevo al cambiar de producto.

**12. ¿Qué significa "Single Responsibility" en su proyecto?**
Cada componente hace una cosa: `ProductForm` edita, la página `ProductoForm` decide si crear o actualizar, `db.js` guarda, `reportes.js` calcula, `StatCard` muestra un número. Si algo crece, se divide.

**13. ¿Cómo evitan que un cliente entre al admin?**
`ProtectedRoute` revisa la sesión y el rol antes de mostrar `/admin`. Sin sesión redirige al login; con un rol distinto muestra "Acceso denegado". (Si preguntan por seguridad real: en producción eso se valida también en el backend, porque el frontend se puede manipular.)

**14. ¿Cómo hicieron el diseño responsivo?**
Con la grilla de Bootstrap (`row`, `col-*` con puntos de quiebre `sm/md/lg/xl`), `navbar-expand-lg` para el menú hamburguesa, `table-responsive` para tablas y utilidades `d-none d-md-block` para mostrar u ocultar según el ancho. Mostrarlo en vivo con DevTools en modo móvil.

**15. ¿Por qué Vite?**
Crea el proyecto React en segundos, el servidor de desarrollo recarga al instante al guardar y `npm run build` genera la versión optimizada.

**16. ¿Por qué el formulario llama a `onGuardar` en vez de guardar él mismo?**
Para reutilizarlo: el mismo formulario sirve para crear y editar. El componente que sabe el contexto (la página) decide qué hacer con los datos. Los datos bajan por props y los eventos suben por funciones.

**17. ¿Qué es `StrictMode`?**
Un modo de desarrollo que ejecuta algunas cosas dos veces para detectar errores. No afecta la versión final.

**18. ¿Cómo se repartieron el trabajo y cómo evitaron conflictos?**
Cada uno era dueño de sus archivos (está en `AGENTS.md`). El "contrato" (nombres de funciones de `db.js`, `useAuth`, `useCart` y la forma de los datos) se fijó al inicio, así cada uno programó sin esperar al otro. Commits chicos y `git pull --rebase` antes de cada push.

**19. ¿Qué harían para conectar un backend?**
Cambiar el interior de `db.js` por llamadas `fetch` a una API REST (por ejemplo Spring Boot) y volver asíncronas las funciones. Los componentes casi no cambian porque ya usan esa interfaz.

**20. ¿Y las pruebas con Jasmine y Karma?**
El docente las sacó del alcance de esta entrega. Verificamos cada historia a mano con los criterios de aceptación de Trello, en móvil y escritorio. (Si insisten: dejamos la lógica en funciones puras como `validar` y `reportes.js`, que son las más fáciles de probar con Jasmine después.)

---

## 4. Errores comunes que conviene evitar al responder

- Decir que las props "se modifican": **no**, las props son de solo lectura.
- Confundir localStorage (persiste) con sessionStorage (dura mientras la pestaña está abierta).
- Decir "Bootstrap hace responsivo todo solo": hay que elegir las clases `col-*` y los puntos de quiebre.
- Leer el código en voz alta: mejor explicar **qué problema resuelve** cada parte.

---

## 5. Checklist antes de presentar

- [ ] `git pull` y `npm install` en el equipo de la presentación; `npm run dev` abre sin errores.
- [ ] Datos limpios: en la consola del navegador, `localStorage.clear(); sessionStorage.clear()` y recargar.
- [ ] Probar una vez la demo completa (login → acceso denegado → CRUD → móvil).
- [ ] Pestañas de VS Code abiertas: `AppRouter.jsx`, `ProtectedRoute.jsx`, `db.js`, `ProductForm.jsx`, `StatCard.jsx`, `AdminSidebar.jsx`.
- [ ] En Reportes usar "Últimos 30 días" (las órdenes de ejemplo son del 28 de octubre y del 5 de noviembre).
- [ ] Saber responder sin leer las preguntas 1 a 7 de la sección 3.
