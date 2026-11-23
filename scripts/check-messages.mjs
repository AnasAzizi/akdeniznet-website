// Fails when a locale's messages are missing keys from, or have extra keys
// beyond, the Turkish source file. Run with `npm run i18n:check`.
import { readFileSync } from "node:fs";

const SOURCE = "tr";
const LOCALES = ["en"];

const load = (locale) =>
  JSON.parse(
    readFileSync(new URL(`../messages/${locale}.json`, import.meta.url)),
  );

const flatten = (object, prefix = "") =>
  Object.entries(object).flatMap(([key, value]) =>
    value && typeof value === "object"
      ? flatten(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const sourceKeys = new Set(flatten(load(SOURCE)));
let failed = false;

for (const locale of LOCALES) {
  const keys = new Set(flatten(load(locale)));
  const missing = [...sourceKeys].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !sourceKeys.has(key));
  if (missing.length || extra.length) failed = true;
  for (const key of missing) console.error(`${locale}: missing "${key}"`);
  for (const key of extra) console.error(`${locale}: extra "${key}"`);
}

if (failed) process.exit(1);
console.log(
  `Messages OK: ${LOCALES.join(", ")} match ${SOURCE} (${sourceKeys.size} keys).`,
);
