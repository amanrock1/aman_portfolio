# Handoff: the "System design" feature (work in progress)

**Read `CLAUDE.md` first** (project rules, design system, code map), then this file. This file is the memory of one specific job so a new chat can continue it without redoing the research. Written 2026-10-05.

## 1. What the owner asked for (their words, paraphrased)

> Add something to each project: **system architecture / system design**, because every interviewer asks about it. It should be **interactable and live**: the visitor passes data in, sees **where it goes and what happens** at each stage. It should look **good and creative, not like an AI-made website**. **Do not push it**: the owner will check it on localhost first, then push.

Follow-up from the owner: only 4 projects (OpenSource Buddy, 360 Campus Tour, VoxTube, DukaanDost AI) have their own pages today. **Every project must get the feature**, so the other three (LittleBits, Cyber Runner 2D, SquadUp) also need pages.

Rules that still apply: never invent content; light theme only; phone-first AND full-width desktop; every grid needs `grid-cols-1` on phones; inline SVG icons only; **do not commit or push until the owner says so** (CLAUDE.md rule 4).

## 2. Status

- **Research: done** (section 4 has all the facts, so no need to refetch).
- **Design decisions: made** (section 3).
- **Code: built, awaiting the owner's check on localhost (2026-10-05).** All 7 designs exist in `src/content/system-design/` and are registered in `registry.ts` (slugs: dukaandost-ai, opensource-buddy, voxtube, squadup, littlebits, campus-tour, cyber-runner). Engine: `src/components/system-design/{diagram,system-design}.tsx`. Every project has a `/work/[slug]` page; Ship Log and Work "More projects" link to all of them.
- **Tested in headless Edge:** each design runs its presets end to end (ledger steps, result card, no JS errors), and no page overflows at 390px. **Not verified:** the slip animation timing under real frame rates (headless virtual time cannot confirm that the slip rests below its station), real phone touch use, and a full visual pass of every design at both widths.
- Honest notes: the Campus Tour route finder is a demo over the real 70-scene graph (the real tour has no route search); LittleBits club names are not shown because they were not in the sources; Cyber Runner coyote window is 5 frames in practice (counter 6, decremented on the leaving frame).
- **Still to do:** owner review, then docs in README, and commit/push ONLY when the owner says so.

## 3. Design decisions

### Concept: "a slip of paper travelling through a post office"
Fits the Paper & Ink look and avoids the usual neon-pipeline "AI diagram" look.
- The visitor types input (or taps a preset chip) and presses **Send**.
- A small taped **paper slip** carrying the current payload travels along **hand-inked routes** (slightly wobbly Bezier curves, dashed ink) from station to station.
- Each **station** is a letterpress tile (`.press`). The active one presses in and turns vermilion; visited ones keep a small stamp with the step number; failures turn red.
- A **receipt ledger** (mono, dashed rules, like the Soundtrack receipt) prints one entry per step with **IN** and **OUT** values. Clicking a step jumps to it.
- Clicking a station opens an **inspector**: what it does, the real tech, and the real source file in the repo.
- A short handwritten margin note invites interaction ("type something, watch it travel").
- Branches (clarification loop, errors, cache hit/miss, fallback) use vermilion dashed routes.

### Honesty (mandatory)
It is a **simulation that runs in the browser and calls no servers**. Each design carries a `honesty` string shown above the diagram that says exactly what is ported from the real code, what is stubbed, and that sample data is invented. Where the real system uses an LLM and the demo uses a rule, the step note must say so. Never present sample numbers as real.

