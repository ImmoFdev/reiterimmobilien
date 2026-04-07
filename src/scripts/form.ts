const form = document.getElementById('lead-form') as HTMLFormElement;
if (!form) throw new Error('Form not found');

const WEBHOOK_URL = 'https://DEINE-N8N-INSTANCE.app/webhook/reiter-lp';

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

// Validation
function validateStep(step: number): boolean {
  clearErrors();

  if (step === 1) {
    let valid = true;
    const art = form.querySelector('input[name="immobilienart"]:checked') as HTMLInputElement;
    if (!art) {
      showError('immobilienart', 'Bitte wählen Sie eine Immobilienart.');
      valid = false;
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
    return valid;
  }

  if (step === 3) {
    const checkbox = form.querySelector('#datenschutz') as HTMLInputElement;
    if (!checkbox.checked) {
      showError('datenschutz', 'Bitte stimmen Sie der Datenschutzerklärung zu.');
      return false;
    }
    return true;
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

// Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep(3)) return;

  const tsInput = form.querySelector('input[name="timestamp"]') as HTMLInputElement;
  if (tsInput) tsInput.value = new Date().toISOString();

  const formData = new FormData(form);
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (key !== 'datenschutz') data[key] = value.toString();
  });

  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Wird gesendet...';

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }

    showStep('thanks');
  } catch {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Erstgespräch anfragen \u2713';
    alert('Es gab einen Fehler. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.');
  }
});

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
