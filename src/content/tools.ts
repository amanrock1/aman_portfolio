// Toolbox: every tool links to the projects that actually used it.
// No proficiency levels on purpose; the projects are the evidence.

export type ToolGroup = "Languages" | "Frontend" | "Backend" | "Data" | "AI" | "Tools";

export type Tool = { name: string; mark: string; group: ToolGroup; usedIn: string[] };

export const toolGroups: ToolGroup[] = ["Languages", "Frontend", "Backend", "Data", "AI", "Tools"];

export const tools: Tool[] = [
  { name: "C++", mark: "C+", group: "Languages", usedIn: [] },
  { name: "Python", mark: "Py", group: "Languages", usedIn: ["opensource-buddy"] },
  { name: "JavaScript", mark: "Js", group: "Languages", usedIn: ["campus-tour", "littlebits", "cyber-runner", "voxtube"] },
  { name: "TypeScript", mark: "Ts", group: "Languages", usedIn: ["dukaandost-ai", "squadup"] },
  { name: "Java", mark: "Jv", group: "Languages", usedIn: [] },
  { name: "React", mark: "Re", group: "Frontend", usedIn: ["voxtube", "dukaandost-ai"] },
  { name: "Next.js", mark: "Nx", group: "Frontend", usedIn: ["dukaandost-ai", "squadup"] },
  { name: "Tailwind CSS", mark: "Tw", group: "Frontend", usedIn: ["dukaandost-ai", "squadup"] },
  { name: "Three.js", mark: "3j", group: "Frontend", usedIn: [] },
  { name: "GSAP", mark: "Gs", group: "Frontend", usedIn: [] },
  { name: "Node.js", mark: "Nd", group: "Backend", usedIn: ["voxtube"] },
  { name: "Express", mark: "Ex", group: "Backend", usedIn: ["voxtube"] },
  { name: "Flask", mark: "Fl", group: "Backend", usedIn: ["opensource-buddy"] },
  { name: "Supabase", mark: "Sb", group: "Data", usedIn: ["voxtube"] },
  { name: "Firebase", mark: "Fb", group: "Data", usedIn: ["squadup"] },
  { name: "PostgreSQL", mark: "Pg", group: "Data", usedIn: ["dukaandost-ai", "voxtube"] },
  { name: "Prisma", mark: "Pr", group: "Data", usedIn: ["dukaandost-ai"] },
  { name: "Gemini API", mark: "Gm", group: "AI", usedIn: ["voxtube"] },
  { name: "Groq", mark: "Gq", group: "AI", usedIn: ["dukaandost-ai"] },
  { name: "Ollama", mark: "Ol", group: "AI", usedIn: ["opensource-buddy"] },
  { name: "Git", mark: "Gt", group: "Tools", usedIn: [] },
  { name: "GitHub", mark: "Gh", group: "Tools", usedIn: [] },
  { name: "Vercel", mark: "Vc", group: "Tools", usedIn: ["dukaandost-ai", "voxtube", "campus-tour"] },
];
