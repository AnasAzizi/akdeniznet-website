import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button styles, shared by <Button> and by links styled as buttons
 * (`buttonVariants()` on an i18n `Link` or an external `<a>`).
 * Default sizes keep touch targets at 44px or more.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    // Each variant sets its own border color: links styled as buttons use
    // buttonVariants() without cn(), so base and variant classes must not
    // compete for the same property.
    variants: {
      variant: {
        /** Brand blue: the default action. */
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover",
        /** Brand orange: the one main call to action per screen. */
        cta: "border-transparent bg-cta text-cta-foreground hover:bg-cta-hover",
        outline:
          "border-input bg-card text-foreground hover:border-foreground/40 hover:bg-muted",
        ghost: "border-transparent text-foreground hover:bg-muted",
        link: "rounded-none border-transparent text-primary-ink underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-11 px-4 text-sm",
        default: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

/** Native <button> (no UI-library runtime in the browser bundle). */
function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
