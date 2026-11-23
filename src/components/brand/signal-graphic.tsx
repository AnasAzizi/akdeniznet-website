import { cn } from "@/lib/utils";

/**
 * The brand's signal motif (the waves above the "i" in the logo): a
 * transmitter sending waves out over a field of sites. Decorative only.
 * Waves and sites carry data attributes so the motion runtime can animate
 * them later; without it, they are simply drawn.
 */
export function SignalGraphic({ className }: { className?: string }) {
  const waves = [70, 120, 170, 220];
  // Points standing in for transmitter sites (illustrative positions).
  const sites = [
    [90, 150],
    [330, 120],
    [60, 300],
    [372, 270],
    [150, 70],
    [262, 52],
    [120, 220],
    [300, 210],
    [212, 128],
  ];

  return (
    <svg
      viewBox="0 0 440 400"
      aria-hidden
      focusable="false"
      className={cn("h-auto w-full", className)}
    >
      {/* The ground the waves rise from; stays inside the viewBox so nothing clips. */}
      <ellipse cx="220" cy="342" rx="216" ry="40" fill="var(--color-sea-100)" />

      {waves.map((radius, index) => (
        <path
          key={radius}
          data-signal-wave={index}
          d={`M ${220 - radius} 340 A ${radius} ${radius} 0 0 1 ${220 + radius} 340`}
          fill="none"
          stroke="var(--color-sea-600)"
          strokeOpacity={0.85 - index * 0.17}
          strokeWidth={index === 0 ? 6 : 4}
          strokeLinecap="round"
        />
      ))}

      {sites.map(([x, y]) => (
        <g key={`${x}-${y}`} data-signal-site="">
          <circle
            cx={x}
            cy={y}
            r="10"
            fill="var(--color-sun-500)"
            fillOpacity="0.18"
          />
          <circle cx={x} cy={y} r="4.5" fill="var(--color-sun-500)" />
        </g>
      ))}

      <g data-signal-tower="">
        <path d="M206 346 L220 300 L234 346 Z" fill="var(--color-sea-950)" />
        <circle cx="220" cy="296" r="9" fill="var(--color-sun-500)" />
        <circle cx="220" cy="296" r="3.5" fill="var(--color-card, #fff)" />
      </g>
    </svg>
  );
}
