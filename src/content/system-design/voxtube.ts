import type { ArchEdge, ArchNode, Mode, SystemDesign, Trace, TraceStep } from "./types";

// VoxTube: a video link goes through an Express proxy (validation, rate limit, security headers),
// a Cloudflare Turnstile bot check, a Supabase cache, the YouTube/Reddit fetch, one batched Gemini
// classification call and a summary, then the result is cached and returned.
//
// Taken from the real repo (voxtube): README sequence diagram, server/src/index.js limits,
// services/aiService.js (batched array codes), database/schema.sql (cache table).
// NOT run here: Turnstile, Supabase, YouTube, Reddit or Gemini. The "cache" below lives in this
// page's memory and the comments and counts are invented sample data.

const nodes: ArchNode[] = [
  { id: "client", label: "Paste a link", sub: "React + Vite", kind: "client", col: 0, row: 1, blurb: "You paste a YouTube video or Reddit thread URL. The browser also gets a Turnstile token to prove it is not a bot, and sends both to the backend.", tech: "React 19, Vite", source: "client/src/App.jsx" },
  { id: "express", label: "Express proxy", sub: "validate + limit", kind: "security", col: 1, row: 1, blurb: "A secure proxy so no API keys ever reach the browser. It checks the URL is a string under 500 characters, caps the JSON body at 10 kb, allows 30 analyze calls per 15 minutes per IP, and sets 11 security headers with Helmet.", tech: "Express, Helmet, express-rate-limit", source: "server/src/index.js" },
  { id: "turnstile", label: "Bot check", sub: "Cloudflare Turnstile", kind: "security", col: 2, row: 1, blurb: "The server posts the token to Cloudflare's siteverify endpoint. A failed check stops the request before any paid API is touched.", tech: "Cloudflare Turnstile", source: "server/src/index.js" },
  { id: "cache", label: "Cache lookup", sub: "Supabase Postgres", kind: "data", col: 3, row: 1, blurb: "The primary gatekeeper: a row for this video means the analysis is returned immediately. A cached row whose summary is corrupted gets purged and re-analysed (the self-healing fix added after a quota incident).", tech: "Supabase Postgres", source: "server/src/utils/supabase.js" },
  { id: "source", label: "Fetch comments", sub: "YouTube / Reddit", kind: "external", col: 4, row: 0, blurb: "On a cache miss it pulls the video details and up to 300 comments from the YouTube Data API, or a thread from Reddit.", tech: "YouTube Data API v3, Reddit", source: "server/src/services/youtubeService.js" },
  { id: "gemini", label: "Gemini", sub: "flash-lite, batched", kind: "ai", col: 4, row: 2, blurb: "All comments are classified in one call using compressed array codes like [\"c1\",\"POS\",\"Q\"] instead of verbose JSON, which cuts tokens by roughly three quarters. A second call writes the markdown summary.", tech: "gemini-2.5-flash-lite", source: "server/src/services/aiService.js" },
  { id: "store", label: "Save + respond", sub: "cache write", kind: "service", col: 5, row: 1, blurb: "The analysed comments and the summary are written to the cache, then returned to the browser, which draws the sentiment charts.", tech: "Express + Supabase", source: "server/src/index.js" },
];

const edges: ArchEdge[] = [
  { from: "client", to: "express" },
  { from: "express", to: "turnstile" },
  { from: "turnstile", to: "cache" },
  { from: "cache", to: "source", kind: "branch", label: "miss" },
  { from: "source", to: "gemini" },
  { from: "gemini", to: "store" },
  { from: "cache", to: "store", kind: "branch", label: "hit" },
];

// ---------- in-memory stand-in for the Supabase cache (lives as long as this page) ----------
const cache = new Set<string>();

// Invented sample comments, tagged with the same kind of compressed codes the real prompt returns.
const SAMPLE: { id: string; text: string; code: string }[] = [
  { id: "c1", text: "This explained it better than my lecture did.", code: "POS" },
  { id: "c2", text: "Audio drops out around the 4 minute mark.", code: "NEG" },
  { id: "c3", text: "What version are you using in the demo?", code: "Q" },
  { id: "c4", text: "first", code: "NOISE" },
  { id: "c5", text: "Would love a follow-up on deployment.", code: "REQ" },
  { id: "c6", text: "Great pacing, subscribed.", code: "POS" },
];

