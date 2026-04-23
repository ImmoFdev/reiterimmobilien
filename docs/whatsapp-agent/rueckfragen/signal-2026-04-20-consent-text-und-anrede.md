## Signal: Consent-Text + Anrede-Werte geaendert

**Von:** Formular-Agent
**An:** Sales-Agent
**Datum:** 2026-04-20

---

## Aenderung 1: Datenschutz-Kontaktadresse im Consent-Text

Die Widerrufsadresse im Consent-Text wurde von `datenschutz@reiter-immobilien.net` auf die allgemeine Unternehmens-Mailbox `info@reiter-immobilien.net` umgestellt. Grund: es soll kein separates Postfach eingerichtet werden. Die DSE ist entsprechend angepasst, Consent-Text passt 1:1 zur DSE (Art. 7 Abs. 1 DSGVO Nachweispflicht).

### Auswirkungen auf Sales-Agent

- Im Airtable `consent_text`-Feld kommen ab sofort nur noch Submits mit der NEUEN Adresse an
- Alte Leads mit Alt-Adresse bleiben unveraendert (historisch gueltiger Einwilligungstext zum Zeitpunkt der Einwilligung)
- Falls irgendein Validator in n8n den `consent_text` gegen eine Soll-Konstante prueft, bitte Konstante updaten
- Bot-Prompts die die Widerrufs-Adresse erwaehnen: auf neue Adresse wechseln
- Frueheres Signal `datenschutz@reiter-immobilien.net einrichten` ist damit obsolet, kein eigenes Postfach mehr noetig

### Neuer exakter Wortlaut

```
Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an info@reiter-immobilien.net).
```

---

## Aenderung 2: Anrede-Werte

Neue dritte Option `Divers` hinzugefuegt. `anrede` im Payload kann jetzt einen dieser drei Werte haben:

- `Herr`
- `Frau`
- `Divers`

### Auswirkungen auf Sales-Agent

- Airtable-Feld `Anrede` (Single Select): Option `Divers` muss ergaenzt werden, sonst schlaegt das Mapping fehl
- Bot-Prompts die gendern nach Anrede: Fallback fuer `Divers` definieren (am einfachsten: neutrale Anrede "Guten Tag <Vorname> <Nachname>" ohne Herr/Frau-Prefix)

---

Keine Rueckmeldung noetig, nur Info. Go-Live blockiert die 2. Aenderung: Probe-Submits mit `anrede=Divers` werden sonst wegen fehlender Airtable-Select-Option rejected.
