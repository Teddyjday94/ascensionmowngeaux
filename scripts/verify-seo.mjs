import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
const read = (path) => readFileSync(resolve(out, path), 'utf8');
const report = [];
let failures = 0;
const { siteUrl, indexingEnabled } = JSON.parse(read('seo-build.json'));
const expectedRobots = indexingEnabled
  ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  : 'noindex,nofollow,noarchive';
const count = (html, pattern) => (html.match(pattern) || []).length;

function check(label, condition, detail = '') {
  const ok = Boolean(condition);
  report.push(`${ok ? 'PASS' : 'FAIL'} | ${label}${detail ? ` | ${detail}` : ''}`);
  if (!ok) failures += 1;
}

const rootPages = ['index.html', 'our-story.html', 'services.html', 'gallery.html', 'request-a-quote.html'];
const servicePages = [
  'services/lawn-care.html',
  'services/landscaping.html',
  'services/irrigation.html',
  'services/dirt-work-site-work.html',
  'services/soft-washing-pressure-washing.html',
];
const htmlPages = [...rootPages, ...servicePages];

for (const path of [...htmlPages, 'sitemap.xml', 'robots.txt']) {
  check(`exists ${path}`, existsSync(resolve(out, path)));
}

for (const path of htmlPages) {
  if (!existsSync(resolve(out, path))) continue;
  const html = read(path);
  check(`${path} canonical`, html.includes(`<link rel="canonical" href="${siteUrl}/`));
  check(`${path} robots`, html.includes(`<meta name="robots" content="${expectedRobots}">`));
  check(`${path} single SEO block`, count(html, /<link rel="canonical"/g) === 1 && count(html, /<meta name="robots"/g) === 1 && count(html, /application\/ld\+json/g) === 1);
  check(`${path} no vercel.app URLs`, !/vercel\.app/.test(html));
  check(`${path} Open Graph`, /<meta property="og:title"/.test(html));
  check(`${path} schema`, /<script type="application\/ld\+json">/.test(html));
  check(`${path} no Livingston`, !/Livingston/i.test(html), /Livingston/i.test(html) ? 'Livingston still present' : '');
}

for (const path of servicePages) {
  if (!existsSync(resolve(out, path))) continue;
  const html = read(path);
  check(`${path} FAQ section`, /class="service-section service-section-light local-faq-section"/.test(html));
  check(`${path} FAQ heading`, /id="local-faq-heading"/.test(html));
  check(`${path} local relevance`, /Prairieville|Gonzales|Ascension Parish/.test(html));
}

if (existsSync(resolve(out, 'index.html'))) {
  const index = read('index.html');
  check('homepage local service area', /local-service-area-heading/.test(index));
  check('homepage local proof', /local-seo-proof-heading/.test(index));
  check('homepage keyword H1', /Lawn care and landscaping that shows from the road\./.test(index));
  check('homepage chamber proof', /Ascension Chamber of Commerce/.test(index));
  check('homepage Prairieville ZIP', /Prairieville, LA 70769/.test(index));
  check('homepage Gonzales ZIP', /Gonzales, LA 70737/.test(index));
}

if (existsSync(resolve(out, 'services/lawn-care.html'))) {
  const lawn = read('services/lawn-care.html');
  check('lawn page no meta refresh', !/http-equiv="refresh"/.test(lawn));
  check('lawn maintenance anchor', /id="lawn-maintenance"/.test(lawn));
  check('herbicide anchor', /id="herbicide-application"/.test(lawn));
}

if (existsSync(resolve(out, 'services/landscaping.html'))) {
  const landscaping = read('services/landscaping.html');
  check('landscape cleanup anchor', /id="landscape-cleanup"/.test(landscaping));
  check('design build anchor', /id="design-build"/.test(landscaping));
  check('sod anchor', /id="sod-installation"/.test(landscaping));
}

if (existsSync(resolve(out, 'services/dirt-work-site-work.html'))) {
  const dirt = read('services/dirt-work-site-work.html');
  check('dirt work anchor', /id="dirt-work-site-work"/.test(dirt));
  check('dump trailer anchor', /id="dump-trailer-services"/.test(dirt));
}

if (existsSync(resolve(out, 'sitemap.xml'))) {
  const sitemap = read('sitemap.xml');
  for (const path of ['/', '/services/lawn-care.html', '/services/landscaping.html', '/services/irrigation.html', '/services/dirt-work-site-work.html', '/services/soft-washing-pressure-washing.html']) {
    check(`sitemap ${path}`, sitemap.includes(`${siteUrl}${path}`));
  }
}

if (existsSync(resolve(out, 'robots.txt'))) {
  const expected = indexingEnabled
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  check(`robots.txt ${indexingEnabled ? 'allows crawling' : 'staging block'}`, read('robots.txt') === expected, JSON.stringify(read('robots.txt')));
}

if (existsSync(resolve(out, 'js/main.js'))) {
  const mainJs = read('js/main.js');
  check('service JS lawn target', /services\/lawn-care\.html#lawn-maintenance/.test(mainJs));
  check('legacy service JS removed', !/Keep every shared dropdown in sync with the single consolidated services page/.test(mainJs));
}

report.push(`SUMMARY | ${failures} failure(s)`);
console.log(report.join('\n'));
if (failures > 0) throw new Error(`SEO verification failed with ${failures} failure(s)`);
