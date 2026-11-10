// Convierte una imagen elegida en un <input type="file"> a texto base64 (data URL) más liviano,
// para poder guardarla en localStorage (que tiene poco espacio). La achica a maxLado píxeles y la pasa a JPEG.
export function comprimirImagen(archivo, maxLado = 800, calidad = 0.75) {
  return new Promise((resolver, rechazar) => {
    if (!archivo || !archivo.type.startsWith('image/')) {
      rechazar(new Error('El archivo debe ser una imagen'))
      return
    }
    const lector = new FileReader()
    lector.onerror = () => rechazar(new Error('No se pudo leer la imagen'))
    lector.onload = () => {
      const img = new Image()
      img.onerror = () => rechazar(new Error('La imagen está dañada'))
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height))
        const lienzo = document.createElement('canvas')
        lienzo.width = Math.round(img.width * escala)
        lienzo.height = Math.round(img.height * escala)
        lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height)
        resolver(lienzo.toDataURL('image/jpeg', calidad))
      }
      img.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })
}
