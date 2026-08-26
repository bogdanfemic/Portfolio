import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = ['Yara-Shop', 'HotTakePR', 'Digitechnikum'];

await Promise.all(
  assets.map(async (name) => {
    const input = path.join(root, 'src', 'assets', `${name}.png`);
    const output = path.join(root, 'src', 'assets', `${name}.webp`);
    await sharp(input)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(output);
    console.log(`Optimized ${name}.webp`);
  })
);
