import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'formad');

const KB = 1024;
const WEBP_MAX = 400 * KB;
const WEBP_MAX_STOR = 700 * KB;
const MP4_MAX = 120 * KB;

const klipp = ['marklyft', 'knaboj', 'banpress', 'militarpress', 'skivstangsrodd', 'bicepscurl-hantel'];

// Alla filer under public/formad/ och deras storleksgräns i byte. Senare uppgifter lägger till rader här.
export const FILER = [
  ...['traning', 'idag', 'vecka', 'mat', 'pass', 'ovning', 'mentor'].map((n) => [`tel-${n}.webp`, WEBP_MAX]),
  ['klocka.webp', WEBP_MAX],
  ['resa-01-block.webp', WEBP_MAX],
  ['resa-02-huggen.webp', WEBP_MAX],
  ['resa-03-gra.webp', WEBP_MAX],
  ['resa-04-tre-kroppar.webp', WEBP_MAX_STOR],
  ['resa-05-muskelatlas.webp', WEBP_MAX_STOR],
  ['resa-06-marklyft.webp', WEBP_MAX],
  ['sisyfos.webp', WEBP_MAX],
  ['punktmoln.webp', WEBP_MAX_STOR],
  ['herkules-still.webp', WEBP_MAX],
  ...Array.from({ length: 8 }, (_, i) => [`intro-${String(i + 1).padStart(2, '0')}.webp`, WEBP_MAX]),
  ...klipp.flatMap((n) => [
    [`klipp/${n}-muskler.mp4`, MP4_MAX],
    [`klipp/${n}-muskler.webp`, WEBP_MAX],
  ]),
];

test('material finns och är inom storleksgränserna', () => {
  for (const [namn, max] of FILER) {
    const fil = path.join(ROOT, namn);
    assert.ok(fs.existsSync(fil), `${namn} saknas`);
    const storlek = fs.statSync(fil).size;
    assert.ok(storlek > 0, `${namn} är tom`);
    assert.ok(storlek < max, `${namn} är ${storlek} byte, gränsen är ${max}`);
  }
});

test('prerenderade sidor har rätt og:image', () => {
  const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const meta = (html, kind, key) =>
    html.match(new RegExp(`<meta ${kind}="${key}" content="([^"]*)"`))?.[1];
  // Rad per sida: [fil, förväntad og:image].
  const SIDOR = [
    ['index.html', 'https://www.infrakust.se/og-image.png'],
    ['case/grand-hotel/index.html', 'https://www.infrakust.se/og-image.png'],
    ['case/formad/index.html', 'https://www.infrakust.se/formad/og.jpg'],
  ];
  for (const [fil, bild] of SIDOR) {
    const html = fs.readFileSync(path.join(DIST, fil), 'utf-8');
    assert.equal(meta(html, 'property', 'og:image'), bild, `${fil}: og:image`);
    assert.equal(meta(html, 'name', 'twitter:image'), bild, `${fil}: twitter:image`);
  }
});

test('casesidan prerenderas', () => {
  const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const fil = path.join(DIST, 'case', 'formad', 'index.html');
  assert.ok(fs.existsSync(fil), 'dist/case/formad/index.html saknas');
  const html = fs.readFileSync(fil, 'utf-8');
  const titel = 'Formad: från idé till app i Google Play — Infrakust';
  assert.equal(html.match(/<title>([^<]*)<\/title>/)?.[1], titel);
  assert.equal(
    html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
    'https://www.infrakust.se/case/formad',
  );
  assert.equal(
    html.match(/<meta property="og:image" content="([^"]*)"/)?.[1],
    'https://www.infrakust.se/formad/og.jpg',
  );
  assert.equal(html.match(/<meta property="og:image:alt" content="([^"]*)"/)?.[1], titel);
  assert.ok(html.includes('En app som vet'), 'rubriken saknas');
  assert.ok(html.includes('Sluten beta i Google Play'), 'statusen saknas');
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf-8');
  assert.ok(sitemap.includes('<loc>https://www.infrakust.se/case/formad</loc>'), 'sitemap saknar sidan');
});
