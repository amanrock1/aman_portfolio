"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";
import { AboutIcon, ArenaIcon, ArrowUpRight, ContactIcon, DownloadIcon, LogIcon, WorkIcon } from "../icons";
import { MiniPlayer } from "../player/mini-player";

const nav = [
  { href: "/", label: "Log", Icon: LogIcon },
  { href: "/work", label: "Work", Icon: WorkIcon },
  { href: "/arena", label: "Arena", Icon: ArenaIcon },
  { href: "/about", label: "About", Icon: AboutIcon },
  { href: "/contact", label: "Contact", Icon: ContactIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Layout shell. Phone/tablet: top wordmark bar + fixed bottom tab bar + mini player pill.
 * Desktop (lg, 1024px+): sticky left rail and full-width content (max 1440px).
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop left rail */}
      <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 flex-col border-r border-hairline px-6 py-8 lg:flex">
        <Link href="/" className="font-serif text-2xl leading-none text-ink">
          {config.wordmark}
        </Link>
        <p className="mt-3 text-[13px] leading-snug text-ink-soft">{config.tagline}</p>
        <p className="mt-1 font-mono text-[11px] text-ink-faint">{config.education}</p>

        <nav className="mt-10 flex flex-col gap-1" aria-label="Main">
          {nav.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded border-l-2 px-3 py-2 text-[15px] transition-colors",
                  active
                    ? "border-vermilion bg-paper-sunk text-vermilion"
                    : "border-transparent text-ink-soft hover:bg-paper-sunk hover:text-ink",
                )}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rule pt-4 font-mono text-[12px]">
            <a href={config.resume} className="flex items-center justify-between py-1 text-ink-soft hover:text-vermilion">
              Resume <DownloadIcon />
            </a>
            <a href={config.social.github} target="_blank" rel="noreferrer" className="flex items-center justify-between py-1 text-ink-soft hover:text-vermilion">
              GitHub <ArrowUpRight />
            </a>
            <a href={config.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between py-1 text-ink-soft hover:text-vermilion">
              LinkedIn <ArrowUpRight />
            </a>
            <a href={`mailto:${config.email}`} className="flex items-center justify-between py-1 text-ink-soft hover:text-vermilion">
              Email <ArrowUpRight />
            </a>
          </div>
          <MiniPlayer />
        </div>
      </aside>

      {/* Phone/tablet top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hairline bg-paper/95 px-4 backdrop-blur-sm lg:hidden">
        <Link href="/" className="font-mono text-[14px] font-medium text-ink">
          {config.wordmark}
        </Link>
        <a href={config.resume} className="flex items-center gap-1 font-mono text-[12px] text-ink-soft">
          Resume <DownloadIcon />
        </a>
      </header>

      <main className="mx-auto w-full max-w-page flex-1 px-4 pb-40 pt-6 sm:px-6 lg:px-12 lg:pb-16 lg:pt-10">{children}</main>

      {/* Phone/tablet mini player + bottom tab bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="px-3 pb-2">
          <MiniPlayer compact />
        </div>
        <nav className="grid grid-cols-5 border-t border-hairline bg-paper" aria-label="Main">
          {nav.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 font-mono text-[11px]",
                  active ? "text-vermilion" : "text-ink-soft",
                )}
              >
                {active && <span className="absolute inset-x-5 top-0 h-[2px] bg-vermilion" />}
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
