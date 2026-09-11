# Modern Southern Premium Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the full Ascension Mow N' Geaux static site, repair the persistent navigation states, and verify a polished experience on desktop and mobile.

**Architecture:** Keep the existing framework-free HTML/CSS/JavaScript structure. Consolidate presentation in `css/styles.css`, consolidate interaction behavior in `js/main.js`, use consistent header and footer markup across every page, and add a Node built-in test suite that checks the static site as a connected system.

**Tech Stack:** Static HTML5, CSS custom properties and responsive media queries, browser JavaScript, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-11-modern-southern-premium-refresh-design.md`

## Global Constraints

- Preserve the supplied logo, photographs, seven services, contact details, stated service areas, and static multi-page architecture.
- Do not add unsupported prices, guarantees, review counts, certifications, or business claims.
- Use real repository photography; do not introduce stock or generated people.
- Keep `css/styles.css` and `js/main.js` as the only production stylesheet and script.
- Keep body copy at 16px or larger and controls comfortable at a 390px-wide viewport.
- All menus and lightboxes must close with Escape and maintain accurate accessible state.
- Respect `prefers-reduced-motion`.
- Do not deploy or push to GitHub as part of this plan.

---

### Task 1: Establish static-site regression checks

**Files:**
- Create: `tests/site.test.mjs`
- Read: `index.html`
- Read: `our-story.html`
- Read: `gallery.html`
- Read: `request-a-quote.html`
- Read: `services/lawn-care.html`
- Read: `services/landscaping.html`
- Read: `services/irrigation.html`
- Read: `services/landscape-lighting.html`
- Read: `services/bush-hogging.html`
- Read: `services/fencing.html`
- Read: `services/soft-washing-pressure-washing.html`

**Interfaces:**
- Consumes: The current static page and asset tree.
- Produces: A `node --test tests/site.test.mjs` validation command used by every later task.

- [ ] **Step 1: Record the portable execution profile**

Run:

```powershell
node C:\Users\teddy\.codex\plugins\cache\openai-curated-remote\sites\0.1.59\scripts\configure-execution-profile.mjs
```

Expected: the project is recognized as an existing static site and its source structure remains unchanged.

- [ ] **Step 2: Write the baseline site tests**

Create `tests/site.test.mjs` with helpers that load the eleven canonical pages, resolve relative `href` and `src` values, and assert the future navigation contract:

```js
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const pages = [
  'index.html',
  'our-story.html',
  'gallery.html',
  'request-a-quote.html',
  'services/lawn-care.html',
  'services/landscaping.html',
  'services/irrigation.html',
  'services/landscape-lighting.html',
  'services/bush-hogging.html',
  'services/fencing.html',
  'services/soft-washing-pressure-washing.html',
];

const htmlFor = (page) => readFileSync(resolve(root, page), 'utf8');

