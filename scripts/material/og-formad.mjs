// Gör delningsbilden för Formad-caset: public/formad/og.jpg (1200×630).
// Körs om när marklyft-rutan eller rubriken ändras: node scripts/material/og-formad.mjs (skriver över).
//
// Vänster: rubriken i Georgia (DM Serif Display finns inte lokalt) och infrakust.se under.
// Höger: herkules-still.webp (3D-visarens stillbild), skalad till hela höjden. Stillbildens
// bakgrund (#0B0D0F) är i praktiken ytans färg, så statyn står fritt utan någon ruta runt.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAPP = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'formad');
const KALLA = path.join(MAPP, 'herkules-still.webp');
const UT = path.join(MAPP, 'og.jpg');

const BREDD = 1200;
const HOJD = 630;
const BAKGRUND = '0x0C0D0E';
const VIT = '0xF5F0EB';
const GULD = '0xC9A96E';
// ffmpeg:s drawtext vill ha kolonet i Windows-sökvägen skyddat.
const TYPSNITT = "fontfile='C\\:/Windows/Fonts/georgia.ttf'";

// Stillbilden (1120×1494) skalas till 630 px hög, alltså 472 px bred, och ställs så här
// långt från högerkanten.
const STATY_B = Math.round((1120 * 630) / 1494 / 2) * 2;
const HOGER = 10;

const VANSTER = 72;
const RUBRIK = ['Formad:', 'från idé till app', 'i Google Play'];
const RUBRIK_STORLEK = 60;
const RAD = 76;
const RUBRIK_Y = 170;

// Kolon i texten skyddas för drawtext.
const skydda = (s) => s.replace(/:/g, '\\:');

const text = (s, { x, y, storlek, farg }) =>
  `drawtext=${TYPSNITT}:text='${skydda(s)}':x=${x}:y=${y}:fontsize=${storlek}:fontcolor=${farg}`;

const rader = RUBRIK.map((s, i) =>
  text(s, { x: VANSTER, y: RUBRIK_Y + i * RAD, storlek: RUBRIK_STORLEK, farg: VIT }),
);
const adress = text('infrakust.se', {
  x: VANSTER,
  y: RUBRIK_Y + RUBRIK.length * RAD + 40,
  storlek: 28,
  farg: GULD,
});

const graf = [
  `color=c=${BAKGRUND}:s=${BREDD}x${HOJD}:d=1[yta]`,
  `[0:v]scale=${STATY_B}:${HOJD}[bild]`,
  `[yta][bild]overlay=${BREDD - STATY_B - HOGER}:0,${[...rader, adress].join(',')}`,
].join(';');

execFileSync(
  'ffmpeg',
  ['-y', '-v', 'error', '-i', KALLA, '-filter_complex', graf, '-frames:v', '1', '-q:v', '3', UT],
  { stdio: 'inherit' },
);
console.log(`✓ ${path.relative(process.cwd(), UT)}`);
