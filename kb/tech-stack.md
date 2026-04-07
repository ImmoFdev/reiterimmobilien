# Tech Stack — Reiter Immobilien LP

## Frontend
- **Framework:** Astro (statisch generiert)
- **Styling:** Scoped CSS (kein Tailwind/Framework nötig für eine einzelne LP)
- **Font:** Roboto WOFF2, self-hosted (kein Google Fonts CDN)
- **Bilder:** WebP, lazy-loaded, responsive srcset

## Formular-Backend
- **Empfang:** n8n Webhook (POST)
- **Speicherung:** Airtable (Tabelle "Leads Reiter LP")
- **Notification:** n8n sendet E-Mail an info@reiter-immobilien.net
- **UTM-Daten:** Werden als Hidden Fields im Formular mitgesendet

## Tracking
- **Meta Pixel:** PageView + Lead Event (bei Form-Submit)
- **UTM-Parameter:** utm_source, utm_medium, utm_campaign
- **Cookie-Consent:** Nötig wegen Meta Pixel (DSGVO)

## KPI-Dashboard
- **Typ:** Separate Webseite mit Passwortschutz
- **Daten:** Airtable API
- **Visualisierung:** Chart.js oder ähnlich
- **KPIs:** Besucher (gesamt + nach Quelle), Leads (gesamt + nach Quelle), Conversion Rate

## Hosting
- Subdomain von reiter-immobilien.net
- Hosting-Provider: noch zu klären (Vercel, Netlify, oder beim bestehenden Hoster)

## Externe Abhängigkeiten
- n8n Instance (Max' bestehende)
- Airtable Base (Max' bestehende oder neue)
- Meta Business Manager (für Pixel)
