# Reiter Immobilien LP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Statische Astro Landing Page für Reiter Immobilien zur Verkäufer-Lead-Generierung mit Multistep-Formular, UTM-Tracking und Meta Pixel.

**Architecture:** Single-Page Astro Site mit Scoped CSS (kein Framework). 11 Sektionen als einzelne Astro-Komponenten. Multistep-Formular mit Vanilla JS (client-side). UTM-Tracking und Meta Pixel hinter Cookie-Consent. Formular-Submit geht an n8n Webhook (URL wird später eingetragen).

**Tech Stack:** Astro 5.x, Scoped CSS, Vanilla JS, Roboto WOFF2 self-hosted

---

## Dateistruktur

```
src/
  layouts/
    Layout.astro              — Base HTML, Head, Fonts, CSS Custom Properties
  components/
    Nav.astro                 — Sticky Navigation (dark)
    Hero.astro                — Split-Layout: Video + Content + Trust-Leiste
    WhyReiter.astro           — 3 USP-Karten
    SocialProof.astro         — Google Reviews (2 Karten)
    Homestaging.astro         — Vorher/Nachher Showcase
    References.astro          — 3er Grid Referenzobjekte
    InstagramVideos.astro     — 2 Video-Thumbnails
    Process.astro             — 4-Schritte Prozess
    LeadForm.astro            — Multistep-Formular Container
    FAQ.astro                 — Accordion
    Footer.astro              — 3-spaltig
    CookieConsent.astro       — Cookie-Banner für Meta Pixel
  scripts/
    form.ts                   — Multistep-Logik, Validierung, Submit
    tracking.ts               — UTM-Parsing, Meta Pixel Events
    cookie-consent.ts         — Consent-Logik, Pixel-Aktivierung
  pages/
    index.astro               — Hauptseite, importiert alle Komponenten
public/
  fonts/
    roboto-light.woff2        — Weight 300
    roboto-regular.woff2      — Weight 400
    roboto-medium.woff2       — Weight 500
    roboto-bold.woff2         — Weight 700
  images/
    placeholder-video.jpg     — Hero Video Thumbnail Platzhalter
    placeholder-homestaging-before.jpg
    placeholder-homestaging-after.jpg
    placeholder-ref-1.jpg
    placeholder-ref-2.jpg
    placeholder-ref-3.jpg
    placeholder-instagram-1.jpg
    placeholder-instagram-2.jpg
    play-button.svg           — Play-Overlay für Videos
    reiter-signet.svg         — Logo Signet (Platzhalter bis Verena liefert)
```

---

## Task 1: Astro-Projekt aufsetzen + Base Layout

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/layouts/Layout.astro`
- Create: `src/pages/index.astro`
- Create: `public/fonts/` (Roboto WOFF2 Dateien)

- [ ] **Step 1: Astro-Projekt initialisieren**

```bash
cd C:\Users\maxsc\Desktop\Projekte\Kundenprojekte\ReiterImmobilien-LP
npm create astro@latest . -- --template minimal --no-install --no-git
npm install
```

- [ ] **Step 2: Roboto Fonts herunterladen**

```bash
mkdir -p public/fonts
```

Roboto WOFF2 Dateien von Google Fonts CDN herunterladen (300, 400, 500, 700) und in `public/fonts/` ablegen. Dateinamen: `roboto-light.woff2`, `roboto-regular.woff2`, `roboto-medium.woff2`, `roboto-bold.woff2`.

- [ ] **Step 3: Layout.astro erstellen**

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Reiter Immobilien Fulda — Kostenloses Erstgespräch für Ihren Immobilienverkauf. Persönlich, transparent, mit kostenlosem Homestaging." />
  <title>{title}</title>

  <link rel="preload" href="/fonts/roboto-bold.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/roboto-light.woff2" as="font" type="font/woff2" crossorigin />

  <style is:global>
    @font-face {
      font-family: 'Roboto';
      src: url('/fonts/roboto-light.woff2') format('woff2');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Roboto';
      src: url('/fonts/roboto-regular.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Roboto';
      src: url('/fonts/roboto-medium.woff2') format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Roboto';
      src: url('/fonts/roboto-bold.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --dark: #2a2724;
      --light: #fafafa;
      --grey: #f4f3f2;
      --accent-pri: #d4cac3;
      --accent-sec: #a99d8f;
      --color-1: #b6aba3;
      --banner: #151312;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      color: var(--dark);
      background: var(--grey);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .section-label {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--accent-sec);
      margin-bottom: 0.5rem;
    }

    .section-headline {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      color: var(--dark);
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    .section-subtext {
      font-size: 1.05rem;
      font-weight: 300;
      color: var(--accent-sec);
      max-width: 600px;
      line-height: 1.6;
    }

    .section-padding {
      padding: 5rem 1.5rem;
    }

    .container {
      max-width: 1120px;
      margin: 0 auto;
    }

    .btn-primary {
      display: inline-block;
      background: var(--dark);
      color: var(--light);
      border: none;
      border-radius: 30px;
      padding: 0.85rem 2rem;
      font-family: 'Roboto', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-primary:hover {
      opacity: 0.85;
    }

    .btn-secondary {
      display: inline-block;
      background: transparent;
      border: 1px solid var(--accent-pri);
      border-radius: 30px;
      padding: 0.85rem 2rem;
      font-family: 'Roboto', sans-serif;
      font-size: 0.95rem;
      font-weight: 400;
      color: var(--accent-sec);
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-secondary:hover {
      border-color: var(--dark);
      color: var(--dark);
    }
  </style>
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 4: index.astro Skelett erstellen**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
---
<Layout title="Reiter Immobilien — Kostenloses Erstgespräch">
  <main>
    <p style="padding: 2rem; text-align: center;">Reiter Immobilien LP — Sektionen folgen</p>
  </main>
</Layout>
```

- [ ] **Step 5: Dev Server starten und prüfen**

```bash
npm run dev
```

