import { config } from "@/data/config";

// Server-side only (imported by server components). Live coding stats. Every fetcher returns null when its source fails:
// the UI then says "unavailable" instead of showing invented fallback numbers.

const REVALIDATE = 60 * 60 * 6; // 6 hours

export type HeatmapDay = { date: string; count: number };

export type LeetCodeStats = {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  topTopics: { name: string; count: number }[];
  languages: { name: string; count: number }[];
  activeDays: number;
  calendar: HeatmapDay[];
};

export type CodeforcesStats = {
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  solved: number;
  contests: number;
  ratingHistory: { contest: string; rating: number }[];
  topTags: { name: string; count: number }[];
};

export type CodeChefStats = {
  rating: number | null;
  highestRating: number | null;
  globalRank: number | null;
  countryRank: number | null;
  solved: number | null;
  contests: number | null;
};

export type GitHubStats = {
  publicRepos: number;
  followers: number;
  languages: { name: string; count: number }[];
  // Contribution data needs a GITHUB_TOKEN (GraphQL); null without one.
  contributions: { total: number; commits: number; activeDays: number; calendar: HeatmapDay[] } | null;
};

async function getJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { ...init, next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function toDay(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

export async function getLeetCode(): Promise<LeetCodeStats | null> {
  const query = `query($u: String!) {
    matchedUser(username: $u) {
      submitStats { acSubmissionNum { difficulty count } }
      submissionCalendar
      languageProblemCount { languageName problemsSolved }
      tagProblemCounts {
        advanced { tagName problemsSolved }
        intermediate { tagName problemsSolved }
        fundamental { tagName problemsSolved }
      }
    }
  }`;
  type Resp = {
    data?: {
      matchedUser: {
        submitStats: { acSubmissionNum: { difficulty: string; count: number }[] };
        submissionCalendar: string;
        languageProblemCount: { languageName: string; problemsSolved: number }[];
        tagProblemCounts: Record<"advanced" | "intermediate" | "fundamental", { tagName: string; problemsSolved: number }[]>;
      } | null;
    };
  };
  const data = await getJson<Resp>("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
    body: JSON.stringify({ query, variables: { u: config.handles.leetcode } }),
  });
  const user = data?.data?.matchedUser;
  if (!user) return null;

  const count = (d: string) => user.submitStats.acSubmissionNum.find((x) => x.difficulty === d)?.count ?? 0;
  // The calendar can include older years; keep the last 365 days so the
  // "active days in the last year" caption matches the heatmap.
  const raw = JSON.parse(user.submissionCalendar || "{}") as Record<string, number>;
  const cutoff = new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10);
  const calendar = Object.entries(raw)
    .map(([ts, c]) => ({ date: toDay(Number(ts)), count: c }))
    .filter((d) => d.date >= cutoff && d.count > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const tags = [...user.tagProblemCounts.fundamental, ...user.tagProblemCounts.intermediate, ...user.tagProblemCounts.advanced];

  return {
    solved: count("All"),
    easy: count("Easy"),
    medium: count("Medium"),
    hard: count("Hard"),
    topTopics: tags
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 6)
      .map((t) => ({ name: t.tagName, count: t.problemsSolved })),
    languages: user.languageProblemCount
      .map((l) => ({ name: l.languageName, count: l.problemsSolved }))
      .sort((a, b) => b.count - a.count),
    activeDays: calendar.length,
    calendar,
  };
}

