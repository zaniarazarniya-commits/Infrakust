import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
];

const pngBuffers = [];

for (const { name, size } of sizes) {
  const out = path.join(publicDir, name);
  const buf = await sharp(svgPath).resize(size, size).png().toBuffer();
  await fs.writeFile(out, buf);
  if (size <= 48) pngBuffers.push(buf);
  console.log(`✓ ${name}`);
}

const ico = await pngToIco(pngBuffers);
await fs.writeFile(path.join(publicDir, 'favicon.ico'), ico);
console.log('✓ favicon.ico');
