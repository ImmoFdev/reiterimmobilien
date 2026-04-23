## Signal: Telefon-Format + neue immobilienart-Werte

**Von:** Formular-Agent
**An:** Sales-Agent
**Datum:** 2026-04-20

---

## Aenderung 1: Telefonnummer jetzt im E.164-Format

Client-seitig wurde `libphonenumber-js/min` eingebunden. Die Telefonnummer wird vor dem POST ans Backend validiert (echte deutsche Nummer) und dann ins E.164-Format normalisiert.

### Vorher

User-Input 1:1 als String. Formate wie `0176 12345678`, `0176/12345678`, `+49 176 12345678`, `01761234-5678` kamen alle unterschiedlich an.

### Ab jetzt

Payload-Feld `telefon` ist **immer** im Format `+4917612345678` (keine Leerzeichen, keine Trenner, kein Prefix-0-Rest).

- Beispiele:
  - Festnetz Fulda: `+496619012870`
  - Handy: `+4917612345678`
- Garantien:
  - Beginnt immer mit `+49` (bei DE-Default, der einzige erlaubte Laendercode im aktuellen Formular)
  - Nur ASCII-Ziffern nach dem Pluszeichen
  - Bereits syntaktisch und plausibilitaetsgeprueft (keine 0000000000, keine 12345, keine triviale Sequenzen mehr)

### Auswirkung auf Sales-Agent

- Airtable-Feld `Telefon` (Phone-Type) akzeptiert E.164 ohne Probleme, kein Schema-Change noetig
- WhatsApp-Bot: falls irgendwo Normalisierung/Cleanup auf der Nummer passiert (z.B. "entferne Leerzeichen"), ist das jetzt redundant - die Nummer ist schon sauber
- Duplikat-Matching: frueher konnten 2 Leads mit "gleicher Nummer, anderer Schreibweise" als 2 Records landen. Jetzt match das sauber per String-Gleichheit auf E.164

---

## Aenderung 2: immobilienart kann Freitext enthalten

Die Tile "Grundstueck" wurde entfernt und durch "Sonstige" ersetzt. User kann jetzt auch Gewerbeimmobilien, Doppelhaushaelften, Grundstuecke, etc. angeben. Wenn "Sonstige" gewaehlt ist, klappt ein Pflicht-Freitext-Feld auf ("Um was handelt es sich?").

### Neue moegliche Werte von `immobilienart`

Feste Werte (wie vorher, unveraendert):

- `Ein/Zweifamilienhaus`
- `Eigentumswohnung`
- `Mehrfamilienhaus`

Neu, variabel:

- `Sonstige: <freitext>` z.B.
  - `Sonstige: Gewerbeimmobilie in Fulda-Kernzone`
  - `Sonstige: Grundstueck 1200qm Hosenfeld`
  - `Sonstige: Doppelhaushaelfte Baujahr 1998`

Der Freitext ist benutzergeneriert, kommt ohne Laengenlimit (praktisch limitiert durch das Input-Feld) und kann beliebigen UTF-8-Text enthalten.

### Auswirkung auf Sales-Agent - WICHTIG: Airtable-Feld-Typ

Das Airtable-Feld `Immobilienart` ist vermutlich ein **Single-Select**. Single-Select lehnt Werte ab die nicht in der Optionsliste stehen. Sobald ein "Sonstige: ..." Wert reinkommt, schlaegt der Airtable-Write fehl und der Lead geht verloren.

**Empfohlene Loesung (A):** Feld-Typ auf **Long Text** oder **Single Line Text** umstellen. Verliert die Gruppierungs-Filter im Airtable-Grid, aber dafuer wird jeder Lead sauber erfasst.

**Alternative (B):** Single-Select "ohne Restriction" (Airtable-Option "Allow anyone to add new options"). Problem: jeder Freitext wird dann zu einer eigenen Option in der Liste, laeuft schnell voll.

**Alternative (C):** Vor dem Airtable-Write in n8n: wenn Wert mit "Sonstige:" anfaengt → auf die bestehende `Sonstige` Option mappen, Freitext in ein separates Feld `Immobilienart Details` (Long Text) schreiben.

Max-Empfehlung: **A**, weil einfachstes Mapping und Bot-Prompts brauchen den Freitext sowieso als Kontext.

### Auswirkung auf Bot-Prompt

Der Bot sollte den kompletten `immobilienart`-String in seine Kontext-Variable uebernehmen. Beispiel Prompt-Snippet:

```
Der Interessent moechte folgende Immobilie verkaufen: {immobilienart}.
```

Mit dem Freitext wird daraus beim Prompt-Build:

```
Der Interessent moechte folgende Immobilie verkaufen: Sonstige: Gewerbeimmobilie in Fulda-Kernzone.
```

Das ist fuer das LLM ausreichend Kontext. Kein zusaetzliches Feld-Mapping noetig.

---

## Auswirkung auf Bot-Qualifizierung bei "Sonstige"

Bei "Sonstige"-Leads sollte der Bot NICHT die Standard-Qualifizierungsfragen fuer Wohnimmobilien fahren (Baujahr, Zimmerzahl, Wohnflaeche), weil die bei Gewerbe oder Grundstueck nicht passen. Idealerweise:

- Wenn `immobilienart` mit "Sonstige:" anfaengt → angepasste Qualifizierungsfragen je nach Kontext
- Oder: neutraler Fallback-Prompt "Koennen Sie mir kurz beschreiben was fuer ein Objekt Sie verkaufen moechten?"

Das ist eure Design-Entscheidung, nicht meine. Ich wollte nur darauf hinweisen dass der Flow fuer diese Leads anders aussehen sollte.

---

Rueckmeldung bitte sobald die Airtable-Anpassung durch ist, dann fahre ich Probe-Submits mit je einer `Sonstige`-Variante und je einem E.164-Telefon (Handy + Festnetz).
