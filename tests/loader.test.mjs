import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('homepage loader replaces the Vimeo iframe with a native same-origin MP4', () => {
  const script = read('js/loader.js');
  const css = read('css/loader.css');

  assert.match(script, /document\.createElement\('video'\)/);
  assert.match(script, /media\/hero-mowing\.mp4/);
  assert.match(script, /replaceChildren\(nativeVideo\)/);
  assert.match(css, /\.amng-loader__media/);
});
