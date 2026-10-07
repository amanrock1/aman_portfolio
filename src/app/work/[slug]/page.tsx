import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, type CaseStudySection } from "@/content/projects";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { ExternalLink, MarginNote, ScreenshotFrame, SectionLabel } from "@/components/kit";
import { SystemDesign } from "@/components/system-design/system-design";

// Every project has a page: case-study projects show their write-up, the rest show a short
// intro. All of them end with the interactive system design.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((c) => c.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

function Section({ section, index }: { section: CaseStudySection; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  switch (section.kind) {
    case "text":
      return (
        <section>
          <SectionLabel index={n}>{section.title}</SectionLabel>
          <p className="max-w-prose text-[17px] leading-relaxed text-ink">{section.body}</p>
        </section>
      );
    case "steps":
      return (
        <section>
          <SectionLabel index={n}>{section.title}</SectionLabel>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {section.steps.map((s, i) => (
              <li key={s.label} className="press relative flex flex-col p-4">
                <span className="font-mono text-[12px] text-vermilion">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 font-serif text-[20px] leading-tight text-ink">{s.label}</span>
                {s.detail && <span className="mt-1 text-[14px] leading-snug text-ink-soft">{s.detail}</span>}
              </li>
            ))}
          </ol>
        </section>
      );
    case "list":
      return (
        <section>
          <SectionLabel index={n}>{section.title}</SectionLabel>
          <ul className="flex flex-wrap gap-3">
            {section.items.map((item) => (
              <li key={item} className="press px-3 py-2 font-mono text-[13px]">
                {item}
              </li>
            ))}
          </ul>
        </section>
      );
    case "callout":
      return (
        <section>
          <SectionLabel index={n}>{section.title}</SectionLabel>
          <div className="max-w-prose rounded border border-dashed border-ink p-5">
            <p className="text-[17px] leading-relaxed text-ink">{section.body}</p>
          </div>
          {section.note && <MarginNote className="mt-3">{section.note}</MarginNote>}
        </section>
      );
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = projects.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();
  const p = projects[idx];
  const cs = p.caseStudy;
  const next = projects[(idx + 1) % projects.length];

  const meta = cs?.meta ?? p.tags.join(" · ");
  const headline = cs?.headline ?? p.title;
  const stack = cs?.stack ?? p.tags;
  // Projects without a case study yet show their cover, or a labelled placeholder.
  const shots = cs?.screenshots ?? [p.cover ?? { caption: "screenshot" }];

  return (
    <article>
      <Link href="/work" className="inline-flex items-center gap-2 font-mono text-[13px] text-ink-soft hover:text-vermilion">
        <ArrowLeft /> Work / {p.title}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: sticky problem column */}
        <header className="lg:sticky lg:top-10 lg:col-span-5 lg:self-start">
          <p className="font-mono text-[12px] text-ink-soft">{meta}</p>
          <h1 className="mt-3 font-serif text-[40px] leading-[1.05] tracking-tight text-ink sm:text-[56px]">{headline}</h1>
          {cs ? <p className="mt-4 font-serif text-[20px] text-ink-soft">{p.title}</p> : <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-ink-soft">{p.summary}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="press-interactive inline-flex h-11 items-center gap-2 bg-ink px-4 font-mono text-[13px] text-paper">
                <span className="h-2 w-2 rounded-full bg-[#7FD1B9]" /> Live demo
              </a>
            )}
            <a href={p.github} target="_blank" rel="noreferrer" className="press-interactive inline-flex h-11 items-center px-4 font-mono text-[13px]">
              GitHub
            </a>
            <a href="#system-design" className="press-interactive inline-flex h-11 items-center gap-2 px-4 font-mono text-[13px] text-vermilion">
              System design <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="mt-8">
            <p className="label mb-3">Built with</p>
            <ul className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s} className="rounded border border-hairline bg-paper-raised px-2 py-1 font-mono text-[12px] text-ink-soft">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Right: visuals + sections */}
        <div className="space-y-12 lg:col-span-7">
          <div className={shots.length > 1 ? "grid grid-cols-1 gap-8 sm:grid-cols-2" : ""}>
            {shots.map((s, i) => (
              <ScreenshotFrame key={s.caption} shot={s} priority={i === 0} tilt={i % 2 ? 1 : -1} />
            ))}
          </div>
          {cs?.sections.map((s, i) => (
            <Section key={s.title} section={s} index={i} />
          ))}
          <ExternalLink href={p.github}>Source on GitHub</ExternalLink>
        </div>
      </div>

      {/* Interactive system design: type something in, watch it travel through the architecture. */}
      <div className="mt-16">
        <SystemDesign slug={p.slug} />
      </div>

      <Link href={`/work/${next.slug}`} className="press-interactive mt-16 flex items-center justify-between p-5">
        <span>
          <span className="label">Next project</span>
          <span className="mt-1 block font-serif text-[26px] text-ink">{next.title}</span>
        </span>
        <ArrowRight />
      </Link>
    </article>
  );
}
