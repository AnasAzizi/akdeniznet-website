/** Every page, in both languages, as the browser sees its URL. */
export const routes = [
  { name: "home", tr: "/", en: "/en" },
  { name: "plans", tr: "/tarifeler", en: "/en/plans" },
  { name: "speed test", tr: "/hiz-testi", en: "/en/speed-test" },
  { name: "contact", tr: "/iletisim", en: "/en/contact" },
  { name: "apply", tr: "/basvuru", en: "/en/apply" },
] as const;

export const allPages = routes.flatMap((route) => [
  { label: `${route.name} (tr)`, path: route.tr, lang: "tr" },
  { label: `${route.name} (en)`, path: route.en, lang: "en" },
]);
