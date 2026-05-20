#!/usr/bin/env node
// Generate PWA icons (192, 512) and the iOS apple-touch-icon (180) from the
// Veteran PRO wordmark SVG on the brand-charcoal background. Run after
// scripts/fetch-vp-assets.sh so the wordmark is in place.

import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LOGO = path.join(ROOT, "public/assets/logo/veteran_logo.svg");
const OUT_DIR = path.join(ROOT, "public/icons");
mkdirSync(OUT_DIR, { recursive: true });

const BRAND = "#2D2926";
const logoSvg = readFileSync(LOGO);

// Sizes: PWA standard plus iOS apple-touch.
const targets = [
  { name: "icon-192.png",        size: 192, padding: 0.18, maskable: false },
  { name: "icon-512.png",        size: 512, padding: 0.18, maskable: false },
  { name: "icon-512-maskable.png", size: 512, padding: 0.28, maskable: true },
  { name: "apple-touch-icon.png", size: 180, padding: 0.16, maskable: false }
];

for (const t of targets) {
  // Inner area = size * (1 - 2*padding); wordmark wider than tall, so cap by width.
  const inner = Math.round(t.size * (1 - 2 * t.padding));
  // Render the wordmark to a transparent PNG at the inner width; sharp will compute
  // the matching height from the SVG's intrinsic aspect ratio.
  const wordmark = await sharp(logoSvg).resize({ width: inner }).png().toBuffer();
  const { height: wmHeight } = await sharp(wordmark).metadata();
  const top = Math.round((t.size - (wmHeight ?? 0)) / 2);
  const left = Math.round((t.size - inner) / 2);

  const canvas = sharp({
    create: { width: t.size, height: t.size, channels: 4, background: BRAND }
  }).composite([{ input: wordmark, top, left }]).png();

  const buf = await canvas.toBuffer();
  writeFileSync(path.join(OUT_DIR, t.name), buf);
  console.log(`wrote ${t.name} (${t.size}x${t.size}${t.maskable ? ", maskable safe-zone" : ""})`);
}
