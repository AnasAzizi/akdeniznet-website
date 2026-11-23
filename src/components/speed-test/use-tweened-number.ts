"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Eases a number towards each new target (ease-out cubic), so the speed
 * gauge glides between the engine's result updates instead of jumping.
 * Jumps straight to the target under reduced motion. Plain
 * requestAnimationFrame: one number doesn't need GSAP in this bundle.
 */
export function useTweenedNumber(target: number | undefined, duration = 700) {
  const [value, setValue] = useState(target ?? 0);
  const current = useRef(target ?? 0);

  useEffect(() => {
    if (target === undefined) {
      // A new test starts from zero.
      current.current = 0;
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = current.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = reduce ? 1 : Math.min(1, (now - start) / duration);
      const next = from + (target - from) * (1 - (1 - progress) ** 3);
      current.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return target === undefined ? undefined : value;
}
