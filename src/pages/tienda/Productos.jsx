// Catálogo con búsqueda (?q=texto) y filtros por plataforma, categoría y precio.
// Creado por Maximiliano (HU-32). Desde CF-05 se reutiliza en /categorias/:id y /ofertas:
// esas páginas renderizan este mismo componente con otro título y un filtro ya aplicado.
// Props (todas opcionales):
//   titulo, descripcion → encabezado de la página
//   filtroInicial       → filtros con que parte, ej. { categoriaId: '2' } o { precio: 'ofertas' }
//   migas               → breadcrumb a mostrar arriba del título
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import db from '../../data/db.js'
import { useCart } from '../../context/CartContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import ProductList from '../../components/productos/ProductList.jsx'
import ProductFilters, { rangosPrecio } from '../../components/productos/ProductFilters.jsx'
import EmptyState from '../../components/productos/EmptyState.jsx'
import { estaEnOferta, precioFinal } from '../../components/productos/precios.js'

const filtrosVacios = { texto: '', plataforma: '', categoriaId: '', precio: '' }

// Devuelve solo los productos que cumplen todos los filtros
function filtrarProductos(productos, filtros) {
  const texto = filtros.texto.trim().toLowerCase()
  const rango = rangosPrecio.find((r) => r.valor === filtros.precio) ?? rangosPrecio[0]

  return productos.filter((p) => {
    const precio = precioFinal(p)
    return (
      p.nombre.toLowerCase().includes(texto) &&
      (filtros.plataforma === '' || p.plataforma === filtros.plataforma) &&
      (filtros.categoriaId === '' || String(p.categoriaId) === filtros.categoriaId) &&
      (!rango.soloOfertas || estaEnOferta(p)) &&
      precio >= rango.min &&
      precio <= rango.max
    )
  })
}

export default function Productos({ titulo = 'Catálogo', descripcion, filtroInicial = {}, migas }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const textoUrl = searchParams.get('q') ?? ''
  const filtrosDePartida = { ...filtrosVacios, ...filtroInicial }
  const [filtros, setFiltros] = useState({ ...filtrosDePartida, texto: textoUrl })
  const [aviso, setAviso] = useState(null)
  const { agregar } = useCart()

  // Si se busca desde la barra estando ya en esta página, se actualiza el filtro de texto
  useEffect(() => {
    setFiltros((actuales) => ({ ...actuales, texto: textoUrl }))
  }, [textoUrl])

  const productos = db.getAll('productos').filter((p) => p.activo)
  const categorias = db.getAll('categorias')
  const resultado = filtrarProductos(productos, filtros)

  // Limpiar vuelve a los filtros con que partió la página (en /ofertas sigue mostrando ofertas)
  function limpiarFiltros() {
    setFiltros(filtrosDePartida)
    setSearchParams({})
  }

  function agregarAlCarrito(producto) {
    const respuesta = agregar(producto, 1)
    setAviso({
      tipo: respuesta.ok ? 'success' : 'danger',
      mensaje: respuesta.ok ? `${producto.nombre} se agregó al carrito` : respuesta.mensaje,
    })
  }

  return (
    <div className="container py-4">
      {migas}
      <h1 className="h2 font-arcade text-light mb-1">{titulo}</h1>
      {descripcion && <p className="text-secondary mb-1">{descripcion}</p>}
      <p className="text-secondary">
        {resultado.length} de {productos.length} juegos
        {filtros.texto && <> · búsqueda: <strong className="text-info">"{filtros.texto}"</strong></>}
      </p>

      <ProductFilters filtros={filtros} categorias={categorias} onCambiar={setFiltros} onLimpiar={limpiarFiltros} />

      {aviso && <AlertMessage tipo={aviso.tipo} mensaje={aviso.mensaje} onCerrar={() => setAviso(null)} />}

      {resultado.length > 0 ? (
        <ProductList productos={resultado} onAgregar={agregarAlCarrito} />
      ) : (
        <EmptyState
          mensaje="No encontramos juegos con esos filtros"
          textoBoton="Limpiar filtros"
          onAccion={limpiarFiltros}
        />
      )}
    </div>
  )
}
