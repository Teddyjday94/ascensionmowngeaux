import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
const read = (path) => readFileSync(resolve(out, path), 'utf8');

for (const path of [
  'index.html',
  'our-story.html',
  'services.html',
  'gallery.html',
  'request-a-quote.html',
  'services/lawn-care.html',
  'services/landscaping.html',
  'services/irrigation.html',
  'services/dirt-work-site-work.html',
  'services/soft-washing-pressure-washing.html',
  'sitemap.xml',
  'robots.txt',
]) {
  assert.ok(existsSync(resolve(out, path)), `missing ${path}`);
}

for (const path of [
  'index.html',
  'our-story.html',
  'services.html',
  'gallery.html',
  'request-a-quote.html',
  'services/lawn-care.html',
  'services/landscaping.html',
  'services/irrigation.html',
  'services/dirt-work-site-work.html',
  'services/soft-washing-pressure-washing.html',
]) {
  const html = read(path);
  assert.match(html, /<link rel="canonical" href="https:\/\/ascensionmowngeaux\.vercel\.app\//, `${path}: canonical`);
  assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive">/, `${path}: staging robots`);
  assert.match(html, /<meta property="og:title"/, `${path}: Open Graph`);
  assert.match(html, /<script type="application\/ld\+json">/, `${path}: schema`);
  assert.doesNotMatch(html, /Livingston/i, `${path}: Livingston must not be advertised`);
}

const lawn = read('services/lawn-care.html');
assert.doesNotMatch(lawn, /http-equiv="refresh"/);
assert.match(lawn, /id="lawn-maintenance"/);
assert.match(lawn, /id="herbicide-application"/);
assert.match(lawn, /Prairieville/);
assert.match(lawn, /Gonzales/);
assert.match(lawn, /id="local-faq-heading"/);
assert.match(lawn, /What is included in routine lawn maintenance\?/);
assert.match(lawn, /weekly and biweekly lawn service/i);

const landscaping = read('services/landscaping.html');
assert.match(landscaping, /id="landscape-cleanup"/);
assert.match(landscaping, /id="design-build"/);
assert.match(landscaping, /id="sod-installation"/);
assert.match(landscaping, /What landscaping work do you handle\?/);

const irrigation = read('services/irrigation.html');
assert.match(irrigation, /Do you repair existing irrigation systems\?/);
assert.match(irrigation, /Prairieville, Gonzales, Baton Rouge/);

const dirt = read('services/dirt-work-site-work.html');
assert.match(dirt, /id="dirt-work-site-work"/);
assert.match(dirt, /id="dump-trailer-services"/);
assert.match(dirt, /What types of dirt work do you handle\?/);

const pressure = read('services/soft-washing-pressure-washing.html');
assert.match(pressure, /What surfaces do you pressure wash\?/);

const index = read('index.html');
assert.match(index, /local-service-area-heading/);
assert.match(index, /local-seo-proof-heading/);
assert.match(index, /Lawn care and landscaping that shows from the road\./);
assert.match(index, /Ascension Chamber of Commerce/);
assert.match(index, /Prairieville, LA 70769/);
assert.match(index, /Gonzales, LA 70737/);
assert.match(index, /href="services\/lawn-care\.html"/);
assert.match(index, /href="services\/landscaping\.html"/);

const services = read('services.html');
assert.match(services, /href="services\/lawn-care\.html#lawn-maintenance"/);
assert.match(services, /href="services\/landscaping\.html#landscape-cleanup"/);
assert.match(services, /href="services\/irrigation\.html"/);

const sitemap = read('sitemap.xml');
for (const path of [
  '/',
  '/services/lawn-care.html',
  '/services/landscaping.html',
  '/services/irrigation.html',
  '/services/dirt-work-site-work.html',
  '/services/soft-washing-pressure-washing.html',
]) {
  assert.ok(sitemap.includes(`https://ascensionmowngeaux.vercel.app${path}`), `sitemap missing ${path}`);
}

assert.equal(read('robots.txt'), 'User-agent: *\nDisallow: /\n');

const mainJs = read('js/main.js');
assert.match(mainJs, /services\/lawn-care\.html#lawn-maintenance/);
assert.doesNotMatch(mainJs, /Keep every shared dropdown in sync with the single consolidated services page/);

console.log('SEO verification passed.');
