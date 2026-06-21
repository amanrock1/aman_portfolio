import { NextResponse } from 'next/server';

const USERNAMES = {
  leetcode:   "leetcode_kumar",
  codeforces: "Amankumar18",
  codechef:   "codechef_kumar",
  github:     "amanrock1",
};

/* ── Generate fallback 365-day activity ── */
function generateActivity(seed) {
  const activity = [];
  const today = new Date();
  let number = seed;

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    number = (number * 9301 + 49297) % 233280;
    const level = Math.floor((number / 233280) * 5);

    let count = 0;
    if (level === 1) count = 1;
    else if (level === 2) count = 3;
    else if (level === 3) count = 5;
    else if (level === 4) count = 8;

    activity.push({ date: dateStr, level, count });
  }
  return activity;
}

/* ── GitHub Contributions Calendar Scraper ── */
async function fetchGitHubContributions(user) {
  const url = `https://github.com/users/${user}/contributions`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub contributions fetch failed: ${res.status}`);
  const html = await res.text();

  // Parse calendar day cells
  const tdRegex = /<td\s+([^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*)>/g;
  const cells = [];
  let m;
  while ((m = tdRegex.exec(html)) !== null) {
    const attrs = m[1];
    const dateM  = attrs.match(/data-date="([^"]*)"/);
    const levelM = attrs.match(/data-level="([^"]*)"/);
    const idM    = attrs.match(/id="([^"]*)"/);
    if (dateM && levelM) {
      cells.push({ date: dateM[1], level: parseInt(levelM[1], 10), id: idM ? idM[1] : null });
    }
  }

  // Parse tooltip texts (they carry the actual count)
  const tooltipRegex = /<tool-tip[^>]*for="([^"]*)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  const tooltips = {};
  let t;
  while ((t = tooltipRegex.exec(html)) !== null) {
    tooltips[t[1]] = t[2].trim();
  }

  // Pair each cell with its count
  return cells.map((cell) => {
    const tip = cell.id ? (tooltips[cell.id] || "") : "";
    let count = 0;
    const numM = tip.match(/^(\d+)\s+contribution/);
    if (numM) count = parseInt(numM[1], 10);
    return { date: cell.date, level: cell.level, count };
  });
}

/* ── LeetCode ── */
async function getLeetCodeStats() {
  const query = `
    query userSessionProgress($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum { difficulty count submissions }
        }
      }
      userContestRanking(username: $username) { rating globalRanking }
    }
  `;
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
    body: JSON.stringify({ query, variables: { username: USERNAMES.leetcode } }),
  });
  const data = await response.json();
  const matchedUser = data.data && data.data.matchedUser;
  if (!matchedUser) throw new Error("LeetCode user not found");

  const stats  = matchedUser.submitStats.acSubmissionNum;
  const total  = stats.find((i) => i.difficulty === "All");
  const easy   = stats.find((i) => i.difficulty === "Easy");
  const medium = stats.find((i) => i.difficulty === "Medium");
  const hard   = stats.find((i) => i.difficulty === "Hard");
  const cr     = data.data.userContestRanking;

  return {
    id: "leetcode", name: "LeetCode", username: USERNAMES.leetcode,
    solved: total  ? total.count  : 0,
    easy:   easy   ? easy.count   : 0,
    medium: medium ? medium.count : 0,
    hard:   hard   ? hard.count   : 0,
    rating: cr ? Math.round(cr.rating) : "N/A",
    activity: generateActivity(11),
  };
}

/* ── Codeforces ── */
async function getCodeforcesStats() {
  const userUrl        = "https://codeforces.com/api/user.info?handles=" + USERNAMES.codeforces;
  const submissionsUrl = "https://codeforces.com/api/user.status?handle=" + USERNAMES.codeforces + "&from=1&count=10000";
  const ratingUrl      = "https://codeforces.com/api/user.rating?handle=" + USERNAMES.codeforces;

  const [uRes, sRes, rRes] = await Promise.all([fetch(userUrl), fetch(submissionsUrl), fetch(ratingUrl)]);
  const uData = await uRes.json();
  const sData = await sRes.json();
  const rData = await rRes.json();

  if (uData.status !== "OK") throw new Error("Codeforces user not found");
  const user = uData.result[0];
  const solved = new Set();
  if (sData.status === "OK") {
    for (const s of sData.result) {
      if (s.verdict === "OK" && s.problem) solved.add(s.problem.contestId + "-" + s.problem.index);
    }
  }
  return {
    id: "codeforces", name: "Codeforces", username: USERNAMES.codeforces,
    solved:    solved.size,
    rating:    user.rating    || "N/A",
    maxRating: user.maxRating || "N/A",
    rank:      user.rank      || "Unrated",
    contests:  rData.status === "OK" ? rData.result.length : 0,
    activity:  generateActivity(22),
  };
}

/* ── CodeChef (static — no public API) ── */
async function getCodeChefStats() {
  return {
    id: "codechef", name: "CodeChef", username: USERNAMES.codechef,
    solved: 71, rating: 1420, stars: "2★", globalRank: "18K",
    activity: generateActivity(33),
  };
}

/* ── GitHub ── */
async function getGitHubStats() {
  const base    = "https://api.github.com";
  const headers = { "User-Agent": "portfolio-stats", Accept: "application/vnd.github+json" };
  const user    = USERNAMES.github;

  const [profileRes, reposRes, contributionCells] = await Promise.all([
    fetch(`${base}/users/${user}`,                    { headers }),
    fetch(`${base}/users/${user}/repos?per_page=100`, { headers }),
    fetchGitHubContributions(user).catch((err) => {
      console.error("GitHub contributions scrape failed:", err.message);
      return null;
    }),
  ]);

  const profile = await profileRes.json();
  const repos   = await reposRes.json();

  if (profile.message === "Not Found") throw new Error("GitHub user not found");

  const thisYear = new Date().getFullYear();
  let commitCount = 0;
  let streak = 0;
  let activity = [];

  if (contributionCells && contributionCells.length > 0) {
    // Sum all contributions in the current calendar year
    commitCount = contributionCells
      .filter((c) => c.date.startsWith(`${thisYear}-`))
      .reduce((sum, c) => sum + c.count, 0);

    // Longest contribution streak
    const sorted = [...contributionCells].sort((a, b) => a.date.localeCompare(b.date));
    let longest = 0, current = 0;
    for (const c of sorted) {
      if (c.count > 0) { current++; if (current > longest) longest = current; }
      else current = 0;
    }
    streak = longest;
    activity = contributionCells;
  } else {
    activity = generateActivity(44);
    commitCount = activity
      .filter((c) => c.date.startsWith(`${thisYear}-`))
      .reduce((sum, c) => sum + c.count, 0);
    streak = 7;
  }

  // Top language
  const langCount = {};
  if (Array.isArray(repos)) {
    for (const r of repos) {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
  }
  const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Top repos — prioritise the 5 specified by the user
  const targetRepos = ["voxtube", "Argicycle", "SquadUp", "aman_portfolio", "amanrock1"];
  const topRepos = Array.isArray(repos)
    ? repos
        .sort((a, b) => {
          const ai = targetRepos.indexOf(a.name);
          const bi = targetRepos.indexOf(b.name);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return b.stargazers_count - a.stargazers_count;
        })
        .slice(0, 6)
        .map((r) => ({
          name: r.name,
          description: r.description || "No description provided.",
          stars: r.stargazers_count,
          language: r.language || "Mixed",
          url: r.html_url,
        }))
    : [];

  return {
    id: "github", name: "GitHub", username: user,
    commits:  commitCount,
    repos:    profile.public_repos || 0,
    streak,
    topLang,
    activity,
    topRepos,
  };
}

/* ── Fallbacks ── */
function fallbackLeetCode()   { return { id:"leetcode",   name:"LeetCode",   username:USERNAMES.leetcode,   solved:156, easy:82, medium:61, hard:13, rating:"N/A", activity:generateActivity(11) }; }
function fallbackCodeforces() { return { id:"codeforces", name:"Codeforces", username:USERNAMES.codeforces, solved:94, rating:1047, maxRating:1112, rank:"Pupil", contests:18, activity:generateActivity(22) }; }
function fallbackCodeChef()   { return { id:"codechef",   name:"CodeChef",   username:USERNAMES.codechef,   solved:71, rating:1420, stars:"2★", globalRank:"18K", activity:generateActivity(33) }; }
function fallbackGitHub() {
  return {
    id: "github", name: "GitHub", username: USERNAMES.github,
    commits: 32, repos: 5, streak: 7, topLang: "TypeScript",
    activity: generateActivity(44),
    topRepos: [
      { name: "voxtube",       description: "Voxtube is video and audio processing app",             stars: 0, language: "TypeScript",  url: "https://github.com/amanrock1/voxtube"       },
      { name: "Argicycle",     description: "Web 3 app",                                              stars: 0, language: "JavaScript",  url: "https://github.com/amanrock1/Argicycle"     },
      { name: "SquadUp",       description: "Social web app",                                         stars: 0, language: "JavaScript",  url: "https://github.com/amanrock1/SquadUp"       },
      { name: "aman_portfolio",description: "Portfolio website showcasing skills, projects, and achievements.", stars: 0, language: "TypeScript", url: "https://github.com/amanrock1/aman_portfolio" },
      { name: "amanrock1",     description: "Config files for my GitHub profile.",                   stars: 0, language: "Markdown",    url: "https://github.com/amanrock1/amanrock1"     },
    ],
  };
}

/* ── GET handler ── */
export async function GET() {
  try {
    const [lcRes, cfRes, ccRes, ghRes] = await Promise.allSettled([
      getLeetCodeStats(),
      getCodeforcesStats(),
      getCodeChefStats(),
      getGitHubStats(),
    ]);

    return NextResponse.json({
      leetcode:   lcRes.status === "fulfilled" ? lcRes.value : fallbackLeetCode(),
      codeforces: cfRes.status === "fulfilled" ? cfRes.value : fallbackCodeforces(),
      codechef:   ccRes.status === "fulfilled" ? ccRes.value : fallbackCodeChef(),
      github:     ghRes.status === "fulfilled" ? ghRes.value : fallbackGitHub(),
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch coding stats", error: error.message },
      { status: 500 }
    );
  }
}
