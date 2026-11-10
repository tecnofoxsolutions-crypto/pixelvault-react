import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/estilos.css'

import App from './App.jsx'
import { inicializar } from './data/db.js'
import { API_URL } from './data/api.js'

const raiz = ReactDOM.createRoot(document.getElementById('root'))

// Mensaje mientras se cargan los datos, o si la API (json-server) no está encendida
function Aviso({ titulo, children }) {
  return (
    <div className="container py-5 text-center">
      <h1 className="h4 text-light">{titulo}</h1>
      {children}
    </div>
  )
}

raiz.render(<Aviso titulo="Cargando PixelVault…" />)

// Primero se piden los datos a la API y recién entonces se muestra la tienda
inicializar()
  .then(() => {
    raiz.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    )
  })
  .catch((error) => {
    console.error(error)
    raiz.render(
      <Aviso titulo="No se pudo conectar con la API">
        <p className="text-secondary">
          PixelVault lee sus datos desde json-server en <code>{API_URL}</code>. Enciéndelo en otra terminal y recarga:
        </p>
        <pre className="d-inline-block bg-dark text-info p-3 rounded">npm run api</pre>
      </Aviso>
    )
  })
