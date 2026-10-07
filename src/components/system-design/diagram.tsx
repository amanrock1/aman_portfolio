"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ArchEdge, ArchNode, NodeKind, SystemDesign } from "@/content/system-design/types";
import { cn } from "@/lib/utils";

export type Move = { key: number; from: string | null; to: string; text: string };

type Props = {
  design: SystemDesign;
  compact: boolean;
  reduced: boolean;
  move: Move | null;
  activeId: string | null;
  /** node id -> index of the last step that touched it */
  visited: Record<string, number>;
  failed: string | null;
  /** edge keys ("from>to") the slip has travelled so far */
  traversed: Set<string>;
  activeEdge: string | null;
  selected: string | null;
  onSelect: (id: string) => void;
};

// Left accent strip per kind. Palette stays inside the site's tokens.
export const KIND_STYLE: Record<NodeKind, { label: string; strip: string }> = {
  client: { label: "Client", strip: "bg-ink" },
  service: { label: "Service", strip: "bg-signal" },
  ai: { label: "AI model", strip: "bg-vermilion" },
  data: { label: "Data store", strip: "bg-mustard" },
  external: { label: "External API", strip: "bg-ink-faint" },
  security: { label: "Security", strip: "bg-vermilion-dark" },
  logic: { label: "Logic", strip: "bg-ink-soft" },
};

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function edgeKey(e: Pick<ArchEdge, "from" | "to">) {
  return `${e.from}>${e.to}`;
}

