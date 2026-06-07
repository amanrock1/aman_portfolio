import React, { useEffect, useState } from "react";
import "./CodingArena.css";

const USER_LINKS = {
  leetcode: "https://leetcode.com/YOUR_LEETCODE_USERNAME/",
  codeforces: "https://codeforces.com/profile/YOUR_CODEFORCES_HANDLE",
  codechef: "https://www.codechef.com/users/YOUR_CODECHEF_USERNAME",
};

const fallbackActivity = [0,1,3,2,0,2,4,1,3,2,0,1,4,3,2,1,0,2,3,4,1,0,2,3,1,4,2,0,1,3,2,4,0,1,2,3,4,2,1,0,3,1,2,4,0,2,1,3,2,4,1,0,2,3,4,1,2,0,3,2,1,4,0,2,3,1,4,2,0,1,3,4];

const FALLBACK_DATA = {
  totalSolved: 321,
  leetcode: {
    id: "leetcode",
    name: "LeetCode",
    username: "YOUR_LEETCODE_USERNAME",
    icon: "⌘",
    mark: "LC",
    accent: "#f89f1b",
    mainValue: "156",
    mainLabel: "Problems Solved",
    progress: 42,
    ringLabel: "Solved Map",
    badge: "156",
    tabSub: "Problem solving",
    focus: "DSA",
    profileText: "View LeetCode →",
    metrics: [["Easy", "82"], ["Medium", "61"], ["Hard", "13"], ["Rating", "N/A"]],
    focusItems: [["Current Goal", "200 solved"], ["Strong Area", "Arrays"], ["Next Focus", "DP"], ["Consistency", "Good"]],
    activity: fallbackActivity,
  },
  codeforces: {
    id: "codeforces",
    name: "Codeforces",
    username: "YOUR_CODEFORCES_HANDLE",
    icon: "🏆",
    mark: "CF",
    accent: "#3b82f6",
    mainValue: "1047",
    mainLabel: "Current Rating",
    progress: 70,
    ringLabel: "Next Rank",
    badge: "1047",
    tabSub: "Contest rating",
    focus: "Contests",
    profileText: "View Codeforces →",
    metrics: [["Solved", "94"], ["Max Rating", "1112"], ["Rank", "Pupil"], ["Contests", "18"]],
    focusItems: [["Current Goal", "1200 rating"], ["Strong Area", "Greedy"], ["Next Focus", "Graphs"], ["Contest Mode", "Active"]],
    activity: fallbackActivity.slice().reverse(),
  },
  codechef: {
    id: "codechef",
    name: "CodeChef",
    username: "YOUR_CODECHEF_USERNAME",
    icon: "★",
    mark: "CC",
    accent: "#9a6b45",
    mainValue: "2★",
    mainLabel: "Contest Star Rating",
    progress: 58,
    ringLabel: "Practice",
    badge: "2★",
    tabSub: "Practice + contests",
    focus: "Practice",
    profileText: "View CodeChef →",
    metrics: [["Rating", "1420"], ["Solved", "71"], ["Global", "18K"], ["Stars", "2★"]],
    focusItems: [["Current Goal", "3★"], ["Strong Area", "Math"], ["Next Focus", "Speed"], ["Practice", "Steady"]],
    activity: fallbackActivity.map((x, i) => (x + i) % 5),
  },
};

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const stringValue = String(value);
    if (!/^\d+$/.test(stringValue)) {
      setDisplayValue(stringValue);
      return;
    }

    const target = Number(stringValue);
    const duration = 700;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(String(Math.round(target * easedProgress)));
      if (progress < 1) requestAnimationFrame(updateNumber);
    }

    requestAnimationFrame(updateNumber);
  }, [value]);

  return <>{displayValue}</>;
}

function randomActivity(seed) {
  const arr = [];
  let n = seed;
  for (let i = 0; i < 72; i++) {
    n = (n * 9301 + 49297) % 233280;
    arr.push(Math.floor((n / 233280) * 5));
  }
  return arr;
}

