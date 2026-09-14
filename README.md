# Ascension Mow N' Geaux — rebuild

Static HTML/CSS/JS site. No build step, no framework. Open `index.html` directly or serve the folder.

## Status

**Built (all pages complete):**
- `index.html` — homepage
- `our-story.html`
- `gallery.html` (with lightbox, showing real photos)
- `request-a-quote.html` (form submits via a client-side mailto handoff — see TODOs)
- `services/lawn-care.html`, `services/landscaping.html`, `services/irrigation.html`,
  `services/dirt-work-site-work.html`, `services/soft-washing-pressure-washing.html`
- `css/styles.css` — full design system (tokens, components, all pages pull from this one file).
  Restyled to a dark green / glass aesthetic (Plus Jakarta Sans, `--bg-dark`/`--bg-card`/`--accent-green` tokens)
  matching the client-provided design reference.
- `js/main.js` — mobile nav, dropdown, lightbox (now shows the real photo, not just a label)
- `images/` — real client photography, optimized for web and dropped into every page

## Design system reference

- Colors, type, spacing all live in `css/styles.css` under `:root`. Don't hardcode hex values in new pages,
  use the existing CSS custom properties (`var(--accent-green)`, `var(--bg-card)`, etc).
- Fonts: Plus Jakarta Sans (both headings and body), loaded via Google Fonts `@import` at the top of `styles.css`.
- `.photo-placeholder` divs wrap real client photography. Keep the `data-lightbox-label` / `data-full`
  attribute pattern on gallery page items since `js/main.js` depends on it for the lightbox.
- Mowing-stripe `.stripe-divider` is a deliberate brand motif (see homepage, between hero and intro section).
  Fine to reuse sparingly elsewhere, don't overuse it.
- Logo: `images/logo.png` — a transparent PNG cleaned up from the original Facebook export (which had a
  checkerboard "transparency" pattern baked into the JPEG). Used in the header and footer on every page.

## Known TODOs before launch

- [ ] Wire `request-a-quote.html` (and the homepage quote CTAs) to an actual form backend (Formspree,
      Web3Forms, or a serverless function) — it currently opens a pre-filled `mailto:` to amngllc@gmail.com
      as a stopgap, noted with an HTML comment in the form markup
- [ ] Replace placeholder testimonials on the homepage with real reviews
- [ ] Confirm final service area list and phone/email with the client (carried over as-is from the old site:
      (225) 333-1991 / amngllc@gmail.com)
- [ ] Add a `sitemap.xml` / basic SEO pass before pushing to Vercel
- [ ] Run a mobile pass — nav toggle and dropdown are functional but worth a real-device check

## What changed in this pass

- Full visual reskin to the dark green / glass design system (previously a light parchment/pine/gold theme)
- Replaced every `.photo-placeholder` with real client photography, sorted into the right context per page
  (lawn maintenance, landscaping/sod, dirt work, pressure washing, irrigation)
- Added a real logo mark (`images/logo.png`) in place of the plain-text "AMG" badge
- Fixed a broken link structure: `lawn-care.html` was sitting at the repo root while every nav link pointed
  to `services/lawn-care.html` — moved it into `services/` where it belongs
- Aligned the visible service navigation with the Jobber request checklist and replaced the former
  bush-hogging page with a dirt-work and site-work page using supplied project photography
- Updated the gallery lightbox to show the actual clicked photo instead of just a text label
- Removed stray duplicate `styles.css` / `main.js` files that had been left at the repo root
