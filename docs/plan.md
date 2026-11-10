# Plan de desarrollo ágil — PixelVault React (Evaluación Parcial 2)

> **Actualización (2026-11-09): la entrega es mañana.** El plan de 7 días de abajo quedó como referencia. Lo que manda ahora es el tablero de Trello **Pixel Vault** (https://trello.com/b/b9v2jK3p/pixel-vault), organizado en una columna por desarrollador:
> - **Trabajo independiente:** cada integrante es dueño de sus propios archivos y rutas (tarjeta "2 · Dueños"), así nadie edita el archivo de otro.
> - **Contrato fijo:** las funciones de `db.js`, `useAuth()` y `useCart()` y la forma de los datos están definidas desde el inicio (tarjeta "3 · Contrato"), así cada uno programa sin esperar a los demás.
> - **Arranque:** Jim sube en máximo 1 hora un esqueleto con todas las rutas y páginas vacías. Mientras tanto, Emanuel y Maximiliano preparan lo que no depende del repo.
> - **Git:** commits chicos directo a `main` con `git pull --rebase` antes de cada `push`. Sin revisión de PR por falta de tiempo.
> - **Recorte:** si falta tiempo, se saltan las tarjetas SHOULD y COULD.

**Equipo:** Jim Charles (Scrum Master + arquitectura/admin), Emanuel Reyes (flujo de compra y órdenes), Maximiliano Peral (tienda pública, UI y responsivo).
**Product Owner:** el docente (sus instrucciones son el backlog de origen). Dentro del equipo, Jim decide prioridades si hay dudas.
**Duración:** 7 días. **Metodología:** Scrum adaptado con sprints cortos y tablero Kanban en Trello.
**Detalle de cada tarjeta:** `docs/backlog.md`. **Stack y estructura:** `docs/ficha-tecnica.md`.

---

## 1. Cómo trabajamos (Scrum adaptado a 1 semana)

| Ceremonia | Cuándo | Duración | Qué se hace |
|---|---|---|---|
| Sprint Planning | Inicio de cada sprint (días 1, 2, 4 y 6) | 20 min | Mover las tarjetas del sprint a "Sprint Backlog", confirmar responsables y fechas |
| Daily | Todos los días, misma hora (presencial o por llamada) | 10 min | Cada uno responde: qué terminé, qué hago hoy, qué me bloquea. Se mira el tablero, no se discute código |
| Revisión de PR | Durante el día, cada vez que una tarjeta pasa a "En revisión" | 15 min | Otro integrante revisa el código y verifica los criterios de aceptación a mano |
| Sprint Review | Fin de cada sprint | 15 min | Demo en `main` de lo terminado. Si algo no cumple, vuelve a "Por hacer" |
| Retrospectiva | Fin de los sprints 1 y 2 | 10 min | Una cosa que funcionó, una que mejorar. Se anota como comentario en la tarjeta del sprint |

**Reglas del equipo**
- Máximo **2 tarjetas en "En progreso"** por persona.
- Nadie aprueba su propio PR. El revisor marca los criterios de aceptación en el checklist de la tarjeta.
- Si una tarjeta está bloqueada más de medio día, se mueve a "Bloqueado" y se avisa en el grupo.
- Todo cambio entra a `main` por Pull Request (el docente revisará el historial de GitHub en la defensa).

---

## 2. Calendario de sprints

| Sprint | Días | Objetivo | Resultado verificable |
|---|---|---|---|
| **0 — Base** | Día 1 | Proyecto creado, datos, rutas, sesión y carrito funcionando | `npm run dev` abre la app con barra, rutas, login de prueba y carrito que persiste |
| **1 — Tienda y compra** | Días 2–4 | Toda la tienda pública migrada y el flujo de compra completo | Un cliente puede buscar, filtrar, ver categorías y ofertas, comprar y ver la boleta o el error |
| **2 — Administración** | Días 4–6 | Panel de administrador completo | Un admin puede ver el dashboard, administrar productos, categorías, usuarios y órdenes, y ver reportes |
| **3 — Cierre** | Días 6–7 | Responsivo revisado, ERS V2, entrega y presentación ensayada | Entregables subidos a AVA y presentación ensayada en menos de 15 min |

### Reparto por día

| Día | Jim | Emanuel | Maximiliano |
|---|---|---|---|
| 1 (mañana) | TEC-01 Proyecto y repo | Configura su entorno, clona el repo | Configura su entorno, clona el repo |
| 1 (tarde) | TEC-02 Base de datos `db.js` | TEC-05 Carrito global (contra datos semilla) | TEC-03 Layouts y rutas · TEC-06 Estilos y comunes |
| 2 | TEC-04 Sesión y rutas protegidas | HU-36 Carrito | HU-32 Productos y filtros |
| 3 | HU-40 Login y registro | HU-37 Checkout | HU-33 Detalle · HU-34 Categorías · HU-35 Ofertas |
| 4 | HU-44 Dashboard | HU-38 Pago exitoso · HU-39 Pago error · HU-43 Mis compras | HU-31 Home · HU-41 Blog · HU-42 Nosotros/Contacto |
| 5 | HU-46 Productos admin | HU-45 Órdenes y boletas | HU-48 Categorías admin · HU-49 Usuarios admin |
| 6 | HU-47 Stock crítico · HU-51 Reportes | HU-50 Historial usuario · HU-52 Perfil · inicia TEC-07 | MEJ-01 Revisión responsiva |
| 7 | TEC-08 Entrega · ensayo TEC-09 | TEC-07 ERS V2 · ensayo TEC-09 | Capturas responsivas · ensayo TEC-09 |

**Carga:** Jim 16 pts · Emanuel 17 pts · Maximiliano 18 pts (S=1, M=2, L=3).

### Dependencias críticas (lo que no puede atrasarse)

```text
TEC-01 ─┬─ TEC-02 ─┬─ TEC-04 ── HU-40 ── HU-44 ── HU-46 ── HU-47 / HU-51
        │          └─ TEC-05 ── HU-36 ── HU-37 ── HU-38 / HU-39 ── HU-43 / HU-45 ── HU-50
        ├─ TEC-03 ── HU-32 ── HU-33 / HU-34 / HU-35 / HU-31
        └─ TEC-06
```
Si TEC-02 se atrasa, Emanuel y Maximiliano trabajan con los arreglos de `seed.js` directamente y se conectan a `db.js` cuando esté listo.

---

## 3. Fases en detalle

### Sprint 0 — Base (Día 1)
- **Elementos:** TEC-01, TEC-02, TEC-03, TEC-04, TEC-05, TEC-06.
- **Archivos:** `package.json`, `src/data/*`, `src/context/*`, `src/components/layout/*`, `src/components/common/*`, `src/routes/*`, `src/styles/estilos.css`.
- **Riesgos:** conflictos de Git si los tres tocan `App.jsx` a la vez → solo Maximiliano edita `AppRouter.jsx` el día 1; los demás le piden agregar rutas.
- **Terminado cuando:** los 3 levantan la app en su equipo, navegan todas las rutas (aunque sean temporales), inician sesión con un usuario demo y agregan un producto al carrito desde la consola.

### Sprint 1 — Tienda y compra (Días 2–4)
- **Elementos:** HU-31 a HU-43.
- **Archivos:** `src/pages/tienda/*`, `src/components/productos/*`, `src/components/carrito/*`, `src/components/compra/*`.
- **Riesgos:** HU-37 (checkout) es la tarjeta más grande y bloquea a HU-38/39 → Emanuel la empieza el día 3 a primera hora. Si se atrasa, Jim lo apoya con la lista de regiones y comunas.
- **Terminado cuando:** en la Sprint Review se hace una compra completa con un cliente demo (buscar → detalle → carrito → checkout → éxito → mis compras) y una compra con pago rechazado.

### Sprint 2 — Administración (Días 4–6)
- **Elementos:** HU-44 a HU-52.
- **Archivos:** `src/pages/admin/*`, `src/components/admin/*`, `src/utils/reportes.js`.
- **Riesgos:** `DataTable` y `UserForm` son usados por varias tarjetas → quien lo cree primero (Emanuel con HU-45, Maximiliano con HU-49) lo sube en un PR pequeño ese mismo día.
- **Terminado cuando:** un admin crea un producto en oferta y aparece en `/ofertas`; crea una categoría y aparece en `/categorias`; ve la orden del Sprint 1 en `/admin/ordenes` y en el historial del cliente.

### Sprint 3 — Cierre (Días 6–7)
- **Elementos:** MEJ-01, TEC-07, TEC-08, TEC-09.
- **Riesgos:** dejar la presentación para el final → el ensayo completo es obligatorio el día 7 por la mañana.
- **Terminado cuando:** enlace GitHub, .zip y ERS V2 subidos a AVA, y ensayo cronometrado en menos de 15 min.

---

## 4. Definition of Done (todas las tarjetas)

Una tarjeta pasa a "Hecho" solo si:
- [ ] La app corre sin errores ni advertencias nuevas en la consola del navegador.
- [ ] Todos los criterios de aceptación fueron verificados a mano por **otro** integrante (checklist de la tarjeta marcado).
- [ ] Se ve bien en 375 px, 768 px y 1280 px (vista móvil de las DevTools).
- [ ] Los datos vienen de `db.js` o de un Context; no hay listas de productos ni usuarios escritas dentro de un componente.
- [ ] Los componentes reciben datos y funciones por props y solo tienen estado propio cuando lo necesitan.
- [ ] El PR está aprobado y mergeado a `main`, con el ID de la tarjeta en el título.
- [ ] Si cambió algo de estructura (nueva colección, ruta o componente compartido), se anotó en `docs/ficha-tecnica.md`.

---

## 5. Configuración del tablero en Trello

**Nombre del tablero:** `PixelVault React — Evaluación 2`

### Listas (de izquierda a derecha)

| Lista | Para qué sirve |
|---|---|
| 📌 Info del proyecto | Tarjetas fijas: enlace al repo, Definition of Done, convenciones de Git, credenciales demo, calendario |
| 📥 Product Backlog | Todas las tarjetas que aún no entran a un sprint |
| 📋 Sprint actual — Por hacer | Tarjetas comprometidas en el sprint en curso |
| 🔨 En progreso | Máximo 2 por persona |
| 👀 En revisión (PR) | PR abierto, esperando que otro integrante lo revise y pruebe |
| 🚧 Bloqueado | Con un comentario que explique qué falta y quién lo resuelve |
| ✅ Hecho | Cumple la Definition of Done |

### Etiquetas

| Etiqueta | Color | Uso |
|---|---|---|
| HU | Verde | Historia de usuario |
| TEC | Azul | Tarea técnica o documento |
| MEJ | Amarillo | Mejora |
| Must | Rojo | Obligatorio para la nota |
| Should | Naranja | Importante, se hace si hay tiempo |
| Could | Gris | Opcional |
| Tienda | Celeste | Vistas públicas |
| Compra | Morado | Carrito, checkout, pago |
| Admin | Negro | Panel de administración |
| Docs | Rosa | ERS, README, presentación |
| Sprint 0 / 1 / 2 / 3 | Lima | Sprint al que pertenece |

### Formato de cada tarjeta
- **Título:** `HU-37 · Completar el checkout con dirección de entrega`
- **Miembro:** el responsable de la tabla del backlog.
- **Fecha de vencimiento:** el día del reparto (sección 2).
- **Descripción:** la historia ("Como… quiero… para…"), el contexto, los archivos afectados y las dependencias.
- **Checklist "Criterios de aceptación":** un ítem por CA del backlog.
- **Checklist "Definition of Done":** los 7 ítems de la sección 4.
- **Adjunto / enlace:** el PR de GitHub cuando exista.

### Flujo de una tarjeta
1. En el Planning pasa de **Product Backlog** a **Sprint actual — Por hacer**.
2. El responsable la mueve a **En progreso** y crea la rama `feature/HU-37-checkout`.
3. Al abrir el PR la mueve a **En revisión** y pega el enlace del PR en la tarjeta.
4. El revisor prueba cada criterio y marca el checklist. Si algo falla, comenta y la devuelve a **En progreso**.
5. Con el PR mergeado y la Definition of Done completa, pasa a **Hecho**.

---

## 6. Convenciones de Git

- Ramas: `feature/HU-xx-descripcion-corta`, `tec/TEC-xx-...`, `fix/descripcion`.
- Commits: `feat(HU-37): agrega selector de comunas por región`, `fix(HU-36): corrige total con ofertas`, `docs(TEC-07): agrega rutas al ERS`.
- PR: título `HU-37 · Checkout con dirección`; descripción con los CA cumplidos y una captura.
- Antes de abrir un PR: `git pull origin main` y resolver conflictos en la propia rama.

---

## 7. Mapa de defensa individual (presentación 60%, nota individual)

Cada integrante explica **su propio código**. Ejemplos sugeridos para mostrar:

| Integrante | Props (componente que recibe datos) | State (componente con estado propio) | Bootstrap responsivo | Además explica |
|---|---|---|---|---|
| Jim | `StatCard` (título, valor, ícono, color) y `ProductForm` en modo crear/editar | `ProductForm` (campos y errores) · `AuthContext` | Grilla del dashboard (`row`, `col-md-4`) | Estructura del proyecto, React Router, `ProtectedRoute`, `db.js` y su CRUD |
| Emanuel | `CartItemRow` (producto, `onCambiarCantidad`, `onEliminar`) y `OrderSummaryTable` | `Checkout` (formulario, región/comuna, validación) · `CartContext` | Tabla del carrito con `table-responsive` | Flujo de compra completo, pago éxito/error, `useNavigate`, `useParams` |
| Maximiliano | `ProductCard` y `ProductList` (arreglo de productos, `onAgregar`) | `Productos` (filtros y búsqueda) | Grilla de productos (`col-12 col-md-6 col-lg-3`), navbar colapsable, sidebar offcanvas | Componentes reutilizables, `useSearchParams`, revisión en 3 resoluciones |

**Preguntas que todos deben poder responder:** diferencia entre props y state · para qué sirve `useEffect` · qué es un Context y por qué el carrito usa uno · cómo navega React Router sin recargar · cómo se guardan los datos en `localStorage` · por qué cada componente tiene una sola responsabilidad · qué clases de Bootstrap hacen que la grilla cambie de columnas.

---

## 8. Riesgos y mitigación

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Un integrante se atrasa | Media | Daily diaria; las tarjetas Should/Could (HU-41, 42, 43, 50, 51, 52) se recortan primero |
| Conflictos de Git en archivos compartidos | Alta | PRs pequeños y frecuentes; `AppRouter.jsx` y `db.js` tienen un dueño (Maximiliano y Jim) |
| Bootstrap JS (carrusel, dropdown, modal) no funciona en React | Media | Importar `bootstrap/dist/js/bootstrap.bundle.min.js` en `main.jsx` el día 1 y probar el carrusel en TEC-03 |
| La presentación se pasa de 15 min | Media | Guion con tiempos y ensayo cronometrado el día 7 |
| Alguien no sabe explicar el código de otro | Alta | Las revisiones de PR obligan a leer el código ajeno; repaso cruzado el día 7 |
