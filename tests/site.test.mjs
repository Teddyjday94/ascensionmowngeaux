import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');

const canonicalPages = [
  'index.html',
  'our-story.html',
  'gallery.html',
  'request-a-quote.html',
  'services.html',
];

const legacyServicePages = [
  'services/lawn-care.html',
  'services/landscaping.html',
  'services/irrigation.html',
  'services/dirt-work-site-work.html',
  'services/soft-washing-pressure-washing.html',
];

const htmlFor = (page) => readFileSync(resolve(root, page), 'utf8');

test('all canonical page and asset references resolve', () => {
  for (const page of canonicalPages) {
    const html = htmlFor(page);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

    for (const ref of refs) {
      if (/^(?:https?:|mailto:|tel:|#)/.test(ref)) continue;
      const target = ref.split(/[?#]/, 1)[0];
      assert.ok(existsSync(resolve(root, dirname(page), target)), `${page}: missing ${ref}`);
    }
  }
});

test('single consolidated services page and five legacy redirect pages exist', () => {
  assert.ok(existsSync(resolve(root, 'services.html')));
  for (const page of legacyServicePages) assert.ok(existsSync(resolve(root, page)), page);
});

test('canonical pages keep the accessible shared navigation contract', () => {
  for (const page of canonicalPages) {
    const html = htmlFor(page);
    assert.match(html, /class="nav-toggle"[^>]*aria-controls="site-navigation"/);
    assert.match(html, /class="services-toggle"[^>]*aria-expanded="false"/);
    assert.match(html, /class="nav-backdrop"[^>]*hidden/);
    assert.match(html, /<nav[^>]*id="site-navigation"/);
  }
});

test('services page dropdown keeps all nine offerings and exact section targets', () => {
  const html = htmlFor('services.html');
  const expected = new Map([
    ['Lawn Maintenance', 'services.html#lawn-maintenance'],
    ['Landscape Cleanup', 'services.html#landscape-cleanup'],
    ['Landscape Design &amp; Build', 'services.html#design-build'],
    ['Herbicide Application', 'services.html#herbicide-application'],
    ['Dump Trailer Services', 'services.html#dump-trailer-services'],
    ['Sod Installation', 'services.html#sod-installation'],
    ['Dirt Work &amp; Site Work', 'services.html#dirt-work-site-work'],
    ['Pressure Washing', 'services.html#pressure-washing'],
    ['Irrigation', 'services.html#irrigation'],
  ]);

  const menu = html.match(/<ul class="dropdown"[^>]*>([\s\S]*?)<\/ul>/)?.[1] || '';
  const links = [...menu.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)]
    .map((match) => [match[2].trim(), match[1]]);

  assert.deepEqual(new Map(links), expected);
});

test('services page contains one hero and exactly five grouped service sections', () => {
  const html = htmlFor('services.html');
  assert.equal((html.match(/class="services-hero"/g) || []).length, 1);
  assert.equal((html.match(/class="service-section /g) || []).length, 5);

  for (const id of [
    'lawn-maintenance',
    'herbicide-application',
    'landscape-cleanup',
    'design-build',
    'sod-installation',
    'irrigation',
    'dirt-work-site-work',
    'dump-trailer-services',
    'pressure-washing',
  ]) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }
});

test('services page uses only appropriate proof photos for the grouped services', () => {
  const html = htmlFor('services.html');

  assert.match(html, /images\/media\/crew-truck-trailer\.jpg/);
  assert.match(html, /images\/fresh-mow-lawn\.jpg/);
  assert.match(html, /images\/landscape-bed-front-01\.jpg/);
  assert.match(html, /images\/sod-prep-lot-02\.jpg/);
  assert.match(html, /images\/irrigation-trench\.jpg/);
  assert.match(html, /images\/excavator-dirt-work\.jpg/);
  assert.match(html, /images\/dirt-work-lot-clear\.jpg/);
  assert.match(html, /images\/pressure-washed-driveway\.jpg/);

  const pressureSection = html.match(/id="pressure-washing"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(pressureSection, /pressure-washed-driveway\.jpg/);
  assert.doesNotMatch(pressureSection, /fresh-mow|estate-lawn|zero-turn/);

  const dirtSection = html.match(/id="dirt-work-site-work"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(dirtSection, /excavator-dirt-work\.jpg/);
  assert.doesNotMatch(dirtSection, /crew-truck-trailer\.jpg/);
  assert.doesNotMatch(dirtSection, /dump trailer[^<]*(?:photo|pictured|shown)/i);
});

test('legacy service pages redirect to the correct grouped sections and preserve old hashes', () => {
  const checks = [
    ['services/lawn-care.html', '#lawn-maintenance', ['lawn-maintenance', 'herbicide-application']],
    ['services/landscaping.html', '#landscape-cleanup', ['landscape-cleanup', 'design-build', 'sod-installation']],
    ['services/irrigation.html', '#irrigation', ['irrigation']],
    ['services/dirt-work-site-work.html', '#dirt-work-site-work', ['dirt-work-site-work', 'dump-trailer-services']],
    ['services/soft-washing-pressure-washing.html', '#pressure-washing', ['pressure-washing']],
  ];

  for (const [page, defaultHash, preserved] of checks) {
    const html = htmlFor(page);
    assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=\\.\\./services\\.html${defaultHash}"`));
    assert.match(html, /window\.location\.replace\('\.\.\/services\.html#' \+ target\)/);
    for (const anchor of preserved) assert.ok(html.includes(`'${anchor}': '${anchor}'`), `${page}: ${anchor}`);
  }
});

test('shared script corrects sticky-header overflow and normalizes service links site-wide', () => {
  const script = htmlFor('js/main.js');
  assert.match(script, /document\.body\.style\.overflowX = 'clip'/);
  assert.match(script, /css\/site-fixes\.css/);
  assert.match(script, /serviceTargets/);
  assert.match(script, /services\.html#/);
  assert.match(script, /services\/lawn-care\.html/);
  assert.match(script, /services\/soft-washing-pressure-washing\.html/);
});

test('site fixes remove the dropdown dead zone and preserve sticky-header behavior', () => {
  const css = htmlFor('css/site-fixes.css');
  assert.match(css, /body\s*\{[\s\S]*?overflow-x:\s*clip;/);
  assert.match(css, /\.dropdown\s*\{[\s\S]*?top:\s*100%;/);
  assert.match(css, /\.has-dropdown::after\s*\{[\s\S]*?height:\s*0\.7rem;/);
});

test('services anchors account for the persistent header', () => {
  const css = htmlFor('css/services-page.css');
  assert.match(css, /\.service-section\s*\{[\s\S]*?scroll-margin-top:\s*104px;/);
  assert.match(css, /\.service-detail\s*\{[\s\S]*?scroll-margin-top:\s*104px;/);
});

test('shared navigation and gallery behaviors remain intact', () => {
  const script = htmlFor('js/main.js');
  for (const marker of [
    'function setNavOpen(',
    'function setServicesOpen(',
    'nav-backdrop',
    'matchMedia',
    'MutationObserver',
    'data-lightbox-label',
    "event.key !== 'Escape'",
  ]) {
    assert.ok(script.includes(marker), `missing ${marker}`);
  }
});

test('homepage still follows the proof-first content flow', () => {
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
});

test('shared stylesheet retains the approved visual system and responsive video behavior', () => {
  const css = htmlFor('css/styles.css');
  for (const token of ['--pine-950', '--pine-800', '--grass-500', '--cream-50', '--ink-900']) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.hero-video\s*\{[\s\S]*?opacity:\s*1;/);
  assert.match(css, /\.work-video\s*\{[\s\S]*?opacity:\s*1;/);
});

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
