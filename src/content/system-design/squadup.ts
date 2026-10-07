import type { ArchEdge, ArchNode, Mode, SystemDesign, Trace, TraceStep } from "./types";

// SquadUp (GamePool): players list a game they want, a budget and how many people they need to
// split it; the app finds other players whose wishlist matches.
//
// Ported from the real code (repo SquadUp):
//   src/lib/similarity.ts   alias database, Levenshtein distance, gameNameMatchScore()
//   src/app/(dashboard)/matches/page.tsx   the 50/30/20 scoring and the minimum score of 20
// NOT run here: Firebase Auth and Firestore. The "board" below holds invented sample players, and
// the alias list is a short excerpt of the real one.

const nodes: ArchNode[] = [
  { id: "form", label: "Wishlist entry", sub: "game + budget", kind: "client", col: 0, row: 1, blurb: "You add a game you want, the most you will pay as your share, and how many players you need to split the cost.", tech: "Next.js 16, React 19", source: "src/app/(dashboard)/wishlist/page.tsx" },
  { id: "alias", label: "Alias lookup", sub: "free \"AI\"", kind: "logic", col: 1, row: 1, blurb: "Turns abbreviations into one canonical name using an alias database, so \"cs2\", \"csgo\" and \"counter strike\" are all the same game. No AI service or API key involved.", tech: "TypeScript", source: "src/lib/similarity.ts" },
  { id: "board", label: "Active wishlists", sub: "Firestore", kind: "data", col: 2, row: 1, blurb: "Every other player's active wishlist entry (up to 200) is read from Firestore.", tech: "Firebase Firestore", source: "src/lib/db.ts" },
  { id: "name", label: "Game name match", sub: "50% of score", kind: "logic", col: 3, row: 0, blurb: "Compares the two canonical names: same name 100, one contains the other 85, then fuzzy Levenshtein similarity above 0.8 gives 75, above 0.6 gives 50, above 0.4 gives 25, otherwise 0 and the candidate is skipped.", tech: "Levenshtein distance", source: "src/lib/similarity.ts" },
  { id: "score", label: "Budget + players", sub: "30% and 20%", kind: "logic", col: 3, row: 2, blurb: "Budget score is 30 minus the budget gap as a share of the larger budget, times 30 (never below 0). Player score is 20 for the same count, 10 for a difference of one, otherwise 0.", tech: "TypeScript", source: "src/app/(dashboard)/matches/page.tsx" },
  { id: "rank", label: "Rank matches", sub: "keep 20 or more", kind: "logic", col: 4, row: 1, blurb: "Total = name score x 0.5 + budget score + player score, rounded and capped at 100. Anything below 20 is dropped and the rest are sorted best first.", tech: "TypeScript", source: "src/app/(dashboard)/matches/page.tsx" },
  { id: "group", label: "Form a group", sub: "chat + split", kind: "service", col: 5, row: 1, blurb: "A match can be turned into a group with a shared chat and a cost split per person.", tech: "Firestore groups", source: "src/lib/db.ts" },
];

const edges: ArchEdge[] = [
  { from: "form", to: "alias" },
  { from: "alias", to: "board" },
  { from: "board", to: "name" },
  { from: "name", to: "score" },
  { from: "score", to: "rank" },
  { from: "rank", to: "group" },
];

// ---------- ported from similarity.ts (alias list is an excerpt) ----------
const ALIASES: Record<string, string[]> = {
  minecraft: ["mc", "minecraft java", "minecraft bedrock", "mcpe"],
  fortnite: ["fn", "fort", "fortnite battle royale"],
  valorant: ["valo", "val"],
  "counter-strike 2": ["cs2", "cs", "counter strike", "csgo", "cs:go", "counter-strike"],
  "apex legends": ["apex", "apex leg"],
  "grand theft auto v": ["gta", "gta v", "gta 5", "gta online", "gtav", "gta5"],
  "league of legends": ["lol", "league"],
  "dota 2": ["dota", "dota2"],
  "rocket league": ["rl", "rocket"],
  "among us": ["among", "amogus", "sus"],
  "rainbow six siege": ["r6", "r6s", "siege", "rainbow six", "rainbow 6"],
  "lethal company": ["lethal", "lc"],
  "elden ring": ["elden", "er"],
  "it takes two": ["itt", "it takes 2"],
};

