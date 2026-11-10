// Imagen recortada a su contenedor que muestra la parte elegida en el editor de productos.
// La usan la tarjeta de la tienda (ProductCard) y la vista previa del editor (EditorEncuadre),
// así lo que se ve al editar es exactamente lo que se ve en la tienda.
// Props: src, alt, encuadre { x, y, zoom } (x e y en % de 0 a 100; zoom de 1 a 2.5), className
export const ENCUADRE_POR_DEFECTO = { x: 50, y: 50, zoom: 1 }

export default function ImagenEncuadrada({ src, alt, encuadre, className = '', ...resto }) {
  const { x, y, zoom } = { ...ENCUADRE_POR_DEFECTO, ...encuadre }
  return (
    <div className={`imagen-encuadrada ${className}`} {...resto}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          // object-position elige qué parte de la imagen queda visible; el zoom acerca desde ese mismo punto
          objectPosition: `${x}% ${y}%`,
          transform: `scale(${zoom})`,
          transformOrigin: `${x}% ${y}%`,
        }}
      />
    </div>
  )
}
