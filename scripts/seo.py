#!/usr/bin/env python3
"""
Regenera las etiquetas SEO de todas las páginas a partir de SITE_URL (config.js):

  - <title>, meta description y canonical
  - Open Graph (og:*) y Twitter (twitter:*)
  - sitemap.xml y robots.txt

Cada página tiene un bloque entre  <!-- SEO:inicio -->  y  <!-- SEO:fin -->
que este script reescribe entero: no lo edites a mano, cambia PAGINAS aquí abajo.

Uso (sin dependencias):  python3 scripts/seo.py
"""
import html
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

PAGINAS = {
    "index.html": {
        "ruta": "",
        "titulo": "OposicionesESP · Avisos gratis de oposiciones del BOE en Telegram",
        "descripcion": "Bot de Telegram gratuito que te avisa cada mañana de las oposiciones nuevas "
                       "publicadas en el BOE. Filtra por categoría, provincia y titulación.",
        "og_titulo": "OposicionesESP · Que no se te escape ninguna oposición",
        "og_descripcion": "Bot de Telegram gratuito que te avisa de las oposiciones nuevas del BOE "
                          "según tu categoría, provincia y titulación.",
        "prioridad": "1.0", "frecuencia": "monthly", "lastmod": "2026-11-22",
        "jsonld": {
            "@context": "https://schema.org", "@type": "WebSite", "name": "OposicionesESP",
            "url": "{BASE}/", "inLanguage": "es-ES",
            "description": "Bot de Telegram gratuito con avisos de oposiciones nuevas publicadas en el BOE.",
        },
    },
    "calculadora-plazos.html": {
        "ruta": "calculadora-plazos.html",
        "titulo": "Calculadora de plazos de oposiciones en días hábiles · OposicionesESP",
        "descripcion": "Calcula gratis cuándo termina el plazo de solicitud de una oposición: días "
                       "hábiles, naturales o meses según la Ley 39/2015, con festivos nacionales y "
                       "autonómicos de 2026 y 2027.",
        "og_titulo": "Calculadora de plazos de oposiciones en días hábiles",
        "og_descripcion": "¿Cuándo acaba el plazo de inscripción? Días hábiles, naturales o meses, "
                          "con los festivos oficiales del BOE.",
        "prioridad": "0.8", "frecuencia": "monthly", "lastmod": "2026-11-22",
        "jsonld": {
            "@context": "https://schema.org", "@type": "WebApplication",
            "name": "Calculadora de plazos de oposiciones", "url": "{BASE}/calculadora-plazos.html",
            "applicationCategory": "UtilitiesApplication", "operatingSystem": "Cualquiera",
            "inLanguage": "es-ES", "isAccessibleForFree": True,
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
        },
    },
    "guia-titulacion.html": {
        "ruta": "guia-titulacion.html",
        "titulo": "¿A qué oposiciones puedo presentarme con mi titulación? · Grupos A1, A2, B, C1 y C2",
        "descripcion": "Guía de los grupos y subgrupos del TREBEP (A1, A2, B, C1, C2 y Agrupaciones "
                       "Profesionales): qué titulación pide cada uno y a cuáles puedes presentarte "
                       "con la tuya.",
        "og_titulo": "¿A qué oposiciones puedo presentarme con mi titulación?",
        "og_descripcion": "ESO, Bachillerato, FP o Grado: descubre a qué grupos de oposiciones "
                          "puedes optar según el TREBEP.",
        "prioridad": "0.8", "frecuencia": "yearly", "lastmod": "2026-11-22",
    },
    "privacidad.html": {
        "ruta": "privacidad.html",
        "titulo": "Política de privacidad · OposicionesESP",
        "descripcion": "Qué datos trata el bot de Telegram OposicionesESP, para qué, durante cuánto "
                       "tiempo y cómo ejercer tus derechos o borrar tus datos.",
        "og_descripcion": "Qué datos tratamos, para qué y cómo borrarlos.",
        "prioridad": "0.3", "frecuencia": "yearly", "lastmod": "2026-11-22",
    },
    "aviso-legal.html": {
        "ruta": "aviso-legal.html",
        "titulo": "Aviso legal · OposicionesESP",
        "descripcion": "Titular, condiciones de uso y limitación de responsabilidad del bot de "
                       "Telegram OposicionesESP.",
        "prioridad": "0.3", "frecuencia": "yearly", "lastmod": "2026-11-22",
    },
    "404.html": {
        "ruta": "404.html",
        "titulo": "Página no encontrada · OposicionesESP",
        "descripcion": "La página que buscas no existe.",
        "og_descripcion": "Avisos gratis de oposiciones del BOE en Telegram.",
        "noindex": True,
    },
}