function normalize(input: string): string {
  const c = input.toLowerCase().trim();
  if (ALIASES[c]) return c;
  for (const [canon, list] of Object.entries(ALIASES)) if (list.includes(c)) return canon;
  return c;
}

function levenshtein(a: string, b: string): number {
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++)
    for (let j = 1; j <= a.length; j++)
      m[i][j] = b.charAt(i - 1) === a.charAt(j - 1) ? m[i - 1][j - 1] : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
  return m[b.length][a.length];
}

function similarity(a: string, b: string): number {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  if (x === y) return 1;
  if (!x.length || !y.length) return 0;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

function nameScore(a: string, b: string): { score: number; why: string } {
  const x = normalize(a);
  const y = normalize(b);
  if (x === y) return { score: 100, why: `same canonical name "${x}"` };
  if (x.includes(y) || y.includes(x)) return { score: 85, why: `"${x}" and "${y}": one contains the other` };
  const s = similarity(x, y);
  const pct = s.toFixed(2);
  if (s > 0.8) return { score: 75, why: `similarity ${pct} > 0.8` };
  if (s > 0.6) return { score: 50, why: `similarity ${pct} > 0.6` };
  if (s > 0.4) return { score: 25, why: `similarity ${pct} > 0.4` };
  return { score: 0, why: `similarity ${pct}, too different` };
}

// ---------- invented sample board ----------
type Entry = { who: string; game: string; budget: number; players: number };
const BOARD: Entry[] = [
  { who: "Riya", game: "cs2", budget: 500, players: 4 },
  { who: "Kabir", game: "Counter Strike", budget: 350, players: 5 },
  { who: "Meera", game: "Minecraft", budget: 600, players: 4 },
  { who: "Dev", game: "Apex", budget: 0, players: 3 },
  { who: "Sana", game: "Lethal Company", budget: 200, players: 4 },
  { who: "Arjun", game: "Counterstrike 2", budget: 450, players: 2 },
  { who: "Isha", game: "GTA 5", budget: 800, players: 4 },
];

function simulate(v: Record<string, string>): Trace {
  const game = (v.game ?? "").trim();
  const budget = Number(v.budget || 0);
  const players = Number(v.players || 0);
  const steps: TraceStep[] = [];

  steps.push({ node: "form", title: "Wishlist entry added", input: `game "${game}", max share ₹${budget}, ${players} players`, slip: game || "?" });
  if (!game || Number.isNaN(budget) || Number.isNaN(players) || budget < 0 || players < 1) {
    steps.push({ node: "form", title: "Not valid", output: "Enter a game name, a budget of 0 or more and at least 1 player.", tone: "error", slip: "rejected" });
    return { steps, result: { tone: "error", title: "Nothing to match", lines: ["Enter a game name, a budget of 0 or more and at least 1 player."] } };
  }

  const mine = normalize(game);
  steps.push({ node: "alias", title: mine === game.toLowerCase().trim() ? "No alias found" : "Alias resolved", input: game, output: `canonical name: "${mine}"`, slip: mine });
  steps.push({ node: "board", title: "Other players' entries read", output: `${BOARD.length} sample entries (invented)\n${BOARD.map((e) => `${e.who}: ${e.game}`).join("\n")}`, slip: `${BOARD.length} entries` });

  const rows = BOARD.map((e) => {
    const n = nameScore(game, e.game);
    const diff = Math.abs(budget - e.budget);
    const max = Math.max(budget, e.budget, 1);
    const b = Math.max(0, 30 - (diff / max) * 30);
    const pd = Math.abs(players - e.players);
    const p = pd === 0 ? 20 : pd === 1 ? 10 : 0;
    const total = Math.round(n.score * 0.5 + b + p);
    return { e, n, b, p, total: Math.min(total, 100) };
  });

  steps.push({
    node: "name",
    title: "Names compared",
    input: rows.map((r) => `${r.e.who}: "${r.e.game}"`).join("\n"),
    output: rows.map((r) => `${r.e.who}: ${r.n.score}${r.n.score === 0 ? " (skipped)" : ""}  ${r.n.why}`).join("\n"),
    note: "A name score of 0 skips the candidate before anything else is calculated.",
    slip: "names",
  });
  const alive = rows.filter((r) => r.n.score > 0);
  steps.push({
    node: "score",
    title: "Budget and player counts compared",
    output: alive.length
      ? alive.map((r) => `${r.e.who}: budget ${r.b.toFixed(1)}/30 (₹${r.e.budget}), players ${r.p}/20 (${r.e.players})`).join("\n")
      : "no candidate survived the name check",
    slip: "30 + 20",
  });
  const kept = alive.filter((r) => r.total >= 20).sort((a, b) => b.total - a.total);
  steps.push({
    node: "rank",
    title: kept.length ? "Matches ranked" : "No match reached 20",
    output: alive.map((r) => `${r.e.who}: ${r.n.score} x 0.5 + ${r.b.toFixed(1)} + ${r.p} = ${r.total}${r.total >= 20 ? "" : "  (dropped, under 20)"}`).join("\n") || "nothing to rank",
    tone: kept.length ? "ok" : "branch",
    slip: kept.length ? `${kept[0].total}%` : "none",
  });

  if (!kept.length) {
    return { steps, result: { tone: "info", title: "No players to team up with yet", lines: ["No sample entry matched your game closely enough.", "Try \"cs\", \"gta\" or \"minecraft\"."] } };
  }
  steps.push({ node: "group", title: "Ready to form a group", output: `best match: ${kept[0].e.who} at ${kept[0].total}% compatibility`, slip: kept[0].e.who });
  return {
    steps,
    result: {
      tone: "ok",
      title: `${kept.length} match${kept.length > 1 ? "es" : ""}, best is ${kept[0].e.who} at ${kept[0].total}%`,
      lines: kept.map((r) => `${r.e.who} (${r.e.game}): ${r.total}%`),
    },
  };
}

const mode: Mode = {
  id: "match",
  label: "Find teammates",
  intro: "Type a game by its nickname, a budget and a player count. The real alias list and scoring decide who matches.",
  fields: [
    { id: "game", label: "Game", type: "text", default: "csgo", placeholder: "cs2, gta, minecraft..." },
    { id: "budget", label: "Max share (₹)", type: "number", default: "400" },
    { id: "players", label: "Players needed", type: "number", default: "4" },
  ],
  presets: [
    { label: "csgo, ₹400, 4 players", values: { game: "csgo", budget: "400", players: "4" } },
    { label: "gta, ₹800, 4 players", values: { game: "gta", budget: "800", players: "4" } },
    { label: "Misspelled: minecrft", values: { game: "minecrft", budget: "600", players: "4" } },
    { label: "Free game, ₹0", values: { game: "apex", budget: "0", players: "3" } },
    { label: "Nobody plays this", values: { game: "Hollow Knight", budget: "300", players: "2" } },
  ],
  simulate,
};

export const squadup: SystemDesign = {
  slug: "squadup",
  title: "How a wishlist entry finds the people to split the game with",
  tagline: "Follow an entry through the alias database, the fuzzy name match and the 50/30/20 scoring that ranks teammates.",
  repo: "SquadUp",
  layout: { cols: 6, rows: 3 },
  nodes,
  edges,
  modes: [mode],
  honesty:
    "Runs in your browser and calls no servers. The alias lookup, the Levenshtein name scoring, the 50/30/20 weights and the minimum score of 20 are ported from the real code, and the alias list here is a shortened excerpt. Firebase is not used: the other players on the board are invented sample entries.",
};
