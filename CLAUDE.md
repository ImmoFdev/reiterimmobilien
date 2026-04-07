# Reiter Immobilien — Landing Page

## Projekt

Landing Page für Reiter Immobilien GmbH zur Generierung von Verkäufer-Leads.
Zwei Traffic-Quellen: Flyer-Postsendungen (QR-Code) + Meta-Kampagne.

**Kunde:** Verena Reiter, Reiter Immobilien GmbH
**Region:** Fulda, Petersberg, Hünfeld (Osthessen)
**URL:** Subdomain von reiter-immobilien.net
**Bestandswebsite:** https://www.reiter-immobilien.net (gebaut mit Ynfinite)

## Tech Stack

- **Framework:** Astro (statisch)
- **Styling:** Scoped CSS, kein Framework
- **Font:** Roboto (WOFF2, self-hosted, 300/400/500/700)
- **Formular-Backend:** n8n Webhook → Airtable + E-Mail an Verena
- **Tracking:** Meta Pixel + UTM-Parameter
- **KPI-Dashboard:** Separate Seite, Airtable API + Chart.js

## CI / Design System (1:1 von reiter-immobilien.net)

### Farben
- Dark: `#2a2724` (Nav, Buttons, Headlines)
- Light: `#fafafa` (Content-Bereiche, Button-Text)
- Grey: `#f4f3f2` (Seiten-Hintergrund, alternende Sektionen)
- Accent: `#d4cac3` (Beige-Akzente, Borders)
- Taupe: `#a99d8f` (Sekundärtext, Footer-Hintergrund)
- Color-1: `#b6aba3` (Tertiär)

### Buttons
- Primär: `bg: #2a2724, color: #fafafa, border-radius: 30px, font-weight: 500`
- Sekundär (Ghost): `border: 1px solid #d4cac3, border-radius: 30px`
- Globaler border-radius: 0px (nur Buttons 30px)

### Typografie
- Font: Roboto (self-hosted WOFF2)
- 300 = Body/Light, 400 = Regular, 500 = Buttons/Medium, 700 = Headlines/Bold

## Seitenstruktur (11 Sektionen)

1. Navigation (sticky, dark)
2. Hero (Split: Video links, Content rechts)
3. Warum Reiter (3 USP-Karten)
4. Social Proof (Google Reviews)
5. Homestaging (Vorher/Nachher)
6. Referenzobjekte (3er Grid)
7. Instagram Videos (2 Thumbnails, kein Embed)
8. Prozess (4 Schritte)
9. Multistep Lead-Formular (3 Steps)
10. FAQ (Accordion)
11. Footer

## Regeln

- Kein `git push` ohne explizite Freigabe von Max
- CI exakt von reiter-immobilien.net übernehmen, keine eigenen Farben/Fonts
- Echte Umlaute (ä, ö, ü, ß) in allen Texten
- Performance: Lighthouse 90+, Bilder WebP, Video lazy-loaded
- DSGVO: Cookie-Banner bei Meta Pixel, Datenschutz-Checkbox im Formular
- Homestaging ist OPTIONAL für Eigentümer, nicht Pflicht
- Content der noch fehlt ist im Aufgabenbogen markiert (kb/aufgabenbogen-verena.md)

## Dateien & Ordner

- `docs/superpowers/specs/` — Design Spec
- `kb/` — Knowledge Base (Projektwissen)
- `src/` — Astro Source Code (kommt noch)

## Zusammenarbeit

- Max macht Frontend/UX/Produkt
- Marlon hat NICHTS mit diesem Projekt zu tun
- Backend (n8n Workflows, Airtable) macht Max selbst
