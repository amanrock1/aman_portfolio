import type { Metadata } from "next";
import Link from "next/link";
import { config } from "@/data/config";
import { education, hackathons, participatedHackathons, intro } from "@/content/about";
import { tools } from "@/content/tools";
import { ArrowRight, ArrowUpRight, DownloadIcon } from "@/components/icons";
import { Certificates } from "@/components/certificates";
import { Hackathons } from "@/components/hackathons";
import { MarginNote } from "@/components/kit";

export const metadata: Metadata = { title: "About" };

const featuredTools = ["C++", "Python", "TypeScript", "React", "Next.js", "Node.js", "Supabase", "Gemini API"];

export default function AboutPage() {
  const records = hackathons.length + participatedHackathons.length;
  const practice = [
    { name: "LeetCode", sub: "Algorithms & DSA", href: config.social.leetcode },
    { name: "Codeforces", sub: "Contests & rating", href: config.social.codeforces },
    { name: "CodeChef", sub: "Contests & rating", href: config.social.codechef },
  ];
  return (
    <>
      <header className="mb-8 border-b border-ink pb-6 lg:mb-10">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-vermilion">
            05 / About // Profile &amp; background
          </p>
          <span className="stamp hidden sm:inline-flex">Profile</span>
        </div>
        <h1 className="mt-3 font-serif text-[48px] leading-none tracking-tight text-ink sm:text-[64px]">About</h1>
        <p className="mt-3 font-serif text-[19px] italic text-ink-soft">
          {config.tagline} {config.education}.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Intro: photo frame + biographical note */}
        <section className="press relative grid grid-cols-1 gap-6 bg-paper-raised p-6 sm:grid-cols-[200px_1fr] lg:col-span-8">
          <span className="tape" />
          <div>
            <div className="hatch relative grid aspect-[4/5] place-items-center border border-ink p-3">
              <div className="absolute inset-3 border border-dashed border-ink/40" />
              <span className="relative rounded border border-hairline bg-paper-raised px-2 py-0.5 font-mono text-[12px] text-ink-soft">[ photo ]</span>
            </div>
            <MarginNote className="mt-3 text-[15px]">hello, that&apos;s me</MarginNote>
          </div>
          <div className="flex min-w-0 flex-col items-start">
            <span className="inline-flex items-center gap-2 border border-hairline bg-paper px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
              <span className="h-2 w-2 bg-vermilion" /> Biographical note
            </span>
            <p className="mt-4 text-[19px] leading-relaxed text-ink sm:text-[21px]">{intro}</p>
            <a href={config.resume} className="press-interactive mt-auto inline-flex h-11 items-center gap-2 bg-ink px-4 font-mono text-[13px] uppercase tracking-[0.08em] text-paper">
              Resume <DownloadIcon />
            </a>
          </div>
        </section>

        {/* Education */}
        <section className="press relative flex flex-col bg-paper-raised p-6 lg:col-span-4">
          <span className="tape left-[70%]" />
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="flex items-center gap-2 font-serif text-[22px] text-ink">
              <span className="h-2.5 w-2.5 bg-vermilion" /> Education
            </h2>
            <span className="rounded border border-vermilion px-2 py-0.5 font-mono text-[11px] uppercase text-vermilion">Current</span>
          </div>
          <h3 className="mt-5 font-serif text-[26px] leading-tight text-ink">{education.school}</h3>
          <p className="mt-2 text-[15px] text-ink-soft">{education.degree}</p>
          <p className="mt-4 rounded border border-hairline bg-paper px-3 py-2 font-mono text-[12px] text-ink-soft">{education.period}</p>
          <div className="mt-auto pt-6">
            <div className="border-2 border-dashed border-ink p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">Academic standing</p>
              <p className="mt-2 font-mono text-[18px] text-ink">{education.grade}</p>
            </div>
          </div>
        </section>

        {/* Hackathons */}
        <section className="press bg-paper-raised p-6 lg:col-span-5">
          <div className="mb-4 flex items-baseline justify-between border-b border-hairline pb-3">
            <h2 className="font-serif text-[22px] text-ink">Hackathons</h2>
            <span className="font-mono text-[12px] text-ink-soft">{records} records</span>
          </div>
          <Hackathons />
        </section>

        {/* Certifications: unchanged, stickers that open the certificate */}
        <section className="press p-6 lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="label">Certifications</p>
            <span className="font-mono text-[11px] text-ink-faint">tap one to view it</span>
          </div>
          <Certificates />
        </section>

        {/* Toolbox */}
        <section className="press flex flex-col bg-paper-raised p-6 lg:col-span-6">
          <div className="mb-4 flex items-baseline justify-between border-b border-hairline pb-3">
            <h2 className="font-serif text-[22px] text-ink">Core Toolbox</h2>
            <span className="font-mono text-[12px] text-ink-soft">{featuredTools.length} primary stack</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredTools.map((name) => {
              const t = tools.find((x) => x.name === name)!;
              return (
                <span key={name} title={t.mark} className="flex min-w-0 items-center justify-center border-2 border-ink bg-paper-raised px-2 py-3 text-center font-mono text-[12px] shadow-press-sm">
                  {name}
                </span>
              );
            })}
          </div>
          <Link href="/toolbox" className="mt-auto inline-flex items-center gap-1 self-end pt-5 font-mono text-[13px] text-vermilion hover:underline">
            Open the toolbox <ArrowUpRight />
          </Link>
        </section>

        {/* Competitive practice */}
        <section className="press flex flex-col bg-paper-raised p-6 lg:col-span-6">
          <div className="mb-4 flex items-baseline justify-between border-b border-hairline pb-3">
            <h2 className="font-serif text-[22px] text-ink">Competitive Practice</h2>
            <span className="font-mono text-[12px] text-ink-soft">Live profiles</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {practice.map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="press-interactive flex min-w-0 flex-col p-3">
                <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
                  Platform <ArrowUpRight />
                </span>
                <span className="mt-3 font-serif text-[20px] text-ink">{p.name}</span>
                <span className="font-mono text-[11px] text-ink-soft">{p.sub}</span>
              </a>
            ))}
          </div>
          <Link href="/arena" className="mt-auto inline-flex items-center gap-1 self-end pt-5 font-mono text-[13px] text-vermilion hover:underline">
            See the Coding Arena <ArrowRight />
          </Link>
        </section>
      </div>
    </>
  );
}
