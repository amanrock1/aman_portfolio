import type { ArchEdge, ArchNode, Mode, SystemDesign, Trace, TraceStep } from "./types";

// 360 Campus Tour: a browser tour made of 70 panorama scenes linked by clickable hotspots, with a
// virtual guide video whose green background is removed live on a canvas.
//
// Taken from the real code (repo 360-VIRTUAL-CAMPUR-TOUR, "campus tour.html"):
//   - the 70 scenes and which scene each hotspot opens (the graph below was extracted from it)
//   - the chroma-key rule and the 640 px canvas cap
// The real tour has no route finder: you click hotspots one by one. The "Plan a route" mode is a
// shortest-path search run over the real scene graph, so you can see how the 70 scenes connect.
// NOT run here: Pannellum, the panoramas or the guide video.

// scene id -> [title, scene ids its hotspots open]. Extracted from tourConfig.scenes.
const GRAPH: Record<string, [string, string[]]> = {
  "exit 1": ["Exit 1", ["exit 2"]],
  "exit 2": ["Exit 2", ["exit 1","flag","all path"]],
  "flag": ["Flag", ["exit 2"]],
  "all path": ["All Path", ["exit 2","ab 4","ab 3"]],
  "ab 3": ["AB 3", ["all path","ab 2"]],
  "ab 2": ["AB 2", ["ab 3","ab 1"]],
  "ab 1": ["AB 1", ["ab 2","main mid"]],
  "main mid": ["Main Mid", ["ab 1","parcel 1","girls 21"]],
  "parcel 1": ["Parcel 1", ["main mid","parcel 2"]],
  "parcel 2": ["Parcel 2", ["parcel 1"]],
  "girls 21": ["Girls 21", ["main mid","girls 20"]],
  "girls 20": ["Girls 20", ["girls 21","girls 18"]],
  "girls 18": ["Girls 18", ["girls 20","girls 17"]],
  "girls 17": ["Girls 17", ["girls 18","girls 16"]],
  "girls 16": ["Girls 16", ["girls 17","girls 15"]],
  "girls 15": ["Girls 15", ["girls 16","girls 14"]],
  "girls 14": ["Girls 14", ["girls 15","girls 13"]],
  "girls 13": ["Girls 13", ["girls 14","girls 12"]],
  "girls 12": ["Girls 12", ["girls 13","girls 11"]],
  "girls 11": ["Girls 11", ["girls 12","girls 10"]],
  "girls 10": ["Girls 10", ["girls 11","girls 9"]],
  "girls 9": ["Girls 9", ["girls 10","girls 8"]],
  "girls 8": ["Girls 8", ["girls 9","girls 7"]],
  "girls 7": ["Girls 7", ["girls 8","girls 6"]],
  "girls 6": ["Girls 6", ["girls 7","girls 5"]],
  "girls 5": ["Girls 5", ["girls 6","girls 4"]],
  "girls 4": ["Girls 4", ["girls 5","girls 3"]],
  "girls 3": ["Girls 3", ["girls 4","girls 2"]],
  "girls 2": ["Girls 2", ["girls 3","girls 1"]],
  "girls 1": ["Girls 1", ["girls 2","hostel start 2"]],
  "hostel start 2": ["Hostel Start 2", ["ab2  1","girls 1"]],
  "ab2  1": ["AB 2 1", ["hostel start 2","ab2  2"]],
  "ab2  2": ["AB 2 2", ["ab2  1","ab2  3"]],
  "ab2  3": ["AB 2 3", ["ab2  2","ab2  5"]],
  "ab2  5": ["AB 2 5", ["ab2  3","ab2  6"]],
  "ab2  6": ["AB 2 6", ["ab2  5","ab2  7"]],
  "ab2  7": ["AB 2 7", ["ab2  6","ab2  8"]],
  "ab2  8": ["AB 2 8", ["ab2  7","ab 2 gate 9"]],
  "ab 2 gate 9": ["AB 2 9", ["ab2  8"]],
  "ab 4": ["AB 4", ["all path","ab 5"]],
  "ab 5": ["AB 5", ["ab 4","ab 6"]],
  "ab 6": ["AB 6", ["ab 5","ab 7","mph 1"]],
  "mph 1": ["MPH 1", ["ab 6","mph 2"]],
  "mph 2": ["MPH 2", ["mph 1","mph 3"]],
  "mph 3": ["MPH 3", ["mph 2","mph 4"]],
  "mph 4": ["MPH 4", ["mph 3","lion park"]],
  "lion park": ["Lion Park", ["mph 4"]],
  "ab 7": ["AB 7", ["ab 6","ab 9"]],
  "ab 9": ["AB 9", ["ab 7","ab 10"]],
  "ab 10": ["AB 10", ["ab 9","ab 11"]],
  "ab 11": ["AB 11", ["ab 10","ab 12"]],
  "ab 12": ["AB 12", ["ab 11","ab 13"]],
  "ab 13": ["AB 13", ["ab 12","ab 14"]],
  "ab 14": ["AB 14", ["ab 13","ab 15"]],
  "ab 15": ["AB 15", ["ab front gate 1","ab 14","ab 16"]],
  "ab front gate 1": ["AB Front Gate 1", ["ab 15","ab front gate 2"]],
  "ab front gate 2": ["AB Front Gate 2", ["ab front gate 1"]],
  "ab 16": ["AB 16", ["ab 15","ab 17"]],
  "ab 17": ["AB 17", ["ab 16","ab 18"]],
  "ab 18": ["AB 18", ["ab 17","ab 19"]],
  "ab 19": ["AB 19", ["ab 18","ab back gate 3","lc 1"]],
  "ab back gate 3": ["AB Back 3", ["ab back gate 2","ab 19"]],
  "ab back gate 2": ["AB Back 2", ["ab back gate 3","ab back gate 1"]],
  "ab back gate 1": ["AB Back 1", ["ab back gate 2"]],
  "lc 1": ["LC 1", ["lc 2","ab 19"]],
  "lc 2": ["LC 2", ["lc 1","arch 1","lc 3"]],
  "arch 1": ["Arch 1", ["lc 2"]],
  "lc 3": ["LC 3", ["lc 2","lc 4"]],
  "lc 4": ["LC 4", ["lc 3","lc 5"]],
  "lc 5": ["LC 5", ["lc 4"]],
};

