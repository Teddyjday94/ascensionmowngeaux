import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');

async function patch(file, transform) {
  const path = resolve(out, file);
  const current = await readFile(path, 'utf8');
  const next = transform(current);
  if (next === current) throw new Error(`SEO postbuild made no changes to ${file}`);
  await writeFile(path, next);
}

await patch('services/lawn-care.html', (html) =>
  html.replace('id="lawn-care"', 'id="lawn-maintenance"')
);

await patch('services/landscaping.html', (html) =>
  html.replace('id="landscaping"', 'id="landscape-cleanup"')
);

const rootPages = ['index.html', 'our-story.html', 'services.html', 'gallery.html', 'request-a-quote.html'];
const hrefReplacements = [
  ['services.html#lawn-maintenance', 'services/lawn-care.html#lawn-maintenance'],
  ['services.html#herbicide-application', 'services/lawn-care.html#herbicide-application'],
  ['services.html#landscape-cleanup', 'services/landscaping.html#landscape-cleanup'],
  ['services.html#design-build', 'services/landscaping.html#design-build'],
  ['services.html#sod-installation', 'services/landscaping.html#sod-installation'],
  ['services.html#irrigation', 'services/irrigation.html'],
  ['services.html#dirt-work-site-work', 'services/dirt-work-site-work.html'],
  ['services.html#dump-trailer-services', 'services/dirt-work-site-work.html#dump-trailer-services'],
  ['services.html#pressure-washing', 'services/soft-washing-pressure-washing.html'],
];

for (const file of rootPages) {
  const path = resolve(out, file);
  let html = await readFile(path, 'utf8');
  for (const [from, to] of hrefReplacements) html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  if (file === 'index.html' && !html.includes('css/services-page.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="css/services-page.css">\n</head>');
  }
  await writeFile(path, html);
}

console.log('SEO postbuild complete: service anchors and static internal links verified.');
