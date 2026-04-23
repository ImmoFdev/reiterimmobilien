# Go-Live Plan Reiter Immobilien LP

Ziel: LP produktionsreif fuer Flyer + Meta-Kampagne. Jede Session hat klaren Scope und endet mit Commit oder Dokument. Keine Session erzeugt Kontext-Overhead fuer die naechste.

**Start-Prompt pro Session:** `Session X starten. Plan lesen: docs/go-live-plan.md. Nur Scope dieser Session bearbeiten.`

---

## Session 1 – Quick Fixes + Sales-Agent-Signale
**Dauer:** ~15 Min | **Context:** klein

**Scope:**
1. `src/components/Nav.astro:10` Telefonnummer auf `0661 9012870` + href `tel:+4966190128700`
2. Toter Code raus: alte In-Page Thanks-Section in `LeadForm.astro`
3. Signal an Sales-Agent (`docs/whatsapp-agent/rueckfragen/`) mit 2 Forderungen:
   - Airtable-Feld `Immobilienart` → Long Text (sonst reject "Sonstige: X")
   - Airtable-Feld `Anrede` → Option "Divers" ergaenzen
4. Commit + Push (nach Freigabe)

**Definition of Done:** Nav zeigt richtige Nummer im Live-Build. Signal-Datei existiert. Commits in master.

---

## Session 2 – E2E-Test Lead-Pipeline
**Dauer:** ~30 Min | **Context:** mittel (viel Tool-Output)

**Scope:** Ein echter Submit pro Variante durchspielen, Pipeline verifizieren.
- Testfall A: Haus + Anrede Herr + Erreichbarkeit Vormittag
- Testfall B: Sonstige-Freitext + Anrede Divers + Erreichbarkeit Flexibel
- Pro Fall pruefen: Airtable-Record korrekt, WhatsApp-Bot triggert, Redirect auf /danke, Meta-Pixel `Lead`-Event feuert (Facebook Events Manager)

**Voraussetzung:** Session 1 done, Sales-Agent hat Airtable-Felder umgestellt.

**Definition of Done:** Beide Testfaelle landen sauber in Airtable + WhatsApp-Bot nimmt Kontakt auf. Pixel-Event bestaetigt. Ergebnis-Log in `docs/e2e-test-2026-04-XX.md`.

---

## Session 3 – AV-Vertrag erstellen
**Dauer:** ~20 Min | **Context:** klein (nur Textarbeit)

**Scope:** AV-Vertrag nach Art. 28 DSGVO zwischen Max.Marketing (Auftragsverarbeiter) und Reiter Immobilien GmbH (Verantwortlicher) als Word-Dokument.
- Leistungsbeschreibung: Lead-Verarbeitung ueber n8n.max-mp.de + Airtable
- Kategorien betroffener Personen + Datenarten
- TOMs-Anhang (Verschluesselung, Zugriffskontrolle, etc.)
- Unterauftragsverarbeiter-Liste (Airtable, Cloudflare, n8n-Host)

**Definition of Done:** `docs/legal/AV-Vertrag-Reiter-Entwurf.docx` existiert, Max prueft, geht an Verena zur Unterschrift.

---

## Session 4 – DPA-Check externe Dienste
**Dauer:** ~20 Min | **Context:** klein (Web-Recherche)

**Scope:** DPAs aktivieren bzw. Nachweise sichern fuer:
- **Airtable:** Business Plan DPA im Account aktivieren, Screenshot speichern
- **Cloudflare:** DPA ist default, PDF ziehen aus Dashboard
- **Meta Business Manager:** Data Processing Agreement fuer EU akzeptieren (falls nicht schon)
- **n8n (self-hosted bei Max):** TOMs intern dokumentieren, gehoert in AV-Anhang

**Definition of Done:** Alle 4 Nachweise in `docs/legal/dpa/` abgelegt.

---

## Session 5 – GTM Consent Mode v2 (nur wenn Google Ads geplant)
**Dauer:** ~30 Min | **Context:** mittel

**Scope:** Consent Mode v2 im GTM-Container `GTM-MCX7KF2P` konfigurieren.
- Default Consent = denied fuer alle Kategorien
- Update Consent ueber Cookie-Banner-Event triggern
- Google Tag (GA4/Ads) nur bei `ad_storage granted` feuern
- Testen im GTM-Preview-Modus

**Skip-Bedingung:** Wenn nur Meta-Ads laufen und kein Google Ads/Analytics geplant, Session streichen und als Nice-to-have schieben.

**Definition of Done:** Consent Mode v2 aktiv in GTM, Preview-Test gruen.

---

## Session 6 – Final Go-Live Check
**Dauer:** ~15 Min | **Context:** klein

**Scope:** Letzter Durchlauf vor Kampagnen-Scharfschaltung.
- Lighthouse-Check (Performance, Accessibility, SEO) – Werte dokumentieren, kein Hard-Block
- Mobile + Desktop manuell durchklicken
- Cookie-Banner + Consent-Verhalten testen
- Impressum + Datenschutz final lesen
- Max + Verena geben GO

**Definition of Done:** Kampagne kann scharfgeschaltet werden. Kurzer Go-Live-Report in `docs/go-live-report.md`.

---

## Nach Go-Live (separate Sessions, kein Blocker)
- **Modernisierungs-Runde:** Seite weicher/moderner machen
- **Token-Haertung:** Env-Var statt Client-Bundle
- **Lighthouse-Optimierung:** WebP, Responsive Images
- **Content-Refresh:** Hero-Video, Portraet Verena, echte Google-Rezensionen
- **Consent-Text SSOT:** Single Source of Truth fuer Consent-Wording

---

## Arbeitsweise
- **Immer nur eine Session pro Chat.** Vorherige Sessions sind in git-Log + Commit-Messages dokumentiert, nicht im Kontext.
- **Subagents nutzen** fuer Recherche/Legal-Recherche/Code-Reviews. Hauptchat bleibt schlank.
- **Memory-Update** nur in Session 1 und Session 6 (Start + Abschluss), dazwischen lebt der Status in diesem Dokument.
