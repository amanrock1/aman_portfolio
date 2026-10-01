"use client";

import { useState } from "react";
import { config } from "@/data/config";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-stretch overflow-hidden rounded border border-ink bg-paper-raised shadow-press">
      <a href={`mailto:${config.email}`} className="min-w-0 flex-1 truncate px-4 py-3 font-mono text-[14px] text-ink hover:text-vermilion sm:text-[16px]">
        {config.email}
      </a>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(config.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
        className="flex shrink-0 items-center gap-2 border-l border-ink px-4 font-mono text-[12px] hover:bg-ink hover:text-paper"
        aria-live="polite"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? "copied" : "copy"}
      </button>
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

  const field = "w-full border-0 border-b border-hairline bg-transparent px-0 py-2 text-[16px] text-ink placeholder:text-ink-faint focus:border-vermilion focus:outline-none focus:ring-0";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="label">Name</span>
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="label">Email</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className="label">Message</span>
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={5000}
          rows={6}
          className={`${field} resize-y bg-[repeating-linear-gradient(transparent,transparent_31px,#D9D1C2_31px,#D9D1C2_32px)] leading-8`}
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
