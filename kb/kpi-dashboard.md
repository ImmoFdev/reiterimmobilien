# KPI Dashboard — Reiter Immobilien LP

## Konzept

Separate kleine Webseite mit Passwortschutz. Zeigt die wichtigsten KPIs auf einen Blick. Daten kommen aus Airtable.

## KPIs

### Primär
- **Leads gesamt** — Anzahl aller Form-Submits
- **Leads nach Quelle** — Flyer vs. Meta (Balkendiagramm)
- **Conversion Rate** — Leads / Besucher (wenn Besucher-Daten verfügbar)

### Sekundär
- **Leads pro Woche** — Zeitverlauf (Liniendiagramm)
- **Immobilienart-Verteilung** — Welche Immobilientypen kommen rein (Donut)
- **Status-Übersicht** — Neu / Kontaktiert / Termin / Abgeschlossen (Balken)
- **PLZ-Verteilung** — Aus welchen Gebieten kommen die Leads

## Datenquelle
- Airtable API (Read-only Token)
- Tabelle: "Leads Reiter LP"
- Refresh: Bei jedem Page-Load (kein Caching nötig bei geringem Traffic)

## Tech
- Einfaches HTML/JS (oder Astro)
- Chart.js für Visualisierung
- Passwortschutz: Basic Auth oder einfaches JS-Passwort-Gate
- Kein Backend nötig, alles Client-Side mit Airtable API

## Besucher-Tracking
- Meta Pixel liefert Besucher-Zahlen über Meta Business Manager
- Auf dem Dashboard nur Lead-Daten aus Airtable (Besucher-Daten müssten manuell aus Meta exportiert werden, oder wir bauen eine Meta API Anbindung als Phase 2)
