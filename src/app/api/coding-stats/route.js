import { NextResponse } from 'next/server';

const USERNAMES = {
  leetcode: "leetcode_kumar",
  codeforces: "Amankumar18",
  codechef: "codechef_kumar",
};

function generateActivity(seed) {
  const values = [];
  let number = seed;

  for (let i = 0; i < 72; i++) {
    number = (number * 9301 + 49297) % 233280;
    values.push(Math.floor((number / 233280) * 5));
  }

  return values;
}

async function getLeetCodeStats() {
  const query = `
    query userSessionProgress($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({
      query,
      variables: { username: USERNAMES.leetcode },
    }),
  });

  const data = await response.json();
  const matchedUser = data.data && data.data.matchedUser;
  if (!matchedUser) throw new Error("LeetCode user not found");

  const stats = matchedUser.submitStats.acSubmissionNum;
  const total = stats.find((item) => item.difficulty === "All");
  const easy = stats.find((item) => item.difficulty === "Easy");
  const medium = stats.find((item) => item.difficulty === "Medium");
  const hard = stats.find((item) => item.difficulty === "Hard");
  const contestRanking = data.data.userContestRanking;

  return {
    id: "leetcode",
    name: "LeetCode",
    username: USERNAMES.leetcode,
    solved: total ? total.count : 0,
    easy: easy ? easy.count : 0,
    medium: medium ? medium.count : 0,
    hard: hard ? hard.count : 0,
    rating: contestRanking ? Math.round(contestRanking.rating) : "N/A",
    activity: generateActivity(11),
  };
}

async function getCodeforcesStats() {
  const userUrl = "https://codeforces.com/api/user.info?handles=" + USERNAMES.codeforces;
  const submissionsUrl = "https://codeforces.com/api/user.status?handle=" + USERNAMES.codeforces + "&from=1&count=10000";
  const ratingUrl = "https://codeforces.com/api/user.rating?handle=" + USERNAMES.codeforces;

  const [userResponse, submissionsResponse, ratingResponse] = await Promise.all([
    fetch(userUrl),
    fetch(submissionsUrl),
    fetch(ratingUrl),
  ]);

  const userData = await userResponse.json();
  const submissionsData = await submissionsResponse.json();
  const ratingData = await ratingResponse.json();

  if (userData.status !== "OK") throw new Error("Codeforces user not found");

  const user = userData.result[0];
  const solvedProblems = new Set();

  if (submissionsData.status === "OK") {
    for (const submission of submissionsData.result) {
      if (submission.verdict === "OK" && submission.problem) {
        solvedProblems.add(submission.problem.contestId + "-" + submission.problem.index);
      }
    }
  }

  return {
    id: "codeforces",
    name: "Codeforces",
    username: USERNAMES.codeforces,
    solved: solvedProblems.size,
    rating: user.rating || "N/A",
    maxRating: user.maxRating || "N/A",
    rank: user.rank || "Unrated",
    contests: ratingData.status === "OK" ? ratingData.result.length : 0,
    activity: generateActivity(22),
  };
}

async function getCodeChefStats() {
  return {
    id: "codechef",
    name: "CodeChef",
    username: USERNAMES.codechef,
    solved: 71,
    rating: 1420,
    stars: "2★",
    globalRank: "18K",
    activity: generateActivity(33),
  };
}

function fallbackLeetCode() {
  return { id: "leetcode", name: "LeetCode", username: USERNAMES.leetcode, solved: 156, easy: 82, medium: 61, hard: 13, rating: "N/A", activity: generateActivity(11) };
}

function fallbackCodeforces() {
  return { id: "codeforces", name: "Codeforces", username: USERNAMES.codeforces, solved: 94, rating: 1047, maxRating: 1112, rank: "Pupil", contests: 18, activity: generateActivity(22) };
}

function fallbackCodeChef() {
  return { id: "codechef", name: "CodeChef", username: USERNAMES.codechef, solved: 71, rating: 1420, stars: "2★", globalRank: "18K", activity: generateActivity(33) };
}

export async function GET() {
  try {
    const [leetcodeResult, codeforcesResult, codechefResult] = await Promise.allSettled([
      getLeetCodeStats(),
      getCodeforcesStats(),
      getCodeChefStats(),
    ]);

    return NextResponse.json({
      leetcode: leetcodeResult.status === "fulfilled" ? leetcodeResult.value : fallbackLeetCode(),
      codeforces: codeforcesResult.status === "fulfilled" ? codeforcesResult.value : fallbackCodeforces(),
      codechef: codechefResult.status === "fulfilled" ? codechefResult.value : fallbackCodeChef(),
    }, {
      headers: {
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch coding stats", error: error.message }, { status: 500 });
  }
}
