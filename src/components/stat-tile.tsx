import Link from "next/link";
import { cn } from "@/lib/utils";

/** Letterpress number tile. `value === null` renders an honest "unavailable". */
export function StatTile({ label, value, unit, href, className }: { label: string; value: number | string | null; unit?: string; href?: string; className?: string }) {
  const body = (
    <>
      <span className="label">{label}</span>
      <span className="mt-2 flex items-baseline gap-2">
        {value === null ? (
          <span className="font-mono text-[13px] text-ink-faint">unavailable</span>
        ) : (
          <>
            <span className="font-serif text-[34px] leading-none tabular-nums text-ink">{typeof value === "number" ? value.toLocaleString("en-US") : value}</span>
            {unit && <span className="font-mono text-[12px] text-ink-soft">{unit}</span>}
          </>
        )}
      </span>
    </>
  );
  const cls = cn("flex flex-col p-4", href ? "press-interactive" : "press", className);
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
