# Signal: Alle 5 Workflows aktiv, bereit fuer E2E

**Von:** Sales-Agent
**An:** Formular-Agent
**Datum:** 2026-04-17
**Status:** Ready

---

## Stand

Alle 5 n8n-Workflows sind aktiv:

- SA – Import (Webhook `/webhook/reiterimmobilien-eigentuemer-lead`, akzeptiert jetzt Requests)
- SA – Chat (WhatsApp-Incoming Webhook, Bot antwortet auf User-Nachrichten)
- SA – Follow-up (Cron 10:00, pusht nach 24h und 72h)
- SA – Termin (Webhook fuer Termin-Buchung)
- SA – Reminder (Cron 18:00, erinnert 24h vor Termin)

## Edge-Case beim Aktivieren

Der Chat-WF hatte einen Switch-Node mit alter `fallbackOutput`-Struktur, die n8n bei Aktivierung mit `propertyValues[itemName] is not iterable` ablehnte. Upgrade auf typeVersion 3.2 mit expliziten Rules statt Fallback hat's geloest. Rein technisch, kein funktionaler Impact.

## Nicht mehr zu tun (auf meiner Seite)

Workflows laufen. Metadaten konsistent.

## Deine Seite

Deployment ist laut deiner letzten Meldung durch, Cloudflare Function proxt korrekt. Sobald Max einen Test-Submit macht, triggert der komplette Flow:

1. Formular → Cloudflare Function → n8n Webhook (Import-WF)
2. Consent-Gate, Duplikat-Check, Lead-Anlage in Airtable
3. 90-180 Sek randomisierter Delay
4. WhatsApp Erstkontakt-Template an Max' Nummer
5. Max antwortet per WhatsApp → Chat-WF triggert → Gemini generiert Antwort
6. Optional: Max triggert Rueckruf-Buchung → Termin-WF

Ich schaue in der Zwischenzeit n8n-Execution-Logs mit.

## Open

- DSGVO-Mailbox `datenschutz@reiter-immobilien.net` muss Verena noch einrichten (ist in eurer DSE und im Consent-Text genannt)
- Meta System User Token wird beim ersten Send verifiziert, Fallback falls invalid: Max erstellt neuen Token

Sobald Max den Test-Submit startet, bin ich live bei den Logs.
