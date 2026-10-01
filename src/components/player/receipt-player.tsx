"use client";

import { useEffect, useState } from "react";
import { spotifyPlaylist } from "@/content/about";
import { cn } from "@/lib/utils";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, ShuffleIcon } from "../icons";
import { ExternalLink, MarginNote } from "../kit";
import { Equalizer } from "./mini-player";
import { usePlayer } from "./player-context";

function asciiBar(progress: number, width = 16) {
  const filled = Math.round(progress * width);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}]`;
}

/** Terminal-style player printed on a paper receipt. */
export function ReceiptPlayer() {
  const { tracks, index, playing, progress, mode, wantEmbed, activate, setSlot, toggle, next, prev, shuffle, play } = usePlayer();
  const track = tracks[index];
  const hasAudio = mode !== "placeholder";
  const [embedLoading, setEmbedLoading] = useState(false);

  // Opening this page loads the Spotify embed (it stays loaded while you browse).
  useEffect(() => {
    if (mode === "spotify") activate();
    return () => setSlot(null);
  }, [mode, activate, setSlot]);

  // If the embed hasn't appeared after a few seconds, say so (ad blockers block it).
  useEffect(() => {
    if (!wantEmbed) return;
    const t = setTimeout(() => setEmbedLoading(true), 6000);
    return () => clearTimeout(t);
  }, [wantEmbed]);
  const waitingForSpotify = mode === "spotify" && embedLoading && !playing && progress === 0;

  const keys = [
    { label: "prev", Icon: PrevIcon, onClick: prev },
    { label: playing ? "pause" : "play", Icon: playing ? PauseIcon : PlayIcon, onClick: toggle, active: playing },
    { label: "next", Icon: NextIcon, onClick: next },
    { label: "shuf", Icon: ShuffleIcon, onClick: shuffle },
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="lg:col-span-5">
        <MarginNote className="mb-4">press play</MarginNote>
        {/* Receipt with zig-zag torn edges */}
        <div className="relative bg-paper-raised px-6 py-8 font-mono text-[13px] text-ink drop-shadow-[3px_3px_0_rgb(var(--shadow))]">
          <span aria-hidden="true" className="absolute inset-x-0 -top-[7px] h-2 bg-[linear-gradient(135deg,rgb(var(--paper-raised))_50%,transparent_50%),linear-gradient(-135deg,rgb(var(--paper-raised))_50%,transparent_50%)] bg-[length:14px_14px] [background-position:0_100%]" />
          <span aria-hidden="true" className="absolute inset-x-0 -bottom-[7px] h-2 bg-[linear-gradient(45deg,rgb(var(--paper-raised))_50%,transparent_50%),linear-gradient(-45deg,rgb(var(--paper-raised))_50%,transparent_50%)] bg-[length:14px_14px]" />
          <p className="text-ink-faint">soundtrack.log</p>
          <p className="mt-4">
            <span className="text-vermilion">$</span> {playing ? "play" : "pause"}
            <span className="ml-1 inline-block h-4 w-2 translate-y-[3px] animate-blink bg-ink" />
          </p>
          <p className="mt-3 text-vermilion">{playing ? "now playing ▶" : "paused ❚❚"}</p>
          <p className="mt-1">
            Track {String(index + 1).padStart(2, "0")} · {track.title} · {track.artist}
          </p>
          <div className="mt-4 flex items-center justify-between text-ink-soft">
            <span>progress</span>
            <span>{track.length}</span>
          </div>
          <p className="mt-1 whitespace-nowrap text-vermilion">{asciiBar(progress)}</p>
          <Equalizer active={playing} className="mt-4 text-ink" />
          {!hasAudio && <p className="mt-4 border-t border-dashed border-hairline pt-3 text-[11px] text-ink-faint">tracklist coming soon: these are placeholders</p>}
          {waitingForSpotify && <p className="mt-4 border-t border-dashed border-hairline pt-3 text-[11px] text-ink-faint">press play. if nothing starts, an ad blocker may be blocking Spotify</p>}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {keys.map(({ label, Icon, onClick, active }) => (
            <button key={label} type="button" onClick={onClick} className={cn("press-interactive flex h-14 flex-col items-center justify-center gap-1 font-mono text-[11px]", active && "press-selected")}>
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="lg:col-span-7">
        <p className="label mb-3">queue</p>
        <ol className="press divide-y divide-hairline bg-paper-raised">
          {tracks.map((t, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => play(i)}
                className={cn("flex w-full items-center gap-4 px-4 py-3 text-left font-mono text-[13px] transition-colors hover:bg-paper-sunk", i === index && "text-vermilion")}
              >
                <span className="w-6 text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 truncate">
                  {t.title} · {t.artist}
                </span>
                <span className="text-ink-faint">{t.length}</span>
              </button>
            </li>
          ))}
        </ol>
        {mode === "spotify" && (
          <div className="mt-6">
            {/* The persistent <SpotifyHost> positions itself over this slot while you're on this page. */}
            <div ref={setSlot} className="h-[152px] w-full" aria-hidden="true" />
            <p className="mt-2 font-mono text-[11px] text-ink-faint">Not logged into Spotify? You&apos;ll hear 30-second previews. Log in inside the player for full tracks.</p>
          </div>
        )}
        {spotifyPlaylist && (
          <div className="mt-4">
            <ExternalLink href={spotifyPlaylist}>Open on Spotify</ExternalLink>
          </div>
        )}
      </section>
    </div>
  );
}
