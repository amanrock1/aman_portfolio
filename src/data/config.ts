// Single source of truth for personal facts. Everything here is verified
// against the resume, GitHub and the platforms' public profiles. Do not add
// claims that can't be checked.
export const config = {
  name: "Aman Kumar Prabhat",
  wordmark: "amanprabhat",
  tagline: "Full-stack developer building AI-powered products.",
  education: "B.Tech CSE · VIT Bhopal",
  status: "Open to internships & jobs",
  // Social sharing (Open Graph / Twitter). WhatsApp, LinkedIn and X read these.
  title: "Aman Kumar Prabhat | Full-Stack & AI Developer",
  description:
    "B.Tech CSE student at VIT Bhopal building full-stack and AI-powered products. Explore case studies, live coding stats and the tools behind each project.",
  site: "https://amankumarprabhat.vercel.app",
  // 1200x630. Social apps cache previews by URL, so give a NEW file name whenever the image changes.
  ogImage: "/assets/seo/og-portfolio-2026.jpg",
  ogImageAlt: "Aman Kumar Prabhat, full-stack and AI developer, with screenshots of OpenSource Buddy, 360 Campus Tour and VoxTube",
  email: "amanprabhat438@gmail.com",
  resume: "/Aman_Kumar_Prabhat_Resume.pdf",
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
