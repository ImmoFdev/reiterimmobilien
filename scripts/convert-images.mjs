// Konvertiert alle JPG/PNG in public/images/ zu WebP (quality 85).
// Zusaetzlich: generiert /apple-touch-icon.webp (180x180) aus reiter-logo-weiss
// mit dem CI-Dark als Hintergrund, damit iOS Home-Screen-Bookmarks lesbar sind.
//
// Aufruf: node scripts/convert-images.mjs

import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_IMAGES = join(__dirname, '..', 'public', 'images');
const PUBLIC_ROOT = join(__dirname, '..', 'public');

const WEBP_QUALITY = 92;
const MAX_WIDTH = 2560; // 3K-ready fuer Retina/HighDPI-Displays
const RASTER_EXTS = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(p));
    } else {
      files.push(p);
    }
  }
  return files;
}

async function convertFile(file) {
  const ext = extname(file).toLowerCase();
  if (!RASTER_EXTS.has(ext)) return null;

  const webpPath = file.slice(0, -ext.length) + '.webp';

  const inBytes = (await stat(file)).size;

  const pipeline = sharp(file);
  const meta = await pipeline.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(webpPath);
  const outBytes = (await stat(webpPath)).size;

  return {
    input: file,
    output: webpPath,
    savedPct: Math.round((1 - outBytes / inBytes) * 100),
    inKB: (inBytes / 1024).toFixed(1),
    outKB: (outBytes / 1024).toFixed(1),
    resized: meta.width && meta.width > MAX_WIDTH ? `${meta.width}px -> ${MAX_WIDTH}px` : null,
  };
}

async function buildAppleTouchIcon() {
  // Bevorzugt Original-PNG, faellt zurueck auf WebP wenn PNG geloescht wurde.
  const sourcePng = join(PUBLIC_IMAGES, 'reiter-logo-weiss.png');
  const sourceWebp = join(PUBLIC_IMAGES, 'reiter-logo-weiss.webp');
  const source = await stat(sourcePng).then(() => sourcePng).catch(() => sourceWebp);
  const target = join(PUBLIC_ROOT, 'apple-touch-icon.webp');

  await sharp(source)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 42, g: 39, b: 36, alpha: 1 }, // CI-Dark #2a2724
    })
    .webp({ quality: 90 })
    .toFile(target);

  const outBytes = (await stat(target)).size;
  return { output: target, outKB: (outBytes / 1024).toFixed(1) };
}

async function main() {
  console.log('Scanning:', PUBLIC_IMAGES);
  const files = await walk(PUBLIC_IMAGES);

  const results = [];
  for (const f of files) {
    const r = await convertFile(f);
    if (r) {
      results.push(r);
      const resizeNote = r.resized ? `, ${r.resized}` : '';
      console.log(
        `  ${basename(r.input)} -> ${basename(r.output)}  ` +
        `(${r.inKB} kB -> ${r.outKB} kB, -${r.savedPct}%${resizeNote})`
      );
    }
  }

  console.log('\nGenerating apple-touch-icon.webp (180x180 auf CI-Dark)...');
  const touch = await buildAppleTouchIcon();
  console.log(`  ${basename(touch.output)}  (${touch.outKB} kB)`);

  console.log(`\nKonvertiert: ${results.length} Dateien + 1 apple-touch-icon.`);
  console.log('Alte JPG/PNG wurden NICHT geloescht. Delete-Schritt separat ausfuehren.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
