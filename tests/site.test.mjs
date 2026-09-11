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

test('stylesheet contains the approved responsive visual system', () => {
  const css = readFileSync(resolve(root, 'css/styles.css'), 'utf8');
  for (const token of ['--pine-950', '--pine-800', '--grass-500', '--cream-50', '--ink-900']) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
  for (const selector of ['.trust-strip', '.service-card', '.project-proof', '.nav-backdrop', 'body.nav-open']) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
  assert.match(css, /html\s*\{[\s\S]*?overflow-x:\s*clip;/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width:\s*390px/);
});

test('homepage follows the proof-first content flow', () => {
  const html = htmlFor('index.html');
  const orderedMarkers = [
    'class="hero"',
    'class="trust-strip"',
    'id="services"',
    'class="project-proof"',
    'class="cta-band"',
  ];
  const positions = orderedMarkers.map((marker) => html.indexOf(marker));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.doesNotMatch(html, /What people are saying|Placeholder quotes|Prairieville homeowner|Gonzales homeowner/);
});

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
