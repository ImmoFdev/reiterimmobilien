# Verkaeufer-Formular: Webhook-Integration (v3, Stand 2026-04-20)

Kurzbrief fuer den Formular-Agent. Alles Noetige fuer die Integration mit dem WhatsApp-Sales-Bot von Reiter Immobilien.

Diese Spec erweitert `formular-integration.md` (v2) um ein einziges neues Pflichtfeld: `erreichbarkeit`. Alle anderen Felder, Sicherheitsmechanismen und Consent-Anforderungen bleiben unveraendert. Bitte nur die in Abschnitt "Aenderungen vs. v2" genannten Punkte anpassen.

---

## Endpoint

```
POST https://n8n.max-mp.de/webhook/reiterimmobilien-eigentuemer-lead
Content-Type: application/json
```

**CORS:** Requests werden nur von `service.reiter-immobilien.net` und `reiter-immobilien.net` akzeptiert.

---

## Aenderungen vs. v2

Der Sales-Bot schlaegt nach den Kern-Fragen einen konkreten Rueckruf-Slot vor. Damit das ohne weitere Rueckfragen geht, brauchen wir die bevorzugte Erreichbarkeit bereits aus dem Formular.

**Neu in v3:**
- Neues Pflichtfeld `erreichbarkeit` (enum: `"Vormittag"`, `"Nachmittag"`, `"Abend"`, `"Flexibel"`)
- UI: **Radio-Buttons** (nicht Dropdown), schnellere UX auf Mobile
- Label im Formular: **"Wann sind Sie am besten telefonisch erreichbar?"**
- **Default: keine Auswahl.** Submit-Button bleibt disabled bis eine Option aktiv gewaehlt wurde.

Alle anderen Felder, Consent-Logik und Sicherheits-Setups aus v2 bleiben 1:1 bestehen.

---

## Felder

### Pflichtfelder

| Feld | Typ | Beschreibung | Hinweis |
|------|-----|-------------|---------|
| `anrede` | string (enum) | `"Herr"` oder `"Frau"` | Wird in WhatsApp-Templates als Anrede genutzt. Nur diese zwei Optionen, weil Meta Template-Variablen kein Empty zulaesst und neutrale Anrede zu awkward Grusszeilen fuehren wuerde. Bei unsicheren Faellen: Default "Herr". |
| `vorname` | string | Vorname des Eigentuemers | |
| `nachname` | string | Nachname | Pflicht, wird in WhatsApp-Anrede genutzt. |
| `telefon` | string | Telefonnummer (E.164 oder deutsche Schreibweise) | Server normalisiert auf E.164 |
| `erreichbarkeit` | string (enum) | `"Vormittag"`, `"Nachmittag"`, `"Abend"` oder `"Flexibel"` | **NEU in v3.** Pflicht. Wird im Sales-Bot genutzt, um direkt einen konkreten Rueckruf-Slot vorzuschlagen. UI: Radio-Buttons. Keine Vorauswahl. |
| `whatsapp_consent` | boolean | Einwilligung fuer WhatsApp-Kontakt | Muss bewusst angehakt werden (nicht vorausgewaehlt). Submit-Button soll deaktiviert sein bis Haken gesetzt ist. |
| `consent_timestamp` | string (ISO 8601) | Zeitstempel der Einwilligung | Wird clientseitig beim Anhaken gesetzt. Format z.B. `"2026-04-20T14:23:51.234Z"`. |
| `consent_ip` | string | IP-Adresse des Nutzers | Von eurem Backend zu erfassen (falls Frontend-only: serverseitiger Proxy noetig). Fuer DSGVO-Audit-Trail. |
| `consent_text` | string | Exakter Text der Consent-Checkbox zum Zeitpunkt des Submits | Fest verdrahten mit dem unten angegebenen Text. Wenn ihr den Consent-Text irgendwann aendert, muesst ihr auch diesen Default aendern. |

