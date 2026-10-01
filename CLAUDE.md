# Project context: Aman Kumar Prabhat's portfolio

Read this before changing anything. It covers what the site is, the design rules, how the code is laid out, and the traps already found.

## What this is

The personal portfolio of **Aman Kumar Prabhat**, a B.Tech CSE student at VIT Bhopal. It is aimed at **internships and entry-level jobs** in full-stack and AI/ML. Recruiters skim it, often on a phone.

- Positioning: "Full-stack developer building AI-powered products."
- Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3. No UI library.
- Status: rebuilt from scratch on 2026-10-01. Builds cleanly and all routes return 200. Not yet committed or deployed.

## Rule zero: never invent content

The owner explicitly rejects invented facts. This rule overrides everything else.

- Never add awards, rankings, metrics, user counts, latencies, file sizes, versions, job experience or "verified" badges unless they are in `src/data/config.ts`, `src/content/*`, or fetched live.
- The old site faked its coding stats with hard-coded numbers and a random heatmap. Do not repeat that. When data is missing, show "unavailable" or a labelled placeholder such as `[ screenshot ]` or `[song title]`.
- Earlier design tools invented "Hackathon winner", "180ms" and "100% verified metrics". Treat any generated copy as suspect and check it against the sources below.
- Sources of truth: the resume (`public/Aman_Kumar_Resume_Update.pdf`), the READMEs of the GitHub repos under `amanrock1`, and the platforms' public profiles.

## Design direction: "Paper & Ink" with a tactile layer

The owner chose this after comparing several concepts. Keep it; don't drift back to a generic "dark AI developer" look.

- **Look:** a warm, editorial page that feels like printed paper you can touch. Light only, with no dark mode, gradients, glow, glassmorphism, particles or 3D.
- **Colours** (in `tailwind.config.ts`):
  - paper `#F4EFE6`, raised paper `#FBF8F2`, hairline `#D9D1C2`
  - ink `#1F2A37`, soft ink `#5B6472`
  - vermilion `#C8452B` is the single accent
  - signal green `#2F6F5E` for "live" marks only; mustard `#D9A441` for small highlights only
- **Type:** Newsreader serif for headlines and big numbers, Inter for body text, JetBrains Mono for labels, dates and tags. Margin notes are vermilion serif italic.
- **Tactile pieces** (in `globals.css`):
  - `.press` and `.press-interactive`: letterpress tiles with a hard 3px ink shadow that press in on hover
  - `.tape`, `.stamp`, `.hatch` (placeholder pattern), `.chip`, `.note`
  - `<MarginNote>`: a handwritten note with an SVG arrow
- **Prefer visuals over paragraphs.** The owner said earlier versions were "boring and text heavy". Use charts, tiles and numbers instead of long text.
- **Responsive is a hard requirement, and both widths matter:**
  - Phone (below 1024px): top wordmark bar, fixed bottom tab bar, and a mini-player pill above it. Tap targets at least 44px.
  - Desktop (1024px and up): sticky left rail and **full-width** content (`max-w-page` is 1440px). The owner rejected desktop layouts that were a narrow phone column with empty sides. Never do that.
- **Icons:** inline SVG only, from `src/components/icons.tsx`. Never use an icon font, because it rendered as raw text ("history_edu") in an earlier version.

## Code map

```
src/
  app/
    layout.tsx            fonts + Providers + SiteShell
    page.tsx              Home: hero | taped case-study stack | Ship Log + Arena tiles (revalidate 6h)
    work/page.tsx         case-study cards, other projects, full Ship Log
    work/[slug]/page.tsx  case-study template (sticky problem column + sections); static params
    arena/page.tsx        live coding stats (revalidate 6h)
    toolbox/page.tsx      skills as pressable tiles linked to projects
    about/page.tsx        bento: intro, education, hackathons, certifications, practice
    contact/page.tsx      postcard: copy email, links, letter form
    soundtrack/page.tsx   receipt-style music player
    api/contact/route.ts  Resend email (zod validation, honeypot, 5/hour/IP limit)
    not-found.tsx
  components/
    shell/site-shell.tsx  left rail (lg) / top bar + bottom tabs (mobile)
    player/               PlayerProvider (context + <audio>), MiniPlayer, ReceiptPlayer
    arena/charts.tsx      SVG Heatmap, Bars, SegmentBar, RatingLine (hand-written, no chart lib)
    kit.tsx               PageHeader, SectionLabel, Tags, MarginNote, ScreenshotFrame, ExternalLink
    ship-log.tsx          filterable, expandable dated feed (client)
    toolbox.tsx           tool grid + "where I used it" panel (client)
    contact.tsx           CopyEmail, LetterForm (client)
    stat-tile.tsx, icons.tsx, providers.tsx
  content/
    projects.ts           all projects + case-study content (the main content file)
    tools.ts              toolbox; each tool lists the project slugs that used it
    about.ts              intro, education, hackathons, certifications, tracks, spotifyPlaylist
  data/config.ts          name, tagline, email, resume path, handles, social links
  lib/stats.ts            server-side fetchers for LeetCode, Codeforces, CodeChef, GitHub
  lib/utils.ts            cn()
public/assets/projects/   real screenshots: voxtube/, opensource-buddy/, campus-tour/
```

