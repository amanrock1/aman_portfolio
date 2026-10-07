import type { ArchEdge, ArchNode, Mode, SystemDesign, Trace, TraceStep } from "./types";

// OpenSource Buddy: a GitHub issue goes through browser validation, a Flask API that validates
// again, then either a local Ollama model or the rule-based demo analyzer, and comes back as a
// beginner roadmap.
//
// Ported from the real code (repo OpenSource-Buddy):
//   app.py        the validation limits, the GitHub URL pattern, the auto -> demo fallback
//   analyzer.py   analyze_demo(): keyword scoring, threshold of 2, GENERIC fallback
//   static/script.js   the browser-side length checks
// NOT run here: Ollama (gemma4:31b-cloud) and Flask. The AI path is shown as unavailable, which
// is exactly what the real app does when Ollama is not reachable.

const nodes: ArchNode[] = [
  { id: "form", label: "Issue form", sub: "browser", kind: "client", col: 0, row: 1, blurb: "You paste an issue title, its description and optionally the GitHub issue URL. The page counts characters live and keeps a saved-analyses list in localStorage.", tech: "Vanilla JS", source: "static/script.js" },
  { id: "browser", label: "Browser checks", sub: "length rules", kind: "security", col: 1, row: 1, blurb: "Cheap checks before any request: a title of at least 3 characters and a description of at least 10.", tech: "script.js", source: "static/script.js" },
  { id: "api", label: "Flask API", sub: "validation", kind: "service", col: 2, row: 1, blurb: "Validates everything again on the server, because the browser can be bypassed: all fields must be text, title 3 to 200, description 10 to 8000, a URL that looks like a GitHub issue or pull request, and a body under 64 KB.", tech: "Flask", source: "app.py" },
  { id: "ollama", label: "Ollama AI", sub: "gemma4:31b-cloud", kind: "ai", col: 3, row: 0, blurb: "In auto mode the app asks a local Ollama model for a structured analysis. If Ollama is not running it raises an error and the app falls back instead of failing.", tech: "Ollama", source: "analyzer.py" },
  { id: "demo", label: "Demo analyzer", sub: "keyword rules", kind: "logic", col: 3, row: 2, blurb: "Deterministic rule engine. Each rule counts how many of its keywords appear in the title and description. The best rule wins only with a score of 2 or more, otherwise a generic answer is used.", tech: "Python", source: "analyzer.py" },
  { id: "roadmap", label: "Roadmap", sub: "difficulty + steps", kind: "logic", col: 4, row: 1, blurb: "The chosen rule becomes an explanation, a difficulty, skills, a step-by-step roadmap, questions for the maintainer and a testing checklist.", tech: "JSON response", source: "analyzer.py" },
  { id: "view", label: "Result view", sub: "checklist", kind: "client", col: 5, row: 1, blurb: "Renders the roadmap with a progress checklist and lets you save it locally.", tech: "Vanilla JS", source: "static/script.js" },
];

const edges: ArchEdge[] = [
  { from: "form", to: "browser" },
  { from: "browser", to: "api" },
  { from: "api", to: "ollama", kind: "branch", label: "auto" },
  { from: "ollama", to: "demo", kind: "error", label: "not running" },
  { from: "api", to: "demo", label: "demo" },
  { from: "demo", to: "roadmap" },
  { from: "roadmap", to: "view" },
];

