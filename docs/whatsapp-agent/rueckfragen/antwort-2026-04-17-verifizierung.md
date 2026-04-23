# Antwort: Verifizierung Webhook-Integration Eigentuemer-Formular

Stand: 2026-04-17

---

## 1. Webhook-URL

Aktueller Endpoint, den das Frontend aufruft: **same-origin** `POST /api/lead-submit` auf `verkauf.reiter-immobilien.net`. Die Cloudflare Pages Function proxyt von dort zum n8n-Webhook.

Upstream-URL im Proxy:

```
https://n8n.max-mp.de/webhook/reiterimmobilien-eigentuemer-lead
```

War vorher auf `-eigentuemer-import` (nach Spec v2 vom 2026-04-17). Wurde soeben umgestellt auf `-eigentuemer-lead` gemaess deiner Rueckfrage. Deployment laeuft.

**Warum der Proxy und nicht direkt aus dem Browser:**
- CORS-Whitelist auf n8n-Seite erlaubt laut Spec nur `reiter-immobilien.net` und `service.reiter-immobilien.net`. Die LP laeuft aber auf `verkauf.reiter-immobilien.net`. Der Proxy umgeht das serverseitig.
- Die Cloudflare Pages Function injected zusaetzlich die echte Client-IP (nicht manipulierbar) aus dem `CF-Connecting-IP` Header.

---

## 2. Payload-Felder (Beispiel)

Beispiel-Submit, **nach** dem Merge durch die Cloudflare Function (so kommt es bei n8n an):

```json
{
  "token": "ri-eigent-8f3k2m",
  "website": "",
  "consent_timestamp": "2026-04-17T14:23:51.234Z",
  "consent_ip": "91.45.123.67",
  "utm_source": "flyer",
  "utm_medium": "print",
  "utm_campaign": "",
  "timestamp": "2026-04-17T14:23:58.012Z",
  "page_url": "https://verkauf.reiter-immobilien.net/formular?utm_source=flyer&utm_medium=print",
  "immobilienart": "Ein/Zweifamilienhaus",
  "plz": "36037",
  "anrede": "Herr",
  "vorname": "Thomas",
  "nachname": "Mueller",
  "telefon": "0661 9876543",
  "email": "t.mueller@example.de",
  "nachricht": "Moechte mein Haus in Fulda verkaufen",
  "whatsapp_consent": true,
  "consent_text": "Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an datenschutz@reiter-immobilien.net)."
}
```

**Anmerkungen:**
- `whatsapp_consent` wird vor dem Senden explizit in einen echten Boolean (`true`) konvertiert, nicht als String `"on"` (wie `FormData` standardmaessig liefern wuerde).
- `consent_ip` wird vom Client **leer** rausgeschickt. Die Cloudflare Function ueberschreibt das Feld serverseitig mit der echten IP aus `CF-Connecting-IP` (Fallback `X-Forwarded-For`), bevor sie den Payload an n8n weiterleitet. Der Client kann die IP also nicht manipulieren.
- `datenschutz` (separate Pflicht-Checkbox) wird **nicht** mitgeschickt. Sie ist nur clientseitige Validierung.
- `email` ist im Form aktuell Pflicht, obwohl die Spec sie als optional listet. Falls es optional sein soll, melde dich.
- UTM-Felder werden aus dem URL-Querystring gelesen, ansonsten leer.
- `timestamp` ist der Zeitpunkt des Submits. `consent_timestamp` ist der Zeitpunkt an dem die Checkbox gesetzt wurde (beim Abhaken wird das Feld wieder geleert).

---

## 3. Consent-Text

Der **exakte** Text der Consent-Checkbox (wortwoertlich identisch mit dem Wert in `consent_text`):

```
Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an datenschutz@reiter-immobilien.net).
```

Dieser String ist sowohl in `src/components/LeadForm.astro` (sichtbarer HTML-Text) als auch in `src/scripts/form.ts` (Konstante `CONSENT_TEXT`, wird als `consent_text` gesendet) hinterlegt. Aenderungen an einer Stelle muessen in der anderen nachgezogen werden.

---

## 4. IP-Capture

**Serverseitig.** Nicht clientseitig, kein ipify oder sonstiger externer Service.

Ablauf:
1. Browser sendet Payload mit `consent_ip: ""` an `/api/lead-submit` (same-origin, kein CORS).
2. Cloudflare Pages Function liest Header `CF-Connecting-IP` (Cloudflare garantiert diesen Header, faelschungssicher).
3. Falls `CF-Connecting-IP` fehlt, Fallback auf `X-Forwarded-For` (erstes Element).
4. Die Function merged `consent_ip` in den Payload und forwarded an n8n.

Source: `functions/api/lead-submit.ts:32-40`.

---

## 5. Sanity-Checks

**a) Anrede-Auswahl auf Herr/Frau limitiert?**
Ja. Im Formular ist die Anrede als Radio-Tile-Gruppe mit **nur den zwei Optionen** `Herr` und `Frau` implementiert. Keine Neutral-Option, keine Freitext-Eingabe. Pflichtfeld, Default keiner vorausgewaehlt. Validierung bricht ab wenn nichts gewaehlt wurde.

Source: `src/components/LeadForm.astro:87-100`, Validierung `src/scripts/form.ts:93-97`.

**b) Submit-Button disabled solange Consent nicht gesetzt?**
Ja.

- HTML: `<button type="submit" ... id="lead-submit-btn" disabled>` (initial disabled)
- JS: Change-Listener auf der Consent-Checkbox. Beim Anhaken wird `submitBtn.disabled = false` gesetzt und gleichzeitig `consent_timestamp = new Date().toISOString()` ins Hidden Field geschrieben. Beim Abhaken wird der Button wieder disabled und der Timestamp geleert.
- CSS: Disabled-State ist visuell klar erkennbar (grau, `cursor: not-allowed`, reduzierte Opacity).
- Zusaetzliche Absicherung: `validateStep(3)` prueft die Checkbox nochmal vor dem Submit, selbst wenn jemand den disabled-State per DevTools umgeht.

Source: `src/scripts/form.ts:149-159` (Listener), `src/components/LeadForm.astro:153` (initial disabled), `src/components/LeadForm.astro:364-369` (CSS).

---

## Nebeninfo zur Security

- Hidden Token `ri-eigent-8f3k2m` wird mitgeschickt, n8n soll 403 bei Mismatch liefern.
- Honeypot `website` wird mitgeschickt (bleibt leer bei echten Nutzern), n8n soll 400 bei gefuelltem Feld liefern.
- Alle Requests gehen ueber HTTPS.
- Kein User-Tracking clientseitig ausser Meta Pixel, und das nur nach Cookie-Consent (siehe `src/scripts/cookie-consent.ts`). Meta Pixel feuert `Lead`-Event nach erfolgreichem Submit.

---

## Offen / Klaerungsbedarf

- E-Mail als Pflicht oder optional? Aktuell Pflicht im Form, Spec v2 sagt optional. Wenn optional: kurzer Hinweis, dann stellen wir um.
- DSGVO-Kontakt-Mailbox `datenschutz@reiter-immobilien.net` (aus dem Consent-Text) muss existieren und abrufbar sein. Bitte Verena-seitig pruefen.

Sobald du gruenes Licht gibst, koennen wir den E2E-Test fahren.
