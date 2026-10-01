# Project context: Aman Kumar Prabhat's portfolio

Read this before changing anything. It covers what the site is, the rules the owner has set, how the code is laid out, how it is deployed, and the traps already hit. Last updated 2026-10-01.

## What this is

The personal portfolio of **Aman Kumar Prabhat**, a B.Tech CSE student at VIT Bhopal, aimed at **internships and entry-level jobs** in full-stack and AI/ML. Recruiters skim it, often on a phone.

- Positioning: "Full-stack developer building AI-powered products."
- Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3, Zod, Resend. No UI library and no chart library.
- **Status: live.** https://amankumarprabhat.vercel.app is deployed from the `main` branch of https://github.com/amanrock1/aman_portfolio. Pushing to `main` auto-deploys to production through Vercel.

## Rules set by the owner (these override everything else)

1. **Never invent content.** No awards, rankings, metrics, user counts, latencies, file sizes, versions, job experience, locations or "verified" badges unless the fact is in `src/data/config.ts`, `src/content/*`, or fetched live.
   - The old site faked its coding stats with hard-coded numbers and a random heatmap. Never repeat that. When data is missing, show "unavailable" or a labelled placeholder such as `[ screenshot ]`.
   - Design tools (Stitch) repeatedly invented "Hackathon winner", "180ms", "100% verified metrics". Treat any generated copy as suspect.
   - Sources of truth: the resume (`public/Aman_Kumar_Resume_Update.pdf`), the READMEs of the repos under `amanrock1`, and the platforms' public profiles.
2. **Light theme only.** A dark theme was built and tested on 2026-10-01 and the owner **rejected it**. Do not add dark mode or a theme toggle. (Colours are still CSS variables, which is harmless.)
3. **Phone-first AND full-width desktop.** Both widths matter. The owner rejected desktop layouts that were a narrow phone column with empty sides.
4. **Don't push or commit unless asked.** The owner tests on localhost first. Pushing to `main` changes the live site.
5. **Visuals over paragraphs.** Earlier versions were called "boring and text heavy". Prefer charts, tiles, numbers and diagrams.
6. **Agricycle was removed at the owner's request.** Don't add it back.

## Design: "Paper & Ink" with a tactile layer

A warm, editorial page that feels like printed paper you can touch. No gradients, glow, glassmorphism, particles or 3D.

- **Colours** (CSS variables in `src/app/globals.css`, mapped in `tailwind.config.ts`): paper `#F4EFE6`, raised `#FBF8F2`, hairline `#D9D1C2`, ink `#1F2A37`, soft ink `#5B6472`, one vermilion accent `#C8452B`; green `#2F6F5E` only for "live" marks; mustard `#D9A441` for small highlights.
- **Type:** Newsreader (serif headlines and big numbers), Inter (body), JetBrains Mono (labels, dates, tags). Margin notes are vermilion serif italic.
- **Tactile pieces** (`globals.css`): `.press` and `.press-interactive` (letterpress tile with a hard 3px shadow that presses in on hover), `.press-selected`, `.tape`, `.stamp`, `.hatch` (placeholder pattern), `.chip`, `.note`, `.label`. `<MarginNote>` draws a handwritten note with an SVG arrow.
- **Icons:** inline SVG only, from `src/components/icons.tsx`. Never an icon font: Material Symbols rendered as raw text ("history_edu") in an earlier version.
- **Layout shell** (`src/components/shell/site-shell.tsx`):
  - Phone and tablet (below 1024px): top wordmark bar, fixed bottom tab bar (Log, Work, Arena, About, Contact) and a mini-player pill above it. Tap targets at least 44px.
  - Desktop (1024px and up): sticky left rail and full-width content (`max-w-page` = 1440px).

## Phone-width rule (hit a real bug here)

