/**
 * scripts/prerender.mjs
 *
 * Post-build SEO step for this client-rendered Vite SPA. Without it every route
 * ships dist/index.html verbatim — so every URL declares the homepage <title>
 * and the homepage <link rel="canonical">. Google reads the raw HTML, sees the
 * same canonical on every page, and consolidates all subpages into the homepage,
 * so they never get indexed.
 *
 * This script:
 *   1. Copies the built index.html into one static file per route and rewrites
 *      the head tags (title, description, canonical, og:*, twitter:*) so each URL
 *      is self-canonical in the raw HTML.
 *   2. Injects per-page JSON-LD (Service / CreativeWork / BreadcrumbList) into the
 *      raw HTML so crawlers and AI engines understand each page.
 *   3. Emits a real 404.html (noindex) and a fresh sitemap.xml with today's date.
 *
 * The React app still renders the body client-side exactly as before.
 *
 * Keep `routes` in sync with each page's <SEO /> props.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');
const ORIGIN = 'https://www.infrakust.se';
const TODAY = new Date().toISOString().slice(0, 10);

const breadcrumb = (name, path) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Hem', item: `${ORIGIN}/` },
    { '@type': 'ListItem', position: 2, name, item: `${ORIGIN}${path}` },
  ],
});

const service = (name, description, path) => ({
  '@type': 'Service',
  name,
  description,
  serviceType: name,
  provider: { '@type': 'Organization', name: 'Infrakust', url: ORIGIN },
  areaServed: { '@type': 'Country', name: 'Sverige' },
  url: `${ORIGIN}${path}`,
});

/** Single source of truth — keep in sync with each page's <SEO /> props. */
const routes = [
  {
    path: '/om-oss',
    file: 'om-oss/index.html',
    priority: '0.7',
    title: 'Om oss — Infrakust',
    description:
      'Infrakust drivs av en person med lång erfarenhet av både IT och hotellbranschen. Vi förstår verksamheten bakom varje beställning — inte bara koden.',
    jsonLd: { '@context': 'https://schema.org', '@graph': [breadcrumb('Om oss', '/om-oss')] },
  },
  {
    path: '/tjanster/webbutveckling',
    file: 'tjanster/webbutveckling/index.html',
    priority: '0.8',
    title: 'Webbutveckling — Infrakust',
    description:
      'Vi bygger skräddarsydda hemsidor i Next.js och React som konverterar besökare till kunder. SEO-optimerade, snabba och långsiktiga.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        service(
          'Webbutveckling',
          'Skräddarsydda hemsidor i Next.js och React som konverterar besökare till kunder. SEO-optimerade, snabba och långsiktiga.',
          '/tjanster/webbutveckling'
        ),
        breadcrumb('Webbutveckling', '/tjanster/webbutveckling'),
      ],
    },
  },
  {
    path: '/tjanster/apputveckling',
    file: 'tjanster/apputveckling/index.html',
    priority: '0.8',
    title: 'App-utveckling — Infrakust',
    description:
      'Vi bygger skräddarsydda appar för hospitality och servicebranschen — realtidssystem, gästportaler och interna verktyg som faktiskt används.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        service(
          'App-utveckling',
          'Skräddarsydda appar för hospitality och servicebranschen — realtidssystem, gästportaler och interna verktyg som faktiskt används.',
          '/tjanster/apputveckling'
        ),
        breadcrumb('App-utveckling', '/tjanster/apputveckling'),
      ],
    },
  },
  {
    path: '/case/grand-hotel',
    file: 'case/grand-hotel/index.html',
    priority: '0.8',
    title: 'Gästportal och housekeeping-app för hotell — Infrakust',
    description:
      'Hur Infrakust byggde två appar som ett ekosystem för Grand Hotel Lysekil: en gästportal och ett realtids-housekeeping-system.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CreativeWork',
          name: 'Gästportal och housekeeping-app för Grand Hotel Lysekil',
          about: 'Webbappar för hospitality',
          description:
            'Hur Infrakust byggde två appar som ett ekosystem för Grand Hotel Lysekil: en gästportal och ett realtids-housekeeping-system.',
          creator: { '@type': 'Organization', name: 'Infrakust', url: ORIGIN },
          url: `${ORIGIN}/case/grand-hotel`,
        },
        breadcrumb('Grand Hotel', '/case/grand-hotel'),
      ],
    },
  },
];

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Replace the content="" value of a <meta> tag identified by `idAttr`. */
function setMetaContent(html, idAttr, value) {
  const re = new RegExp(`(<meta [^>]*${idAttr}[^>]*content=")[^"]*(")`, 'i');
  if (!re.test(html)) {
    console.warn(`  ⚠ meta ${idAttr} not found — skipped`);
    return html;
  }
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

function buildHtml(template, { title, description, canonical, noindex, jsonLd }) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`);
  html = setMetaContent(html, 'name="description"', description);
  html = setMetaContent(html, 'property="og:title"', title);
  html = setMetaContent(html, 'property="og:description"', description);
  html = setMetaContent(html, 'name="twitter:title"', title);
  html = setMetaContent(html, 'name="twitter:description"', description);

  if (noindex) {
    html = html.replace(/\s*<link rel="canonical"[^>]*>/i, '');
    html = html.replace(
      /(<meta name="viewport"[^>]*>)/i,
      `$1\n    <meta name="robots" content="noindex" />`
    );
  } else {
    html = setMetaContent(html, 'property="og:url"', canonical);
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${escapeAttr(canonical)}$2`);
  }

  if (jsonLd) {
    // Separate id from the one SEO.tsx manages so client render never strips it.
    const tag = `    <script type="application/ld+json" id="ld-json-prerender">${JSON.stringify(
      jsonLd
    )}</script>\n  </head>`;
    html = html.replace(/\s*<\/head>/i, `\n${tag}`);
  }
  return html;
}

function emit(relPath, html) {
  const out = join(DIST, relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, 'utf8');
  console.log(`  ✓ ${relPath}`);
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

console.log('Prerendering route heads + schema:');
for (const route of routes) {
  emit(route.file, buildHtml(template, { ...route, canonical: `${ORIGIN}${route.path}` }));
}

emit(
  '404.html',
  buildHtml(template, { title: '404 — Infrakust', description: 'Sidan hittades inte.', noindex: true })
);

// Fresh sitemap with today's date (home + every route).
const urls = [{ path: '/', priority: '1.0' }, ...routes];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${ORIGIN}${u.path}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;
emit('sitemap.xml', sitemap);

console.log('Prerender done.');
