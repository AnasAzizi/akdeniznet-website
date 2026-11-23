"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import type { MotionRuntime } from "@/lib/motion-runtime";

/**
 * Loads the motion runtime (GSAP) only once the browser is idle after first
 * paint, so it never competes with the page for the main thread or the
 * network. Marks <html> as `motion-ready` (so the init script's fallback
 * timer stands down) and re-scans for motion targets after each client
 * navigation. Nothing loads when the visitor prefers reduced motion.
 */
export function MotionProvider() {
  const pathname = usePathname();
  const runtime = useRef<MotionRuntime | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const load = () => {
      import("@/lib/motion-runtime")
        .then(({ createMotionRuntime }) => {
          if (!cancelled) runtime.current = createMotionRuntime();
        })
        // If the chunk fails to load, show hidden reveal content as-is.
        .catch(() => root.classList.remove("motion-ok"));
    };

    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 300);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      runtime.current?.destroy();
      runtime.current = null;
    };
  }, []);

  // New page content after a client navigation: wire up its motion.
  useEffect(() => {
    runtime.current?.scan();
  }, [pathname]);

  return null;
}
