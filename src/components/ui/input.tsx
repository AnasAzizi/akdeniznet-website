import type * as React from "react";

import { cn } from "@/lib/utils";

/** Shared look for text inputs, textareas and selects (native elements). */
export const controlClass =
  "w-full rounded-xl border border-input bg-card px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground/80 hover:border-foreground/60 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/[0.03]";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(controlClass, "h-12", className)}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlClass, "min-h-28 py-3 leading-relaxed", className)}
      {...props}
    />
  );
}

export { Input, Textarea };
