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
 * Never loaded when the visitor prefers reduced motion.
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
    });
    ScrollTrigger.refresh();
  }

  scan();

  return {
    scan,
    destroy: () => context.revert(),
  };
}
