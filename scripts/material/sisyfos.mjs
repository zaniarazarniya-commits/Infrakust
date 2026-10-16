// Gör Sisyfos-figuren i Dagen runt passet ur appens veckobild:
//   public/formad/sisyfos-bred.webp  3 × 2 paneler, för 768 px och bredare
//   public/formad/sisyfos-smal.webp  2 × 3 paneler, för telefoner
// Körs om när källan ändras: node scripts/material/sisyfos.mjs (skriver över).
//
// Källan (1098×1104) har sex paneler på krämvit botten. Panelerna klipps ut och
// läggs på sidans mörka färg med 16 px mellanrum, så att inga krämvita kanter
// följer med. Panel 6 är 25 px högre än de andra (lagerkransen och två rader text
// under staplarna), så panel 1–5 förlängs nedåt i panelens egen färg. Staplarna
// hamnar då på samma höjd i alla sex.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KALLA = 'C:/Users/zania/dev/skiftrutin/design/backe/vecka-herkules-appen.png';
const UT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'formad');

const BAKGRUND = '0x0C0D0E';
const PANELFARG = '0x0D0E18'; // panelernas egen botten i källan
const GAP = 16;

// Panelerna i källan, uppmätta: kolumner x 0, 370, 740 (358 breda), rader y 0 och 558.
const B = 358;
const H = 546; // panel 6:s höjd, de andra är 521
const PANELER = [
  { x: 0, y: 0, h: 521 },
  { x: 370, y: 0, h: 521 },
  { x: 740, y: 0, h: 521 },
  { x: 0, y: 558, h: 521 },
  { x: 370, y: 558, h: 521 },
  { x: 740, y: 558, h: 546 },
];

function gor(fil, kolumner) {
  const rader = Math.ceil(PANELER.length / kolumner);
  const bredd = kolumner * B + (kolumner - 1) * GAP;
  const hojd = rader * H + (rader - 1) * GAP;
  const delar = [
    `[0:v]split=${PANELER.length}${PANELER.map((_, i) => `[s${i}]`).join('')}`,
    ...PANELER.map(
      (p, i) => `[s${i}]crop=${B}:${p.h}:${p.x}:${p.y},pad=${B}:${H}:0:0:color=${PANELFARG}[p${i}]`,
    ),
    `color=c=${BAKGRUND}:s=${bredd}x${hojd}:d=1[y0]`,
    ...PANELER.map((_, i) => {
      const x = (i % kolumner) * (B + GAP);
      const y = Math.floor(i / kolumner) * (H + GAP);
      return `[y${i}][p${i}]overlay=${x}:${y}${i === PANELER.length - 1 ? '' : `[y${i + 1}]`}`;
    }),
  ];
  const mal = path.join(UT, fil);
  execFileSync(
    'ffmpeg',
    ['-hide_banner', '-loglevel', 'error', '-y', '-i', KALLA, '-filter_complex', delar.join(';'),
      '-frames:v', '1', '-c:v', 'libwebp', '-quality', '82', mal],
    { stdio: 'inherit' },
  );
  console.log(`${fil}  ${bredd}×${hojd}  ${(fs.statSync(mal).size / 1024).toFixed(1)} kB`);
}

if (!fs.existsSync(KALLA)) throw new Error(`Källan saknas: ${KALLA}`);
gor('sisyfos-bred.webp', 3);
gor('sisyfos-smal.webp', 2);
