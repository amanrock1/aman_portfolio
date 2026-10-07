import type { ArchEdge, ArchNode, Mode, SystemDesign, Trace, TraceStep } from "./types";

// Cyber Runner 2D: a canvas platformer with no dependencies. Every frame runs
// input -> update() (physics, enemies, projectiles, collisions) -> draw -> requestAnimationFrame.
//
// Ported from the real code (repo HTML_game_dev, game.js): the coyote-time and jump-buffer
// counters in update(), and fireProjectile(). NOT run here: the game itself, the canvas or the
// synthesised audio. The timeline below re-runs the same counter rules frame by frame.

const nodes: ArchNode[] = [
  { id: "input", label: "Keyboard", sub: "A/D, Space, F", kind: "client", col: 0, row: 1, blurb: "Arrow keys or A/D move, Space/W/Up jumps, F/J/Shift fires. Pressing jump does not jump immediately: it stores a 6-frame jump buffer.", tech: "keydown listeners", source: "game.js" },
  { id: "loop", label: "update()", sub: "once per frame", kind: "service", col: 1, row: 1, blurb: "The heart of the game, called from requestAnimationFrame. It moves the player, enemies and projectiles, then checks collisions.", tech: "requestAnimationFrame", source: "game.js" },
  { id: "jump", label: "Jump rules", sub: "coyote + buffer", kind: "logic", col: 2, row: 0, blurb: "Coyote time (a 6-frame counter that starts counting down when you leave the ground) lets you still jump for a few frames after walking off a ledge. The jump buffer remembers a jump press for 6 frames so pressing slightly early still works. A jump happens when both counters are above zero.", tech: "player.coyoteTimer, player.jumpBuffer", source: "game.js" },
  { id: "shoot", label: "fireProjectile()", sub: "lasers", kind: "logic", col: 2, row: 2, blurb: "Adds a laser moving at speed 9 that lives 60 frames. With the triple-shot power-up it adds two more angled lasers with vertical speed plus and minus 1.6.", tech: "projectiles[]", source: "game.js" },
  { id: "world", label: "Collisions", sub: "enemies, pickups", kind: "logic", col: 3, row: 1, blurb: "Projectiles are tested against enemies and the 15-HP boss, the player against enemies, coins, hearts and spring pads.", tech: "AABB overlap", source: "game.js" },
  { id: "fx", label: "Effects", sub: "particles + audio", kind: "service", col: 4, row: 1, blurb: "Hits spawn particles, screen shake and floating text, and a Web Audio synthesiser plays the sounds. There are no sound files.", tech: "Web Audio API", source: "audio.js" },
  { id: "draw", label: "Canvas draw", sub: "sprites.js", kind: "client", col: 5, row: 1, blurb: "Draws the stage, sprites and HUD on the canvas, then asks the browser for the next frame.", tech: "Canvas 2D", source: "sprites.js" },
];

const edges: ArchEdge[] = [
  { from: "input", to: "loop" },
  { from: "loop", to: "jump", kind: "branch", label: "jump" },
  { from: "loop", to: "shoot", kind: "branch", label: "fire" },
  { from: "jump", to: "world" },
  { from: "shoot", to: "world" },
  { from: "world", to: "fx" },
  { from: "fx", to: "draw" },
];

// ---------- jump timeline: the real counters from update() ----------
function jumpTimeline(ledge: number, press: number) {
  let coyote = 0;
  let buffer = 0;
  let jumpedAt: number | null = null;
  const rows: string[] = [];
  for (let f = 0; f <= Math.max(ledge, press) + 8; f++) {
    if (f === press) buffer = 6; // keydown sets the buffer before update() runs
    const grounded = f < ledge;
    if (grounded) coyote = 6;
    else if (coyote > 0) coyote--;
    if (buffer > 0) buffer--;
    let mark = "";
    if (buffer > 0 && coyote > 0 && jumpedAt === null) {
      jumpedAt = f;
      mark = "  JUMP";
      coyote = 0;
      buffer = 0;
    }
    if (f >= Math.min(ledge, press) - 1 && (f <= Math.max(ledge, press) + 7 || mark)) {
      rows.push(`f${String(f).padStart(2)} ${grounded ? "ground" : "air   "}  coyote ${coyote}  buffer ${buffer}${mark}`);
    }
    if (jumpedAt !== null) break;
  }
  return { jumpedAt, rows };
}

