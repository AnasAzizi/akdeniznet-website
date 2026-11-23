import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";

import { controlClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A styled native <select>: the phone's own picker on mobile, full keyboard
 * and screen-reader support, and it works before JavaScript loads.
 */
function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(controlClass, "h-12 appearance-none pe-11", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

export { NativeSelect };
