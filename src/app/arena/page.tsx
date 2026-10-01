import type { Metadata } from "next";
import { config } from "@/data/config";
import { getAllStats } from "@/lib/stats";
import { Bars, Heatmap, RatingLine, SegmentBar } from "@/components/arena/charts";
import { ExternalLink, MarginNote, PageHeader } from "@/components/kit";
import { StatTile } from "@/components/stat-tile";

export const metadata: Metadata = { title: "Coding Arena" };
export const revalidate = 21600;

function Card({ id, ticket, name, handle, href, children, className = "" }: { id: string; ticket: string; name: string; handle: string; href: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`press scroll-mt-24 flex flex-col p-5 sm:p-6 ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-dashed border-hairline pb-3">
        <h2 className="flex items-center gap-3">
          <span className="rounded bg-vermilion px-1.5 py-0.5 font-mono text-[10px] text-paper">TICKET {ticket}</span>
          <span className="font-serif text-[24px] text-ink">{name}</span>
        </h2>
        <ExternalLink href={href}>{handle}</ExternalLink>
      </header>
      <div className="mt-5 flex flex-1 flex-col gap-6">{children}</div>
    </section>
  );
}

function Unavailable({ what }: { what: string }) {
  return <p className="rounded border border-dashed border-hairline p-4 font-mono text-[12px] text-ink-faint">{what} is unavailable right now. Check the profile link.</p>;
}

function Big({ value, unit, extra }: { value: number | null; unit: string; extra?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <span className="font-serif text-[56px] leading-none tabular-nums text-ink">{value === null ? "—" : value.toLocaleString("en-US")}</span>
      <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-ink-soft">{unit}</span>
      {extra}
    </div>
  );
}

export default async function ArenaPage() {
  const { leetcode: lc, codeforces: cf, codechef: cc, github: gh } = await getAllStats();
  const total = (lc?.solved ?? 0) + (cf?.solved ?? 0) + (cc?.solved ?? 0);
  const sources = [lc, cf, cc].filter(Boolean).length;

  return (
    <>
      <PageHeader eyebrow="04 / Coding Arena" title="Coding Arena" intro="Live numbers from LeetCode, Codeforces, CodeChef and GitHub, refreshed every few hours." />

      {/* Row 1: total + platform jump tiles */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="press relative p-6 lg:col-span-7">
          <span className="tape" />
          <span className="stamp">live data</span>
          <div className="mt-5">
            <Big value={sources ? total : null} unit="problems solved" />
          </div>
          <p className="mt-2 text-ink-soft">across {sources === 3 ? "three platforms" : `${sources} reachable platforms`}</p>
          <MarginNote className="mt-6">every number here is real</MarginNote>
        </div>
        <nav aria-label="Platforms" className="grid grid-cols-2 gap-4 lg:col-span-5">
          <StatTile label="LeetCode" value={lc?.solved ?? null} unit="solved" href="#leetcode" />
          <StatTile label="Codeforces" value={cf?.rating ?? null} unit="rating" href="#codeforces" />
          <StatTile label="CodeChef" value={cc?.rating ?? null} unit="rating" href="#codechef" />
          <StatTile label="GitHub" value={gh?.contributions?.total ?? gh?.publicRepos ?? null} unit={gh?.contributions ? "contributions" : "repos"} href="#github" />
        </nav>
      </div>

      {/* Row 2 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card id="leetcode" ticket="#01" name="LeetCode" handle={config.handles.leetcode} href={config.social.leetcode}>
          {lc ? (
            <>
              <Big value={lc.solved} unit="solved" extra={lc.languages[0] && <span className="ml-auto rounded border border-ink px-2 py-0.5 font-mono text-[12px] shadow-press-sm">{lc.languages[0].name} · {lc.languages[0].count}</span>} />
              <SegmentBar
                parts={[
                  { label: "Easy", value: lc.easy, color: "#2F6F5E" },
                  { label: "Medium", value: lc.medium, color: "#D9A441" },
                  { label: "Hard", value: lc.hard, color: "#C8452B" },
                ]}
              />
              <div>
                <p className="label mb-3">Top topics</p>
                <Bars items={lc.topTopics} />
              </div>
              <Heatmap days={lc.calendar} label={`${lc.activeDays} active days in the last year`} />
            </>
          ) : (
            <Unavailable what="LeetCode data" />
          )}
        </Card>

        <Card id="codeforces" ticket="#02" name="Codeforces" handle={config.handles.codeforces} href={config.social.codeforces}>
          {cf ? (
            <>
              <Big value={cf.rating} unit="rating" extra={cf.rank && <span className="stamp ml-auto">{cf.rank}</span>} />
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="max" value={cf.maxRating} />
                <StatTile label="solved" value={cf.solved} />
                <StatTile label="contests" value={cf.contests} />
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <p className="label">Contest rating</p>
                  {cf.ratingHistory.length > 1 && cf.ratingHistory.at(-1)!.rating > cf.ratingHistory[0].rating && <span className="note text-[15px]">up and to the right</span>}
                </div>
                <div className="rounded border border-hairline bg-paper p-2">
                  <RatingLine points={cf.ratingHistory} />
                </div>
              </div>
              <div>
                <p className="label mb-3">Problem tags</p>
                <Bars items={cf.topTags} accentFirst />
              </div>
            </>
          ) : (
            <Unavailable what="Codeforces data" />
          )}
        </Card>
      </div>

      {/* Row 3 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card id="codechef" ticket="#03" name="CodeChef" handle={config.handles.codechef} href={config.social.codechef} className="lg:col-span-5">
          {cc ? (
            <>
              <Big value={cc.rating} unit="rating" />
              <div className="grid flex-1 grid-cols-2 gap-3">
                <StatTile label="global rank" value={cc.globalRank} />
                <StatTile label="country rank" value={cc.countryRank} />
                <StatTile label="solved" value={cc.solved} />
                <StatTile label="contests" value={cc.contests} />
              </div>
            </>
          ) : (
            <Unavailable what="CodeChef data" />
          )}
        </Card>

        <Card id="github" ticket="#04" name="GitHub" handle={config.handles.github} href={config.social.github} className="lg:col-span-7">
          {gh ? (
            <>
              {gh.contributions ? (
                <Big value={gh.contributions.total} unit="contributions in the last year" />
              ) : (
                <Big value={gh.publicRepos} unit="public repos" />
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gh.contributions && <StatTile label="commits" value={gh.contributions.commits} />}
                {gh.contributions && <StatTile label="active days" value={gh.contributions.activeDays} />}
                {gh.contributions && <StatTile label="repos" value={gh.publicRepos} />}
                <StatTile label="followers" value={gh.followers} />
              </div>
              {gh.contributions && <Heatmap days={gh.contributions.calendar} label={`${gh.contributions.activeDays} active days in the last year`} />}
              <div>
                <p className="label mb-3">Repos by language</p>
                <Bars items={gh.languages} />
              </div>
            </>
          ) : (
            <Unavailable what="GitHub data" />
          )}
        </Card>
      </div>
    </>
  );
}