### Data model (all in `src/content/system-design/`)
```ts
type NodeKind = "client" | "service" | "ai" | "data" | "external" | "security" | "logic";
type ArchNode = { id; label; sub?; kind: NodeKind; col; row; blurb; tech?; source? /* repo file path */ };
type ArchEdge = { from; to; label?; kind?: "main" | "branch" | "error" };
type Field = { id; label; type: "text"|"textarea"|"select"|"number"|"color"; options?; placeholder?; default?; rows? };
type TraceStep = { node; from?; title; input?; output?; note?; slip?; tone?: "ok"|"branch"|"error" };
type Trace = { steps: TraceStep[]; result: { tone: "ok"|"error"|"info"; title; lines: string[] };
               ask?: { question; placeholder?; resume(answer: string): Trace } };   // DukaanDost clarification loop
type Mode = { id; label; intro; fields: Field[]; presets?: {label; values}[]; simulate(values): Trace };
type SystemDesign = { slug; title; tagline; layout:{cols;rows}; nodes; edges; modes: Mode[]; honesty; sourceRepo };
```
`simulate()` returns the whole trace up front; the UI plays it back step by step.

### Layout without a second diagram
Nodes carry `(col,row)`. **Desktop** draws x=col, y=row. **Phone (<768px)** *transposes*: x=row, y=col, so a wide flow becomes a tall one. **Keep `rows` ≤ 3** so the phone version has at most 3 columns (about 120px each, node about 104px wide). Node positions are percentages of the container, which has a fixed aspect ratio; edges are an SVG overlay with the same viewBox.

### Playback
`cursor` over `trace.steps`; auto-play about 1100ms per step (about 650ms slip travel using `getPointAtLength` along the edge path, then dwell). Controls: Send, Pause/Resume, Step, Reset. Respect `prefers-reduced-motion` (no travel, shorter dwell). Ledger entries are an `<ol>` with `aria-live="polite"`. Stations are `<button>`s.

### Where it lives
- The design objects contain functions, so they cannot be passed from a server page to a client component. Use a **client-side registry** (`registry.ts`) keyed by slug, imported by a client component `<SystemDesign slug="…" />`.
- Mount it **full width, below** the two-column case-study grid on `/work/[slug]`, with `id="system-design"`. Add a "Try the system design" jump link near the Live demo / GitHub buttons.
- `/work/[slug]` must now exist for **all 7 projects** (`generateStaticParams` over `projects`, not only `caseStudies`). When `caseStudy` is missing: use the project title as the h1, the summary as the intro, the cover screenshot if any, no sections, and keep the "Next …" link generic ("Next project"). Update links that assumed case-study-only: `ship-log.tsx` (add a link for every project), Work page "More projects" cards (link to `/work/[slug]`).

### Files to create or touch
```
src/content/system-design/types.ts
src/content/system-design/{dukaandost,voxtube,opensource-buddy,campus-tour,squadup,littlebits,cyber-runner}.ts
src/content/system-design/registry.ts            (client registry)
src/components/system-design/system-design.tsx   (engine UI, client)
src/components/system-design/{diagram,ledger,inspector,form}.tsx   (split as it grows)
src/app/work/[slug]/page.tsx                     (all projects; mount the section)
src/components/ship-log.tsx, src/app/work/page.tsx   (links)
CLAUDE.md, README.md                             (document the feature at the end)
```
Tests/verification: see section 6.

## 4. Research: how each project really works (ported into the simulations)

Source repos are `https://github.com/amanrock1/<repo>`. Raw READMEs/code were read with `gh api -H "Accept: application/vnd.github.raw" repos/amanrock1/<repo>/contents/<path>` (note: the contents API returns nothing for files over 1MB; use the raw header).

### 4.1 DukaanDost AI (repo `Dukaan_Dost`; Next.js 16, Prisma, Neon Postgres, Groq)
Real pipeline in `src/app/api/process-request/route.ts` (686 lines), with agent names shown in its UI: **Planner Agent, Intent Agent, Inventory Agent, Invoice Agent, Analytics Agent, Recommendation Agent**. Real step names: Speech Recognition, Multi-Action Parser, Planner Agent, Intent Classification, Entity Extraction, Inventory Validation, Business Rule Validation, Database Update, Invoice Generation, Recommendation Update, Database Query.

