import type { Pathname } from "@/i18n/routing";

/** A main-navigation entry: an internal route and its `Nav.*` message key. */
export type NavItem = {
  href: Exclude<Pathname, "/">;
  label: "plans" | "speedTest" | "contact";
};

export const navItems: readonly NavItem[] = [
  { href: "/tarifeler", label: "plans" },
  { href: "/hiz-testi", label: "speedTest" },
  { href: "/iletisim", label: "contact" },
];

/** Labels resolved on the server and passed to client components. */
export type NavLink = { href: NavItem["href"]; label: string };