**Every CSS grid needs an explicit single column on phones: write `grid grid-cols-1 gap-… lg:grid-cols-…`.** A bare `grid` has an `auto` column that grows to its widest unbreakable child. Long song titles in the queue stretched the page past the screen, which shifted the Resume link and cut off the player. `grid-cols-1` is `minmax(0, 1fr)`, which fixes it. `html, body` also have `overflow-x: clip` as a safety net, but don't rely on it: it hides the symptom.

Other rules from the same round: `StatTile` wraps its unit under the number (`flex-wrap`) so "solved"/"newbie" stay inside narrow tiles; text that must not wrap uses `truncate` only inside a `min-w-0` parent.

## Code map

```
src/
  app/
    layout.tsx            fonts + Providers + SiteShell
    page.tsx              Home: hero | taped case-study stack | Ship Log + Arena tiles (revalidate 6h)
    work/page.tsx         case-study cards, "more projects", full Ship Log
    work/[slug]/page.tsx  case-study template (sticky problem column + sections); static params
    arena/page.tsx        live coding stats (revalidate 6h)
    toolbox/page.tsx      tools as pressable tiles linked to projects
    about/page.tsx        bento: intro, education, hackathons, certifications, practice
    contact/page.tsx      postcard: copy email, links, letter form
    soundtrack/page.tsx   receipt-style music player
    api/contact/route.ts  Resend email (zod validation, honeypot, 5/hour/IP limit)
    not-found.tsx
  components/
    shell/site-shell.tsx  left rail (lg) / top bar + bottom tabs + mini-player (phone)
    player/               player-context.tsx, mini-player.tsx, receipt-player.tsx, spotify-engine.tsx (SpotifyHost)
    arena/charts.tsx      SVG Heatmap, Bars, SegmentBar, RatingLine (hand-written)
    kit.tsx               PageHeader, SectionLabel, Tags, MarginNote, ScreenshotFrame, ExternalLink
    ship-log.tsx          filterable, expandable feed (client)
    toolbox.tsx           tool grid + "where I used it" panel (client)
    contact.tsx           CopyEmail, LetterForm (client)
    certificates.tsx      certificate stickers + click-to-open viewer (client; Esc, arrows, Prev/Next)
    hackathons.tsx        hackathon tickets + "Show more" for the participated ones (client)
    stat-tile.tsx, icons.tsx, providers.tsx
  content/
    projects.ts           all projects + case-study content (main content file)
    tools.ts              toolbox; each tool lists the project slugs that used it
    about.ts              intro, education, hackathons, certifications, tracks (Spotify), spotifyPlaylist
  data/config.ts          name, tagline, email, resume path, handles, social links
  lib/stats.ts            server-side fetchers for LeetCode, Codeforces, CodeChef, GitHub
  lib/utils.ts            cn()
public/assets/projects/   real screenshots: voxtube/, opensource-buddy/, campus-tour/
public/assets/certificates/ the owner's 11 certificate images (file names contain spaces; the page URL-encodes them)
```

### Projects and their order

The **array order in `src/content/projects.ts` is the display order** on the home stack, Work page and Ship Log (the Ship Log is intentionally not sorted by date, so months can look out of order). Current order:

1. OpenSource Buddy (case study) 2. **360 Campus Tour (case study)** 3. Cyber Runner 2D 4. VoxTube (case study) 5. **DukaanDost AI (case study)** 6. LittleBits 7. SquadUp (GamePool)

On 2026-10-01 the owner asked to swap DukaanDost AI and 360 Campus Tour in both the case-study cards and the Ship Log, keeping both. Four case studies now exist, so the home stack and Work page render four cards (`tilts` in `page.tsx` needs one entry per card).

To add a project: add an entry to `projects.ts` in the position you want it shown. A `caseStudy` field makes it a case study and adds its route automatically. To link a tool to it, add its slug to that tool's `usedIn` in `tools.ts`.

Case-study headlines are problem-first. The DukaanDost, OpenSource Buddy and VoxTube/360 headlines are the assistant's own framing of README facts, not the owner's words; the owner hasn't confirmed all of them.

## The soundtrack player

