// Tar ett pass som pågår ur Formad och skriver public/formad/tel-pass-pagar.webp
// (1080 px bred, hela passets ark i en hög bild, libwebp -quality 82). På casesidan
// rullar den i telefonramen bredvid det sparade passet och övningsbladet.
//
// Så körs det, från C:\Users\zania\dev\skiftrutin (appens repo på main):
//   node C:\Users\zania\dev\Infrakust\scripts\material\tel-pass-pagar.cjs
// Playwright och express hämtas från skiftrutins node_modules. ffmpeg måste finnas i PATH.
// Formad-repot ändras inte: appen körs från dess public/ och shared/ med en egen
// statisk server, och passet läggs in i localStorage under skiftrutin.activeWorkout,
// som appen själv gör när ett pass startas.
//
// Passet: Underkropp tung, startat för 23 minuter sedan. Marklyft med tre set bockade
// (uppvärmning, 100 × 5 @7, 120 × 5 @8) och vilan igång före toppsetet 130 × 3, sedan
// knäböj och bänkpress med målen från rutinen, inte gjorda än.

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SKIFTRUTIN = 'C:/Users/zania/dev/skiftrutin';
const fran = (namn) => require(require.resolve(namn, { paths: [process.cwd(), SKIFTRUTIN] }));
const { chromium } = fran('playwright');
const express = fran('express');

const UT = path.join(__dirname, '..', '..', 'public', 'formad', 'tel-pass-pagar.webp');

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
      localStorage.setItem('skiftrutin.v1', JSON.stringify({ cfg: { ...S.defaults, intro: 'klar' }, days }));

      const nu = Date.now();
      const set = (a, b, rpe, done, kind = '') => ({ kind, a: String(a), b: String(b), rpe: rpe ? String(rpe) : '', done, goal: { ...(kind ? { kind } : {}), kg: a, reps: b } });
      const mal = (a, b, kind = '') => ({ kind, a: '', b: '', rpe: '', done: false, goal: { ...(kind ? { kind } : {}), kg: a, reps: b } });
      const ovning = (exercise, title, rest, sets) => ({ exercise, title, type: 'vikt', note: '', noteOpen: false, plan: '', rest, superset: null, sets });
      const wo = {
        id: 'w-demo-pagar', mode: 'live', editing: false, startAt: nu - 23 * 60 * 1000, endAt: null,
        date: key, time: '15:17', min: '60', title: 'Underkropp tung', note: '', link: '',
        feel: { energy: null, note: '', hurt: false, where: '' }, extra: true,
        exercises: [
          ovning('marklyft', 'Marklyft', 180, [set(60, 5, 0, true, 'w'), set(100, 5, 7, true), set(120, 5, 8, true), mal(130, 3)]),
          ovning('knaboj', 'Knäböj', 150, [mal(60, 8, 'w'), mal(90, 8), mal(100, 6), mal(100, 6)]),
          ovning('banpress', 'Bänkpress', 120, [mal(70, 8), mal(75, 6), mal(75, 5)]),
        ],
        rest: { until: nu + 112 * 1000, total: 180, i: 0, j: 2 },
      };
      localStorage.setItem('skiftrutin.activeWorkout', JSON.stringify(wo));
    });
    await page.reload();
    await page.waitForTimeout(1500);
    await page.click('#wo-resume-btn');
    await page.waitForTimeout(1500);

    // Arket som en hög bild: dialogen och dess rullande innehåll får sin fulla höjd,
    // så att hela passet kommer med. Vilan ligger kvar överst som den gör i appen.
    const hojd = await page.evaluate(() => {
      const d = document.querySelector('#workout-dialog');
      const s = document.createElement('style');
      s.textContent =
        '#workout-dialog{position:static !important;max-height:none !important;height:auto !important;transform:none !important;margin:0 !important;inset:auto !important}' +
        '#workout-dialog *{max-height:none !important}' +
        '#workout-dialog [class*="sheet-body"],#workout-dialog .wo-body,#workout-dialog form{overflow:visible !important;height:auto !important}' +
        'body::after{display:none !important}';
      document.head.appendChild(s);
      return Math.ceil(d.scrollHeight);
    });
    await page.setViewportSize({ width: 390, height: Math.max(844, hojd) });
    await page.waitForTimeout(500);
    const png = path.join(os.tmpdir(), `tel-pass-pagar-${process.pid}.png`);
    await page.locator('#workout-dialog').screenshot({ path: png });
    if (fel.length) throw new Error(`Fel i appen: ${fel.join(' | ')}`);
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', png,
      '-vf', 'scale=1080:-2', '-c:v', 'libwebp', '-quality', '82', UT,
    ]);
    fs.rmSync(png);
    const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', UT]).toString().trim().split(',');
    console.log(`✓ ${UT} ${w}×${h} ${(fs.statSync(UT).size / 1024).toFixed(1)} kB`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
