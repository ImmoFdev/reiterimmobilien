import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/min';

const form = document.getElementById('lead-form') as HTMLFormElement;
if (!form) throw new Error('Form not found');

// Same-origin Endpoint: Cloudflare Pages Function proxyt zum n8n-Webhook
// und merged die Client-IP serverseitig in den Payload.
const WEBHOOK_URL = '/api/lead-submit';

// Hartcap fuer den Submit-Request. Wenn n8n den Respond-Node erst am Ende
// seines Workflows (Airtable + Bot) feuert, haengt die Response mehrere
// Sekunden. Nach Ablauf brechen wir ab und leiten trotzdem weiter - der
// Lead ist beim Server zu dem Zeitpunkt bereits empfangen.
const SUBMIT_TIMEOUT_MS = 5000;

// Muss 1:1 zur Checkbox-Beschriftung in LeadForm.astro passen (DSGVO-Audit-Trail).
const CONSENT_TEXT =
  'Ich willige ein, dass Reiter Immobilien mich per WhatsApp und Telefon zu meiner Immobilienbewertung kontaktiert. Diese Einwilligung kann ich jederzeit formlos widerrufen (z.B. per WhatsApp-Nachricht oder an info@reiter-immobilien.net).';

// UTM Hidden Fields
function fillHiddenFields() {
  const params = new URLSearchParams(window.location.search);
  const setField = (name: string, value: string) => {
    const input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (input) input.value = value;
  };
  setField('utm_source', params.get('utm_source') || '');
  setField('utm_medium', params.get('utm_medium') || '');
  setField('utm_campaign', params.get('utm_campaign') || '');
  setField('page_url', window.location.href);
  setField('timestamp', new Date().toISOString());
}
fillHiddenFields();

// Step Navigation
let currentStep = 1;

function showStep(step: number | string) {
  form.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  const target = form.querySelector(`.form-step[data-step="${step}"]`);
  target?.classList.add('active');

  document.querySelectorAll('.progress-step').forEach(el => {
    const s = Number(el.getAttribute('data-step'));
    el.classList.remove('active', 'done');
    if (typeof step === 'number') {
      if (s === step) el.classList.add('active');
      if (s < step) el.classList.add('done');
    } else {
      el.classList.add('done');
    }
  });

  const lines = document.querySelectorAll('.progress-line-fill') as NodeListOf<HTMLElement>;
  const stepNum = typeof step === 'number' ? step : 4;
  lines.forEach((line, i) => {
    line.style.width = stepNum > i + 1 ? '100%' : '0';
  });
}

form.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest('[data-next], [data-prev]') as HTMLElement;
  if (!btn) return;

  const next = btn.getAttribute('data-next');
  const prev = btn.getAttribute('data-prev');

  if (next) {
    if (!validateStep(currentStep)) return;
    currentStep = Number(next);
    showStep(currentStep);
  }
  if (prev) {
    currentStep = Number(prev);
    showStep(currentStep);
  }
});

// Freitext-Feld fuer "Sonstige" ein-/ausblenden.
const sonstigeWrapper = form.querySelector('#sonstige-wrapper') as HTMLElement | null;
const sonstigeInput = form.querySelector('#immobilienart_sonstige') as HTMLInputElement | null;
form.querySelectorAll<HTMLInputElement>('input[name="immobilienart"]').forEach(radio => {
  radio.addEventListener('change', () => {
    if (!sonstigeWrapper || !sonstigeInput) return;
    if (radio.checked && radio.value === 'Sonstige') {
      sonstigeWrapper.hidden = false;
      sonstigeInput.focus();
    } else if (radio.checked) {
      sonstigeWrapper.hidden = true;
      sonstigeInput.value = '';
      sonstigeInput.classList.remove('error');
    }
  });
});

