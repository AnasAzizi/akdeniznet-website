"use client";

import { ExternalLinkIcon, MenuIcon, XIcon } from "lucide-react";
import { type ReactNode, useId, useRef } from "react";

import type { NavLink } from "@/components/layout/nav-items";
import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  links: readonly NavLink[];
  portal: { href: string; label: string; newTab: string };
  labels: { title: string; open: string; close: string; home: string };
  /** The language switch, rendered by the server. */
  localeSwitch: ReactNode;
  className?: string;
};

/**
 * Full-screen menu for small screens, built on the native <dialog>: the
 * browser provides the focus trap, Escape to close and an inert background,
 * so no dialog library ships to the client.
 */
export function MobileNav({
  links,
  portal,
  labels,
  localeSwitch,
  className,
}: MobileNavProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pathname = usePathname();
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label={labels.open}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          className,
        )}
      >
        <MenuIcon aria-hidden className="size-6" />
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="mobile-nav"
        // A click on the backdrop (outside the panel) closes the menu.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="container-page flex min-h-full flex-col pt-4 pb-8">
          <div className="flex items-center justify-between pb-6">
            <p
              id={titleId}
              className="text-eyebrow text-muted-foreground uppercase"
            >
              {labels.title}
            </p>
            <button
              type="button"
              aria-label={labels.close}
              onClick={close}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <XIcon aria-hidden className="size-6" />
            </button>
          </div>

          <nav aria-labelledby={titleId}>
            <ul className="flex flex-col divide-y">
              {[{ href: "/" as const, label: labels.home }, ...links].map(
                (link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className="flex min-h-14 items-center gap-3 text-h3 transition-colors hover:text-primary-ink aria-[current=page]:text-primary-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-10">
            <a
              href={portal.href}
              target="_blank"
              rel="noopener"
              className={cn(
                buttonVariants({ variant: "cta", size: "lg" }),
                "w-full",
              )}
            >
              {portal.label}
              <ExternalLinkIcon aria-hidden />
              <span className="sr-only">{portal.newTab}</span>
            </a>
            {localeSwitch}
          </div>
        </div>
      </dialog>
    </>
  );
}