const nodes: ArchNode[] = [
  { id: "pick", label: "Choose scenes", sub: "start and goal", kind: "client", col: 0, row: 1, blurb: "You choose where you are standing and where you want to go. In the real tour you would click hotspots one at a time.", tech: "Plain HTML page", source: "campus tour.html" },
  { id: "graph", label: "Scene graph", sub: "70 scenes", kind: "data", col: 1, row: 1, blurb: "Every scene lists its hotspots, and each hotspot names the scene it opens. Together they form a graph of 70 places.", tech: "tourConfig.scenes", source: "campus tour.html" },
  { id: "route", label: "Route finder", sub: "breadth-first search", kind: "logic", col: 2, row: 1, blurb: "Explores outward one hop at a time from the start until it reaches the goal, which guarantees the fewest hotspot clicks. This station is a demo built on the real graph, the shipped tour does not have it.", tech: "BFS", source: "campus tour.html" },
  { id: "viewer", label: "Panorama viewer", sub: "Pannellum 2.5.6", kind: "service", col: 3, row: 1, blurb: "Pannellum draws the equirectangular panorama and the hotspots. Each hotspot's arrival direction is worked out automatically from the matching hotspot in the target scene.", tech: "Pannellum 2.5.6", source: "campus tour.html" },
  { id: "video", label: "Guide video", sub: "green screen", kind: "external", col: 4, row: 0, blurb: "Some scenes play a guide video recorded on a green background.", tech: "HTML video", source: "campus tour.html" },
  { id: "chroma", label: "Chroma key", sub: "per pixel", kind: "logic", col: 4, row: 2, blurb: "Every frame is drawn to a canvas capped at 640 px wide and each pixel is tested: if green clearly beats red and blue, the pixel is made transparent, with soft edges for in-between greens.", tech: "Canvas getImageData", source: "campus tour.html" },
  { id: "canvas", label: "Overlay canvas", sub: "guide on the scene", kind: "client", col: 5, row: 1, blurb: "The processed canvas is shown on top of the panorama so the guide appears to stand inside the campus.", tech: "Canvas 2D", source: "campus tour.html" },
];

