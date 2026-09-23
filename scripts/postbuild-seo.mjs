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
const servicePages = [
  'services/lawn-care.html',
  'services/landscaping.html',
  'services/irrigation.html',
  'services/dirt-work-site-work.html',
  'services/soft-washing-pressure-washing.html',
];
const allHtmlPages = [...rootPages, ...servicePages];

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

const localFaqs = {
  'services/lawn-care.html': {
    title: 'Lawn care questions from Prairieville and Gonzales property owners.',
    intro: 'Straight answers about recurring lawn service in Ascension Parish.',
    items: [
      ['What is included in routine lawn maintenance?', 'Routine service can include mowing, string trimming, edging and blowing hard surfaces clean. Targeted herbicide application can also be included where it fits the property and scope.'],
      ['Do you offer weekly and biweekly lawn service?', 'Yes. Weekly and biweekly schedules are available, with service frequency adjusted around the property, the season and Louisiana growing conditions.'],
      ['Do you maintain both homes and commercial properties?', 'Yes. Ascension Mow N\' Geaux provides recurring lawn maintenance for residential and commercial properties in the local service area.'],
      ['Can lawn care be combined with landscaping or irrigation work?', 'Yes. Landscaping, sod, irrigation and dirt work can be quoted alongside lawn maintenance when the property needs more than one type of service.'],
    ],
  },
  'services/landscaping.html': {
    title: 'Landscaping questions for Ascension Parish properties.',
    intro: 'What to know before a cleanup, bed renovation or new landscape installation.',
    items: [
      ['What landscaping work do you handle?', 'Services include landscape cleanup, bed renovation, design and installation, hedge pruning, mulch, river rock and sod installation.'],
      ['Can you prepare the ground before sod installation?', 'Yes. Site preparation and grading can be coordinated before sod so new turf is not simply laid over an existing ground or drainage problem.'],
      ['Can irrigation be handled during a landscaping project?', 'Yes. Irrigation work can be coordinated with landscaping when beds, sod or planting areas need new coverage, repairs or adjustments.'],
      ['Where do you provide landscaping service?', 'The core service area includes Prairieville, Gonzales, Baton Rouge and nearby communities in Ascension Parish.'],
    ],
  },
  'services/irrigation.html': {
    title: 'Irrigation questions from Prairieville and Gonzales customers.',
    intro: 'Useful details for sprinkler repairs, new zones and drip irrigation projects.',
    items: [
      ['Do you repair existing irrigation systems?', 'Yes. Broken heads, valves, coverage gaps and other visible system problems can be diagnosed and repaired.'],
      ['Do you install new irrigation zones and lines?', 'Yes. New zones, lines and drip irrigation can be planned around lawns, beds and how the property is actually used.'],
      ['Can irrigation work be coordinated with sod or landscaping?', 'Yes. Irrigation can be combined with sod installation, landscaping and grading when the project needs the work completed in the right order.'],
      ['What area do you serve for irrigation work?', 'Irrigation service is available in Prairieville, Gonzales, Baton Rouge and nearby Ascension Parish communities.'],
    ],
  },
  'services/dirt-work-site-work.html': {
    title: 'Dirt work and grading questions for local property projects.',
    intro: 'Common questions about grading, excavation, delivery and haul-off in Ascension Parish.',
    items: [
      ['What types of dirt work do you handle?', 'Projects can include grading, leveling, excavation, trenching, material delivery and debris haul-off.'],
      ['Can grading be done before sod or landscaping?', 'Yes. Ground preparation can be coordinated before sod, landscaping or irrigation so finish work starts on a more workable site.'],
      ['Do you offer dump trailer and haul-off service?', 'Yes. Material delivery and debris haul-off are available, with quotes based on the load, access and actual project scope.'],
      ['Where is dirt work available?', 'The core dirt work and site work area includes Gonzales, Prairieville, Baton Rouge and nearby Ascension Parish communities.'],
    ],
  },
  'services/soft-washing-pressure-washing.html': {
    title: 'Pressure washing questions for Prairieville and Gonzales properties.',
    intro: 'What to expect when cleaning exterior hard surfaces and fence areas.',
    items: [
      ['What surfaces do you pressure wash?', 'The current service focuses on driveways, patios, walkways and fences, with the cleaning approach matched to the material.'],
      ['Do you use the same pressure on every surface?', 'No. Concrete, pavers and fence materials do not all need the same pressure, so the technique is adjusted to fit the surface.'],
      ['Can pressure washing be scheduled with lawn or landscape work?', 'Yes. Exterior cleaning can be quoted alongside lawn maintenance, landscaping or other property work when several areas need attention.'],
      ['What area do you serve for pressure washing?', 'Pressure washing is available in Prairieville, Gonzales, Baton Rouge and nearby communities in Ascension Parish.'],
    ],
  },
};

