import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight, FileText } from "lucide-react";
import { usePreloader } from "../preloader";
import { BlurIn } from "../reveal-animations";
import ScrollDownIcon from "../scroll-down-icon";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { config } from "@/data/config";
import SectionWrapper from "../ui/section-wrapper";
import Hero3DCanvas from "../Hero3DCanvas";

const HeroSection = () => {
  const { isLoading } = usePreloader();

  return (
    <SectionWrapper id="hero" className={cn("relative w-full min-h-[90vh] flex items-center pt-24 md:pt-0")}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full max-w-6xl mx-auto px-5 md:px-8">

        {/* Text */}
        <div className="md:col-span-8 flex flex-col justify-center items-start z-10 space-y-5">
          {!isLoading && (
            <>
              <BlurIn delay={0.2}>
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Software Developer · AI/ML
                </p>
              </BlurIn>

              <BlurIn delay={0.4}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100 leading-[1.15]">
                  Aman Kumar Prabhat
                </h1>
              </BlurIn>

              <BlurIn delay={0.6}>
                <p className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed">
                  I build software, AI-powered applications, and interactive digital experiences.
                </p>
              </BlurIn>

              <BlurIn delay={0.8}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="#projects">
                    <Button size="sm" className="rounded-md bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-medium px-4 h-8 gap-1.5">
                      View Work
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>

                  <Link
                    href="https://drive.google.com/file/d/15gbx227BA0y99rI79CTLdO5pyblMURoE/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="rounded-md border-zinc-800 text-zinc-300 hover:bg-zinc-900 text-xs font-medium px-4 h-8 gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Resume
                    </Button>
                  </Link>

                  <Link href={config.social.github} target="_blank" aria-label="GitHub">
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-200 h-8 w-8">
                      <SiGithub className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link href={config.social.linkedin} target="_blank" aria-label="LinkedIn">
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-200 h-8 w-8">
                      <SiLinkedin className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </BlurIn>
            </>
          )}
        </div>

        {/* 3D — small, restrained */}
        <div className="md:col-span-4 hidden md:flex items-center justify-center">
          {!isLoading && <Hero3DCanvas />}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
        <ScrollDownIcon />
      </div>
    </SectionWrapper>
  );
};

export default HeroSection;