function parseUrl(url: string): { kind: "youtube" | "reddit"; id: string } | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return /^[\w-]{11}$/.test(id) ? { kind: "youtube", id } : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:shorts|embed)\/([\w-]{11})/)?.[1] ?? "";
    return /^[\w-]{11}$/.test(id) ? { kind: "youtube", id } : null;
  }
  if (host === "reddit.com" || host === "old.reddit.com") {
    const id = u.pathname.match(/\/comments\/(\w+)/)?.[1];
    return id ? { kind: "reddit", id } : null;
  }
  return null;
}

function simulate(v: Record<string, string>): Trace {
  const url = (v.url ?? "").trim();
  const used = Number(v.calls ?? "0");
  const bot = v.bot === "fail";
  const corrupt = v.corrupt === "yes";
  const steps: TraceStep[] = [];
  const reject = (node: string, from: string, title: string, why: string): Trace => ({
    steps: [...steps, { node, from, title, output: why, tone: "error", slip: "rejected" }],
    result: { tone: "error", title: "The proxy refused the request", lines: [why, "No YouTube or AI quota was spent."] },
  });

  steps.push({ node: "client", title: "Link sent", input: url.length > 70 ? `${url.slice(0, 70)}... (${url.length} chars)` : url || "(empty)", output: "POST /api/analyze { url, turnstileToken }", slip: "URL" });

  // Express: URL checks, then the rate limit
  if (!url) return reject("express", "client", "URL missing", "A URL is required.");
  if (url.length >= 500) return reject("express", "client", "URL too long", `The URL is ${url.length} characters; the limit is under 500.`);
  if (used >= 30) return reject("express", "client", "Rate limit hit (429)", "30 analyze calls per 15 minutes per IP is the limit, and this IP already used them.");
  const parsed = parseUrl(url);
  if (!parsed) return reject("express", "client", "Not a supported link", "Paste a YouTube video or Reddit thread link. (This demo's link parsing is simplified.)");
  steps.push({ node: "express", title: "Request accepted", input: "string, under 500 chars, body under 10 kb", output: `${parsed.kind} id: ${parsed.id}\ncalls used: ${used + 1} of 30 in this window`, slip: parsed.id });

  // Turnstile
  if (bot) return reject("turnstile", "express", "Bot check failed", "Cloudflare's siteverify rejected the token, so the request stops here.");
  steps.push({ node: "turnstile", title: "Human check passed", output: "siteverify: success", slip: "human" });

  // Cache
  const key = `${parsed.kind}:${parsed.id}`;
  let healed = false;
  if (cache.has(key) && corrupt) {
    cache.delete(key);
    healed = true;
  }
  if (cache.has(key)) {
    steps.push({ node: "cache", title: "Cache hit", input: `SELECT * FROM videos WHERE id = '${parsed.id}'`, output: "row found with a healthy summary, no API calls", tone: "branch", slip: "hit" });
    steps.push({ node: "store", from: "cache", title: "Returned from cache", output: "the real README measures this path in tens of milliseconds, here it is instant", slip: "cached" });
    return {
      steps,
      result: { tone: "ok", title: "Served from the cache", lines: ["Zero YouTube calls, zero Gemini calls.", "Tick \"cached row is corrupt\" and send again to see the self-healing path."] },
    };
  }
  steps.push({
    node: "cache",
    title: healed ? "Corrupt row purged" : "Cache miss",
    input: `SELECT * FROM videos WHERE id = '${parsed.id}'`,
    output: healed ? "cached summary was an error, row deleted, analysing again" : "no row, so the full pipeline runs",
    tone: "branch",
    note: healed ? "After a free-tier quota error once cached everything as noise, the real server learned to delete bad rows instead of serving them." : undefined,
    slip: healed ? "purge" : "miss",
  });

  // Fetch
  steps.push({ node: "source", from: "cache", title: parsed.kind === "youtube" ? "Comments fetched" : "Thread fetched", input: parsed.kind === "youtube" ? "YouTube Data API, up to 300 comments" : "Reddit thread", output: `${SAMPLE.length} sample comments here (invented)`, slip: `${SAMPLE.length} cmts` });

  // Gemini
  steps.push({
    node: "gemini",
    title: "One batched classification call",
    input: SAMPLE.map((c) => `${c.id}: ${c.text}`).join("\n"),
    output: JSON.stringify(SAMPLE.map((c) => [c.id, c.code])),
    note: "The real call sends up to 300 comments in one request and gets back compact [id, code] pairs. These codes are hard-coded for the demo.",
    slip: "codes",
  });
  const counts = SAMPLE.reduce<Record<string, number>>((m, c) => ({ ...m, [c.code]: (m[c.code] ?? 0) + 1 }), {});
  steps.push({ node: "gemini", title: "Summary written", output: `General Consensus / Top Loves / Critiques\n(${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(", ")})`, note: "A second Gemini call writes the markdown summary. Not generated here.", slip: "summary" });

  cache.add(key);
  steps.push({ node: "store", from: "gemini", title: "Saved and returned", input: "INSERT video + analysed comments", output: "next request for this link will be a cache hit", slip: "saved" });

  return {
    steps,
    result: { tone: "ok", title: "Analysed and cached", lines: [`Sample sentiment: ${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(", ")}.`, "Send the same link again to see the cache hit."] },
  };
}

