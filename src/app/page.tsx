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
        <section className="portfolio-lanyard-section flex flex-col justify-center items-center relative py-16 bg-black/60 backdrop-blur-md">
          <div className="absolute top-12 left-8 md:left-16 text-left z-10 select-none pointer-events-none">
            <h2 className="text-3xl md:text-5xl font-thin tracking-widest text-zinc-100 uppercase font-display">
              Digital Card
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-2 tracking-widest font-light">
              Interact with it
            </p>
          </div>
          <Lanyard position={[0, 0, 12]} gravity={[0, -40, 0]} />
        </section>
        <ContactSection />
      </main>
    </SmoothScroll>
  );
}

export default MainPage;
