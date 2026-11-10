// Crea (o reinicia) db.json, la "base de datos" que sirve json-server, a partir de los datos semilla.
// Uso: npm run db:reset   (borra todo lo que se haya creado y deja los datos iniciales)
import { writeFileSync } from 'node:fs'
import seed from '../src/data/seed.js'

const datos = { ...seed, movimientos: seed.movimientos ?? [] }
writeFileSync(new URL('../db.json', import.meta.url), JSON.stringify(datos, null, 2))
console.log('db.json listo con:', Object.entries(datos).map(([c, d]) => `${c} (${d.length})`).join(', '))
