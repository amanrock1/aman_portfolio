// Single source of truth for personal facts. Everything here is verified
// against the resume, GitHub and the platforms' public profiles. Do not add
// claims that can't be checked.
export const config = {
  name: "Aman Kumar Prabhat",
  wordmark: "amanprabhat",
  tagline: "Full-stack developer building AI-powered products.",
  education: "B.Tech CSE · VIT Bhopal",
  status: "Open to internships & jobs",
  title: "Aman Kumar Prabhat · Full-stack & AI developer",
  description:
    "Portfolio of Aman Kumar Prabhat, a B.Tech CSE student at VIT Bhopal building full-stack and AI-powered products.",
  site: "https://amankumarprabhat.vercel.app",
  email: "amanprabhat438@gmail.com",
  resume: "/Aman_Kumar_Resume_Update.pdf",
  handles: {
    github: "amanrock1",
    leetcode: "leetcode_kumar",
    codeforces: "Amankumar18",
    codechef: "codechef_kumar",
  },
  social: {
    github: "https://github.com/amanrock1",
    linkedin: "https://www.linkedin.com/in/aman-kumar-prabhat-b75735325",
    leetcode: "https://leetcode.com/u/leetcode_kumar/",
    codeforces: "https://codeforces.com/profile/Amankumar18",
    codechef: "https://www.codechef.com/users/codechef_kumar",
  },
} as const;
