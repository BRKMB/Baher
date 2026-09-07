/**
 * Regenerates raster brand assets and re-encodes photos from public/images.
 * Run with: npx --yes sharp-cli@latest --version >/dev/null && node scripts/build-assets.mjs
 * Requires sharp: npm i -D sharp
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const imagesDir = path.join(publicDir, "images");

const brand = {
  clean: "#1F6B5C",
  speak: "#C45C26",
  paper: "#F6F3ED",
  ink: "#1C1B19",
};

const markSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <path d="M0 0h32v64H0z" fill="${brand.clean}"/>
  <path d="M32 0h32v64H32z" fill="${brand.speak}"/>
  <path d="M24.5 18.5c-7.4 1.4-12 8-12 13.8 0 6.4 5 12.7 12.4 13.4" fill="none" stroke="${brand.paper}" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M40 20.2c5.4-.4 9.6 2.6 9.6 7.2 0 4.8-4.2 6.6-9.2 7.6 5.6.8 10 3.4 10 8.4 0 5.4-5 8.8-11 8.4" fill="none" stroke="${brand.paper}" stroke-width="3.6" stroke-linecap="round"/>
</svg>`;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${brand.paper}"/>
  <rect x="0" y="0" width="1200" height="10" fill="${brand.clean}"/>
  <rect x="600" y="0" width="600" height="10" fill="${brand.speak}"/>
  <g transform="translate(96 96)">
    <rect width="56" height="56" fill="${brand.clean}"/>
    <rect x="56" width="56" height="56" fill="${brand.speak}"/>
    <text x="140" y="40" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="${brand.ink}">Clean &amp; Speak</text>
  </g>
  <text x="96" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="88" fill="${brand.ink}">Czysty dom.</text>
  <text x="96" y="400" font-family="Georgia, 'Times New Roman', serif" font-size="88" fill="${brand.speak}">Lepszy angielski.</text>
  <text x="96" y="474" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#3C3934">Profesjonalne sprzątanie i nauka angielskiego pod jedną marką.</text>
  <g transform="translate(96 520)">
    <rect width="240" height="58" fill="${brand.clean}"/>
    <text x="120" y="37" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="#F4FBF8">Sprzątanie</text>
    <rect x="264" width="240" height="58" fill="${brand.speak}"/>
    <text x="384" y="37" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFF7F1">Angielski</text>
  </g>
</svg>`;

async function buildIcons() {
  const targets = [
    { file: "favicon-32.png", size: 32 },
    { file: "favicon-192.png", size: 192 },
    { file: "favicon-512.png", size: 512 },
    { file: "apple-touch-icon.png", size: 180 },
  ];

  for (const { file, size } of targets) {
    const buffer = await sharp(Buffer.from(markSvg(size))).png({ compressionLevel: 9 }).toBuffer();
    await writeFile(path.join(publicDir, file), buffer);
    console.log(`icon  ${file} ${(buffer.byteLength / 1024).toFixed(1)} KiB`);
  }

  const og = await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  await writeFile(path.join(publicDir, "og-image.png"), og);
  console.log(`og    og-image.png ${(og.byteLength / 1024).toFixed(1)} KiB`);
}

async function compressPhotos() {
  const files = (await readdir(imagesDir)).filter((file) => file.endsWith(".webp"));
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const before = (await stat(filePath)).size;
    const input = await readFile(filePath);
    const output = await sharp(input)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toBuffer();

    if (output.byteLength < before) {
      await writeFile(filePath, output);
    }
    const after = (await stat(filePath)).size;
    console.log(`photo ${file} ${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KiB`);
  }
}

await buildIcons();
await compressPhotos();
