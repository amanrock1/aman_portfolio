"use client";

import { useState } from "react";
import { hackathons, participatedHackathons, type Hackathon } from "@/content/about";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "./icons";

function Ticket({ h }: { h: Hackathon }) {
  return (
    <li className="rounded border border-dashed border-ink p-3">
      <span className={cn("font-mono text-[11px] uppercase tracking-[0.08em]", h.highlight ? "text-vermilion" : "text-ink-soft")}>{h.result}</span>
      <p className="mt-1 break-words font-serif text-[18px] leading-tight text-ink">{h.name}</p>
      {h.host && <p className="mt-1 font-mono text-[11px] text-ink-soft">{h.host}</p>}
    </li>
  );
}

/** Main hackathons, plus the "participated" ones behind a Show more button. */
export function Hackathons() {
  const [more, setMore] = useState(false);

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {hackathons.map((h) => (
          <Ticket key={h.name} h={h} />
        ))}
      </ul>

      {more && (
        <div id="more-hackathons" className="animate-rise mt-5">
          <p className="label mb-3">Participated</p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {participatedHackathons.map((h) => (
              <Ticket key={h.name} h={h} />
            ))}
          </ul>
        </div>
      )}

      <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} aria-controls="more-hackathons" className="chip mt-5 gap-2">
        {more ? <MinusIcon /> : <PlusIcon />}
        {more ? "Show less" : `Show more (${participatedHackathons.length})`}
      </button>
    </div>
  );
}
