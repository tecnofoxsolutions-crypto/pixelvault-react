// Artículos del blog migrados desde blog.html (Evaluación 1).
// El campo 'cuerpo' es HTML: se muestra con dangerouslySetInnerHTML.
const blogSeed = [
      {
        id: 1,
        slug: "resistencia-disco-cartucho",
        categoria: "preservacion",
        nombreCategoria: "Preservación Retro",
        badgeColor: "text-bg-success",
        titulo: "La Resistencia del Disco y el Cartucho: Por qué el formato físico jamás morirá",
        autor: "Jim Charles",
        fecha: "18 de Septiembre, 2026",
        tiempoLectura: "5 min de lectura",
        imagen: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&q=80",
        resumen: "Frente a las licencias digitales efímeras y los cierres de tiendas virtuales, el medio físico garantiza que el jugador sea el auténtico dueño de su software.",
        cuerpo: `
          <p class="lead text-light">En una era donde las tiendas digitales cierran servidores sin previo aviso y las compras virtuales son meras licencias revocables, el cartucho y el disco óptico cobran una trascendencia histórica ineludible.</p>
          <p>Tener la caja en tus manos, apreciar el arte de la carátula, examinar el mapa plegado o el manual impreso es una experiencia multisensorial irreemplazable. Los coleccionistas no compran simplemente datos binarios; adquieren un testimonio palpable de la cultura digital.</p>
          <h4 class="h5 text-info mt-4">La seguridad del juego sin conexión</h4>
          <p>Un cartucho de Nintendo Switch o un disco de PlayStation 5 sellado conserva la versión original del juego lista para ejecutarse en el hardware nativo, inmune a caídas de servidores, expiraciones de contratos de derechos de autor de bandas sonoras o cancelaciones de cuentas en plataformas comerciales.</p>
          <p>En PixelVault reivindicamos este principio: preservar el formato físico es defender la memoria artística del videojuego.</p>
        `
      },
      {
        id: 2,
        slug: "guia-conservacion-cajas-steelbooks",
        categoria: "coleccionismo",
        nombreCategoria: "Guías de Colección",
        badgeColor: "text-bg-warning text-dark",
        titulo: "Guía Definitiva para Conservar Cajas y Steelbooks sin Pérdida de Valor",
        autor: "Emanuel Reyes",
        fecha: "14 de Septiembre, 2026",
        tiempoLectura: "4 min de lectura",
        imagen: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=80",
        resumen: "Aprende a proteger tus cajas plásticas, fundas de cartón y steelbooks metálicos contra el sol, la humedad y el desgaste con fundas PET especiales.",
        cuerpo: `
          <p class="lead text-light">Cualquier coleccionista experimentado sabe que el estado cosmético de una edición física determina hasta el 80% de su valor comercial en el tiempo.</p>
          <p>Los tres peores enemigos del coleccionista físico son:</p>
          <ul class="text-secondary">
            <li><strong class="text-light">Rayos UV directos:</strong> Decoloran rápidamente los lomos de las cajas plásticas (especialmente tonos rojos y azules de Nintendo y PlayStation).</li>
            <li><strong class="text-light">Humedad relativa superior al 60%:</strong> Oxida los bordes de los steelbooks metálicos y genera ondulaciones en las carátulas de papel.</li>
            <li><strong class="text-light">Micro-rayones por fricción:</strong> Ocurren al apilar cajas una sobre otra sin separadores protectores.</li>
          </ul>
          <h4 class="h5 text-warning mt-4">Recomendación de bodega PixelVault</h4>
          <p>Utiliza protectores de plástico PET libre de ácido (grosor de 0.35mm o 0.50mm) para tus cajas de mayor valor y mantén tu colección en estanterías ventiladas lejos del calor directo.</p>
        `
      },
      {
        id: 3,
        slug: "top-juegos-fisicos-switch-chile",
        categoria: "analisis",
        nombreCategoria: "Análisis de Ediciones",
        badgeColor: "text-bg-info",
        titulo: "Los 5 Títulos Físicos más Buscados de Nintendo Switch en Chile este 2026",
        autor: "Maximiliano Peral",
        fecha: "10 de Septiembre, 2026",
        tiempoLectura: "6 min de lectura",
        imagen: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=700&q=80",
        resumen: "Analizamos las cifras de ventas y demanda de bodega en territorio nacional: Zelda, Metroid, Pokémon y las joyas indie con tiraje físico limitado.",
        cuerpo: `
          <p class="lead text-light">Nintendo Switch se ha consolidado como el paraíso del coleccionista moderno gracias al encanto universal de sus cartuchos pequeños y carátulas uniformes.</p>
          <p>En el mercado chileno, ciertos títulos han alcanzado estatus de piezas de culto debido a su baja disponibilidad en tiendas de retail masivo:</p>
          <ol class="text-secondary">
            <li><strong class="text-light">The Legend of Zelda: Tears of the Kingdom:</strong> Obra cumbre de la consola, con altísima rotación en formato físico.</li>
            <li><strong class="text-light">Metroid Dread:</strong> Edición física emblemática con portada holográfica que no pierde vigencia.</li>
            <li><strong class="text-light">Super Mario RPG (Remake):</strong> La reinterpretación física de un clásico de 16-bit que agotó su primer lote en horas.</li>
            <li><strong class="text-light">Hollow Knight (Fangamer Edition):</strong> Incluye manual a todo color y mapa de Hallownest.</li>
            <li><strong class="text-light">Celeste (Edición Coleccionista):</strong> Joya de plataformas con tirada física reducida.</li>
          </ol>
        `
      },
      {
        id: 4,
        slug: "playstation-5-lector-extraible",
        categoria: "mercado",
        nombreCategoria: "Noticias & Mercado",
        badgeColor: "text-bg-primary",
        titulo: "PlayStation 5 y el Dilema del Lector Extraíble: Impacto en el Coleccionismo",
        autor: "Jim Charles",
        fecha: "05 de Septiembre, 2026",
        tiempoLectura: "5 min de lectura",
        imagen: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=700&q=80",
        resumen: "Examinamos las implicancias de hardware para los compradores de discos Blu-Ray Ultra HD y cómo la comunidad garantiza la preservación física.",
        cuerpo: `
          <p class="lead text-light">El rediseño de PlayStation 5 con unidad de disco desacoplable abrió un debate fundamental sobre la longevidad y el emparejamiento digital de periféricos.</p>
          <p>A pesar de las tendencias de la industria hacia suscripciones y modelos de arriendo en la nube, el jugador tradicional continúa exigiendo discos con el instalador completo incluido. Estudios recientes demuestran que más del 65% de los jugadores en Latinoamérica prefieren adquirir sus aventuras principales en formato físico para reventa, intercambio o preservación en vitrina.</p>
        `
      },
      {
        id: 5,
        slug: "secretos-manuales-impresos-16bit",
        categoria: "preservacion",
        nombreCategoria: "Preservación Retro",
        badgeColor: "text-bg-success",
        titulo: "Secretos Ocultos en los Manuales Impresos de la Era 16-Bit (SNES y Genesis)",
        autor: "Emanuel Reyes",
        fecha: "28 de Agosto, 2026",
        tiempoLectura: "7 min de lectura",
        imagen: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80",
        resumen: "Un homenaje a aquellos libretos a todo color con ilustraciones exclusivas, notas de los desarrolladores e historias de trasfondo que se perdieron en la era digital.",
        cuerpo: `
          <p class="lead text-light">Hubo un tiempo donde el viaje de regreso a casa tras comprar un videojuego era tan emocionante como encender la consola: era el momento de leer el manual.</p>
          <p>Durante los años dorados de Super Nintendo y Sega Genesis, los manuales no eran meros panfletos legales. Contenían biografías profundas de personajes, consejos estratégicos firmados por los diseñadores, arte conceptual no visto en pantalla y páginas dedicadas para anotar contraseñas (*passwords*).</p>
          <p>En PixelVault mantenemos encendida esa llama retro ofreciendo ediciones contemporáneas que rinden tributo a esa magia tangible.</p>
        `
      },
      {
        id: 6,
        slug: "guia-autenticacion-cartuchos-sellos",
        categoria: "coleccionismo",
        nombreCategoria: "Guías de Colección",
        badgeColor: "text-bg-warning text-dark",
        titulo: "Guía de Autenticación de Cartuchos y Sellos Holográficos Originales",
        autor: "Maximiliano Peral",
        fecha: "20 de Agosto, 2026",
        tiempoLectura: "6 min de lectura",
        imagen: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=700&q=80",
        resumen: "Aprende a identificar copias repro y reproducciones no oficiales frente a cartuchos originales inspeccionando la placa madre, tornillos gamebit y serigrafía.",
        cuerpo: `
          <p class="lead text-light">Con el aumento del coleccionismo, el mercado se ha inundado de reproducciones no autorizadas. Te enseñamos los puntos de control clave antes de invertir en una pieza histórica.</p>
          <p>Puntos de chequeo obligatorios:</p>
          <ul class="text-secondary">
            <li><strong class="text-light">Tornillos de seguridad:</strong> Los cartuchos genuinos utilizan tornillos Gamebit propietarios, no tornillos de cruz ni remaches plásticos.</li>
            <li><strong class="text-light">Sello dorado de calidad:</strong> El sello de Nintendo posee un brillo metalizado nítido; las repro suelen tener sellos pixelados o con tipografía desalineada.</li>
            <li><strong class="text-light">Estampado en bajorrelieve:</strong> En la etiqueta posterior, los cartuchos auténticos tienen un código de dos dígitos troquelado en la pegatina.</li>
          </ul>
        `
      }
]

export default blogSeed