const edges: ArchEdge[] = [
  { from: "pick", to: "graph" },
  { from: "graph", to: "route" },
  { from: "route", to: "viewer" },
  { from: "viewer", to: "video", kind: "branch", label: "guide scene" },
  { from: "video", to: "chroma" },
  { from: "chroma", to: "canvas" },
];

const title = (id: string) => GRAPH[id][0];

function bfs(from: string, to: string) {
  const prev: Record<string, string | null> = { [from]: null };
  const queue = [from];
  let explored = 0;
  while (queue.length) {
    const x = queue.shift() as string;
    explored++;
    if (x === to) break;
    for (const t of GRAPH[x][1]) {
      if (!(t in prev)) {
        prev[t] = x;
        queue.push(t);
      }
    }
  }
  if (!(to in prev)) return null;
  const path: string[] = [];
  for (let x: string | null = to; x !== null; x = prev[x]) path.unshift(x);
  return { path, explored };
}

function simulateRoute(v: Record<string, string>): Trace {
  const from = v.from;
  const to = v.to;
  if (!GRAPH[from] || !GRAPH[to]) {
    return { steps: [{ node: "pick", title: "Pick two scenes", tone: "error", slip: "?" }], result: { tone: "error", title: "Pick a start and a goal", lines: [] } };
  }
  const edgesTotal = Object.values(GRAPH).reduce((n, [, to2]) => n + to2.length, 0);
  const steps: TraceStep[] = [
    { node: "pick", title: "Scenes chosen", input: `from: ${title(from)}\nto: ${title(to)}`, slip: title(to) },
    { node: "graph", title: "Graph loaded", output: `${Object.keys(GRAPH).length} scenes, ${edgesTotal} hotspot links\n${title(from)} has ${GRAPH[from][1].length} hotspot${GRAPH[from][1].length === 1 ? "" : "s"}: ${GRAPH[from][1].map(title).join(", ")}`, slip: "70" },
  ];
  if (from === to) {
    steps.push({ node: "route", title: "Already there", output: "0 hops", tone: "branch", slip: "0" });
    return { steps, result: { tone: "info", title: "You are already in that scene", lines: [] } };
  }
  const r = bfs(from, to);
  if (!r) {
    steps.push({ node: "route", title: "No route", tone: "error", slip: "none" });
    return { steps, result: { tone: "error", title: "No route found", lines: [] } };
  }
  const hops = r.path.length - 1;
  steps.push({
    node: "route",
    title: `Shortest route: ${hops} hop${hops === 1 ? "" : "s"}`,
    input: "queue the start, visit neighbours one hop at a time until the goal is reached",
    output: `scenes visited by the search: ${r.explored}\n${r.path.length > 14 ? `${r.path.slice(0, 6).map(title).join(" > ")} > ... > ${r.path.slice(-4).map(title).join(" > ")}` : r.path.map(title).join(" > ")}`,
    slip: `${hops} hops`,
  });
  steps.push({ node: "viewer", title: "Walk the route", output: `${hops} hotspot click${hops === 1 ? "" : "s"}, each one loads the next panorama and turns the view toward the way ahead`, slip: title(to) });
  return {
    steps,
    result: { tone: "ok", title: `${hops} hop${hops === 1 ? "" : "s"} from ${title(from)} to ${title(to)}`, lines: [r.path.length > 14 ? `${r.path.slice(0, 6).map(title).join(" > ")} > ... > ${r.path.slice(-4).map(title).join(" > ")}` : r.path.map(title).join(" > "), "A visitor would click each of these hotspots in the real tour."] },
  };
}

