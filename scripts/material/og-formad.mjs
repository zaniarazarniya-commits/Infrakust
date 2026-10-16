// Gör delningsbilden för Formad-caset: public/formad/og.jpg (1200×630).
// Körs om när marklyft-rutan eller rubriken ändras: node scripts/material/og-formad.mjs (skriver över).
//
// Vänster: rubriken i Georgia (DM Serif Display finns inte lokalt) och infrakust.se under.
// Höger: resa-06-marklyft.webp, beskuren kring lyftaren så att han fyller panelen.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAPP = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'formad');
const KALLA = path.join(MAPP, 'resa-06-marklyft.webp');
const UT = path.join(MAPP, 'og.jpg');

const BREDD = 1200;
const HOJD = 630;
const BAKGRUND = '0x0C0D0E';
const VIT = '0xF5F0EB';
const GULD = '0xC9A96E';
// ffmpeg:s drawtext vill ha kolonet i Windows-sökvägen skyddat.
const TYPSNITT = "fontfile='C\\:/Windows/Fonts/georgia.ttf'";

// Panelen till höger och beskärningen ur källan (720×900). Beskärningen har panelens
// proportioner och tar bort det mesta av den tomma grå väggen ovanför lyftaren.
const PANEL_B = 540;
const BESKAR = { w: 510, h: 595, x: 65, y: 255 };

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
  `[0:v]crop=${BESKAR.w}:${BESKAR.h}:${BESKAR.x}:${BESKAR.y},scale=${PANEL_B}:${HOJD}[bild]`,
  `[yta][bild]overlay=${BREDD - PANEL_B}:0,${[...rader, adress].join(',')}`,
].join(';');

execFileSync(
  'ffmpeg',
  ['-y', '-v', 'error', '-i', KALLA, '-filter_complex', graf, '-frames:v', '1', '-q:v', '3', UT],
  { stdio: 'inherit' },
);
console.log(`✓ ${path.relative(process.cwd(), UT)}`);
