// Tar stillbilden av Herkules ur 3D-visaren på casesidan och skriver
// public/formad/herkules-still.webp (1120×1494, libwebp -quality 85).
// Bilden är reserven som visas innan modellen laddats, och eftersom den
// är tagen ur visaren själv visar övertoningen samma föremål.
//
// Så körs det:
//   1. I Infrakust: npm run build och sedan npm run preview (port 4173), som
//      måste vara igång medan skriptet körs.
//   2. Från C:\Users\zania\dev\skiftrutin:
//        node C:\Users\zania\dev\Infrakust\scripts\material\capture-still.cjs
//      Infrakust har ingen Playwright, så den hämtas från skiftrutins
//      node_modules (först katalogen du står i, annars skiftrutin). ffmpeg
//      måste finnas i PATH.
//
// Vad skriptet gör: visaren 560 px bred vid deviceScaleFactor 2, autorotationen
// låst på vinkel 0 (requestAnimationFrame får alltid samma tidsstämpel, så dt
// blir 0), canvasen 150 px under den fasta navigeringen och filmkornet
// body::after dolt (det läggs annars på bilden två gånger på sidan). Elementets
// skärmbild beskärs i mitten till exakt 3:4 och kodas till webp.
//
// Ta om bilden när modellen packas om, när ljuset ändras eller när sektionens
// bakgrund ändras från bg-bg-primary.

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SKIFTRUTIN = 'C:/Users/zania/dev/skiftrutin';
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), SKIFTRUTIN] }));

const URL = 'http://localhost:4173/case/formad';
const STILL = '/formad/herkules-still.webp';
const UT = path.join(__dirname, '..', '..', 'public', 'formad', 'herkules-still.webp');
const BREDD = 1120;
const HOJD = 1494; // 1120 × 4/3, avrundat

(async () => {
  const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => raf(() => cb(1000));
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate((src) => {
    const el = document.querySelector(`img[src="${src}"]`).parentElement;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150);
  }, STILL);
  await page.addStyleTag({ content: 'body::after { display: none !important; }' });
  await page.waitForSelector('[data-ready="true"]', { timeout: 30000 });
  await page.waitForTimeout(1500); // övertoningen är 700 ms

  const canvas = page.locator(`div:has(> img[src="${STILL}"]) canvas`);
  const box = await canvas.boundingBox();
  if (Math.round(box.width) !== BREDD / 2) {
    throw new Error(`visaren är ${box.width} px bred, väntade ${BREDD / 2}`);
  }
  const png = path.join(os.tmpdir(), 'herkules-still-capture.png');
  await canvas.screenshot({ path: png });
  await browser.close();

  execFileSync('ffmpeg', [
    '-loglevel', 'error',
    '-i', png,
    '-vf', `crop=${BREDD}:${HOJD}:0:(ih-${HOJD})/2`,
    '-c:v', 'libwebp',
    '-quality', '85',
    '-y', UT,
  ]);
  fs.rmSync(png);
  console.log(`✓ ${path.relative(process.cwd(), UT)} (${fs.statSync(UT).size} byte)`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