export function Diagram({ design, compact, reduced, move, activeId, visited, failed, traversed, activeEdge, selected, onSelect }: Props) {
  // Phones transpose the grid (x = row, y = col) so a wide flow becomes a tall one.
  const cell = compact ? { w: 120, h: 112 } : { w: 188, h: 128 };
  const cols = compact ? design.layout.rows : design.layout.cols;
  const rows = compact ? design.layout.cols : design.layout.rows;
  const W = cols * cell.w;
  const H = rows * cell.h;
  const box = { w: cell.w - (compact ? 14 : 24), h: compact ? 78 : 84 };

  const centers = useMemo(() => {
    const m: Record<string, { x: number; y: number }> = {};
    for (const n of design.nodes) {
      const gx = compact ? n.row : n.col;
      const gy = compact ? n.col : n.row;
      m[n.id] = { x: gx * cell.w + cell.w / 2, y: gy * cell.h + cell.h / 2 };
    }
    return m;
  }, [design.nodes, compact, cell.w, cell.h]);

  // Hand-inked routes: cubic curves with a small deterministic wobble per edge.
  const geo = useMemo(() => {
    const out: Record<string, { d: string; mid: { x: number; y: number }; len: number; horizontal: boolean; twin: number }> = {};
    const has = new Set(design.edges.map(edgeKey));
    for (const e of design.edges) {
      const a = centers[e.from];
      const b = centers[e.to];
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const horizontal = Math.abs(dx) >= Math.abs(dy);
      const h = hash(edgeKey(e));
      const wob1 = ((h % 7) - 3) * 2;
      const wob2 = (((h >> 3) % 7) - 3) * 2;
      // Two routes between the same pair (e.g. a retry loop) are nudged apart.
      const twin = has.has(`${e.to}>${e.from}`) ? (e.from < e.to ? 9 : -9) : 0;
      let sx: number, sy: number, ex: number, ey: number, d: string;
      if (horizontal) {
        const s = Math.sign(dx) || 1;
        sx = a.x + s * (box.w / 2);
        ex = b.x - s * (box.w / 2);
        sy = a.y + twin;
        ey = b.y + twin;
        d = `M${sx},${sy} C${sx + (ex - sx) * 0.45},${sy + wob1} ${ex - (ex - sx) * 0.45},${ey + wob2} ${ex},${ey}`;
      } else {
        const s = Math.sign(dy) || 1;
        sy = a.y + s * (box.h / 2);
        ey = b.y - s * (box.h / 2);
        sx = a.x + twin;
        ex = b.x + twin;
        d = `M${sx},${sy} C${sx + wob1},${sy + (ey - sy) * 0.45} ${ex + wob2},${ey - (ey - sy) * 0.45} ${ex},${ey}`;
      }
      out[edgeKey(e)] = { d, mid: { x: (sx + ex) / 2, y: (sy + ey) / 2 }, len: Math.hypot(ex - sx, ey - sy), horizontal, twin };
    }
    return out;
  }, [design.edges, centers, box.w, box.h]);

  // ---- the travelling paper slip ----
  const slipRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});

  useEffect(() => {
    const slip = slipRef.current;
    if (!slip || !move) return;
    const to = centers[move.to];
    if (!to) return;
    slip.textContent = move.text;
    slip.style.opacity = "1";
    // Keep the whole slip inside the frame (it is about 150px wide).
    const half = compact ? 66 : 78;
    const place = (x: number, y: number) => {
      const cx = Math.min(Math.max(x, half), W - half);
      slip.style.left = `${(cx / W) * 100}%`;
      slip.style.top = `${(y / H) * 100}%`;
    };
    // Where the slip rests once it arrives: just below the station, so the label stays readable.
    const rest = { x: to.x, y: to.y + box.h / 2 + 3 };
    slip.style.transition = "none";
    const from = move.from ? centers[move.from] : null;
    if (reduced || !from) {
      place(rest.x, rest.y);
      return;
    }
    const path = pathRefs.current[`${move.from}>${move.to}`];
    const length = path ? path.getTotalLength() : 0;
    const end = path && length ? path.getPointAtLength(length) : { x: to.x, y: to.y };
    const t0 = performance.now();
    const travel = 650;
    const settle = 220;
    let raf = 0;
    // One loop: ride the route, then drift to the resting spot under the station.
    const tick = (now: number) => {
      const el = now - t0;
      if (el < travel) {
        const t = el / travel;
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        if (path && length) {
          const p = path.getPointAtLength(e * length);
          place(p.x, p.y);
        } else {
          place(from.x + (to.x - from.x) * e, from.y + (to.y - from.y) * e);
        }
      } else {
        const k = Math.min(1, (el - travel) / settle);
        place(end.x + (rest.x - end.x) * k, end.y + (rest.y - end.y) * k);
      }
      if (el < travel + settle) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // The move key identifies one hop; geometry only changes on resize (a new move follows).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [move?.key]);

  const nodeById = (id: string) => design.nodes.find((n) => n.id === id);

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded border border-ink bg-paper-raised shadow-press"
      style={{
        aspectRatio: `${W} / ${H}`,
        maxWidth: compact ? undefined : `${Math.round(W * 1.12)}px`,
        backgroundImage: "radial-gradient(rgb(var(--hairline)) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {[
            ["faint", "rgb(var(--ink-faint))"],
            ["ink", "rgb(var(--ink))"],
            ["verm", "rgb(var(--vermilion))"],
          ].map(([id, color]) => (
            <marker key={id} id={`sd-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1,1 L9,5 L1,9" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          ))}
        </defs>
        {design.edges.map((e) => {
          const k = edgeKey(e);
          const g = geo[k];
          if (!g) return null;
          const isActive = activeEdge === k;
          const isDone = traversed.has(k);
          const err = e.kind === "error";
          const color = isActive || (isDone && err) ? "rgb(var(--vermilion))" : isDone ? "rgb(var(--ink))" : err ? "rgb(var(--vermilion) / 0.55)" : "rgb(var(--ink-faint))";
          const marker = isActive || (isDone && err) ? "verm" : isDone ? "ink" : "faint";
          return (
            <g key={k}>
              <path
                ref={(el) => {
                  pathRefs.current[k] = el;
                }}
                d={g.d}
                fill="none"
                stroke={color}
                strokeWidth={isActive ? 3 : isDone ? 2.2 : 1.6}
                strokeDasharray={e.kind === "branch" || err ? "6 5" : undefined}
                strokeLinecap="round"
                markerEnd={`url(#sd-arrow-${marker})`}
                style={{ transition: "stroke 200ms, stroke-width 200ms" }}
              />
              {e.label && !compact && g.len >= (g.horizontal ? 90 : 38) && (
                <text
                  x={g.horizontal ? g.mid.x : g.mid.x + (g.twin > 0 ? 10 : g.twin < 0 ? -10 : 0)}
                  y={g.horizontal ? g.mid.y - 7 + (g.twin > 0 ? 16 : 0) : g.mid.y + 3}
                  textAnchor={g.horizontal ? "middle" : g.twin > 0 ? "start" : g.twin < 0 ? "end" : "middle"}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="rgb(var(--ink-soft))"
                  stroke="rgb(var(--paper-raised))"
                  strokeWidth="4"
                  paintOrder="stroke"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {design.nodes.map((n: ArchNode) => {
        const c = centers[n.id];
        const isActive = activeId === n.id;
        const isFailed = failed === n.id;
        const seen = visited[n.id] !== undefined;
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n.id)}
            aria-label={`${n.label}: ${n.blurb}`}
            aria-pressed={selected === n.id}
            className={cn(
              "press absolute z-10 flex flex-col justify-center overflow-hidden text-left transition-[transform,box-shadow,background-color,border-color] duration-150",
              compact ? "py-1.5 pl-3.5 pr-2" : "py-2 pl-4 pr-3",
              "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-press-sm",
              isActive && "translate-x-[2px] translate-y-[2px] border-vermilion bg-vermilion/10 shadow-press-in",
              isFailed && "border-vermilion-dark bg-vermilion/20",
              selected === n.id && "ring-2 ring-ink/40 ring-offset-1 ring-offset-paper-raised",
            )}
            style={{
              left: `${((c.x - box.w / 2) / W) * 100}%`,
              top: `${((c.y - box.h / 2) / H) * 100}%`,
              width: `${(box.w / W) * 100}%`,
              height: `${(box.h / H) * 100}%`,
            }}
          >
            <span className={cn("absolute inset-y-0 left-0 w-1.5", KIND_STYLE[n.kind].strip, n.kind === "external" && "opacity-70")} aria-hidden="true" />
            <span className={cn("font-serif leading-[1.1] text-ink", compact ? "text-[13px] break-words" : "text-[16px]")}>{n.label}</span>
            {n.sub && <span className={cn("mt-0.5 truncate font-mono text-ink-soft", compact ? "text-[9px]" : "text-[10px]")}>{n.sub}</span>}
            {seen && (
              <span
                className={cn(
                  "absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 font-mono text-[10px] leading-none",
                  isFailed ? "bg-vermilion-dark text-paper" : "bg-ink text-paper",
                )}
                aria-hidden="true"
              >
                {isFailed ? "!" : visited[n.id] + 1}
              </span>
            )}
          </button>
        );
      })}

      {/* The paper slip that carries the payload from station to station. */}
      <div
        ref={slipRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-20 max-w-[150px] -translate-x-1/2 -translate-y-1/2 -rotate-3 truncate rounded border border-ink bg-paper px-2 py-1 font-mono text-[10px] text-ink opacity-0 shadow-press-sm"
      />
      <span className="sr-only">{nodeById(activeId ?? "")?.label}</span>
    </div>
  );
}