1. **Input**: voice (`/api/transcribe` → Groq Whisper large-v3) or typed text.
2. **Multi-Action Parser** (`splitMultiActionCommand`): splits compound commands on `, ; + & and then / and / then / after that / aur / phir / also / plus / update karo`; also splits "sold … invoice" at the invoice word; only splits when at least 2 segments contain an action keyword.
3. **Intent Classification** (`src/lib/intentClassifier.ts`), a **hybrid**: keyword rules first, LLM (Groq `llama-3.3-70b`, temperature 0.1) only when no keyword matched, then a rule-based fallback if the LLM errors. Keyword order and lists (regex word-boundary, case-insensitive):
   - undo (priority 1, conf 0.99): undo, reverse, wapas, revert, "cancel last", galat
   - purchase (conf 0.95): bought, purchased, purchase, khareeda, kharida, kharid, khareede, liya, laaya, laya
   - sale (conf 0.95): sold, becha, behca, beche, bech, sell, bika, bike
   - invoice (conf 0.98): invoice, bill, receipt, "invoice banao", "bill banao"
   - stock check (conf 0.95): stock, kitne, baaki, remaining
   - Priority: undo → purchase → sale → invoice → stock → LLM. Intents: `record_sale | record_purchase | check_stock | generate_invoice | undo | unknown`. Before matching, a leading "then/and/so/now/please" and trailing "update/update karo/update stock/please/karo/now" are stripped.
4. **Entity Extraction** (`entityExtractor.ts`): primary is the LLM returning JSON `{productName, quantity, unitPrice, amount, customerName, supplier, missingFields}`; if only quantity and amount are known, `unitPrice = round(amount / quantity)`; if quantity and unitPrice are known, `amount = quantity * unitPrice`. `fallbackExtract` (regex, used when the LLM fails): quantity and product from `(\d+)\s+<words>` followed by for/at/@/price/rs/each/per/sold/…; unit price = first other positive number. `missingFields` ⊆ {productName, quantity, unitPrice}. **The demo uses the regex path and must say so.**
5. **Clarification loop (ONLY when the product is missing)**: if no `productName`, the API replies "Konsa product? (e.g. "20 kurkure behce 10 ruppya each")" with `clarificationNeeded` and `pendingContext {intent, entities}`; the user's next message goes through `mergeContext(previousEntities, newInput, intent)` instead of fresh extraction. **A missing quantity defaults to 1, and a missing/zero unit price silently falls back to the catalog price (`entities.unitPrice > 0 ? entities.unitPrice : product.unitPrice`): neither asks a question.** (Verified in `process-request/route.ts` lines ~199-290.)
6. **Inventory Validation** (`findMatchingProductsDetailed`): matches by exact name / model word / alias list, then substring either way with conflict checks on significant words; 0 matches → product is **auto-registered** with a guessed category (regex: electronics words, pharmacy words, stationery words, footwear words, else Groceries; GST guess 5% stationery, 12% pharmacy, else 18; lowStockThreshold 5; stock = qty+50 for a sale, 0 for a purchase; price default 20); more than 1 candidate → `disambiguationNeeded` with candidate list.
7. **Business Rule Validation**: `amount = quantity * unitPrice`; `gstAmount = round(amount * gstRate/100 * 100)/100`; `totalAmount = round((amount + gstAmount) * 100)/100`. A sale fails with "Insufficient stock: N available, Q requested" when `currentStock < quantity` (logged to the AI log as a failure).
8. **Database Update** (`inventoryEngine.recordSale/recordPurchase`, Prisma): re-reads the product, re-checks stock, creates `Sale` {productId, quantity, unitPrice, amount, gstAmount, totalAmount, customerName…}, then `Product.currentStock -= quantity` (purchase: `+=`); returns `lowStockAlert = newStock <= lowStockThreshold` (schema default threshold 5). Step detail printed by the real app: "Prisma committed. Stock: A → B units."
9. **Recommendation Update** step (real text): `Low stock alert for <product>!` when `stockAfter <= lowStockThreshold`, else `Inventory stable.` (Analytics Agent + Recommendation Agent run here).
10. **AI Log** (`logAIAction`: raw input, detected intent, entities, action, status, error, steps) is written after the database step, and also on failures.
11. **Invoice Generation is AUTOMATIC for every successful sale** (`generateInvoice(saleId)` right after the DB write; response text "GST Invoice auto-generated! Check Invoices tab."). `invoiceGenerator.ts` (pdf-lib): one invoice per sale (second attempt → "Invoice already generated for this sale."); HSN by category (Electronics 8471, Stationery 4820, Footwear 6403, Pharmacy 3004, otherwise 9999); GST split into **CGST and SGST at gstRate/2 each**; invoice number stored in `Invoice`. A separate `generate_invoice` intent ("bill banao") finds the **last sale without an invoice** and generates it (or reports no sale found). Purchases do not create invoices.
12. Insufficient stock on a sale is returned as a Hinglish message ("Stock kam hai! <name> mein sirf N units hain, aapne Q maange.") and logged as a failed action; the Business Rule Validation step is marked error and nothing is written. Order matters: **Business Rule Validation runs BEFORE the database update**.
- Schema highlights: `Product` {category, currentStock, lowStockThreshold default 5, unitPrice, gstRate default 18}, `Sale` {…gstAmount, totalAmount}, `Purchase`, `Invoice`, `AILog`, `Shop`, `User`.
- Tests exist in `tests/` (entityExtractor, inventoryEngine, multiIntent): good source of realistic example inputs.
- Demo data rule: use a clearly labelled **sample catalog** (e.g. 4-5 products with category and stock). Use 18% GST only because it is the schema default; do not invent per-product rates beyond that without saying so.

