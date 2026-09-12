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
  assert.match(css, /max-width:\s*700px[\s\S]*?\.project-proof \.photo-placeholder[\s\S]*?min-height:\s*0/);
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
  assert.match(quote, /class="jobber-embed-shell"/);
  assert.match(quote, /id="3adc7df3-2357-4067-8301-88630fbea38f" class="jobber-inline-work-request"/);
  assert.match(quote, /work_request_embed_snippet\.js/);
  assert.match(quote, /clienthub_id="3adc7df3-2357-4067-8301-88630fbea38f"/);
  assert.match(quote, /form_url="https:\/\/clienthub\.getjobber\.com\/client_hubs\/3adc7df3-2357-4067-8301-88630fbea38f\/public\/work_request\/embedded_work_request_form"/);
  assert.match(quote, /Open the secure quote form in a new tab/);
  assert.doesNotMatch(quote, /mailto:amngllc@gmail\.com\?subject=/);
  assert.doesNotMatch(gallery, /style="/);
  assert.doesNotMatch(quote, /style="/);
});

test('shared script gives the injected Jobber quote frame an accessible title', () => {
  const script = readFileSync(resolve(root, 'js/main.js'), 'utf8');
  assert.match(script, /MutationObserver/);
  assert.match(script, /Request a quote from Ascension Mow N' Geaux/);
  assert.match(script, /jobber-quote-frame/);
  assert.match(script, /style\.visibility = 'visible'/);
});

test('homepage uses accessible background video with a still-image fallback', () => {
  const html = htmlFor('index.html');
  assert.match(html, /<video[^>]*class="hero-video"[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline/);
  assert.match(html, /poster="media\/hero-mowing-poster\.jpg"/);
  assert.match(html, /src="media\/hero-mowing\.mp4"/);
  assert.match(html, /class="work-video"[^>]*poster="media\/land-clearing-poster\.jpg"/);
  assert.match(html, /src="media\/land-clearing\.mp4"/);
});

test('homepage presents the supplied before-and-after project pairs', () => {
  const html = htmlFor('index.html');
  assert.equal((html.match(/class="transformation-card"/g) || []).length, 2);
  assert.equal((html.match(/class="transformation-label before"/g) || []).length, 2);
  assert.equal((html.match(/class="transformation-label after"/g) || []).length, 2);
  assert.match(html, /images\/media\/side-yard-before\.jpg/);
  assert.match(html, /images\/media\/side-yard-after\.jpg/);
  assert.match(html, /images\/media\/rock-bed-before\.jpg/);
  assert.match(html, /images\/media\/rock-bed-after\.jpg/);
});

test('motion-sensitive visitors receive still media instead of background video', () => {
  const css = readFileSync(resolve(root, 'css/styles.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*?\.hero-video[\s\S]*?display:\s*none/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*?\.work-video[\s\S]*?display:\s*none/);
});

test('obsolete duplicate production files are absent', () => {
  for (const file of ['styles.css', 'main.js', 'lawn-care.html']) {
    assert.equal(existsSync(resolve(root, file)), false, `${file} should be removed`);
  }
});
