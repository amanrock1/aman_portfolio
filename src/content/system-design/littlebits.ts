import type { ArchEdge, ArchNode, Mode, SystemDesign, Trace, TraceStep } from "./types";

// LittleBits: a campus club and event platform with no backend. The browser's localStorage is the
// database, and the page scripts read and write it directly.
//
// Taken from the real repo (LittleBits): js/db.js (seed data and storage keys) and
// js/db2.js registerForEvent(): the order of the checks, the registration ID format, the badges.
// NOT run here: the real pages. The storage below is a copy kept in this page's memory (your own
// browser storage is never touched), seeded with the repo's five event titles and seat counts.

const nodes: ArchNode[] = [
  { id: "page", label: "Events page", sub: "events.js", kind: "client", col: 0, row: 1, blurb: "A student picks an event and presses Register. Plain HTML, CSS and JavaScript, no framework.", tech: "Vanilla JS", source: "js/events.js" },
  { id: "events", label: "Read event", sub: "localStorage: events", kind: "data", col: 1, row: 1, blurb: "Loads the events array from localStorage and finds the event by id.", tech: "localStorage", source: "js/db2.js" },
  { id: "seats", label: "Seat check", sub: "registeredSeats", kind: "logic", col: 2, row: 1, blurb: "If registeredSeats has reached totalSeats the event is fully booked and registration stops.", tech: "registerForEvent()", source: "js/db2.js" },
  { id: "dupe", label: "Duplicate check", sub: "userProfile", kind: "logic", col: 3, row: 1, blurb: "Looks through the student's registrations so nobody registers twice for the same event.", tech: "localStorage: userProfile", source: "js/db2.js" },
  { id: "ticket", label: "Make ticket", sub: "REG-id + QR", kind: "logic", col: 4, row: 1, blurb: "Builds the registration ID from four random digits and the last two letters or digits of the student id, plus the QR text that includes the club name.", tech: "registerForEvent()", source: "js/db2.js" },
  { id: "rewards", label: "Streak + badges", sub: "gamification", kind: "logic", col: 4, row: 0, blurb: "Increases the streak and awards badges: Hackathon Hero when the title contains \"hackathon\", Event Voyager at three registrations.", tech: "registerForEvent()", source: "js/db2.js" },
  { id: "save", label: "Write storage", sub: "events + userProfile", kind: "data", col: 5, row: 1, blurb: "Adds one to registeredSeats, then saves both the events array and the user profile back to localStorage and shows a toast.", tech: "localStorage", source: "js/db2.js" },
];

const edges: ArchEdge[] = [
  { from: "page", to: "events" },
  { from: "events", to: "seats" },
  { from: "seats", to: "dupe" },
  { from: "dupe", to: "ticket" },
  { from: "ticket", to: "rewards", kind: "branch" },
  { from: "rewards", to: "save" },
  { from: "ticket", to: "save" },
];

// ---------- in-memory copy of the seeded localStorage ----------
type Ev = { id: string; title: string; seats: number; taken: number };
const SEED: Ev[] = [
  { id: "quantum", title: "Quantum Code Hackathon 2026", seats: 250, taken: 198 },
  { id: "neon", title: "Neon Echoes Acoustic Night", seats: 150, taken: 135 },
  { id: "venture", title: "Venture Ignite 2026: Pitch Battle", seats: 100, taken: 48 },
  { id: "photo", title: "Golden Hour Visual Photowalk", seats: 40, taken: 12 },
  { id: "drone", title: "Autonomous Drone Expo 2026", seats: 120, taken: 65 },
];
type Profile = { regs: { eventId: string; regId: string }[]; streak: number; badges: string[] };
let events: Ev[] = SEED.map((e) => ({ ...e }));
let profile: Profile = { regs: [], streak: 0, badges: [] };
const reset = () => {
  events = SEED.map((e) => ({ ...e }));
  profile = { regs: [], streak: 0, badges: [] };
};

// Pseudo-random digits so the demo's IDs differ between runs, like the real code's Math.random().
const digits = () => String(Math.floor(1000 + Math.random() * 9000));

