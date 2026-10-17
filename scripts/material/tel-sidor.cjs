// Tar hela sidorna Idag, Träning, Vecka och Mat ur Formad som höga bilder och skriver
// public/formad/tel-idag.webp, tel-traning.webp, tel-vecka.webp och tel-mat.webp
// (1080 px breda, så höga som sidan är, libwebp -quality 82). På casesidan rullar de
// långsamt inne i telefonramen, så att besökaren ser allt som finns på varje sida,
// inte bara det som ryms i en skärm.
//
// Så körs det, från C:\Users\zania\dev\skiftrutin (appens repo på main):
//   node C:\Users\zania\dev\Infrakust\scripts\material\tel-sidor.cjs
// Playwright och express hämtas från skiftrutins node_modules. ffmpeg måste finnas i PATH.
// Formad-repot ändras inte: appen körs från dess public/ och shared/ med en egen
// statisk server, och dagen läggs in i localStorage.
//
// Samma seedning som tel-mat.cjs: 390×844 vid deviceScaleFactor 3, klockan satt till
// 23 september 15.40, en arbetsvecka med pass på onsdagen, fem saker ätna fram till
// eftermiddagen och 412 kcal rörelse. Fasta element (sidhuvud, flikrad) görs statiska
// före bilden, så att de hamnar en gång överst respektive nederst i den höga bilden i
// stället för att sväva mitt i den.

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SKIFTRUTIN = 'C:/Users/zania/dev/skiftrutin';
const fran = (namn) => require(require.resolve(namn, { paths: [process.cwd(), SKIFTRUTIN] }));
const { chromium } = fran('playwright');
const express = fran('express');

const UT = path.join(__dirname, '..', '..', 'public', 'formad');
const SIDOR = [
  { tab: 'idag', fil: 'tel-idag.webp' },
  { tab: 'traning', fil: 'tel-traning.webp' },
  { tab: 'vecka', fil: 'tel-vecka.webp' },
  { tab: 'mat', fil: 'tel-mat.webp' },
];

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
      // Appen följer enhetens färgläge; mörkt som Play-bilderna och resten av caset.
      colorScheme: 'dark',
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

    for (const sida of SIDOR) {
      await page.click(`[data-tab='${sida.tab}']`);
      await page.waitForTimeout(2500);
      // Fasta element en gång i flödet: sidhuvudet överst, flikraden nederst. Övrigt fast
      // (dekor, toningen över flikraden) döljs. Återställs efter bilden.
      await page.evaluate(() => {
        const rorda = [];
        for (const el of document.querySelectorAll('body *')) {
          const pos = getComputedStyle(el).position;
          if (pos !== 'fixed' && pos !== 'sticky') continue;
          const stat = el.matches('header, nav, [role="navigation"], [role="banner"]') || el.querySelector('[data-tab]');
          rorda.push([el, el.style.position, el.style.display, el.style.transform]);
          if (stat) { el.style.position = 'static'; el.style.transform = 'none'; }
          else el.style.display = 'none';
        }
        window.__rorda = rorda;
        const s = document.createElement('style');
        s.id = 'tel-sidor';
        s.textContent = 'body::after{display:none !important} html,body,#main{overflow:visible !important;height:auto !important}';
        document.head.appendChild(s);
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      const png = path.join(os.tmpdir(), `tel-${sida.tab}-${process.pid}.png`);
      await page.screenshot({ path: png, fullPage: true });
      await page.evaluate(() => {
        for (const [el, pos, disp, tr] of window.__rorda) { el.style.position = pos; el.style.display = disp; el.style.transform = tr; }
        document.getElementById('tel-sidor')?.remove();
      });
      const ut = path.join(UT, sida.fil);
      execFileSync('ffmpeg', [
        '-hide_banner', '-loglevel', 'error', '-y', '-i', png,
        '-vf', 'scale=1080:-2', '-c:v', 'libwebp', '-quality', '82', ut,
      ]);
      fs.rmSync(png);
      const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', ut]).toString().trim().split(',');
      console.log(`✓ ${sida.fil} ${w}×${h} ${(fs.statSync(ut).size / 1024).toFixed(1)} kB`);
    }
    if (fel.length) throw new Error(`Fel i appen: ${fel.join(' | ')}`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
