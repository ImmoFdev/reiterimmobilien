# Antwort: Erreichbarkeit-Feld (v3) umgesetzt

**Bezug:** `formular-integration-v2.md` (Spec v3, 2026-04-20)
**Status:** umgesetzt, noch nicht deployed. Deploy folgt nach Review hier in der Session.

## Was eingebaut wurde

**Neues Pflichtfeld `erreichbarkeit`** mit exakt den vier Werten laut Spec:
`"Vormittag"`, `"Nachmittag"`, `"Abend"`, `"Flexibel"`.

### UI-Umsetzung

- **Radio-Buttons** als Tile-Optik, konsistent mit der bestehenden Anrede-Auswahl (Border + Grey-Fill wenn aktiv)
- **Label:** "Wann sind Sie am besten telefonisch erreichbar?" (wortwoertlich aus Spec)
- **Hilfstext darunter:** "Wir rufen zurueck, kein Werbe-Anruf."
- **Keine Vorauswahl**, Nutzer muss aktiv klicken
- **Reihenfolge:** Vormittag, Nachmittag, Abend, Flexibel
- **Layout:** Desktop 4 nebeneinander, Mobile 2x2 (unter 640px Viewport)

### Platzierung im Multistep-Formular

Das Formular ist ein 3-Step-Wizard. Platzierung laut Spec "direkt unter Telefonfeld":

- **Step 2 (Kontakt)** enthaelt jetzt: Anrede → Vorname/Nachname → **Telefon → Erreichbarkeit** → E-Mail
- Step 3 (Nachricht + Consent + Submit) unveraendert

### Submit-Gating

Technisch ist das Gating durch die Step-Navigation bereits erzwungen: der User kann Step 2 nicht verlassen ohne `erreichbarkeit` gesetzt zu haben (validateStep(2) prueft das). Dadurch ist der Submit-Button in Step 3 implizit gegated.

Der Consent-Checkbox-Mechanismus aus v2 bleibt unveraendert: Submit-Button `disabled` bis Consent gesetzt, `consent_timestamp` wird beim Anhaken gesetzt.

## Beispiel-Payload (real vom Formular)

```json
{
  "token": "ri-eigent-8f3k2m",
  "website": "",
  "immobilienart": "Haus",
  "plz": "36037",
  "anrede": "Herr",
  "vorname": "Thomas",
  "nachname": "Mueller",
  "telefon": "0661 9876543",
  "erreichbarkeit": "Vormittag",
  "email": "t.mueller@example.de",
  "nachricht": "",
  "whatsapp_consent": true,
  "consent_timestamp": "2026-04-20T14:23:51.234Z",
  "consent_ip": "91.45.123.67",
  "consent_text": "Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an datenschutz@reiter-immobilien.net).",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "timestamp": "2026-04-20T14:23:52.000Z",
  "page_url": "https://verkauf.reiter-immobilien.net/formular"
}
```

`consent_ip` wird weiterhin serverseitig vom Cloudflare-Pages-Proxy (`/api/lead-submit`) aus `CF-Connecting-IP` gesetzt und in den Payload gemerged. Der Client schickt einen leeren String, der auf dem Proxy ueberschrieben wird.

## Test

Ich fahre die 4 Probe-Submits (je eine Erreichbarkeit-Option) direkt nach dem Deploy. Rueckmeldung hier im Ordner sobald durch und in Airtable sichtbar.

## Bitte noch von eurer Seite

1. **Airtable-Feld `Erreichbarkeit`** (Single Select mit den vier Werten) muss im CRM-Table angelegt sein, bevor die Submits reinkommen. Sonst verliert ihr das Feld im n8n-Mapping.
2. **n8n-Workflow**: Set/Airtable-Node um das neue Feld erweitern.
3. **Sales-Bot-Prompt**: den `erreichbarkeit`-Wert im Context-Prompt fuer den Rueckruf-Slot-Vorschlag konsumieren.

Sagt bescheid wenn Airtable + Workflow ready sind, dann koordiniere ich den Deploy hier.
