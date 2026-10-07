"use client";

import { useState } from "react";
import { config } from "@/data/config";
import { ArrowRight, ArrowUpRight, CheckIcon, CopyIcon } from "./icons";

export function InboxCard() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="press bg-paper-raised p-4">
      <div className="flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-ink-soft">
        <span>Inbox // direct reach</span>
        <span className="inline-flex items-center gap-1.5 text-signal">
          <span className="h-2 w-2 rounded-full bg-signal" /> Active
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded border border-ink bg-paper-raised py-1.5 pl-3 pr-1.5">
          <a href={`mailto:${config.email}`} className="min-w-0 truncate font-mono text-[14px] text-ink hover:text-vermilion">
            {config.email}
          </a>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(config.email);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded border border-hairline px-2.5 font-mono text-[12px] hover:border-ink hover:bg-ink hover:text-paper"
            aria-live="polite"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <a href={`mailto:${config.email}`} className="press-interactive inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-vermilion px-5 font-mono text-[13px] text-paper">
          Email me <ArrowUpRight />
        </a>
      </div>
    </div>
  );
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function LetterForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);
    if (res?.ok) {
      form.reset();
      setStatus({ kind: "sent" });
    } else {
      const data = (await res?.json().catch(() => null)) as { error?: string } | null;
      setStatus({ kind: "error", message: data?.error ?? "Could not send. Please email directly." });
    }
  }

  const field = "mt-1 w-full border-0 border-b border-ink/70 bg-transparent px-0 py-2 text-[16px] text-ink placeholder:text-ink-faint focus:border-vermilion focus:outline-none focus:ring-0";
  const row = "flex items-baseline justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-ink-soft";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className={row}>From (name): <span className="text-[11px] text-ink-faint">[required]</span></span>
        <input name="name" placeholder="Jane Doe" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className={row}>Return address (email): <span className="text-[11px] text-ink-faint">[required]</span></span>
        <input name="email" placeholder="jane@example.com" type="email" required maxLength={200} autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className={row}>Dispatch message: <span className="text-[11px] text-ink-faint">[ruled paper]</span></span>
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={5000}
          rows={6}
          placeholder="Greetings, I came across your portfolio..."
          className={`mt-2 w-full resize-y rounded border border-ink/70 bg-paper-raised px-3 py-0 text-[16px] text-ink placeholder:text-ink-faint focus:border-vermilion focus:outline-none focus:ring-0 bg-[repeating-linear-gradient(transparent,transparent_31px,rgb(var(--hairline))_31px,rgb(var(--hairline))_32px)] leading-8`}
        />
      </label>
      {/* Honeypot, hidden from people */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status.kind === "sending"} className="press-interactive inline-flex h-11 items-center bg-ink px-5 font-mono text-[13px] text-paper disabled:opacity-60">
          {status.kind === "sending" ? "Sending…" : "Send note"}
        </button>
        <p className="font-mono text-[12px]" role="status">
          {status.kind === "sent" && <span className="text-signal">Sent. I&apos;ll reply by email.</span>}
          {status.kind === "error" && (
            <span className="text-vermilion">
              {status.message}{" "}
              <a href={`mailto:${config.email}`} className="underline">
                Email me
              </a>
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
