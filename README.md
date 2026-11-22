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
BOT_USERNAME: "OposicionesESP_bot",     // sin @  → https://t.me/OposicionesESP_bot
CANAL_USERNAME: "OposicionesESP",       // sin @  → https://t.me/OposicionesESP
EMAIL_CONTACTO: "contacto@ejemplo.com",
NOMBRE_RESPONSABLE: "Nombre Apellido Ejemplo",
NIF_RESPONSABLE: "00000000X",
DOMICILIO_RESPONSABLE: "Calle Ejemplo 1, 28000 Madrid (España)"
```

Todas las páginas aplican estos valores automáticamente a los enlaces (`data-link="bot|canal|email"`)
y a los textos (`data-config="..."`).

> **Recomendado:** los HTML llevan esos mismos valores de ejemplo escritos como respaldo, por si alguien
> navega sin JavaScript y para que los buscadores vean los enlaces correctos. Para dejarlo todo perfecto,
> sustitúyelos también en los HTML de una vez (ajusta los valores nuevos):
>
> ```bash
> sed -i \
>   -e 's/OposicionesESP_bot/MiBot_bot/g' \
>   -e 's#t.me/OposicionesESP"#t.me/MiCanal"#g' \
>   -e 's/@OposicionesESP</@MiCanal</g' \
>   -e 's/contacto@ejemplo.com/yo@midominio.es/g' \
>   -e 's/Nombre Apellido Ejemplo/Mi Nombre Real/g' \
>   -e 's/00000000X/12345678Z/g' \
>   -e 's/Calle Ejemplo 1, 28000 Madrid (España)/Mi dirección/g' \
>   *.html
> ```

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
