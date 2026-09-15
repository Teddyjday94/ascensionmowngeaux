# Site Animation Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cohesive cinematic + high-energy animation system across the Ascension Mow N' Geaux site while preserving performance, accessibility, navigation behavior, service anchors, gallery lightbox behavior, and the embedded Jobber quote form.

**Architecture:** Add one shared motion stylesheet, `css/animations.css`, and extend `js/main.js` with a self-contained motion subsystem that annotates existing markup at runtime, observes reveal targets with one `IntersectionObserver`, manages compact-header and parallax state through one `requestAnimationFrame` scroll loop, and disables non-essential motion when `prefers-reduced-motion: reduce` is active. Keep page HTML changes limited to loading `animations.css`; do not add an animation library or duplicate page-specific scripts.

**Tech Stack:** Static HTML5, CSS3 transforms/opacity/clip-path, vanilla JavaScript, `IntersectionObserver`, `requestAnimationFrame`, `matchMedia`, Node.js built-in `node:test` regression tests.

**Spec:** `docs/superpowers/specs/2026-09-15-site-animation-pass-design.md`

## Global Constraints

- Use a cinematic + high-energy hybrid motion direction.
- Avoid cursor followers, bouncing text, floating decorative objects, excessive looping motion, and heavy 3D gimmicks.
- Prefer `transform`, `opacity`, and `clip-path` for animated properties.
- Use one shared `IntersectionObserver` for reveal behavior.
- Use one shared `requestAnimationFrame` loop for scroll-linked effects.
- Disable non-essential parallax on narrow/mobile viewports.
- Respect `prefers-reduced-motion: reduce` in CSS and JavaScript.
- Preserve keyboard navigation, mobile navigation, service dropdown behavior, gallery lightbox focus behavior, sticky service-anchor offsets, and Jobber iframe behavior.
- Do not animate inside the third-party Jobber iframe.
- Do not add an external animation dependency.

---

### Task 1: Wire the shared animation stylesheet into every canonical page

