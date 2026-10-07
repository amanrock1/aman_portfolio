import type { Metadata } from "next";
import { config } from "@/data/config";
import { ArrowUpRight, DownloadIcon } from "@/components/icons";
import { MarginNote } from "@/components/kit";
import { InboxCard, LetterForm } from "@/components/contact";

export const metadata: Metadata = { title: "Contact" };

const profiles = [
  { n: "01", label: config.handles.github, sub: "GitHub", href: config.social.github, download: false },
  { n: "02", label: "LinkedIn", sub: "Profile", href: config.social.linkedin, download: false },
  { n: "03", label: config.handles.leetcode, sub: "Algorithms", href: config.social.leetcode, download: false },
  { n: "04", label: "Download PDF", sub: "Resume", href: config.resume, download: true },
];

export default function ContactPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-ink-soft">
          <span className="text-vermilion">06</span> / <span className="text-ink">Contact</span> // Dispatch
        </p>
        <span className="stamp hidden sm:inline-flex">
          <span className="h-2 w-2 rounded-full bg-vermilion" />
          VIT Bhopal
        </span>
      </div>

      {/* The letter: airmail edge, taped to the page, two halves split by a dashed fold */}
      <div className="relative mt-10">
        <span className="tape left-[12%] top-[-14px] translate-x-0" />
        <span className="tape left-auto right-[10%] top-[-14px] translate-x-0 rotate-1" />
        <div className="press bg-paper-raised p-5 sm:p-8">
          <div
            aria-hidden="true"
            className="h-[6px] w-full"
            style={{ backgroundImage: "repeating-linear-gradient(115deg, rgb(var(--vermilion)) 0 18px, transparent 18px 28px, rgb(var(--ink)) 28px 46px, transparent 46px 56px)" }}
          />

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_auto_1fr] lg:gap-8">
            {/* Left: who and where */}
            <section className="min-w-0">
              <div className="flex items-start justify-between gap-4">
                <p className="pt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-soft">Official correspondence</p>
                <div className="shrink-0 -rotate-2 border-2 border-dashed border-vermilion p-3 text-right font-mono text-[11px] uppercase leading-relaxed text-vermilion">
                  <p className="font-semibold">Postage</p>
                  <p className="text-ink-soft">Open to internships &amp; jobs</p>
                  <p className="mt-1 text-ink-soft">VIT Bhopal</p>
                </div>
              </div>

              <h1 className="mt-6 font-serif text-[44px] leading-none tracking-tight text-ink sm:text-[56px]">
                Let&apos;s talk<span className="text-vermilion">.</span>
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft">
                I&apos;m looking for internships and entry-level roles in full-stack and AI/ML. Whether you want to discuss an opportunity or a project, send me a note.
              </p>

              <MarginNote className="mt-6">reach me directly here</MarginNote>
              <div className="mt-3">
                <InboxCard />
              </div>

              <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-soft">Profiles &amp; dossier</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {profiles.map((p) => (
                  <a
                    key={p.n}
                    href={p.href}
                    target={p.download ? undefined : "_blank"}
                    rel="noreferrer"
                    {...(p.download ? { download: true } : {})}
                    className="press-interactive flex min-w-0 flex-col p-4"
                  >
                    <span className="flex items-center justify-between font-mono text-[11px] text-ink-faint">
                      {p.n}
                      {p.download ? <DownloadIcon /> : <ArrowUpRight />}
                    </span>
                    <span className="mt-4 truncate font-mono text-[15px] text-ink">{p.label}</span>
                    <span className="text-[13px] text-ink-soft">{p.sub}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* Fold line */}
            <div aria-hidden="true" className="hidden border-l border-dashed border-hairline lg:block" />

            {/* Right: the note */}
            <section className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-baseline gap-x-4 border-b border-hairline pb-3">
                <h2 className="font-serif text-[30px] leading-none text-ink">Write a note</h2>
                <span className="note">write me a line</span>
              </div>
              <div className="mt-6">
                <LetterForm />
              </div>
              <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-dashed border-hairline pt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                <span>Dispatch post // VIT Bhopal</span>
                <span className="normal-case text-ink">{config.name}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
