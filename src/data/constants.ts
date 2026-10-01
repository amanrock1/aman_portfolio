export enum SkillNames {
  JS = "js",
  TS = "ts",
  CPP = "cpp",
  PYTHON = "python",
  POSTGRES = "postgres",
  REACT = "react",
  VUE = "vue",
  NEXTJS = "nextjs",
  NODEJS = "nodejs",
  EXPRESS = "express",
  AI = "ai",
  GEMINI = "gemini",
  THREEJS = "threejs",
  UNITY = "unity",
  UNREAL = "unreal",
  BLENDER = "blender",
  HTML = "html",
  CSS = "css",
  TAILWIND = "tailwind",
  MONGODB = "mongodb",
  WORDPRESS = "wordpress",
  GIT = "git",
  GITHUB = "github",
  DOCKER = "docker",
  GCP = "gcp",
  VERCEL = "vercel",
}

export type SkillCategoryGroup = "languages" | "software" | "aiml" | "interactive";

export type Skill = {
  id: number;
  name: string;
  label: string;
  categoryGroup: SkillCategoryGroup;
  categoryLabel: string;
  shortDescription: string;
  color: string;
  icon: string;
};

export const SKILLS: Record<SkillNames, Skill> = {
  // Languages
  [SkillNames.CPP]: {
    id: 1,
    name: "cpp",
    label: "C++",
    categoryGroup: "languages",
    categoryLabel: "Languages",
    shortDescription: "Object-oriented programming, memory management, and system logic.",
    color: "#00599C",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  [SkillNames.PYTHON]: {
    id: 2,
    name: "python",
    label: "Python",
    categoryGroup: "languages",
    categoryLabel: "Languages",
    shortDescription: "Backend development, data handling, and AI/ML scripting.",
    color: "#3776ab",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  [SkillNames.JS]: {
    id: 3,
    name: "js",
    label: "JavaScript",
    categoryGroup: "languages",
    categoryLabel: "Languages",
    shortDescription: "Modern ES6+ web scripting, asynchronous event handling, and DOM interactions.",
    color: "#f0db4f",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  [SkillNames.TS]: {
    id: 4,
    name: "ts",
    label: "TypeScript",
    categoryGroup: "languages",
    categoryLabel: "Languages",
    shortDescription: "Type-safe JavaScript architecture for reliable full-stack web applications.",
    color: "#007acc",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  [SkillNames.POSTGRES]: {
    id: 5,
    name: "postgres",
    label: "SQL (PostgreSQL)",
    categoryGroup: "languages",
    categoryLabel: "Languages",
    shortDescription: "Relational database schema design, queries, and data integrity.",
    color: "#336791",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },

  // Software & Full-Stack
  [SkillNames.REACT]: {
    id: 6,
    name: "react",
    label: "React",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Component-driven web user interfaces and interactive applications.",
    color: "#61dafb",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  [SkillNames.NEXTJS]: {
    id: 7,
    name: "nextjs",
    label: "Next.js",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Server-side rendering, App Router, and production full-stack frameworks.",
    color: "#ffffff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  [SkillNames.NODEJS]: {
    id: 8,
    name: "nodejs",
    label: "Node.js",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Asynchronous backend runtime and scalable server-side execution.",
    color: "#6cc24a",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  [SkillNames.EXPRESS]: {
    id: 9,
    name: "express",
    label: "Express.js",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "RESTful API development and HTTP request middleware handling.",
    color: "#ffffff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },

  // AI/ML
  [SkillNames.AI]: {
    id: 10,
    name: "ai",
    label: "Machine Learning",
    categoryGroup: "aiml",
    categoryLabel: "AI / Machine Learning",
    shortDescription: "Core ML concepts, data classification, and intelligent algorithm design.",
    color: "#8e44ad",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  [SkillNames.GEMINI]: {
    id: 11,
    name: "gemini",
    label: "LLM Applications & Gemini",
    categoryGroup: "aiml",
    categoryLabel: "AI / Machine Learning",
    shortDescription: "LLM integration, prompt pipelines, and automated text ingestion/summarization.",
    color: "#4285f4",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },

  // Interactive (Supporting Differentiators)
  [SkillNames.THREEJS]: {
    id: 12,
    name: "threejs",
    label: "Three.js & WebGL",
    categoryGroup: "interactive",
    categoryLabel: "Interactive & 3D (Differentiator)",
    shortDescription: "Subtle 3D web graphics rendering and interactive canvas elements.",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
  },
  [SkillNames.UNITY]: {
    id: 13,
    name: "unity",
    label: "Unity Engine",
    categoryGroup: "interactive",
    categoryLabel: "Interactive & 3D (Differentiator)",
    shortDescription: "Academic background in real-time 3D environments and interactive logic.",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
  },
  [SkillNames.BLENDER]: {
    id: 14,
    name: "blender",
    label: "Blender",
    categoryGroup: "interactive",
    categoryLabel: "Interactive & 3D (Differentiator)",
    shortDescription: "3D asset creation, modeling, and real-time mesh preparation.",
    color: "#ea7600",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
  },

  // Supporting Utilities (used in projects)
  [SkillNames.HTML]: {
    id: 15,
    name: "html",
    label: "HTML5",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Semantic web structure.",
    color: "#e34c26",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  [SkillNames.CSS]: {
    id: 16,
    name: "css",
    label: "CSS3",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Styling and responsive layouts.",
    color: "#563d7c",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  [SkillNames.TAILWIND]: {
    id: 17,
    name: "tailwind",
    label: "Tailwind CSS",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Utility-first design system.",
    color: "#38bdf8",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  },
  [SkillNames.MONGODB]: {
    id: 18,
    name: "mongodb",
    label: "MongoDB",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "NoSQL document database.",
    color: "#47a248",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  [SkillNames.GIT]: {
    id: 19,
    name: "git",
    label: "Git",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Version control.",
    color: "#f1502f",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  [SkillNames.GITHUB]: {
    id: 20,
    name: "github",
    label: "GitHub",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Code collaboration.",
    color: "#ffffff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  [SkillNames.DOCKER]: {
    id: 21,
    name: "docker",
    label: "Docker",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Containerization.",
    color: "#2496ed",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  [SkillNames.GCP]: {
    id: 22,
    name: "gcp",
    label: "Google Cloud",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Cloud hosting.",
    color: "#4285f4",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  },
  [SkillNames.VERCEL]: {
    id: 23,
    name: "vercel",
    label: "Vercel",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Edge web hosting.",
    color: "#ffffff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  },
  [SkillNames.UNREAL]: {
    id: 24,
    name: "unreal",
    label: "Unreal Engine",
    categoryGroup: "interactive",
    categoryLabel: "Interactive & 3D (Differentiator)",
    shortDescription: "Real-time 3D environments.",
    color: "#0f0f11",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg",
  },
  [SkillNames.VUE]: {
    id: 25,
    name: "vue",
    label: "Vue.js",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Progressive JavaScript framework.",
    color: "#41b883",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  },
  [SkillNames.WORDPRESS]: {
    id: 26,
    name: "wordpress",
    label: "WordPress",
    categoryGroup: "software",
    categoryLabel: "Software & Web Engineering",
    shortDescription: "Content management system.",
    color: "#007acc",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
  },
};

export type Experience = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  description: string[];
  skills: SkillNames[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    startDate: "Dec 2024",
    endDate: "Present",
    title: "Full Stack Developer",
    company: "OmniNexus Sdn Bhd",
    description: [
      "Built a custom image editor from scratch, cutting $4.8k/year in SaaS costs.",
      "Architected async job queues processing 1k+ AI tasks daily with bulletproof reliability.",
      "Optimized media delivery pipeline, slashing asset load times by 40%.",
      "Shipped high-impact features end-to-end from requirements to production.",
    ],
    skills: [
      SkillNames.NEXTJS,
      SkillNames.TS,
      SkillNames.REACT,
      SkillNames.NODEJS,
      SkillNames.POSTGRES,
      SkillNames.MONGODB,
      SkillNames.DOCKER,
      SkillNames.GCP,
    ],
  },
  {
    id: 2,
    startDate: "Apr 2022",
    endDate: "Dec 2024",
    title: "Freelance Full Stack Developer",
    company: "Self-employed",
    description: [
      "Transformed chaotic Excel sheets into polished internal tools for various clients.",
      "Shipped dashboards and custom CMS platforms tailored to each client's workflow.",
      "Automated repetitive processes, improving efficiency and reducing human error.",
      "Focused on clean, maintainable code and interfaces that users actually enjoy.",
    ],
    skills: [
      SkillNames.REACT,
      SkillNames.VUE,
      SkillNames.NODEJS,
      SkillNames.EXPRESS,
      SkillNames.MONGODB,
      SkillNames.POSTGRES,
      SkillNames.TAILWIND,
      SkillNames.WORDPRESS,
    ],
  },
];

export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};

