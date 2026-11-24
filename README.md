# OposicionesESP · web

Web estática del bot de Telegram **OposicionesESP**, que avisa de las oposiciones nuevas publicadas en el BOE.
Solo HTML, CSS y un poco de JavaScript, sin frameworks ni dependencias. Lista para GitHub Pages.

## Estructura

```
index.html          Página principal
calculadora-plazos.html  Calculadora de plazos (Ley 39/2015, art. 30)
guia-titulacion.html     Guía «¿A qué puedo presentarme con mi titulación?»
privacidad.html     Política de privacidad (RGPD)
aviso-legal.html    Aviso legal y condiciones de uso
404.html            Página de error (GitHub Pages la usa automáticamente)
config.js           ← CONFIGURACIÓN (URL pública, bot, canal, correo, titular)
css/styles.css      Estilos
js/festivos.js      Días inhábiles nacionales y autonómicos por año (fuente BOE)
js/plazos.js        Lógica de la calculadora (navegador y Node)
js/calculadora.js   Interfaz de la calculadora
js/guia.js          Selector de la guía de titulación
js/convocatorias.js Filtro por categoría de /convocatorias/
convocatorias/      ← GENERADO POR EL BOT (web.py del bot): una página por convocatoria,
                      index.html y paginas.json (slugs y lastmod para el sitemap). No editar a mano.
scripts/seo.py      Regenera title, description, canonical, Open Graph, Twitter, sitemap y robots
scripts/generar_og_image.py  Genera img/og-image.png (1200×630) con Pillow y la fuente Inter
tests/              Tests de la calculadora (node --test tests/)
fonts/              Tipografía Inter alojada localmente (+ licencia OFL)
img/                Logo, capturas, imagen Open Graph, icono de Apple
favicon.svg / .ico  Favicon
sitemap.xml         Mapa del sitio
robots.txt          Instrucciones para buscadores
.nojekyll           Hace que GitHub Pages sirva los archivos tal cual
```

## 1. Cambiar la configuración

Abre **`config.js`** y cambia los valores:

```js
BOT_USERNAME: "OposicionesESPbot",      // sin @  → https://t.me/OposicionesESPbot
CANAL_USERNAME: "oposicionesesp",       // sin @; vacío = canal oculto
EMAIL_CONTACTO: "",                     // vacío = el contacto aparece como «próximamente»
NOMBRE_RESPONSABLE: "Ricardo Villaitodo",
NIF_RESPONSABLE: "",                    // vacío = no se muestra esa línea
DOMICILIO_RESPONSABLE: ""               // vacío = no se muestra esa línea
```

Todas las páginas aplican estos valores automáticamente a los enlaces (`data-link="bot|canal|email"`)
y a los textos (`data-config="..."`). Los elementos marcados con `data-if="CLAVE"` solo se muestran si
esa clave tiene valor, y los marcados con `data-unless="CLAVE"` solo si está vacía (por ejemplo, el texto
«próximamente»).

**Activar el canal o el correo cuando existan:** basta con rellenar `CANAL_USERNAME` o `EMAIL_CONTACTO`
en `config.js`; la sección del canal, los enlaces y el correo aparecen solos y desaparecen los
«próximamente».

> Sin JavaScript, los HTML muestran el estado actual (canal oculto, contacto «próximamente»). Si quieres
> que también se vea el canal/correo sin JavaScript, quita el atributo `hidden` de los elementos
> `data-if` correspondientes, rellena su `href`/texto y borra los `data-unless`.

### URL pública (SEO y Open Graph)

La URL de la web está en **un solo sitio**: `SITE_URL` en `config.js`
(ahora `https://oposicionesesp.es`). Para cambiarla:

1. Cambia `SITE_URL` en `config.js` (sin barra final).
2. Ejecuta `python3 scripts/seo.py` (no necesita dependencias).

El script reescribe en cada página el bloque entre `<!-- SEO:inicio -->` y `<!-- SEO:fin -->`
(`<title>`, `description`, `canonical`, `og:*`, `twitter:*`, JSON-LD) y regenera `sitemap.xml` y `robots.txt`.
Los títulos y descripciones de cada página se cambian en el diccionario `PAGINAS` de ese script, no a mano en el HTML.
El sitemap incluye también `/convocatorias/` y las páginas de convocatorias que lista `convocatorias/paginas.json`.

### Páginas de convocatorias

**«Últimas convocatorias» en el inicio:** en `index.html`, lo que hay entre
`<!-- CONVOCATORIAS:inicio -->` y `<!-- CONVOCATORIAS:fin -->` (las 6 más recientes: título,
organismo, plazas y plazo) lo reescribe el bot cada vez que genera las páginas. No lo edites a mano
ni borres las marcas; el título de la sección y el botón «Ver todas las convocatorias» están fuera
y sí se pueden cambiar. Si `index.html` tiene cambios sin commit, el bot actualiza el bloque en el
disco pero no lo sube (para no mezclar tus cambios con su commit).

**Menú:** «Qué incluye» se quitó del menú para que cupiera «Convocatorias» en escritorio (la sección
sigue en el inicio). El menú de escritorio mide ~1046 px de 1080 disponibles: si añades otro
elemento, quita uno o el menú se saldrá de la cabecera.