// ---------- the real demo rules (keywords and difficulty from analyzer.py) ----------
type Rule = { name: string; keywords: string[]; difficulty: string; first: string; skills: string[] };
const RULES: Rule[] = [
  { name: "frontend layout", keywords: ["mobile", "responsive", "navigation", "navbar", "menu", "css", "layout", "viewport", "hamburger", "overflow", "button", "style"], difficulty: "beginner", first: "Reproduce it with the browser's device toolbar at the reported width.", skills: ["HTML", "CSS (media queries, flexbox)", "Browser developer tools"] },
  { name: "crash on bad input", keywords: ["crash", "exception", "traceback", "error", "empty", "submit", "form", "null", "undefined", "typeerror", "500", "fails", "freeze"], difficulty: "beginner", first: "Copy the full stack trace and follow it to the line using the bad value.", skills: ["Error handling", "Input validation", "Reading stack traces"] },
  { name: "python validation", keywords: ["python", "validation", "validate", "function", "argument", "parameter", "type", "negative", "range", "check", "valueerror", "def "], difficulty: "beginner", first: "Write a failing test that passes the invalid value, then add the check.", skills: ["Python", "Exceptions (ValueError)", "pytest or unittest"] },
];
const GENERIC = { name: "general", difficulty: "intermediate", first: "Restate the problem in your own words, then run the project locally and reproduce it.", skills: ["Reading documentation", "Git and GitHub basics", "Debugging"] };

const GITHUB_ISSUE_RE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/(issues|pull)\/\d+\/?$/;

function simulate(v: Record<string, string>): Trace {
  const title = (v.title ?? "").trim();
  const description = (v.description ?? "").trim();
  const url = (v.url ?? "").trim();
  const mode = v.mode === "demo" ? "demo" : "auto";
  const steps: TraceStep[] = [];
  const stop = (node: string, from: string | undefined, why: string, tone: "error" = "error"): Trace => ({
    steps: [...steps, { node, from, title: "Rejected", output: why, tone, slip: "rejected" }],
    result: { tone: "error", title: "The request was rejected", lines: [why, "Nothing was analysed."] },
  });

  steps.push({ node: "form", title: "Issue submitted", input: `title ${title.length} chars, description ${description.length} chars${url ? ", with URL" : ""}`, output: `mode: ${mode}`, slip: "issue" });

  // browser-side checks (script.js)
  if (title.length < 3) return stop("browser", "form", "Please enter an issue title (at least 3 characters).");
  if (description.length < 10) return stop("browser", "form", "Please enter an issue description (at least 10 characters).");
  steps.push({ node: "browser", title: "Browser checks passed", input: "title >= 3, description >= 10", output: "request sent as JSON", slip: "POST" });

  // server-side checks (app.py)
  if (title.length > 200) return stop("api", "browser", "Title must be between 3 and 200 characters.");
  if (description.length > 8000) return stop("api", "browser", "Description must be between 10 and 8000 characters.");
  if (url && !GITHUB_ISSUE_RE.test(url)) return stop("api", "browser", "The URL must look like https://github.com/owner/repo/issues/123 (or leave it empty).");
  steps.push({ node: "api", title: "Server validation passed", input: "title 3-200, description 10-8000, URL pattern, body < 64 KB", output: url ? "URL matches the GitHub issue pattern" : "no URL given, which is allowed", slip: "valid" });

  let notice = "";
  if (mode === "auto") {
    steps.push({ node: "ollama", from: "api", title: "Try the AI model", input: "gemma4:31b-cloud via Ollama", output: "Ollama is not reachable from a web page", tone: "error", note: "The real app runs this on your machine. Here it is shown failing on purpose, which triggers the app's real fallback.", slip: "AI?" });
    notice = "AI analysis unavailable, showing demo guidance instead.";
  }

  // analyze_demo(): count how many keywords of each rule appear
  const text = `${title} ${description}`.toLowerCase();
  const scored = RULES.map((r) => ({ rule: r, hits: r.keywords.filter((k) => text.includes(k)) }));
  const best = scored.reduce((a, b) => (b.hits.length > a.hits.length ? b : a), { rule: null as Rule | null, hits: [] as string[] });
  const chosen = best.rule && best.hits.length >= 2 ? best.rule : GENERIC;
  steps.push({
    node: "demo",
    from: mode === "auto" ? "ollama" : "api",
    title: chosen === GENERIC ? "No rule scored 2 or more" : `Rule matched: ${chosen.name}`,
    input: scored.map((s) => `${s.rule.name}: ${s.hits.length}${s.hits.length ? ` (${s.hits.join(", ")})` : ""}`).join("\n"),
    output: chosen === GENERIC ? "generic guidance, difficulty intermediate" : `score ${best.hits.length}, difficulty ${chosen.difficulty}`,
    tone: chosen === GENERIC ? "branch" : "ok",
    slip: chosen.name,
  });
  steps.push({ node: "roadmap", title: "Roadmap built", output: `difficulty: ${chosen.difficulty}\nskills: ${chosen.skills.join(", ")}`, slip: chosen.difficulty });
  steps.push({ node: "view", title: "Shown with a progress checklist", output: "7 roadmap steps, questions to ask, testing checklist", slip: "done" });

  return {
    steps,
    result: {
      tone: "ok",
      title: `${chosen.difficulty[0].toUpperCase()}${chosen.difficulty.slice(1)}: ${chosen.name}`,
      lines: [`First step: ${chosen.first}`, `Skills: ${chosen.skills.join(", ")}`, ...(notice ? [notice] : []), "Demo-mode guidance is rule-based, not AI, and the app says so."],
    },
  };
}

