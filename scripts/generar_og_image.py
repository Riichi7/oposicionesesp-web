#!/usr/bin/env python3
"""
Genera img/og-image.png (1200x630), la imagen que se ve al compartir la web
en WhatsApp, Telegram, X, LinkedIn...

Usa la fuente Inter local (fonts/inter-latin-wght-normal.woff2) y dibuja el logo
(mismas formas que img/logo.svg) con los colores de la web.

Requisitos:  pip install pillow fonttools brotli
Uso:         python3 scripts/generar_og_image.py
"""
import io
import re
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FUENTE = RAIZ / "fonts" / "inter-latin-wght-normal.woff2"
SALIDA = RAIZ / "img" / "og-image.png"

AZUL = "#0B2F6B"
AZUL_OSCURO = "#08234F"
DORADO = "#F2B705"
BLANCO = "#FFFFFF"
TEXTO_CLARO = "#E2E8F2"

ANCHO, ALTO = 1200, 630
SS = 2  # supermuestreo para bordes suaves


def fuente(peso: int, tam: int) -> ImageFont.FreeTypeFont:
    """Carga Inter (variable, woff2) con el peso indicado."""
    tt = TTFont(str(FUENTE))  # fontTools descomprime woff2 con brotli
    tt.flavor = None
    buf = io.BytesIO()
    tt.save(buf)
    buf.seek(0)
    f = ImageFont.truetype(buf, tam * SS)
    f.set_variation_by_axes([peso])
    return f


def ruta_svg(d: str, escala: float, ox: float, oy: float, pasos: int = 24):
    """Convierte un 'd' de SVG sencillo (M, L, H, V, C, Z en absoluto/relativo) en un polígono."""
    tokens = re.findall(r"[MLHVCZmlhvcz]|-?\d*\.?\d+", d)
    pts, x, y, i, cmd = [], 0.0, 0.0, 0, None

    def num():
        nonlocal i
        v = float(tokens[i])
        i += 1
        return v

    while i < len(tokens):
        if re.match(r"[A-Za-z]", tokens[i]):
            cmd = tokens[i]
            i += 1
            if cmd in "Zz":
                continue
        rel = cmd.islower()
        c = cmd.upper()
        if c in "ML":
            nx, ny = num(), num()
            x, y = (x + nx, y + ny) if rel else (nx, ny)
            pts.append((x, y))
            if c == "M":
                cmd = "l" if rel else "L"
        elif c == "H":
            v = num()
            x = x + v if rel else v
            pts.append((x, y))
        elif c == "V":
            v = num()
            y = y + v if rel else v
            pts.append((x, y))
        elif c == "C":
            vals = [num() for _ in range(6)]
            if rel:
                vals = [vals[k] + (x if k % 2 == 0 else y) for k in range(6)]
            x1, y1, x2, y2, x3, y3 = vals
            for s in range(1, pasos + 1):
                t = s / pasos
                mt = 1 - t
                pts.append((
                    mt**3 * x + 3 * mt**2 * t * x1 + 3 * mt * t**2 * x2 + t**3 * x3,
                    mt**3 * y + 3 * mt**2 * t * y1 + 3 * mt * t**2 * y2 + t**3 * y3,
                ))
            x, y = x3, y3
    return [(ox + px * escala, oy + py * escala) for px, py in pts]


def dibujar_logo(draw: ImageDraw.ImageDraw, ox: float, oy: float, lado: float):
    """Logo de img/logo.svg (viewBox 48x48) en (ox, oy) con el lado indicado."""
    e = lado / 48
    P = lambda x, y: (ox + x * e, oy + y * e)  # noqa: E731
    draw.rounded_rectangle([P(0, 0), P(48, 48)], radius=11 * e, fill=AZUL_OSCURO,
                           outline=DORADO, width=round(0.6 * e))
    draw.ellipse([P(24 - 1.8, 10.5 - 1.8), P(24 + 1.8, 10.5 + 1.8)], fill=DORADO)
    campana = ("M24 12c-5.6 0-9.2 4.1-9.2 9.6v5.6l-2.7 4.3c-.5.8.1 1.8 1 1.8h21.8"
               "c.9 0 1.5-1 1-1.8l-2.7-4.3v-5.6C33.2 16.1 29.6 12 24 12z")
    draw.polygon(ruta_svg(campana, e, ox, oy), fill=DORADO)
    # Badajo: semicírculo inferior de radio 3.7 centrado en (24, 35.6)
    draw.chord([P(24 - 3.7, 35.6 - 3.7), P(24 + 3.7, 35.6 + 3.7)], 0, 180, fill=DORADO)
    # Check
    draw.line([P(19.6, 23.4), P(22.7, 26.4), P(28.6, 20.4)], fill=AZUL_OSCURO,
              width=round(2.6 * e), joint="curve")
    r = 1.3 * e
    for cx, cy in [(19.6, 23.4), (28.6, 20.4)]:
        x, y = P(cx, cy)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=AZUL_OSCURO)


def main():
    W, H = ANCHO * SS, ALTO * SS
    img = Image.new("RGB", (W, H), AZUL)
    d = ImageDraw.Draw(img)

    # Fondo: círculos decorativos suaves a la derecha
    d.ellipse([W - 520 * SS, -260 * SS, W + 260 * SS, 520 * SS], fill="#0E3878")
    d.ellipse([W - 300 * SS, 300 * SS, W + 200 * SS, 800 * SS], fill="#0D3573")
    # Franja dorada inferior
    d.rectangle([0, H - 14 * SS, W, H], fill=DORADO)

    margen = 96 * SS
    lado_logo = 150 * SS
    dibujar_logo(d, margen, 120 * SS, lado_logo)

    # Nombre: "Oposiciones" en blanco + "ESP" en dorado
    f_nombre = fuente(800, 96)
    y_nombre = 300 * SS
    d.text((margen, y_nombre), "Oposiciones", font=f_nombre, fill=BLANCO)
    ancho = d.textlength("Oposiciones", font=f_nombre)
    d.text((margen + ancho, y_nombre), "ESP", font=f_nombre, fill=DORADO)

    # Lema
    f_lema = fuente(600, 50)
    d.text((margen, 430 * SS), "Que no se te escape ninguna oposición", font=f_lema, fill=TEXTO_CLARO)

    # Subtítulo
    f_sub = fuente(500, 30)
    d.text((margen, 510 * SS), "Avisos gratis del BOE en Telegram", font=f_sub, fill="#CBD5E4")

    img = img.resize((ANCHO, ALTO), Image.LANCZOS)
    # Paleta de 128 colores: mismo aspecto con mucho menos peso
    img = img.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    img.save(SALIDA, optimize=True)
    print(f"Generada {SALIDA.relative_to(RAIZ)} ({SALIDA.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
