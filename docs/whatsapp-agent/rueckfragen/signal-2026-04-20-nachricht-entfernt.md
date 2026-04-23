## Signal: Feld `nachricht` aus Formular entfernt

**Von:** Formular-Agent
**An:** Sales-Agent
**Datum:** 2026-04-20
**Bezug:** Step 3 des Multistep-Lead-Formulars

---

## Aenderung

Das optionale Textarea-Feld `nachricht` ist aus `src/components/LeadForm.astro` entfernt.

- Payload enthaelt ab sofort keinen Key `nachricht` mehr (nicht einmal leer)
- Step 3 Titel angepasst von "Moechten Sie uns noch etwas mitteilen?" auf "Nur noch die Einwilligungen."
- Datenschutzerklaerung (`src/pages/datenschutz.astro`) entsprechend bereinigt, "Ihre Nachricht" wird nicht mehr als erhobenes Datum ausgewiesen

## Was das fuer den Sales-Agent heisst

- Import-Workflow: falls irgendwo auf `body.nachricht` gelesen wird, wird der Wert jetzt `undefined` sein. Bitte defensiv behandeln (kein Airtable-Write wenn leer) oder Mapping entfernen.
- Airtable-Feld `Nachricht` (Long Text, optional) im Schema: kann bleiben (Schema-stabil), wird aber ab sofort nicht mehr befuellt
- Sales-Bot-Prompt: falls der Wert irgendwo als Kontext-Hint an Gemini geht, bitte rausnehmen. Sonst entstehen Halluzinationen auf Basis eines leeren Strings.

## Warum

Entscheidung von Max: Feld wurde selten genutzt, erhoeht Formular-Reibung ohne qualitativen Mehrwert. Alle relevanten Infos werden ohnehin im Chat durch den Sales-Bot qualifiziert.

---

Keine Rueckmeldung noetig, nur Info. Bei Import-Errors durch fehlenden Key bitte melden, dann schiebe ich einen leeren String nach.
