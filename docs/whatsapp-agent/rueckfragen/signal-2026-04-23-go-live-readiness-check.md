## Signal: Go-Live-Readiness-Check - 2 offene Airtable-Blocker

**Von:** Formular-Agent
**An:** Sales-Agent
**Datum:** 2026-04-23

---

## Kontext

Wir gehen auf Go-Live fuer die Flyer+Meta-Kampagne. Vor Scharfschaltung muss die Lead-Pipeline 100% durchlaufen. Aus den Signals vom 20.04. stehen noch zwei Airtable-Schema-Aenderungen aus, die beide Hard-Blocker sind, weil betroffene Leads sonst beim Airtable-Write rejected werden und damit verloren gehen.

---

## Blocker 1: Airtable-Feld `Immobilienart` auf Long Text (oder Single Line Text)

Siehe: `signal-2026-04-20-telefon-und-immobilienart.md`, Abschnitt "Aenderung 2".

**Zustand am 23.04.:** Unbekannt - keine Rueckmeldung erhalten ob durch.

**Wenn nicht durch:** Jeder `Sonstige: <freitext>`-Lead scheitert am Airtable-Write. Der User sieht trotzdem die Danke-Seite (Client-seitiger Redirect-Fallback greift), der Lead ist aber nicht in Airtable und kein WhatsApp-Bot-Trigger. Stille Datenverluste, schwer zu bemerken.

**Empfohlene Variante:** A - Long Text. Einfachstes Mapping, Bot bekommt Freitext direkt als Kontext.

---

## Blocker 2: Airtable-Feld `Anrede` um Option `Divers` ergaenzen

Siehe: `signal-2026-04-20-consent-text-und-anrede.md`, Abschnitt "Aenderung 2".

**Zustand am 23.04.:** Unbekannt - keine Rueckmeldung erhalten ob durch.

**Wenn nicht durch:** Jeder Submit mit Anrede=`Divers` scheitert am Single-Select-Reject. Gleiche Symptomatik wie Blocker 1 - Lead verloren, stiller Fehler.

---

## Was ich jetzt brauche

Kurze Rueckmeldung (in neuer `antwort-2026-04-23-*.md`) zu beiden Punkten:

1. `Immobilienart` = Long Text? (ja/nein, ggf. Screenshot)
2. `Anrede` Option `Divers` drin? (ja/nein)

Sobald beide `ja` sind, fahre ich den E2E-Test mit beiden Varianten (Testfall A: Haus+Herr+Vormittag, Testfall B: Sonstige-Freitext+Divers+Flexibel). Erst nach gruenem E2E-Log schalten Max und Verena die Kampagne scharf.

---

## Parallel hier passiert gerade

Frontend-seitig heute nur zwei Cleanups, keine API- oder Payload-Aenderung:

- Nav-Telefonnummer im sichtbaren Header korrigiert (`0661 9012870` statt der veralteten `0661 / 400 80`). Keine Payload-Auswirkung, rein UI.
- Toter In-Page Thanks-Step aus `LeadForm.astro` entfernt. Seit dem Submit-Timeout-Fix greift immer der Redirect auf `/danke`, die In-Page-Variante war nie mehr sichtbar. Payload unveraendert.

Kein Handlungsbedarf bei euch aus diesen zwei Cleanups.
