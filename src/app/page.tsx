"use client";

import React from "react";
import SmoothScroll from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/animated-background";
import SkillsSection from "@/components/sections/skills";
import CodingArena from "@/components/CodingArena/CodingArena";
import ProjectsSection from "@/components/sections/projects";
import ContactSection from "@/components/sections/contact";
import HeroSection from "@/components/sections/hero";

import Lanyard from "@/components/Lanyard/Lanyard";

function MainPage() {
  return (
    <SmoothScroll>
      <AnimatedBackground />
      <main className={cn("bg-slate-100 dark:bg-transparent canvas-overlay-mode")}>
        <HeroSection />
        <SkillsSection />
        <CodingArena />
        <ProjectsSection />
        <section className="portfolio-lanyard-section">
          <Lanyard position={[0, 0, 12]} gravity={[0, -40, 0]} />
        </section>
        <ContactSection />
      </main>
    </SmoothScroll>
  );
}

export default MainPage;
