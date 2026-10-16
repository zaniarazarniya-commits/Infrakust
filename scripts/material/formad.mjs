// Kopierar och konverterar Formad-caset:s material till public/formad/.
// Körs om efter att källorna ändrats: node scripts/material/formad.mjs (skriver över).
//
// Källor (allt ligger utanför detta repo, på den här datorn):
//   SKIFTRUTIN  appens repo, ska stå på main och vara uppdaterat (git pull) före körning
//   ANIM        Animation-projektet, riggen och förhandsbilderna
//   STATYN      statyn-work, renderingen av statyn
//
// Rad i tabellen: { from, to, width?, frame? }
//   width  skalar ner till högst så här många pixlar bred (uppskalas aldrig)
//   frame  tar en enda ruta vid så här många sekunder ur en video
//   ingen av dem: filen kopieras som den är

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKIFTRUTIN = 'C:/Users/zania/dev/skiftrutin';
const ANIM = 'C:/Users/zania/dev/Animation';
const STATYN = 'C:/Users/zania/dev/statyn-work';

const UT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'formad');

const skarm = (fil) => path.join(SKIFTRUTIN, 'design', 'play', 'skarmbilder', fil);
const statyn = (fil) => path.join(SKIFTRUTIN, 'public', 'statyn', fil);
const intro = (fil) => path.join(SKIFTRUTIN, 'public', 'intro', fil);
const klippkalla = (fil) => path.join(SKIFTRUTIN, 'public', 'klipp', fil);
const forhandsbild = (fil) => path.join(ANIM, 'production', 'base2', 'previews', fil);

// Sekunder in i marklyft-klippet där stången är nere i bottenläget och muskelkartan lyser röd/orange.
const MARKLYFT_RUTA = 1.4;

const TABELL = [
  // Telefonbilder (appens skärmbilder för Play)
  { from: skarm('2-traning.png'), to: 'tel-traning.webp', width: 1080 },
  { from: skarm('1-idag.png'), to: 'tel-idag.webp', width: 1080 },
  { from: skarm('3-vecka.png'), to: 'tel-vecka.webp', width: 1080 },
  { from: skarm('4-mat.png'), to: 'tel-mat.webp', width: 1080 },

  // Resan
  { from: statyn('steg-01.webp'), to: 'resa-01-block.webp' },
  { from: statyn('steg-10.webp'), to: 'resa-02-huggen.webp' },
  { from: path.join(STATYN, 'look', 'snett.png'), to: 'resa-03-gra.webp', width: 1200 },
  { from: forhandsbild('jamfor_v3_fram.png'), to: 'resa-04-tre-kroppar.webp', width: 1600 },
  { from: forhandsbild('muskelatlas.png'), to: 'resa-05-muskelatlas.webp', width: 2000 }, // legenden behålls
  { from: klippkalla('marklyft-muskler.mp4'), to: 'resa-06-marklyft.webp', frame: MARKLYFT_RUTA },

  // Övrigt
  { from: path.join(SKIFTRUTIN, 'design', 'backe', 'vecka-herkules-appen.png'), to: 'sisyfos.webp', width: 1600 },
  { from: path.join(ANIM, 'production', 'previews', 'plot_joints2.png'), to: 'punktmoln.webp', width: 1800 },
  { from: path.join(STATYN, 'look', 'snett.png'), to: 'herkules-still.webp', width: 900 },

  // Intro, åtta första uppslagen
  ...Array.from({ length: 8 }, (_, i) => {
    const nr = String(i + 1).padStart(2, '0');
    return { from: intro(`${nr}.webp`), to: `intro-${nr}.webp` };
  }),

  // Klipp med muskelkarta, film och affisch
  ...['marklyft', 'knaboj', 'banpress', 'militarpress', 'skivstangsrodd', 'bicepscurl-hantel'].flatMap((namn) => [
    { from: klippkalla(`${namn}-muskler.mp4`), to: `klipp/${namn}-muskler.mp4` },
    { from: klippkalla(`${namn}-muskler.webp`), to: `klipp/${namn}-muskler.webp` },
  ]),
];

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
}

function skapa({ from, to, width, frame }) {
  if (!fs.existsSync(from)) throw new Error(`Källan saknas: ${from}`);
  const mal = path.join(UT, to);
  fs.mkdirSync(path.dirname(mal), { recursive: true });

  if (frame === undefined && width === undefined) {
    fs.copyFileSync(from, mal);
    return;
  }

  const args = [];
  if (frame !== undefined) args.push('-ss', String(frame));
  args.push('-i', from);
  // Aldrig uppskalning: en källa smalare än width behåller sin egen bredd.
  if (width !== undefined) args.push('-vf', `scale='min(iw,${width})':-2`);
  if (frame !== undefined) args.push('-frames:v', '1');
  args.push('-c:v', 'libwebp', '-quality', '82', mal);
  ffmpeg(args);
}

for (const rad of TABELL) {
  skapa(rad);
  const kb = (fs.statSync(path.join(UT, rad.to)).size / 1024).toFixed(1);
  console.log(`${rad.to}  ${kb} kB`);
}
