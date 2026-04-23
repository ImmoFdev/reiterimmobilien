import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', 'public', 'images');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(p));
    else files.push(p);
  }
  return files;
}

const files = (await walk(root)).filter((f) => f.endsWith('.webp'));
for (const f of files) {
  const meta = await sharp(f).metadata();
  const size = (await stat(f)).size;
  const rel = f.replace(root + '\\', '').replace(root + '/', '');
  console.log(`${rel.padEnd(50)} ${meta.width}x${meta.height}  ${(size/1024).toFixed(0)}kB  (density: ${meta.density || 'n/a'})`);
}
