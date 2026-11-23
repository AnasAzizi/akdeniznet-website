import type { HTMLAttributes, ReactNode } from "react";

type RevealTag = "div" | "section" | "header" | "ul" | "ol" | "li" | "p";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
  /** Animate direct children one after another instead of the whole block. */
  stagger?: number;
  delay?: number;
  /** Starting vertical offset in px. */
  y?: number;
  children: ReactNode;
};

/**
 * Fades content up when it scrolls into view (once). A Server Component:
 * it only marks the element; the lazily loaded motion runtime animates it.
 * It starts hidden only when the init script set `motion-ok`, so without JS
 * or with reduced motion the content is simply visible.
 */
export function Reveal({
  as: Tag = "div",
  stagger,
  delay,
  y,
  children,
  ...rest
}: RevealProps) {
  return (
    <Tag
      data-reveal=""
      data-reveal-stagger={stagger}
      data-reveal-delay={delay}
      data-reveal-y={y}
      {...rest}
    >
      {children}
    </Tag>
  );
}
