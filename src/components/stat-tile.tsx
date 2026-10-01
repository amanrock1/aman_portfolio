import Link from "next/link";
import { cn } from "@/lib/utils";

/** Letterpress number tile. `value === null` renders an honest "unavailable". */
export function StatTile({ label, value, unit, href, className }: { label: string; value: number | string | null; unit?: string; href?: string; className?: string }) {
  const body = (
    <>
      <span className="label break-words">{label}</span>
      {/* Wraps: the unit drops below the number when the tile is narrow (3-up on phones). */}
      <span className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        {value === null ? (
          <span className="font-mono text-[13px] text-ink-faint">unavailable</span>
        ) : (
          <>
            <span className="font-serif text-[28px] leading-none tabular-nums text-ink sm:text-[34px]">{typeof value === "number" ? value.toLocaleString("en-US") : value}</span>
            {unit && <span className="break-words font-mono text-[11px] text-ink-soft sm:text-[12px]">{unit}</span>}
          </>
        )}
      </span>
    </>
  );
  const cls = cn("flex min-w-0 flex-col p-3 sm:p-4", href ? "press-interactive" : "press", className);
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
