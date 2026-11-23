/**
 * Semicircular speed gauge on a log scale (1–1,000 Mbps), so 4 Mbps home
 * plans and 500 Mbps business plans are both readable. Decorative: the
 * numbers it shows are also in the results list and the live status.
 */
const MAX_MBPS = 1000;
const TICKS = [1, 10, 100, 1000];

/** 0–1 position of a speed on the dial. */
export function gaugePosition(mbps: number) {
  return Math.min(
    1,
    Math.log10(1 + Math.max(0, mbps)) / Math.log10(1 + MAX_MBPS),
  );
}

const ARC = "M 30 170 A 140 140 0 0 1 310 170";

export function SpeedGauge({
  mbps,
  value,
  unit,
  label,
}: {
  /** Current speed (drives the arc). */
  mbps: number;
  /** Formatted number shown in the middle. */
  value: string;
  unit: string;
  label: string;
}) {
  const position = gaugePosition(mbps);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 340 200"
        aria-hidden
        focusable="false"
        className="w-full"
      >
        <path
          d={ARC}
          fill="none"
          stroke="var(--color-sea-100)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          data-gauge-arc=""
          d={ARC}
          pathLength={100}
          fill="none"
          stroke="var(--color-sea-600)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={100 - position * 100}
        />
        {TICKS.map((tick) => {
          const angle = Math.PI * (1 - gaugePosition(tick));
          // Rounded: Node and browsers can differ in the last digit of
          // trig results, which would break hydration.
          const x = Math.round((170 + Math.cos(angle) * 108) * 100) / 100;
          const y = Math.round((170 - Math.sin(angle) * 108) * 100) / 100;
          return (
            <text
              key={tick}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[11px] font-semibold tabular-nums"
            >
              {tick}
            </text>
          );
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
        <span className="text-display leading-none tabular-nums">{value}</span>
        <span className="mt-1 text-sm font-semibold text-muted-foreground">
          {unit} · {label}
        </span>
      </div>
    </div>
  );
}