function normalizeApiData(apiData) {
  if (!apiData) return FALLBACK_DATA;

  const leetcode = {
    ...FALLBACK_DATA.leetcode,
    ...apiData.leetcode,
    mainValue: String(apiData.leetcode?.solved ?? FALLBACK_DATA.leetcode.mainValue),
    badge: String(apiData.leetcode?.solved ?? FALLBACK_DATA.leetcode.badge),
    metrics: [
      ["Easy", String(apiData.leetcode?.easy ?? 0)],
      ["Medium", String(apiData.leetcode?.medium ?? 0)],
      ["Hard", String(apiData.leetcode?.hard ?? 0)],
      ["Rating", String(apiData.leetcode?.rating ?? "N/A")],
    ],
    activity: apiData.leetcode?.activity || randomActivity(11),
  };

  const codeforces = {
    ...FALLBACK_DATA.codeforces,
    ...apiData.codeforces,
    mainValue: String(apiData.codeforces?.rating ?? "N/A"),
    badge: String(apiData.codeforces?.rating ?? "N/A"),
    metrics: [
      ["Solved", String(apiData.codeforces?.solved ?? 0)],
      ["Max Rating", String(apiData.codeforces?.maxRating ?? "N/A")],
      ["Rank", String(apiData.codeforces?.rank ?? "Unrated")],
      ["Contests", String(apiData.codeforces?.contests ?? 0)],
    ],
    activity: apiData.codeforces?.activity || randomActivity(22),
  };

  const codechef = {
    ...FALLBACK_DATA.codechef,
    ...apiData.codechef,
    mainValue: String(apiData.codechef?.stars ?? apiData.codechef?.rating ?? "N/A"),
    badge: String(apiData.codechef?.stars ?? "N/A"),
    metrics: [
      ["Rating", String(apiData.codechef?.rating ?? "N/A")],
      ["Solved", String(apiData.codechef?.solved ?? "N/A")],
      ["Global", String(apiData.codechef?.globalRank ?? "N/A")],
      ["Stars", String(apiData.codechef?.stars ?? "N/A")],
    ],
    activity: apiData.codechef?.activity || randomActivity(33),
  };

  const totalSolved = Number(apiData.leetcode?.solved || 0) + Number(apiData.codeforces?.solved || 0) + Number(apiData.codechef?.solved || 0);
  return { totalSolved: totalSolved || FALLBACK_DATA.totalSolved, leetcode, codeforces, codechef };
}