const YT = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const mode: Mode = {
  id: "analyze",
  label: "Analyse a link",
  intro: "Send a link, then send the same one again. The second request never reaches YouTube or Gemini.",
  fields: [
    { id: "url", label: "Video or thread link", type: "text", default: YT, placeholder: "https://www.youtube.com/watch?v=..." },
    { id: "calls", label: "Calls this IP already made in 15 min", type: "select", default: "0", options: [{ value: "0", label: "0" }, { value: "29", label: "29" }, { value: "30", label: "30 (limit reached)" }] },
    { id: "bot", label: "Bot check", type: "select", default: "pass", options: [{ value: "pass", label: "Human (passes)" }, { value: "fail", label: "Bot (fails)" }] },
    { id: "corrupt", label: "Cached row is corrupt", type: "select", default: "no", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes (self-heal)" }] },
  ],
  presets: [
    { label: "YouTube video", values: { url: YT, calls: "0", bot: "pass", corrupt: "no" } },
    { label: "Same link again (cache hit)", values: { url: YT, calls: "0", bot: "pass", corrupt: "no" } },
    { label: "Cache row is corrupt", values: { url: YT, calls: "0", bot: "pass", corrupt: "yes" } },
    { label: "Reddit thread", values: { url: "https://www.reddit.com/r/webdev/comments/1abc23/what_are_you_building/", calls: "0", bot: "pass", corrupt: "no" } },
    { label: "Not a video link", values: { url: "https://example.com/video", calls: "0", bot: "pass", corrupt: "no" } },
    { label: "Over the rate limit", values: { url: YT, calls: "30", bot: "pass", corrupt: "no" } },
    { label: "A bot", values: { url: YT, calls: "0", bot: "fail", corrupt: "no" } },
    { label: "500+ character URL", values: { url: `https://example.com/${"a".repeat(520)}`, calls: "0", bot: "pass", corrupt: "no" } },
  ],
  simulate,
};

export const voxtube: SystemDesign = {
  slug: "voxtube",
  title: "How one pasted link becomes a sentiment report without wasting quota",
  tagline: "Follow a link through the Express proxy, the bot check, the cache gatekeeper, the batched Gemini call and back.",
  repo: "voxtube",
  layout: { cols: 6, rows: 3 },
  nodes,
  edges,
  modes: [mode],
  honesty:
    "Runs in your browser and calls no servers. The 500-character URL limit, 10 kb body limit, 30-calls-per-15-minutes rate limit, the order of stages, the cache hit, miss and self-healing flow, and the batched array-code approach come from the real code and README. YouTube, Reddit, Turnstile, Supabase and Gemini are not called: the cache is this page's memory, and the comments and their labels are invented samples. Link parsing here is simplified.",
};