function removeLivingstonServiceArea(html) {
  let next = html;

  next = next.replaceAll(',{"@type":"City","name":"Livingston, Louisiana"}', '');
  next = next.replaceAll('{"@type":"City","name":"Livingston, Louisiana"},', '');
  next = next.replaceAll(',{"@type":"AdministrativeArea","name":"Livingston Parish, Louisiana"}', '');
  next = next.replaceAll('{"@type":"AdministrativeArea","name":"Livingston Parish, Louisiana"},', '');

  const replacements = [
    ['Ascension &amp; Livingston Parishes', 'Ascension Parish'],
    ['Ascension & Livingston Parishes', 'Ascension Parish'],
    ['Ascension and Livingston Parishes', 'Ascension Parish'],
    ['Ascension and Livingston Parish service area', 'Ascension Parish service area'],
    ['Ascension + Livingston', 'Ascension Parish'],
    ['Prairieville, Gonzales, Baton Rouge, and Livingston, Louisiana', 'Prairieville, Gonzales, and Baton Rouge, Louisiana'],
    ['Prairieville, Gonzales, Baton Rouge, and Livingston', 'Prairieville, Gonzales, and Baton Rouge'],
    ['Prairieville, Gonzales, Baton Rouge and Livingston', 'Prairieville, Gonzales and Baton Rouge'],
    ['Prairieville, Gonzales, Baton Rouge, Livingston and nearby communities', 'Prairieville, Gonzales, Baton Rouge and nearby communities'],
    ['including Prairieville, Gonzales, Baton Rouge and Livingston', 'including Prairieville, Gonzales and Baton Rouge'],
    ['<li>Livingston</li>', ''],
  ];

  for (const [from, to] of replacements) next = next.replaceAll(from, to);

  next = next.replace(/,?\s+Livingston Parish(?:es)?/gi, '');
  next = next.replace(/,?\s+Livingston, Louisiana/gi, '');
  next = next.replace(/,?\s+Livingston(?=[.,<\s])/gi, '');
  next = next.replace(/\s{2,}/g, ' ');

  return next;
}

function faqSection(data) {
  const cards = data.items
    .map(([question, answer]) => `<article class="service-detail"><h3>${question}</h3><p>${answer}</p></article>`)
    .join('\n');

  return `<section class="service-section service-section-light local-faq-section" aria-labelledby="local-faq-heading">
  <div class="container">
    <div class="section-head">
      <p class="kicker">Local questions</p>
      <h2 id="local-faq-heading">${data.title}</h2>
      <p>${data.intro}</p>
    </div>
    <div class="service-detail-grid">${cards}</div>
  </div>
</section>`;
}

function addLocalProof(html) {
  const section = `<section class="section-white" aria-labelledby="local-seo-proof-heading">
  <div class="container">
    <div class="section-head">
      <p class="kicker">Local and established</p>
      <h2 id="local-seo-proof-heading">A lawn and landscape crew rooted in Ascension Parish.</h2>
      <p>Ascension Mow N' Geaux has served local properties for years and is listed with the Ascension Chamber of Commerce. The core service area includes Prairieville, Gonzales, Baton Rouge and nearby Ascension Parish communities.</p>
    </div>
    <div class="service-detail-grid">
      <article class="service-detail"><h3>Prairieville, LA 70769</h3><p>Lawn maintenance, landscaping, irrigation, sod, dirt work and pressure washing for residential and commercial properties.</p></article>
      <article class="service-detail"><h3>Gonzales, LA 70737</h3><p>Recurring lawn care and project work from landscape cleanup and irrigation to grading, hauling and property improvements.</p></article>
      <article class="service-detail"><h3>Ascension Parish</h3><p>One local crew for routine maintenance and larger outdoor projects, with service scope matched to the property.</p></article>
      <article class="service-detail"><h3>Local business listing</h3><p><a href="https://business.ascensionchamber.com/member-directory/Search/lawn-care-maintenance-684576" target="_blank" rel="noopener">View the Ascension Chamber of Commerce lawn care directory</a>.</p></article>
    </div>
  </div>
</section>`;

  return html.replace('<section class="cta-band">', `${section}\n<section class="cta-band">`);
}

for (const file of rootPages) {
  const path = resolve(out, file);
  let html = await readFile(path, 'utf8');
  for (const [from, to] of hrefReplacements) html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  if (file === 'index.html' && !html.includes('css/services-page.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="css/services-page.css">\n</head>');
  }
  if (file === 'index.html') {
    html = html.replace('<h1>Good work shows from the road.</h1>', '<h1>Lawn care and landscaping that shows from the road.</h1>');
    html = addLocalProof(html);
  }
  await writeFile(path, html);
}

for (const file of servicePages) {
  const path = resolve(out, file);
  let html = await readFile(path, 'utf8');
  const data = localFaqs[file];
  if (!data) throw new Error(`Missing local FAQ data for ${file}`);
  html = html.replace('<section class="services-cta">', `${faqSection(data)}\n<section class="services-cta">`);
  await writeFile(path, html);
}

for (const file of allHtmlPages) {
  const path = resolve(out, file);
  const html = await readFile(path, 'utf8');
  await writeFile(path, removeLivingstonServiceArea(html));
}

console.log('SEO postbuild complete: service anchors, local proof, service FAQs, static internal links, and Ascension Parish targeting applied.');