export async function getCodeforces(): Promise<CodeforcesStats | null> {
  const h = config.handles.codeforces;
  type Wrap<T> = { status: string; result: T };
  const [info, rating, status] = await Promise.all([
    getJson<Wrap<{ rating?: number; maxRating?: number; rank?: string }[]>>(`https://codeforces.com/api/user.info?handles=${h}`),
    getJson<Wrap<{ contestName: string; newRating: number }[]>>(`https://codeforces.com/api/user.rating?handle=${h}`),
    getJson<Wrap<{ verdict?: string; problem: { contestId?: number; index: string; tags: string[] } }[]>>(
      `https://codeforces.com/api/user.status?handle=${h}&from=1&count=10000`,
    ),
  ]);
  if (info?.status !== "OK") return null;

  const user = info.result[0];
  const solved = new Set<string>();
  const tags: Record<string, number> = {};
  if (status?.status === "OK") {
    for (const s of status.result) {
      const id = `${s.problem.contestId}-${s.problem.index}`;
      if (s.verdict !== "OK" || solved.has(id)) continue;
      solved.add(id);
      for (const t of s.problem.tags) tags[t] = (tags[t] ?? 0) + 1;
    }
  }
  const history = rating?.status === "OK" ? rating.result : [];

  return {
    rating: user.rating ?? null,
    maxRating: user.maxRating ?? null,
    rank: user.rank ?? null,
    solved: solved.size,
    contests: history.length,
    ratingHistory: history.map((r) => ({ contest: r.contestName, rating: r.newRating })),
    topTags: Object.entries(tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count })),
  };
}

export async function getCodeChef(): Promise<CodeChefStats | null> {
  // CodeChef has no public stats API, so this reads the public profile page.
  // If the markup changes, fields come back null rather than wrong.
  try {
    const res = await fetch(`https://www.codechef.com/users/${config.handles.codechef}`, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio stats)" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const num = (re: RegExp) => {
      const m = html.match(re);
      return m ? Number(m[1].replace(/,/g, "")) : null;
    };
    const stats: CodeChefStats = {
      rating: num(/rating-number[^>]*>\s*(\d+)/),
      highestRating: num(/Highest Rating[^0-9]*(\d+)/i),
      globalRank: num(/Global Rank[^0-9]*([\d,]+)/i),
      countryRank: num(/Country Rank[^0-9]*([\d,]+)/i),
      solved: num(/Total Problems Solved:?\s*(\d+)/i),
      contests: num(/No\. of Contests Participated:?[^0-9]*(\d+)/i),
    };
    return stats.rating === null && stats.solved === null ? null : stats;
  } catch {
    return null;
  }
}

export async function getGitHub(): Promise<GitHubStats | null> {
  const login = config.handles.github;
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const [user, repos] = await Promise.all([
    getJson<{ public_repos: number; followers: number }>(`https://api.github.com/users/${login}`, { headers }),
    getJson<{ fork: boolean; language: string | null }[]>(`https://api.github.com/users/${login}/repos?per_page=100`, { headers }),
  ]);
  if (!user) return null;

  const langs: Record<string, number> = {};
  for (const r of repos ?? []) if (!r.fork && r.language) langs[r.language] = (langs[r.language] ?? 0) + 1;

  let contributions: GitHubStats["contributions"] = null;
  if (token) {
    type Resp = {
      data?: {
        user: {
          contributionsCollection: {
            totalCommitContributions: number;
            contributionCalendar: { totalContributions: number; weeks: { contributionDays: { date: string; contributionCount: number }[] }[] };
          };
        };
      };
    };
    const q = `query($l: String!) { user(login: $l) { contributionsCollection {
      totalCommitContributions
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    } } }`;
    const data = await getJson<Resp>("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, variables: { l: login } }),
    });
    const c = data?.data?.user.contributionsCollection;
    if (c) {
      const calendar = c.contributionCalendar.weeks.flatMap((w) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
      );
      contributions = {
        total: c.contributionCalendar.totalContributions,
        commits: c.totalCommitContributions,
        activeDays: calendar.filter((d) => d.count > 0).length,
        calendar,
      };
    }
  }

  return {
    publicRepos: user.public_repos,
    followers: user.followers,
    languages: Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
    contributions,
  };
}

export async function getAllStats() {
  const [leetcode, codeforces, codechef, github] = await Promise.all([getLeetCode(), getCodeforces(), getCodeChef(), getGitHub()]);
  return { leetcode, codeforces, codechef, github };
}
