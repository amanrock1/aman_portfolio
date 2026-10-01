"use client";

import React from "react";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import { SKILLS, SkillCategoryGroup } from "@/data/constants";
import { GraduationCap } from "lucide-react";

const CATEGORIES: { key: SkillCategoryGroup; title: string }[] = [
  { key: "languages", title: "Languages" },
  { key: "software", title: "Frameworks & Tools" },
  { key: "aiml", title: "AI / ML" },
  { key: "interactive", title: "Interactive & 3D" },
];

const AboutSection = () => {
  const allSkills = Object.values(SKILLS);

  return (
    <SectionWrapper
      id="about"
      className="flex w-full flex-col justify-center py-24 px-5 md:px-8 max-w-6xl mx-auto"
    >
      <SectionHeader
        id="about"
        title="About"
        desc="Background, education, and core technologies"
        className="mb-10"
      />

      {/* Bio + Education */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-14">
        <div className="md:col-span-8">
          <p className="text-sm text-zinc-300 leading-relaxed mb-3">
            I&apos;m a software developer focused on full-stack development and AI/ML. I enjoy turning ideas into working products, from AI-powered applications and web platforms to interactive 3D experiences.
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            My academic background in Gaming Technology gives me strong spatial, WebGL, and real-time graphics capabilities as a technical differentiator.
          </p>
        </div>

        <div className="md:col-span-4 border-l border-zinc-800 pl-6">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Education</span>
          </div>
          <div className="text-sm font-medium text-zinc-200">B.Tech Gaming Technology</div>
          <div className="text-xs text-zinc-500 mt-0.5">VIT Bhopal University</div>
        </div>
      </div>

      {/* Tech Stack — compact grouped text lists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((cat) => {
          const skills = allSkills.filter((s) => s.categoryGroup === cat.key);
          if (skills.length === 0) return null;

          return (
            <div key={cat.key}>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3 pb-2 border-b border-zinc-800/60">
                {cat.title}
              </h4>
              <ul className="space-y-1.5">
                {skills.map((skill) => (
                  <li key={skill.name} className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.icon}
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5 object-contain opacity-60"
                    />
                    <span className="text-xs text-zinc-300">{skill.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
