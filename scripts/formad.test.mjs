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
  ['3d/herkules.glb', 3_000_000],
  ...Array.from({ length: 8 }, (_, i) => [`form-${String(i + 1).padStart(2, '0')}.webp`, WEBP_MAX]),
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
  assert.ok(html.includes('Passet är'), 'rubriken Dagen runt passet saknas');
  assert.ok(html.includes('src="/formad/sisyfos.webp"'), 'Sisyfos-bilden saknas');
  assert.ok(html.includes('Vi hade kunnat köpa en 3D-modell'), 'rubriken Kropparna saknas');
  assert.ok(html.includes('24 % för lång'), 'feltabellen saknas');
  assert.ok(html.includes('src="/formad/punktmoln.webp"'), 'punktmolnet saknas');
  assert.ok(html.includes('176 601 trianglar'), 'siffrorna saknas');
  assert.ok(html.includes('Vi såg'), 'feltabellens rubriker saknas');
  assert.equal(html.match(/src="\/formad\/resa-/g)?.length, 6, 'remsan ska ha sex bilder');
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf-8');
  assert.ok(sitemap.includes('<loc>https://www.infrakust.se/case/formad</loc>'), 'sitemap saknar sidan');
});

test('statyn i 3D: stillbilden prerenderas och startsidan bär inte three', () => {
  const HERE = path.dirname(fileURLToPath(import.meta.url));
  const DIST = path.join(HERE, '..', 'dist');

  const casesida = fs.readFileSync(path.join(DIST, 'case', 'formad', 'index.html'), 'utf-8');
  assert.ok(casesida.includes('src="/formad/herkules-still.webp"'), 'stillbilden av statyn saknas');
  assert.ok(casesida.includes('DRA RUNT HONOM'), 'rubriken Dra runt honom saknas');

  const start = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
  const skript = [
    ...[...start.matchAll(/<script[^>]*\ssrc="([^"]+\.js)"/g)].map((m) => m[1]),
    ...[...start.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+\.js)"/g)].map((m) => m[1]),
  ];
  assert.ok(skript.length > 0, 'startsidan refererar inga skript');
  for (const src of skript) {
    const kod = fs.readFileSync(path.join(DIST, src.replace(/^\//, '')), 'utf-8');
    assert.ok(!kod.includes('THREE.WebGLRenderer'), `${src} innehåller three`);
  }
});

test('övningarna: rubriken och sex klipp som rör sig prerenderas', () => {
  const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const html = fs.readFileSync(path.join(DIST, 'case', 'formad', 'index.html'), 'utf-8');
  assert.ok(html.includes('Varje övning är ett klipp'), 'rubriken Övningarna saknas');
  const videor = html.match(/<video[^>]*>/g) ?? [];
  assert.equal(videor.length, 6, 'rutnätet ska ha sex <video>');
  assert.ok(videor.every((v) => !/autoplay/i.test(v)), 'ingen <video> ska ha autoplay (reduced motion)');
  for (const n of klipp) {
    assert.ok(
      videor.some((v) => v.includes(`/formad/klipp/${n}-muskler.mp4`) && v.includes(`/formad/klipp/${n}-muskler.webp`)),
      `${n}: video med källa och poster saknas`,
    );
  }
  assert.ok(html.includes('src="/formad/tel-pass.webp"'), 'passvyn saknas');
  assert.ok(html.includes('src="/formad/tel-ovning.webp"'), 'övningsvyn saknas');
});

test('mentorn, klockan och formen prerenderas, utan förbjudna ord', () => {
  const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const html = fs.readFileSync(path.join(DIST, 'case', 'formad', 'index.html'), 'utf-8');
  assert.ok(html.includes('AI-agenter som spelade användare'), 'mentorns träning saknas');
  assert.ok(html.includes('Anthropics modell'), 'modellen bakom mentorn saknas');
  assert.ok(html.includes('Health Connect'), 'Health Connect saknas');
  assert.ok(html.includes('src="/formad/klocka.webp"'), 'klockbilden saknas');
  assert.ok(html.includes('src="/formad/form-08.webp"'), 'formens remsa saknas');
  assert.ok(!/hevy/i.test(html), 'sidan nämner Hevy');
  assert.ok(!/intervju/i.test(html), 'sidan säger intervju');
});
