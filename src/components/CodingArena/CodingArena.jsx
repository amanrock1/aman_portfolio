import React, { useEffect, useState } from "react";
import "./CodingArena.css";

/* ────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────── */
const USER_LINKS = {
  leetcode:   "https://leetcode.com/leetcode_kumar/",
  codeforces: "https://codeforces.com/profile/Amankumar18",
  codechef:   "https://www.codechef.com/users/codechef_kumar",
  github:     "https://github.com/amanrock1",
};

/* ── Generate 365-day fallback activity objects ── */
function randomActivity(seed) {
  const arr = [];
  const today = new Date();
  let n = seed;
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    n = (n * 9301 + 49297) % 233280;
    const level = Math.floor((n / 233280) * 5);
    let count = 0;
    if (level === 1) count = 1;
    else if (level === 2) count = 3;
    else if (level === 3) count = 5;
    else if (level === 4) count = 8;
    arr.push({ date: dateStr, level, count });
  }
  return arr;
}

const PLATFORMS = {
  leetcode: {
    id: "leetcode",
    name: "LeetCode",
    mark: "LC",
    icon: "⌘",
    color: "#f89f1b",
    username: "leetcode_kumar",
    tabSub: "Problem solving",
    focus: "DSA",
    mainValue: "156",
    mainLabel: "Problems Solved",
    progress: 42,
    ringLabel: "Solved Map",
    badge: "156",
    metrics: [
      { label: "Easy",   value: "82"  },
      { label: "Medium", value: "61"  },
      { label: "Hard",   value: "13"  },
      { label: "Rating", value: "N/A" },
    ],
    focusItems: [
      ["Current Goal", "200 solved"],
      ["Strong Area",  "Arrays"],
      ["Next Focus",   "DP"],
      ["Consistency",  "Good"],
    ],
    activity: randomActivity(11),
  },
  codeforces: {
    id: "codeforces",
    name: "Codeforces",
    mark: "CF",
    icon: "🏆",
    color: "#3b82f6",
    username: "Amankumar18",
    tabSub: "Contest rating",
    focus: "Contests",
    mainValue: "1047",
    mainLabel: "Current Rating",
    progress: 70,
    ringLabel: "Next Rank",
    badge: "1047",
    metrics: [
      { label: "Solved",     value: "94"   },
      { label: "Max Rating", value: "1112" },
      { label: "Rank",       value: "Pupil"},
      { label: "Contests",   value: "18"   },
    ],
    focusItems: [
      ["Current Goal", "1200 rating"],
      ["Strong Area",  "Greedy"],
      ["Next Focus",   "Graphs"],
      ["Contest Mode", "Active"],
    ],
    activity: randomActivity(22),
  },
  codechef: {
    id: "codechef",
    name: "CodeChef",
    mark: "CC",
    icon: "★",
    color: "#a87c5a",
    username: "codechef_kumar",
    tabSub: "Practice + contests",
    focus: "Practice",
    mainValue: "2★",
    mainLabel: "Star Rating",
    progress: 58,
    ringLabel: "Practice",
    badge: "2★",
    metrics: [
      { label: "Rating",  value: "1420" },
      { label: "Solved",  value: "71"   },
      { label: "Global",  value: "18K"  },
      { label: "Stars",   value: "2★"   },
    ],
    focusItems: [
      ["Current Goal", "3★"],
      ["Strong Area",  "Math"],
      ["Next Focus",   "Speed"],
      ["Practice",     "Steady"],
    ],
    activity: randomActivity(33),
  },
  github: {
    id: "github",
    name: "GitHub",
    mark: "GH",
    icon: "◈",
    color: "#a78bfa",
    username: "amanrock1",
    tabSub: "Open source",
    focus: "Building",
    mainValue: "32",
    mainLabel: "Contributions This Year",
    progress: 60,
    ringLabel: "Repo Goal",
    badge: "5 repos",
    metrics: [
      { label: "Contribs", value: "32"  },
      { label: "Repos",    value: "5"   },
      { label: "Streak",   value: "7d"  },
      { label: "Top Lang", value: "TS"  },
    ],
    focusItems: [],
    activity: randomActivity(44),
    topRepos: [
      { name: "voxtube",        description: "Voxtube is video and audio processing app",                       stars: 0, language: "TypeScript", url: "https://github.com/amanrock1/voxtube"        },
      { name: "Argicycle",      description: "Web 3 app",                                                       stars: 0, language: "JavaScript", url: "https://github.com/amanrock1/Argicycle"      },
      { name: "SquadUp",        description: "Social web app",                                                  stars: 0, language: "JavaScript", url: "https://github.com/amanrock1/SquadUp"        },
      { name: "aman_portfolio", description: "Portfolio website showcasing skills, projects, and achievements.", stars: 0, language: "TypeScript", url: "https://github.com/amanrock1/aman_portfolio" },
      { name: "amanrock1",      description: "Config files for my GitHub profile.",                             stars: 0, language: "Markdown",   url: "https://github.com/amanrock1/amanrock1"      },
    ],
  },
};