State lives in `PlayerProvider` (`player-context.tsx`), with three modes chosen from `tracks` in `about.ts`:

- **spotify** (current): any track has a `spotifyUri`. Playlist "2k26" (12 tracks) is wired in; titles and lengths were copied from the playlist's public embed page, so update them by hand if the playlist changes.
- **audio**: tracks have a self-hosted `url`, played through one `<audio>` element.
- **placeholder**: neither is set; buttons only change the UI.

In spotify mode, **one `SpotifyHost` embed lives for the whole visit** (mounted in `providers.tsx`) so the mini-player works on every page:

- The round button plays or pauses from any page. The first tap loads the Spotify embed (`pendingPlay` starts it once ready). The song name links to `/soundtrack`.
- On `/soundtrack` the embed is positioned over a slot div and fully visible. Elsewhere it stays in the viewport but clipped to nothing, because Spotify's iframe is lazy-loaded and won't load far off-screen.
- Visitors who aren't logged into Spotify hear 30-second previews. That is Spotify's rule and the page says so.
- Not verified: actual audio playback (it was only tested in headless browsers, which can't play sound). If playback misbehaves, start debugging in `spotify-engine.tsx` and the `pendingPlay` logic in `player-context.tsx`.

## Live stats (`src/lib/stats.ts`)

Every fetcher returns `null` on failure and the UI shows "unavailable". Results are cached for 6 hours.

| Source | Handle | Method |
|---|---|---|
| LeetCode | `leetcode_kumar` | public GraphQL; calendar filtered to the last 365 days |
| Codeforces | `Amankumar18` | official API |
| CodeChef | `codechef_kumar` | scrapes the public profile HTML (no API exists); fragile, fields fall back to null |
| GitHub | `amanrock1` | REST for repos and followers; contributions and heatmap **only with `GITHUB_TOKEN`** (GraphQL) |

Sanity values on 2026-10-01 (never hard-code): LeetCode 157 solved (109/41/7, all C++); Codeforces rating 994 (newbie), 38 solved, 4 contests (360 → 629 → 808 → 994); CodeChef rating 836, global rank 18,899; GitHub 14 public repos, 4 followers.

## Environment, commands and traps

Environment variables (`.env`, gitignored; set the same names in Vercel → Settings → Environment Variables, then redeploy):
- `RESEND_API_KEY`: enables the contact form. Without it the API returns 503 and the UI tells visitors to email.
- `GITHUB_TOKEN`: optional, read-only. Enables GitHub contributions and the heatmap.

Commands:
- `npm run dev` runs `next dev --webpack`. **Turbopack dev mode crashes on this Windows machine** (its PostCSS worker exits with `0xc0000142` and every page returns 500). Keep the `--webpack` flag. `npm run build` with Turbopack is fine.
- **Don't run `npm run build` while a dev server is running**; it rewrites `.next` and breaks the dev server. Stop dev, build, restart.
- The owner often has their own dev server on port 3000. If it returns 500 for every page, it's the Turbopack crash: kill the process (`taskkill //PID <pid> //F //T` from Git Bash) and start `npm run dev`.
- Edit files with CRLF line endings carefully: a Node script that searched for `\n` mangled `projects.ts`. Normalise with `.replace(/\r\n/g, "\n")` first. Git warns about LF/CRLF on every add; that is harmless.

How to verify phone layout (headless Edge can't go below ~500px wide): put a temporary same-origin HTML file in `public/` that loads pages in `390px` iframes and reports `getBoundingClientRect().right` of elements inside `main` (see git history of this file's session for the script), run it with `msedge --headless=new --dump-dom`, **then delete the file**. Never commit it. `next.config.mjs` sets `X-Frame-Options: SAMEORIGIN`, so only same-origin framing works.

## Deployment and git

- Vercel project `aman_portfolio` is linked to the GitHub repo. A push to `main` builds and deploys production; other branches get preview URLs only.
- To check a deploy: `gh api "repos/amanrock1/aman_portfolio/deployments?sha=<sha>"` then read its `statuses`.
- Commit messages end with the co-author line given in the session's attribution instructions.
- A local branch `backup/pre-rebuild` holds the old dark 3D-keyboard site.

## Verified facts

- **Education:** VIT Bhopal University, B.Tech CSE, Nov 2024 – present, CGPA 8.40 / 10 (through Semester 6, as the resume states; the owner was asked to double-check the semester count).
- **Hackathons** (stated by the owner on 2026-10-01; shown exactly as given in `src/content/about.ts`):
  - The KEN Great Rewiring: 3rd round, finalist
  - Adobe Hackathon: 3rd round
  - Codex India Hackathon 2026: final round (DukaanDost was built for it)
  - Design2Code 2.0 Frontend Hackathon and Dawn of Code Hackathon: final rounds
  - Bharatiya Antariksh Hackathon 2026: 2nd round
  - Behind "Show more" as participated: Claw&Shield 2026; Haxplore (IIT Delhi); and an IIT-BHU event whose name the owner has not given (shown as the institution name only; ask for the event name rather than guessing)
- **Certifications** (11 images in `public/assets/certificates/`; titles and issuers were read from the certificates): Machine Learning A-Z (Udemy); Google AI Essentials and Google Prompting Essentials (Coursera); AI Readiness Foundation (IICT and AI Skills House with Google and YouTube); Intro to AR/VR/MR/XR (University of Michigan); Introduction to Internet of Things (NPTEL, IIT Kharagpur); TCS iON Career Edge - Young Professional; MATLAB Onramp (MathWorks); Python Essentials, Fundamentals of AI and ML and Open Source Software (VITyarthi). "Introduction to Generative AI" (Google) is on the resume but has no image yet, so it is listed but not clickable.
- **Contact:** amanprabhat438@gmail.com. Do not publish a phone number or Instagram.
- **360 Campus Tour** facts come from its README: Pannellum 2.5.6 panoramas, hotspot navigation, stereoscopic VR mode, a canvas chroma-key virtual guide, a navigation sidebar, performance work (texture capping, lazy scenes), MIT licensed. Screenshots in `public/assets/projects/campus-tour/` are real (from the repo).

## Still to do

1. **Delete template leftovers** (an automated deletion was blocked, so the owner must do it or approve it; nothing imports them): `src/components/sections/`, `src/components/ui/`, `src/components/logos/`, `src/components/slide-show.tsx`, `src/components/VirtualTourViewer.tsx`, `src/components/theme-provider.tsx`, `src/data/projects.tsx`, `src/hooks/`, and other people's screenshots in `public/assets/projects-screenshots/` (`codingducks`, `couponluxury`, `ghostchat`, `jra`, `the-booking-desk`).
2. Add `RESEND_API_KEY` (and `GITHUB_TOKEN`) in Vercel, then redeploy.
3. A DukaanDost screenshot (only a 14MB demo webp exists in its repo) and a profile photo; both are placeholders now.
4. Confirm audio playback of the Spotify player on a real phone.
5. Decide whether to restore analytics (Umami and Google Analytics were in the old layout and dropped).
6. Optionally write case studies for LittleBits, Cyber Runner 2D and SquadUp.
7. Get the missing details: the IIT-BHU hackathon's event name, and a certificate image for Introduction to Generative AI.

## Design reference

Stitch project `4009013806429311034` ("Aman Kumar Prabhat — Portfolio") holds the design exploration. The code is the source of truth. Many Stitch screens contain invented text and the mobile-only screens look like a phone column when opened on desktop, so don't copy copy or layouts from Stitch without checking.

## Working with the owner

- They want a creative director, not a template generator: propose concrete alternatives and push back on weak ideas.
- Show screenshots when possible, and say plainly what was and wasn't verified (for example "didn't hear audio", "didn't view at 390px").
- Ask only when two readings lead to different work; otherwise act and state the interpretation.
- Test on localhost first; push only when told to.
