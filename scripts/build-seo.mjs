import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
const defaultSiteUrl = 'https://ascensionmowngeaux.vercel.app';
const siteUrl = (process.env.SITE_URL || defaultSiteUrl).replace(/\/$/, '');
const indexingEnabled = String(process.env.SEO_INDEX || 'false').toLowerCase() === 'true';
const businessName = "Ascension Mow N' Geaux";
const phone = '+1-225-333-1991';
const email = 'amngllc@gmail.com';
const ogImage = `${siteUrl}/images/media/crew-truck-trailer.jpg`;

const areas = [
  'Prairieville, Louisiana',
  'Gonzales, Louisiana',
  'Baton Rouge, Louisiana',
  'Livingston, Louisiana',
  'Ascension Parish, Louisiana',
  'Livingston Parish, Louisiana',
];

const pages = {
  'index.html': {
    path: '/',
    type: 'WebPage',
    title: "Lawn Care & Landscaping in Prairieville, LA | Ascension Mow N' Geaux",
    description: 'Local lawn care, landscaping, irrigation, dirt work, hauling and pressure washing in Prairieville, Gonzales, Baton Rouge and Livingston. Family-run since 2015.',
    label: 'Home',
  },
  'our-story.html': {
    path: '/our-story.html',
    type: 'AboutPage',
    title: "About Ascension Mow N' Geaux | Local Lawn & Landscape Crew",
    description: "Meet Ascension Mow N' Geaux, a family-run lawn care and landscaping crew serving Ascension and Livingston Parishes since 2015.",
    label: 'Our Story',
  },
  'services.html': {
    path: '/services.html',
    type: 'CollectionPage',
    title: "Lawn & Property Services in Ascension Parish | Ascension Mow N' Geaux",
    description: 'Explore lawn maintenance, landscaping, irrigation, sod installation, dirt and site work, hauling and pressure washing across Ascension and Livingston Parishes.',
    label: 'Services',
  },
  'gallery.html': {
    path: '/gallery.html',
    type: 'CollectionPage',
    title: "Lawn & Landscaping Project Gallery | Ascension Mow N' Geaux",
    description: 'See real lawn care, landscaping, sod, dirt work, irrigation and property cleanup projects completed around Prairieville, Gonzales and nearby Louisiana communities.',
    label: 'Gallery',
  },
  'request-a-quote.html': {
    path: '/request-a-quote.html',
    type: 'ContactPage',
    title: "Request a Free Lawn or Landscaping Quote | Ascension Mow N' Geaux",
    description: "Request a free quote from Ascension Mow N' Geaux for lawn care, landscaping, irrigation, dirt work or pressure washing in Ascension and Livingston Parishes.",
    label: 'Get a Quote',
  },
};

