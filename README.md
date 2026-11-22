# OposicionesESP · web

Web estática del bot de Telegram **OposicionesESP**, que avisa de las oposiciones nuevas publicadas en el BOE.
Solo HTML, CSS y un poco de JavaScript, sin frameworks ni dependencias. Lista para GitHub Pages.

## Estructura

```
index.html          Página principal
privacidad.html     Política de privacidad (RGPD)
aviso-legal.html    Aviso legal y condiciones de uso
404.html            Página de error (GitHub Pages la usa automáticamente)
config.js           ← CONFIGURACIÓN (bot, canal, correo, titular)
css/styles.css      Estilos
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
CANAL_USERNAME: "",                     // sin @; vacío = canal oculto
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

Las etiquetas `canonical`, `og:url`, `og:image`, `sitemap.xml` y `robots.txt` necesitan la URL real de la web.
Por defecto usan `https://tu-usuario.github.io/oposicionesesp-web/`. Cámbiala en todos a la vez:

```bash
sed -i 's#https://tu-usuario.github.io/oposicionesesp-web/#https://TU_USUARIO.github.io/TU_REPO/#g' \
  *.html sitemap.xml robots.txt
```

(Si usas dominio propio, pon `https://tudominio.es/`.)

### Capturas del bot

Sustituye `img/captura1.png`, `img/captura2.png` e `img/captura3.png` por capturas reales
(formato vertical, idealmente 600×1200 px o proporción 1:2). Si cambian de contenido, actualiza su texto
`alt` en `index.html`.

### Fechas

Actualiza «Última actualización» en `privacidad.html` y `aviso-legal.html` cuando cambies sus textos,
y `<lastmod>` en `sitemap.xml`.

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
5. Cambia la URL pública (ver arriba), haz commit y push.

**Dominio propio (opcional):** en *Settings → Pages → Custom domain* escribe tu dominio; GitHub creará
un archivo `CNAME`. En tu proveedor de DNS añade un registro `CNAME` apuntando a `TU_USUARIO.github.io`.
Activa *Enforce HTTPS*.

## Notas

- **Privacidad de visitantes:** la web no usa cookies, analítica ni recursos externos. La fuente Inter está
  en `/fonts` (licencia SIL OFL, ver `fonts/OFL.txt`), así que no se envían datos a Google Fonts.
- **Accesibilidad:** contraste AA (el dorado `#F2B705` solo se usa como fondo con texto oscuro `#1A202C`,
  o sobre el azul marino), enlace «Saltar al contenido», foco visible, `alt` en imágenes y respeto a
  `prefers-reduced-motion`.
- **404:** calcula su ruta base automáticamente en `TU_USUARIO.github.io/REPO/` y en dominio propio.
  Si publicas en `TU_USUARIO.github.io` (repositorio de usuario, sin subcarpeta), cambia en `404.html`
  la condición para que la base sea siempre `/`.
- Proyecto independiente: no uses logos, escudos ni banderas oficiales.
