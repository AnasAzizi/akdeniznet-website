// Fails when a color pair the design relies on drops below WCAG 2.2 AA.
// Reads the hex tokens from the :root block in src/app/globals.css, so a
// token change that breaks contrast fails CI. Run with `npm run contrast:check`.
import { readFileSync } from "node:fs";

const TEXT = 4.5; // normal-size text
const UI = 3; // focus rings, form-control outlines, large text

/** [foreground token, background token, minimum ratio, what it's used for] */
const PAIRS = [
  ["foreground", "background", TEXT, "body text"],
  ["foreground", "card", TEXT, "text on cards"],
  ["muted-foreground", "background", TEXT, "secondary text"],
  ["muted-foreground", "card", TEXT, "secondary text on cards"],
  ["muted-foreground", "muted", TEXT, "secondary text on muted panels"],
  ["primary-foreground", "primary", TEXT, "white on blue buttons"],
  ["primary-foreground", "primary-hover", TEXT, "white on hovered blue"],
  ["primary", "background", TEXT, "blue links"],
  ["primary", "card", TEXT, "blue links on cards"],
  ["primary-ink", "secondary", TEXT, "blue text on tinted panels"],
  ["primary-ink", "muted", TEXT, "blue text on muted panels"],
  ["secondary-foreground", "secondary", TEXT, "secondary badges"],
  ["cta-foreground", "cta", TEXT, "navy on the orange CTA"],
  ["cta-foreground", "cta-hover", TEXT, "navy on the hovered CTA"],
  ["cta-ink", "background", TEXT, "orange text"],
  ["cta-ink", "card", TEXT, "orange text on cards"],
  ["accent-foreground", "accent", TEXT, "hovered menu items"],
  ["inverse-foreground", "inverse", TEXT, "text on navy"],
  ["inverse-muted", "inverse", TEXT, "secondary text on navy"],
  ["cta", "inverse", TEXT, "orange accents on navy"],
  ["destructive", "card", TEXT, "error messages"],
  ["destructive", "background", TEXT, "error messages on sand"],
  ["destructive-foreground", "destructive", TEXT, "white on red"],
  ["input", "card", UI, "form-control outlines"],
  ["input", "background", UI, "form-control outlines on sand"],
  ["ring", "background", UI, "focus ring"],
  ["ring", "card", UI, "focus ring on cards"],
  ["cta", "inverse", UI, "focus ring on navy"],
];

const css = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);
const root = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const tokens = Object.fromEntries(
  [...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [
    m[1],
    m[2],
  ]),
);

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = false;
for (const [fg, bg, min, use] of PAIRS) {
  if (!tokens[fg] || !tokens[bg]) {
    console.error(`missing token: --${tokens[fg] ? bg : fg} (${use})`);
    failed = true;
    continue;
  }
  const value = ratio(tokens[fg], tokens[bg]);
  const ok = value >= min;
  if (!ok) failed = true;
  const line = `${ok ? "pass" : "FAIL"}  ${value.toFixed(2).padStart(5)}:1 (min ${min})  --${fg} on --${bg}  ${use}`;
  (ok ? console.log : console.error)(line);
}

if (failed) process.exit(1);
console.log(`\nContrast OK: ${PAIRS.length} pairs meet WCAG 2.2 AA.`);
