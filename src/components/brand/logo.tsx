import Image from "next/image";

import logo from "@/assets/brand/akdeniznet-logo.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Load eagerly (the header logo is above the fold on every page). */
  priority?: boolean;
};

/**
 * The Akdeniznet wordmark. The source is a 334×78 PNG from the 2023 site,
 * sharp up to ~167px wide on 2× screens; a vector version from the client
 * would replace it.
 */
export function Logo({ className, priority }: LogoProps) {
  return (
    <Image
      src={logo}
      alt="Akdeniznet"
      priority={priority}
      sizes="167px"
      className={cn("h-9 w-auto", className)}
    />
  );
}
