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
  ...['traning', 'idag', 'vecka', 'mat'].map((n) => [`tel-${n}.webp`, WEBP_MAX]),
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
