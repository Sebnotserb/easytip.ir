/**
 * Generates the EasyTip favicon set from the source SVGs:
 *   - public/logo.svg            (full brand mark — used for marketing/app UI)
 *   - src/app/icon.svg           (simplified mark — used at small sizes)
 *
 * Outputs:
 *   - public/icon-192.png        (PWA manifest)
 *   - public/icon-512.png        (PWA manifest)
 *   - src/app/favicon.ico        (Next.js App Router legacy favicon)
 *   - src/app/icon.png           (Next.js App Router auto-favicon, 32x32)
 *   - src/app/apple-icon.png     (Next.js App Router Apple touch icon, 180x180)
 *
 * Run with: node scripts/generate-favicons.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const FULL_SVG = join(root, "public", "logo.svg");
const ICON_SVG = join(root, "src", "app", "icon.svg");

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function svgToPng(svgPath, size) {
  const svg = await readFile(svgPath);
  return sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
}

async function writePng(svgPath, size, outPath) {
  const buf = await svgToPng(svgPath, size);
  await ensureDir(outPath);
  await writeFile(outPath, buf);
  console.log(`  ${outPath}  (${size}x${size})`);
}

async function writeIco(svgPath, sizes, outPath) {
  const pngs = await Promise.all(sizes.map((s) => svgToPng(svgPath, s)));
  const ico = await toIco(pngs);
  await ensureDir(outPath);
  await writeFile(outPath, ico);
  console.log(`  ${outPath}  (${sizes.join(",")})`);
}

async function main() {
  console.log("Generating favicon set…");

  await writePng(FULL_SVG, 192, join(root, "public", "icon-192.png"));
  await writePng(FULL_SVG, 512, join(root, "public", "icon-512.png"));
  await writePng(ICON_SVG, 32,  join(root, "src", "app", "icon.png"));
  await writePng(FULL_SVG, 180, join(root, "src", "app", "apple-icon.png"));

  await writeIco(ICON_SVG, [16, 32, 48], join(root, "src", "app", "favicon.ico"));

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
