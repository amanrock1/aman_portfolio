import type { HeatmapDay } from "@/lib/stats";

const RAMP = ["#ECE6DA", "#F6DCD4", "#EDB3A4", "#E08A74", "#C8452B"];

/** 53-week calendar heatmap (Sunday-first columns) ending today, vermilion intensity. */
export function Heatmap({ days, label }: { days: HeatmapDay[]; label: string }) {
  const counts = new Map(days.map((d) => [d.date, d.count]));
  const max = Math.max(1, ...days.map((d) => d.count));
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - 7 * 52 - end.getUTCDay());

  const cells: { x: number; y: number; level: number; date: string; count: number }[] = [];
  for (let d = new Date(start), i = 0; d <= end; d.setUTCDate(d.getUTCDate() + 1), i++) {
    const date = d.toISOString().slice(0, 10);
    const count = counts.get(date) ?? 0;
    const level = count === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4));
    cells.push({ x: Math.floor(i / 7), y: i % 7, level, date, count });
  }
  const cols = Math.max(...cells.map((c) => c.x)) + 1;
  const size = 11;
  const gap = 3;

  return (
    <figure>
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <svg width={cols * (size + gap)} height={7 * (size + gap)} role="img" aria-label={label} className="block">
          {cells.map((c) => (
            <rect key={c.date} x={c.x * (size + gap)} y={c.y * (size + gap)} width={size} height={size} rx={2} fill={RAMP[c.level]}>
              <title>{`${c.date}: ${c.count}`}</title>
            </rect>
          ))}
        </svg>
      </div>
      <figcaption className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-faint">
        <span>{label}</span>
        <span className="flex items-center gap-1">
          less
          {RAMP.map((c) => (
            <span key={c} className="inline-block h-[10px] w-[10px] rounded-sm" style={{ background: c }} />
          ))}
          more
        </span>
      </figcaption>
    </figure>
  );
}

/** Horizontal labelled bars. */
export function Bars({ items, accentFirst = false }: { items: { name: string; count: number }[]; accentFirst?: boolean }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={it.name}>
          <div className="flex justify-between font-mono text-[12px] text-ink">
            <span>{it.name}</span>
            <span className="tabular-nums">{it.count}</span>
          </div>
          <div className="mt-1 h-2 rounded-sm border border-hairline bg-paper">
            <div className={accentFirst && i === 0 ? "h-full bg-vermilion" : "h-full bg-ink"} style={{ width: `${(it.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Easy / medium / hard segmented bar. */
export function SegmentBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = Math.max(1, parts.reduce((s, p) => s + p.value, 0));
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-sm border border-ink">
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[12px]">
        {parts.map((p) => (
          <span key={p.label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
            {p.label} <b className="font-medium tabular-nums">{p.value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Contest rating line chart. Every point is labelled with its real rating. */
export function RatingLine({ points }: { points: { contest: string; rating: number }[] }) {
  if (points.length === 0) return <p className="font-mono text-[12px] text-ink-faint">No rated contests yet.</p>;
  const W = 520;
  const H = 220;
  const pad = { l: 40, r: 24, t: 24, b: 32 };
  const ratings = points.map((p) => p.rating);
  const lo = Math.floor((Math.min(...ratings) - 100) / 250) * 250;
  const hi = Math.ceil((Math.max(...ratings) + 100) / 250) * 250;
  const x = (i: number) => pad.l + (points.length === 1 ? (W - pad.l - pad.r) / 2 : (i / (points.length - 1)) * (W - pad.l - pad.r));
  const y = (r: number) => pad.t + (1 - (r - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const ticks: number[] = [];
  for (let t = lo; t <= hi; t += 250) ticks.push(t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Contest rating: ${ratings.join(", ")}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#D9D1C2" strokeDasharray="3 4" />
          <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-faint font-mono text-[10px]">
            {t}
          </text>
        </g>
      ))}
      <polyline fill="none" stroke="#C8452B" strokeWidth={2} points={points.map((p, i) => `${x(i)},${y(p.rating)}`).join(" ")} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.rating)} r={5} fill="#FBF8F2" stroke="#C8452B" strokeWidth={2}>
            <title>{`${p.contest}: ${p.rating}`}</title>
          </circle>
          <text x={x(i)} y={y(p.rating) - 12} textAnchor="middle" className="fill-ink font-mono text-[11px]">
            {p.rating}
          </text>
          <text x={x(i)} y={H - 10} textAnchor="middle" className="fill-ink-faint font-mono text-[10px]">
            c{i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
