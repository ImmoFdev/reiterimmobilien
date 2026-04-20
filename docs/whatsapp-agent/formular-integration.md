# Verkäufer-Formular: Webhook-Integration (v2, Stand 2026-04-17)

Kurzbrief für den Formular-Agent. Alles Nötige für die Integration mit dem WhatsApp-Sales-Bot von Reiter Immobilien.

---

## Endpoint

```
POST https://n8n.max-mp.de/webhook/reiterimmobilien-eigentuemer-import
Content-Type: application/json
```

**CORS:** Requests werden nur von `service.reiter-immobilien.net` und `reiter-immobilien.net` akzeptiert.

---

## Änderungen vs. vorherige Spec

Die erste Version dieses Briefes hatte `whatsapp_optin` als boolean. **Das reicht DSGVO-rechtlich nicht**. Neu: wir brauchen auch **wann, wie und mit welchem Text** die Einwilligung erteilt wurde. Außerdem brauchen wir eine **Anrede** für die neuen WhatsApp-Templates. Bitte die Änderungen unten sorgfältig umsetzen.

---

## Felder

### Pflichtfelder

| Feld | Typ | Beschreibung | Hinweis |
|------|-----|-------------|---------|
| `anrede` | string (enum) | `"Herr"` oder `"Frau"` | **NEU.** Wird in WhatsApp-Templates als Anrede genutzt. Nur diese zwei Optionen, weil Meta Template-Variablen kein Empty zulässt und neutrale Anrede zu awkward Grußzeilen führen würde. Bei unsicheren Fällen: Default "Herr". |
| `vorname` | string | Vorname des Eigentümers | |
| `nachname` | string | Nachname | Jetzt Pflicht, war vorher optional. Wird in WhatsApp-Anrede genutzt. |
| `telefon` | string | Telefonnummer (E.164 oder deutsche Schreibweise) | Server normalisiert auf E.164 |
| `whatsapp_consent` | boolean | Einwilligung für WhatsApp-Kontakt | **Umbenannt** von `whatsapp_optin` zu `whatsapp_consent`. Muss bewusst angehakt werden (nicht vorausgewählt). Submit-Button soll deaktiviert sein bis Haken gesetzt ist. |
| `consent_timestamp` | string (ISO 8601) | Zeitstempel der Einwilligung | **NEU.** Wird clientseitig beim Anhaken gesetzt. Format z.B. `"2026-04-17T14:23:51.234Z"`. |
| `consent_ip` | string | IP-Adresse des Nutzers | **NEU.** Von eurem Backend zu erfassen (falls Frontend-only: serverseitiger Proxy nötig). Für DSGVO-Audit-Trail. |
| `consent_text` | string | Exakter Text der Consent-Checkbox zum Zeitpunkt des Submits | **NEU.** Fest verdrahten mit dem unten angegebenen Text. Wenn ihr den Consent-Text irgendwann ändert, müsst ihr auch diesen Default ändern. |

### Optionale Felder

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `email` | string | E-Mail-Adresse |
| `immobilienart` | string | z.B. `"Haus"`, `"Eigentumswohnung"`, `"Mehrfamilienhaus"`, `"Grundstück"` |
| `plz` | string | Postleitzahl der Immobilie |

### Sicherheitsfelder (Pflicht, unverändert)

**1. Secret Token (Hidden Field)**

```html
<input type="hidden" name="token" value="ri-eigent-8f3k2m" />
```

Wird serverseitig validiert. Requests ohne gültigen Token werden mit HTTP 403 abgewiesen.

**2. Honeypot (Spam-Schutz)**

```html
<input type="hidden" name="website" value="" autocomplete="off" tabindex="-1" style="display:none" />
```

Dieses Feld muss LEER bleiben. Bots füllen es automatisch aus und werden verworfen.

---

## Consent-Checkbox: exakter Text

Der Text der Consent-Checkbox muss **wortwörtlich** so lauten (zusammen mit den 4 Bedingungen weiter unten). Das ist der Text, den ihr im `consent_text`-Feld als Default mitsenden müsst.

```
Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon
zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich
jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an
info@reiter-immobilien.net).
```

### UI-Anforderungen an die Checkbox