Erwartung: Seite lädt auf `localhost:4321`, Roboto Font aktiv, CSS Custom Properties gesetzt.

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "feat: astro projekt setup mit base layout, fonts und css design system"
```

---

## Task 2: Navigation (sticky)

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Nav.astro erstellen**

```astro
---
// src/components/Nav.astro
---
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <!-- Signet Platzhalter bis Verena liefert -->
      <span class="nav-logo-text">REITER IMMOBILIEN</span>
    </a>
    <div class="nav-right">
      <a href="tel:+4966140080" class="nav-phone">0661 / 400 80</a>
      <a href="#formular" class="nav-cta">Kontakt aufnehmen</a>
    </div>
    <button class="nav-hamburger" aria-label="Menü öffnen" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--dark);
  }
  .nav-inner {
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    height: 70px;
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .nav-logo-text {
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    color: var(--light);
  }
  .nav-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .nav-phone {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--accent-pri);
  }
  .nav-cta {
    background: transparent;
    border: 1px solid var(--light);
    border-radius: 30px;
    padding: 0.5rem 1.25rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--light);
    transition: background 0.2s, color 0.2s;
  }
  .nav-cta:hover {
    background: var(--light);
    color: var(--dark);
  }
  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  .nav-hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--light);
    transition: transform 0.3s, opacity 0.3s;
  }

  @media (max-width: 767px) {
    .nav-right {
      display: none;
    }
    .nav-hamburger {
      display: flex;
    }
  }
</style>

<script>
  const hamburger = document.querySelector('.nav-hamburger');
  const navRight = document.querySelector('.nav-right');

  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    navRight?.classList.toggle('nav-right--open');
  });
</script>
```

- [ ] **Step 2: Mobile-Menu Styles ergänzen**

In Nav.astro innerhalb des `<style>` Blocks im `@media (max-width: 767px)` hinzufügen:

```css
.nav-right--open {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: var(--dark);
  padding: 1.5rem;
  gap: 1rem;
  border-top: 1px solid rgba(250,250,250,0.1);
}
```

- [ ] **Step 3: Nav in index.astro einbinden**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
---
<Layout title="Reiter Immobilien — Kostenloses Erstgespräch">
  <Nav />
  <main>
    <p style="padding: 2rem; text-align: center;">Sektionen folgen</p>
  </main>
</Layout>
```

- [ ] **Step 4: Visuell prüfen**

Dev Server: Sticky Nav oben, Logo links, Telefon + CTA rechts. Mobile: Hamburger sichtbar, toggle funktioniert.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "feat: sticky navigation mit mobile hamburger menu"
```

---

## Task 3: Hero Section (Split-Layout)

**Files:**
- Create: `src/components/Hero.astro`
- Create: `public/images/play-button.svg`
- Create: `public/images/placeholder-video.jpg`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Play-Button SVG erstellen**

```svg
<!-- public/images/play-button.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <circle cx="40" cy="40" r="40" fill="rgba(42,39,36,0.7)"/>
  <polygon points="32,24 32,56 58,40" fill="#fafafa"/>
</svg>
```

- [ ] **Step 2: Platzhalter-Bild für Video-Thumbnail**

Ein 800x600 Platzhalterbild erstellen (kann ein einfaches Bild sein oder via Platzhalter-Service). In `public/images/placeholder-video.jpg` ablegen.

- [ ] **Step 3: Hero.astro erstellen**

```astro
---
// src/components/Hero.astro
---
<section class="hero">
  <div class="hero-video">
    <div class="hero-video-wrapper">
      <img src="/images/placeholder-video.jpg" alt="Begrüßungsvideo Verena Reiter" loading="eager" width="640" height="480" />
      <button class="hero-play" aria-label="Video abspielen">
        <img src="/images/play-button.svg" alt="" width="80" height="80" />
      </button>
    </div>
  </div>
  <div class="hero-content">
    <div class="hero-content-inner">
      <p class="hero-subline">Reiter Immobilien &middot; Fulda &amp; Umgebung</p>
      <h1 class="hero-headline">Ihre Immobilie verdient den besten Verkauf.</h1>
      <p class="hero-subtext">Persönlich. Transparent. Mit kostenlosem Homestaging für den bestmöglichen Preis.</p>

      <div class="hero-trust">
        <div class="hero-trust-item">
          <span class="hero-trust-value">4,8 &#9733;</span>
          <span class="hero-trust-label">Google</span>
        </div>
        <div class="hero-trust-item">
          <span class="hero-trust-value">30+</span>
          <span class="hero-trust-label">Jahre Erfahrung</span>
        </div>
        <div class="hero-trust-item">
          <span class="hero-trust-value">100%</span>
          <span class="hero-trust-label">Persönlich</span>
        </div>
      </div>

      <a href="#formular" class="btn-primary">Kostenloses Erstgespräch sichern &rarr;</a>
    </div>
  </div>
</section>

<style>
  .hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - 70px);
  }
  .hero-video {
    background: var(--accent-pri);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }
  .hero-video-wrapper {
    position: relative;
    width: 100%;
    max-width: 480px;
    aspect-ratio: 4/3;
  }
  .hero-video-wrapper img:first-child {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .hero-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .hero-play:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
  .hero-content {
    background: var(--light);
    display: flex;
    align-items: center;
    padding: 3rem;
  }
  .hero-content-inner {
    max-width: 480px;
  }
  .hero-subline {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent-sec);
    margin-bottom: 1.25rem;
  }
  .hero-headline {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    line-height: 1.15;
    color: var(--dark);
    margin-bottom: 1rem;
  }
  .hero-subtext {
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--accent-sec);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  .hero-trust {
    display: flex;
    gap: 2rem;
    padding: 1.25rem 0;
    border-top: 1px solid var(--accent-pri);
    border-bottom: 1px solid var(--accent-pri);
    margin-bottom: 2rem;
  }
  .hero-trust-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .hero-trust-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--dark);
  }
  .hero-trust-label {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--accent-sec);
  }

  @media (max-width: 767px) {
    .hero {
      grid-template-columns: 1fr;
      min-height: auto;
    }
    .hero-video {
      padding: 2rem 1.5rem;
    }
    .hero-content {
      padding: 2.5rem 1.5rem;
    }
  }