test('all local page and asset references resolve', () => {
  for (const page of pages) {
    const html = htmlFor(page);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const ref of refs) {
      if (/^(?:https?:|mailto:|tel:|#)/.test(ref)) continue;
      const target = ref.split(/[?#]/, 1)[0];
      assert.ok(existsSync(resolve(root, dirname(page), target)), `${page}: missing ${ref}`);
    }
  }
});

test('the canonical page inventory stays complete', () => {
  assert.equal(pages.length, 11);
  for (const page of pages) assert.ok(existsSync(resolve(root, page)), page);
});
```

- [ ] **Step 3: Run the tests and confirm the baseline passes**

Run:

```powershell
node --test tests/site.test.mjs
```

Expected: both baseline structural checks pass.

- [ ] **Step 4: Commit the regression baseline**

```powershell
git add tests/site.test.mjs
git commit -m "test: define site refresh contract"
```

---

### Task 2: Rebuild the navigation system

**Files:**
- Modify: `index.html`
- Modify: `our-story.html`
- Modify: `gallery.html`
- Modify: `request-a-quote.html`
- Modify: `services/lawn-care.html`
- Modify: `services/landscaping.html`
- Modify: `services/irrigation.html`
- Modify: `services/landscape-lighting.html`
- Modify: `services/bush-hogging.html`
- Modify: `services/fencing.html`
- Modify: `services/soft-washing-pressure-washing.html`
- Modify: `css/styles.css`
- Modify: `js/main.js`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: The `.site-header`, `.main-nav`, `.has-dropdown`, and `.nav-toggle` hooks already used by every page, plus the passing baseline suite from Task 1.
- Produces: `#site-navigation`, `.services-toggle`, `.nav-backdrop`, and synchronized `open`/`services-open` states used by shared CSS and JavaScript.

- [ ] **Step 1: Strengthen the navigation behavior tests**

Add assertions that the production script owns both state machines and all dismissal paths:

```js
test('every page uses the accessible shared navigation contract', () => {
  for (const page of pages) {
    const html = htmlFor(page);
    assert.match(html, /class="nav-toggle"[^>]*aria-controls="site-navigation"/);
    assert.match(html, /class="services-toggle"[^>]*aria-expanded="false"/);
    assert.match(html, /class="nav-backdrop"[^>]*hidden/);
    assert.match(html, /<nav[^>]*id="site-navigation"/);
  }
});

test('shared script closes menus through all required paths', () => {
  const script = readFileSync(resolve(root, 'js/main.js'), 'utf8');
  assert.match(script, /function setNavOpen\(/);
  assert.match(script, /function setServicesOpen\(/);
  assert.match(script, /Escape/);
  assert.match(script, /matchMedia/);
  assert.match(script, /nav-backdrop/);
  assert.match(script, /document\.body\.classList\.toggle\('nav-open'/);
});
```

- [ ] **Step 2: Run the focused tests and confirm failure**

```powershell
node --test tests/site.test.mjs
```

Expected: navigation behavior assertions fail because `js/main.js` does not yet expose the required state helpers.

- [ ] **Step 3: Replace the header markup on root pages**

Use this structure on `index.html`, `our-story.html`, `gallery.html`, and `request-a-quote.html`, preserving each page's active link:

```html
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="index.html" aria-label="Ascension Mow N' Geaux home">
      <img src="images/logo.png" alt="Ascension Mow N' Geaux">
    </a>
    <button class="nav-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <nav class="main-nav" id="site-navigation" aria-label="Primary navigation">
      <ul class="nav-list">
        <li><a href="index.html">Home</a></li>
        <li><a href="our-story.html">Our Story</a></li>
        <li class="has-dropdown">
          <div class="services-control">
            <a href="services/lawn-care.html">Services</a>
            <button class="services-toggle" type="button" aria-expanded="false" aria-label="Show services"></button>
          </div>
          <ul class="dropdown" aria-label="Services">
            <li><a href="services/lawn-care.html">Lawn Care</a></li>
            <li><a href="services/landscaping.html">Landscaping</a></li>
            <li><a href="services/irrigation.html">Irrigation</a></li>
            <li><a href="services/landscape-lighting.html">Landscape Lighting</a></li>
            <li><a href="services/bush-hogging.html">Bush Hogging</a></li>
            <li><a href="services/fencing.html">Fencing</a></li>
            <li><a href="services/soft-washing-pressure-washing.html">Soft Washing &amp; Pressure Washing</a></li>
          </ul>
        </li>
        <li><a href="gallery.html">Gallery</a></li>
      </ul>
      <a class="header-cta" href="request-a-quote.html">Get a Quote</a>
    </nav>
  </div>
  <button class="nav-backdrop" type="button" aria-label="Close menu" hidden></button>
</header>
```

- [ ] **Step 4: Apply the nested-page version to all service pages**

Use the same markup with `../index.html`, `../our-story.html`, `../gallery.html`, `../request-a-quote.html`, `../images/logo.png`, and service-local links such as `lawn-care.html`. Set `aria-current="page"` on the active page link in both root and nested versions.

- [ ] **Step 5: Implement explicit shared menu state**

Replace the navigation portion of `js/main.js` with functions that:

```js
function setServicesOpen(isOpen) {
  dropdownParent.classList.toggle('services-open', isOpen);
  servicesToggle.setAttribute('aria-expanded', String(isOpen));
  servicesToggle.setAttribute('aria-label', isOpen ? 'Hide services' : 'Show services');
}

function setNavOpen(isOpen, restoreFocus = false) {
  nav.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  backdrop.hidden = !isOpen;
  document.body.classList.toggle('nav-open', isOpen);
  if (!isOpen) setServicesOpen(false);
  if (restoreFocus) toggle.focus();
}
```

Wire the menu button, services button, backdrop, outside pointer clicks, Escape, focus movement, and a `(min-width: 901px)` media-query change to those helpers. Preserve the gallery logic below the navigation block.

- [ ] **Step 6: Add desktop and mobile navigation CSS**

Make `.main-nav` part of the desktop header layout. Hide `.dropdown` by default and reveal it only through `.has-dropdown.services-open`, `:hover`, or `:focus-within` on desktop. At `max-width: 900px`, make `.main-nav` a translated drawer, keep `.dropdown` collapsed until `.services-open`, expose `.nav-backdrop`, and set `body.nav-open { overflow: hidden; }`.

- [ ] **Step 7: Run tests and commit the navigation repair**

```powershell
node --test tests/site.test.mjs
git add index.html our-story.html gallery.html request-a-quote.html services css/styles.css js/main.js tests/site.test.mjs
git commit -m "fix: rebuild responsive site navigation"
```

Expected: all baseline and navigation tests pass.

---

### Task 3: Apply the shared Modern Southern Premium system

**Files:**
- Modify: `css/styles.css`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: The stable page classes already shared across the site.
- Produces: Brand tokens and responsive components used by the homepage and every interior page.

- [ ] **Step 1: Add visual-system assertions**

```js
test('stylesheet contains the approved responsive visual system', () => {
  const css = readFileSync(resolve(root, 'css/styles.css'), 'utf8');
  for (const token of ['--pine-950', '--pine-800', '--grass-500', '--cream-50', '--ink-900']) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
  for (const selector of ['.trust-strip', '.service-card', '.project-proof', '.nav-backdrop', 'body.nav-open']) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width:\s*390px/);
});
```

- [ ] **Step 2: Confirm the new visual-system test fails**

```powershell
node --test tests/site.test.mjs
```

- [ ] **Step 3: Rework the design tokens and global typography**

Define the approved palette and type roles at the top of `css/styles.css`:

```css
:root {
  --pine-950: #07150d;
  --pine-900: #0b2115;
  --pine-800: #123721;
  --grass-500: #78b82a;
  --grass-400: #94cf3e;
  --cream-50: #fbfaf4;
  --cream-100: #f1eee3;
  --ink-900: #142018;
  --ink-600: #526057;
  --line-light: rgba(20, 32, 24, 0.14);
  --line-dark: rgba(255, 255, 255, 0.14);
  --font-display: "Arial Narrow", "Roboto Condensed", sans-serif;
  --font-body: "Plus Jakarta Sans", system-ui, sans-serif;
  --max-width: 1200px;
  --gutter: clamp(1.1rem, 4vw, 3rem);
  --radius-sm: 0.45rem;
  --radius-md: 0.9rem;
}
```

Set light content surfaces to dark readable text, reserve pine backgrounds for framing and calls to action, and remove broad `transition: all` declarations.

- [ ] **Step 4: Restyle shared components**

Implement consistent buttons, section spacing, headings, kickers, image frames, service cards, project-proof layouts, forms, page headers, gallery, call-to-action band, and footer. Use borders, small corner cuts, restrained shadows, and the mowing-stripe detail as a single accent rather than repeated decoration.

- [ ] **Step 5: Add responsive rules**

Create explicit breakpoints for 900px, 700px, and 390px. Stack split layouts without changing reading order, keep tap targets at least 44px high, prevent image grids from creating horizontal overflow, and reduce hero type without dropping below readable sizes.

- [ ] **Step 6: Pass the visual-system checks and commit**

```powershell
node --test tests/site.test.mjs
git add css/styles.css tests/site.test.mjs
git commit -m "style: add modern southern design system"
```

---

### Task 4: Recompose the homepage around proof and contact

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.hero`, `.trust-strip`, `.service-card`, `.project-proof`, `.cta-band`, and gallery styles from Task 3.
- Produces: The approved homepage flow and the primary visual handoff for review.

- [ ] **Step 1: Add homepage-structure tests**

```js
test('homepage follows the proof-first content flow', () => {
  const html = htmlFor('index.html');
  const orderedMarkers = ['class="hero"', 'class="trust-strip"', 'id="services"', 'class="project-proof"', 'class="cta-band"'];
  const positions = orderedMarkers.map((marker) => html.indexOf(marker));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.doesNotMatch(html, /What people are saying|Placeholder quotes|Prairieville homeowner|Gonzales homeowner/);
});
```

- [ ] **Step 2: Confirm the homepage test fails**

```powershell
node --test tests/site.test.mjs
```

- [ ] **Step 3: Build the first viewport**

Keep the existing estate image and direct contact actions. Use this content hierarchy:

```html
<p class="hero-eyebrow">Serving Ascension &amp; Livingston Parishes since 2015</p>
<h1>Good work shows from the road.</h1>
<p class="lede">Lawn care, landscaping, irrigation, clearing, and exterior cleaning for homes and properties across Prairieville, Gonzales, Baton Rouge, and Livingston.</p>
```

Keep `Get a Free Quote` and `Call (225) 333-1991` as the two actions. Place the estate photograph beside the copy with a small factual caption instead of a decorative badge.

- [ ] **Step 4: Add the factual trust strip and service grid**

Use three trust items: `Serving since 2015`, `7 outdoor services`, and `Ascension + Livingston`. Present all seven service destinations as scan-friendly cards. Use project images only on the most visual services so the grid remains clean.

- [ ] **Step 5: Consolidate proof sections**

Replace the separate story, spotlight, value, testimonial, and gallery repetitions with:

1. A concise company-introduction split using the front-yard and mower photographs.
2. A two-project proof section for lawn care and landscape installation.
3. A six-image recent-work strip linked to the full gallery.
4. One contact band.

Do not describe unrelated images as a before/after pair. Delete all placeholder testimonial markup and production notes.

- [ ] **Step 6: Validate the first meaningful preview source**

```powershell
node --test tests/site.test.mjs
```

Expected: all homepage, navigation, asset, and visual-system checks pass. Interior-page placeholder coverage is added in Task 5.

- [ ] **Step 7: Commit the homepage**

```powershell
git add index.html css/styles.css tests/site.test.mjs
git commit -m "feat: rebuild homepage around project proof"
```

---

### Task 5: Polish story and service pages

**Files:**
- Modify: `our-story.html`
- Modify: `services/lawn-care.html`
- Modify: `services/landscaping.html`
- Modify: `services/irrigation.html`
- Modify: `services/landscape-lighting.html`
- Modify: `services/bush-hogging.html`
- Modify: `services/fencing.html`
- Modify: `services/soft-washing-pressure-washing.html`
- Modify: `css/styles.css`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: Shared navigation, page-header, split-block, photo-grid, list, and call-to-action components.
- Produces: Eight consistent interior pages with no visible placeholder panels or internal handoff copy.

- [ ] **Step 1: Add interior-page quality tests**

```js
test('story and service pages use shared page shells without inline presentation', () => {
  const contentPages = pages.filter((page) => page === 'our-story.html' || page.startsWith('services/'));
  for (const page of contentPages) {
    const html = htmlFor(page);
    assert.match(html, /class="page-header/);
    assert.match(html, /class="site-footer/);
    assert.doesNotMatch(html, /style="/);
    assert.doesNotMatch(html, /coming-soon/i);
  }
});
```

- [ ] **Step 2: Confirm the interior-page test fails**

```powershell
node --test tests/site.test.mjs
```

- [ ] **Step 3: Normalize the story and service page shells**

Use the shared page header, content width, project-image grids, scoped bullet lists, and one bottom quote band on each page. Preserve every service's correct images and link paths.

- [ ] **Step 4: Tighten page copy**

Remove repeated headings and generic sales lines while preserving factual scope. Keep specific phrases such as lawn-care visit details, irrigation zones, drainage work, and pressure-sensitive washing methods. Do not add unsupported promises.

- [ ] **Step 5: Replace unsupported photo placeholders**

On fencing and landscape-lighting pages, replace `.coming-soon` panels with a polished service-scope panel that clearly lists the available work without pretending a stock image is company work. Do not label these panels as photos.

- [ ] **Step 6: Remove inline presentation**

Move all `style` attributes into named shared classes such as `.section-action`, `.contact-stack`, and `.compact-kicker`.

- [ ] **Step 7: Run the full static tests and commit**

```powershell
node --test tests/site.test.mjs
git add our-story.html services css/styles.css tests/site.test.mjs
git commit -m "feat: polish story and service pages"
```

---

### Task 6: Finish gallery, quote experience, and source cleanup

**Files:**
- Modify: `gallery.html`
- Modify: `request-a-quote.html`
- Modify: `js/main.js`
- Modify: `css/styles.css`
- Delete: `styles.css`
- Delete: `main.js`
- Delete: `lawn-care.html`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: Shared lightbox, form, navigation, and responsive components.
- Produces: Keyboard-safe gallery behavior, a transparent email handoff, and one canonical production source per asset.

- [ ] **Step 1: Add gallery, form, and cleanup tests**

```js
test('gallery and quote page expose honest interactive behavior', () => {
  const gallery = htmlFor('gallery.html');
  const quote = htmlFor('request-a-quote.html');
  assert.match(gallery, /role="dialog"/);
  assert.match(gallery, /aria-modal="true"/);
  assert.match(quote, /This opens your email app/);
  assert.match(quote, /id="form-note"[^>]*aria-live="polite"/);
  assert.doesNotMatch(gallery, /style="/);
  assert.doesNotMatch(quote, /style="/);
});

test('obsolete duplicate production files are absent', () => {
  for (const file of ['styles.css', 'main.js', 'lawn-care.html']) {
    assert.equal(existsSync(resolve(root, file)), false, `${file} should be removed`);
  }
});
```

- [ ] **Step 2: Confirm the final interaction tests fail**

```powershell
node --test tests/site.test.mjs
```

- [ ] **Step 3: Improve the gallery lightbox**

Give the lightbox `role="dialog"`, `aria-modal="true"`, an accessible label, a real close button, and a focusable container. Update `js/main.js` to focus the close button after opening, restore focus to the triggering gallery item after closing, and use the existing Escape listener without registering duplicate document handlers.

- [ ] **Step 4: Clarify the quote handoff**

Keep the current `mailto:` behavior. Place `This opens your email app with your request filled in.` below the submit button, add `aria-live="polite"` to the form note, validate the existing required fields before constructing the message, and leave direct phone and email alternatives visible.

- [ ] **Step 5: Move gallery and quote presentation into shared classes**

Remove every inline `style` attribute from `gallery.html` and `request-a-quote.html`. Add named shared classes for gallery spacing, compact contact headings, and quote-page contact spacing in `css/styles.css`.

- [ ] **Step 6: Remove obsolete duplicate files**

Delete the unused root `styles.css`, `main.js`, and `lawn-care.html` after confirming no canonical page links to them. Do not delete anything inside `css/`, `js/`, or `services/`.

- [ ] **Step 7: Run the full tests and commit**

```powershell
node --test tests/site.test.mjs
git add gallery.html request-a-quote.html js/main.js css/styles.css tests/site.test.mjs
git rm styles.css main.js lawn-care.html
git commit -m "fix: finish gallery quote flow and source cleanup"
```

---

### Task 7: Browser verification and final corrections

**Files:**
- Modify if verification finds defects: `index.html`, `our-story.html`, `gallery.html`, `request-a-quote.html`, `services/*.html`, `css/styles.css`, `js/main.js`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: The complete static site from Tasks 1–6.
- Produces: Verified desktop, tablet, mobile, keyboard, and reduced-motion behavior.

- [ ] **Step 1: Run syntax and structural verification**

```powershell
node --check js/main.js
node --test tests/site.test.mjs
git diff --check
```

Expected: every command exits successfully.

- [ ] **Step 2: Start one retained local preview server**

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Confirm `http://127.0.0.1:4173/index.html` returns a non-error response, then open that exact URL in the Codex preview and reuse the same tab.

- [ ] **Step 3: Verify desktop behavior at 1440px width**

Check the homepage, story page, gallery, quote page, and one image-backed and one image-free service page. Confirm the desktop Services dropdown starts closed, opens from pointer and keyboard input, closes on Escape and outside interaction, and never remains stuck over the page.

- [ ] **Step 4: Verify tablet and phone behavior**

At 768px and 390px widths, confirm the drawer starts closed, opens from the menu button, locks background scrolling, keeps Services collapsed until selected, closes from the backdrop and Escape, and resets after returning to desktop width. Confirm there is no horizontal overflow.

- [ ] **Step 5: Verify gallery, form, focus, and reduced motion**

Open and close a gallery image using pointer, keyboard, close button, and Escape. Confirm focus returns to the trigger. Submit the quote form only far enough to validate the fields and construct the `mailto:` handoff; do not send an external message. Emulate reduced motion and confirm decorative movement is suppressed.

- [ ] **Step 6: Inspect browser health**

Confirm every checked page loads its images and fonts, all internal links reach the intended pages, and the browser console contains no errors.

- [ ] **Step 7: Correct any discovered defect with a failing regression first**

For each defect, add the smallest failing assertion to `tests/site.test.mjs`, confirm it fails, apply the correction, and rerun the full suite.

- [ ] **Step 8: Run final verification and commit corrections if needed**

```powershell
node --check js/main.js
node --test tests/site.test.mjs
git diff --check
git status --short
```

If browser verification required changes:

```powershell
git add index.html our-story.html gallery.html request-a-quote.html services css/styles.css js/main.js tests/site.test.mjs
git commit -m "fix: resolve responsive verification issues"
```

Stop the local preview server after verification. Do not push or deploy.
