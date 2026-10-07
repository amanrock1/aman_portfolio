"use client";

import Link from "next/link";
import { useState } from "react";
import { formatMonth, shipLog, type Category } from "@/content/projects";
import { cn } from "@/lib/utils";
import { ExternalLink, ScreenshotFrame, Tags } from "./kit";
import { ArrowRight, MinusIcon, PlusIcon } from "./icons";

const filters: ("All" | Category)[] = ["All", "Full-stack", "AI", "3D", "Game", "Hackathon"];

/** Dated feed of shipped work: filterable, entries expand in place. */
export function ShipLog({ limit, compact = false }: { limit?: number; compact?: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);

  const entries = shipLog.filter((p) => filter === "All" || p.categories.includes(filter)).slice(0, limit);

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="toolbar" aria-label="Filter projects">
        {filters.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={cn("chip", filter === f && "chip-active")}>
            {f}
          </button>
        ))}
      </div>

      <ol className="mt-4">
        {entries.map((p) => {
          const isOpen = open === p.slug;
          return (
            <li key={p.slug} className="border-b border-hairline">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.slug)}
                aria-expanded={isOpen}
                className="group flex w-full items-start gap-4 py-4 text-left"
              >
                {!compact && <span className="w-[72px] shrink-0 pt-1 font-mono text-[12px] text-ink-faint">{formatMonth(p.date)}</span>}
                <span className="min-w-0 flex-1">
                  {compact && <span className="block font-mono text-[11px] text-ink-faint">{formatMonth(p.date)}</span>}
                  <span className={cn("block font-serif text-[22px] leading-tight transition-colors group-hover:text-vermilion", isOpen ? "text-vermilion" : "text-ink")}>{p.title}</span>
                  {!compact && <span className="mt-1 block text-[15px] leading-relaxed text-ink-soft">{p.summary}</span>}
                  <Tags items={p.tags} className="mt-2" />
                </span>
                <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded border border-hairline text-ink-soft group-hover:border-ink group-hover:text-ink">
                  {isOpen ? <MinusIcon /> : <PlusIcon />}
                </span>
              </button>

              {isOpen && (
                <div className={cn("animate-rise pb-6", !compact && "sm:pl-[88px]")}>
                  {compact && <p className="mb-4 text-[15px] leading-relaxed text-ink-soft">{p.summary}</p>}
                  <ScreenshotFrame shot={p.cover ?? { caption: "screenshot" }} className="max-w-xl" />
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link href={`/work/${p.slug}`} className="inline-flex items-center gap-1 font-mono text-[13px] text-vermilion hover:underline">
                      {p.caseStudy ? "Read case study" : "System design"} <ArrowRight />
                    </Link>
                    {p.live && <ExternalLink href={p.live}>Live</ExternalLink>}
                    <ExternalLink href={p.github}>GitHub</ExternalLink>
                    {p.event && <span className="font-mono text-[12px] text-signal">{p.event}</span>}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
