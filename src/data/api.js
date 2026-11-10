// Cliente de la API REST de PixelVault (json-server, ver "npm run api").
// Cada colección es un recurso REST: GET /productos, GET /productos/3, POST /productos, PUT /productos/3, DELETE /productos/3
//
// La URL se puede cambiar con la variable VITE_API_URL (archivo .env); por defecto, http://localhost:3001
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function pedir(metodo, ruta, cuerpo) {
  const respuesta = await fetch(`${API_URL}/${ruta}`, {
    method: metodo,
    headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  if (!respuesta.ok) throw new Error(`${metodo} /${ruta} respondió ${respuesta.status}`)
  return respuesta.status === 204 ? null : respuesta.json()
}

export const api = {
  listar: (coleccion) => pedir('GET', coleccion),
  obtener: (coleccion, id) => pedir('GET', `${coleccion}/${id}`),
  crear: (coleccion, objeto) => pedir('POST', coleccion, objeto),
  reemplazar: (coleccion, id, objeto) => pedir('PUT', `${coleccion}/${id}`, objeto),
  eliminar: (coleccion, id) => pedir('DELETE', `${coleccion}/${id}`),
}
