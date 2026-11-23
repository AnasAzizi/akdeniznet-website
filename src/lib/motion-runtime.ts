import { gsap, ScrollTrigger } from "@/lib/gsap";

export type MotionRuntime = {
  /** Wire up motion for elements added since the last scan (new pages). */
  scan: () => void;
  destroy: () => void;
};

/**
 * All scroll-driven motion in one lazily imported module, loaded by
 * MotionProvider once the browser is idle after first paint. Server
 * Components only emit data attributes:
 * - [data-reveal]: fade up once on scroll
 *   (data-reveal-stagger animates direct children one after another,
 *   data-reveal-delay and data-reveal-y tune the start)
 * - [data-count-to]: count up from 0 once on scroll, in the page's number
 *   format (the HTML holds the final number)
 * - [data-bar]: grow from zero width (scaleX) once on scroll
 *   (data-bar-delay staggers bars in the same group)
 * Only use these below the fold: content that is already in view should
 * not wait for this module. Never loaded under reduced motion.
 */
export function createMotionRuntime(): MotionRuntime {
  const context = gsap.context(() => {});

  /** Elements matching `selector` that haven't been wired up yet. */
  const fresh = (selector: string) =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        `${selector}:not([data-motion-init])`,
      ),
      (element) => {
        element.dataset.motionInit = "";
        return element;
      },
    );

  function scan() {
    context.add(() => {
      for (const element of fresh("[data-reveal]")) {
        const stagger = Number(element.dataset.revealStagger) || 0;
        const delay = Number(element.dataset.revealDelay) || 0;
        const y = element.dataset.revealY
          ? Number(element.dataset.revealY)
          : 24;
        const targets = stagger ? Array.from(element.children) : element;
        if (stagger) gsap.set(element, { opacity: 1 });
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            delay,
            stagger: stagger || undefined,
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      }

      const restore: Array<() => void> = [];
      const format = new Intl.NumberFormat(
        document.documentElement.lang || undefined,
      );
      for (const element of fresh("[data-count-to]")) {
        const target = Number(element.dataset.countTo);
        if (!Number.isFinite(target)) continue;
        const counter = { value: 0 };
        element.textContent = format.format(0);
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
          onUpdate: () => {
            element.textContent = format.format(Math.round(counter.value));
          },
        });
        restore.push(() => {
          element.textContent = format.format(target);
        });
      }

      for (const element of fresh("[data-bar]")) {
        // Animates to the scale set inline by the server (the bar's value).
        gsap.from(element, {
          scaleX: 0,
          duration: 1.2,
          delay: Number(element.dataset.barDelay) || 0,
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      }

      // On revert, counters show their real numbers again.
      return () => restore.forEach((fn) => fn());
    });
    ScrollTrigger.refresh();
  }

  scan();

  return {
    scan,
    destroy: () => context.revert(),
  };
}
