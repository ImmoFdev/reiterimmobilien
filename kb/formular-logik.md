# Formular Logik — Multistep Lead-Formular

## Aufbau (3 Steps)

### Step 1 — Immobilie (niedrigschwellig, keine persönlichen Daten)
- **Immobilienart:** Kachel-Auswahl (2x2 Grid)
  - Ein/Zweifamilienhaus
  - Eigentumswohnung
  - Mehrfamilienhaus
  - Grundstück
- **PLZ:** Textfeld (5 Ziffern)
- Button: "Weiter →"

### Step 2 — Kontakt
- **Vorname:** Textfeld (Pflicht)
- **Nachname:** Textfeld (Pflicht)
- **Telefon:** Textfeld (Pflicht)
- **E-Mail:** Textfeld (Pflicht)
- Buttons: "← Zurück" (Ghost) + "Weiter →" (Primary)

### Step 3 — Fertig
- **Datenschutz-Checkbox:** Pflicht, Link zur DSE
- **WhatsApp-Einwilligung:** Pflicht (DSGVO-Audit-Trail: consent_timestamp, consent_ip, consent_text)
- Buttons: "← Zurück" (Ghost) + "Erstgespräch anfragen ✓" (Primary, disabled bis WhatsApp-Consent an)
- Hinweis: "Ihre Daten werden vertraulich behandelt"

### Danke-Screen (nach Submit)
- Inline anzeigen (kein Redirect)
- "Vielen Dank! Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen."
- Optional: Calendly-Link für Sofort-Buchung

## Progress-Bar
- 3 Labels: "Immobilie" | "Kontakt" | "Fertig"
- Aktiver Step: Roboto 500, #2a2724
- Inaktive Steps: Roboto 400, #d4cac3
- Fortschrittsbalken: 3px Höhe, #2a2724 auf #d4cac3

## Validierung
- Step 1: Immobilienart muss ausgewählt sein, PLZ muss 5 Ziffern haben
- Step 2: Alle 4 Felder Pflicht, E-Mail muss @ enthalten
- Step 3: Datenschutz-Checkbox muss angehakt sein
- Client-Side Validierung, kein Page-Reload

## Hidden Fields (automatisch befüllt)
- utm_source (aus URL)
- utm_medium (aus URL)
- utm_campaign (aus URL)
- timestamp (JS Date)
- page_url (window.location.href)

## Backend-Flow
1. Form-Submit → POST an n8n Webhook URL
2. n8n empfängt JSON mit allen Feldern
3. n8n → Airtable: Neuen Record in "Leads Reiter LP" erstellen
4. n8n → E-Mail an info@reiter-immobilien.net (HTML-formatiert mit allen Lead-Daten)
5. Frontend zeigt Danke-Screen
