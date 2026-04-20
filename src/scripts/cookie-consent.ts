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
  loadGTM();
}

acceptBtn?.addEventListener('click', () => {
  setConsent('accepted');
  banner?.classList.remove('visible');
  loadMetaPixel();
  loadGTM();
});

declineBtn?.addEventListener('click', () => {
  setConsent('declined');
  banner?.classList.remove('visible');
});

function loadMetaPixel() {
  const PIXEL_ID = '949913624409939';

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
  trackRouteEvent();
}

// Route-spezifische Meta-Events. /formular = Funnel-Start (InitiateCheckout),
// /danke = Conversion (Lead). Wird sowohl beim initialen Pixel-Load als auch
// beim spaeteren Consent-Accept gefeuert, damit der Event auch dann ankommt,
// wenn der User den Consent erst auf der Ziel-Seite erteilt.
function trackRouteEvent() {
  const path = window.location.pathname;
  if (path.startsWith('/formular')) {
    window.fbq?.('track', 'InitiateCheckout');
  } else if (path.startsWith('/danke')) {
    window.fbq?.('track', 'Lead');
  }
}

function loadGTM() {
  const GTM_ID = 'GTM-MCX7KF2P';
  if ((window as any).google_tag_manager?.[GTM_ID]) return;

  (function(w: any, d: Document, s: string, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode?.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_ID);
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    dataLayer?: unknown[];
  }
}