export default function CodingArena() {
  const [stats, setStats] = useState(FALLBACK_DATA);
  const [activePlatform, setActivePlatform] = useState("leetcode");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    ["$", "fetching-platform-stats..."],
    ["✓", "LeetCode ready"],
    ["✓", "Codeforces ready"],
    ["!", "CodeChef may use fallback data"],
  ]);

  const activeData = stats[activePlatform];
  const platforms = [stats.leetcode, stats.codeforces, stats.codechef];

  async function fetchStats() {
    try {
      setLoading(true);
      setTerminalLines([["$", "fetch /api/coding-stats"], ["→", "connecting to platforms..."]]);
      const response = await fetch("/api/coding-stats");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not fetch stats");
      setStats(normalizeApiData(data));
      setLastUpdated(new Date().toLocaleTimeString());
      setTerminalLines([["✓", "live stats loaded"], ["✓", "metrics normalized"], ["✓", "dashboard updated"]]);
    } catch (error) {
      console.error(error);
      setStats(FALLBACK_DATA);
      setTerminalLines([["!", "using fallback preview data"], ["→", "check /api/coding-stats route"], ["→", "replace usernames in api file"]]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const section = document.querySelector(".coding-arena-section");
    function handleMouseMove(event) {
      if (!section) return;
      section.style.setProperty("--mx", event.clientX + "px");
      section.style.setProperty("--my", event.clientY + "px");
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  function handleCardMouseMove(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -7;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 7;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.setProperty("--card-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--card-y", `${(y / rect.height) * 100}%`);
  }

  function handleCardMouseLeave(event) {
    const card = event.currentTarget;
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
    card.style.setProperty("--card-x", "50%");
    card.style.setProperty("--card-y", "50%");
  }

  function selectPlatform(platformId) {
    const platform = stats[platformId];
    setActivePlatform(platformId);
    setTerminalLines([
      ["$", `switch-platform --to ${platform.name.toLowerCase()}`],
      ["✓", `loaded ${platform.metrics.length} metrics`],
      ["✓", "rendered activity heatmap"],
      ["→", `current focus: ${platform.focus}`],
    ]);
  }

  return (
    <section className="coding-arena-section" id="coding-arena">
      <div className="coding-noise"></div>
      <div className="coding-particle particle-one"></div>
      <div className="coding-particle particle-two"></div>
      <div className="coding-particle particle-three"></div>
      <div className="coding-particle particle-four"></div>
      <div className="coding-particle particle-five"></div>
      <div className="coding-particle particle-six"></div>

      <div className="coding-arena-content">
        <div className="coding-arena-heading">
          <div className="coding-eyebrow"><span className="coding-pulse-dot"></span>Interactive Live Coding Dashboard</div>
          <h2>Competitive Coding Arena</h2>
          <p>A live interactive stats section showing my DSA journey, contest progress, solved problems and platform ratings.</p>
        </div>

        <div className="coding-dashboard">
          <aside className="coding-left-panel">
            <div className="coding-panel-glow"></div>
            <div className="coding-profile-block">
              <div className="coding-avatar">A</div>
              <div><h3>Aman Kumar</h3><p>Problem solving • DSA • Contests</p></div>
            </div>

            <div className="coding-platform-tabs">
              {platforms.map((platform) => (
                <button key={platform.id} className={activePlatform === platform.id ? "coding-tab active" : "coding-tab"} style={{ "--platform": platform.accent }} onClick={() => selectPlatform(platform.id)}>
                  <div><strong>{platform.name}</strong><span>{platform.tabSub}</span></div>
                  <div className="coding-badge">{platform.badge}</div>
                </button>
              ))}
            </div>

            <div className="coding-total-card"><p>Total solved across platforms</p><h3><AnimatedNumber value={stats.totalSolved} />+</h3></div>

            <div className="coding-terminal">
              <div className="coding-terminal-top"><span></span><span></span><span></span></div>
              <div className="coding-terminal-body">
                {terminalLines.map((line, index) => <div key={index}><span>{line[0]}</span> {line[1]}</div>)}
              </div>
            </div>
          </aside>

          <main className="coding-right-panel">
            <div className="coding-panel-glow"></div>
            <div className="coding-main-card" style={{ "--accent": activeData.accent }} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <div className="coding-watermark">{activeData.mark}</div>
              <div className="coding-main-card-content">
                <div className="coding-main-top">
                  <div className="coding-platform-name"><div className="coding-platform-logo">{activeData.icon}</div><div><h3>{activeData.name}</h3><p>@{activeData.username}</p></div></div>
                  <div className="coding-live-badge"><span className="coding-pulse-dot"></span>{loading ? "Updating" : "Auto Updating"}</div>
                </div>

                <div className="coding-hero-stats">
                  <div><div className="coding-big-number"><AnimatedNumber value={activeData.mainValue} /></div><div className="coding-big-label">{activeData.mainLabel}</div></div>
                  <div className="coding-ring" style={{ "--progress": activeData.progress }}><div className="coding-ring-text"><strong>{activeData.progress}%</strong><span>{activeData.ringLabel}</span></div></div>
                </div>

                <div className="coding-metrics">
                  {activeData.metrics.map((metric) => <div className="coding-metric" key={metric[0]}><span>{metric[0]}</span><strong>{metric[1]}</strong></div>)}
                </div>

                <div className="coding-lower-grid">
                  <div className="coding-heatmap-panel"><h4>Activity Heatmap<span>hover cells</span></h4><div className="coding-heatmap">{activeData.activity.map((level, index) => <span key={index} className={`coding-cell level-${level}`} title={`${level} submissions`}></span>)}</div></div>
                  <div className="coding-rank-panel"><h4>Current Focus<span>{activeData.focus}</span></h4><div className="coding-rank-list">{activeData.focusItems.map((item) => <div className="coding-rank-item" key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong></div>)}</div></div>
                </div>

                <div className="coding-action-row">
                  <a href={USER_LINKS[activeData.id]} target="_blank" rel="noreferrer" className="coding-action-btn">{activeData.profileText}</a>
                  <button className="coding-action-btn ghost" onClick={fetchStats}>{loading ? "Refreshing..." : "Refresh Stats"}</button>
                </div>
                {lastUpdated && <p className="coding-updated-text">Last updated: {lastUpdated}</p>}
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
