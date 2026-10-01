"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { certifications, type Certification } from "@/content/about";
import { ArrowLeft, ArrowRight } from "./icons";

const ROTATIONS = [-1.5, 1, -0.5, 1.5, -1, 0.5, -1.2];
const src = (file: string) => encodeURI(`/assets/certificates/${file}`);

// Only certificates that have an image can be opened.
const viewable = certifications.filter((c): c is Certification & { file: string } => Boolean(c.file));

/** Certificate stickers. Tap one to open the certificate in a viewer. */
export function Certificates() {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + viewable.length) % viewable.length)), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open === null ? null : viewable[open];

  return (
    <>
      <ul className="flex flex-wrap gap-3">
        {certifications.map((c, i) => {
          const base = "block rounded border border-dashed border-ink bg-paper-raised px-3 py-2 text-left transition-transform duration-150";
          const body = (
            <>
              <span className="block text-[14px] text-ink">{c.name}</span>
              <span className="block font-mono text-[11px] text-ink-soft">{c.issuer}</span>
            </>
          );
          const idx = viewable.findIndex((v) => v.name === c.name);
          return (
            <li key={c.name} className="max-w-full" style={{ ["--r" as string]: `${ROTATIONS[i % ROTATIONS.length]}deg` }}>
              {c.file ? (
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`View certificate: ${c.name}`}
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setOpen(idx);
                  }}
                  className={`${base} rotate-[var(--r)] cursor-pointer hover:rotate-0 hover:border-vermilion hover:shadow-press-sm`}
                >
                  {body}
                </button>
              ) : (
                <div className={`${base} rotate-[var(--r)]`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.name} onClick={close} className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/75 p-3 sm:p-6">
          <div onClick={(e) => e.stopPropagation()} className="relative flex max-h-full w-full max-w-4xl flex-col">
            <div className="flex items-start justify-between gap-3 rounded-t border border-ink bg-paper-raised px-4 py-3">
              <div className="min-w-0">
                <p className="font-serif text-[20px] leading-tight text-ink">{current.name}</p>
                <p className="font-mono text-[11px] text-ink-soft">
                  {current.issuer} · {open! + 1} of {viewable.length}
                </p>
              </div>
              <button ref={closeBtn} type="button" onClick={close} className="chip shrink-0" aria-label="Close certificate">
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto border-x border-ink bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(current.file)} alt={`${current.name} certificate, ${current.issuer}`} className="mx-auto block h-auto max-h-[70vh] w-auto max-w-full object-contain" />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-b border border-ink bg-paper-raised px-4 py-3">
              <button type="button" onClick={() => step(-1)} className="chip gap-2" aria-label="Previous certificate">
                <ArrowLeft /> Prev
              </button>
              <a href={src(current.file)} target="_blank" rel="noreferrer" className="font-mono text-[12px] text-vermilion hover:underline">
                Open full size
              </a>
              <button type="button" onClick={() => step(1)} className="chip gap-2" aria-label="Next certificate">
                Next <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
