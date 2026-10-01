import type { Metadata } from "next";
import Link from "next/link";
import { config } from "@/data/config";
import { education, intro } from "@/content/about";
import { tools } from "@/content/tools";
import { ArrowRight, DownloadIcon } from "@/components/icons";
import { Certificates } from "@/components/certificates";
import { Hackathons } from "@/components/hackathons";
import { ExternalLink, MarginNote, PageHeader } from "@/components/kit";

export const metadata: Metadata = { title: "About" };

const featuredTools = ["C++", "Python", "TypeScript", "React", "Next.js", "Node.js", "Supabase", "Gemini API"];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="05 / About" title="About" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Intro */}
        <section className="press relative grid grid-cols-1 gap-6 p-6 sm:grid-cols-[180px_1fr] lg:col-span-8">
          <span className="tape" />
          <div>
            <div className="hatch grid aspect-[4/5] place-items-center rounded border border-ink">
              <span className="rounded border border-hairline bg-paper-raised px-2 py-0.5 font-mono text-[12px] text-ink-soft">[ photo ]</span>
            </div>
            <MarginNote className="mt-2 text-[15px]" arrow={false}>
              hello, that&apos;s me
            </MarginNote>
          </div>
          <div className="flex flex-col">
            <p className="font-serif text-[22px] leading-snug text-ink sm:text-[26px]">{intro}</p>
            <a href={config.resume} className="press-interactive mt-6 inline-flex h-11 w-fit items-center gap-2 bg-ink px-4 font-mono text-[13px] text-paper">
              Resume <DownloadIcon />
            </a>
          </div>
        </section>

        {/* Education index card */}
        <section className="press flex flex-col p-6 lg:col-span-4">
          <p className="label">Education</p>
          <p className="mt-4 font-mono text-[12px] text-vermilion">{education.period}</p>
          <h2 className="mt-1 font-serif text-[26px] leading-tight text-ink">{education.degree}</h2>
          <p className="mt-1 text-ink-soft">{education.school}</p>
          <p className="mt-auto pt-6 font-mono text-[13px] text-ink">{education.grade}</p>
        </section>

        {/* Hackathons as stamped tickets; the participated ones are behind Show more */}
        <section className="press p-6 lg:col-span-6">
          <p className="label mb-4">Hackathons</p>
          <Hackathons />
        </section>

        {/* Toolbox teaser */}
        <section className="press flex flex-col p-6 lg:col-span-6">
          <p className="label mb-4">Toolbox</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {featuredTools.map((name) => {
              const t = tools.find((x) => x.name === name)!;
              return (
                <span key={name} className="flex items-center gap-2 rounded border border-ink bg-paper-raised px-2 py-2 font-mono text-[12px] shadow-press-sm">
                  <span className="text-ink-faint">{t.mark}</span>
                  {name}
                </span>
              );
            })}
          </div>
          <Link href="/toolbox" className="mt-auto inline-flex items-center gap-1 pt-5 font-mono text-[13px] text-vermilion hover:underline">
            Open the toolbox: every tool linked to a project <ArrowRight />
          </Link>
        </section>

        {/* Certifications as stickers; tap one to open the certificate */}
        <section className="press p-6 lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="label">Certifications</p>
            <span className="font-mono text-[11px] text-ink-faint">tap one to view it</span>
          </div>
          <Certificates />
        </section>

        {/* Practice */}
        <section className="press flex flex-col gap-3 p-6 lg:col-span-4">
          <p className="label">Practice</p>
          <ExternalLink href={config.social.leetcode}>LeetCode</ExternalLink>
          <ExternalLink href={config.social.codeforces}>Codeforces</ExternalLink>
          <ExternalLink href={config.social.codechef}>CodeChef</ExternalLink>
          <Link href="/arena" className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[13px] text-vermilion hover:underline">
            See the Coding Arena <ArrowRight />
          </Link>
        </section>
      </div>
    </>
  );
}
