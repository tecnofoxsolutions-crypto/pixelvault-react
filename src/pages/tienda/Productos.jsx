// DUEÑO: Maximiliano (HU-32). Catálogo con búsqueda (?q=texto) y filtros por plataforma, categoría y precio.
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import db from '../../data/db.js'
import { useCart } from '../../context/CartContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import ProductList from '../../components/productos/ProductList.jsx'
import ProductFilters, { rangosPrecio } from '../../components/productos/ProductFilters.jsx'
import EmptyState from '../../components/productos/EmptyState.jsx'
import { precioFinal } from '../../components/productos/precios.js'

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
      precio >= rango.min &&
      precio <= rango.max
    )
  })
}

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const textoUrl = searchParams.get('q') ?? ''
  const [filtros, setFiltros] = useState({ ...filtrosVacios, texto: textoUrl })
  const [aviso, setAviso] = useState(null)
  const { agregar } = useCart()

  // Si se busca desde la barra estando ya en /productos, se actualiza el filtro de texto
  useEffect(() => {
    setFiltros((actuales) => ({ ...actuales, texto: textoUrl }))
  }, [textoUrl])

  const productos = db.getAll('productos').filter((p) => p.activo)
  const categorias = db.getAll('categorias')
  const resultado = filtrarProductos(productos, filtros)

  function limpiarFiltros() {
    setFiltros(filtrosVacios)
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
      <h1 className="h2 font-arcade text-light mb-1">Catálogo</h1>
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