const services = [
  {
    file: 'lawn-care.html',
    slug: 'lawn-care',
    name: 'Lawn Care',
    serviceType: 'Lawn maintenance and mowing',
    title: "Lawn Care in Prairieville & Gonzales, LA | Ascension Mow N' Geaux",
    description: 'Weekly and biweekly lawn care in Prairieville, Gonzales and nearby areas, including mowing, edging, string trimming, blowing and targeted herbicide application.',
    eyebrow: 'Lawn Care / Ascension & Livingston Parishes',
    h1: 'Lawn care that keeps the whole property looking finished.',
    intro: 'Routine lawn maintenance for homes and commercial properties across Prairieville, Gonzales and nearby communities. Each visit is built around clean lines, dependable scheduling and leaving hard surfaces clear before the crew pulls away.',
    image: '../images/fresh-mow-lawn.jpg',
    imageAlt: 'Freshly mowed and edged residential lawn in the Ascension Parish area',
    pills: ['Weekly & biweekly service', 'Mowing', 'String trimming', 'Edging', 'Blowing', 'Residential & commercial'],
    details: [
      ['Mowing & Finish Work', 'Mowing is paired with string trimming, edging and blowing so the job looks complete from the curb to the back fence.'],
      ['Seasonal Scheduling', 'Service frequency can follow Louisiana growing conditions instead of forcing the same schedule year-round.'],
      ['Property Awareness', 'Bare spots, drainage concerns and other visible problem areas can be flagged while the crew is already on the property.'],
      ['Herbicide Application', 'Targeted treatment can be used for appropriate problem areas as part of a practical maintenance plan.'],
    ],
    secondaryId: 'herbicide-application',
    secondaryHeading: 'Lawn maintenance for Prairieville, Gonzales and surrounding communities.',
    secondaryText: 'Ascension Mow N’ Geaux serves properties throughout Ascension and Livingston Parishes, including Prairieville, Gonzales, Baton Rouge and Livingston. If a lawn also needs sod, bed cleanup, irrigation repair or dirt work, those services can be coordinated with the same local crew.',
    related: [['Landscaping', 'landscaping.html'], ['Irrigation', 'irrigation.html'], ['Dirt Work', 'dirt-work-site-work.html']],
  },
  {
    file: 'landscaping.html',
    slug: 'landscaping',
    name: 'Landscaping',
    serviceType: 'Landscape cleanup, design, installation and sod installation',
    title: "Landscaping in Prairieville & Gonzales, LA | Ascension Mow N' Geaux",
    description: 'Landscape cleanup, bed renovation, design and installation, hedge pruning, mulch and sod installation in Prairieville, Gonzales and surrounding Louisiana communities.',
    eyebrow: 'Landscaping / Prairieville & Gonzales',
    h1: 'Landscaping built around how the property actually works.',
    intro: 'From overgrown beds to new landscape installs, the work starts with the conditions already on the property: drainage, sun, traffic, maintenance needs and the way the finished space should look from the road.',
    image: '../images/landscape-bed-front-01.jpg',
    imageAlt: 'Completed landscape bed installation with fresh edging and plantings',
    pills: ['Landscape cleanup', 'Design & build', 'Bed renovation', 'Hedge pruning', 'Mulch', 'Sod installation'],
    details: [
      ['Landscape Cleanup', 'Overgrowth, weeds, tired material and unshaped shrubs are cleaned up so existing beds look intentional again.'],
      ['Design & Build', 'Bed shaping, demolition, planting, edging and installation can be handled as one coordinated project.'],
      ['Sod Installation', 'Site preparation and grading come before installation so new turf starts on workable ground instead of covering an existing problem.'],
      ['Ongoing Maintenance', 'Landscape work can be paired with routine lawn service so the finished property stays maintained after installation.'],
    ],
    secondaryId: 'sod-installation',
    secondaryHeading: 'Landscape projects across Ascension and Livingston Parishes.',
    secondaryText: 'The crew works throughout Prairieville, Gonzales, Baton Rouge, Livingston and nearby communities. Projects can also overlap with irrigation, grading and hauling, which helps keep the work on one schedule instead of coordinating several contractors.',
    related: [['Lawn Care', 'lawn-care.html'], ['Irrigation', 'irrigation.html'], ['Dirt Work', 'dirt-work-site-work.html']],
  },
  {
    file: 'irrigation.html',
    slug: 'irrigation',
    name: 'Irrigation',
    serviceType: 'Irrigation installation and repair',
    title: "Irrigation Repair & Installation in Prairieville, LA | Ascension Mow N' Geaux",
    description: 'Irrigation installation, repairs, drip lines and seasonal adjustments for lawns and landscape beds in Prairieville, Gonzales and nearby Ascension Parish communities.',
    eyebrow: 'Irrigation / Ascension Parish',
    h1: 'Irrigation that puts water where the lawn and beds need it.',
    intro: 'New zones, drip lines, repairs and seasonal adjustments help keep a small coverage problem from turning into dry turf, washed-out beds or wasted water. Install work is trenched, connected and tested before the job is called finished.',
    image: '../images/irrigation-trench.jpg',
    imageAlt: 'Residential irrigation line installation trenched through a lawn',
    pills: ['New systems', 'Repairs', 'Drip lines', 'Coverage adjustments', 'Seasonal checks'],
    details: [
      ['System Repairs', 'Broken heads, valves and coverage gaps can be diagnosed and repaired before they create larger lawn or landscape problems.'],
      ['New Zones & Lines', 'New irrigation can be planned around lawn areas, landscape beds and how the property is actually used.'],
      ['Drip Irrigation', 'Drip lines provide targeted watering for beds and plantings where broad spray coverage is not the right fit.'],
      ['Seasonal Adjustments', 'Coverage and run-time needs change through the year, especially during hot Louisiana weather and wet periods.'],
    ],
    secondaryId: 'irrigation-service-area',
    secondaryHeading: 'Irrigation service in Prairieville, Gonzales and nearby communities.',
    secondaryText: 'Ascension Mow N’ Geaux serves properties across Ascension and Livingston Parishes. Irrigation work can also be coordinated with sod installation, landscaping and grading when a project needs more than a single repair.',
    related: [['Landscaping', 'landscaping.html'], ['Lawn Care', 'lawn-care.html'], ['Dirt Work', 'dirt-work-site-work.html']],
  },
  {
    file: 'dirt-work-site-work.html',
    slug: 'dirt-work-site-work',
    name: 'Dirt Work & Site Work',
    serviceType: 'Dirt work, grading, leveling, excavation and hauling',
    title: "Dirt Work & Grading in Gonzales & Prairieville, LA | Ascension Mow N' Geaux",
    description: 'Dirt work, grading, leveling, excavation, trenching, material delivery and debris haul-off in Gonzales, Prairieville and surrounding Ascension Parish areas.',
    eyebrow: 'Dirt Work & Site Work / Ascension Parish',
    h1: 'Dirt work that gets the ground ready for what comes next.',
    intro: 'Grading, leveling, excavation and material movement are often the part of a project that everything else depends on. The crew can shape the site, move material and haul debris so the next phase is not waiting on another contractor.',
    image: '../images/excavator-dirt-work.jpg',
    imageAlt: 'Excavator performing residential dirt work and site preparation',
    pills: ['Grading', 'Leveling', 'Excavation', 'Trenching', 'Material delivery', 'Debris haul-off'],
    details: [
      ['Grading & Leveling', 'Low areas, uneven ground and project surfaces can be reshaped for drainage, sod, access or future construction work.'],
      ['Excavation & Trenching', 'Small excavation and trenching work can support irrigation, drainage and other property improvements.'],
      ['Site Preparation', 'Clearing and ground preparation create a more workable starting point for sod, landscaping and outdoor projects.'],
      ['Dump Trailer Services', 'Material delivery, debris haul-off and job cleanup are quoted around the load, access and actual project scope.'],
    ],
    secondaryId: 'dump-trailer-services',
    secondaryHeading: 'Site work and hauling around Gonzales, Prairieville and Ascension Parish.',
    secondaryText: 'Dirt work is available throughout the core Ascension and Livingston Parish service area. Because the same crew also handles landscaping, sod and irrigation, the rough work and finish work can stay on a more coordinated timeline.',
    related: [['Landscaping', 'landscaping.html'], ['Irrigation', 'irrigation.html'], ['Lawn Care', 'lawn-care.html']],
  },
  {
    file: 'soft-washing-pressure-washing.html',
    slug: 'pressure-washing',
    name: 'Pressure Washing',
    serviceType: 'Pressure washing for driveways, patios, walkways and fences',
    title: "Pressure Washing in Prairieville & Gonzales, LA | Ascension Mow N' Geaux",
    description: 'Pressure washing for driveways, patios, walkways and fences in Prairieville, Gonzales and nearby communities, using pressure and technique matched to the surface.',
    eyebrow: 'Pressure Washing / Prairieville & Gonzales',
    h1: 'Pressure washing that cleans the surface without treating everything the same.',
    intro: 'Concrete, pavers, patios, walkways and fences do not all need the same approach. Cleaning pressure and technique are matched to the material so buildup is removed without using one aggressive setting everywhere.',
    image: '../images/pressure-washed-driveway.jpg',
    imageAlt: 'Freshly pressure washed residential concrete driveway',
    pills: ['Driveways', 'Patios', 'Walkways', 'Fences', 'Residential properties'],
    details: [
      ['Driveway Cleaning', 'Concrete driveways can collect organic buildup, dirt and traffic marks that make the whole front of a property look tired.'],
      ['Patios & Walkways', 'Outdoor living and walking surfaces are cleaned with attention to edges, joints and the material under the buildup.'],
      ['Fence Cleaning', 'Fence surfaces require a different approach than concrete, so pressure is adjusted to fit the material.'],
      ['Property-Wide Service', 'Exterior cleaning can be scheduled alongside lawn maintenance or landscape work when several areas need attention.'],
    ],
    secondaryId: 'pressure-washing-service-area',
    secondaryHeading: 'Pressure washing across Prairieville, Gonzales and nearby Louisiana communities.',
    secondaryText: 'Ascension Mow N’ Geaux serves properties throughout Ascension and Livingston Parishes. The pressure washing service is focused on the hard surfaces and fence areas listed above, with quotes based on the actual surface and job scope.',
    related: [['Lawn Care', 'lawn-care.html'], ['Landscaping', 'landscaping.html'], ['Dirt Work', 'dirt-work-site-work.html']],
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function absolute(path) {
  return path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;
}

function businessSchema() {
  return {
    '@type': ['LandscapingBusiness', 'LocalBusiness'],
    '@id': `${siteUrl}/#business`,
    name: businessName,
    url: `${siteUrl}/`,
    telephone: phone,
    email,
    foundingDate: '2015',
    description: 'Family-run lawn care, landscaping, irrigation, dirt work and property service company serving Ascension and Livingston Parishes in Louisiana.',
    image: [ogImage],
    logo: `${siteUrl}/images/logo.png`,
    areaServed: areas.map((name) => ({ '@type': name.includes('Parish') ? 'AdministrativeArea' : 'City', name })),
    serviceType: [
      'Lawn maintenance',
      'Landscaping',
      'Irrigation',
      'Sod installation',
      'Dirt work and grading',
      'Dump trailer services',
      'Pressure washing',
    ],
  };
}

function breadcrumbsFor(page, service) {
  const list = [{ name: 'Home', item: `${siteUrl}/` }];
  if (service) {
    list.push({ name: 'Services', item: `${siteUrl}/services.html` });
    list.push({ name: service.name, item: absolute(`/services/${service.file}`) });
  } else if (page.path !== '/') {
    list.push({ name: page.label, item: absolute(page.path) });
  }
  if (list.length === 1) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absolute(service ? `/services/${service.file}` : page.path)}#breadcrumbs`,
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function schemaFor(page, service) {
  const canonical = absolute(service ? `/services/${service.file}` : page.path);
  const graph = [
    businessSchema(),
    {
      '@type': page.type || 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#business` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: businessName,
      publisher: { '@id': `${siteUrl}/#business` },
      inLanguage: 'en-US',
    },
  ];
  const crumbs = breadcrumbsFor(page, service);
  if (crumbs) graph.push(crumbs);
  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: service.name,
      serviceType: service.serviceType,
      url: canonical,
      provider: { '@id': `${siteUrl}/#business` },
      areaServed: areas.map((name) => ({ '@type': name.includes('Parish') ? 'AdministrativeArea' : 'City', name })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

function injectSeo(html, page, service = null) {
  const canonicalPath = service ? `/services/${service.file}` : page.path;
  const canonical = absolute(canonicalPath);
  const robots = indexingEnabled
    ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    : 'noindex,nofollow,noarchive';

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  if (/<meta\s+name="description"/i.test(html)) {
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(page.description)}">`);
  } else {
    html = html.replace(/<\/title>/i, `</title>\n<meta name="description" content="${escapeHtml(page.description)}">`);
  }

  const block = [
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${canonical}">`,
    '<link rel="alternate" hreflang="en-US" href="' + canonical + '">',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${escapeHtml(businessName)}">`,
    `<meta property="og:title" content="${escapeHtml(page.title)}">`,
    `<meta property="og:description" content="${escapeHtml(page.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    `<script type="application/ld+json">${JSON.stringify(schemaFor(page, service))}</script>`,
  ].join('\n');

  html = html.replace(/<\/head>/i, `${block}\n</head>`);
  return html;
}

function serviceHeader() {
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="../index.html" aria-label="Ascension Mow N' Geaux home"><img src="../images/logo.png" alt="Ascension Mow N' Geaux"></a>
    <button class="nav-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
    <nav class="main-nav" id="site-navigation" aria-label="Primary navigation">
      <ul class="nav-list">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../our-story.html">Our Story</a></li>
        <li class="has-dropdown">
          <div class="services-control">
            <a href="../services.html" aria-current="page">Services</a>
            <button class="services-toggle" type="button" aria-expanded="false" aria-label="Show services"><span aria-hidden="true"></span></button>
          </div>
          <ul class="dropdown" aria-label="Services">
            <li><a href="lawn-care.html#lawn-maintenance">Lawn Maintenance</a></li>
            <li><a href="landscaping.html#landscape-cleanup">Landscape Cleanup</a></li>
            <li><a href="landscaping.html#design-build">Landscape Design &amp; Build</a></li>
            <li><a href="lawn-care.html#herbicide-application">Herbicide Application</a></li>
            <li><a href="dirt-work-site-work.html#dump-trailer-services">Dump Trailer Services</a></li>
            <li><a href="landscaping.html#sod-installation">Sod Installation</a></li>
            <li><a href="dirt-work-site-work.html">Dirt Work &amp; Site Work</a></li>
            <li><a href="soft-washing-pressure-washing.html">Pressure Washing</a></li>
            <li><a href="irrigation.html">Irrigation</a></li>
          </ul>
        </li>
        <li><a href="../gallery.html">Gallery</a></li>
      </ul>
      <a class="header-cta" href="../request-a-quote.html">Get a Quote</a>
    </nav>
  </div>
  <button class="nav-backdrop" type="button" aria-label="Close menu" hidden></button>
</header>`;
}

function serviceFooter() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div><div class="footer-logo"><span class="mark"><img src="../images/logo.png" alt=""></span>Ascension Mow N' Geaux</div><p>Family-run lawn care and landscaping, serving Ascension and Livingston Parishes since 2015.</p></div>
    <div><h4>Quick Links</h4><ul><li><a href="../index.html">Home</a></li><li><a href="../our-story.html">Our Story</a></li><li><a href="../gallery.html">Gallery</a></li><li><a href="../request-a-quote.html">Get a Quote</a></li></ul></div>
    <div><h4>Get in Touch</h4><ul><li><a href="mailto:${email}">${email}</a></li><li><a href="tel:12253331991">(225) 333-1991</a></li></ul></div>
    <div><h4>Service Area</h4><ul><li>Prairieville</li><li>Gonzales</li><li>Baton Rouge</li><li>Livingston</li></ul></div>
  </div>
  <div class="container footer-bottom"><span>&copy; 2026 Ascension Mow N' Geaux. All rights reserved.</span><span>Site by Sidequest Creative</span></div>
</footer>`;
}

function servicePage(service) {
  const detailCards = service.details.map(([heading, text], index) => {
    const id = index === 1 && service.slug === 'landscaping' ? 'design-build'
      : index === 2 && service.slug === 'landscaping' ? 'sod-installation'
      : index === 3 && service.slug === 'dirt-work-site-work' ? 'dump-trailer-services'
      : undefined;
    return `<article class="service-detail"${id ? ` id="${id}"` : ''}><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(text)}</p></article>`;
  }).join('\n');
  const pills = service.pills.map((pill) => `<span class="service-pill">${escapeHtml(pill)}</span>`).join('\n');
  const related = service.related.map(([label, href]) => `<a class="service-pill" href="${href}">${escapeHtml(label)}</a>`).join('\n');
  const page = {
    path: `/services/${service.file}`,
    type: 'WebPage',
    title: service.title,
    description: service.description,
    label: service.name,
  };
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(service.title)}</title>
<meta name="description" content="${escapeHtml(service.description)}">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="stylesheet" href="../css/styles.css">
<link rel="stylesheet" href="../css/site-fixes.css" data-amg-site-fixes>
<link rel="stylesheet" href="../css/services-page.css">
</head>
<body>
${serviceHeader()}
<main>
  <section class="services-hero">
    <div class="container">
      <div class="services-hero-copy">
        <div><p class="kicker">${escapeHtml(service.eyebrow)}</p><h1>${escapeHtml(service.h1)}</h1></div>
        <p>${escapeHtml(service.intro)}</p>
      </div>
      <figure class="services-hero-photo"><div class="services-hero-photo-frame"><img src="${service.image}" alt="${escapeHtml(service.imageAlt)}"></div><figcaption>Real project work from the Ascension Mow N' Geaux crew.</figcaption></figure>
    </div>
  </section>
  <section class="service-section service-section-light" id="${service.slug === 'pressure-washing' ? 'pressure-washing' : service.slug}">
    <div class="container service-section-grid">
      <div class="service-copy">
        <span class="service-section-number">Local Service</span>
        <p class="kicker">${escapeHtml(service.name)}</p>
        <h2>${escapeHtml(service.secondaryHeading)}</h2>
        <p>${escapeHtml(service.secondaryText)}</p>
        <div class="service-pill-row" aria-label="${escapeHtml(service.name)} service highlights">${pills}</div>
        <div class="service-detail-grid">${detailCards}</div>
      </div>
      <div class="service-visual"><figure class="service-photo"><img src="${service.image}" alt="${escapeHtml(service.imageAlt)}"><figcaption>${escapeHtml(service.name)} project work in the local service area.</figcaption></figure></div>
    </div>
  </section>
  <section class="service-section service-section-parchment" id="${service.secondaryId}">
    <div class="container service-section-grid reverse">
      <div class="service-copy">
        <p class="kicker">Related property services</p>
        <h2>One local crew when the job crosses categories.</h2>
        <p>Many outdoor projects overlap. Lawn work may expose drainage issues, landscape installation may need irrigation, and sod may need grading first. Ascension Mow N' Geaux can quote the work that fits the property instead of forcing every project into one service box.</p>
        <div class="service-pill-row" aria-label="Related services">${related}</div>
        <p class="service-note">Serving Prairieville, Gonzales, Baton Rouge, Livingston and surrounding areas in Ascension and Livingston Parishes.</p>
      </div>
      <div class="service-visual"><figure class="service-photo"><img src="../images/media/crew-truck-trailer.jpg" alt="Ascension Mow N' Geaux truck, trailer and equipment ready for a local property project"><figcaption>Local equipment and one crew for property work from routine maintenance to larger projects.</figcaption></figure></div>
    </div>
  </section>
  <section class="services-cta"><div class="container"><div><p class="kicker">Get a local quote</p><h2>Tell us what the property needs.</h2><p>Send the project details and the crew can follow up on scope, access and scheduling.</p></div><a class="btn btn-primary" href="../request-a-quote.html">Request a Free Quote</a></div></section>
</main>
${serviceFooter()}
<script src="../js/main.js"></script>
</body>
</html>`;
  return injectSeo(html, page, service);
}

async function copyDir(name) {
  const source = resolve(root, name);
  if (existsSync(source)) await cp(source, resolve(out, name), { recursive: true });
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const dir of ['css', 'js', 'images', 'media']) await copyDir(dir);

for (const [file, page] of Object.entries(pages)) {
  const source = resolve(root, file);
  let html = await readFile(source, 'utf8');
  if (file === 'index.html') {
    html = html.replace(
      '<section class="cta-band">',
      `<section class="section-white" aria-labelledby="local-service-area-heading">
    <div class="container">
      <div class="section-head">
        <p class="kicker">Local service area</p>
        <h2 id="local-service-area-heading">Lawn care and property services across Ascension and Livingston Parishes.</h2>
        <p>Ascension Mow N' Geaux serves Prairieville, Gonzales, Baton Rouge, Livingston and nearby communities with lawn maintenance, landscaping, irrigation, dirt work, hauling and pressure washing.</p>
      </div>
      <div class="service-pill-row" aria-label="Popular local services">
        <a class="service-pill" href="services/lawn-care.html">Lawn Care</a>
        <a class="service-pill" href="services/landscaping.html">Landscaping</a>
        <a class="service-pill" href="services/irrigation.html">Irrigation</a>
        <a class="service-pill" href="services/dirt-work-site-work.html">Dirt Work</a>
        <a class="service-pill" href="services/soft-washing-pressure-washing.html">Pressure Washing</a>
      </div>
    </div>
  </section>

  <section class="cta-band">`
    );
  }
  html = injectSeo(html, page);
  await writeFile(resolve(out, file), html);
}

await mkdir(resolve(out, 'services'), { recursive: true });
for (const service of services) {
  await writeFile(resolve(out, 'services', service.file), servicePage(service));
}

const mainJsPath = resolve(out, 'js/main.js');
let mainJs = await readFile(mainJsPath, 'utf8');
const serviceBlock = /  var serviceTargets = \{[\s\S]*?\n  function setServicesOpen\(isOpen\) \{/;
const replacement = `  var serviceTargets = {
    'Lawn Maintenance': 'services/lawn-care.html#lawn-maintenance',
    'Landscape Cleanup': 'services/landscaping.html#landscape-cleanup',
    'Landscape Design & Build': 'services/landscaping.html#design-build',
    'Herbicide Application': 'services/lawn-care.html#herbicide-application',
    'Dump Trailer Services': 'services/dirt-work-site-work.html#dump-trailer-services',
    'Sod Installation': 'services/landscaping.html#sod-installation',
    'Dirt Work & Site Work': 'services/dirt-work-site-work.html',
    'Pressure Washing': 'services/soft-washing-pressure-washing.html',
    'Irrigation': 'services/irrigation.html'
  };

  function serviceUrl(path) {
    return new URL(path, siteRoot).href;
  }

  document.querySelectorAll('.dropdown a').forEach(function (link) {
    var target = serviceTargets[link.textContent.trim()];
    if (target) link.href = serviceUrl(target);
  });

  var servicesRootLink = document.querySelector('.services-control > a');
  if (servicesRootLink) servicesRootLink.href = new URL('services.html', siteRoot).href;

  function setServicesOpen(isOpen) {`;
if (!serviceBlock.test(mainJs)) throw new Error('Could not locate service navigation block in js/main.js');
mainJs = mainJs.replace(serviceBlock, replacement);
await writeFile(mainJsPath, mainJs);

const sitemapUrls = [
  ...Object.values(pages).map((page) => ({ loc: absolute(page.path), priority: page.path === '/' ? '1.0' : '0.7' })),
  ...services.map((service) => ({ loc: absolute(`/services/${service.file}`), priority: '0.8' })),
];
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(({ loc, priority }) => `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`).join('\n')}\n</urlset>\n`;
await writeFile(resolve(out, 'sitemap.xml'), sitemap);

const robots = indexingEnabled
  ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n';
await writeFile(resolve(out, 'robots.txt'), robots);

const buildInfo = {
  siteUrl,
  indexingEnabled,
  generatedAt: new Date().toISOString(),
  pages: sitemapUrls.map(({ loc }) => loc),
};
await writeFile(resolve(out, 'seo-build.json'), JSON.stringify(buildInfo, null, 2));

console.log(`SEO build complete: ${sitemapUrls.length} indexable page definitions`);
console.log(`SITE_URL=${siteUrl}`);
console.log(`SEO_INDEX=${indexingEnabled}`);