function simulateJump(v: Record<string, string>): Trace {
  const ledge = Math.max(0, Math.min(40, Number(v.ledge ?? 10)));
  const press = Math.max(0, Math.min(40, Number(v.press ?? 12)));
  const { jumpedAt, rows } = jumpTimeline(ledge, press);
  const gap = press - ledge;
  const steps: TraceStep[] = [
    { node: "input", title: "Jump key pressed", input: `frame ${press}`, output: "player.jumpBuffer = 6", slip: `f${press}` },
    { node: "loop", title: "update() runs each frame", input: `you walk off the ledge on frame ${ledge}`, output: "grounded: coyoteTimer = 6\nin the air: coyoteTimer--\njumpBuffer--", slip: "update" },
    {
      node: "jump",
      title: jumpedAt !== null ? `Jump on frame ${jumpedAt}` : "No jump",
      input: rows.join("\n"),
      output:
        jumpedAt !== null
          ? jumpedAt < ledge
            ? "you were still on the ground, so it jumped at once"
            : gap > 0
              ? `coyote time saved it: ${gap} frame${gap === 1 ? "" : "s"} after the ledge`
              : "pressed on the ledge frame"
          : `pressed ${gap} frames after the ledge, the coyote window had closed`,
      tone: jumpedAt !== null ? "ok" : "error",
      note: "Both counters must be above zero on the same frame: jumpBuffer > 0 && coyoteTimer > 0.",
      slip: jumpedAt !== null ? "JUMP" : "fell",
    },
  ];
  if (jumpedAt === null) {
    return { steps, result: { tone: "error", title: "You fell", lines: [`Pressed ${gap} frames after leaving the ledge, too late for coyote time.`, "The window is only a few frames, roughly a tenth of a second at 60 frames a second."] } };
  }
  steps.push({ node: "world", from: "jump", title: "Player launched", output: "vertical velocity set, grounded = false", slip: "up" });
  steps.push({ node: "draw", from: "world", title: "Frame drawn", output: "sprite moves up", slip: "frame" });
  return {
    steps,
    result: {
      tone: "ok",
      title: `Jump allowed on frame ${jumpedAt}`,
      lines: [jumpedAt < ledge ? "Pressed before the ledge: a normal ground jump." : gap > 0 ? `Pressed ${gap} frames late, forgiven by coyote time.` : "Perfectly timed.", "The coyote window is only a few frames, roughly a tenth of a second at 60 frames a second."],
    },
  };
}

function simulateShot(v: Record<string, string>): Trace {
  const triple = v.power === "triple";
  const dir = v.facing === "left" ? -1 : 1;
  const vx = 9 * dir;
  const lasers = triple ? [0, -1.6, 1.6] : [0];
  const steps: TraceStep[] = [
    { node: "input", title: "Fire key pressed", input: "F, J or Shift", output: `facing ${dir === 1 ? "right" : "left"}`, slip: "F" },
    { node: "loop", title: "update() sees the key", output: "calls fireProjectile()", slip: "fire" },
    {
      node: "shoot",
      from: "loop",
      title: `${lasers.length} laser${lasers.length > 1 ? "s" : ""} created`,
      output: lasers.map((vy) => `x speed ${vx}, y speed ${vy}, life 60 frames`).join("\n"),
      note: triple ? "Triple shot adds two angled lasers (vertical speed plus and minus 1.6)." : "Without the power-up there is one straight laser.",
      slip: `x${lasers.length}`,
    },
    { node: "world", title: "Collision test each frame", output: `a laser travels up to ${60 * 9} pixels before it expires`, slip: "hit?" },
    { node: "fx", title: "Sound and particles", output: "shoot sound synthesised with Web Audio, particles on impact", slip: "pew" },
    { node: "draw", title: "Lasers drawn", output: `${lasers.length} sprite${lasers.length > 1 ? "s" : ""} on the canvas`, slip: "frame" },
  ];
  return { steps, result: { tone: "ok", title: `${lasers.length} laser${lasers.length > 1 ? "s" : ""} in flight`, lines: [`Each moves ${Math.abs(vx)} pixels a frame for 60 frames.`] } };
}

const jumpMode: Mode = {
  id: "jump",
  label: "Jump timing",
  intro: "Pick the frame you walk off a ledge and the frame you press jump. The game forgives a jump pressed a few frames late.",
  fields: [
    { id: "ledge", label: "Frame you leave the ledge", type: "number", default: "10" },
    { id: "press", label: "Frame you press jump", type: "number", default: "14", hint: "0 to 40" },
  ],
  presets: [
    { label: "Perfect timing", values: { ledge: "10", press: "10" } },
    { label: "3 frames late", values: { ledge: "10", press: "13" } },
    { label: "4 frames late", values: { ledge: "10", press: "14" } },
    { label: "5 frames late", values: { ledge: "10", press: "15" } },
    { label: "Before the ledge", values: { ledge: "10", press: "6" } },
  ],
  simulate: simulateJump,
};

const shotMode: Mode = {
  id: "shoot",
  label: "Fire a shot",
  intro: "Press fire with and without the triple-shot power-up.",
  fields: [
    { id: "power", label: "Power-up", type: "select", default: "none", options: [{ value: "none", label: "None" }, { value: "triple", label: "Triple shot" }] },
    { id: "facing", label: "Facing", type: "select", default: "right", options: [{ value: "right", label: "Right" }, { value: "left", label: "Left" }] },
  ],
  presets: [
    { label: "Normal shot", values: { power: "none", facing: "right" } },
    { label: "Triple shot", values: { power: "triple", facing: "right" } },
  ],
  simulate: simulateShot,
};

export const cyberRunner: SystemDesign = {
  slug: "cyber-runner",
  title: "How a key press becomes a jump, and why the game feels forgiving",
  tagline: "Follow one frame through input, update(), the coyote-time and jump-buffer counters, collisions and the canvas.",
  repo: "HTML_game_dev",
  layout: { cols: 6, rows: 3 },
  nodes,
  edges,
  modes: [jumpMode, shotMode],
  honesty:
    "Runs in your browser and calls no servers. The 6-frame coyote and jump-buffer counters, their order in update() and the laser speed, lifetime and triple-shot angles are copied from game.js. The game itself is not running here. The frames-to-seconds remark assumes the usual 60 frames a second.",
};
