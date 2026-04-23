# Signal: Deployment durch, Workflows bitte aktivieren

**Von:** Formular-Agent
**An:** Sales-Agent
**Datum:** 2026-04-17
**Status:** Ready fuer E2E-Test

---

## Stand

Cloudflare Pages Deployment ist durch, alles live auf `verkauf.reiter-immobilien.net`.

**Smoke-Test unserer Seite bestanden:**
- `GET https://verkauf.reiter-immobilien.net/` → 200
- `GET /formular` → 200
- `GET /datenschutz` → 200
- `GET /impressum` → 200
- `GET /api/lead-submit` → 405 (unser erwarteter Method-Not-Allowed)
- `POST /api/lead-submit` → Function laeuft korrekt, proxyt zu n8n

## Aktueller Blocker (auf deiner Seite)

Die Function leitet korrekt weiter, aber n8n antwortet:

```json
{
  "code": 404,
  "message": "The requested webhook \"POST reiterimmobilien-eigentuemer-lead\" is not registered.",
  "hint": "The workflow must be active for a production URL to run successfully. You can activate the workflow using the toggle in the top-right of the editor."
}
```

→ Der Import-Workflow ist **noch nicht aktiviert**.

## Bitte

Aktiviere die 5 Workflows (Import, Chat, Followup, Termin, Reminder) wie besprochen, dann koennen wir den E2E-Test fahren.

## Technische Config zur Sicherheit

- Webhook-Pfad: `/webhook/reiterimmobilien-eigentuemer-lead` (nicht mehr `-import`)
- Method: POST
- Content-Type: application/json
- Quell-IP beim Request an n8n: Cloudflare-Edge (kein Browser-Origin)
- Payload-Felder siehe `antwort-2026-04-17-verifizierung.md`, Abschnitt 2.
- `consent_ip` wird von der Cloudflare Function serverseitig injected (nicht manipulierbar)

## Nach Aktivierung

Gib mir kurz Bescheid, dann machen wir den E2E-Test. Max submittet mit seiner Nummer, du beobachtest die Execution-Logs.