### 4.2 VoxTube (repo `voxtube`; React 19 + Vite, Express, Supabase Postgres, Gemini)
Documented in its README as a sequence diagram. The server is a **secure proxy** with a **database caching layer as primary gatekeeper**:
1. Browser `POST /api/analyze { url, turnstileToken }`.
2. Express: validate URL (string, under 500 chars), rate limit (**30 analyze calls per 15 minutes per IP**, `express-rate-limit`), JSON body limit **10kb**, CORS allowlist, Helmet (11 security headers), masked error details.
3. **Cloudflare Turnstile** `POST /siteverify` with the token.
4. **Cache check** in Supabase: `SELECT * FROM videos WHERE id = videoId`.
   - **Cache hit (healthy)** → return cached video + comments (README says under 50ms).
   - A hit whose summary is corrupted/error → **purge the row and re-ingest** (the self-healing fix after the quota incident).
   - **Miss** → fetch metadata + paginated comments from the **YouTube Data API (max 300 comments)** (or Reddit via `redditService.js` for thread URLs).
5. **Gemini** (`gemini-2.5-flash-lite`, SDK `@google/generative-ai`) classifies all comments in **one batched call using compressed array codes** (`["c1","POS","Q"]` instead of verbose JSON; about 75% fewer tokens; 300 comments in a single call, under about 3s), then a second call writes the **markdown executive summary** (General Consensus / Top Loves / Critiques).
6. **Write cache** (INSERT video + analyzed comments), respond (README: 3-5s on a miss).
- Real incident to feature as a note: free-tier quota 20/day on the experimental SDK silently mapped everything to "Noise" and cached it; fixed by moving to the stable SDK/model (1,500/day) and self-healing cache.
- Files: `server/src/index.js`, `services/{aiService,youtubeService,redditService}.js`, `database/schema.sql`, `utils/supabase.js`, `client/src/App.jsx`.
- Simulation idea: URL input; presets for a YouTube URL, a Reddit URL, a bad URL, and a "repeat the same URL" (cache hit). Show validation failures (over 500 chars, not a YouTube/Reddit URL) at the Express node. Use clearly fake comments for the Gemini step; do not call any API.

