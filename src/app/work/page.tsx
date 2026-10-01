import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies, formatMonth, projects } from "@/content/projects";
import { ArrowRight } from "@/components/icons";
import { ExternalLink, MarginNote, PageHeader, ScreenshotFrame, Tags } from "@/components/kit";
import { ShipLog } from "@/components/ship-log";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  const others = projects.filter((p) => !p.caseStudy);

  return (
    <>
      <PageHeader eyebrow="02 / Work" title="Work" intro={`${projects.length} things I have built, newest first.`}>
        <MarginNote>start with these three</MarginNote>
      </PageHeader>

      <section aria-label="Case studies" className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {caseStudies.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="press-interactive group relative flex flex-col p-5">
            <span className="absolute -right-2 -top-3 rotate-3 rounded border border-dashed border-vermilion bg-paper px-2 py-0.5 font-mono text-[11px] text-vermilion">case study</span>
            <ScreenshotFrame shot={p.cover ?? p.caseStudy!.screenshots[0]} className="[&_.tape]:hidden" />
            <p className="mt-5 font-mono text-[12px] text-ink-faint">{formatMonth(p.date)}</p>
            <h2 className="mt-1 font-serif text-[28px] leading-tight text-ink group-hover:text-vermilion">{p.title}</h2>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{p.summary}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Tags items={p.tags} />
              <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[12px] text-vermilion">
                Read <ArrowRight />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section aria-label="More projects" className="mt-14">
        <h2 className="label mb-5">More projects</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {others.map((p) => (
            <article key={p.slug} className="press flex flex-col p-4">
              <p className="font-mono text-[12px] text-ink-faint">{formatMonth(p.date)}</p>
              <h3 className="mt-1 font-serif text-[22px] leading-tight text-ink">{p.title}</h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">{p.summary}</p>
              <Tags items={p.tags} className="mt-3" />
              <div className="mt-3 flex gap-4">
                {p.live && <ExternalLink href={p.live}>Live</ExternalLink>}
                <ExternalLink href={p.github}>GitHub</ExternalLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Ship log" className="mt-14 max-w-4xl">
        <h2 className="font-serif text-[32px] text-ink">Ship Log</h2>
        <p className="mb-5 mt-1 text-ink-soft">Everything, by date. Tap an entry to open it.</p>
        <ShipLog />
      </section>
    </>
  );
}