Las genera y sube el bot de Telegram cada mañana (commit «Convocatorias del BOE dd/mm/aaaa…»), con
rutas absolutas (`/css/styles.css`), así que necesitan la web en la raíz del dominio. Su aspecto se
cambia en `web.py` del bot (plantillas) y en la sección «Convocatorias» de `css/styles.css`. El botón
«Recibe alertas gratis en Telegram» enlaza siempre al canal t.me/oposicionesesp.

El canal está activado (`CANAL_USERNAME: "oposicionesesp"`) y sus enlaces y la sección de
`index.html` están escritos también en el HTML (sin `hidden`), así que se ven sin JavaScript. Si
cambia el canal, cambia `config.js` y esos `href`.
Las etiquetas tienen que estar escritas en el HTML (no generadas con JavaScript) porque WhatsApp, Telegram,
X o Google no ejecutan JavaScript al leerlas.

### Imagen para compartir

`img/og-image.png` se genera con:

```bash
python3 -m venv .venv && .venv/bin/pip install pillow fonttools brotli
.venv/bin/python scripts/generar_og_image.py
```

### Estadísticas (GoatCounter)

Todas las páginas cargan GoatCounter (`oposicionesesp.goatcounter.com`), sin cookies. En `localhost`,
`127.0.0.1` o abriendo el archivo directamente no se cuenta nada. Cada clic en un enlace al bot se registra
como evento `abrir-telegram` (o `abrir-telegram-guia` desde la guía). Los enlaces al bot llevan
`?start=web` (y `?start=guia` en la guía) para que el bot sepa cuántos usuarios llegan desde la web:
`config.js` lo añade a cualquier `<a data-link="bot">`, y `data-start="..."` cambia el valor.

### Festivos de la calculadora

Están en `js/festivos.js`, con la resolución del BOE de cada año en un comentario. Cada noviembre la
Secretaría de Estado de Función Pública publica en el BOE el «calendario de días inhábiles a efectos de
cómputo de plazos» del año siguiente: añade un bloque nuevo copiando el del último año. Si un año aún
no está publicado, ponlo con `publicado: false` y la web lo indicará.

Tests (Node 18 o superior):

```bash
node --test tests/
```

### Capturas del bot

Sustituye `img/captura1.png`, `img/captura2.png` e `img/captura3.png` por capturas reales
(formato vertical, idealmente 600×1200 px o proporción 1:2). Si cambian de contenido, actualiza su texto
`alt` en `index.html`.

### Fechas

Actualiza «Última actualización» en `privacidad.html` y `aviso-legal.html` cuando cambies sus textos,
y `lastmod` de esa página en `PAGINAS` (`scripts/seo.py`), y ejecuta el script.

## 2. Verla en local

Desde esta carpeta:

```bash
python3 -m http.server 8000
```

y abre <http://localhost:8000>. (También funciona abriendo `index.html` directamente en el navegador,
pero con servidor se comporta igual que en GitHub Pages.)

## 3. Publicar en GitHub Pages

1. Crea un repositorio vacío en GitHub (por ejemplo `oposicionesesp-web`).
2. Sube el código:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/oposicionesesp-web.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: “Deploy from a branch”**,
   rama `main`, carpeta `/ (root)` → **Save**.
4. En uno o dos minutos estará en `https://TU_USUARIO.github.io/oposicionesesp-web/`.
5. Si cambia la URL pública, actualiza `SITE_URL` y ejecuta `python3 scripts/seo.py` (ver arriba).

**Dominio propio (opcional):** en *Settings → Pages → Custom domain* escribe tu dominio; GitHub creará
un archivo `CNAME`. En tu proveedor de DNS añade un registro `CNAME` apuntando a `TU_USUARIO.github.io`.
Activa *Enforce HTTPS*.

## Notas

- **Privacidad de visitantes:** la web no usa cookies. El único recurso externo es GoatCounter (estadísticas
  anónimas, explicado en `privacidad.html`). La fuente Inter está en `/fonts` (licencia SIL OFL, ver
  `fonts/OFL.txt`), así que no se envían datos a Google Fonts.
- **Accesibilidad:** contraste AA (el dorado `#F2B705` solo se usa como fondo con texto oscuro `#1A202C`,
  o sobre el azul marino), enlace «Saltar al contenido», foco visible (azul sobre fondos claros y dorado
  sobre azul, contraste ≥ 3:1), menú accesible en móvil, `alt` en imágenes y respeto a `prefers-reduced-motion`.
- **Imágenes:** las capturas se sirven en WebP (`<picture>`) con el PNG como respaldo. Si las cambias,
  regenera el `.webp` (por ejemplo, con Pillow: `Image.open(png).save(webp, "WEBP", quality=82)`).
- **404:** calcula su ruta base automáticamente en `TU_USUARIO.github.io/REPO/` y en dominio propio.
  Si publicas en `TU_USUARIO.github.io` (repositorio de usuario, sin subcarpeta), cambia en `404.html`
  la condición para que la base sea siempre `/`.
- Proyecto independiente: no uses logos, escudos ni banderas oficiales.