const mode: Mode = {
  id: "analyze",
  label: "Analyse an issue",
  intro: "Paste a GitHub issue, or pick one of the three built-in samples. Try an empty description to see the checks reject it.",
  fields: [
    { id: "title", label: "Issue title", type: "text", default: "Navigation menu does not open on mobile", hint: "3 to 200 characters" },
    { id: "description", label: "Description", type: "textarea", rows: 4, default: "On screens narrower than 600px, tapping the hamburger button in the top navigation does nothing. The menu stays hidden.", hint: "10 to 8000 characters" },
    { id: "url", label: "Issue URL (optional)", type: "text", placeholder: "https://github.com/owner/repo/issues/123" },
    { id: "mode", label: "Mode", type: "select", default: "auto", options: [{ value: "auto", label: "Auto (try AI, then demo)" }, { value: "demo", label: "Demo only" }] },
  ],
  presets: [
    { label: "Broken mobile menu", values: { title: "Navigation menu does not open on mobile", description: "On screens narrower than 600px, tapping the hamburger button in the top navigation does nothing. The menu stays hidden. On desktop the navigation links display correctly.", url: "", mode: "auto" } },
    { label: "Crash on empty form", values: { title: "App crashes when submitting an empty form", description: "If I click Submit on the contact form without typing anything, the server returns a 500 error and the page shows a traceback. The error is: TypeError: 'NoneType' object has no attribute 'strip'.", url: "", mode: "demo" } },
    { label: "Missing Python validation", values: { title: "calculate_discount() accepts negative percentages", description: "The Python function calculate_discount(price, percent) does not validate its arguments. Passing a negative percent or a percent above 100 returns a nonsense price. Proposal: raise ValueError when percent is outside the range 0-100.", url: "", mode: "demo" } },
    { label: "Vague issue (no rule fits)", values: { title: "Add support for dark colours", description: "It would be great to have a nicer palette for people who read at night.", url: "", mode: "demo" } },
    { label: "Bad URL", values: { title: "Something is broken", description: "Clicking the save icon throws an error in the console.", url: "https://example.com/issue/5", mode: "demo" } },
    { label: "Empty description", values: { title: "Crash", description: "", url: "", mode: "demo" } },
  ],
  simulate,
};

export const opensourceBuddy: SystemDesign = {
  slug: "opensource-buddy",
  title: "How a GitHub issue becomes a beginner roadmap",
  tagline: "Follow an issue through two layers of validation, the AI-or-demo decision and the keyword scoring that picks the roadmap.",
  repo: "OpenSource-Buddy",
  layout: { cols: 6, rows: 3 },
  nodes,
  edges,
  modes: [mode],
  honesty:
    "Runs in your browser and calls no servers. The validation limits, the GitHub URL pattern, the keyword lists and the score-of-2 threshold are copied from the real Python code. The Ollama AI model is not run: auto mode shows it failing, which is the real fallback path, so every answer here is demo-mode guidance.",
};