1. **Nicht vorausgewählt** (leer by default). Der Nutzer muss aktiv klicken.
2. **Separate Checkbox**, nicht gebündelt mit AGB / Datenschutzerklärung. DSGVO verbietet Bündel-Consent.
3. **Submit-Button deaktiviert** solange der Haken nicht gesetzt ist. Am besten auch visuell deutlich machen (z.B. grau, disabled cursor).
4. **Beim Anhaken:** clientseitig `consent_timestamp = new Date().toISOString()` setzen und beim Abschicken mitsenden.

---

## Beispiel-Payload

```json
{
  "anrede": "Herr",
  "vorname": "Thomas",
  "nachname": "Müller",
  "telefon": "0661 9876543",
  "email": "t.mueller@example.de",
  "immobilienart": "Haus",
  "plz": "36037",
  "whatsapp_consent": true,
  "consent_timestamp": "2026-04-17T14:23:51.234Z",
  "consent_ip": "91.45.123.67",
  "consent_text": "Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an info@reiter-immobilien.net).",
  "token": "ri-eigent-8f3k2m",
  "website": ""
}
```

---

## Antworten vom Webhook

**HTTP 200 (Erfolg)**

```json
{"status": "ok"}
```

**HTTP 400 (Validierungsfehler, z.B. fehlende Pflichtfelder oder Honeypot nicht leer)**

```json
{"status": "error", "reason": "..."}
```

**HTTP 403 (Token ungültig)**

```json
{"status": "error", "reason": "invalid token"}
```

Der Client soll bei 400/403 eine generische Fehlermeldung anzeigen. Keine technischen Details an den Endnutzer leaken.

---

## Nach Submit

Weiterleitung auf eine Bestätigungsseite oder Inline-Success-Meldung. Vorschlag-Text:

> "Danke! Wir haben Ihre Anfrage erhalten. In wenigen Minuten schreibt Ihnen der digitale Assistent von Frau Reiter per WhatsApp, um ein kurzes Telefonat zu koordinieren."

Wichtig: der User soll **wissen** dass die Kontaktaufnahme per WhatsApp kommt (und nicht per Anruf in den nächsten 10 Sekunden). Das reduziert die „Wie kommen die an meine Nummer?"-Irritation.

---

## IP-Adresse erfassen: Hinweis für Frontend-only Setups

Falls ihr keinen eigenen Backend-Proxy habt und direkt aus dem Browser postet, wird der Client die eigene IP nicht kennen. Zwei Optionen:

1. **Empfohlen:** Hinter dem Formular einen minimalen Proxy (Netlify Function, Cloudflare Worker, etc.) einbauen, der die Client-IP aus dem `x-forwarded-for` Header liest und in den Payload mergt. So kann der Client das nicht manipulieren.
2. **Fallback:** IP per öffentlichem Service (z.B. `https://api.ipify.org?format=json`) beim Client abfragen. Weniger sicher (manipulierbar), aber für Audit-Trail ok.

Wenn ihr unsicher seid welche Option praktikabler ist: bitte kurz Rückmeldung, dann entscheiden wir gemeinsam.

---

## Test

Vor Go-Live bitte einen Test-Submit mit folgenden Dummy-Daten machen:

```json
{
  "anrede": "Herr",
  "vorname": "Max",
  "nachname": "Testuser",
  "telefon": "+49 1511 2345678",
  "whatsapp_consent": true,
  "consent_timestamp": "2026-04-17T12:00:00.000Z",
  "consent_ip": "127.0.0.1",
  "consent_text": "Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an info@reiter-immobilien.net).",
  "token": "ri-eigent-8f3k2m",
  "website": ""
}
```

Erwartete Antwort: `200 {"status": "ok"}`. Im Backend wird sichtbar ob der Lead in Airtable angelegt wurde. Bitte die Webhook-URL **ohne Auth-Header** nutzen — Authentifizierung läuft ausschließlich über den `token` im Body.

---

## Kontakt

Bei Rückfragen oder Unklarheiten: Max (`info@max-mp.de`). Dringend = WhatsApp an Max.

---

## Changelog

- 2026-04-17: v2. `anrede`, `consent_timestamp`, `consent_ip`, `consent_text` hinzugefügt. `whatsapp_optin` zu `whatsapp_consent` umbenannt. `nachname` Pflichtfeld. UI-Anforderungen für Checkbox präzisiert. IP-Capture-Hinweis ergänzt.
- Vorherige Version: einfacher Boolean-Consent, `whatsapp_optin`, keine Anrede.
