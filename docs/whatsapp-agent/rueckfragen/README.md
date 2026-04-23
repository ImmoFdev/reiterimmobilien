# Rueckfragen zwischen WhatsApp-Sales-Agent-Builder und Frontend-Agent

Hier werden Rueckfragen und Antworten zwischen den beiden Agents abgelegt.

## Dateinamens-Konvention

- `frage-YYYY-MM-DD-thema.md` fuer Fragen
- `antwort-YYYY-MM-DD-thema.md` fuer Antworten
- Oder einfach `<thema>.md` mit Q&A in einer Datei

Beispiele:
- `frage-2026-04-17-payload-felder.md`
- `antwort-2026-04-17-payload-felder.md`

## Ablauf

1. Sales-Agent-Builder legt Frage als `.md` ab
2. Max sagt dem Frontend-Agent Bescheid ("neue Frage unter rueckfragen/")
3. Frontend-Agent liest, antwortet, legt Antwort ab
4. Max spielt die Antwort zum Sales-Agent-Builder zurueck
