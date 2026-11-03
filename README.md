# Web de Top1webs

Web de una página para Top1webs: animación del logotipo al abrir, portada, planes y precios (pago único), cómo trabajamos, calculadora de presupuesto, test «¿Qué web necesita?», portafolio, comparador antes/después, preguntas frecuentes, formulario de encargo y contacto con WhatsApp.

Es HTML, CSS y JavaScript sin dependencias: no hace falta instalar nada.

## Archivos

```
index.html              La web (textos de cada sección, con comentarios)
css/styles.css          Diseño (colores en las primeras líneas, en :root)
js/config.js            ← Precios, planes, extras, test, contacto y formulario
js/main.js              Funcionamiento (no hace falta tocarlo)
assets/img/             Logotipos, iconos, folleto, tarjetas y capturas
```

## Verla en su ordenador

Haga doble clic en `index.html`. Para que todo funcione igual que en internet, mejor con un servidor local:

```bash
python -m http.server 8000
```

Y abra http://localhost:8000 en el navegador.

## Qué cambiar y dónde

| Quiero cambiar…                                | Dónde                                                                 |
|------------------------------------------------|-----------------------------------------------------------------------|
| Teléfono, WhatsApp o email                     | `js/config.js` → `contacto` (se actualiza en toda la web)             |
| Precios y contenido de los planes              | `js/config.js` → `planes`                                             |
| Filas de la tabla comparativa                  | `js/config.js` → `comparativa`                                        |
| Precio por página, extras e idiomas            | `js/config.js` → `calculadora`                                        |
| Preguntas y resultados del test                | `js/config.js` → `test`                                               |
| Textos de las secciones y preguntas frecuentes | `index.html` (cada sección empieza con un comentario `<!-- ... -->`)  |
| Imágenes del comparador antes/después          | Sustituya `assets/img/comparador-antes.webp` y `comparador-despues.webp` (1280 × 800 px) |
| Añadir un trabajo al portafolio                | `index.html` → copie un bloque `<article class="work">`               |
| Colores                                        | `css/styles.css` → variables al principio (`--blue`, `--navy-800`…)   |

El número de WhatsApp (34691293667) y el mensaje inicial se han tomado del código QR de su folleto.

## Datos de ejemplo que debe revisar

Con `mostrarAvisosEditables: true` (en `js/config.js`) la web muestra etiquetas amarillas «✎» junto a todo lo que es una propuesta o un ejemplo:

- **Precios de Pro (450 €) y Premium (650 €)**: son propuestas. El único precio real es el base, 300 €.
- **Precios de la calculadora** (40 € por página, 30–80 € por extra, incluida la carta con QR, 60 € por idioma): propuestas.
- **¿IVA incluido?** Indíquelo en la nota bajo los planes.
- **Preguntas frecuentes**: redactadas con prudencia. Ajústelas a cómo trabaja.
- **Portafolio y comparador**: muestran la web de Bar La Tasca. En el comparador, la web «antes» es una recreación genérica de una web anticuada (así se indica en la web).

Ahora está en `false` (versión publicada). Póngalo en `true` para volver a ver las etiquetas al revisar.

## Conectar el formulario

Sin servicio de envío configurado, el formulario comprueba los datos y luego ofrece mandar la solicitud por WhatsApp o por email con un clic. Para recibirla directamente en su correo:

1. Cree una cuenta gratuita en [Formspree](https://formspree.io) y un formulario nuevo.
2. Copie la dirección que le dan (algo como `https://formspree.io/f/abcdwxyz`).
3. Péguela en `js/config.js` → `formulario.endpoint`.

Al hacerlo, las solicitudes le llegan directamente. Otros servicios que aceptan JSON también funcionan; si piden una clave, añádala en `camposExtra`.

## Antes de publicar

- En `index.html`, cambie la ruta de `og:image` por la dirección completa de su web (sirve para la vista previa al compartir el enlace).
- En España, una web de empresa debe incluir **aviso legal** y **política de privacidad**. Añádalos (por ejemplo, como páginas enlazadas en el pie) y enlace la política desde la casilla de consentimiento del formulario.
- Opcional: la tipografía Manrope se carga desde Google Fonts. Si prefiere no depender de servicios externos, descárguela y sírvala desde su propio alojamiento.

## Publicar

Es una web estática: vale cualquier alojamiento. Lo más rápido es arrastrar esta carpeta a [Netlify Drop](https://app.netlify.com/drop). También funciona con GitHub Pages, Cloudflare Pages o el alojamiento de su dominio (subiendo los archivos por FTP).

## Animación del logotipo

Al abrir la web se dibuja la estrella y aparece «Top1webs» (unos 3 segundos). Se muestra una vez por visita, se puede saltar con un clic o una tecla y no aparece si el dispositivo tiene activado «reducir movimiento». Está en `css/styles.css` (bloque «Animación del logotipo») y en el pequeño script del `<head>` de `index.html`.
