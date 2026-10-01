"use client";

import React from "react";
import SmoothScroll from "@/components/smooth-scroll";
import HeroSection from "@/components/sections/hero";
import ProjectsSection from "@/components/sections/projects";
import AboutSection from "@/components/sections/skills";
import ContactSection from "@/components/sections/contact";

function MainPage() {
  return (
    <SmoothScroll>
      <main className="bg-zinc-950 text-zinc-100 min-h-screen">
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </SmoothScroll>
  );
}

export default MainPage;
