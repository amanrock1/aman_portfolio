"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { designs } from "@/content/system-design/registry";
import type { Field, Mode, SystemDesign as Design, Trace } from "@/content/system-design/types";
import { cn } from "@/lib/utils";
import { ArrowRight, PauseIcon, PlayIcon } from "../icons";
import { MarginNote } from "../kit";
import { Diagram, KIND_STYLE, edgeKey, type Move } from "./diagram";

function useMedia(query: string, server: boolean) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const initialValues = (m: Mode) => Object.fromEntries(m.fields.map((f) => [f.id, f.default ?? ""]));

/** Interactive system design for one project. Renders nothing if the project has none. */
export function SystemDesign({ slug }: { slug: string }) {
  const design = designs[slug];
  if (!design) return null;
  return <Engine design={design} />;
}

function Engine({ design }: { design: Design }) {
  const compact = useMedia("(max-width: 767px)", false);
  const reduced = useMedia("(prefers-reduced-motion: reduce)", false);

  const [modeId, setModeId] = useState(design.modes[0].id);
  const mode = design.modes.find((m) => m.id === modeId) ?? design.modes[0];
  const [valuesByMode, setValuesByMode] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(design.modes.map((m) => [m.id, initialValues(m)])),
  );
  const values = valuesByMode[mode.id];

  const [trace, setTrace] = useState<Trace | null>(null);
  const [cursor, setCursor] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [fast, setFast] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const runId = useRef(0);
  const ledgerRef = useRef<HTMLOListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const setValue = (id: string, v: string) => setValuesByMode((s) => ({ ...s, [mode.id]: { ...s[mode.id], [id]: v } }));

  const run = useCallback(
    (vals: Record<string, string>) => {
      let t: Trace;
      try {
        t = mode.simulate(vals);
      } catch (e) {
        t = { steps: [], result: { tone: "error", title: "The simulator hit a problem", lines: [String(e)] } };
      }
      runId.current += 1;
      setTrace(t);
      setCursor(-1);
      setPlaying(t.steps.length > 0);
      setSelected(null);
      setAnswer("");
      // The form is tall: bring the map into view so the visitor sees the slip start moving.
      requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }));
    },
    [mode, reduced],
  );

  const reset = () => {
    setTrace(null);
    setCursor(-1);
    setPlaying(false);
    setSelected(null);
    setAnswer("");
  };

  const last = trace ? trace.steps.length - 1 : -1;

  // Auto-play: one step per beat.
  useEffect(() => {
    if (!playing || !trace) return;
    if (cursor >= last) {
      setPlaying(false);
      return;
    }
    const beat = (reduced ? 600 : 1150) / (fast ? 2 : 1);
    const id = setTimeout(() => setCursor((c) => c + 1), cursor < 0 ? 300 : beat);
    return () => clearTimeout(id);
  }, [playing, cursor, last, trace, reduced, fast]);

  const steps = useMemo(() => (trace ? trace.steps.slice(0, cursor + 1) : []), [trace, cursor]);

  // Everything the diagram needs, derived from the steps shown so far.
  const derived = useMemo(() => {
    const visited: Record<string, number> = {};
    const traversed = new Set<string>();
    const real = new Set(design.edges.map(edgeKey));
    let failed: string | null = null;
    let activeEdge: string | null = null;
    steps.forEach((s, i) => {
      visited[s.node] = i;
      if (s.tone === "error") failed = s.node;
      const from = s.from ?? (i > 0 ? steps[i - 1].node : null);
      if (from) {
        const k = `${from}>${s.node}`;
        if (real.has(k)) traversed.add(k);
        activeEdge = real.has(k) ? k : null;
      } else {
        activeEdge = null;
      }
    });
    return { visited, traversed, failed, activeEdge };
  }, [steps, design.edges]);

  const current = cursor >= 0 && trace ? trace.steps[cursor] : null;
  const move: Move | null = useMemo(() => {
    if (!trace || cursor < 0) return null;
    const s = trace.steps[cursor];
    const from = s.from ?? (cursor > 0 ? trace.steps[cursor - 1].node : null);
    return { key: runId.current * 1000 + cursor, from, to: s.node, text: s.slip ?? clip(s.output ?? s.input ?? s.title, 26) };
  }, [trace, cursor]);

  // Keep the newest ledger entry in view (only when the ledger itself scrolls, i.e. on desktop).
  useEffect(() => {
    const el = ledgerRef.current?.parentElement;
    if (el && el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
  }, [cursor, trace]);

  const finished = trace !== null && cursor >= last;
  const selectedNode = design.nodes.find((n) => n.id === selected) ?? null;
  const selectedStep = selected !== null ? [...steps].reverse().find((s) => s.node === selected) : undefined;

  const play = () => {
    if (!trace) return run(values);
    if (cursor >= last) setCursor(-1);
    setPlaying(true);
  };

  return (
    <section id="system-design" className="scroll-mt-24" aria-labelledby="sd-title">
      <header className="border-t border-hairline pt-10">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-vermilion">System design · interactive</p>
        <h2 id="sd-title" className="mt-2 font-serif text-[34px] leading-tight tracking-tight text-ink sm:text-[44px]">
          {design.title}
        </h2>
        <p className="mt-2 max-w-prose text-ink-soft">{design.tagline}</p>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <span className="stamp shrink-0">simulation</span>
          <p className="min-w-0 max-w-3xl flex-1 font-mono text-[12px] leading-relaxed text-ink-soft">{design.honesty}</p>
        </div>
      </header>

      {design.modes.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Choose a demo">
          {design.modes.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={m.id === mode.id}
              onClick={() => {
                setModeId(m.id);
                reset();
              }}
              className={cn("chip", m.id === mode.id && "chip-active")}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* 1. Send something in */}
      <form
        className="press mt-6 p-4 sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          run(values);
        }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="max-w-prose text-[15px] leading-relaxed text-ink">{mode.intro}</p>
          <MarginNote className="hidden sm:inline-flex">type, then send</MarginNote>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mode.fields.map((f) => (
            <FieldInput key={f.id} field={f} value={values[f.id] ?? ""} onChange={(v) => setValue(f.id, v)} wide={f.type === "text" || f.type === "textarea"} />
          ))}
        </div>

        {mode.presets && (
          <div className="mt-4">
            <p className="label mb-2">Or try one</p>
            <div className="flex flex-wrap gap-2">
              {mode.presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="chip h-auto min-h-9 whitespace-normal py-1.5 text-left"
                  onClick={() => {
                    const next = { ...values, ...p.values };
                    setValuesByMode((s) => ({ ...s, [mode.id]: next }));
                    run(next);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className="press-interactive inline-flex h-11 items-center gap-2 bg-ink px-5 font-mono text-[13px] text-paper">
            Send <ArrowRight />
          </button>
          {trace && (
            <button type="button" onClick={reset} className="chip h-11">
              Clear
            </button>
          )}
        </div>
      </form>

      {/* 2. Watch it travel */}
      <div ref={stageRef} className="mt-8 scroll-mt-24">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-soft" aria-label="Legend">
            {Object.entries(KIND_STYLE)
              .filter(([k]) => design.nodes.some((n) => n.kind === k))
              .map(([k, v]) => (
                <li key={k} className="flex items-center gap-1.5">
                  <span className={cn("h-3 w-1.5", v.strip)} aria-hidden="true" />
                  {v.label}
                </li>
              ))}
          </ul>
          <div className="flex items-center gap-2" role="group" aria-label="Playback">
            <button type="button" className="chip gap-1.5" onClick={playing ? () => setPlaying(false) : play} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <PauseIcon /> : <PlayIcon />}
              {playing ? "Pause" : trace ? (finished ? "Replay" : "Play") : "Send"}
            </button>
            <button
              type="button"
              className="chip"
              disabled={!trace || cursor >= last}
              onClick={() => {
                setPlaying(false);
                setCursor((c) => Math.min(last, c + 1));
              }}
            >
              Step
            </button>
            <button type="button" className={cn("chip", fast && "chip-active")} aria-pressed={fast} onClick={() => setFast((f) => !f)}>
              2×
            </button>
          </div>
        </div>

        <Diagram
          design={design}
          compact={compact}
          reduced={reduced}
          move={move}
          activeId={current?.node ?? null}
          visited={derived.visited}
          failed={derived.failed}
          traversed={derived.traversed}
          activeEdge={derived.activeEdge}
          selected={selected}
          onSelect={(id) => setSelected((s) => (s === id ? null : id))}
        />
        {!trace && <p className="mt-3 text-center font-mono text-[12px] text-ink-faint">Nothing sent yet. Press Send and watch the slip travel.</p>}
      </div>

      {/* 3. The receipt, and what each station is */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="font-serif text-[24px] text-ink">The receipt</h3>
            {trace && <span className="font-mono text-[11px] text-ink-faint">{Math.max(0, cursor + 1)} of {trace.steps.length} steps</span>}
          </div>
          <div className="press bg-paper-raised p-4 sm:p-5 lg:max-h-[640px] lg:overflow-y-auto" aria-live="polite">
            {steps.length === 0 && !finished && <p className="font-mono text-[12px] text-ink-faint">The ledger prints here, one line per station the slip visits.</p>}
            <ol ref={ledgerRef} className="space-y-4">
              {steps.map((s, i) => {
                const n = design.nodes.find((x) => x.id === s.node);
                return (
                  <li key={i} className={cn("rounded border border-dashed p-3", i === cursor ? "border-vermilion bg-vermilion/5" : "border-hairline")}>
                    <button
                      type="button"
                      onClick={() => {
                        setPlaying(false);
                        setCursor(i);
                      }}
                      className="flex w-full items-center gap-2 text-left"
                      aria-label={`Go to step ${i + 1}`}
                    >
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] text-paper">{i + 1}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">{n?.label ?? s.node}</span>
                      {s.tone === "error" && <span className="ml-auto font-mono text-[10px] uppercase text-vermilion-dark">stopped</span>}
                      {s.tone === "branch" && <span className="ml-auto font-mono text-[10px] uppercase text-vermilion">branch</span>}
                    </button>
                    <p className="mt-2 font-serif text-[18px] leading-snug text-ink">{s.title}</p>
                    {s.input && <Io label="in" text={s.input} />}
                    {s.output && <Io label="out" text={s.output} strong />}
                    {s.note && <p className="mt-2 font-serif text-[15px] italic leading-snug text-vermilion">{s.note}</p>}
                  </li>
                );
              })}
            </ol>

            {finished && trace?.ask && (
              <form
                className="mt-4 rounded border border-vermilion p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!answer.trim() || !trace.ask) return;
                  const next = trace.ask.resume(answer.trim());
                  setTrace({ steps: [...trace.steps, ...next.steps], result: next.result, ask: next.ask });
                  setAnswer("");
                  setPlaying(true);
                }}
              >
                <p className="font-serif text-[18px] text-ink">{trace.ask.question}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={trace.ask.placeholder}
                    aria-label={trace.ask.question}
                    className="h-11 min-w-0 flex-1 rounded border border-ink bg-paper px-3 font-mono text-[14px] text-ink placeholder:text-ink-faint"
                  />
                  <button type="submit" className="press-interactive inline-flex h-11 items-center gap-2 bg-ink px-4 font-mono text-[13px] text-paper">
                    Reply <ArrowRight />
                  </button>
                </div>
              </form>
            )}

            {finished && trace && !trace.ask && (
              <div
                className={cn(
                  "mt-4 rounded border p-4",
                  trace.result.tone === "ok" && "border-signal bg-signal/10",
                  trace.result.tone === "error" && "border-vermilion bg-vermilion/10",
                  trace.result.tone === "info" && "border-dashed border-ink-soft",
                )}
              >
                <p className="label">Result</p>
                <p className="mt-1 font-serif text-[22px] leading-tight text-ink">{trace.result.title}</p>
                <div className="mt-2 space-y-1 font-mono text-[12px] leading-relaxed text-ink-soft">
                  {trace.result.lines.map((l, i) => (
                    <p key={i} className="break-words">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-5 lg:self-start" aria-label="Station details">
          <h3 className="mb-2 font-serif text-[24px] text-ink">The stations</h3>
          <div className="press bg-paper-raised p-4 sm:p-5">
            {selectedNode ? (
              <div>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                  <span className={cn("h-3 w-1.5", KIND_STYLE[selectedNode.kind].strip)} aria-hidden="true" />
                  {KIND_STYLE[selectedNode.kind].label}
                </p>
                <p className="mt-1 font-serif text-[24px] leading-tight text-ink">{selectedNode.label}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">{selectedNode.blurb}</p>
                {selectedNode.tech && <p className="mt-3 font-mono text-[12px] text-ink-soft">{selectedNode.tech}</p>}
                {selectedNode.source && (
                  <a
                    href={`https://github.com/amanrock1/${design.repo}/blob/HEAD/${encodeURI(selectedNode.source)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block break-all font-mono text-[12px] text-vermilion underline underline-offset-4"
                  >
                    {selectedNode.source}
                  </a>
                )}
                <div className="mt-4 border-t border-dashed border-hairline pt-3">
                  <p className="label mb-2">In this run</p>
                  {selectedStep ? (
                    <>
                      <p className="font-serif text-[16px] text-ink">{selectedStep.title}</p>
                      {selectedStep.input && <Io label="in" text={selectedStep.input} />}
                      {selectedStep.output && <Io label="out" text={selectedStep.output} strong />}
                    </>
                  ) : (
                    <p className="font-mono text-[12px] text-ink-faint">The slip has not reached this station yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="font-serif text-[18px] leading-snug text-ink">Tap any station on the map.</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">You get what it does, the real technology behind it, the file in the repo that implements it, and what it received and returned in your run.</p>
                <ul className="mt-4 space-y-2">
                  {design.nodes.map((n) => (
                    <li key={n.id}>
                      <button type="button" onClick={() => setSelected(n.id)} className="flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-paper-sunk">
                        <span className={cn("h-3 w-1.5 shrink-0", KIND_STYLE[n.kind].strip)} aria-hidden="true" />
                        <span className="font-serif text-[16px] text-ink">{n.label}</span>
                        {n.sub && <span className="ml-auto truncate font-mono text-[10px] text-ink-faint">{n.sub}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Io({ label, text, strong }: { label: string; text: string; strong?: boolean }) {
  return (
    <div className="mt-2 flex gap-2">
      <span className="mt-0.5 w-8 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">{label}</span>
      <pre className={cn("min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed", strong ? "text-ink" : "text-ink-soft")}>{text}</pre>
    </div>
  );
}

function FieldInput({ field, value, onChange, wide }: { field: Field; value: string; onChange: (v: string) => void; wide: boolean }) {
  const base = "w-full rounded border border-ink bg-paper px-3 font-mono text-[14px] text-ink placeholder:text-ink-faint";
  return (
    <label className={cn("block", wide && "sm:col-span-2")}>
      <span className="label">{field.label}</span>
      <span className="mt-1 block">
        {field.type === "textarea" ? (
          <textarea rows={field.rows ?? 4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={cn(base, "py-2 leading-relaxed")} />
        ) : field.type === "select" ? (
          <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(base, "h-11")}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : field.type === "color" ? (
          <span className="flex items-center gap-3">
            <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-11 w-16 cursor-pointer rounded border border-ink bg-paper p-1" />
            <span className="font-mono text-[13px] text-ink-soft">{value}</span>
          </span>
        ) : (
          <input
            type={field.type === "number" ? "number" : "text"}
            inputMode={field.type === "number" ? "numeric" : undefined}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={cn(base, "h-11")}
          />
        )}
      </span>
      {field.hint && <span className="mt-1 block font-mono text-[11px] text-ink-faint">{field.hint}</span>}
    </label>
  );
}
