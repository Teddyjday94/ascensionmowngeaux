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
