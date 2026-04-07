# CI Design System — Reiter Immobilien

Exakt extrahiert von https://www.reiter-immobilien.net am 05.04.2026.

## Farben (CSS Custom Properties)

| Variable | Hex | Rolle |
|----------|-----|-------|
| --dark | `#2a2724` | Nav-Hintergrund, Buttons, Headlines, Primärtext |
| --light | `#fafafa` | Content-Sektionen, Button-Text |
| --grey | `#f4f3f2` | Seiten-Hintergrund, alternende Sektionen |
| --accent-pri | `#d4cac3` | Beige-Akzente, Borders, Video-Hintergrund |
| --accent-sec | `#a99d8f` | Sekundärtext, Footer-Hintergrund, Labels |
| --color-1 | `#b6aba3` | Tertiäre Elemente, Platzhalter |
| --banner | `#151312` | Overlay-Layer (sehr dunkel) |

### Layer Opacity
- Banner-Overlay: 0.4
- Layer-Opacity: 0.6 / 0.9

## Typografie

- **Font:** Roboto
- **Format:** WOFF2, self-hosted unter `/assets/fonts/roboto/`
- **Font-Display:** swap
- **Weights:**
  - 300 (Light) — Body-Text, Subtexte
  - 400 (Regular) — Standard
  - 500 (Medium) — Buttons, Labels
  - 700 (Bold) — Headlines, Zahlen

## Buttons

```css
.btn-primary {
  background: #2a2724;
  color: #fafafa;
  border-radius: 30px;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #d4cac3;
  border-radius: 30px;
  color: #a99d8f;
  font-weight: 400;
}
```

## Stilregeln

- **Globaler border-radius:** 0px (nur Buttons bekommen 30px Pill-Shape)
- **Sektionswechsel:** Abwechselnd `#fafafa` und `#f4f3f2`
- **Borders:** `1px solid #d4cac3`
- **Formular-Inputs:** `background: #f4f3f2; border: 1px solid #d4cac3;`
- **Karten/Zitate:** `border-left: 3px solid #d4cac3`
- **Nav-Links:** Mit `»` Prefix auf der Hauptseite

## Logo

- Wortmarke: "REITER IMMOBILIEN" (Roboto 500, uppercase, letter-spacing)
- Signet: Reiter auf Pferd (SVG: reiter-immobilien_signet.svg)
- Aspect-Ratio Signet: 1843/1740
