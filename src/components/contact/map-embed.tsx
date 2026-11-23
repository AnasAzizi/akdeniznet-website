"use client";

import { MapPinIcon } from "lucide-react";
import { useState } from "react";

type MapEmbedProps = {
  src: string;
  title: string;
  loadLabel: string;
  notice: string;
  address: string;
};

/**
 * Google Maps only loads when asked for. v1 embedded the map on every page
 * load (another ~0.5 MB and third-party requests); this facade costs nothing
 * until the visitor wants the map.
 */
export function MapEmbed({
  src,
  title,
  loadLabel,
  notice,
  address,
}: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full rounded-2xl border-0 bg-muted md:aspect-[16/10]"
      />
    );
  }

  return (
    <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl bg-secondary p-6 text-center md:aspect-[16/10]">
      <div className="flex max-w-sm flex-col items-center gap-3">
        <MapPinIcon
          aria-hidden
          className="size-10 text-primary"
          strokeWidth={1.75}
        />
        <p className="font-semibold">{address}</p>
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {loadLabel}
        </button>
        <p className="text-sm text-muted-foreground">{notice}</p>
      </div>
    </div>
  );
}
