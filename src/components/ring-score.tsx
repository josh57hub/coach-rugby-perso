export function RingScore({
  value,
  label,
  sub,
  size = 156,
}: {
  value: number;
  label: string;
  sub?: string;
  size?: number;
}) {
  const r = (size - 18) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  const color =
    pct >= 75 ? "var(--chart-5)" : pct >= 50 ? "var(--chart-4)" : "var(--chart-1)";
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth={10}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-black tabular-nums">{pct}</span>
          {sub && (
            <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {sub}
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
