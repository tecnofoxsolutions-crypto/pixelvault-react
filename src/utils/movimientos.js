// Convierte un cambio en db.js en un movimiento legible para el historial (CF-14).
// describirMovimiento('productos', 'editar', antes, despues) → { categoria, accion, detalle } o null si no se registra.
import { formatoCLP } from './formatoCLP.js'

export const CATEGORIAS_MOVIMIENTO = ['Sesión', 'Órdenes', 'Productos', 'Categorías', 'Usuarios', 'Blog', 'Contacto', 'Sistema']

const categoriaPorColeccion = {
  productos: 'Productos',
  categorias: 'Categorías',
  usuarios: 'Usuarios',
  ordenes: 'Órdenes',
  blog: 'Blog',
  contactos: 'Contacto',
}

// Nombres legibles de los campos que cambiaron (la contraseña nunca se muestra)
const nombresCampos = {
  nombre: 'nombre', apellidos: 'apellidos', precio: 'precio', precioOferta: 'precio oferta', stock: 'stock',
  stockCritico: 'stock crítico', descripcion: 'descripción', imagen: 'imagen', categoriaId: 'categoría',
  plataforma: 'plataforma', activo: 'visibilidad', destacado: 'destacado', codigo: 'código', correo: 'correo',
  rut: 'RUT', clave: 'contraseña', region: 'región', comuna: 'comuna', direccion: 'dirección', titulo: 'título',
  resumen: 'resumen', cuerpo: 'contenido', autor: 'autor', categoria: 'categoría',
}

function camposCambiados(antes, despues) {
  return Object.keys(despues)
    .filter((campo) => campo !== 'id' && JSON.stringify(antes?.[campo]) !== JSON.stringify(despues[campo]))
    .map((campo) => nombresCampos[campo] ?? campo)
}

const verbo = { crear: 'creado', editar: 'editado', eliminar: 'eliminado' }

export function describirMovimiento(coleccion, tipo, antes, despues) {
  const categoria = categoriaPorColeccion[coleccion]
  if (!categoria) return null
  const item = despues ?? antes

  switch (coleccion) {
    case 'productos': {
      if (tipo === 'editar') {
        const cambios = camposCambiados(antes, despues)
        if (cambios.length === 0) return null
        if (cambios.length === 1 && cambios[0] === 'stock') {
          return { categoria, accion: 'Stock actualizado', detalle: `"${item.nombre}": ${antes.stock} → ${despues.stock} unidades` }
        }
        return { categoria, accion: 'Producto editado', detalle: `"${item.nombre}" (${item.codigo}). Cambió: ${cambios.join(', ')}` }
      }
      return { categoria, accion: `Producto ${verbo[tipo]}`, detalle: `"${item.nombre}" (${item.codigo})` }
    }

    case 'ordenes': {
      if (tipo === 'crear') {
        return { categoria, accion: 'Nueva compra', detalle: `${item.numero} de ${item.cliente.nombre} ${item.cliente.apellidos} por ${formatoCLP(item.total)}` }
      }
      if (tipo === 'editar' && antes.estado !== despues.estado) {
        return { categoria, accion: 'Cambio de estado', detalle: `${item.numero}: ${antes.estado} → ${despues.estado}` }
      }
      return tipo === 'eliminar' ? { categoria, accion: 'Orden eliminada', detalle: item.numero } : null
    }

    case 'usuarios': {
      const quien = `${item.nombre} ${item.apellidos}`
      if (tipo === 'editar') {
        if (antes.rol !== despues.rol) return { categoria, accion: 'Cambio de rol', detalle: `${quien}: ${antes.rol} → ${despues.rol}` }
        if (antes.activo !== despues.activo) {
          return { categoria, accion: despues.activo ? 'Cuenta activada' : 'Cuenta desactivada', detalle: quien }
        }
        const cambios = camposCambiados(antes, despues)
        return cambios.length ? { categoria, accion: 'Usuario editado', detalle: `${quien}. Cambió: ${cambios.join(', ')}` } : null
      }
      return { categoria, accion: `Usuario ${verbo[tipo]}`, detalle: `${quien} (${item.rol})` }
    }

    case 'blog':
      return { categoria, accion: { crear: 'Artículo publicado', editar: 'Artículo editado', eliminar: 'Artículo eliminado' }[tipo], detalle: `"${item.titulo}"` }

    case 'categorias':
      return { categoria, accion: { crear: 'Categoría creada', editar: 'Categoría editada', eliminar: 'Categoría eliminada' }[tipo], detalle: item.nombre }

    case 'contactos':
      // Al crear el mensaje se le asigna el ticket con un update: ese segundo paso no se registra
      return tipo === 'crear' ? { categoria, accion: 'Nuevo mensaje de contacto', detalle: `${item.nombre} (${item.correo})` } : null

    default:
      return null
  }
}