// ---------- chroma key: the exact per-pixel rule ----------
function simulatePixel(v: Record<string, string>): Trace {
  const hex = /^#[0-9a-fA-F]{6}$/.test(v.color ?? "") ? v.color : "#00ff00";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const maxRB = Math.max(r, b);
  const keyed = g > maxRB + 20 && g > 70;
  const dominance = g - maxRB;
  let alpha = 255;
  let why = "green does not beat red and blue by more than 20, so the pixel is kept";
  if (keyed) {
    if (dominance > 45) {
      alpha = 0;
      why = `green leads by ${dominance} (more than 45): fully transparent`;
    } else {
      alpha = Math.max(0, Math.trunc(255 - (dominance - 20) * 10));
      why = `green leads by ${dominance} (20 to 45): partly transparent, a soft edge`;
    }
  } else if (g > maxRB + 20) {
    why = "green leads but g is 70 or less, so it is too dark to be the green screen and is kept";
  }
  const steps: TraceStep[] = [
    { node: "video", from: "viewer", title: "One pixel of the guide video", output: `r ${r}, g ${g}, b ${b}\n${hex}`, slip: hex },
    { node: "chroma", title: keyed ? (alpha === 0 ? "Removed" : "Softened") : "Kept", input: `maxRB = max(r, b) = ${maxRB}\ng > maxRB + 20 ? ${g} > ${maxRB + 20}\ng > 70 ? ${g} > 70`, output: `alpha = ${alpha}\n${why}`, tone: keyed ? "branch" : "ok", note: "Frames are drawn to a canvas at most 640 px wide, so this test runs on a modest number of pixels.", slip: `alpha ${alpha}` },
    { node: "canvas", title: alpha === 0 ? "Pixel is see-through" : alpha === 255 ? "Pixel is drawn as is" : "Pixel is blended", output: `alpha ${alpha} of 255 (${Math.round((alpha / 255) * 100)}% visible)`, slip: `${Math.round((alpha / 255) * 100)}%` },
  ];
  return { steps, result: { tone: "ok", title: alpha === 0 ? "Pixel removed" : alpha === 255 ? "Pixel kept" : `Pixel ${Math.round((alpha / 255) * 100)}% visible`, lines: [why] } };
}

const routeMode: Mode = {
  id: "route",
  label: "Plan a route",
  intro: "Pick two of the 70 scenes. A breadth-first search over the real hotspot graph finds the fewest clicks between them.",
  fields: [
    { id: "from", label: "From", type: "select", default: "exit 1", options: Object.entries(GRAPH).map(([id, [t]]) => ({ value: id, label: t })) },
    { id: "to", label: "To", type: "select", default: "lc 5", options: Object.entries(GRAPH).map(([id, [t]]) => ({ value: id, label: t })) },
  ],
  presets: [
    { label: "Exit 1 to LC 5", values: { from: "exit 1", to: "lc 5" } },
    { label: "Opposite ends", values: { from: "ab 2 gate 9", to: "lc 5" } },
    { label: "Next door", values: { from: "exit 1", to: "exit 2" } },
    { label: "Same scene", values: { from: "flag", to: "flag" } },
  ],
  simulate: simulateRoute,
};

const pixelMode: Mode = {
  id: "pixel",
  label: "Green-screen lab",
  intro: "Pick a colour and see what the tour's chroma-key rule does to that pixel of the guide video.",
  fields: [{ id: "color", label: "Pixel colour", type: "color", default: "#1fc84a" }],
  presets: [
    { label: "Pure green screen", values: { color: "#00ff00" } },
    { label: "Slightly green edge", values: { color: "#648c64" } },
    { label: "Skin tone", values: { color: "#d9a384" } },
    { label: "Dark green (kept)", values: { color: "#103c14" } },
    { label: "Blue shirt", values: { color: "#2f5fd0" } },
  ],
  simulate: simulatePixel,
};

export const campusTour: SystemDesign = {
  slug: "campus-tour",
  title: "How 70 panoramas become one walkable campus, with a green-screen guide",
  tagline: "Follow a visitor across the scene graph, then see the per-pixel rule that lifts the guide off its green background.",
  repo: "360-VIRTUAL-CAMPUR-TOUR",
  layout: { cols: 6, rows: 3 },
  nodes,
  edges,
  modes: [routeMode, pixelMode],
  honesty:
    "Runs in your browser and calls no servers. The 70 scenes and their hotspot links were read from the tour's own source, and the chroma-key thresholds (green must beat red and blue by more than 20, green above 70, fully transparent past 45) and the 640 px canvas cap are copied from it. The route finder is a demo built on that graph: the real tour has no route search, you click hotspots. Panoramas and the guide video are not loaded.",
};
