# Ascension Mow N' Geaux — rebuild

Static HTML/CSS/JS rebuild of ascensionmowngeaux.com. No build step, no framework. Open `index.html` directly or serve the folder.

## Status

**Built:**
- `index.html` — homepage
- `our-story.html`
- `gallery.html` (with lightbox)
- `request-a-quote.html` (form markup only, needs a backend)
- `services/lawn-care.html` — **use this as the template for the remaining 6 service pages**
- `css/styles.css` — full design system (tokens, components, all pages pull from this one file)
- `js/main.js` — mobile nav, dropdown, lightbox

**Still needed (finish in Codex):** the remaining 6 service pages, using `services/lawn-care.html` as the copy/paste starting point. Keep the header/footer/nav markup identical across all service pages (only the `active` class and page `<title>`/meta change), and only rewrite the `page-header`, the two `split-block` sections, and the `value-grid` section content.

### Remaining service pages to build

Create each at `services/<slug>.html`, filed name matching the nav links already wired up in every page:

1. **`services/landscaping.html`** — Design, mulch, sod, drainage, seasonal cleanups. Two spotlight angles: front-yard redesign work, and sod/drainage repair work. Source content from the original site's Mulch / Drainage / SOD sections.
2. **`services/irrigation.html`** — Sprinkler system installs, drip irrigation, seasonal adjustments, repairs. Residential vs. commercial angle works well here too.
3. **`services/landscape-lighting.html`** — Pathway lights, uplighting, accent lighting, LED options. Consider a dark-mode-leaning photo placeholder treatment since this service is about evening use.
4. **`services/bush-hogging.html`** — Clearing overgrown fields/pastures/lots, fire-hazard reduction, big-property angle. Good place to emphasize "no job too big or small."
5. **`services/fencing.html`** — Pine and wood fencing, privacy and durability against Louisiana weather.
6. **`services/soft-washing-pressure-washing.html`** — Driveways, siding, walkways. Note this one wasn't in the original nav dropdown link structure fully fleshed out, so lean on general soft-wash/pressure-wash service copy (surface-safe cleaning, mold/mildew removal).

Each page needs, at minimum:
- Correct `<title>` and meta description
- `active` class set correctly in the services dropdown
- Page header with a one-line description
- At least one spotlight or split-block section with real (or placeholder) service detail
- The closing CTA band and footer (copy exactly from `lawn-care.html`)

## Design system reference

- Colors, type, spacing all live in `css/styles.css` under `:root`. Don't hardcode hex values in new pages, use the existing CSS custom properties (`var(--pine)`, `var(--gold)`, etc).
- Fonts: Zilla Slab (headings) + Work Sans (body), loaded via Google Fonts `@import` at the top of `styles.css`.
- `.photo-placeholder` divs stand in for real photography. Swap these for actual `<img>` tags once the client sends photos. Keep the `data-lightbox-label` attribute pattern on gallery page placeholders since `js/main.js` depends on it for the lightbox.
- Mowing-stripe `.stripe-divider` is a deliberate brand motif (see homepage, between hero and intro section). Fine to reuse sparingly elsewhere, don't overuse it.

## Known TODOs before launch

- [ ] Replace all `.photo-placeholder` blocks with real client photography (the client's whole complaint about the old site was stale photos, so this matters more than usual)
- [ ] Wire `request-a-quote.html` form to an actual backend (Formspree, Web3Forms, or a serverless function) — currently `action="#"` with a comment marking it
- [ ] Replace placeholder testimonials on the homepage with real reviews
- [ ] Confirm final service area list and phone/email with the client (carried over as-is from the old site: (225) 333-1991 / amngllc@gmail.com)
- [ ] Build the 6 remaining service pages per above
- [ ] Add a real favicon / logo mark (currently a text "AMG" badge standing in for a logo)
- [ ] Run a mobile pass — nav toggle and dropdown are functional but worth a real-device check
- [ ] Add a `sitemap.xml` / basic SEO pass before pushing to Vercel

## What changed from the original site (and why)

- Replaced WordPress/Elementor with plain static HTML/CSS/JS for the usual Sidequest deploy path (GitHub → Vercel)
- Consolidated the original's three repeated 3-card service grids into one unified 7-tile services section plus two deeper "spotlight" features, to cut repetition
- Added a mowing-stripe motif as a section divider, grounded in the actual subject matter (a mower leaves stripes)
- Fixed broken links from the original (malformed "Learn More" URLs, footer logo pointing to a staging domain)
- Kept every piece of original functionality: click-to-call, quote form, service area list, gallery/lightbox, services dropdown nav