</style>
```

- [ ] **Step 4: In index.astro einbinden**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---
<Layout title="Reiter Immobilien — Kostenloses Erstgespräch">
  <Nav />
  <main>
    <Hero />
  </main>
</Layout>
```

- [ ] **Step 5: Visuell prüfen**

Desktop: 50/50 Split, Video links auf Beige, Content rechts auf Weiß, Trust-Leiste mit Borders. Mobile: gestackt, Video oben.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro public/images/
git commit -m "feat: hero section mit split-layout, video placeholder und trust-leiste"
```

---

## Task 4: Warum Reiter (3 USP-Karten)

**Files:**
- Create: `src/components/WhyReiter.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: WhyReiter.astro erstellen**

```astro
---
// src/components/WhyReiter.astro
const usps = [
  {
    title: 'Kostenloses Homestaging',
    text: 'Ihre Immobilie wird optimal präsentiert. Der erste Eindruck entscheidet.',
  },
  {
    title: 'Rundum-Sorglos-Paket',
    text: 'Von der Bewertung bis zum Notartermin. Sie lehnen sich zurück.',
  },
  {
    title: 'Regionale Expertise',
    text: '30+ Jahre Erfahrung in Fulda, Petersberg & Hünfeld.',
  },
];
---
<section class="why section-padding" style="background: var(--grey);">
  <div class="container">
    <p class="section-label">Warum Reiter Immobilien?</p>
    <h2 class="section-headline">Drei Gründe, die den Unterschied machen</h2>
    <div class="why-grid">
      {usps.map((usp) => (
        <div class="why-card">
          <h3 class="why-card-title">{usp.title}</h3>
          <p class="why-card-text">{usp.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .why-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  .why-card {
    background: var(--light);
    padding: 2rem;
    border: 1px solid var(--accent-pri);
  }
  .why-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .why-card-text {
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--accent-sec);
    line-height: 1.6;
  }

  @media (max-width: 767px) {
    .why-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: In index.astro einbinden**

Import hinzufügen: `import WhyReiter from '../components/WhyReiter.astro';`
Nach `<Hero />` einfügen: `<WhyReiter />`

- [ ] **Step 3: Visuell prüfen**

3 Karten nebeneinander auf Desktop, gestackt auf Mobile. Grauer Hintergrund, weiße Karten.

- [ ] **Step 4: Commit**

```bash
git add src/components/WhyReiter.astro src/pages/index.astro
git commit -m "feat: warum reiter sektion mit 3 usp-karten"
```

---

## Task 5: Social Proof (Google Reviews)

**Files:**
- Create: `src/components/SocialProof.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: SocialProof.astro erstellen**

```astro
---
// src/components/SocialProof.astro
// Echte Rezensionen kommen von Verena (Aufgabenbogen). Platzhalter vorerst.
const reviews = [
  {
    text: 'Frau Reiter hat uns von Anfang bis Ende hervorragend begleitet. Absolut empfehlenswert!',
    author: 'M. Schmidt',
    stars: 5,
  },
  {
    text: 'Sehr professionell und persönlich. Die Immobilie war innerhalb weniger Wochen verkauft.',
    author: 'K. Weber',
    stars: 5,
  },
];
---
<section class="social-proof section-padding" style="background: var(--light);">
  <div class="container">
    <p class="section-label">Das sagen unsere Kunden</p>
    <h2 class="section-headline">4,8 von 5 Sternen auf Google</h2>
    <div class="reviews-grid">
      {reviews.map((review) => (
        <blockquote class="review-card">
          <div class="review-stars">{'★'.repeat(review.stars)}</div>
          <p class="review-text">&bdquo;{review.text}&ldquo;</p>
          <cite class="review-author">{review.author}</cite>
        </blockquote>
      ))}
    </div>
  </div>
</section>

<style>
  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  .review-card {
    background: var(--light);
    padding: 1.75rem;
    border-left: 3px solid var(--accent-pri);
  }
  .review-stars {
    color: var(--dark);
    font-size: 1rem;
    margin-bottom: 0.75rem;
    letter-spacing: 0.1em;
  }
  .review-text {
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.6;
    color: var(--dark);
    margin-bottom: 1rem;
  }
  .review-author {
    font-size: 0.85rem;
    font-weight: 500;
    font-style: normal;
    color: var(--accent-sec);
  }

  @media (max-width: 767px) {
    .reviews-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: In index.astro einbinden**

Import: `import SocialProof from '../components/SocialProof.astro';`
Nach `<WhyReiter />`: `<SocialProof />`

- [ ] **Step 3: Visuell prüfen + Commit**

```bash
git add src/components/SocialProof.astro src/pages/index.astro
git commit -m "feat: social proof sektion mit google reviews"
```

---

## Task 6: Homestaging Showcase

**Files:**
- Create: `src/components/Homestaging.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Platzhalter-Bilder erstellen**

Zwei Platzhalter-Bilder (600x400) in `public/images/` ablegen: `placeholder-homestaging-before.jpg`, `placeholder-homestaging-after.jpg`.

- [ ] **Step 2: Homestaging.astro erstellen**

```astro
---
// src/components/Homestaging.astro
---
<section class="homestaging section-padding" style="background: var(--grey);">
  <div class="container">
    <p class="section-label">Homestaging</p>
    <h2 class="section-headline">Der erste Eindruck entscheidet</h2>
    <p class="section-subtext">Kostenlos für Sie: Wir inszenieren Ihre Räume so, dass Käufer sich sofort zuhause fühlen.</p>
    <div class="homestaging-grid">
      <div class="homestaging-item">
        <span class="homestaging-badge">Vorher</span>
        <img src="/images/placeholder-homestaging-before.jpg" alt="Raum vor dem Homestaging" loading="lazy" width="600" height="400" />
      </div>
      <div class="homestaging-item">
        <span class="homestaging-badge">Nachher</span>
        <img src="/images/placeholder-homestaging-after.jpg" alt="Raum nach dem Homestaging" loading="lazy" width="600" height="400" />
      </div>
    </div>
  </div>
</section>

<style>
  .homestaging-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  .homestaging-item {
    position: relative;
    overflow: hidden;
  }
  .homestaging-item img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
  .homestaging-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--dark);
    color: var(--light);
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.35rem 0.85rem;
    border-radius: 30px;
  }

  @media (max-width: 767px) {
    .homestaging-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: In index.astro einbinden + Commit**

Import + einfügen nach `<SocialProof />`.

```bash
git add src/components/Homestaging.astro src/pages/index.astro public/images/placeholder-homestaging-*
git commit -m "feat: homestaging vorher/nachher sektion"
```

---

## Task 7: Referenzobjekte (3er Grid)

**Files:**
- Create: `src/components/References.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Platzhalter-Bilder erstellen**

