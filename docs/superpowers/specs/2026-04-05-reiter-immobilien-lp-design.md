# Reiter Immobilien — Landing Page Design Spec

## Übersicht

Landing Page für Reiter Immobilien GmbH (Verena Reiter, Fulda/Osthessen) zur Generierung von Verkäufer-Leads. Zwei Traffic-Quellen: Flyer-Postsendungen (QR-Code) und Meta-Kampagne. Eine LP, unterschieden via UTM-Parameter.

**URL:** Subdomain von reiter-immobilien.net (z.B. `bewertung.reiter-immobilien.net`)
**Ziel:** Kostenloses Erstgespräch anfragen (Lead-Formular)
**Zielgruppe:** Immobilien-Eigentümer in Fulda, Petersberg, Hünfeld (PLZ 36000–36169)

---

## Tech Stack

- **Framework:** Astro (statisch, schnell, guter Lighthouse-Score)
- **Styling:** CSS (Inline/Scoped, kein Framework nötig für eine LP)
- **Font:** Roboto (WOFF2, self-hosted, Weights: 300, 400, 500, 700)
- **Formular-Backend:** n8n Webhook → Airtable + E-Mail-Notification an Verena
- **Tracking:** Meta Pixel + UTM-Parameter (utm_source=flyer / utm_source=meta)
- **Analytics:** UTM wird beim Form-Submit in Airtable gespeichert
- **KPI-Dashboard:** Separate kleine Webseite, zieht Daten aus Airtable

---

## CI / Design System

Exakt übernommen von reiter-immobilien.net:

### Farben
| Rolle | Hex | Verwendung |
|-------|-----|------------|
| Dark | `#2a2724` | Nav-Hintergrund, Buttons, Headlines, Text |
| Light | `#fafafa` | Content-Sektionen, Button-Text |
| Grey | `#f4f3f2` | Seiten-Hintergrund, alternende Sektionen |
| Accent | `#d4cac3` | Beige-Akzente, Borders, Hover |
| Taupe | `#a99d8f` | Sekundärer Text, Footer-Hintergrund |
| Color-1 | `#b6aba3` | Tertiäre Elemente |

### Typografie
- **Font-Family:** `'Roboto', sans-serif`
- **Weights:** 300 (Light/Body), 400 (Regular), 500 (Medium/Buttons), 700 (Bold/Headlines)
- **Font-Display:** swap

### Buttons
- **Primär:** `background: #2a2724; color: #fafafa; border-radius: 30px; font-weight: 500;`
- **Sekundär (Ghost):** `border: 1px solid #d4cac3; border-radius: 30px; color: #a99d8f;`
- **Form:** Pill-Shape (border-radius: 30px)

### Sonstige Stilregeln
- **Globaler border-radius:** 0px (nur Buttons bekommen 30px)
- **Sektionswechsel:** Abwechselnd `#fafafa` und `#f4f3f2` Hintergrund
- **Borders:** `1px solid #d4cac3`

---

## Seitenaufbau (11 Sektionen)