**Files:**
- Create: `css/animations.css`
- Modify: `index.html`
- Modify: `our-story.html`
- Modify: `gallery.html`
- Modify: `request-a-quote.html`
- Modify: `services.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: existing canonical page list in `tests/site.test.mjs`.
- Produces: a site-wide stylesheet contract where every canonical page contains `<link rel="stylesheet" href="css/animations.css">`, loaded after existing page-specific styles so motion overrides are predictable.

- [ ] **Step 1: Write the failing stylesheet-loading regression test**

Append this test to `tests/site.test.mjs` before creating the stylesheet or linking it:

```js
test('all canonical pages load the shared animation stylesheet', () => {
  for (const page of canonicalPages) {
    const html = htmlFor(page);
    assert.match(
      html,
      /<link rel="stylesheet" href="css\/animations\.css">/,
      `${page}: missing animations.css`
    );
  }

  assert.ok(existsSync(resolve(root, 'css/animations.css')), 'missing css/animations.css');
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: the new test fails because `css/animations.css` does not exist and canonical pages do not link it.

- [ ] **Step 3: Create the base stylesheet shell and link it on all canonical pages**

Create `css/animations.css` with only the base motion tokens and no behavioral selectors yet:

```css
/* Ascension Mow N' Geaux — shared motion system */

:root {
  --motion-fast: 180ms;
  --motion-base: 620ms;
  --motion-slow: 920ms;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-distance: 28px;
}

html.motion-ready {
  scroll-behavior: smooth;
}
```

Add this exact tag immediately after each page's final existing stylesheet tag:

```html
<link rel="stylesheet" href="css/animations.css">
```

For `services.html`, place it after `css/services-page.css`. For the other canonical pages, place it after `css/styles.css` or any page-specific external stylesheet already in use.

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add css/animations.css index.html our-story.html gallery.html request-a-quote.html services.html tests/site.test.mjs
git commit -m "feat: wire shared animation stylesheet"
```

---

### Task 2: Add the generic reveal/stagger system and reduced-motion fallback

**Files:**
- Modify: `css/animations.css`
- Modify: `js/main.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: existing DOM structure and `DOMContentLoaded` handler in `js/main.js`.
- Produces: `setupMotionSystem()` inside `js/main.js`; runtime classes `.motion-reveal`, `.motion-left`, `.motion-right`, `.motion-mask`, `.motion-stagger`, `.is-visible`; CSS variable `--motion-index` for stagger timing.

- [ ] **Step 1: Write failing tests for the reveal engine and reduced-motion handling**

Append:

```js
test('shared motion system uses one reveal observer and honors reduced motion', () => {
  const script = htmlFor('js/main.js');
  const css = htmlFor('css/animations.css');

  assert.match(script, /function setupMotionSystem\(/);
  assert.match(script, /new IntersectionObserver\(/);
  assert.match(script, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /motion-reveal/);
  assert.match(script, /--motion-index/);

  assert.match(css, /\.motion-reveal/);
  assert.match(css, /\.is-visible/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: FAIL because no motion system exists yet.

- [ ] **Step 3: Add base reveal CSS**

Extend `css/animations.css` with:

```css
.motion-reveal,
.motion-left,
.motion-right,
.motion-mask {
  opacity: 0;
  transition:
    opacity var(--motion-base) var(--motion-ease),
    transform var(--motion-base) var(--motion-ease),
    clip-path var(--motion-slow) var(--motion-soft);
  transition-delay: calc(var(--motion-index, 0) * 70ms);
}

.motion-reveal {
  transform: translate3d(0, var(--motion-distance), 0);
}

.motion-left {
  transform: translate3d(calc(var(--motion-distance) * -1), 0, 0);
}

.motion-right {
  transform: translate3d(var(--motion-distance), 0, 0);
}

.motion-mask {
  transform: scale(1.035);
  clip-path: inset(8% 0 8% 0 round var(--radius-md));
}

.motion-reveal.is-visible,
.motion-left.is-visible,
.motion-right.is-visible,
.motion-mask.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  clip-path: inset(0 0 0 0 round var(--radius-md));
}

@media (prefers-reduced-motion: reduce) {
  html.motion-ready {
    scroll-behavior: auto;
  }

  .motion-reveal,
  .motion-left,
  .motion-right,
  .motion-mask {
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 4: Add `setupMotionSystem()` to `js/main.js`**

Place this helper above the existing `DOMContentLoaded` listener so the current behavior remains in the same listener and calls the helper once:

```js
function setupMotionSystem() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('motion-ready');

  var revealTargets = [];

  function addTargets(selector, className, startIndex) {
    document.querySelectorAll(selector).forEach(function (element, index) {
      element.classList.add(className || 'motion-reveal');
      element.style.setProperty('--motion-index', String((startIndex || 0) + index));
      revealTargets.push(element);
    });
  }

  addTargets('.section-head > *, .page-header-copy > *, .services-hero-copy > *', 'motion-reveal', 0);
  addTargets('.trust-item, .value-item, .service-card, .service-detail', 'motion-reveal', 0);
  addTargets('.gallery-grid .photo-placeholder, .gallery-strip .photo-placeholder', 'motion-reveal', 0);

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (element) {
      element.classList.add('is-visible');
    });
    return { reduceMotion: reduceMotion, revealTargets: revealTargets };
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  });

  revealTargets.forEach(function (element) {
    observer.observe(element);
  });

  return {
    reduceMotion: reduceMotion,
    revealTargets: revealTargets,
    observer: observer
  };
}
```

At the start of the existing `DOMContentLoaded` callback, after local variable declarations, call:

```js
var motionSystem = setupMotionSystem();
```

Keep `motionSystem` local for later tasks.

- [ ] **Step 5: Run tests and verify GREEN**

Run:

```bash
node --test tests/site.test.mjs
node --check js/main.js
```

Expected: all tests pass; JS syntax check exits 0.

- [ ] **Step 6: Commit**

```bash
git add css/animations.css js/main.js tests/site.test.mjs
git commit -m "feat: add shared reveal motion system"
```

---

### Task 3: Add homepage choreography and premium interaction states

**Files:**
- Modify: `css/animations.css`
- Modify: `js/main.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `setupMotionSystem()` and its `revealTargets` array from Task 2.
- Produces: `annotateHomepageMotion()`; semantic motion classes on hero copy, proof photo, split-media images, project rows, transformation pairs, CTA, and work reel content.

- [ ] **Step 1: Write failing homepage motion coverage tests**

Append:

```js
test('homepage motion choreography covers hero, services, proof, transformations, gallery, and CTA', () => {
  const script = htmlFor('js/main.js');
  const css = htmlFor('css/animations.css');

  for (const marker of [
    'annotateHomepageMotion',
    '.hero-copy > *',
    '.hero-photo',
    '.split-media .photo-placeholder',
    '.project-proof',
    '.transformation-card',
    '.work-reel-content > *',
    '.cta-band .container > *'
  ]) {
    assert.ok(script.includes(marker), `missing homepage motion marker ${marker}`);
  }

  assert.match(css, /\.service-card::after/);
  assert.match(css, /\.service-card:hover/);
  assert.match(css, /\.photo-placeholder:hover img/);
  assert.match(css, /\.motion-accent-sweep/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: FAIL on missing homepage choreography and interaction selectors.

- [ ] **Step 3: Add homepage runtime annotation**

Inside `setupMotionSystem()`, add this nested helper before observer creation:

```js
function annotateHomepageMotion() {
  var heroChildren = document.querySelectorAll('.hero-copy > *');
  heroChildren.forEach(function (element, index) {
    element.classList.add('motion-reveal');
    element.style.setProperty('--motion-index', String(index));
    revealTargets.push(element);
  });

  document.querySelectorAll('.hero-photo').forEach(function (element) {
    element.classList.add('motion-right', 'motion-depth');
    revealTargets.push(element);
  });

  document.querySelectorAll('.split-media .photo-placeholder').forEach(function (element, index) {
    element.classList.add(index % 2 === 0 ? 'motion-left' : 'motion-right');
    element.style.setProperty('--motion-index', String(index));
    revealTargets.push(element);
  });

  document.querySelectorAll('.work-reel-content > *').forEach(function (element, index) {
    element.classList.add('motion-reveal');
    element.style.setProperty('--motion-index', String(index));
    revealTargets.push(element);
  });

  document.querySelectorAll('.project-proof').forEach(function (row) {
    var image = row.querySelector('.spotlight-photo');
    var copy = row.querySelector(':scope > div:last-child');
    if (image) {
      image.classList.add('motion-mask');
      revealTargets.push(image);
    }
    if (copy) {
      copy.classList.add(row.classList.contains('reverse') ? 'motion-left' : 'motion-right');
      revealTargets.push(copy);
    }
  });

  document.querySelectorAll('.transformation-card').forEach(function (card, cardIndex) {
    card.classList.add('motion-reveal');
    card.style.setProperty('--motion-index', String(cardIndex));
    revealTargets.push(card);
    card.querySelectorAll('.transformation-pair figure').forEach(function (figure, index) {
      figure.style.setProperty('--motion-index', String(index));
    });
  });

  document.querySelectorAll('.cta-band .container > *').forEach(function (element, index) {
    element.classList.add('motion-reveal');
    element.style.setProperty('--motion-index', String(index));
    revealTargets.push(element);
  });

  var finalCta = document.querySelector('.cta-band');
  if (finalCta) finalCta.classList.add('motion-accent-sweep');
}

annotateHomepageMotion();
```

Do not remove the generic `addTargets()` calls from Task 2.

- [ ] **Step 4: Add premium hover and accent CSS**

Extend `css/animations.css` with:

```css
.service-card,
.photo-placeholder,
.btn,
.header-cta {
  transform-style: preserve-3d;
}

.service-card {
  position: relative;
  overflow: hidden;
  transition:
    transform 320ms var(--motion-ease),
    box-shadow 320ms var(--motion-ease),
    border-color 320ms var(--motion-ease);
}

.service-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--grass-400), transparent);
  transform: translateX(-105%);
  transition: transform 520ms var(--motion-ease);
}

@media (hover: hover) and (pointer: fine) {
  .service-card:hover {
    transform: translate3d(0, -7px, 0) rotateX(1.5deg);
    box-shadow: 0 24px 55px rgba(7, 21, 13, 0.16);
  }

  .service-card:hover::after {
    transform: translateX(0);
  }

  .photo-placeholder img,
  .service-photo img,
  .gallery-grid img,
  .gallery-strip img {
    transition: transform 700ms var(--motion-soft);
  }

  .photo-placeholder:hover img,
  .service-photo:hover img,
  .gallery-grid .photo-placeholder:hover img,
  .gallery-strip .photo-placeholder:hover img {
    transform: scale(1.035);
  }

  .btn:hover,
  .header-cta:hover {
    transform: translate3d(0, -2px, 0);
  }

  .btn:active,
  .header-cta:active {
    transform: translate3d(0, 0, 0) scale(0.985);
  }
}

.motion-accent-sweep {
  position: relative;
  overflow: hidden;
}

.motion-accent-sweep::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(110deg, transparent 28%, rgba(148, 207, 62, 0.12) 50%, transparent 72%);
  transform: translateX(-120%);
}

.motion-accent-sweep:has(.is-visible)::after {
  animation: motion-sweep 1100ms var(--motion-soft) 180ms 1 both;
}

@keyframes motion-sweep {
  to { transform: translateX(120%); }
}
```

- [ ] **Step 5: Run tests and syntax check**

Run:

```bash
node --test tests/site.test.mjs
node --check js/main.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add css/animations.css js/main.js tests/site.test.mjs
git commit -m "feat: choreograph homepage motion"
```

---

### Task 4: Add compact header and lightweight scroll-linked depth motion

**Files:**
- Modify: `css/animations.css`
- Modify: `js/main.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `motionSystem.reduceMotion` from Task 2.
- Produces: body/header class `.is-scrolled`; CSS variable `--motion-parallax-y`; one scroll listener that schedules one RAF callback; classes `.motion-depth`, `.motion-hero-drift`.

- [ ] **Step 1: Write failing scroll-system tests**

Append:

```js
test('motion system uses one requestAnimationFrame scroll loop for header and depth motion', () => {
  const script = htmlFor('js/main.js');
  const css = htmlFor('css/animations.css');

  assert.match(script, /requestAnimationFrame\(/);
  assert.match(script, /is-scrolled/);
  assert.match(script, /--motion-parallax-y/);
  assert.match(script, /motion-depth/);
  assert.match(css, /\.site-header\.is-scrolled/);
  assert.match(css, /--motion-parallax-y/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: FAIL because scroll-linked motion has not been implemented.

- [ ] **Step 3: Add scroll scheduler to `setupMotionSystem()`**

After the observer setup, add:

```js
var header = document.querySelector('.site-header');
var depthTargets = Array.from(document.querySelectorAll('.motion-depth, .work-video, .page-header-media'));
var rafPending = false;
var narrowMotion = window.matchMedia('(max-width: 700px)');

function updateScrollMotion() {
  rafPending = false;
  var scrollY = window.scrollY || window.pageYOffset || 0;

  if (header) {
    header.classList.toggle('is-scrolled', scrollY > 72);
  }

  if (reduceMotion.matches || narrowMotion.matches) return;

  depthTargets.forEach(function (element) {
    var rect = element.getBoundingClientRect();
    var viewportCenter = window.innerHeight / 2;
    var elementCenter = rect.top + rect.height / 2;
    var delta = Math.max(-1, Math.min(1, (elementCenter - viewportCenter) / window.innerHeight));
    element.style.setProperty('--motion-parallax-y', `${delta * -18}px`);
  });
}

function scheduleScrollMotion() {
  if (rafPending) return;
  rafPending = true;
  window.requestAnimationFrame(updateScrollMotion);
}

window.addEventListener('scroll', scheduleScrollMotion, { passive: true });
window.addEventListener('resize', scheduleScrollMotion);
scheduleScrollMotion();
```

Do not create a second RAF loop elsewhere.

- [ ] **Step 4: Add compact-header and depth CSS**

Append:

```css
.site-header,
.logo img,
.header-inner {
  transition:
    min-height 280ms var(--motion-ease),
    height 280ms var(--motion-ease),
    width 280ms var(--motion-ease),
    background-color 280ms var(--motion-ease),
    box-shadow 280ms var(--motion-ease),
    border-color 280ms var(--motion-ease);
}

.site-header.is-scrolled {
  background: rgba(7, 21, 13, 0.985);
  border-bottom-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 12px 34px rgba(2, 10, 5, 0.16);
}

.site-header.is-scrolled .header-inner {
  min-height: 68px;
}

.site-header.is-scrolled .logo img {
  width: 88px;
  height: 60px;
}

.motion-depth,
.work-video,
.page-header-media {
  transform: translate3d(0, var(--motion-parallax-y, 0px), 0);
  will-change: transform;
}

@media (max-width: 700px), (prefers-reduced-motion: reduce) {
  .motion-depth,
  .work-video,
  .page-header-media {
    transform: none !important;
    will-change: auto;
  }
}
```

- [ ] **Step 5: Run tests and syntax check**

Run:

```bash
node --test tests/site.test.mjs
node --check js/main.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add css/animations.css js/main.js tests/site.test.mjs
git commit -m "feat: add compact header and depth motion"
```

---

### Task 5: Choreograph Services, Our Story, Gallery, and Quote pages

**Files:**
- Modify: `css/animations.css`
- Modify: `js/main.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: generic reveal classes and shared observer from Tasks 2–4.
- Produces: `annotateInteriorPageMotion()` with page-specific runtime class assignment; polished lightbox open state; no animation inside the Jobber iframe.

- [ ] **Step 1: Write failing interior-page motion tests**

Append:

```js
test('interior page motion covers services, story, gallery, quote, and lightbox without touching Jobber iframe content', () => {
  const script = htmlFor('js/main.js');
  const css = htmlFor('css/animations.css');

  for (const marker of [
    'annotateInteriorPageMotion',
    '.service-section',
    '.split-block',
    '.gallery-grid .photo-placeholder',
    '.jobber-embed-shell',
    '.quote-contact-card'
  ]) {
    assert.ok(script.includes(marker), `missing interior motion marker ${marker}`);
  }

  assert.match(css, /\.lightbox\.open/);
  assert.match(css, /\.lightbox\.open \.lightbox-inner/);
  assert.doesNotMatch(script, /contentWindow|contentDocument/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: FAIL on missing interior choreography.

- [ ] **Step 3: Add `annotateInteriorPageMotion()`**

Inside `setupMotionSystem()`, add:

```js
function annotateInteriorPageMotion() {
  document.querySelectorAll('.page-header-media').forEach(function (element) {
    element.classList.add('motion-hero-drift');
  });

  document.querySelectorAll('.split-block').forEach(function (block) {
    var children = block.children;
    if (children[0]) {
      children[0].classList.add(block.classList.contains('reverse') ? 'motion-right' : 'motion-left');
      revealTargets.push(children[0]);
    }
    if (children[1]) {
      children[1].classList.add(block.classList.contains('reverse') ? 'motion-left' : 'motion-right');
      revealTargets.push(children[1]);
    }
  });

  document.querySelectorAll('.service-section').forEach(function (section, index) {
    var copy = section.querySelector('.service-copy');
    var visual = section.querySelector('.service-visual');
    if (copy) {
      copy.classList.add(index % 2 === 0 ? 'motion-left' : 'motion-right');
      revealTargets.push(copy);
    }
    if (visual) {
      visual.classList.add(index % 2 === 0 ? 'motion-right' : 'motion-left');
      revealTargets.push(visual);
    }
  });

  document.querySelectorAll('.jobber-embed-shell, .quote-contact-card').forEach(function (element, index) {
    element.classList.add(index === 0 ? 'motion-left' : 'motion-right');
    revealTargets.push(element);
  });
}

annotateInteriorPageMotion();
```

Do not query into the iframe and do not access `contentWindow` or `contentDocument`.

- [ ] **Step 4: Add interior hero drift and lightbox motion CSS**

Append:

```css
.motion-hero-drift {
  scale: 1.015;
  transition: scale 1400ms var(--motion-soft);
}

.motion-ready .page-header:hover .motion-hero-drift {
  scale: 1.03;
}

.lightbox {
  transition: opacity 240ms ease;
}

.lightbox .lightbox-inner {
  transform: translate3d(0, 14px, 0) scale(0.975);
  opacity: 0;
  transition:
    transform 340ms var(--motion-ease),
    opacity 260ms ease;
}

.lightbox.open .lightbox-inner {
  transform: translate3d(0, 0, 0) scale(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .motion-hero-drift,
  .motion-ready .page-header:hover .motion-hero-drift,
  .lightbox .lightbox-inner,
  .lightbox.open .lightbox-inner {
    scale: 1;
    transform: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 5: Run tests and syntax check**

Run:

```bash
node --test tests/site.test.mjs
node --check js/main.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add css/animations.css js/main.js tests/site.test.mjs
git commit -m "feat: animate interior pages"
```

---

### Task 6: Verify regression safety, reduced motion, anchor behavior, and deployment readiness

**Files:**
- Modify: `tests/site.test.mjs` only if verification exposes a missing regression assertion.
- Review: `css/animations.css`
- Review: `js/main.js`
- Review: all five canonical HTML pages.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: verified motion implementation with no broken shared behavior.

- [ ] **Step 1: Add final regression assertions before manual verification**

Append:

```js
test('animation pass preserves existing shared interaction contracts and avoids external libraries', () => {
  const script = htmlFor('js/main.js');
  const animationCss = htmlFor('css/animations.css');

  for (const marker of [
    'function setNavOpen(',
    'function setServicesOpen(',
    'MutationObserver',
    'data-lightbox-label',
    "event.key !== 'Escape'",
    "document.body.style.overflowX = 'clip'"
  ]) {
    assert.ok(script.includes(marker), `missing preserved behavior ${marker}`);
  }

  assert.doesNotMatch(script, /gsap|anime\.|framer|motion\.one|three\.js/i);
  assert.doesNotMatch(animationCss, /animation-iteration-count:\s*infinite/i);
});
```

- [ ] **Step 2: Run full automated verification**

Run:

```bash
node --test tests/site.test.mjs
node --check js/main.js
```

Expected: zero failures and JS syntax exit code 0.

- [ ] **Step 3: Verify reduced-motion behavior from source**

Confirm all of these are true in source:

```text
css/animations.css contains @media (prefers-reduced-motion: reduce)
js/main.js checks window.matchMedia('(prefers-reduced-motion: reduce)')
scroll-linked transforms are skipped when reduceMotion.matches is true
narrow/mobile viewports skip depth transforms
```

If any item is missing, fix it, rerun Step 2, then continue.

- [ ] **Step 4: Manual desktop browser verification**

Check these flows in order:

```text
1. Homepage: hero stagger, compact header, trust strip, service cards, work reel, project rows, transformations, recent gallery, CTA.
2. Services: direct-load services.html#irrigation and services.html#pressure-washing; confirm sticky header does not hide headings.
3. Our Story: hero and both split sections reveal cleanly.
4. Gallery: row reveals, hover zoom, lightbox open/close, Escape key, focus restoration.
5. Quote: hero, form shell, contact card; embedded Jobber form remains usable and visually stable.
6. Mobile <= 700px: no parallax, no layout overflow, nav remains usable.
7. OS/browser reduced-motion enabled: content appears immediately and no depth drift runs.
```

- [ ] **Step 5: Verify no duplicate animation stylesheet links**

Run:

```bash
grep -n "animations.css" index.html our-story.html gallery.html request-a-quote.html services.html
```

Expected: exactly one `animations.css` link per canonical page.

- [ ] **Step 6: Final commit if verification required fixes**

If no fixes were required, skip this commit. If verification produced changes:

```bash
git add css/animations.css js/main.js tests/site.test.mjs index.html our-story.html gallery.html request-a-quote.html services.html
git commit -m "fix: polish animation pass regressions"
```

- [ ] **Step 7: Push and verify deployment status**

Push the completed branch, then confirm the Vercel status for the final commit is `success` before reporting completion.

---

## Self-Review

- Spec coverage: homepage hero, sticky header, trust strip, story section, services grid, work reel, project proof, before/after, recent gallery, final CTA, all interior heroes, Our Story, Gallery, Services, Quote, reduced-motion, performance, and regression safety are each covered by a task above.
- Placeholder scan: no TBD/TODO/"similar to" placeholders remain.
- Interface consistency: `setupMotionSystem()`, `annotateHomepageMotion()`, `annotateInteriorPageMotion()`, `.motion-reveal`, `.motion-left`, `.motion-right`, `.motion-mask`, `.motion-depth`, `.motion-hero-drift`, `.is-visible`, `.is-scrolled`, `--motion-index`, and `--motion-parallax-y` are named consistently across tasks.