OG_IMAGEN = "img/og-image.png"
OG_IMAGEN_ALT = "OposicionesESP: logo de una campana dorada y el lema «Que no se te escape ninguna oposición»"

INICIO = "<!-- SEO:inicio (generado por scripts/seo.py; no editar a mano) -->"
FIN = "<!-- SEO:fin -->"
BLOQUE_RE = re.compile(r"[ \t]*<!-- SEO:inicio.*?<!-- SEO:fin -->", re.S)


def leer_base() -> str:
    m = re.search(r'SITE_URL:\s*"([^"]+)"', (RAIZ / "config.js").read_text(encoding="utf-8"))
    if not m:
        raise SystemExit("No encuentro SITE_URL en config.js")
    return m.group(1).rstrip("/")


def bloque(base: str, p: dict) -> str:
    e = lambda s: html.escape(s, quote=True)  # noqa: E731
    url = f"{base}/{p['ruta']}"
    og_t = p.get("og_titulo", p["titulo"])
    og_d = p.get("og_descripcion", p["descripcion"])
    img = f"{base}/{OG_IMAGEN}"
    lineas = [
        INICIO,
        f"<title>{e(p['titulo'])}</title>",
        f'<meta name="description" content="{e(p["descripcion"])}">',
    ]
    if p.get("noindex"):
        lineas.append('<meta name="robots" content="noindex">')
    else:
        lineas.append(f'<link rel="canonical" href="{e(url)}">')
    lineas += [
        '<meta property="og:type" content="website">',
        '<meta property="og:locale" content="es_ES">',
        '<meta property="og:site_name" content="OposicionesESP">',
        f'<meta property="og:title" content="{e(og_t)}">',
        f'<meta property="og:description" content="{e(og_d)}">',
        f'<meta property="og:url" content="{e(url)}">',
        f'<meta property="og:image" content="{e(img)}">',
        '<meta property="og:image:type" content="image/png">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{e(OG_IMAGEN_ALT)}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{e(og_t)}">',
        f'<meta name="twitter:description" content="{e(og_d)}">',
        f'<meta name="twitter:image" content="{e(img)}">',
        f'<meta name="twitter:image:alt" content="{e(OG_IMAGEN_ALT)}">',
    ]
    if p.get("jsonld"):
        datos = json.loads(json.dumps(p["jsonld"]).replace("{BASE}", base))
        lineas.append('<script type="application/ld+json">'
                      + json.dumps(datos, ensure_ascii=False) + "</script>")
    lineas.append(FIN)
    return "\n".join("  " + l for l in lineas)


def main():
    base = leer_base()
    for fichero, p in PAGINAS.items():
        ruta = RAIZ / fichero
        texto = ruta.read_text(encoding="utf-8")
        if not BLOQUE_RE.search(texto):
            raise SystemExit(f"{fichero}: falta el bloque {INICIO} … {FIN}")
        nuevo = BLOQUE_RE.sub(lambda _: bloque(base, p), texto, count=1)
        if nuevo != texto:
            ruta.write_text(nuevo, encoding="utf-8")
            print(f"actualizado  {fichero}")

    urls = "".join(
        f"  <url>\n    <loc>{base}/{p['ruta']}</loc>\n    <lastmod>{p['lastmod']}</lastmod>\n"
        f"    <changefreq>{p['frecuencia']}</changefreq>\n    <priority>{p['prioridad']}</priority>\n  </url>\n"
        for p in PAGINAS.values() if not p.get("noindex")
    )
    (RAIZ / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n",
        encoding="utf-8")
    (RAIZ / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\n\nSitemap: {base}/sitemap.xml\n", encoding="utf-8")
    print(f"sitemap.xml y robots.txt → {base}")


if __name__ == "__main__":
    main()
