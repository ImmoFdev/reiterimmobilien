const CONSENT_KEY = 'reiter_cookie_consent';

function getConsent(): string | null {
  return localStorage.getItem(CONSENT_KEY);
}

function setConsent(value: 'accepted' | 'declined') {
  localStorage.setItem(CONSENT_KEY, value);
}

const banner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('cookie-accept');
const declineBtn = document.getElementById('cookie-decline');

if (!getConsent() && banner) {
  banner.classList.add('visible');
}

if (getConsent() === 'accepted') {
  loadMetaPixel();
}

acceptBtn?.addEventListener('click', () => {
  setConsent('accepted');
  banner?.classList.remove('visible');
  loadMetaPixel();
});

declineBtn?.addEventListener('click', () => {
  setConsent('declined');
  banner?.classList.remove('visible');
});

function loadMetaPixel() {
  const PIXEL_ID = 'DEINE_PIXEL_ID';
  if (PIXEL_ID === 'DEINE_PIXEL_ID') return;

  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0';
    n.queue = [];
    t = b.createElement(e); t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq?.('init', PIXEL_ID);
  window.fbq?.('track', 'PageView');
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}
