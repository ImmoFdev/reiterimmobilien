  ▎ Hallo, kurzer Verifizierungs-Check für die Webhook-Integration des Eigentümer-Formulars auf
  ▎ verkauf.reiter-immobilien.net. Bitte antworte kurz zu folgenden Punkten:
  ▎
  ▎ 1. Webhook-URL
  ▎ Welche genaue URL rufst du beim Formular-Submit auf? Ich erwarte:
  ▎ https://n8n.max-mp.de/webhook/reiterimmobilien-eigentuemer-lead
  ▎ Falls du eine andere (z.B. ...-eigentuemer-import) integriert hast, bitte umstellen.
  ▎
  ▎ 2. Payload-Felder
  ▎ Schicke mir bitte ein Beispiel-Payload (1 kompletter JSON-Submit), den dein Formular
  ▎ rausschickt, damit ich gegen die Spec vergleichen kann. Ich erwarte unter anderem diese
  ▎ Felder: token (= ri-eigent-8f3k2m), website (Honeypot, leer), anrede (Herr oder Frau),
  ▎ vorname, nachname, telefon, whatsapp_consent (true), consent_timestamp (ISO 8601),
  ▎ consent_ip, consent_text (exakter Wortlaut), optional email, immobilienart, plz, nachricht.
  ▎
  ▎ 3. Consent-Text
  ▎ Welchen genauen Text verwendest du in der Consent-Checkbox? Der muss wortwörtlich in
  ▎ consent_text des Payloads landen. Bitte den String 1:1 rüberschicken.
  ▎
  ▎ 4. IP-Capture
  ▎ Setzt du consent_ip serverseitig (z.B. aus x-forwarded-for eines Proxies) oder clientseitig?
  ▎ Falls clientseitig: wird ein externer Service wie ipify genutzt?
  ▎
  ▎ 5. Zwei Sanity-Checks
  ▎ a) Ist die Anrede-Auswahl im Formular auf nur Herr und Frau limitiert (keine Neutral-Option)?
  ▎ b) Ist der Submit-Button disabled, solange die Consent-Checkbox nicht gesetzt ist?
  ▎
  ▎ Sobald ich die fünf Antworten habe, kann ich final grünes Licht für den E2E-Test geben.