Drei Platzhalter-Bilder (600x400) in `public/images/`: `placeholder-ref-1.jpg`, `placeholder-ref-2.jpg`, `placeholder-ref-3.jpg`.

- [ ] **Step 2: References.astro erstellen**

```astro
---
// src/components/References.astro
// Echte Referenzen kommen von Verena (Aufgabenbogen)
const references = [
  {
    image: '/images/placeholder-ref-1.jpg',
    title: 'Einfamilienhaus in Fulda',
    info: 'Verkauft in 4 Wochen',
  },
  {
    image: '/images/placeholder-ref-2.jpg',
    title: 'Eigentumswohnung in Petersberg',
    info: 'Über Angebotspreis verkauft',
  },
  {
    image: '/images/placeholder-ref-3.jpg',
    title: 'Mehrfamilienhaus in Hünfeld',
    info: 'Verkauft in 6 Wochen',
  },
];
---
<section class="references section-padding" style="background: var(--light);">
  <div class="container">
    <p class="section-label">Erfolge</p>
    <h2 class="section-headline">Erfolgreich vermittelt</h2>
    <div class="ref-grid">
      {references.map((ref) => (
        <div class="ref-card">
          <img src={ref.image} alt={ref.title} loading="lazy" width="600" height="400" />
          <div class="ref-info">
            <h3 class="ref-title">{ref.title}</h3>
            <p class="ref-detail">{ref.info}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .ref-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  .ref-card {
    overflow: hidden;
  }
  .ref-card img {
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: cover;
  }
  .ref-info {
    padding: 1.25rem 0 0;
  }
  .ref-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  .ref-detail {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--accent-sec);
  }

  @media (max-width: 767px) {
    .ref-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: In index.astro einbinden + Commit**

```bash
git add src/components/References.astro src/pages/index.astro public/images/placeholder-ref-*
git commit -m "feat: referenzobjekte 3er grid sektion"
```

---

## Task 8: Instagram Videos (Thumbnails)

**Files:**
- Create: `src/components/InstagramVideos.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Platzhalter-Bilder**

Zwei 9:16 Platzhalter (360x640) in `public/images/`: `placeholder-instagram-1.jpg`, `placeholder-instagram-2.jpg`.

- [ ] **Step 2: InstagramVideos.astro erstellen**

```astro
---
// src/components/InstagramVideos.astro
// Videos werden von Verena ausgewählt (Aufgabenbogen)
const videos = [
  {
    thumbnail: '/images/placeholder-instagram-1.jpg',
    title: 'So läuft ein Erstgespräch ab',
    link: 'https://www.instagram.com/reiterimmobilien/',
  },
  {
    thumbnail: '/images/placeholder-instagram-2.jpg',
    title: 'Homestaging in der Praxis',
    link: 'https://www.instagram.com/reiterimmobilien/',
  },
];
---
<section class="instagram section-padding" style="background: var(--grey);">
  <div class="container">
    <p class="section-label">Lernen Sie uns kennen</p>
    <h2 class="section-headline">Verena Reiter auf Instagram</h2>
    <p class="section-subtext">Schauen Sie sich an, wie wir arbeiten. Persönlich, nahbar und immer für Sie da.</p>
    <div class="insta-grid">
      {videos.map((video) => (
        <a href={video.link} target="_blank" rel="noopener noreferrer" class="insta-card">
          <img src={video.thumbnail} alt={video.title} loading="lazy" width="360" height="640" />
          <div class="insta-overlay">
            <img src="/images/play-button.svg" alt="" width="60" height="60" class="insta-play" />
          </div>
          <div class="insta-title-bar">
            <span>{video.title}</span>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

<style>
  .insta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
    max-width: 560px;
  }
  .insta-card {
    position: relative;
    overflow: hidden;
    aspect-ratio: 9/16;
    display: block;
  }
  .insta-card > img:first-child {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .insta-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(42,39,36,0.2);
    transition: background 0.2s;
  }
  .insta-card:hover .insta-overlay {
    background: rgba(42,39,36,0.4);
  }
  .insta-title-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem 1rem 1rem;
    background: linear-gradient(transparent, rgba(42,39,36,0.8));
    color: var(--light);
    font-size: 0.85rem;
    font-weight: 500;
  }

  @media (max-width: 767px) {
    .insta-grid {
      max-width: 100%;
    }
  }
</style>
```

- [ ] **Step 3: In index.astro einbinden + Commit**

```bash
git add src/components/InstagramVideos.astro src/pages/index.astro public/images/placeholder-instagram-*
git commit -m "feat: instagram video thumbnails sektion"
```

---

## Task 9: Prozess (4 Schritte)

