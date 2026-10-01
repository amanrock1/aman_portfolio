import Image from "next/image";
import type { Screenshot } from "@/content/projects";
import { cn } from "@/lib/utils";
import { ScribbleArrow } from "./icons";

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-hairline pb-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-vermilion">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-[40px] leading-[1.05] tracking-tight text-ink sm:text-[52px]">{title}</h1>
        {intro && <p className="mt-3 max-w-prose text-ink-soft">{intro}</p>}
      </div>
      {children}
    </header>
  );
}

export function SectionLabel({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.08em] text-vermilion">
      {index && <span>{index} / </span>}
      {children}
    </p>
  );
}

export function Tags({ items, className }: { items: string[]; className?: string }) {
  return <p className={cn("font-mono text-[12px] text-ink-soft", className)}>{items.join(" / ")}</p>;
}

export function MarginNote({ children, className, arrow = true }: { children: React.ReactNode; className?: string; arrow?: boolean }) {
  return (
    <p className={cn("note inline-flex items-center gap-2", className)}>
      {children}
      {arrow && <ScribbleArrow className="shrink-0" />}
    </p>
  );
}

/** Real screenshot in a taped frame, or a clearly labelled hatched placeholder. */
export function ScreenshotFrame({ shot, className, priority, tilt = 0 }: { shot: Screenshot; className?: string; priority?: boolean; tilt?: number }) {
  return (
    <figure className={cn("relative", className)} style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}>
      <span className="tape" />
      <div className="overflow-hidden rounded border border-ink bg-paper-raised shadow-press">
        {shot.src ? (
          <Image src={shot.src} alt={shot.caption} width={1400} height={900} priority={priority} className="aspect-[16/10] h-auto w-full object-cover object-top" />
        ) : (
          <div className="hatch grid aspect-[16/10] place-items-center">
            <span className="rounded border border-hairline bg-paper-raised px-3 py-1 font-mono text-[12px] text-ink-soft">[ {shot.caption} ]</span>
          </div>
        )}
      </div>
      {shot.src && <figcaption className="mt-2 font-mono text-[11px] text-ink-faint">{shot.caption}</figcaption>}
    </figure>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn("inline-flex items-center gap-1 font-mono text-[13px] text-ink underline decoration-hairline underline-offset-4 hover:text-vermilion hover:decoration-vermilion", className)}>
      {children}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </a>
  );
}
