// Project data. Facts come from each repo's README and the resume.
// Dates are the month of the latest push to the repo.
// ORDER MATTERS: array order is the display order on the home page, Work page and Ship Log.

export type Category = "Full-stack" | "AI" | "3D" | "Game" | "Hackathon";

export type Screenshot = { src?: string; caption: string };

export type CaseStudySection =
  | { kind: "text"; title: string; body: string }
  | { kind: "steps"; title: string; steps: { label: string; detail?: string }[] }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "callout"; title: string; body: string; note?: string };

export type Project = {
  slug: string;
  title: string;
  date: string; // "2026-10"
  summary: string;
  tags: string[];
  categories: Category[];
  github: string;
  live?: string;
  event?: string;
  cover?: Screenshot;
  caseStudy?: {
    headline: string;
    meta: string;
    screenshots: Screenshot[];
    sections: CaseStudySection[];
    stack: string[];
  };
};

const gh = (repo: string) => `https://github.com/amanrock1/${repo}`;

export const projects: Project[] = [
  {
    slug: "opensource-buddy",
    title: "OpenSource Buddy",
    date: "2026-10",
    summary: "Turns a GitHub issue into a plain-English explanation, required skills and a contribution checklist.",
    tags: ["Python", "Flask", "Ollama"],
    categories: ["AI", "Full-stack", "Hackathon"],
    github: gh("OpenSource-Buddy"),
    event: "Built for Hacktoberfest",
    cover: { src: "/assets/projects/opensource-buddy/issue-form.png", caption: "Issue form" },
    caseStudy: {
      headline: "Beginners get stuck reading their first open-source issue.",
      meta: "Built for Hacktoberfest · Python · Flask · Ollama · MIT licensed",
      screenshots: [
        { src: "/assets/projects/opensource-buddy/issue-form.png", caption: "Issue form" },
        { src: "/assets/projects/opensource-buddy/generated-plan.png", caption: "Generated plan" },
      ],
      sections: [
        {
          kind: "text",
          title: "The problem",
          body: "Many newcomers want to contribute to open source but get stuck at step one: reading an issue and working out what it means, which skills it needs and where to start.",
        },
        {
          kind: "steps",
          title: "What it gives you",
          steps: [
            { label: "Plain-language explanation" },
            { label: "Skills required" },
            { label: "Difficulty estimate", detail: "beginner / intermediate / advanced" },
            { label: "Numbered contribution roadmap" },
            { label: "Questions to investigate in the repository" },
            { label: "Testing checklist" },
          ],
        },
        {
          kind: "callout",
          title: "Honest by design",
          body: "All output is generated guidance, not verified fact. The app never reads the repository and never fetches anything from GitHub.",
          note: "my favourite rule: no fake facts",
        },
      ],
      stack: ["Python", "Flask", "Ollama", "MIT licensed"],
    },
  },
  {
    slug: "campus-tour",
    title: "360 Campus Tour",
    date: "2026-06",
    summary: "Interactive 360-degree VIT Bhopal campus tour with hotspots and scene transitions, VR-ready.",
    tags: ["JavaScript", "Pannellum", "Marzipano"],
    categories: ["3D"],
    github: gh("360-VIRTUAL-CAMPUR-TOUR"),
    live: "https://360-virtual-campur-tour.vercel.app/",
    cover: { src: "/assets/projects/campus-tour/main.png", caption: "Tour home" },
    caseStudy: {
      headline: "Photo galleries can't show how a campus connects.",
      meta: "JavaScript · Pannellum · HTML5 Canvas · MIT licensed",
      screenshots: [
        { src: "/assets/projects/campus-tour/main.png", caption: "Tour home" },
        { src: "/assets/projects/campus-tour/panorama.jpg", caption: "360° panorama" },
      ],
      sections: [
        {
          kind: "text",
          title: "The problem",
          body: "Exploring a large university campus remotely is hard. Static photo galleries and linear videos don't convey scale, connectivity or context, and prospective students and parents often can't visit before enrolling.",
        },
        {
          kind: "steps",
          title: "What it does",
          steps: [
            { label: "Interactive 360° panorama", detail: "drag, pan and zoom high-resolution views of campus sites" },
            { label: "Hotspot navigation", detail: "point-of-interest links move you between adjacent scenes" },
            { label: "Stereoscopic VR mode", detail: "splits the screen for mobile VR headsets" },
            { label: "Chroma-keyed virtual guide", detail: "canvas code removes a green-screen backdrop so a presenter blends into the scene" },
            { label: "Direct navigation sidebar", detail: "jump straight to major locations" },
            { label: "Performance-minded core", detail: "texture capping and lazy scene loading for lower-end devices" },
          ],
        },
      ],
      stack: ["JavaScript (ES6)", "Pannellum 2.5.6", "HTML5 Canvas", "HTML5 / CSS3", "MIT licensed"],
    },
  },
  {
    slug: "cyber-runner",
    title: "Cyber Runner 2D",
    date: "2026-08",
    summary: "Retro cyberpunk platformer on HTML5 Canvas with zero dependencies.",
    tags: ["JavaScript", "Canvas", "Web Audio"],
    categories: ["Game"],
    github: gh("HTML_game_dev"),
    live: "https://amanrock1.github.io/HTML_game_dev/",
  },
  {
    slug: "voxtube",
    title: "VoxTube",
    date: "2026-07",
    summary: "AI YouTube and Reddit comment analyzer with sentiment analysis, summaries and spam detection.",
    tags: ["React", "Node", "Supabase", "Gemini"],
    categories: ["AI", "Full-stack"],
    github: gh("voxtube"),
    live: "https://voxtube-aman.vercel.app",
    cover: { src: "/assets/projects/voxtube/landing_page.png", caption: "Landing page" },
    caseStudy: {
      headline: "Comment sections are too noisy to read.",
      meta: "React · Node.js · Express · Supabase · Gemini API",
      screenshots: [
        { src: "/assets/projects/voxtube/landing_page.png", caption: "Landing page" },
        { src: "/assets/projects/voxtube/youtube_analysis.png", caption: "YouTube analysis" },
        { src: "/assets/projects/voxtube/reddit_analysis.png", caption: "Reddit analysis" },
        { src: "/assets/projects/voxtube/features_pipeline.png", caption: "Features pipeline" },
      ],
      sections: [
        {
          kind: "text",
          title: "The idea",
          body: "An AI tool that analyses YouTube video comments, using the Gemini API for sentiment analysis, smart summaries and spam detection. It also uses the YouTube Data API and the Reddit API for video search and cross-platform discussion analysis.",
        },
        {
          kind: "steps",
          title: "How it works",
          steps: [
            { label: "Comments in", detail: "YouTube Data API + Reddit API" },
            { label: "Gemini API", detail: "analysis" },
            { label: "Out", detail: "sentiment · summary · spam" },
          ],
        },
        {
          kind: "list",
          title: "How it is protected",
          items: ["Rate limiting", "Helmet", "CORS protection", "Cloudflare Turnstile CAPTCHA", "Supabase Row Level Security"],
        },
      ],
      stack: ["React", "Node.js", "Express", "Supabase", "Gemini API", "YouTube Data API", "Reddit API"],
    },
  },
  {
    slug: "dukaandost-ai",
    title: "DukaanDost AI",
    date: "2026-08",
    summary: "Voice-first operations workspace for small Indian retailers. Speak in Hindi or English to record sales, check stock and generate GST invoices.",
    tags: ["Next.js", "Groq", "Prisma", "Postgres"],
    categories: ["AI", "Full-stack", "Hackathon"],
    github: gh("Dukaan_Dost"),
    live: "https://kirana-copilot-ai.vercel.app",
    event: "Codex India Hackathon 2026",
    caseStudy: {
      headline: "Typing is friction for shopkeepers.",
      meta: "Codex India Hackathon 2026 · Next.js · Groq · Prisma · Postgres",
      screenshots: [{ caption: "demo screenshot" }],
      sections: [
        {
          kind: "text",
          title: "The problem",
          body: "Small shops in India are stuck with dense, form-heavy inventory software. Owners are busy and need hands-free updates, and handling GST rates, HSN codes and invoices by hand is slow.",
        },
        {
          kind: "text",
          title: "The idea",
          body: "A voice-first workspace. An owner says “Sold 5 laptops for 40,000 each to Aman” in English or Hindi, and the assistant works out the action, checks stock, updates the database and produces a downloadable GST tax invoice.",
        },
        {
          kind: "steps",
          title: "How it works",
          steps: [
            { label: "Voice or text input", detail: "English or Hindi" },
            { label: "Speech-to-text", detail: "Whisper large-v3 via Groq" },
            { label: "Planner + intent", detail: "Llama 3.3: sale, purchase, stock check or invoice" },
            { label: "Extract details", detail: "product, quantity, price; asks if something is missing" },
            { label: "Match + validate", detail: "fuzzy-matches the catalog and checks stock" },
            { label: "Write + invoice", detail: "saves the transaction and compiles a GST invoice" },
          ],
        },
      ],
      stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind", "Prisma", "Neon Postgres", "Groq (Llama 3.3 70B, Whisper large-v3)", "pdf-lib"],
    },
  },
  {
    slug: "littlebits",
    title: "LittleBits",
    date: "2026-06",
    summary: "Campus clubs and events hub with RSVPs and an admin console, built in vanilla JS with no frameworks.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    categories: ["Full-stack"],
    github: gh("LittleBits"),
    live: "https://littlebitsclub.netlify.app/",
  },
  {
    slug: "squadup",
    title: "SquadUp (GamePool)",
    date: "2026-06",
    summary: "Find gamers to split the cost of multiplayer games, with smart matching.",
    tags: ["Next.js", "Firebase", "Tailwind"],
    categories: ["Full-stack", "Game"],
    github: gh("SquadUp"),
  },
];

export const caseStudies = projects.filter((p) => p.caseStudy);
// Ship Log follows the curated order of `projects` above (not strictly by date).
export const shipLog = projects;

export function formatMonth(date: string) {
  const [y, m] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
