"use client";

import Link from "next/link";
import { usePlayer } from "./player-context";
import { PauseIcon, PlayIcon } from "../icons";
import { cn } from "@/lib/utils";

export function Equalizer({ active, className }: { active: boolean; className?: string }) {
  return (
    <span className={cn("flex h-3 items-end gap-[2px]", className)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn("w-[2px] origin-bottom bg-current", active ? "h-3 animate-eq" : "h-1")}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

/**
 * Receipt-style mini player. `compact` is the pill above the mobile tab bar.
 * The round button plays/pauses right here, on any page. The song name opens the full player.
 */
export function MiniPlayer({ compact = false }: { compact?: boolean }) {
  const { tracks, index, playing, toggle } = usePlayer();
  const track = tracks[index];

  return (
    <div
      className={cn(
        "flex items-center gap-3 border border-ink bg-paper-raised font-mono text-[12px]",
        compact ? "rounded-full px-3 py-1.5 shadow-press-sm" : "rounded px-3 py-2.5 shadow-press-sm",
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <Link href="/soundtrack" aria-label="Open the soundtrack player" className="min-w-0 flex-1 truncate text-ink-soft hover:text-ink">
        <span className="text-vermilion">$</span> {playing ? "now playing" : "play"}{" "}
        <span className="text-ink">
          {track.title} · {track.artist}
        </span>
      </Link>
      <Equalizer active={playing} className="text-vermilion" />
    </div>
  );
}
