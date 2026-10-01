# Aman Kumar Prabhat · Portfolio

Personal portfolio of **Aman Kumar Prabhat**, a B.Tech CSE student at VIT Bhopal building full-stack and AI-powered products. Built to be read quickly by recruiters, on a phone or a laptop.

**Live:** https://amankumarprabhat.vercel.app

## What's on the site

| Page | What it shows |
|---|---|
| **Home** (`/`) | Name and status, a taped stack of the featured case studies, a filterable **Ship Log** of everything built, and live Arena stats |
| **Work** (`/work`) | Case-study cards, the other projects, and the full Ship Log |
| **Case studies** (`/work/[slug]`) | Problem-first write-ups: **OpenSource Buddy**, **360 Campus Tour**, **VoxTube**, **DukaanDost AI** |
| **Coding Arena** (`/arena`) | Live LeetCode, Codeforces, CodeChef and GitHub stats with a heatmap, a contest-rating graph and topic bars |
| **Toolbox** (`/toolbox`) | 23 tools as pressable tiles; tap one to see which projects used it |
| **About** (`/about`) | Intro, education, hackathons (with a Show more), and certifications you can tap to open |
| **Contact** (`/contact`) | Copy-email, links and a letter-style form (sends through Resend) |
| **Soundtrack** (`/soundtrack`) | A receipt-style music player driving a Spotify playlist |

There is also a mini-player that plays and pauses from any page, and a layout that is phone-first with a full-width desktop layout from 1024px up.

## Design: "Paper & Ink"

A warm, editorial look that feels like printed paper you can touch. Light only.

- **Type:** Newsreader (headlines), Inter (body), JetBrains Mono (labels, dates, tags)
- **Colour:** paper, ink and a single vermilion accent; green only for "live" marks. Colours are CSS variables in `src/app/globals.css`, mapped in `tailwind.config.ts`.
- **Tactile layer:** letterpress tiles with a hard shadow that press in on hover, tape, stamps, handwritten margin notes, hatched placeholders (`.press`, `.tape`, `.stamp`, `.note`, `.hatch` in `globals.css`)
- **Icons:** inline SVG only (`src/components/icons.tsx`), never an icon font

## Honest by design

Nothing on the site is invented. Personal facts live in `src/data/config.ts` and `src/content/*`. The Coding Arena fetches real numbers on the server and shows **"unavailable"** when a source fails, never a made-up fallback. Missing screenshots and songs are labelled placeholders.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Zod · Resend. Charts are hand-written SVG; there is no UI or chart library.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the values you need (all optional)
npm run dev              # http://localhost:3000
```

`npm run dev` uses **webpack** (`next dev --webpack`) because Turbopack's dev mode crashes on some Windows machines. `npm run build` works normally.

### Environment variables

| Variable | Needed for |
|---|---|
| `RESEND_API_KEY` | The contact form. Without it the form tells visitors to email directly |
| `GITHUB_TOKEN` | GitHub contributions and the heatmap (a read-only token is enough). Without it the GitHub card shows repos and followers only |

## Project structure

```
src/
  app/                 routes: /, /work, /work/[slug], /arena, /toolbox, /about, /contact, /soundtrack, /api/contact
  components/
    shell/             left rail (desktop), top bar + bottom tabs (phone)
    player/            player state, mini-player, receipt player, Spotify embed host
    arena/             SVG charts: heatmap, bars, rating line
    kit.tsx, ship-log.tsx, toolbox.tsx, contact.tsx, stat-tile.tsx, icons.tsx
  content/             projects.ts, tools.ts, about.ts: the content you edit
  data/config.ts       name, email, handles, links
  lib/stats.ts         server-side stats for LeetCode, Codeforces, CodeChef, GitHub
public/assets/projects real project screenshots
```

### Updating content

- **Add a project:** edit `src/content/projects.ts`. Give it a `caseStudy` to make it a case study page.
- **Link a tool to a project:** add the project's slug to the tool's `usedIn` in `src/content/tools.ts`.
- **Change the playlist:** edit `tracks` and `spotifyPlaylist` in `src/content/about.ts`. Each track needs a `spotifyUri` (`spotify:track:<id>`).

### Live stats

Fetched on the server and cached for 6 hours:

| Source | Method |
|---|---|
| LeetCode | public GraphQL |
| Codeforces | official API |
| CodeChef | reads the public profile page (no API exists, so this one is fragile and falls back to "unavailable") |
| GitHub | REST for repos and followers; GraphQL for contributions when `GITHUB_TOKEN` is set |

Handles are set in `src/data/config.ts`.

### The Spotify player

The receipt buttons drive Spotify's iFrame API. One embed stays loaded for the whole visit, so the mini-player's play and pause work on every page. Tapping the song name opens the full player. Visitors who aren't logged into Spotify hear 30-second previews; that is Spotify's rule.

## Deployment

Hosted on Vercel and connected to this repo: pushing to `main` deploys to production automatically. Set `RESEND_API_KEY` and `GITHUB_TOKEN` under Project → Settings → Environment Variables, then redeploy.

## Working on this with an AI agent

See [CLAUDE.md](CLAUDE.md): it explains the design rules, the "never invent content" rule, the code map and the known traps.
