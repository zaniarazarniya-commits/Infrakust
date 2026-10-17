// Kopierar och konverterar Formad-caset:s material till public/formad/.
// Körs om efter att källorna ändrats: node scripts/material/formad.mjs (skriver över).
//
// tel-pass.webp, tel-ovning.webp och tel-mentor.webp är tagna för hand (lokal app med seedad data) och tas om för hand; tel-mat.webp har eget skript tel-mat.cjs, 3D-stillbilden capture-still.cjs. Klockbilderna klocka-01..08 är emulatorbilder ur Formads Play-mapp (Downloads/formad-1.8-klocka), skiftrutin/design/klocka/emulator och urtavlans Play-mapp.
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
const FORMAD_WORK = 'C:/Users/zania/dev/formad-work';
const REKLAM = 'C:/Users/zania/dev/reklam-work';
const MARMOR = 'C:/Users/zania/dev/scratch-marmor';
const KLOCKA = 'C:/Users/zania/Downloads/formad-1.8-klocka/skarmbilder-klocka';
const URTAVLA = 'C:/Users/zania/Downloads/formad-urtavla-1.0';

const UT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'formad');

const skarm = (fil) => path.join(SKIFTRUTIN, 'design', 'play', 'skarmbilder', fil);
const statyn = (fil) => path.join(SKIFTRUTIN, 'public', 'statyn', fil);
const klippkalla = (fil) => path.join(SKIFTRUTIN, 'public', 'klipp', fil);
const forhandsbild = (fil) => path.join(ANIM, 'production', 'base2', 'previews', fil);
const riggbild = (fil) => path.join(ANIM, 'production', 'previews', fil);
const aret = (ruta) => path.join(REKLAM, 'staty', 'aret', ruta + '.png');

// Sekunder in i marklyft-klippet där stången är nere i bottenläget och muskelkartan lyser röd/orange.
const MARKLYFT_RUTA = 1.4;

const TABELL = [
  // Telefonbilder (appens skärmbilder för Play)
  { from: skarm('2-traning.png'), to: 'tel-traning.webp', width: 1080 },
  { from: skarm('1-idag.png'), to: 'tel-idag.webp', width: 1080 },
  { from: skarm('3-vecka.png'), to: 'tel-vecka.webp', width: 1080 },
  // tel-mat.webp görs inte här: Play-bildens mål bröts över makrona, så den tas ur
  // appen med mat loggad av scripts/material/tel-mat.cjs (se huvudet där).

  // Resan
  { from: statyn('steg-01.webp'), to: 'resa-01-block.webp' },
  { from: statyn('steg-10.webp'), to: 'resa-02-huggen.webp' },
  { from: path.join(STATYN, 'look', 'snett.png'), to: 'resa-03-gra.webp', width: 1200 },
  { from: forhandsbild('jamfor_v3_fram.png'), to: 'resa-04-tre-kroppar.webp', width: 1600 },
  { from: forhandsbild('muskelatlas.png'), to: 'resa-05-muskelatlas.webp', width: 2000 }, // legenden behålls
  { from: klippkalla('marklyft-muskler.mp4'), to: 'resa-06-marklyft.webp', frame: MARKLYFT_RUTA },

  // Övrigt
  // sisyfos-bred.webp och sisyfos-smal.webp görs inte här: panelerna klipps ur
  // appens veckobild och läggs om av scripts/material/sisyfos.mjs.
  { from: path.join(ANIM, 'production', 'previews', 'plot_joints2.png'), to: 'punktmoln.webp', width: 1800 },
  // herkules-still.webp görs inte här: den tas ur 3D-visaren med
  // scripts/material/capture-still.cjs (se huvudet där), så att övertoningen
  // till modellen visar samma föremål.

  // Klockan: alla sidor i Wear OS-appen (454×454 ur emulatorn), rutan och urtavlan.
  { from: path.join(KLOCKA, '1-idag.png'), to: 'klocka-01.webp' },
  { from: path.join(SKIFTRUTIN, 'design', 'klocka', 'emulator', 'idag', '2-scroll.png'), to: 'klocka-02.webp' },
  { from: path.join(KLOCKA, '2-traning.png'), to: 'klocka-03.webp' },
  { from: path.join(KLOCKA, '3-set.png'), to: 'klocka-04.webp' },
  { from: path.join(KLOCKA, '4-vila.png'), to: 'klocka-05.webp' },
  { from: path.join(KLOCKA, '5-mat.png'), to: 'klocka-06.webp' },
  { from: path.join(KLOCKA, '6-ruta.png'), to: 'klocka-07.webp' },
  { from: path.join(URTAVLA, 'skarmbild-urtavla.png'), to: 'klocka-08.webp' },

  // Formen: 3D-modellerna genom bygget, från statyn ur AI-verktyget till den förgyllda i appen.
  // Källorna är arbetsmapparnas egna renderingar (statyn-work, Animation, scratch-marmor,
  // formad-work och reklam-work/staty/aret, som är årets staty i marmorhallen, 228 rutor).
  { from: path.join(STATYN, 'look', 'fram.png'), to: 'modell-01.webp', width: 1200 },
  { from: path.join(STATYN, 'marmor', 'fram.png'), to: 'modell-02.webp', width: 1200 },
  { from: riggbild('rig_final_v7_vilopose_threequarter.png'), to: 'modell-03.webp', width: 1200 },
  { from: forhandsbild('jamfor_v3_fram_bas.png'), to: 'modell-04.webp', width: 1200 },
  { from: forhandsbild('jamfor_v3_fram_over.png'), to: 'modell-05.webp', width: 1200 },
  { from: path.join(MARMOR, 'final.png'), to: 'modell-06.webp', width: 1200 },
  { from: path.join(FORMAD_WORK, 'trofe-forslag', 'snett.png'), to: 'modell-07.webp', width: 1200 },
  { from: aret('00010'), to: 'modell-08.webp', width: 900 },
  { from: aret('00090'), to: 'modell-09.webp', width: 900 },
  { from: aret('00170'), to: 'modell-10.webp', width: 900 },
  { from: aret('00228'), to: 'modell-11.webp', width: 900 },
  { from: path.join(FORMAD_WORK, 'tallrik-webb', 'tallrik.png'), to: 'modell-12.webp', width: 1200 },

  // Klipp med muskelkarta, film och affisch
  ...['marklyft', 'knaboj', 'banpress', 'militarpress', 'skivstangsrodd', 'bicepscurl-hantel'].flatMap((namn) => [
    { from: klippkalla(`${namn}-muskler.mp4`), to: `klipp/${namn}-muskler.mp4` },
    // Affischen tas ur filmens första ruta i filmens egen storlek (720x900)
    { from: klippkalla(`${namn}-muskler.mp4`), to: `klipp/${namn}-muskler.webp`, frame: 0 },
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
