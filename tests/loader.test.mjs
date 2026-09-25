import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('homepage loader uses the uploaded video directly without Vimeo dependencies', () => {
  const homepage = read('index.html');
  const script = read('js/loader.js');
  const css = read('css/loader.css');

  assert.match(
    homepage,
    /<video[^>]*data-loader-video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline[^>]*>[\s\S]*?<source src="media\/ascension-loader-bg\.mp4" type="video\/mp4">[\s\S]*?<\/video>/,
  );
  assert.doesNotMatch(homepage, /vimeo/i);
  assert.match(script, /querySelector\('\[data-loader-video\]'\)/);
  assert.doesNotMatch(script, /hero-mowing\.mp4|createElement\('video'\)/);
  assert.match(css, /\.amng-loader__media/);
});

test('loader MP4 is a compact browser-streamable asset', () => {
  const videoPath = resolve(root, 'media/ascension-loader-bg.mp4');
  const stats = statSync(videoPath);
  const header = readFileSync(videoPath).subarray(0, 64).toString('latin1');

  assert.ok(stats.size > 100_000, 'loader video should contain real footage');
  assert.ok(stats.size < 8_000_000, 'loader video should remain under 8 MB');
  assert.match(header, /ftyp/, 'loader video should be an MP4 file');
});
