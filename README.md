# PixelVault React

Tienda de videojuegos físicos hecha en React. Evaluación Parcial 2 de **DSY1104 Desarrollo Fullstack II**, Duoc UC.

**Equipo:** Jim Charles · Emanuel Reyes · Maximiliano Peral

## Ejecutar

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Tecnologías

- React 18 + Vite 5
- React Router 6
- Bootstrap 5.3.3 (diseño responsivo)
- `localStorage` como base de datos simulada (`src/data/db.js`, con funciones CRUD)

## Estructura

```text
src/
├── data/          # db.js (CRUD), seed.js (datos iniciales), regiones.js
├── context/       # AuthContext (sesión) y CartContext (carrito)
├── routes/        # AppRouter y ProtectedRoute
├── components/    # layout, common, productos, carrito, compra, admin
├── pages/
│   ├── tienda/    # vistas públicas
│   └── admin/     # panel de administración
├── utils/         # formatoCLP, validaciones
└── styles/        # estilos.css (tema Steam + 16-bit)
```

## Usuarios de prueba

| Usuario | Clave | Rol |
|---|---|---|
| Jim | `admin` | Administrador |
| francisco | `cliente` | Cliente |

## Documentación

- [Guía para el equipo y agentes](AGENTS.md)
- [Plan de desarrollo](docs/plan.md)
- [Backlog](docs/backlog.md)
- [Ficha técnica](docs/ficha-tecnica.md)
- [Tablero Trello](https://trello.com/b/b9v2jK3p/pixel-vault)
