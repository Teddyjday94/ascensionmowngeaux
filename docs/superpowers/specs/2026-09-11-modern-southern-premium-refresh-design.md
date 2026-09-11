# Ascension Mow N' Geaux Modern Southern Premium Refresh

## Outcome

Refresh the existing static website so Ascension Mow N' Geaux presents as an established local property-care company, works cleanly on phones and desktops, and makes requesting a quote or calling the company easy. Preserve the existing logo, photographs, services, contact details, and multi-page structure.

## Audience and primary flow

The primary audience is a homeowner or property manager in Ascension, Livingston, or the surrounding service area who wants to judge the quality of the work and contact the company quickly.

The homepage should move through four decisions in order:

1. Confirm the company serves the visitor's area and type of property.
2. Show real work immediately through the supplied project photography.
3. Make the seven services easy to scan and compare.
4. Offer a clear quote request and phone call path without repeated sales copy.

## Visual direction

Use a Modern Southern Premium style that fits the existing vintage green-and-cream logo without turning the page into a rustic theme.

- Use deep pine as the main framing color, warm white for readable content surfaces, and one crisp grass-green accent.
- Replace the current full-page dark glass treatment with brighter content sections and restrained dark panels.
- Use a condensed, confident display face for headings and a clean sans serif for body copy. Maintain at least 16px body text and strong line spacing.
- Give photography more space through a wide editorial hero, clean crops, and a small number of overlapping image compositions.
- Use squared or modestly rounded surfaces, thin borders, and subtle shadows. Avoid oversized pills, heavy glow, excessive gradients, and repeated glass cards.
- Retain the mowing-stripe idea as a restrained brand detail, not a divider after every section.
- Keep motion short and functional: navigation transitions, image hover feedback, and gentle reveal behavior. Respect reduced-motion settings.

## Header and navigation

Rebuild the shared navigation markup and behavior on every page.

- Desktop: keep the main navigation visible, open Services as a deliberate dropdown, and close it on outside click, Escape, focus departure, or navigation.
- Mobile: use a menu button that opens a right-side drawer over a dimmed backdrop. The drawer must be closed on first load.
- Keep the Services list collapsed until its own control is activated. Do not make the Services destination link perform two jobs.
- Prevent background scrolling while the mobile drawer is open.
- Keep `aria-expanded`, accessible labels, focus placement, and Escape behavior in sync with the visible state.
- Close and reset the mobile state when crossing back to the desktop breakpoint.
- Keep the quote action visible and easy to tap.

## Homepage

- Turn the first screen into a strong split editorial hero led by the estate lawn photograph, service area, direct headline, quote action, and phone action.
- Add a compact trust row using only facts already present in the source, such as serving since 2015, seven services, and the listed service areas.
- Make the services section easier to scan with clear categories and selective real project imagery.
- Consolidate repeated explanatory sections so the page feels deliberate instead of long.
- Keep the strongest before-and-after-style project pairings available in the existing photography without claiming that two unrelated photographs are the same property.
- Remove the placeholder testimonial quotes and the visible internal note. Replace that area with a factual project-proof section or omit it.
- End with one focused contact band and a compact project gallery.

## Interior pages

- Apply the same header, typography, color, buttons, spacing, image treatment, footer, and responsive rules to Our Story, Gallery, Request a Quote, and all seven service pages.
- Preserve each service page's distinct subject and existing real photos.
- Make page introductions shorter and more direct where the current copy repeats itself.
- Preserve the gallery lightbox while improving its close, keyboard, focus, and image presentation behavior.
- Keep the current email-based quote handoff because no form service or server endpoint has been supplied. Explain that behavior plainly near the submit action.
- Replace inline presentational styles with shared classes.

## Copy rules

- Keep the local, straightforward voice already present in lines such as "Built by people who actually show up."
- Remove generic hype, repeated promises, visible production notes, and invented testimonial language.
- Do not add prices, response guarantees, review counts, certifications, or service claims that are not already supported by the repository.
- Keep contact details and the stated service area unchanged unless the user supplies corrections.

## Technical cleanup

- Keep the site framework-free and continue using shared `css/styles.css` and `js/main.js` files.
- Remove or reconcile the obsolete root-level duplicate stylesheet, script, and lawn-care page so there is one clear source for each asset.
- Preserve working relative paths from both root pages and the `services/` directory.
- Add lightweight automated checks for local links, image and script references, navigation structure, and required accessibility attributes.
- Add no new runtime dependency unless browser verification cannot be performed with an already available tool.

## Verification

- Confirm every local page, image, stylesheet, script, telephone link, email link, and quote link resolves as intended.
- Verify the header, desktop Services dropdown, mobile drawer, nested Services control, gallery lightbox, and quote form behavior in a browser.
- Check desktop, tablet, and 390px-wide phone layouts for clipping, unreadable text, accidental open menus, and horizontal overflow.
- Test keyboard navigation, visible focus, Escape-to-close behavior, and reduced-motion behavior.
- Confirm there are no browser console errors.
- Run the repository's automated checks and the static-site build or validation step introduced by the implementation plan.

## Out of scope

- Publishing, deploying, or pushing to GitHub without a separate request.
- Adding a paid form backend, analytics, a CMS, online scheduling, or customer accounts.
- Inventing reviews or replacing the supplied company photography with stock or generated people.
- Confirming business facts that require the owner's input, including licensing, final service areas, and response-time promises.
