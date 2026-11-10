// Datos iniciales de la tienda. Se copian a localStorage la primera vez (ver db.js).
// Productos y usuarios vienen de la Evaluación 1; se agregaron categorías, precioOferta y órdenes de ejemplo.
import blogSeed from './blogSeed.js'

// Imágenes propias de PixelVault para cada categoría (pixel art con la identidad de la tienda)
const categorias = [
  { id: 1, nombre: 'RPG', imagen: '/img/categorias/rpg.jpg' },
  { id: 2, nombre: 'Acción y Aventura', imagen: '/img/categorias/accion-aventura.jpg' },
  { id: 3, nombre: 'Terror', imagen: '/img/categorias/terror.jpg' },
  { id: 4, nombre: 'Shooter', imagen: '/img/categorias/shooter.jpg' },
  { id: 5, nombre: 'Plataformas', imagen: '/img/categorias/plataformas.jpg' },
  { id: 6, nombre: 'Arcade y Peleas', imagen: '/img/categorias/arcade-peleas.jpg' },
]

const productos = [
  { id: 1, codigo: 'PS5-0001', nombre: 'The Witcher 3: Wild Hunt - Complete Edition', categoriaId: 1, plataforma: 'PlayStation 5', precio: 34990, precioOferta: null, stock: 5, stockCritico: 2, descripcion: 'Edición física completa con juego base, Hearts of Stone y Blood and Wine.', imagen: '/img/witcher3.jpg', activo: true, destacado: true },
  { id: 2, codigo: 'PC-0001', nombre: 'Cyberpunk 2077: Ultimate Edition (Caja Física)', categoriaId: 2, plataforma: 'PC', precio: 39990, precioOferta: 29990, stock: 8, stockCritico: 3, descripcion: 'Edición física coleccionista con mapa, postales y expansión Phantom Liberty.', imagen: '/img/cyberpunk2077.jpg', activo: true, destacado: false },
  { id: 3, codigo: 'NSW-0001', nombre: 'The Legend of Zelda: Tears of the Kingdom', categoriaId: 2, plataforma: 'Nintendo Switch', precio: 49990, precioOferta: null, stock: 2, stockCritico: 2, descripcion: 'Cartucho físico original. Una aventura épica por la tierra y los cielos de Hyrule.', imagen: '/img/zelda_totk.jpg', activo: true, destacado: true },
  { id: 4, codigo: 'XSX-0001', nombre: 'Elden Ring - Shadow of the Erdtree Edition', categoriaId: 1, plataforma: 'Xbox Series X', precio: 44990, precioOferta: null, stock: 4, stockCritico: 2, descripcion: 'Disco físico con la obra maestra de FromSoftware y la expansión.', imagen: '/img/eldenring.jpg', activo: true, destacado: false },
  { id: 5, codigo: 'PS5-0002', nombre: 'Resident Evil 4 Remake - Steelbook Edition', categoriaId: 3, plataforma: 'PlayStation 5', precio: 42990, precioOferta: null, stock: 3, stockCritico: 2, descripcion: 'Caja metálica coleccionable. La reimaginación del clásico de supervivencia.', imagen: '/img/re4remake.jpg', activo: true, destacado: true },
  { id: 6, codigo: 'XSX-0002', nombre: 'Halo Infinite - Edición Limitada Física', categoriaId: 4, plataforma: 'Xbox Series X', precio: 29990, precioOferta: null, stock: 0, stockCritico: 2, descripcion: 'Campaña del Jefe Maestro con estuche coleccionable.', imagen: '/img/haloinfinite.jpg', activo: true, destacado: false },
  { id: 7, codigo: 'NSW-0002', nombre: 'Super Mario Bros. Wonder', categoriaId: 5, plataforma: 'Nintendo Switch', precio: 45990, precioOferta: 39990, stock: 12, stockCritico: 3, descripcion: 'Cartucho físico oficial Nintendo con efectos maravilla.', imagen: '/img/mariowonder.jpg', activo: true, destacado: true },
  { id: 8, codigo: 'PC-0002', nombre: 'Red Dead Redemption 2 - Special Box Edition', categoriaId: 2, plataforma: 'PC', precio: 36990, precioOferta: 24990, stock: 7, stockCritico: 2, descripcion: 'Caja de colección con mapa físico detallado y libro de arte.', imagen: '/img/rdr2.jpg', activo: true, destacado: false },
  { id: 9, codigo: 'PS5-0003', nombre: 'Street Fighter 6 - Arcade Deluxe Edition', categoriaId: 6, plataforma: 'PlayStation 5', precio: 41990, precioOferta: null, stock: 6, stockCritico: 2, descripcion: 'La cúspide del género de lucha arcade con steelbook coleccionable.', imagen: '/img/sf6.jpg', activo: true, destacado: true },
  { id: 10, codigo: 'NSW-0003', nombre: "TMNT: Shredder's Revenge - 16-Bit Retro Edition", categoriaId: 6, plataforma: 'Nintendo Switch', precio: 32990, precioOferta: null, stock: 9, stockCritico: 3, descripcion: 'Homenaje total a los salones arcade de los 90 en glorioso pixel-art.', imagen: '/img/tmnt.jpg', activo: true, destacado: false },
  { id: 11, codigo: 'XSX-0003', nombre: "Cuphead - Physical Collector's Edition", categoriaId: 6, plataforma: 'Xbox Series X', precio: 35990, precioOferta: null, stock: 4, stockCritico: 2, descripcion: 'Juego físico, DLC Delicious Last Course y arte interior exclusivo.', imagen: '/img/cuphead.jpg', activo: true, destacado: false },
  { id: 12, codigo: 'PC-0003', nombre: 'Metal Slug Tactics - Big Box Edition', categoriaId: 6, plataforma: 'PC', precio: 28990, precioOferta: 22990, stock: 5, stockCritico: 2, descripcion: 'Edición nostálgica en caja grande estilo PC clásico con pixel-art SNK.', imagen: '/img/metalslug.jpg', activo: true, destacado: false },
  { id: 13, codigo: 'NSW-0004', nombre: 'Metroid Prime Remastered - Cartucho Físico', categoriaId: 2, plataforma: 'Nintendo Switch', precio: 38990, precioOferta: null, stock: 3, stockCritico: 2, descripcion: 'Obra maestra remasterizada con carátula reversible.', imagen: '/img/metroidprime.jpg', activo: true, destacado: true },
  { id: 14, codigo: 'PS5-0004', nombre: 'Hollow Knight - Edición Coleccionista Física', categoriaId: 5, plataforma: 'PlayStation 5', precio: 29990, precioOferta: null, stock: 6, stockCritico: 2, descripcion: 'Caja física con mapa desplegable de Hallownest y expansiones.', imagen: '/img/hollowknight.jpg', activo: true, destacado: false },
  { id: 15, codigo: 'XSX-0004', nombre: 'Sonic Superstars - Retro Launch Edition', categoriaId: 5, plataforma: 'Xbox Series X', precio: 36990, precioOferta: null, stock: 8, stockCritico: 3, descripcion: 'Velocidad 2D clásica con carátula lenticular y póster.', imagen: '/img/sonicsuperstars.jpg', activo: true, destacado: false },
]