### Optionale Felder

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `email` | string | E-Mail-Adresse |
| `immobilienart` | string | z.B. `"Haus"`, `"Eigentumswohnung"`, `"Mehrfamilienhaus"`, `"Grundstueck"` |
| `plz` | string | Postleitzahl der Immobilie |

### Sicherheitsfelder (Pflicht, unveraendert)

**1. Secret Token (Hidden Field)**

```html
<input type="hidden" name="token" value="ri-eigent-8f3k2m" />
```

Wird serverseitig validiert. Requests ohne gueltigen Token werden mit HTTP 403 abgewiesen.

**2. Honeypot (Spam-Schutz)**

```html
<input type="hidden" name="website" value="" autocomplete="off" tabindex="-1" style="display:none" />
```

Dieses Feld muss LEER bleiben. Bots fuellen es automatisch aus und werden verworfen.

---

## Consent-Checkbox: exakter Text

Der Text der Consent-Checkbox muss **wortwoertlich** so lauten (zusammen mit den 4 Bedingungen weiter unten). Das ist der Text, den ihr im `consent_text`-Feld als Default mitsenden muesst.

```
Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon
zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich
jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an
info@reiter-immobilien.net).
```

### UI-Anforderungen an die Checkbox

1. **Nicht vorausgewaehlt** (leer by default). Der Nutzer muss aktiv klicken.
2. **Separate Checkbox**, nicht gebuendelt mit AGB / Datenschutzerklaerung. DSGVO verbietet Buendel-Consent.
3. **Submit-Button deaktiviert** solange der Haken nicht gesetzt ist. Am besten auch visuell deutlich machen (z.B. grau, disabled cursor).
4. **Beim Anhaken:** clientseitig `consent_timestamp = new Date().toISOString()` setzen und beim Abschicken mitsenden.

---

## UI-Anforderungen an das Erreichbarkeit-Feld (NEU in v3)

1. **Darstellung als Radio-Buttons**, nicht als Dropdown oder Select. Vier sichtbare Optionen nebeneinander oder untereinander, je nach Layout.
2. **Label:** "Wann sind Sie am besten telefonisch erreichbar?" (genau so).
3. **Optionen in dieser Reihenfolge:**
   - Vormittag
   - Nachmittag
   - Abend
   - Flexibel
4. **Keine Vorauswahl.** Der Nutzer muss aktiv eine Option waehlen.
5. **Submit-Button-Gating:** Der Button bleibt disabled bis sowohl `whatsapp_consent` gesetzt UND eine `erreichbarkeit` gewaehlt ist. Beide Bedingungen muessen erfuellt sein.
6. **Empfohlene Platzierung:** direkt unter dem Telefonfeld, vor der Consent-Checkbox. So hat der Nutzer zuerst die Telefon-Logik gedanklich abgeschlossen, bevor er den Consent bestaetigt.
7. Optional (Empfehlung): kleiner Hilfstext unter dem Label, z.B. "Wir rufen zurueck, kein Werbe-Anruf." Reduziert die Absprungrate.

---

## Beispiel-Payload

