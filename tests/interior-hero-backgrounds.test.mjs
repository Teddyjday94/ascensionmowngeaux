import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('interior heroes use unique full-bleed project photography', () => {
  const css = read('css/site-fixes.css');

  assert.match(css, /\.page-header-media\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;/);
  assert.match(css, /\.page-header-media img\s*\{[\s\S]*?opacity:\s*0;/);
  assert.match(css, /landscape-install-in-progress\.jpg/);
  assert.match(css, /landscape-bed-front-02\.jpg/);
  assert.match(css, /maintained-bed-drive\.jpg/);
  assert.match(css, /crew-truck-trailer\.jpg/);
});

test('selected hero backgrounds are not reused as visible content on the same page', () => {
  const pages = [
    ['our-story.html', 'images/media/landscape-install-in-progress.jpg'],
    ['gallery.html', 'images/landscape-bed-front-02.jpg'],
    ['request-a-quote.html', 'images/media/maintained-bed-drive.jpg'],
  ];

  for (const [page, image] of pages) {
    assert.equal(read(page).includes(image), false, `${page} visibly reuses ${image}`);
  }
});

test('services hero photo becomes the background instead of a second visible hero card', () => {
  const css = read('css/site-fixes.css');
  assert.match(css, /\.services-hero\s*\{[\s\S]*?crew-truck-trailer\.jpg/);
  assert.match(css, /\.services-hero-photo\s*\{[\s\S]*?display:\s*none;/);
});
