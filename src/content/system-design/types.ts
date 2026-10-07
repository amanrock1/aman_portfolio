// Data model for the interactive "System design" section.
//
// A design is plain data (stations + routes) plus `simulate()` functions that turn the
// visitor's input into a trace. The engine plays the trace back as a paper slip travelling
// along the routes, and prints each step on a receipt ledger.
//
// Everything runs in the browser and calls no servers. Simulations port the real logic
// (keywords, thresholds, formulas) from each project's repo, and say so in `honesty`.

export type NodeKind = "client" | "service" | "ai" | "data" | "external" | "security" | "logic";

export type ArchNode = {
  id: string;
  label: string;
  /** Short mono line under the label, e.g. the tech. */
  sub?: string;
  kind: NodeKind;
  /** Grid position on desktop. Phones transpose it (x = row, y = col), so keep rows <= 3. */
  col: number;
  row: number;
  /** What this station does, in plain words (shown in the inspector). */
  blurb: string;
  tech?: string;
  /** File path inside the project's repo that implements this station. */
  source?: string;
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
  /** main = normal path, branch = alternative path, error = failure path. */
  kind?: "main" | "branch" | "error";
};

export type Field = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "color";
  options?: { value: string; label: string }[];
  placeholder?: string;
  default?: string;
  rows?: number;
  /** Small helper line under the field. */
  hint?: string;
};

export type Tone = "ok" | "branch" | "error";

export type TraceStep = {
  /** Station that handles this step. */
  node: string;
  /** Station the slip comes from (defaults to the previous step's node). */
  from?: string;
  title: string;
  /** What went in / what came out, shown on the ledger as mono text. */
  input?: string;
  output?: string;
  /** Extra explanation, e.g. "real app asks an LLM here; the demo uses the regex fallback". */
  note?: string;
  /** Text written on the paper slip while it travels (keep it short). */
  slip?: string;
  tone?: Tone;
};

export type TraceResult = { tone: "ok" | "error" | "info"; title: string; lines: string[] };

export type Trace = {
  steps: TraceStep[];
  result: TraceResult;
  /** Pause for the visitor to answer (DukaanDost asks "which product?"). */
  ask?: { question: string; placeholder?: string; resume: (answer: string) => Trace };
};

export type Preset = { label: string; values: Record<string, string> };

export type Mode = {
  id: string;
  label: string;
  /** One or two lines explaining what to try. */
  intro: string;
  fields: Field[];
  presets?: Preset[];
  simulate: (values: Record<string, string>) => Trace;
};

export type SystemDesign = {
  slug: string;
  title: string;
  tagline: string;
  /** GitHub repo name under amanrock1, used for source links. */
  repo: string;
  layout: { cols: number; rows: number };
  nodes: ArchNode[];
  edges: ArchEdge[];
  modes: Mode[];
  /** What is real and what is stubbed. Shown above the diagram. Never overstate. */
  honesty: string;
};
