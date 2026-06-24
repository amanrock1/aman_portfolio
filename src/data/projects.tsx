import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiChakraui,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReactquery,
  SiSanity,
  SiShadcnui,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import { FaVrCardboard } from "react-icons/fa";
import { TbBrandFramerMotion, TbMail, TbView360 } from "react-icons/tb";
const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
const PROJECT_SKILLS = {
  html: {
    title: "HTML5",
    bg: "black",
    fg: "white",
    icon: <SiHtml5 />,
  },
  css: {
    title: "CSS3",
    bg: "black",
    fg: "white",
    icon: <SiCss3 />,
  },
  pannellum: {
    title: "Pannellum",
    bg: "black",
    fg: "white",
    icon: <TbView360 />,
  },
  emailjs: {
    title: "EmailJS",
    bg: "black",
    fg: "white",
    icon: <TbMail />,
  },
  vr: {
    title: "Virtual Reality",
    bg: "black",
    fg: "white",
    icon: <FaVrCardboard />,
  },
  vite: {
    title: "Vite",
    bg: "black",
    fg: "white",
    icon: <span>Vite</span>,
  },
  gemini: {
    title: "Google Gemini",
    bg: "black",
    fg: "white",
    icon: <span>Gemini</span>,
  },
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  chakra: {
    title: "Chakra UI",
    bg: "black",
    fg: "white",
    icon: <SiChakraui />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  python: {
    title: "Python",
    bg: "black",
    fg: "white",
    icon: <SiPython />,
  },
  prisma: {
    title: "prisma",
    bg: "black",
    fg: "white",
    icon: <SiPrisma />,
  },
  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  express: {
    title: "Express",
    bg: "black",
    fg: "white",
    icon: <SiExpress />,
  },
  reactQuery: {
    title: "React Query",
    bg: "black",
    fg: "white",
    icon: <SiReactquery />,
  },
  shadcn: {
    title: "ShanCN UI",
    bg: "black",
    fg: "white",
    icon: <SiShadcnui />,
  },
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  docker: {
    title: "Docker",
    bg: "black",
    fg: "white",
    icon: <SiDocker />,
  },
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },
  sockerio: {
    title: "Socket.io",
    bg: "black",
    fg: "white",
    icon: <SiSocketdotio />,
  },
  js: {
    title: "JavaScript",
    bg: "black",
    fg: "white",
    icon: <SiJavascript />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  vue: {
    title: "Vue.js",
    bg: "black",
    fg: "white",
    icon: <SiVuedotjs />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  sanity: {
    title: "Sanity",
    bg: "black",
    fg: "white",
    icon: <SiSanity />,
  },
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: {
    title: "GSAP",
    bg: "black",
    fg: "white",
    icon: "",
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
  supabase: {
    title: "Supabase",
    bg: "black",
    fg: "white",
    icon: <SiSupabase />,
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};
const projects: Project[] = [
  {
    id: "voxtube",
    category: "AI-Powered Analytics",
    title: "VoxTube",
    src: "/assets/projects-screenshots/voxtube/landing_page.png",
    screenshots: ["landing_page.png", "features_pipeline.png", "youtube_analysis.png", "reddit_analysis.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.vite,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.supabase,
        PROJECT_SKILLS.gemini,
      ],
    },
    live: "https://voxtube-aman.vercel.app",
    github: "https://github.com/amanrock1/voxtube",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            VoxTube: AI-Powered Comment Analytics Engine
          </TypographyP>
          <TypographyP className="font-mono ">
            VoxTube is an enterprise-grade analytics engine designed to extract signal from audience noise in seconds.
            By connecting the YouTube Data API v3 and Reddit Data Ingestion with Google Gemini AI, VoxTube aggregates,
            classifies, and summarizes audience feedback. It transforms thousands of lines of text into structured,
            actionable insights (categorized as Praise, Question, Feedback/Bug, or Noise, along with sentiment analysis)
            to guide content strategy and business growth.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          
          <TypographyH3 className="my-4 mt-8">Audience Insight Pipeline</TypographyH3>
          <p className="font-mono mb-2">
            The processing pipeline seamlessly ingests raw comments from YouTube and Reddit, passes them through the
            Gemini AI model for classification and summarization, and saves structured reports for sub-50ms repeat loads.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/voxtube/features_pipeline.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">YouTube Video Analytics</TypographyH3>
          <p className="font-mono mb-2">
            Fetch comments directly from any YouTube video and see a breakdown of praise, bugs, and questions,
            along with automated summaries and sentiment analytics.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/voxtube/youtube_analysis.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Reddit Thread Ingestion</TypographyH3>
          <p className="font-mono mb-2">
            Analyze discussions, subreddits, or threads on Reddit to gauge community sentiment, identify questions,
            and filter out noise in real time.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/voxtube/reddit_analysis.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "vitb-360-tour",
    category: "3D Web Experience",
    title: "VIT Bhopal - 360° Campus Virtual Tour",
    src: "/assets/projects-screenshots/vitb-360-tour/main.png",
    screenshots: ["lion park.jpg", "ab2 main .jpeg", "lc 5.jpg", "all path.jpg", "flag.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.html,
        PROJECT_SKILLS.css,
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.pannellum,
        PROJECT_SKILLS.vr,
      ],
      backend: [
        PROJECT_SKILLS.emailjs,
      ],
    },
    live: "https://360-virtual-campur-tour.vercel.app/",
    github: "https://github.com/amanrock1/360-VIRTUAL-CAMPUR-TOUR",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            VIT Bhopal: Immersive 360° Interactive Campus VR Portal
          </TypographyP>
          <TypographyP className="font-mono ">
            An immersive, highly interactive 360-degree virtual tour of the VIT Bhopal campus. It utilizes panoramic projection engines to let users explore campus landmarks (like the Lion Park, Academic Blocks, and Hostels) directly from their browsers. Features a smooth, responsive UI with micro-interactions, an inquiry contact gateway powered by EmailJS, and a zero-delay split-screen stereoscopic Virtual Reality (VR) mode compatible with mobile VR headsets.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          
          <VirtualTourViewer />
        </div>
      );
    },
  },
];
export default projects;
