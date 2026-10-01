"use client";

import Link from "next/link";
import { useState } from "react";
import { projects } from "@/content/projects";
import { toolGroups, tools, type ToolGroup } from "@/content/tools";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";
import { ScreenshotFrame, Tags } from "./kit";

export function Toolbox() {
  const [group, setGroup] = useState<"All" | ToolGroup>("All");
  const [selected, setSelected] = useState("Next.js");

  const tool = tools.find((t) => t.name === selected)!;
  const usedIn = projects.filter((p) => tool.usedIn.includes(p.slug));
  // Tools that share a project with the selected tool get a vermilion dot.
  const related = new Set(tools.filter((t) => t.name !== selected && t.usedIn.some((s) => tool.usedIn.includes(s))).map((t) => t.name));
  const visibleGroups = group === "All" ? toolGroups : [group];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="toolbar" aria-label="Filter tools">
          {(["All", ...toolGroups] as const).map((g) => (
            <button key={g} type="button" onClick={() => setGroup(g)} aria-pressed={group === g} className={cn("chip", group === g && "chip-active")}>
              {g}
              {g === "All" && ` (${tools.length})`}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-7">
          {visibleGroups.map((g) => (
            <section key={g} aria-label={g}>
              <h2 className="label mb-3 flex items-center gap-3">
                {g}
                <span className="h-px flex-1 bg-hairline" />
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {tools
                  .filter((t) => t.group === g)
                  .map((t) => {
                    const isSel = t.name === selected;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelected(t.name)}
                        aria-pressed={isSel}
                        className={cn("press-interactive relative flex min-h-[72px] items-center gap-3 px-3 py-3 text-left", isSel && "press-selected")}
                      >
                        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded border font-mono text-[12px]", isSel ? "border-paper text-paper" : "border-hairline text-ink-soft")}>{t.mark}</span>
                        <span className="min-w-0 break-words font-mono text-[14px] leading-tight">{t.name}</span>
                        {related.has(t.name) && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-vermilion" aria-label="used in the same projects" />}
                      </button>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* "Where I used it" panel: sticky on desktop, follows the grid on phones */}
      <aside className="lg:sticky lg:top-10 lg:col-span-4 lg:self-start" aria-live="polite">
        <div className="press bg-paper-raised p-5">
          <p className="label">Where I used it</p>
          <p className="mt-2 font-serif text-[28px] text-ink">
            <span className="rounded bg-ink px-2 text-paper">{tool.name}</span>
          </p>
          {usedIn.length === 0 ? (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {tool.name === "C++" ? "My language for DSA practice. See the Coding Arena." : "Used in coursework and practice, not in a featured project yet."}
            </p>
          ) : (
            <ul className="mt-5 space-y-6">
              {usedIn.map((p) => (
                <li key={p.slug} className="animate-rise">
                  <ScreenshotFrame shot={p.cover ?? { caption: "screenshot" }} />
                  <h3 className="mt-3 font-serif text-[22px] text-ink">{p.title}</h3>
                  <p className="mt-1 text-[14px] leading-snug text-ink-soft">{p.summary}</p>
                  <Tags items={p.tags} className="mt-2" />
                  <Link href={p.caseStudy ? `/work/${p.slug}` : p.github} className="mt-2 inline-flex items-center gap-1 font-mono text-[12px] text-vermilion hover:underline">
                    {p.caseStudy ? "Case study" : "GitHub"} <ArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {tool.name === "C++" && (
            <Link href="/arena" className="mt-3 inline-flex items-center gap-1 font-mono text-[12px] text-vermilion hover:underline">
              Coding Arena <ArrowRight />
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