### 4.3 OpenSource Buddy (repo `OpenSource-Buddy`; Flask only, vanilla JS, optional Ollama)
Real request flow (README mermaid): Browser `script.js` validates → `POST /api/analyze` → Flask `app.py` validates → `analyzer.py`: try **Ollama** (`gemma4:31b-cloud`, timeout default 120s) → on unreachable/timeout/unusable answer fall back to **demo mode** → JSON back → rendered with `textContent` (never HTML) → optional save to `localStorage` (cap 50).
- **Backend validation (`app.py`)**: title 3-200 chars; description 10-8000 chars; optional URL must match `^https://github\.com/[\w.-]+/[\w.-]+/(issues|pull)/\d+/?$` (format-checked only, **never fetched**); request body capped at **64KB** (413); all fields must be strings; `mode` field.
- **Demo mode `analyze_demo`**: `text = (title + " " + description).lower()`; for each of 3 rules `score = number of its keywords found (substring regex)`; pick the highest; **needs score ≥ 2, otherwise the GENERIC template (difficulty "intermediate")**. Rules:
  - *frontend layout* (beginner): mobile, responsive, navigation, navbar, menu, css, layout, viewport, hamburger, overflow, button, style
  - *crash on bad input* (beginner): crash, exception, traceback, error, empty, submit, form, null, undefined, typeerror, 500, fails, freeze
  - *python validation* (beginner): python, validation, validate, function, argument, parameter, type, negative, range, check, valueerror, "def "
  - Each returns explanation, skills, difficulty + reason, roadmap (7 steps for frontend/generic), questions, testing checklist. Full text is in `analyzer.py` lines 117-252 (port from there, do not paraphrase).
- Output is labelled "Demo guidance"; AI output is validated/normalised (difficulty must be one of beginner/intermediate/advanced).
- Simulation: the demo-mode branch can run the **real algorithm** in the browser. The Ollama branch is illustrated, not run (add an "Ollama reachable?" toggle: off → fallback notice). Presets: the 3 built-in sample issues from `app.py` (broken mobile menu, crash on empty form, missing Python validation), a vague issue (→ generic), a too-short title (400), a bad URL (400).