function simulate(v: Record<string, string>): Trace {
  if (v.reset === "yes") {
    reset();
    return {
      steps: [{ node: "save", from: "page", title: "Storage reset to the seed data", output: "events, userProfile cleared", slip: "reset" }],
      result: { tone: "info", title: "Fresh start", lines: ["Seats are back to the seeded counts and the profile is empty."] },
    };
  }
  const studentId = (v.student ?? "").trim();
  const ev = events.find((e) => e.id === v.event);
  const steps: TraceStep[] = [{ node: "page", title: "Register pressed", input: `event: ${ev?.title ?? "?"}\nstudent id: ${studentId || "(empty)"}`, slip: studentId || "?" }];
  const fail = (node: string, from: string, why: string): Trace => ({
    steps: [...steps, { node, from, title: "Registration refused", output: why, tone: "error", slip: "refused" }],
    result: { tone: "error", title: why, lines: ["Nothing was written to storage."] },
  });

  if (!ev) return fail("events", "page", "Event not found.");
  steps.push({ node: "events", title: "Event loaded", input: "localStorage.getItem('events')", output: `${ev.title}\nseats ${ev.taken} of ${ev.seats}`, slip: `${ev.taken}/${ev.seats}` });

  if (ev.taken >= ev.seats) return fail("seats", "events", "Event is fully booked.");
  steps.push({ node: "seats", title: "Seat available", output: `${ev.seats - ev.taken} seat${ev.seats - ev.taken === 1 ? "" : "s"} left`, slip: "open" });

  if (profile.regs.some((r) => r.eventId === ev.id)) return fail("dupe", "seats", "Already registered for this event.");
  steps.push({ node: "dupe", title: "Not registered yet", input: "localStorage.getItem('userProfile')", output: `${profile.regs.length} earlier registration${profile.regs.length === 1 ? "" : "s"}`, slip: "new" });

  const tail = studentId.replace(/[^a-zA-Z0-9]/g, "").slice(-2).toUpperCase() || "X";
  const regId = `REG-${digits()}-${tail}`;
  steps.push({ node: "ticket", title: "Ticket created", output: `${regId}\nQR text: ${regId}-<club name>`, slip: regId });

  profile.regs.push({ eventId: ev.id, regId });
  profile.streak += 1;
  const badges: string[] = [];
  if (/hackathon/i.test(ev.title) && !profile.badges.includes("Hackathon Hero")) badges.push("Hackathon Hero");
  if (profile.regs.length >= 3 && !profile.badges.includes("Event Voyager")) badges.push("Event Voyager");
  profile.badges.push(...badges);
  steps.push({
    node: "rewards",
    from: "ticket",
    title: badges.length ? `Badge earned: ${badges.join(", ")}` : "No new badge",
    output: `streak: ${profile.streak}\nregistrations: ${profile.regs.length}`,
    tone: badges.length ? "branch" : "ok",
    slip: badges[0] ?? `streak ${profile.streak}`,
  });

  ev.taken += 1;
  steps.push({ node: "save", from: "rewards", title: "Storage updated", input: "setItem('events'), setItem('userProfile')", output: `registeredSeats: ${ev.taken} of ${ev.seats}`, slip: "saved" });

  return {
    steps,
    result: {
      tone: "ok",
      title: `Registered: ${regId}`,
      lines: [`${ev.title}, seat ${ev.taken} of ${ev.seats}.`, `Streak ${profile.streak}${profile.badges.length ? `, badges: ${profile.badges.join(", ")}` : ""}.`, "Register for the same event again to see the duplicate check."],
    },
  };
}

const mode: Mode = {
  id: "register",
  label: "Register for an event",
  intro: "Register for events one after another. The storage keeps its state between tries: repeat one to hit the duplicate check, or collect three for a badge.",
  fields: [
    {
      id: "event",
      label: "Event",
      type: "select",
      default: "photo",
      options: SEED.map((e) => ({ value: e.id, label: `${e.title} (${e.taken}/${e.seats})` })),
    },
    { id: "student", label: "Student id", type: "text", default: "24BCE10123", placeholder: "e.g. 24BCE10123" },
  ],
  presets: [
    { label: "Photowalk", values: { event: "photo", student: "24BCE10123" } },
    { label: "Hackathon (badge)", values: { event: "quantum", student: "24BCE10123" } },
    { label: "Same event again", values: { event: "photo", student: "24BCE10123" } },
    { label: "Drone expo", values: { event: "drone", student: "24BCE10123" } },
    { label: "Pitch battle", values: { event: "venture", student: "24BCE10123" } },
    { label: "Reset storage", values: { event: "photo", student: "24BCE10123", reset: "yes" } },
  ],
  simulate,
};

export const littlebits: SystemDesign = {
  slug: "littlebits",
  title: "How a click on Register becomes a ticket with no backend",
  tagline: "Follow a registration through the seat check, the duplicate check, the ticket maker, the badges and the localStorage writes.",
  repo: "LittleBits",
  layout: { cols: 6, rows: 3 },
  nodes,
  edges,
  modes: [mode],
  honesty:
    "Runs in your browser and calls no servers, the same as the real app. The order of the checks, the REG-id format, the badge rules and the five seeded events are taken from the real code. The storage here is a copy in this page's memory, so your own browser storage is never touched. The \"hackathon\" badge text match and the random digits behave as in the original.",
};
