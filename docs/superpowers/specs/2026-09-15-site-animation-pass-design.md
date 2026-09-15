# Ascension Mow N' Geaux — Site-Wide Animation Pass Design

## Goal

Add a cohesive, premium motion system across the site that increases visual impact without making the brand feel gimmicky or slowing down the experience. The motion language should feel cinematic, confident, and energetic enough to create a clear “wow” factor while still fitting a professional lawn, landscape, irrigation, and site-work company.

## Motion Direction

Use a cinematic + high-energy hybrid.

- Cinematic: slow background drift, image depth, masked reveals, layered hero entrances, restrained parallax.
- High-energy: staggered card entrances, green accent sweeps, stronger hover feedback, subtle section-to-section momentum.
- Avoid: cursor followers, bouncing text, floating decorative objects, excessive looping motion, heavy 3D gimmicks, or effects that interfere with readability.

## Architecture

Create one shared motion stylesheet and extend the existing shared JavaScript.

### New file

`css/animations.css`

Responsibilities:
- reveal states and animation keyframes
- stagger timing utilities
- hover/press motion
- image-mask and accent-sweep effects
- header condensed state
- reduced-motion fallbacks
- page-hero drift styling

### Existing file

`js/main.js`

Responsibilities added:
- register reveal targets
- apply stagger indexes automatically
- use `IntersectionObserver` for one-time viewport reveals
- manage a shared scroll progress value with `requestAnimationFrame`
- toggle compact header state after scrolling
- update lightweight parallax/depth transforms only when motion is allowed
- preserve all current navigation, lightbox, Jobber, and service-link behavior

No external animation library is required.

## Homepage Motion

### Hero

- Hero eyebrow, headline, lead paragraph, buttons, and service-area text reveal in a controlled stagger.
- Proof image enters from the right with a slight scale-down/depth-settle effect.
- The proof photo gets a very small scroll-linked vertical shift for depth.
- The video remains the primary ambient movement; do not add extra looping effects over it.

### Sticky Header

- After the user scrolls roughly one header height, the header gains a compact state.
- Logo and header height reduce slightly rather than snapping.
- Background becomes marginally more opaque and the shadow/border gains definition.

### Trust Strip

- Trust facts reveal in sequence from left to right.
- Numbers/strong text settle slightly faster than their supporting text.

### Story Split Section

- Copy reveals upward in layers.
- The three-image collage reveals from different directions with small staggered offsets.
- Images use a restrained hover zoom and elevation.

### Services Grid

- Cards enter in sequence as the section comes into view.
- Wide cards use the same timing language as small cards.
- On hover, cards lift subtly, gain a soft perspective tilt, and show a green edge/accent sweep.
- Motion must remain readable and stable on touch devices.

### Work Reel

- Video remains autoplaying ambient motion.
- Content reveals independently from the video.
- The background video receives a very small scroll-linked vertical depth movement.
- CTA button uses a brief highlight sweep on section reveal, not a constant loop.

### Project Proof

- Each project row reveals directionally based on layout.
- Photo uses a soft mask/clip reveal with a slight scale settle.
- Copy follows a fraction later.
- Reverse row mirrors the direction.

### Before / After

- Each transformation card reveals as one unit.
- Within each pair, “Before” appears first and “After” follows shortly afterward.
- The effect should read as a visual progression, not a flashy wipe.

### Recent Work Gallery Strip

- Images reveal in a stagger with alternating small vertical offsets.
- Hover state adds slight scale and shadow depth.

### Final CTA

- CTA band reveals as one strong closing moment.
- A brief green accent sweep moves across the edge/background once when first revealed.
- Button gains the same premium hover/press behavior as other primary actions.

## Interior Pages

### Shared Page Heroes

Applies to Our Story, Gallery, Quote, and Services.

- Background image gets a very slow cinematic drift using transform, not background-position animation.
- Kicker, heading, and body copy reveal in a layered stagger.
- Hero motion runs once on entry and then settles.
- On mobile, reduce drift distance and duration.

### Our Story

- Split sections reveal copy and image groups from opposing directions.
- Value cards stagger upward.

### Gallery

- Gallery items reveal in rows with a stagger.
- Hover zoom remains subtle.
- Opening the existing lightbox gets a polished fade/scale entrance.

### Services

- Each major service section reveals when entering the viewport.
- Copy and imagery reveal separately.
- Detail cards/pills stagger lightly.
- Alternating layouts animate from their natural side.

### Quote Page

- Hero receives shared hero animation.
- Quote form shell and contact card reveal independently.
- Avoid animating inside the embedded third-party form itself.

## Performance Rules

- Prefer `transform`, `opacity`, and `clip-path` only.
- Use `will-change` sparingly and only for actively animated elements.
- Use a single `IntersectionObserver` instance for reveal behavior.
- Use one shared `requestAnimationFrame` loop for scroll-linked effects.
- Avoid layout-triggering properties during animation.
- Do not animate large box-shadows continuously.
- Disable non-essential parallax on narrow/mobile viewports.

## Accessibility

Respect `prefers-reduced-motion: reduce` everywhere.

When reduced motion is enabled:
- all reveal elements render immediately
- no parallax or drift
- no clip-mask transitions
- no header interpolation beyond instant state change if needed
- hover/focus states remain usable without movement dependence

Keyboard navigation, lightbox focus behavior, mobile navigation, and Jobber iframe behavior must remain unchanged.

## Testing / Verification

Automated checks should verify:
- `animations.css` exists and is loaded site-wide
- `main.js` still contains current navigation/lightbox/Jobber behavior
- reveal system uses `IntersectionObserver`
- reduced-motion handling exists in CSS and JS
- no external animation library is introduced
- canonical pages retain valid asset references

Manual verification should cover:
- desktop homepage scroll from top to footer
- mobile homepage
- Services anchor jumps with sticky header
- Gallery lightbox
- Our Story section transitions
- Quote page and embedded form
- reduced-motion mode

## Success Criteria

The finished site should feel noticeably more premium and alive within the first few seconds, while still loading quickly, reading clearly, and behaving like a professional local-service website. Motion should support hierarchy and storytelling instead of competing with the content.