### 4.4 360 Campus Tour (repo `360-VIRTUAL-CAMPUR-TOUR`; vanilla JS, Pannellum 2.5.6, HTML5 Canvas)
Architecture (README): UI layer → Scene management (`tour-project/campus tour.html` / `main.js`) → **Pannellum** panorama engine (equirectangular images) and **chroma-key video engine** (HTML5 Canvas) → asset pools.
- **Scene graph**: 70 scenes in `tourConfig.scenes` inside `tour-project/campus tour.html` (about line 208 onward). Each has `hotSpots: [{pitch, yaw, sceneId, text}]`, optional initial `yaw`. First scene `"exit 1"`, `sceneFadeDuration: 600`. Extract it with a script: slice the `scenes: { … }` object by brace matching, evaluate with a stub `pfile = n => n`, keep `{id, title, yaw, hotspots: [{yaw, to}]}` (the owner's local scratch run printed all 70; titles like "AB Front Gate 2", "Lion Park", "MPH 4", "LC 5", "Girls 1..21", "Hostel Start 2"). Use this for a **BFS route finder**: pick a start and a destination scene, show the hop path.
- **Navigation**: `viewer.loadScene(sceneId)`; images are loaded **lazily when their scene loads**; hotspot angle continuity: `targetYaw = (incomingYaw + 180) % 360` so the visitor keeps walking forward.
- **Stereoscopic VR mode**: two Pannellum viewers side by side, active-side detector, `setYaw(yaw, false)` to sync the peer without animation loops.
- **Chroma-key (real algorithm, from the README and `main.js`)**: video frame is scaled to a hidden canvas **capped at 640px wide**, driven by `requestAnimationFrame`; per pixel:
  ```js
  const maxRB = Math.max(r, b);
  if (g > maxRB + 20 && g > 70) {
    const dominance = g - maxRB;
    if (dominance > 45) alpha = 0;                      // fully transparent
    else alpha = Math.max(0, 255 - (dominance - 20) * 10); // soft edge
  }                                                      // else unchanged (255)
  ```
- Simulation modes: (1) **Route**: start and destination selects → BFS → per-hop steps with the hotspot yaw and the computed entry yaw (cap the number of printed hops, summarise the rest) → image lazy-load → fade render. (2) **Pixel lab**: a colour picker (r,g,b) → show maxRB, the two conditions, dominance and the resulting alpha, with a checkerboard preview; real code path above.

### 4.5 SquadUp / GamePool (repo `SquadUp`; Next.js 14, Firebase Auth + Firestore, Tailwind)
Matching engine (all client-side, `src/app/(dashboard)/matches/page.tsx` + `src/lib/similarity.ts`):
- `gameNameMatchScore(a, b)`: normalise both via the **alias database** (`GAME_ALIASES`, about 40 games, e.g. mc/mcpe → minecraft, cs2/csgo → counter-strike 2, gta/gta 5 → grand theft auto v, r6 → rainbow six siege, lol → league of legends, valo → valorant, wow, poe, dbd, …; copy the real map from `similarity.ts`); equal → **100**; one contains the other → **85**; else `stringSimilarity` = `1 − levenshtein / maxLen`: **>0.8 → 75, >0.6 → 50, >0.4 → 25, else 0**.
- Per candidate pair: skip if `nameScore === 0`; `budgetScore = max(0, 30 − |budgetA − budgetB| / max(budgetA, budgetB, 1) × 30)`; `playerScore = diff 0 → 20, diff 1 → 10, else 0`; **`total = round(nameScore × 0.5 + budgetScore + playerScore)`**, kept if **≥ 20**, capped at 100; reason chips: nameScore ≥ 80 "Same game", ≥ 50 "Similar game", budgetScore ≥ 20 "Similar budget", playerScore ≥ 15 "Same player count".
- Data: `WishlistEntry` {userId, username, gameName, gameNameNormalized, budget, playersNeeded, preferredPlayTime, status}, `GameGroup`, messages via Firestore subscription; mock seed data in `src/lib/db.ts` (`seedMockData`, users like RohanGamer/Priya_Playz, wishlist entries for Minecraft, Helldivers 2, Lethal Company, …). Auth: email/password + Google. Safety: matching only, no payments, no credential sharing.
- Simulation: inputs game name, budget, players needed; compare against the **seed wishlist entries** (label them sample data); show each pair's three sub-scores and the total (this is the real formula); then "group formed" path to Firestore.

### 4.6 LittleBits (repo `LittleBits`; vanilla HTML/CSS/JS, **no backend**: `localStorage` is the database)
- Modules: `js/db.js` (seed arrays `SIMULATED_USERS`, `DEFAULT_CLUBS`, `DEFAULT_EVENTS`, self-healing reset if the 3 demo accounts are missing), `js/db2.js` (helpers `getClubs/saveClubs/getEvents/getUserProfile/joinClub/registerForEvent/claimCertificate/triggerToast`), `navbar*.js` (auth modal, role routing), `admin*.js` (Super Admin vs Club Admin, tabs, verify scanning, attendance), `dashboard.js`, `events.js`, …
- localStorage keys: `clubs`, `events`, `simulatedUsers`, `userProfile`, `notifications`; `sessionStorage` flag `skipIntroNext` skips the 3s loader.
- **registerForEvent(eventId, details)** (real order): event exists? → `registeredSeats >= totalSeats` → "Event is fully booked." → already registered → "Already registered for this event." → `regId = "REG-" + random 4 digits + "-" + last 2 alphanumerics of studentId uppercased (or "X")`; `qrCode = regId + "-" + clubName` → push registration, `streak += 1` → badge "Hackathon Hero" if the title contains "hackathon" → badge "Event Voyager" at ≥ 3 registrations → `registeredSeats += 1` → save events and profile → toast. **joinClub** toggles membership, adjusts `memberCount`, awards "Community Starter" on the first club. **claimCertificate** makes `CERT-<first 3 letters of club>-<5 digits>`.
- Sample events (real seed titles): Quantum Code Hackathon 2026 (198/250), Neon Echoes Acoustic Night (135/150), Venture Ignite 2026: Pitch Battle (48/100), Golden Hour Visual Photowalk (12/40), Autonomous Drone Expo 2026 (65/120).
- Simulation: pick an event and enter a student id; presets include a full event, a duplicate registration, a hackathon (badge), an ordinary success. Show reads/writes to the localStorage keys at each step. Roles: Super Admin / Club Admin / Student.

### 4.7 Cyber Runner 2D (repo `HTML_game_dev`; Canvas + Web Audio, zero dependencies)
- Files: `index.html` shell, `game.js` (engine: `update()`, physics, collisions; `loadStage`, `resetGame`, `fireProjectile`, particles, screen shake, floating text), `levels.js` (5 stages + boss data), `sprites.js` (drawing + UI screens), `audio.js` (Web Audio synth, no sound files).
- Loop: input → `update()` (physics, enemies, projectiles, collisions, particles) → render → `requestAnimationFrame`.
- Real constants: **coyote time 6 frames** (`player.coyoteTimer = 6` while grounded, decrements after walking off a ledge), **jump buffer 6 frames** (`jumpBuffer > 0 && coyoteTimer > 0` → jump), projectile `life: 60` frames, triple shot adds 2 angled lasers (`vy ±1.6`), boss 15 HP / 60x60, pickups: coin +50, heart +1 HP, triple shot 8s, spring pad "BOING!". Controls: A/D or arrows, Space/W/Up to jump, F/J/Shift to fire, I manual, M mute.
- Simulation: a **frame timeline**: choose the frame on which the player walks off a ledge and the frame on which jump is pressed; show whether coyote time (6) or the jump buffer (6) lets the jump through, with the counters per frame. A second mode can trace one input (e.g. "press F with triple shot") through game.js → projectiles[] → collision → particles/audio.

## 5. Open questions to settle with the owner (ask only if blocked)
- Whether the per-project system design should also appear as a link on the Work cards and Ship Log (assumed yes).
- DukaanDost's recommendation/analytics stage detail (needs reading `businessIntelligence.ts`).

## 6. Verification plan (before telling the owner it is done)
1. `npx tsc --noEmit -p .`
2. Dev server on port 3000: `npm run dev` (webpack). If the owner's server returns 500 for all pages, it is the Turbopack crash: kill it and restart (see CLAUDE.md).
3. Browser test with a temporary same-origin HTML file in `public/` driving an `<iframe>` (`msedge --headless=new --dump-dom`): for **each** of the 7 slugs, load `/work/<slug>`, click a preset, press Send, wait for the playback, assert the ledger has the expected steps, no console errors, the result card appears, and an inspector opens on a node click. Also assert **no element extends past 390px** on every page and that the page is full width at desktop. **Delete the temp file afterwards.**
4. Screenshots at desktop and phone width of at least one design (view them).
5. Only run `npm run build` with the dev server stopped (see CLAUDE.md), then restart dev.
6. Report plainly what was and wasn't verified. **Do not commit or push** until the owner says so.

## 7. Conventions to remember
- Edit files with CRLF carefully (normalise `\r\n` first); never put backticks inside double-quoted shell strings, use the Edit/Write tools instead.
- Port algorithms **faithfully** (same keywords, thresholds, formulas) and cite the source file in each node's `source`.
- Keep the owner's tone rules: creative, not template-like; no glow/gradient/glassmorphism; handwritten notes use SVG arrows; text stays short.
