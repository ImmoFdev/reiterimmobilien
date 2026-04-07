# Tracking Konzept — Reiter Immobilien LP

## Traffic-Quellen

### Flyer (Postsendung)
- QR-Code auf Flyer drucken
- URL: `bewertung.reiter-immobilien.net?utm_source=flyer&utm_medium=print&utm_campaign=erstgespraech`

### Meta Kampagne
- URL: `bewertung.reiter-immobilien.net?utm_source=meta&utm_medium=paid&utm_campaign=erstgespraech`
- Meta Pixel trackt zusätzlich Ad-Performance

## UTM-Flow

1. Besucher landet auf LP mit UTM-Parametern in der URL
2. JavaScript liest UTM-Parameter aus der URL beim Page-Load
3. UTM-Werte werden in Hidden Fields im Formular geschrieben
4. Bei Form-Submit gehen UTM-Daten mit an n8n Webhook
5. n8n speichert alles in Airtable (inkl. UTM-Felder)

## Meta Pixel Events

| Event | Trigger | Zweck |
|-------|---------|-------|
| PageView | Page Load (nach Cookie-Consent) | Besucher zählen |
| Lead | Form-Submit (Step 3 abgeschlossen) | Conversion tracken |

## Airtable Lead-Tabelle — Felder

| Feld | Typ | Pflicht |
|------|-----|---------|
| Vorname | Single Line | Ja |
| Nachname | Single Line | Ja |
| Telefon | Phone | Ja |
| E-Mail | Email | Ja |
| Immobilienart | Single Select | Ja |
| PLZ | Single Line | Ja |
| Nachricht | Long Text | Nein |
| UTM Source | Single Line | Auto |
| UTM Medium | Single Line | Auto |
| UTM Campaign | Single Line | Auto |
| Datum | Created Time | Auto |
| Status | Single Select | Auto (Default: "Neu") |

### Status-Werte
- Neu (Default)
- Kontaktiert
- Termin vereinbart
- Abgeschlossen
- Nicht qualifiziert