### 1. Navigation (sticky)
- Hintergrund: `#2a2724`
- Links: Logo "REITER IMMOBILIEN" (Wortmarke + Signet)
- Rechts: Telefonnummer + "Kontakt"-Button (pill, #fafafa)
- Mobile: Hamburger-Menu

### 2. Hero (Split-Layout)
- **Desktop:** 2-spaltig (50/50)
  - Links: Video-Thumbnail mit Play-Button (Begrüßungsvideo Verena), Hintergrund `#d4cac3`
  - Rechts: Hintergrund `#fafafa`
    - Subline: "Reiter Immobilien · Fulda & Umgebung" (uppercase, letter-spacing, `#a99d8f`)
    - Headline: "Ihre Immobilie verdient den besten Verkauf." (Roboto 700, `#2a2724`)
    - Subtext: "Persönlich. Transparent. Mit kostenlosem Homestaging für den bestmöglichen Preis." (Roboto 300, `#a99d8f`)
    - Trust-Leiste: 4,8★ Google | 30+ Jahre | 100% Persönlich (getrennt durch border-top/bottom)
    - CTA: "Kostenloses Erstgespräch sichern →" (scrollt zum Formular)
- **Mobile:** Gestackt. Video oben, Content darunter.
- **Video:** Muss noch gedreht werden (Aufgabenbogen). Kein Autoplay, Thumbnail + Play-Button.

### 3. Warum Reiter (3 USPs)
- Hintergrund: `#f4f3f2`
- Headline: "Drei Gründe, die den Unterschied machen"
- 3 Karten (Desktop: 3 Spalten, Mobile: gestackt) auf `#fafafa`:
  1. Kostenloses Homestaging — "Ihre Immobilie wird optimal präsentiert."
  2. Rundum-Sorglos-Paket — "Von der Bewertung bis zum Notartermin."
  3. Regionale Expertise — "30+ Jahre Erfahrung in Fulda, Petersberg & Hünfeld."

### 4. Social Proof (Google Reviews)
- Hintergrund: `#fafafa`
- Headline: "4,8 von 5 Sternen auf Google"
- 2 Review-Karten mit Zitat, border-left `3px solid #d4cac3`
- Echte Rezensionen von Verena (Aufgabenbogen)

### 5. Homestaging Showcase
- Hintergrund: `#f4f3f2`
- Headline: "Der erste Eindruck entscheidet"
- Subtext: Homestaging ist kostenlos, optional für Eigentümer
- Vorher/Nachher Bilder nebeneinander
- Echte Bilder von Verena (Aufgabenbogen)

### 6. Referenzobjekte
- Hintergrund: `#fafafa`
- Headline: "Erfolgreich vermittelt"
- 3er Grid mit Bild, Titel, kurze Info (z.B. "Verkauft in 4 Wochen")
- Echte Referenzen von Verena (Aufgabenbogen)

### 7. Instagram Videos
- Hintergrund: `#f4f3f2`
- Headline: "Verena Reiter auf Instagram"
- 2 Video-Thumbnails im 9:16 Hochformat
- Play-Overlay + Gradient am unteren Rand mit Videotitel
- Link zu Instagram @reiterimmobilien (kein Embed, Performance)
- Auswahl der Videos: Aufgabenbogen Verena

### 8. Prozess (4 Schritte)
- Hintergrund: `#fafafa`
- Headline: "In 4 Schritten zum erfolgreichen Verkauf"
- 4er Grid mit nummerierten Kreisen (`#2a2724`, 50% border-radius):
  1. Erstgespräch — Kennenlernen & Wünsche
  2. Bewertung — Marktgerechter Preis
  3. Vermarktung — Homestaging & Exposé
  4. Verkauf — Bis zum Notartermin

### 9. Multistep Lead-Formular
- Hintergrund: `#f4f3f2`
- Headline: "Kostenloses Erstgespräch vereinbaren"
- Progress-Bar oben (3 Schritte visualisiert)
- Formular-Container auf `#fafafa`

**Step 1 — Immobilie:**
- Art der Immobilie (Kachel-Auswahl, 2x2 Grid): Ein/Zweifamilienhaus, Eigentumswohnung, Mehrfamilienhaus, Grundstück
- PLZ (Textfeld)
- Button: "Weiter →"

**Step 2 — Kontakt:**
- Vorname, Nachname (2-spaltig)
- Telefon
- E-Mail
- Buttons: "← Zurück" (Ghost) + "Weiter →" (Primary)

**Step 3 — Fertig:**
- Nachricht (optional, Textarea)
- Datenschutz-Checkbox mit Link zur Datenschutzerklärung
- Buttons: "← Zurück" (Ghost) + "Erstgespräch anfragen ✓" (Primary)
- Hinweis: "Ihre Daten werden vertraulich behandelt"

**Nach Absenden:**
- Danke-Screen inline (kein Redirect)
- "Vielen Dank! Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen."
- Optional: Calendly-Link für Sofort-Buchung

**Formular-Daten werden gesendet an:**
- n8n Webhook → Airtable (mit UTM-Source)
- n8n → E-Mail an Verena (info@reiter-immobilien.net)

### 10. FAQ
- Hintergrund: `#fafafa` (oder `#f4f3f2`)
- Headline: "Wir beantworten Ihre Fragen"
- Accordion-Style (klappbar, border-bottom `#d4cac3`)
- Fragen:
  1. Was kostet das Erstgespräch?
  2. Ist das Homestaging wirklich kostenlos?
  3. Wie läuft die Immobilienbewertung ab?
  4. Welche Region decken Sie ab?
- Antworten: Aufgabenbogen Verena

### 11. Footer
- Hintergrund: `#a99d8f`
- 3-spaltig: Firmeninfo | Kontakt | Rechtliches
- Impressum + Datenschutz Links (Pflicht)

---

## Tracking & Analytics

### UTM-Parameter
- Flyer: `?utm_source=flyer&utm_medium=print&utm_campaign=erstgespraech`
- Meta: `?utm_source=meta&utm_medium=paid&utm_campaign=erstgespraech`
- UTM wird beim Form-Submit als Hidden Field mitgesendet

### Meta Pixel
- Auf der gesamten LP eingebunden
- Events: PageView, Lead (bei Form-Submit)
- Pixel-ID: Von Verena/Max bereitstellen

### Airtable Lead-Tabelle
Felder:
- Vorname, Nachname, Telefon, E-Mail
- Immobilienart, PLZ
- Nachricht
- UTM Source, UTM Medium, UTM Campaign
- Datum/Uhrzeit
- Status (Neu / Kontaktiert / Termin / Abgeschlossen)

---

## KPI-Dashboard

Separate kleine Webseite (z.B. Astro oder einfaches HTML) mit Passwortschutz.

**KPIs:**
- Besucher gesamt (Meta Pixel)
- Besucher nach Quelle (Flyer vs. Meta)
- Leads gesamt
- Leads nach Quelle
- Conversion Rate (Leads / Besucher)
- Conversion Rate nach Quelle

**Datenquelle:** Airtable API
**Tech:** Einfache statische Seite mit JS-Fetch auf Airtable, Chart-Lib (z.B. Chart.js)

---

## Aufgabenbogen Verena

Content der von Verena zugeliefert werden muss:

1. **Begrüßungsvideo** — Kurzes Video (30-60 Sek.) persönliche Ansprache an Eigentümer. Muss noch gedreht werden.
2. **Google-Rezensionen** — 2-4 beste Bewertungen auswählen (Text + Name/Initialen)
3. **Homestaging-Bilder** — 1-2 Sets Vorher/Nachher
4. **Referenzobjekte** — 3 erfolgreich vermittelte Immobilien (Bild, Typ, Ort, kurze Info)
5. **Instagram-Videos** — 2 beste Reels auswählen (Link + Thumbnail)
6. **FAQ-Antworten** — Antworten auf die 4 Fragen
7. **Meta Pixel ID** — Falls vorhanden, sonst neu erstellen
8. **Logo/Signet** — Reiter-Immobilien Signet als SVG/PNG
9. **Datenschutzerklärung** — Link zur bestehenden oder neue erstellen
10. **Impressum** — Link zur bestehenden Seite

---

## Responsive Breakpoints

- **Desktop:** ab 1024px — Volle Layouts, Grids
- **Tablet:** 768px–1023px — 2-spaltig wo möglich
- **Mobile:** bis 767px — Alles gestackt, Video über Content im Hero

---

## Performance-Ziele

- Lighthouse Performance Score: 90+
- First Contentful Paint: < 1.5s
- Video: Lazy-loaded, kein Autoplay
- Bilder: WebP, optimiert, lazy-loaded
- Font: Self-hosted WOFF2, font-display: swap

---

## DSGVO

- Cookie-Banner nur wenn Meta Pixel aktiv (Cookie-Consent nötig)
- Datenschutz-Checkbox im Formular (Pflicht)
- Links zu Impressum + Datenschutzerklärung im Footer
- Keine Drittanbieter-Embeds (Instagram nur als Thumbnail/Link)
