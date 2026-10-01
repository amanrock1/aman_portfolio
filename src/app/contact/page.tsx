import type { Metadata } from "next";
import { config } from "@/data/config";
import { ArrowUpRight, DownloadIcon } from "@/components/icons";
import { MarginNote, PageHeader } from "@/components/kit";
import { CopyEmail, LetterForm } from "@/components/contact";

export const metadata: Metadata = { title: "Contact" };

const links = [
  { label: "GitHub", sub: config.handles.github, href: config.social.github },
  { label: "LinkedIn", sub: "profile", href: config.social.linkedin },
  { label: "LeetCode", sub: config.handles.leetcode, href: config.social.leetcode },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="06 / Contact" title="Let's talk." />

      {/* Postcard: two halves split by a hairline on desktop */}
      <div className="press grid bg-paper-raised lg:grid-cols-2">
        <section className="p-6 sm:p-8 lg:border-r lg:border-hairline">
          <span className="stamp -rotate-2">
            <span className="h-2 w-2 rounded-full bg-signal" />
            {config.status}
          </span>
          <p className="mt-6 max-w-md font-serif text-[24px] leading-snug text-ink">I&apos;m looking for internships and entry-level roles in full-stack and AI/ML.</p>
          <div className="mt-6">
            <CopyEmail />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="press-interactive flex flex-col p-3">
                <span className="flex items-center justify-between font-serif text-[20px]">
                  {l.label} <ArrowUpRight />
                </span>
                <span className="font-mono text-[11px] text-ink-soft">{l.sub}</span>
              </a>
            ))}
            <a href={config.resume} className="press-interactive flex flex-col p-3">
              <span className="flex items-center justify-between font-serif text-[20px]">
                Resume <DownloadIcon />
              </span>
              <span className="font-mono text-[11px] text-ink-soft">PDF</span>
            </a>
          </div>
        </section>

        <section className="border-t border-hairline p-6 sm:p-8 lg:border-t-0">
          <MarginNote className="mb-4">write me a line</MarginNote>
          <LetterForm />
        </section>
      </div>
      <p className="mt-6 font-mono text-[12px] text-ink-faint">
        {config.name} · VIT Bhopal
      </p>
    </>
  );
}
