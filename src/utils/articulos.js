// Ayudas para los artículos del blog (CF-13).
// El contenido se escribe como texto plano (párrafos separados por una línea en blanco)
// y se guarda como HTML, que es lo que muestra la página del blog.

// Evita que el texto del editor se interprete como HTML (por seguridad, porque el blog usa dangerouslySetInnerHTML)
function escaparHtml(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// 'Párrafo uno\n\nPárrafo dos' → '<p>Párrafo uno</p><p>Párrafo dos</p>'
export function textoAHtml(texto) {
  return texto
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean)
    .map((parrafo) => `<p>${escaparHtml(parrafo).replace(/\n/g, '<br>')}</p>`)
    .join('\n')
}

// Al editar, el HTML guardado se vuelve a mostrar como texto con párrafos
export function htmlATexto(html = '') {
  const temporal = document.createElement('div')
  temporal.innerHTML = html.replace(/<\/(p|h\d|li)>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n')
  return temporal.textContent.replace(/\n{3,}/g, '\n\n').trim()
}

// 'La Resistencia del Disco' → 'la-resistencia-del-disco'
export function crearSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// 200 palabras por minuto, como mínimo 1
export function tiempoLectura(texto) {
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(palabras / 200))} min de lectura`
}

// Fecha como la usa el blog: '10 de noviembre, 2026'
export function fechaArticulo(fecha = new Date()) {
  const dia = fecha.getDate()
  const mes = fecha.toLocaleString('es-CL', { month: 'long' })
  return `${dia} de ${mes}, ${fecha.getFullYear()}`
}