// Validation
function validateStep(step: number): boolean {
  clearErrors();

  if (step === 1) {
    let valid = true;
    const art = form.querySelector('input[name="immobilienart"]:checked') as HTMLInputElement;
    if (!art) {
      showError('immobilienart', 'Bitte wählen Sie eine Immobilienart.');
      valid = false;
    } else if (art.value === 'Sonstige') {
      const sonstigeInput = form.querySelector('#immobilienart_sonstige') as HTMLInputElement;
      if (!sonstigeInput.value.trim()) {
        showError('immobilienart_sonstige', 'Bitte beschreiben Sie die Immobilie kurz.');
        sonstigeInput.classList.add('error');
        valid = false;
      }
    }
    const plz = (form.querySelector('#plz') as HTMLInputElement).value.trim();
    if (!/^\d{5}$/.test(plz)) {
      showError('plz', 'Bitte geben Sie eine gültige 5-stellige PLZ ein.');
      valid = false;
    }
    return valid;
  }

  if (step === 2) {
    let valid = true;
    const anrede = form.querySelector('input[name="anrede"]:checked') as HTMLInputElement;
    if (!anrede) {
      showError('anrede', 'Bitte wählen Sie eine Anrede.');
      valid = false;
    }
    const fields = ['vorname', 'nachname', 'telefon', 'email'] as const;
    for (const name of fields) {
      const input = form.querySelector(`#${name}`) as HTMLInputElement;
      if (!input.value.trim()) {
        showError(name, 'Pflichtfeld');
        input.classList.add('error');
        valid = false;
      }
    }
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    if (email && !email.includes('@')) {
      showError('email', 'Bitte geben Sie eine gültige E-Mail ein.');
      (form.querySelector('#email') as HTMLInputElement).classList.add('error');
      valid = false;
    }
    const telefonInput = form.querySelector('#telefon') as HTMLInputElement;
    const telefonRaw = telefonInput.value.trim();
    if (telefonRaw && !isValidPhoneNumber(telefonRaw, 'DE')) {
      showError('telefon', 'Bitte geben Sie eine gültige Telefonnummer ein.');
      telefonInput.classList.add('error');
      valid = false;
    }
    const erreichbarkeit = form.querySelector('input[name="erreichbarkeit"]:checked') as HTMLInputElement;
    if (!erreichbarkeit) {
      showError('erreichbarkeit', 'Bitte wählen Sie eine Option.');
      valid = false;
    }
    return valid;
  }

  if (step === 3) {
    let valid = true;
    const datenschutz = form.querySelector('#datenschutz') as HTMLInputElement;
    if (!datenschutz.checked) {
      showError('datenschutz', 'Bitte stimmen Sie der Datenschutzerklärung zu.');
      valid = false;
    }
    const consent = form.querySelector('#whatsapp_consent') as HTMLInputElement;
    if (!consent.checked) {
      showError('whatsapp_consent', 'Bitte bestätigen Sie die WhatsApp-Einwilligung.');
      valid = false;
    }
    return valid;
  }

  return true;
}

function showError(field: string, message: string) {
  const el = form.querySelector(`[data-error="${field}"]`);
  if (el) el.textContent = message;
}

function clearErrors() {
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// WhatsApp-Consent: Timestamp setzen + Submit-Button enable/disable
const consentCheckbox = form.querySelector('#whatsapp_consent') as HTMLInputElement;
const submitBtn = form.querySelector('#lead-submit-btn') as HTMLButtonElement;
const consentTimestampField = form.querySelector('input[name="consent_timestamp"]') as HTMLInputElement;

if (consentCheckbox && submitBtn) {
  consentCheckbox.addEventListener('change', () => {
    if (consentCheckbox.checked) {
      consentTimestampField.value = new Date().toISOString();
      submitBtn.disabled = false;
    } else {
      consentTimestampField.value = '';
      submitBtn.disabled = true;
    }
  });
}

// Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep(3)) return;

  const tsInput = form.querySelector('input[name="timestamp"]') as HTMLInputElement;
  if (tsInput) tsInput.value = new Date().toISOString();

  // FormData einsammeln. `datenschutz` ist nur clientseitige Validierung
  // und wird NICHT mitgeschickt. `whatsapp_consent` wird von FormData als
  // "on" geliefert und unten explizit in echten Boolean umgewandelt.
  const formData = new FormData(form);
  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (key === 'datenschutz') return;
    if (key === 'whatsapp_consent') return; // wird separat als Boolean gesetzt
    data[key] = value.toString();
  });

  data.whatsapp_consent = consentCheckbox?.checked === true;
  data.consent_text = CONSENT_TEXT;

  // Bei "Sonstige" den Freitext in das immobilienart-Feld mergen und das
  // separate Feld aus dem Payload entfernen. So bleibt das Backend-Mapping
  // simpel (ein String-Feld, Bot kann direkt Bezug nehmen).
  if (data.immobilienart === 'Sonstige' && typeof data.immobilienart_sonstige === 'string') {
    const freitext = data.immobilienart_sonstige.trim();
    if (freitext) {
      data.immobilienart = `Sonstige: ${freitext}`;
    }
  }
  delete data.immobilienart_sonstige;

  // Telefonnummer auf E.164 normalisieren (z.B. +4917612345678).
  // Saubere Eingabe fuer Airtable + WhatsApp-Bot, statt "0176 / 1234 5678".
  try {
    const parsed = parsePhoneNumber(String(data.telefon ?? ''), 'DE');
    if (parsed?.isValid()) {
      data.telefon = parsed.format('E.164');
    }
  } catch {
    // Fallback: original value bleibt, Validierung hat die Nummer eh schon gecheckt
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Wird gesendet...';

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    window.location.href = '/danke';
  } catch (err) {
    window.clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      window.location.href = '/danke';
      return;
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Erstgespräch anfragen \u2713';
    alert('Es gab einen Fehler. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.');
  }
});
