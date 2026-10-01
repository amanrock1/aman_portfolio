import Link from "next/link";
import { config } from "@/data/config";
import { caseStudies, formatMonth } from "@/content/projects";
import { getCodeforces, getGitHub, getLeetCode } from "@/lib/stats";
import { ArenaIcon, ArrowRight, DownloadIcon, ToolboxIcon, WorkIcon } from "@/components/icons";
import { MarginNote, ScreenshotFrame, Tags } from "@/components/kit";
import { ShipLog } from "@/components/ship-log";
import { StatTile } from "@/components/stat-tile";

export const revalidate = 21600;

const quickLinks = [
  { href: "/work", label: "Work", caption: "seven projects", Icon: WorkIcon },
  { href: "/arena", label: "Arena", caption: "live coding stats", Icon: ArenaIcon },
  { href: "/toolbox", label: "Toolbox", caption: "tools + proof", Icon: ToolboxIcon },
];

const tilts = [-2, 1.5, -1];

export default async function HomePage() {
  const [leetcode, codeforces, github] = await Promise.all([getLeetCode(), getCodeforces(), getGitHub()]);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
      {/* Zone 1: who */}
      <section className="lg:col-span-5">
        <span className="stamp">
          <span className="h-2 w-2 rounded-full bg-signal" />
          {config.status}
        </span>
        <h1 className="mt-6 font-serif text-[52px] leading-[0.95] tracking-tight text-ink sm:text-[72px] xl:text-[88px]">{config.name}</h1>
        <p className="mt-6 max-w-md font-serif text-[22px] leading-snug text-ink sm:text-[26px]">{config.tagline}</p>
        <p className="mt-3 font-mono text-[13px] text-ink-soft">{config.education}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={config.resume} className="press-interactive inline-flex h-12 items-center gap-2 bg-ink px-5 font-mono text-[14px] text-paper">
            Resume <DownloadIcon />
          </a>
          <a href={config.social.github} target="_blank" rel="noreferrer" className="press-interactive inline-flex h-12 items-center gap-2 px-5 font-mono text-[14px]">
            GitHub
          </a>
        </div>

        <MarginNote className="mt-10 hidden lg:inline-flex">start with the latest</MarginNote>

        <div className="mt-6 grid grid-cols-3 gap-3 lg:mt-4">
          {quickLinks.map(({ href, label, caption, Icon }) => (
            <Link key={href} href={href} className="press-interactive flex flex-col gap-3 p-3 sm:p-4">
              <Icon className="text-vermilion" />
              <span className="font-serif text-[20px] leading-none">{label}</span>
              <span className="font-mono text-[11px] text-ink-soft">{caption}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Zone 2: featured case studies as a taped stack */}
      <section className="lg:col-span-4" aria-labelledby="featured">
        <h2 id="featured" className="label mb-6">
          Case studies
        </h2>
        <div className="flex flex-col gap-8">
          {caseStudies.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group relative block transition-transform duration-200 hover:z-10 lg:[transform:rotate(var(--tilt))] lg:hover:[transform:rotate(0deg)_translateY(-6px)]"
              style={{ ["--tilt" as string]: `${tilts[i]}deg` }}
            >
              <article className="press relative bg-paper-raised p-4">
                <span className="tape" />
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-[24px] leading-tight text-ink group-hover:text-vermilion">{p.title}</h3>
                  <span className="font-mono text-[11px] text-ink-faint">{formatMonth(p.date)}</span>
                </div>
                <p className="mt-1 font-serif text-[16px] italic text-ink-soft">“{p.caseStudy!.headline}”</p>
                <ScreenshotFrame shot={p.cover ?? p.caseStudy!.screenshots[0]} className="mt-4 [&_.tape]:hidden" />
                <div className="mt-3 flex items-center justify-between">
                  <Tags items={p.tags} />
                  <span className="inline-flex items-center gap-1 font-mono text-[12px] text-vermilion">
                    Case study <ArrowRight />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Zone 3: ship log + arena */}
      <section className="lg:col-span-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[28px] text-ink">Ship Log</h2>
          <Link href="/work" className="inline-flex items-center gap-1 font-mono text-[12px] text-vermilion hover:underline">
            See all <ArrowRight />
          </Link>
        </div>
        <div className="mt-4">
          <ShipLog limit={5} compact />
        </div>

        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="label">Arena</h2>
            <Link href="/arena" className="inline-flex items-center gap-1 font-mono text-[12px] text-vermilion hover:underline">
              Open <ArrowRight />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1">
            <StatTile label="LeetCode" value={leetcode?.solved ?? null} unit="solved" href="/arena#leetcode" />
            <StatTile label="Codeforces" value={codeforces?.rating ?? null} unit={codeforces?.rank ?? "rating"} href="/arena#codeforces" />
            <StatTile label="GitHub" value={github?.contributions?.total ?? github?.publicRepos ?? null} unit={github?.contributions ? "contributions" : "repos"} href="/arena#github" />
          </div>
        </div>
      </section>
    </div>
  );
}
