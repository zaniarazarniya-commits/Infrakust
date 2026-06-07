import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

// Signalera till vite.config att inspektions-pluginet ska vara av vid prerendering.
process.env.PRERENDER = '1';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

// Routes som ska prerenderas. '/404' renderas till dist/404.html (Vercel serverar
// den automatiskt med 404-status för okända adresser).
const routes = [
  '/',
  '/om-oss',
  '/tjanster/webbutveckling',
  '/tjanster/apputveckling',
  '/case/grand-hotel',
  '/404',
];

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escJson = (s) => s.replace(/</g, '\\u003c');

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(title)}</title>`);
}

function setMeta(html, kind, key, content) {
  const re = new RegExp(`(<meta ${kind}="${key}" content=")[\\s\\S]*?(")`);
  if (re.test(html)) {
    return html.replace(re, `$1${escAttr(content)}$2`);
  }
  // Saknas i mallen → injicera före </head>.
  return html.replace(
    /<\/head>/,
    `  <meta ${kind}="${key}" content="${escAttr(content)}" />\n  </head>`,
  );
}

function setCanonical(html, href) {
  const re = /(<link rel="canonical" href=")[\s\S]*?(")/;
  if (re.test(html)) return html.replace(re, `$1${escAttr(href)}$2`);
  return html.replace(/<\/head>/, `  <link rel="canonical" href="${escAttr(href)}" />\n  </head>`);
}

function injectPageJsonLd(html, jsonLd) {
  if (!jsonLd) return html;
  const script = `  <script type="application/ld+json" id="ld-json-page">${escJson(
    JSON.stringify(jsonLd),
  )}</script>\n  </head>`;
  return html.replace(/<\/head>/, script);
}

function applyHead(html, head, { noindex } = {}) {
  if (head) {
    html = setTitle(html, head.title);
    html = setMeta(html, 'name', 'description', head.description);
    html = setMeta(html, 'property', 'og:title', head.title);
    html = setMeta(html, 'property', 'og:description', head.description);
    html = setMeta(html, 'property', 'og:url', head.canonical);
    html = setMeta(html, 'name', 'twitter:title', head.title);
    html = setMeta(html, 'name', 'twitter:description', head.description);
    html = setCanonical(html, head.canonical);
    html = injectPageJsonLd(html, head.jsonLd);
  }
  if (noindex) {
    html = html.replace(
      /<\/head>/,
      `  <meta name="robots" content="noindex" />\n  </head>`,
    );
  }
  return html;
}

function outPathFor(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  if (route === '/404') return path.join(distDir, '404.html');
  return path.join(distDir, route.replace(/^\//, ''), 'index.html');
}

async function run() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('Kunde inte hitta <div id="root"></div> i dist/index.html');
  }

  const vite = await createServer({
    root,
    logLevel: 'warn',
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

    for (const route of routes) {
      const url = route === '/404' ? '/__notfound__' : route;
      const { html, head } = render(url);
      let out = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
      out = applyHead(out, head, { noindex: route === '/404' });

      const filePath = outPathFor(route);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, out, 'utf-8');
      console.log(`✓ prerendered ${route} → ${path.relative(root, filePath)}`);
    }
  } finally {
    await vite.close();
  }
}

run().catch((err) => {
  console.error('Prerender misslyckades:', err);
  process.exit(1);
});