To add a project, edit `src/content/projects.ts`. Give it a `caseStudy` field to make it a case study, which also adds it to `generateStaticParams`. To link a tool to it, add its slug to the tool's `usedIn` in `tools.ts`.

## Live stats (`src/lib/stats.ts`)

Every fetcher returns `null` on failure, and the UI then shows "unavailable". Results are cached for 6 hours.

| Source | Handle | Method |
|---|---|---|
| LeetCode | `leetcode_kumar` | public GraphQL; calendar filtered to the last 365 days |
| Codeforces | `Amankumar18` | official API (`user.info`, `user.rating`, `user.status`) |
| CodeChef | `codechef_kumar` | scrapes the public profile HTML (no API); fragile, fields fall back to null |
| GitHub | `amanrock1` | REST for repos and followers; contributions and heatmap **only with `GITHUB_TOKEN`** (GraphQL) |

Values on 2026-10-01, for sanity checks only and never to hard-code: LeetCode 157 solved (109 easy / 41 medium / 7 hard, all C++); Codeforces rating 994 (newbie), 38 solved, 4 contests (360 → 629 → 808 → 994); CodeChef rating 836, global rank 18,899.

## Environment variables (`.env`)

- `GITHUB_TOKEN`: optional, read-only. Enables GitHub contributions and the heatmap.
- `RESEND_API_KEY`: optional. Enables the contact form; without it the API returns 503 and the UI tells people to email instead.

## Commands and environment traps

- `npm run dev` runs `next dev --webpack`. **Turbopack dev mode crashes on this Windows machine**: its PostCSS worker exits with `0xc0000142` and every page returns 500. Keep the `--webpack` flag. `npm run build` with Turbopack works fine.
- Don't run `npm run build` while a dev server is running. It rewrites `.next` and breaks the dev server.
- The owner usually runs their own dev server on port 3000.
- `next.config.mjs` sets `X-Frame-Options: SAMEORIGIN`, so the site can't be framed from other origins. This matters for screenshot tricks.
- Headless Edge can't render below about 500px wide. Check phone layouts in browser device mode.

## Facts (verified)

- **Education:** VIT Bhopal University, B.Tech CSE, Nov 2024 – present, CGPA 8.40 / 10 (through Semester 6, as the resume states).
- **Hackathons:**
  - Final rounds of the Design2Code 2.0 Frontend Hackathon and the Dawn of Code Hackathon.
  - Participated in the Bharatiya Antariksh Hackathon 2026 and the Codex India Hackathon 2026 (DukaanDost was built for the latter).
- **Certifications:** listed in `src/content/about.ts`.
- **Contact:** email amanprabhat438@gmail.com. Do not publish a phone number or Instagram.
- **Projects:**
  - Case studies: OpenSource Buddy, DukaanDost AI, VoxTube.
  - Others: 360 Campus Tour, LittleBits, Cyber Runner 2D, SquadUp (GamePool).
  - **Agricycle was removed at the owner's request.** Don't add it back.

## Still to do

1. **Delete template leftovers.** The automated deletion was blocked, so the owner should delete these or approve deleting them. Nothing imports them:
   - `src/components/sections/`, `src/components/ui/`, `src/components/logos/`
   - `src/components/slide-show.tsx`, `src/components/VirtualTourViewer.tsx`, `src/components/theme-provider.tsx`
   - `src/data/projects.tsx`, `src/hooks/`
   - other people's screenshots in `public/assets/projects-screenshots/` (`codingducks`, `couponluxury`, `ghostchat`, `jra`, `the-booking-desk`)
2. Real songs (title, artist, audio `url`) or a Spotify playlist URL in `src/content/about.ts`. These are placeholders now.
3. A DukaanDost screenshot (only a 14MB demo webp exists in its repo) and a profile photo. These are placeholders now.
4. Check the 390px phone layout in a real browser, and click through the interactions (filters, toolbox, player, contact form).
5. Decide whether to bring back analytics (Umami / Google Analytics were in the old layout and were dropped).
6. Commit on a branch and deploy. Vercel was used before: https://amankumarprabhat.vercel.app.

## Design reference

The Stitch project `4009013806429311034` ("Aman Kumar Prabhat — Portfolio") holds the design exploration. The code is now the source of truth. Several Stitch screens contain invented text that was never cleaned up, so don't copy copy from Stitch without checking it.

## Working with the owner

- They want a creative director, not a template generator: propose concrete alternatives and push back on weak ideas.
- Show them screenshots when possible, and say plainly what was and wasn't verified.
- Commit only when asked.
