// Tar Mat-sidan ur Formad och skriver public/formad/tel-mat.webp (1080×2338, libwebp -quality 82).
// Play-bilden 4-mat.png byttes mot den här: där var dagen tom, och "Mål 1 850 kcal"
// bröts så att "kcal" låg över "Protein". Med mat loggad och rörelse från klockan
// står målet på en rad.
//
// Så körs det, från C:\Users\zania\dev\skiftrutin (appens repo på main):
//   node C:\Users\zania\dev\Infrakust\scripts\material\tel-mat.cjs
// Playwright och express hämtas från skiftrutins node_modules. ffmpeg måste finnas i PATH.
// Formad-repot ändras inte: appen körs från dess public/ och shared/ med en egen
// statisk server, och dagen läggs in i localStorage.
//
// Vad skriptet gör: 390×844 vid deviceScaleFactor 3, klockan satt till 23 september
// 15.40 (samma dag som Play-bilderna bredvid), en arbetsvecka med pass, fem saker
// ätna fram till eftermiddagen och 412 kcal rörelse. Sedan fliken Mat.

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SKIFTRUTIN = 'C:/Users/zania/dev/skiftrutin';
const fran = (namn) => require(require.resolve(namn, { paths: [process.cwd(), SKIFTRUTIN] }));
const { chromium } = fran('playwright');
const express = fran('express');

const UT = path.join(__dirname, '..', '..', 'public', 'formad', 'tel-mat.webp');

(async () => {
  const app = express();
  app.use('/shared', express.static(path.join(SKIFTRUTIN, 'shared')));
  app.use(express.static(path.join(SKIFTRUTIN, 'public')));
  const server = await new Promise((r) => {
    const s = app.listen(0, '127.0.0.1', () => r(s));
  });
  const browser = await chromium.launch({ headless: true });
  try {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      timezoneId: 'Europe/Stockholm',
      locale: 'sv-SE',
    });
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date('2026-09-23T15:40:00+02:00') });
    const fel = [];
    page.on('pageerror', (e) => fel.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.evaluate(() => {
      const S = window.SkiftPlan;
      const key = S.localDate(new Date());
      const start = S.weekStart(key);
      const days = {};
      for (let i = 0; i < 7; i++) {
        days[S.addDate(start, i)] = {
          blocks: i < 5 ? [{ s: '07:00', e: '11:00' }, { s: '12:00', e: '16:00' }] : [],
          off: i >= 5, training: i === 2, breakfast: true, homeAt: null, done: [], water: 2, skipped: false,
        };
      }
      const per = (kcal, protein, carbs, fat) => ({ kcal, protein, carbs, fat });
      days[key].food = [
        { id: 'f1', name: 'Havregrynsgröt', meal: 'frukost', g: 350, unit: 'g', at: 380, per: per(68, 2.4, 11.5, 1.3) },
        { id: 'f2', name: 'Kvarg naturell', meal: 'frukost', g: 200, unit: 'g', at: 385, per: per(62, 11, 3.8, 0.2) },
        { id: 'f3', name: 'Kycklingfilé', meal: 'lunch', g: 180, unit: 'g', at: 675, per: per(110, 23, 0, 1.8) },
        { id: 'f4', name: 'Jasminris, kokt', meal: 'lunch', g: 250, unit: 'g', at: 675, per: per(130, 2.7, 28, 0.3) },
        { id: 'f5', name: 'Banan', meal: 'mellanmal', g: 120, unit: 'g', at: 850, per: per(89, 1.1, 20, 0.3) },
      ];
      localStorage.setItem('skiftrutin.v1', JSON.stringify({ cfg: { ...S.defaults, intro: 'klar' }, days }));
      localStorage.setItem(
        'skiftrutin.health',
        JSON.stringify({ v: 2, raw: {}, days: { [key]: { activeKcal: 412, steps: 8640 } }, syncedAt: Date.now() }),
      );
    });
    await page.reload();
    await page.waitForTimeout(1500);
    await page.click("[data-tab='mat']");
    await page.waitForTimeout(2500);
    if (fel.length) throw new Error(`Fel i appen: ${fel.join(' | ')}`);

    const png = path.join(os.tmpdir(), `tel-mat-${process.pid}.png`);
    await page.screenshot({ path: png });
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', png,
      '-vf', 'scale=1080:-2', '-c:v', 'libwebp', '-quality', '82', UT,
    ]);
    fs.rmSync(png);
    console.log(`✓ ${UT} ${(fs.statSync(UT).size / 1024).toFixed(1)} kB`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