// Roles válidos: 'Administrador' | 'Operador' | 'Editor' | 'Repartidor' | 'Cliente'
const usuarios = [
  { id: 1, usuario: 'Jim', rut: '11111111-1', nombre: 'Jim', apellidos: 'Charles', correo: 'j.charles@duoc.cl', clave: 'admin', rol: 'Administrador', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Av. Libertador Bernardo O\'Higgins 1234', activo: true },
  { id: 2, usuario: 'Emanuel', rut: '22222222-2', nombre: 'Emanuel', apellidos: 'Reyes', correo: 'e.reyes@duoc.cl', clave: 'admin', rol: 'Administrador', region: 'Región Metropolitana de Santiago', comuna: 'Providencia', direccion: 'Av. Providencia 2020', activo: true },
  { id: 3, usuario: 'Maximiliano', rut: '33333333-3', nombre: 'Maximiliano', apellidos: 'Peral', correo: 'm.peral@duoc.cl', clave: 'admin', rol: 'Administrador', region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa', direccion: 'Irarrázaval 3030', activo: true },
  { id: 4, usuario: 'fernando', rut: '44444444-4', nombre: 'Fernando', apellidos: 'Sierra', correo: 'f.sierra@pixelvault.cl', clave: 'operador', rol: 'Operador', region: 'Región Metropolitana de Santiago', comuna: 'Maipú', direccion: 'Pajaritos 4040', activo: true },
  { id: 5, usuario: 'adriana', rut: '55555555-5', nombre: 'Adriana', apellidos: 'Quispe', correo: 'a.quispe@pixelvault.cl', clave: 'editor', rol: 'Editor', region: 'Región Metropolitana de Santiago', comuna: 'La Florida', direccion: 'Vicuña Mackenna 5050', activo: true },
  { id: 6, usuario: 'ilie', rut: '66666666-6', nombre: 'Ilie', apellidos: 'Flores', correo: 'i.flores@pixelvault.cl', clave: 'repartidor', rol: 'Repartidor', region: 'Región Metropolitana de Santiago', comuna: 'Puente Alto', direccion: 'Concha y Toro 6060', activo: true },
  { id: 7, usuario: 'francisco', rut: '77777777-7', nombre: 'Francisco', apellidos: 'Calabran', correo: 'f.calabran@gmail.com', clave: 'cliente', rol: 'Cliente', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', direccion: 'Los Crisantemos 777, depto 603', activo: true },
]

// Órdenes de ejemplo, una en cada punto del flujo de estados (CF-09 y CF-10):
// PV-000001 entregada, PV-000002 retiro en preparación, PV-000003 asignada a Ilie, PV-000004 despacho en preparación.
const clienteFrancisco = { nombre: 'Francisco', apellidos: 'Calabran', correo: 'f.calabran@gmail.com' }
const direccionFrancisco = { calle: 'Los Crisantemos 777', depto: '603', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', indicaciones: 'Dejar con el conserje.' }
const paso = (estado, fecha, usuarioId, usuarioNombre) => ({ estado, fecha, usuarioId, usuarioNombre })

const ordenes = [
  {
    id: 1,
    numero: 'PV-000001',
    fecha: '2026-10-28T15:20:00.000Z',
    usuarioId: 7,
    cliente: clienteFrancisco,
    direccion: direccionFrancisco,
    tipoEntrega: 'despacho',
    items: [
      { productoId: 7, nombre: 'Super Mario Bros. Wonder', precio: 39990, cantidad: 1, imagen: '/img/mariowonder.jpg' },
      { productoId: 9, nombre: 'Street Fighter 6 - Arcade Deluxe Edition', precio: 41990, cantidad: 1, imagen: '/img/sf6.jpg' },
    ],
    subtotal: 81980,
    despacho: 4000,
    total: 85980,
    estado: 'Entregada',
    repartidorId: 6,
    fotoEntrega: null,
    comentarioEntrega: 'Recibido por el conserje del edificio, el Sr. Pérez.',
    historialEstados: [
      paso('En preparación', '2026-10-28T15:20:00.000Z', 7, 'Francisco Calabran (compra)'),
      paso('Asignado a repartidor', '2026-10-28T18:00:00.000Z', 4, 'Fernando Sierra'),
      paso('En camino', '2026-10-29T13:10:00.000Z', 6, 'Ilie Flores'),
      paso('Entregada', '2026-10-29T15:45:00.000Z', 6, 'Ilie Flores'),
    ],
  },
  {
    id: 2,
    numero: 'PV-000002',
    fecha: '2026-11-05T19:45:00.000Z',
    usuarioId: 7,
    cliente: clienteFrancisco,
    direccion: { ...direccionFrancisco, indicaciones: '' },
    tipoEntrega: 'retiro',
    items: [
      { productoId: 1, nombre: 'The Witcher 3: Wild Hunt - Complete Edition', precio: 34990, cantidad: 2, imagen: '/img/witcher3.jpg' },
    ],
    subtotal: 69980,
    despacho: 0,
    total: 69980,
    estado: 'En preparación',
    repartidorId: null,
    fotoEntrega: null,
    historialEstados: [paso('En preparación', '2026-11-05T19:45:00.000Z', 7, 'Francisco Calabran (compra)')],
  },
  {
    id: 3,
    numero: 'PV-000003',
    fecha: '2026-11-08T14:30:00.000Z',
    usuarioId: 7,
    cliente: clienteFrancisco,
    direccion: direccionFrancisco,
    tipoEntrega: 'despacho',
    items: [
      { productoId: 3, nombre: 'The Legend of Zelda: Tears of the Kingdom', precio: 49990, cantidad: 1, imagen: '/img/zelda_totk.jpg' },
    ],
    subtotal: 49990,
    despacho: 4000,
    total: 53990,
    estado: 'Asignado a repartidor',
    repartidorId: 6,
    fotoEntrega: null,
    historialEstados: [
      paso('En preparación', '2026-11-08T14:30:00.000Z', 7, 'Francisco Calabran (compra)'),
      paso('Asignado a repartidor', '2026-11-09T12:00:00.000Z', 1, 'Jim Charles'),
    ],
  },
  {
    id: 4,
    numero: 'PV-000004',
    fecha: '2026-11-09T21:10:00.000Z',
    usuarioId: 7,
    cliente: clienteFrancisco,
    direccion: direccionFrancisco,
    tipoEntrega: 'despacho',
    items: [
      { productoId: 12, nombre: 'Metal Slug Tactics - Big Box Edition', precio: 22990, cantidad: 1, imagen: '/img/metalslug.jpg' },
      { productoId: 10, nombre: "TMNT: Shredder's Revenge - 16-Bit Retro Edition", precio: 32990, cantidad: 1, imagen: '/img/tmnt.jpg' },
    ],
    subtotal: 55980,
    despacho: 4000,
    total: 59980,
    estado: 'En preparación',
    repartidorId: null,
    fotoEntrega: null,
    historialEstados: [paso('En preparación', '2026-11-09T21:10:00.000Z', 7, 'Francisco Calabran (compra)')],
  },
]

// Bitácora de movimientos (CF-14). Se llena sola desde db.js; esta es la entrada inicial.
const movimientos = [
  {
    id: 1,
    fecha: '2026-10-28T12:00:00.000Z',
    usuarioId: null,
    usuarioNombre: 'Sistema',
    rol: 'Sistema',
    categoria: 'Sistema',
    accion: 'Inicialización',
    detalle: 'Se cargaron los datos iniciales: productos, categorías, usuarios, órdenes y blog.',
  },
]

const seed = {
  productos,
  categorias,
  usuarios,
  ordenes,
  blog: blogSeed,
  contactos: [],
  movimientos,
}

export default seed
