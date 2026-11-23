"use client";

import type { NavLink } from "@/components/layout/nav-items";
import { Link, usePathname } from "@/i18n/navigation";

type NavLinksProps = {
  links: readonly NavLink[];
  label: string;
};

/** Desktop navigation; marks the current page with aria-current. */
export function NavLinks({ links, label }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="relative inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:text-primary-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-4 aria-[current=page]:after:bottom-2 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-cta"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
