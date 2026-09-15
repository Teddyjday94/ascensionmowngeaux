import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('motion system uses one reveal observer and honors reduced motion', () => {
  const script = read('js/main.js');
  const css = read('css/animations.css');

  assert.match(script, /function setupMotionSystem\(/);
  assert.equal((script.match(/new IntersectionObserver\(/g) || []).length, 1);
  assert.match(script, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /--motion-index/);
  assert.match(css, /\.motion-reveal/);
  assert.match(css, /\.is-visible/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});

test('homepage choreography covers hero, services, proof, transformations, gallery, and CTA', () => {
  const script = read('js/main.js');
  const css = read('css/animations.css');

  for (const marker of [
    'annotateHomepageMotion',
    '.hero-copy > *',
    '.hero-photo',
    '.split-media .photo-placeholder',
    '.project-proof',
    '.transformation-card',
    '.work-reel-content > *',
    '.cta-band',
  ]) {
    assert.ok(script.includes(marker), `missing homepage motion marker ${marker}`);
  }

  assert.match(css, /\.service-card::after/);
  assert.match(css, /\.service-card:hover/);
  assert.match(css, /\.photo-placeholder:hover img/);
  assert.match(css, /\.motion-accent-sweep/);
});

test('scroll system uses one requestAnimationFrame loop for header and depth motion', () => {
  const script = read('js/main.js');
  const css = read('css/animations.css');

  assert.equal((script.match(/requestAnimationFrame\(/g) || []).length, 1);
  assert.match(script, /is-scrolled/);
  assert.match(script, /--motion-parallax-y/);
  assert.match(script, /motion-depth/);
  assert.match(css, /\.site-header\.is-scrolled/);
  assert.match(css, /--motion-parallax-y/);
});

test('interior motion covers services, story, gallery, quote, and lightbox without entering Jobber iframe', () => {
  const script = read('js/main.js');
  const css = read('css/animations.css');

  for (const marker of [
    'annotateInteriorMotion',
    '.service-section',
    '.split-block',
    '.gallery-grid .photo-placeholder',
    '.jobber-embed-shell',
    '.quote-contact-card',
    'motion-hero-depth',
  ]) {
    assert.ok(script.includes(marker), `missing interior motion marker ${marker}`);
  }

  assert.match(css, /\.lightbox\.open/);
  assert.doesNotMatch(script, /contentWindow|contentDocument/);
});

test('animation pass preserves shared interaction contracts and avoids external motion libraries', () => {
  const script = read('js/main.js');

  for (const marker of [
    'function setNavOpen(',
    'function setServicesOpen(',
    'MutationObserver',
    'data-lightbox-label',
    "event.key !== 'Escape'",
  ]) {
    assert.ok(script.includes(marker), `missing preserved interaction marker ${marker}`);
  }

  assert.doesNotMatch(script, /gsap|anime\.|motion\.one|framer/i);
});