const FALLBACK_TOTAL = 321;

/* ────────────────────────────────────────────
   NORMALIZE API RESPONSE
──────────────────────────────────────────── */
function normalizeApiData(api) {
  if (!api) return { platforms: PLATFORMS, totalSolved: FALLBACK_TOTAL };

  const lc = {
    ...PLATFORMS.leetcode,
    mainValue: String(api.leetcode?.solved ?? PLATFORMS.leetcode.mainValue),
    badge:     String(api.leetcode?.solved ?? PLATFORMS.leetcode.badge),
    metrics: [
      { label: "Easy",   value: String(api.leetcode?.easy   ?? 0) },
      { label: "Medium", value: String(api.leetcode?.medium ?? 0) },
      { label: "Hard",   value: String(api.leetcode?.hard   ?? 0) },
      { label: "Rating", value: String(api.leetcode?.rating ?? "N/A") },
    ],
    activity: api.leetcode?.activity || randomActivity(11),
  };

  const cf = {
    ...PLATFORMS.codeforces,
    mainValue: String(api.codeforces?.rating ?? "N/A"),
    badge:     String(api.codeforces?.rating ?? "N/A"),
    metrics: [
      { label: "Solved",     value: String(api.codeforces?.solved    ?? 0) },
      { label: "Max Rating", value: String(api.codeforces?.maxRating ?? "N/A") },
      { label: "Rank",       value: String(api.codeforces?.rank      ?? "Unrated") },
      { label: "Contests",   value: String(api.codeforces?.contests  ?? 0) },
    ],
    activity: api.codeforces?.activity || randomActivity(22),
  };

  const cc = {
    ...PLATFORMS.codechef,
    mainValue: String(api.codechef?.stars ?? api.codechef?.rating ?? "N/A"),
    badge:     String(api.codechef?.stars ?? "N/A"),
    metrics: [
      { label: "Rating",  value: String(api.codechef?.rating     ?? "N/A") },
      { label: "Solved",  value: String(api.codechef?.solved     ?? "N/A") },
      { label: "Global",  value: String(api.codechef?.globalRank ?? "N/A") },
      { label: "Stars",   value: String(api.codechef?.stars      ?? "N/A") },
    ],
    activity: api.codechef?.activity || randomActivity(33),
  };

  const gh = api.github ? {
    ...PLATFORMS.github,
    mainValue: String(api.github.commits ?? PLATFORMS.github.mainValue),
    mainLabel: "Contributions This Year",
    badge:     `${api.github.repos ?? 5} repos`,
    progress:  Math.min(100, Math.round(((api.github.repos ?? 0) / 30) * 100)),
    metrics: [
      { label: "Contribs", value: String(api.github.commits ?? 0) },
      { label: "Repos",    value: String(api.github.repos   ?? 0) },
      { label: "Streak",   value: `${api.github.streak ?? 0}d`    },
      { label: "Top Lang", value: String(api.github.topLang ?? "N/A").slice(0, 6) },
    ],
    activity: api.github.activity || randomActivity(44),
    topRepos: api.github.topRepos || PLATFORMS.github.topRepos,
  } : PLATFORMS.github;

  const totalSolved =
    Number(api.leetcode?.solved   || 0) +
    Number(api.codeforces?.solved || 0) +
    Number(api.codechef?.solved   || 0);

  return {
    platforms: { leetcode: lc, codeforces: cf, codechef: cc, github: gh },
    totalSolved: totalSolved || FALLBACK_TOTAL,
  };
}