**Files:**
- Create: `src/components/Process.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Process.astro erstellen**

```astro
---
// src/components/Process.astro
const steps = [
  { number: '1', title: 'Erstgespräch', text: 'Kennenlernen & Wünsche' },
  { number: '2', title: 'Bewertung', text: 'Marktgerechter Preis' },
  { number: '3', title: 'Vermarktung', text: 'Homestaging & Exposé' },
  { number: '4', title: 'Verkauf', text: 'Bis zum Notartermin' },
];
---
<section class="process section-padding" style="background: var(--light);">
  <div class="container">
    <p class="section-label">So läuft's ab</p>
    <h2 class="section-headline">In 4 Schritten zum erfolgreichen Verkauf</h2>
    <div class="process-grid">
      {steps.map((step) => (
        <div class="process-step">
          <div class="process-number">{step.number}</div>
          <h3 class="process-title">{step.title}</h3>
          <p class="process-text">{step.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .process-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-top: 2.5rem;
    text-align: center;
  }
  .process-number {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--dark);
    color: var(--light);
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }
  .process-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.35rem;
  }
  .process-text {
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--accent-sec);
  }

  @media (max-width: 767px) {
    .process-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

- [ ] **Step 2: In index.astro einbinden + Commit**

```bash
git add src/components/Process.astro src/pages/index.astro
git commit -m "feat: 4-schritte prozess sektion"
```

---

## Task 10: Multistep Lead-Formular

**Files:**
- Create: `src/components/LeadForm.astro`
- Create: `src/scripts/form.ts`
- Modify: `src/pages/index.astro`

Dies ist die komplexeste Komponente: 3-Step-Formular mit Progress-Bar, Kachel-Auswahl, Validierung, Hidden Fields und Submit an n8n Webhook.

- [ ] **Step 1: LeadForm.astro erstellen**

```astro
---
// src/components/LeadForm.astro
---
<section class="lead-form section-padding" id="formular" style="background: var(--grey);">
  <div class="container">
    <p class="section-label">Jetzt starten</p>
    <h2 class="section-headline">Kostenloses Erstgespräch vereinbaren</h2>
    <p class="section-subtext" style="margin-bottom: 2.5rem;">In nur 3 kurzen Schritten. Wir melden uns innerhalb von 24h persönlich.</p>

    <div class="form-container">
      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress-step active" data-step="1">
          <span class="progress-dot"></span>
          <span class="progress-label">Immobilie</span>
        </div>
        <div class="progress-line"><div class="progress-line-fill"></div></div>
        <div class="progress-step" data-step="2">
          <span class="progress-dot"></span>
          <span class="progress-label">Kontakt</span>
        </div>
        <div class="progress-line"><div class="progress-line-fill"></div></div>
        <div class="progress-step" data-step="3">
          <span class="progress-dot"></span>
          <span class="progress-label">Fertig</span>
        </div>
      </div>

      <form id="lead-form" novalidate>
        <!-- Hidden Fields -->
        <input type="hidden" name="utm_source" />
        <input type="hidden" name="utm_medium" />
        <input type="hidden" name="utm_campaign" />
        <input type="hidden" name="timestamp" />
        <input type="hidden" name="page_url" />

        <!-- Step 1: Immobilie -->
        <div class="form-step active" data-step="1">
          <h3 class="form-step-title">Erzählen Sie uns von Ihrer Immobilie</h3>
          <div class="tile-grid">
            <label class="tile">
              <input type="radio" name="immobilienart" value="Ein/Zweifamilienhaus" />
              <span class="tile-content">
                <span class="tile-icon">🏠</span>
                <span class="tile-label">Ein/Zweifamilienhaus</span>
              </span>
            </label>
            <label class="tile">
              <input type="radio" name="immobilienart" value="Eigentumswohnung" />
              <span class="tile-content">
                <span class="tile-icon">🏢</span>
                <span class="tile-label">Eigentumswohnung</span>
              </span>
            </label>
            <label class="tile">
              <input type="radio" name="immobilienart" value="Mehrfamilienhaus" />
              <span class="tile-content">
                <span class="tile-icon">🏘</span>
                <span class="tile-label">Mehrfamilienhaus</span>
              </span>
            </label>
            <label class="tile">
              <input type="radio" name="immobilienart" value="Grundstück" />
              <span class="tile-content">
                <span class="tile-icon">📐</span>
                <span class="tile-label">Grundstück</span>
              </span>
            </label>
          </div>
          <div class="form-field" style="margin-top: 1.5rem;">
            <label for="plz">Postleitzahl</label>
            <input type="text" id="plz" name="plz" placeholder="z.B. 36037" inputmode="numeric" maxlength="5" />
            <span class="form-error" data-error="plz"></span>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-primary" data-next="2">Weiter &rarr;</button>
          </div>
        </div>

        <!-- Step 2: Kontakt -->
        <div class="form-step" data-step="2">
          <h3 class="form-step-title">Wie erreichen wir Sie?</h3>
          <div class="form-row">
            <div class="form-field">
              <label for="vorname">Vorname</label>
              <input type="text" id="vorname" name="vorname" required />
              <span class="form-error" data-error="vorname"></span>
            </div>
            <div class="form-field">
              <label for="nachname">Nachname</label>
              <input type="text" id="nachname" name="nachname" required />
              <span class="form-error" data-error="nachname"></span>
            </div>
          </div>
          <div class="form-field">
            <label for="telefon">Telefon</label>
            <input type="tel" id="telefon" name="telefon" required />
            <span class="form-error" data-error="telefon"></span>
          </div>
          <div class="form-field">
            <label for="email">E-Mail</label>
            <input type="email" id="email" name="email" required />
            <span class="form-error" data-error="email"></span>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" data-prev="1">&larr; Zurück</button>
            <button type="button" class="btn-primary" data-next="3">Weiter &rarr;</button>
          </div>
        </div>

        <!-- Step 3: Fertig -->
        <div class="form-step" data-step="3">
          <h3 class="form-step-title">Fast geschafft! Möchten Sie uns noch etwas mitteilen?</h3>
          <div class="form-field">
            <label for="nachricht">Nachricht (optional)</label>
            <textarea id="nachricht" name="nachricht" rows="3" placeholder="z.B. bevorzugte Uhrzeit für den Rückruf..."></textarea>
          </div>
          <div class="form-field">
            <label class="checkbox-label">
              <input type="checkbox" id="datenschutz" name="datenschutz" required />
              <span>Ich stimme der <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> zu.</span>
            </label>
            <span class="form-error" data-error="datenschutz"></span>
          </div>
          <p class="form-hint">Ihre Daten werden vertraulich behandelt</p>
          <div class="form-actions">
            <button type="button" class="btn-secondary" data-prev="2">&larr; Zurück</button>
            <button type="submit" class="btn-primary">Erstgespräch anfragen &#10003;</button>
          </div>
        </div>

        <!-- Danke Screen -->
        <div class="form-step form-thanks" data-step="thanks">
          <div class="thanks-icon">&#10003;</div>
          <h3 class="form-step-title">Vielen Dank!</h3>
          <p class="thanks-text">Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen.</p>
        </div>
      </form>
    </div>
  </div>
</section>

<style>
  .form-container {
    background: var(--light);
    padding: 2.5rem;
    max-width: 640px;
    border: 1px solid var(--accent-pri);
  }

  /* Progress Bar */
  .progress-bar {
    display: flex;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .progress-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent-pri);
    transition: background 0.3s;
  }
  .progress-step.active .progress-dot,
  .progress-step.done .progress-dot {
    background: var(--dark);
  }
  .progress-label {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--accent-pri);
    transition: color 0.3s;
  }
  .progress-step.active .progress-label {
    font-weight: 500;
    color: var(--dark);
  }
  .progress-step.done .progress-label {
    color: var(--dark);
  }
  .progress-line {
    flex: 1;
    height: 3px;
    background: var(--accent-pri);
    margin: 0 0.5rem;
    margin-bottom: 1.5rem;
    position: relative;
  }
  .progress-line-fill {
    height: 100%;
    background: var(--dark);
    width: 0;
    transition: width 0.3s;
  }

  /* Steps */
  .form-step {
    display: none;
  }
  .form-step.active {
    display: block;
  }
  .form-step-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  /* Tile Grid */
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .tile input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .tile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem;
    border: 1px solid var(--accent-pri);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    text-align: center;
  }
  .tile input:checked + .tile-content {
    border-color: var(--dark);
    background: var(--grey);
  }
  .tile-icon {
    font-size: 1.5rem;
  }
  .tile-label {
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* Form Fields */
  .form-field {
    margin-bottom: 1rem;
  }
  .form-field label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--accent-sec);
    margin-bottom: 0.35rem;
  }
  .form-field input[type="text"],
  .form-field input[type="tel"],
  .form-field input[type="email"],
  .form-field textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    font-family: 'Roboto', sans-serif;
    font-size: 0.95rem;
    font-weight: 400;
    background: var(--grey);
    border: 1px solid var(--accent-pri);
    border-radius: 0;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-field input:focus,
  .form-field textarea:focus {
    border-color: var(--dark);
  }
  .form-field input.error,
  .form-field textarea.error {
    border-color: #c0392b;
  }
  .form-error {
    display: block;
    font-size: 0.75rem;
    color: #c0392b;
    margin-top: 0.25rem;
    min-height: 1rem;
  }

  /* Form Row (2-spaltig) */
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  /* Checkbox */
  .checkbox-label {
    display: flex !important;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.85rem !important;
    font-weight: 300 !important;
    color: var(--dark) !important;
    cursor: pointer;
  }
  .checkbox-label input {
    margin-top: 0.2rem;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .checkbox-label a {
    text-decoration: underline;
    color: var(--accent-sec);
  }

  .form-hint {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--accent-sec);
    margin-bottom: 1.5rem;
  }

  /* Actions */
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  /* Thanks */
  .form-thanks {
    text-align: center;
    padding: 2rem 0;
  }
  .thanks-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--dark);
    color: var(--light);
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }
  .thanks-text {
    font-size: 1rem;
    font-weight: 300;
    color: var(--accent-sec);
    margin-top: 0.75rem;
  }

  @media (max-width: 767px) {
    .form-container {
      padding: 1.5rem;
    }
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>

<script src="../scripts/form.ts"></script>
```

- [ ] **Step 2: form.ts erstellen (Multistep-Logik + Validierung + Submit)**

```typescript
// src/scripts/form.ts

const form = document.getElementById('lead-form') as HTMLFormElement;
if (!form) throw new Error('Form not found');

// n8n Webhook URL — wird später eingetragen
const WEBHOOK_URL = 'https://DEINE-N8N-INSTANCE.app/webhook/reiter-lp';

// --- UTM Hidden Fields befüllen ---
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

// --- Step Navigation ---
let currentStep = 1;

function showStep(step: number | string) {
  form.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  const target = form.querySelector(`.form-step[data-step="${step}"]`);
  target?.classList.add('active');

  // Progress Bar updaten
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

  // Progress Line Fills
  const lines = document.querySelectorAll('.progress-line-fill') as NodeListOf<HTMLElement>;
  const stepNum = typeof step === 'number' ? step : 4;
  lines.forEach((line, i) => {
    line.style.width = stepNum > i + 1 ? '100%' : '0';
  });
}

// Weiter/Zurück Buttons
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

// --- Validierung ---
function validateStep(step: number): boolean {
  clearErrors();

  if (step === 1) {
    let valid = true;
    const art = form.querySelector('input[name="immobilienart"]:checked') as HTMLInputElement;
    if (!art) {
      showError('plz', 'Bitte wählen Sie eine Immobilienart.');
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

// --- Submit ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep(3)) return;

  // Timestamp aktualisieren
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

    // Meta Pixel Lead Event
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }

    showStep('thanks');
  } catch {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Erstgespräch anfragen ✓';
    alert('Es gab einen Fehler. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.');
  }
});

// TypeScript: fbq auf Window deklarieren
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
```

- [ ] **Step 3: In index.astro einbinden**

Import: `import LeadForm from '../components/LeadForm.astro';`
Nach `<Process />`: `<LeadForm />`

- [ ] **Step 4: Visuell prüfen**

- Progress-Bar zeigt 3 Steps
- Kachel-Auswahl funktioniert (Radio-Buttons visuell)
- Weiter/Zurück navigiert zwischen Steps
- Validierung zeigt Fehlermeldungen
- Submit zeigt Danke-Screen (Webhook schlägt fehl weil URL Platzhalter, aber Danke-Screen muss kommen)

- [ ] **Step 5: Commit**

```bash
git add src/components/LeadForm.astro src/scripts/form.ts src/pages/index.astro
git commit -m "feat: multistep lead-formular mit validierung, utm tracking und webhook submit"
```

---

## Task 11: FAQ (Accordion)

**Files:**
- Create: `src/components/FAQ.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: FAQ.astro erstellen**

```astro
---
// src/components/FAQ.astro
// Antworten kommen von Verena (Aufgabenbogen). Platzhalter vorerst.
const faqs = [
  {
    question: 'Was kostet das Erstgespräch?',
    answer: 'Das Erstgespräch ist für Sie völlig kostenlos und unverbindlich. Wir nehmen uns Zeit, Ihre Situation zu verstehen und beraten Sie ehrlich.',
  },
  {
    question: 'Ist das Homestaging wirklich kostenlos?',
    answer: 'Ja. Wenn Sie uns mit dem Verkauf beauftragen, übernehmen wir die Kosten für das Homestaging komplett. Es ist unser Beitrag für den bestmöglichen Verkaufspreis.',
  },
  {
    question: 'Wie läuft die Immobilienbewertung ab?',
    answer: 'Wir besichtigen Ihre Immobilie, analysieren den aktuellen Markt in Ihrer Region und erstellen eine fundierte Wertermittlung. Das Ergebnis besprechen wir persönlich mit Ihnen.',
  },
  {
    question: 'Welche Region decken Sie ab?',
    answer: 'Unser Schwerpunkt liegt in Fulda, Petersberg, Hünfeld und Umgebung. Wir kennen den regionalen Markt seit über 30 Jahren.',
  },
];
---
<section class="faq section-padding" style="background: var(--light);">
  <div class="container">
    <p class="section-label">Häufige Fragen</p>
    <h2 class="section-headline">Wir beantworten Ihre Fragen</h2>
    <div class="faq-list">
      {faqs.map((faq) => (
        <details class="faq-item">
          <summary class="faq-question">{faq.question}</summary>
          <p class="faq-answer">{faq.answer}</p>
        </details>
      ))}
    </div>
  </div>
</section>

<style>
  .faq-list {
    max-width: 700px;
    margin-top: 2.5rem;
  }
  .faq-item {
    border-bottom: 1px solid var(--accent-pri);
  }
  .faq-question {
    padding: 1.25rem 0;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .faq-question::after {
    content: '+';
    font-size: 1.25rem;
    font-weight: 300;
    color: var(--accent-sec);
    transition: transform 0.2s;
  }
  .faq-item[open] .faq-question::after {
    content: '−';
  }
  .faq-question::-webkit-details-marker {
    display: none;
  }
  .faq-answer {
    padding: 0 0 1.25rem;
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--accent-sec);
    line-height: 1.6;
  }
</style>
```

- [ ] **Step 2: In index.astro einbinden + Commit**

```bash
git add src/components/FAQ.astro src/pages/index.astro
git commit -m "feat: faq accordion sektion mit details/summary"
```

---

## Task 12: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Footer.astro erstellen**

```astro
---
// src/components/Footer.astro
---
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <p class="footer-logo">REITER IMMOBILIEN</p>
        <p class="footer-text">Ihr Partner für den erfolgreichen Immobilienverkauf in der Region Fulda.</p>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Kontakt</h4>
        <p class="footer-text">Reiter Immobilien GmbH</p>
        <p class="footer-text">Fulda</p>
        <p class="footer-text"><a href="tel:+4966140080">0661 / 400 80</a></p>
        <p class="footer-text"><a href="mailto:info@reiter-immobilien.net">info@reiter-immobilien.net</a></p>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Rechtliches</h4>
        <p class="footer-text"><a href="https://www.reiter-immobilien.net/impressum" target="_blank" rel="noopener">Impressum</a></p>
        <p class="footer-text"><a href="/datenschutz">Datenschutzerklärung</a></p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Reiter Immobilien GmbH</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--accent-sec);
    padding: 3rem 1.5rem 1.5rem;
    color: var(--light);
  }
  .footer-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .footer-logo {
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    margin-bottom: 0.75rem;
  }
  .footer-heading {
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.75rem;
  }
  .footer-text {
    font-size: 0.85rem;
    font-weight: 300;
    line-height: 1.8;
    opacity: 0.85;
  }
  .footer-text a:hover {
    opacity: 1;
    text-decoration: underline;
  }
  .footer-bottom {
    border-top: 1px solid rgba(250,250,250,0.2);
    padding-top: 1rem;
    font-size: 0.75rem;
    font-weight: 300;
    opacity: 0.6;
  }

  @media (max-width: 767px) {
    .footer-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: In index.astro einbinden + Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: footer mit kontakt und rechtliches"
```

---

## Task 13: Cookie-Consent + Meta Pixel

**Files:**
- Create: `src/components/CookieConsent.astro`
- Create: `src/scripts/cookie-consent.ts`
- Create: `src/scripts/tracking.ts`
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: CookieConsent.astro erstellen**

```astro
---
// src/components/CookieConsent.astro
---
<div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Cookie-Einstellungen">
  <div class="cookie-inner">
    <p class="cookie-text">Wir nutzen Cookies zur Analyse unserer Besucherströme. Mit Ihrer Zustimmung helfen Sie uns, unser Angebot zu verbessern.</p>
    <div class="cookie-actions">
      <button class="btn-primary cookie-accept" id="cookie-accept">Akzeptieren</button>
      <button class="btn-secondary cookie-decline" id="cookie-decline">Ablehnen</button>
    </div>
  </div>
</div>

<style>
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: var(--dark);
    color: var(--light);
    padding: 1.25rem 1.5rem;
    display: none;
  }
  .cookie-banner.visible {
    display: block;
  }
  .cookie-inner {
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
  .cookie-text {
    font-size: 0.85rem;
    font-weight: 300;
    line-height: 1.5;
    flex: 1;
  }
  .cookie-actions {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
  }
  .cookie-actions .btn-primary,
  .cookie-actions .btn-secondary {
    padding: 0.6rem 1.25rem;
    font-size: 0.8rem;
  }
  .cookie-actions .btn-secondary {
    border-color: rgba(250,250,250,0.3);
    color: var(--light);
  }

  @media (max-width: 767px) {
    .cookie-inner {
      flex-direction: column;
      text-align: center;
    }
  }
</style>

<script src="../scripts/cookie-consent.ts"></script>
```

- [ ] **Step 2: cookie-consent.ts erstellen**

```typescript
// src/scripts/cookie-consent.ts

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

// Banner nur zeigen wenn noch keine Entscheidung
if (!getConsent() && banner) {
  banner.classList.add('visible');
}

// Bei bestehendem Consent Pixel direkt laden
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
  // Meta Pixel ID — wird später eingetragen
  const PIXEL_ID = 'DEINE_PIXEL_ID';
  if (PIXEL_ID === 'DEINE_PIXEL_ID') return; // Nicht laden wenn Platzhalter

  // fbq Snippet
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
```

- [ ] **Step 3: CookieConsent in Layout.astro einbinden**

In `Layout.astro` vor `</body>`:

```astro
---
import CookieConsent from '../components/CookieConsent.astro';
---
<!-- ... existing content ... -->
  <slot />
  <CookieConsent />
</body>
```

- [ ] **Step 4: Visuell prüfen**

- Cookie-Banner erscheint unten fixiert
- Akzeptieren: Banner verschwindet, localStorage gesetzt
- Ablehnen: Banner verschwindet, kein Pixel geladen
- Page Reload: Banner kommt nicht wieder

- [ ] **Step 5: Commit**

```bash
git add src/components/CookieConsent.astro src/scripts/cookie-consent.ts src/layouts/Layout.astro
git commit -m "feat: cookie consent banner mit meta pixel integration"
```

---

## Task 14: Platzhalter-Bilder generieren

**Files:**
- Create: `public/images/placeholder-video.jpg`
- Create: `public/images/placeholder-homestaging-before.jpg`
- Create: `public/images/placeholder-homestaging-after.jpg`
- Create: `public/images/placeholder-ref-1.jpg`
- Create: `public/images/placeholder-ref-2.jpg`
- Create: `public/images/placeholder-ref-3.jpg`
- Create: `public/images/placeholder-instagram-1.jpg`
- Create: `public/images/placeholder-instagram-2.jpg`

- [ ] **Step 1: Platzhalter-Bilder erstellen**

Einfache Platzhalter-Bilder mit Text-Overlay erzeugen. Variante A: Via Online-Tool (z.B. placehold.co). Variante B: Einfache SVGs die als JPG dienen.

Pragmatischer Ansatz: SVG-Platzhalter mit beschreibendem Text:

```bash
mkdir -p public/images
```

Für jedes Bild ein einfaches SVG-Platzhalter erstellen, das den fehlenden Content beschreibt. Zum Beispiel `placeholder-video.jpg` als SVG mit Text "Video Thumbnail — Begrüßungsvideo Verena".

Da echte JPGs von Verena kommen (Aufgabenbogen), reichen minimale Platzhalter.

- [ ] **Step 2: Commit**

```bash
git add public/images/
git commit -m "feat: platzhalter-bilder fuer fehlenden content"
```

---

## Task 15: Finale Zusammenführung in index.astro + Responsive Polish

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Alle Komponenten in index.astro zusammenführen**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import WhyReiter from '../components/WhyReiter.astro';
import SocialProof from '../components/SocialProof.astro';
import Homestaging from '../components/Homestaging.astro';
import References from '../components/References.astro';
import InstagramVideos from '../components/InstagramVideos.astro';
import Process from '../components/Process.astro';
import LeadForm from '../components/LeadForm.astro';
import FAQ from '../components/FAQ.astro';
import Footer from '../components/Footer.astro';
---
<Layout title="Reiter Immobilien — Kostenloses Erstgespräch">
  <Nav />
  <main>
    <Hero />
    <WhyReiter />
    <SocialProof />
    <Homestaging />
    <References />
    <InstagramVideos />
    <Process />
    <LeadForm />
    <FAQ />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Responsive-Test durchlaufen**

Alle Breakpoints prüfen (Desktop 1024+, Tablet 768-1023, Mobile <768):
- Nav: Hamburger auf Mobile
- Hero: Gestackt auf Mobile
- Grids: 1-spaltig auf Mobile
- Formular: Volle Breite auf Mobile
- Footer: Gestackt auf Mobile

- [ ] **Step 3: Lighthouse prüfen**

```bash
npm run build
npx serve dist
```

Lighthouse in Chrome DevTools laufen lassen. Ziel: Performance 90+.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: alle sektionen zusammengefuehrt, responsive verifiziert"
```

---

## Zusammenfassung

| Task | Beschreibung | Geschätzt |
|------|-------------|-----------|
| 1 | Astro Setup + Base Layout | Grundlage |
| 2 | Navigation (sticky) | Kleine Komponente |
| 3 | Hero (Split-Layout) | Mittlere Komponente |
| 4 | Warum Reiter (3 USPs) | Kleine Komponente |
| 5 | Social Proof (Reviews) | Kleine Komponente |
| 6 | Homestaging Showcase | Kleine Komponente |
| 7 | Referenzobjekte | Kleine Komponente |
| 8 | Instagram Videos | Kleine Komponente |
| 9 | Prozess (4 Schritte) | Kleine Komponente |
| 10 | Multistep Formular | Große Komponente |
| 11 | FAQ (Accordion) | Kleine Komponente |
| 12 | Footer | Kleine Komponente |
| 13 | Cookie-Consent + Meta Pixel | Mittlere Komponente |
| 14 | Platzhalter-Bilder | Vorbereitung |
| 15 | Zusammenführung + Responsive | Integration |

## Offene Punkte (nicht blockierend)

Diese werden NACH der LP-Erstellung erledigt:
- n8n Webhook URL eintragen (Task 10, `form.ts`)
- Meta Pixel ID eintragen (Task 13, `cookie-consent.ts`)
- Echte Bilder/Videos von Verena einpflegen
- Echte Google-Rezensionen einpflegen
- FAQ-Antworten von Verena einpflegen
- Datenschutzerklärung erstellen/verlinken
- KPI-Dashboard (separates Projekt)
