// DUEÑO: Maximiliano (HU-33). Ficha de un juego en /productos/:id con selector de cantidad y relacionados.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import db from '../../data/db.js'
import { useCart } from '../../context/CartContext.jsx'
import AlertMessage from '../../components/common/AlertMessage.jsx'
import PriceTag from '../../components/productos/PriceTag.jsx'
import PlataformaBadge from '../../components/productos/PlataformaBadge.jsx'
import ProductList from '../../components/productos/ProductList.jsx'
import SelectorCantidad from '../../components/productos/SelectorCantidad.jsx'

export default function ProductoDetalle() {
  const { id } = useParams()
  const { agregar } = useCart()
  const [cantidad, setCantidad] = useState(1)
  const [aviso, setAviso] = useState(null)

  // Al pasar de un producto a otro (por ejemplo desde los relacionados) se reinicia la cantidad y el aviso
  useEffect(() => {
    setCantidad(1)
    setAviso(null)
    window.scrollTo(0, 0)
  }, [id])

  const producto = db.getById('productos', id)

  if (!producto || !producto.activo) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 text-light">Producto no encontrado</h1>
        <p className="text-secondary">El juego que buscas no existe o ya no está disponible.</p>
        <Link className="btn btn-outline-info" to="/productos">Volver al catálogo</Link>
      </div>
    )
  }

  const categoria = db.getById('categorias', producto.categoriaId)
  const agotado = producto.stock <= 0
  const relacionados = db
    .getAll('productos')
    .filter((p) => p.activo && p.categoriaId === producto.categoriaId && p.id !== producto.id)
    .slice(0, 4)

  function mostrarResultado(respuesta, unidades, nombre) {
    setAviso({
      tipo: respuesta.ok ? 'success' : 'danger',
      mensaje: respuesta.ok ? `Agregaste ${unidades} × ${nombre} al carrito` : respuesta.mensaje,
    })
  }

  function agregarAlCarrito() {
    mostrarResultado(agregar(producto, cantidad), cantidad, producto.nombre)
  }

  function agregarRelacionado(otro) {
    mostrarResultado(agregar(otro, 1), 1, otro.nombre)
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          {categoria && (
            <li className="breadcrumb-item"><Link to={`/categorias/${categoria.id}`}>{categoria.nombre}</Link></li>
          )}
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-md-5 text-center">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded border border-secondary imagen-detalle" />
        </div>

        <div className="col-12 col-md-7">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <PlataformaBadge plataforma={producto.plataforma} />
            {categoria && <span className="badge bg-secondary">{categoria.nombre}</span>}
          </div>
          <h1 className="h2 text-light">{producto.nombre}</h1>
          <p className="text-secondary small">Código: {producto.codigo}</p>
          <PriceTag producto={producto} grande />
          <p className="mt-3">{producto.descripcion}</p>
          <p className={agotado ? 'text-danger fw-bold' : 'text-success'}>
            {agotado ? 'Agotado' : `Stock disponible: ${producto.stock} unidades`}
          </p>

          {aviso && <AlertMessage tipo={aviso.tipo} mensaje={aviso.mensaje} onCerrar={() => setAviso(null)} />}

          {!agotado && (
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <SelectorCantidad cantidad={cantidad} maximo={producto.stock} onCambiar={setCantidad} />
              <button type="button" className="btn btn-success" onClick={agregarAlCarrito}>
                Añadir al carrito
              </button>
              <Link className="btn btn-outline-light" to="/carrito">Ir al carrito</Link>
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-5">
          <h2 className="h4 text-light mb-3">También te puede gustar</h2>
          <ProductList productos={relacionados} onAgregar={agregarRelacionado} />
        </section>
      )}
    </div>
  )
}