/* ────────────────────────────────────────────
   ANIMATED NUMBER
──────────────────────────────────────────── */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const str = String(value);
    if (!/^\d+$/.test(str)) { setDisplay(str); return; }
    const target = Number(str);
    const duration = 750;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(String(Math.round(target * e)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display}</>;
}

/* ────────────────────────────────────────────
   RING GAUGE
──────────────────────────────────────────── */
function RingGauge({ progress, color, label }) {
  const r    = 70;
  const circ = 2 * Math.PI * r;
  return (
    <div className="ca-card-ring ca-card">
      <div className="ca-ring-wrap">
        <svg className="ca-ring-svg" viewBox="0 0 160 160">
          <circle className="ca-ring-track" cx="80" cy="80" r={r} />
          <circle
            className="ca-ring-fill"
            cx="80" cy="80" r={r}
            style={{
              strokeDasharray: circ,
              strokeDashoffset: circ - (circ * progress) / 100,
              stroke: color,
              filter: `drop-shadow(0 0 8px ${color})`,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1), stroke 0.4s ease",
            }}
          />
        </svg>
        <div className="ca-ring-center">
          <span className="ca-ring-pct">{progress}%</span>
          <span className="ca-ring-hint">progress</span>
        </div>
      </div>
      <div className="ca-ring-label">
        <strong>{label}</strong>
        <span>Goal tracker</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   TERMINAL PREFIX
──────────────────────────────────────────── */
function TermPrefix({ sym }) {
  const cls =
    sym === "$" ? "ca-t-prompt" :
    sym === "✓" ? "ca-t-ok"    :
    sym === "!" ? "ca-t-warn"  :
    sym === "→" ? "ca-t-arrow" : "ca-t-prompt";
  return <span className={cls}>{sym}</span>;
}

/* ────────────────────────────────────────────
   FOCUS / TOP REPOS PANEL
──────────────────────────────────────────── */
function FocusPanel({ platform }) {
  const isGitHub = platform.id === "github";

  return (
    <div className="ca-card ca-card-focus">
      <h4>{isGitHub ? "Top Repositories" : `Current Focus · ${platform.focus}`}</h4>

      {isGitHub ? (
        <div className="ca-repo-list">
          {(platform.topRepos || []).map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="ca-repo-item"
            >
              <div className="ca-repo-info">
                <span className="ca-repo-name">{repo.name}</span>
                <span className="ca-repo-desc">{repo.description}</span>
              </div>
              <div className="ca-repo-meta">
                {repo.language && <span className="ca-repo-lang">{repo.language}</span>}
                <span className="ca-repo-stars">★ {repo.stars}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="ca-focus-list">
          {platform.focusItems.map(([k, v]) => (
            <div key={k} className="ca-focus-item">
              <span className="ca-focus-key">{k}</span>
              <span className="ca-focus-val">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────── */
export default function CodingArena() {
  const [data, setData]               = useState({ platforms: PLATFORMS, totalSolved: FALLBACK_TOTAL });
  const [activeId, setActiveId]       = useState("leetcode");
  const [loading, setLoading]         = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [termLines, setTermLines]     = useState([
    ["$",  "fetch --platform-stats"],
    ["✓",  "LeetCode   › ready"],
    ["✓",  "Codeforces › ready"],
    ["!",  "CodeChef   › may use fallback"],
    ["✓",  "GitHub     › ready"],
  ]);

  const active = data.platforms[activeId];

  async function fetchStats() {
    try {
      setLoading(true);
      setTermLines([["$", "GET /api/coding-stats"], ["→", "connecting to platforms..."]]);
      const res  = await fetch("/api/coding-stats");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Fetch failed");
      setData(normalizeApiData(json));
      setLastUpdated(new Date().toLocaleTimeString());
      setTermLines([
        ["✓", "live stats fetched"],
        ["✓", "github contributions synced"],
        ["✓", "dashboard updated"],
      ]);
    } catch (err) {
      console.error(err);
      setData({ platforms: PLATFORMS, totalSolved: FALLBACK_TOTAL });
      setTermLines([
        ["!", "using preview / fallback data"],
        ["→", "check /api/coding-stats route"],
        ["→", "update usernames in api file"],
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStats(); }, []);

  function switchTo(id) {
    setActiveId(id);
    const p = data.platforms[id];
    setTermLines([
      ["$",  `switch --platform ${p.name.toLowerCase()}`],
      ["✓",  `${p.metrics.length} metrics loaded`],
      ["→",  `focus: ${p.focus}`],
    ]);
  }

  return (
    <section className="ca-section" id="coding-arena" style={{ "--active-color": active.color }}>
      <div className="ca-ambient" />

      <div className="ca-content">
        {/* ── HEADER ── */}
        <div className="ca-header">
          <div className="ca-eyebrow">
            <span className="ca-eyebrow-line" />
            Real-time stats
          </div>
          <h2 className="ca-title">
            Competitive<br />
            <em>Coding</em> Arena
          </h2>
          <p className="ca-subtitle">
            DSA progress, contest ratings, and problem-solving statistics — live across all platforms.
          </p>
        </div>

        {/* ── PLATFORM SWITCHER ── */}
        <div className="ca-switcher">
          {Object.values(data.platforms).map((p) => (
            <button
              key={p.id}
              className={`ca-sw-btn${activeId === p.id ? " active" : ""}`}
              style={{ "--p-color": p.color }}
              onClick={() => switchTo(p.id)}
            >
              <span className="ca-sw-mark">{p.mark}</span>
              <span className="ca-sw-name">{p.name}</span>
              <span className="ca-sw-badge">{p.badge}</span>
            </button>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="ca-grid">

          {/* HERO CARD */}
          <div className="ca-card ca-card-hero">
            <div className="ca-hero-top">
              <div className="ca-platform-identity">
                <div className="ca-platform-icon-wrap">
                  {active.icon}
                </div>
                <div className="ca-platform-name-block">
                  <h3>{active.name}</h3>
                  <p>@{active.username}</p>
                </div>
              </div>
              <div className="ca-status-pill">
                {loading ? "SYNCING" : "LIVE"}
              </div>
            </div>

            <div className="ca-big-num-row">
              <div className="ca-big-num" style={{ color: active.color }}>
                <AnimatedNumber value={active.mainValue} />
              </div>
              <div className="ca-big-num-meta">
                <div className="ca-big-num-label">{active.mainLabel}</div>
                <a
                  href={USER_LINKS[active.id]}
                  target="_blank"
                  rel="noreferrer"
                  className="ca-view-link"
                  style={{ color: active.color }}
                >
                  View Profile
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* RING GAUGE */}
          <RingGauge
            progress={active.progress}
            color={active.color}
            label={active.ringLabel}
          />

          {/* METRICS STRIP */}
          <div className="ca-card ca-card-metrics">
            {active.metrics.map((m) => (
              <div className="ca-metric" key={m.label}>
                <div className="ca-metric-label">{m.label}</div>
                <div className="ca-metric-value">
                  <AnimatedNumber value={m.value} />
                </div>
              </div>
            ))}
          </div>




        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="ca-bottom-row">
          {/* FOCUS / TOP REPOS */}
          <FocusPanel platform={active} />

          <div className="ca-card ca-card-total">
            <div className="ca-total-label">Total problems solved</div>
            <div className="ca-total-num">
              <AnimatedNumber value={data.totalSolved} />+
            </div>
            <div className="ca-total-sub">across LeetCode · Codeforces · CodeChef</div>
          </div>

          <div className="ca-card ca-card-terminal">
            <div className="ca-term-bar">
              <div className="ca-term-dots"><span /><span /><span /></div>
              <span className="ca-term-title">coding-stats — zsh</span>
            </div>
            <div className="ca-term-body">
              {termLines.map(([sym, txt], i) => (
                <div key={i}><TermPrefix sym={sym} /> {txt}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ── REFRESH ── */}
        <div className="ca-refresh-row">
          {lastUpdated && <span className="ca-updated-text">Last synced {lastUpdated}</span>}
          <button
            className={`ca-refresh-btn${loading ? " spinning" : ""}`}
            onClick={fetchStats}
            disabled={loading}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 8A6 6 0 1 1 8 2" strokeLinecap="round"/>
              <path d="M8 2l2-2M8 2l2 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {loading ? "Syncing…" : "Refresh Stats"}
          </button>
        </div>
      </div>
    </section>
  );
}