```json
{
  "anrede": "Herr",
  "vorname": "Thomas",
  "nachname": "Mueller",
  "telefon": "0661 9876543",
  "email": "t.mueller@example.de",
  "immobilienart": "Haus",
  "plz": "36037",
  "erreichbarkeit": "Vormittag",
  "whatsapp_consent": true,
  "consent_timestamp": "2026-04-20T14:23:51.234Z",
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

**HTTP 403 (Token ungueltig)**

```json
{"status": "error", "reason": "invalid token"}
```

Der Client soll bei 400/403 eine generische Fehlermeldung anzeigen. Keine technischen Details an den Endnutzer leaken.

---

## Nach Submit

Weiterleitung auf eine Bestaetigungsseite oder Inline-Success-Meldung. Vorschlag-Text:

> "Danke! Wir haben Ihre Anfrage erhalten. In wenigen Minuten schreibt Ihnen der digitale Assistent von Frau Reiter per WhatsApp, um ein kurzes Telefonat zu koordinieren."

Wichtig: der User soll **wissen** dass die Kontaktaufnahme per WhatsApp kommt (und nicht per Anruf in den naechsten 10 Sekunden). Das reduziert die "Wie kommen die an meine Nummer?"-Irritation.

---

## IP-Adresse erfassen: Hinweis fuer Frontend-only Setups

Falls ihr keinen eigenen Backend-Proxy habt und direkt aus dem Browser postet, wird der Client die eigene IP nicht kennen. Zwei Optionen:

1. **Empfohlen:** Hinter dem Formular einen minimalen Proxy (Netlify Function, Cloudflare Worker, etc.) einbauen, der die Client-IP aus dem `x-forwarded-for` Header liest und in den Payload mergt. So kann der Client das nicht manipulieren.
2. **Fallback:** IP per oeffentlichem Service (z.B. `https://api.ipify.org?format=json`) beim Client abfragen. Weniger sicher (manipulierbar), aber fuer Audit-Trail ok.

Wenn ihr unsicher seid welche Option praktikabler ist: bitte kurz Rueckmeldung, dann entscheiden wir gemeinsam.

---

## Test

Vor Go-Live bitte einen Test-Submit mit folgenden Dummy-Daten machen:

```json
{
  "anrede": "Herr",
  "vorname": "Max",
  "nachname": "Testuser",
  "telefon": "+49 1511 2345678",
  "erreichbarkeit": "Flexibel",
  "whatsapp_consent": true,
  "consent_timestamp": "2026-04-20T12:00:00.000Z",
  "consent_ip": "127.0.0.1",
  "consent_text": "Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an info@reiter-immobilien.net).",
  "token": "ri-eigent-8f3k2m",
  "website": ""
}
```

Erwartete Antwort: `200 {"status": "ok"}`. Im Backend wird sichtbar ob der Lead in Airtable angelegt wurde (inkl. neuem Feld `Erreichbarkeit`). Bitte die Webhook-URL **ohne Auth-Header** nutzen. Authentifizierung laeuft ausschliesslich ueber den `token` im Body.

Ausserdem bitte je einen Probe-Submit pro Erreichbarkeit-Option (Vormittag/Nachmittag/Abend/Flexibel) senden, damit wir verifizieren koennen dass alle vier Werte sauber beim Bot ankommen.

---

## Rueckfragen

Etablierte Kanaele fuer Fragen oder Klaerungsbedarf waehrend der Umsetzung:

1. **Formular-Agent-Feedback-Ordner (Projekt-intern):**
   `eigentuemer-sales-agent/formular-agent-feedback/`
   Dort koennen Rueckfragen als Markdown-Datei abgelegt werden, sie werden im naechsten Sync aufgegriffen.

2. **LP-Rueckfragen-Kanal (falls Formular Teil der Reiter-LP ist):**
   `Kundenprojekte/ReiterImmobilien-LP/docs/whatsapp-agent/rueckfragen/`

3. **Direkt:** Max (`info@max-mp.de`). Dringend = WhatsApp an Max.

---

## Changelog

- **2026-04-20: v3.** Neues Pflichtfeld `erreichbarkeit` (enum Vormittag/Nachmittag/Abend/Flexibel) ergaenzt. UI-Anforderung: Radio-Buttons, keine Vorauswahl, Submit-Gating. Beispiel- und Test-Payload aktualisiert. Rueckfragen-Kanaele dokumentiert.
- 2026-04-17: v2. `anrede`, `consent_timestamp`, `consent_ip`, `consent_text` hinzugefuegt. `whatsapp_optin` zu `whatsapp_consent` umbenannt. `nachname` Pflichtfeld. UI-Anforderungen fuer Checkbox praezisiert. IP-Capture-Hinweis ergaenzt.
- Vorherige Version: einfacher Boolean-Consent, `whatsapp_optin`, keine Anrede.
