"use client";
import Image from "next/image";
import React from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
} from "../ui/responsive-dialog";
import { FloatingDock } from "../ui/floating-dock";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import projects, { Project } from "@/data/projects";
import { SectionHeader } from "./section-header";

import SectionWrapper from "../ui/section-wrapper";

const ProjectsSection = () => {
  return (
    <SectionWrapper id="projects" className="max-w-6xl mx-auto py-24 px-5 md:px-8">
      <SectionHeader
        id="projects"
        title="Featured Work"
        desc="Software engineering, AI/ML applications, and interactive digital projects"
        className="mb-10"
      />
      <div className="flex flex-col gap-0 divide-y divide-zinc-800/60">
        {projects.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
};

const ProjectRow = ({ project, index }: { project: Project; index: number }) => {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger className="w-full bg-transparent text-left">
        <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 md:py-8 items-center cursor-pointer hover:bg-zinc-900/30 -mx-4 px-4 rounded-lg transition-colors">
          {/* Number */}
          <div className="hidden md:block md:col-span-1 text-xs font-mono text-zinc-600">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Thumbnail */}
          <div className="md:col-span-2 flex-shrink-0">
            <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden border border-zinc-800/60">
              <Image
                src={project.src}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
            </div>
          </div>

          {/* Title + category */}
          <div className="md:col-span-5 space-y-1">
            <h3 className="text-base md:text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              {project.category}
            </span>
          </div>

          {/* Tech pills (compact) */}
          <div className="md:col-span-3 flex flex-wrap gap-1.5">
            {project.skills.frontend.slice(0, 3).map((s) => (
              <span key={s.title} className="text-[10px] font-mono text-zinc-500 border border-zinc-800/50 rounded px-1.5 py-0.5">
                {s.title}
              </span>
            ))}
            {project.skills.backend.slice(0, 2).map((s) => (
              <span key={s.title} className="text-[10px] font-mono text-zinc-500 border border-zinc-800/50 rounded px-1.5 py-0.5">
                {s.title}
              </span>
            ))}
          </div>

          {/* Arrow */}
          <div className="hidden md:flex md:col-span-1 justify-end">
            <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
          </div>
        </div>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent className="md:max-w-4xl md:h-[85vh] md:!flex md:flex-col md:overflow-hidden md:p-0 md:gap-0">
        <ResponsiveDialogTitle asChild>
          <span className="sr-only">{project.title}</span>
        </ResponsiveDialogTitle>
        <ResponsiveDialogDescription className="sr-only">
          Details about project {project.title}
        </ResponsiveDialogDescription>

        {/* Sticky header */}
        <div className="shrink-0 border-b border-border bg-background/80 backdrop-blur-sm px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <h4 className="text-lg md:text-xl font-medium text-foreground tracking-tight truncate">
                {project.title}
              </h4>
              <span className="shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2.5 py-0.5 font-mono">
                {project.category}
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-4">
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Source
                </Link>
              )}
              <Link href={project.live} target="_blank">
                <button className="group flex items-center gap-2 bg-zinc-100 text-zinc-900 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors">
                  Visit
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="flex-1" type="always" data-lenis-prevent>
          <div className="px-8 py-8">
            {/* Tech stack */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10"
            >
              {project.skills.frontend?.length > 0 && (
                <div className="flex flex-col items-center md:items-start gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                    Frontend
                  </span>
                  <FloatingDock items={project.skills.frontend} />
                </div>
              )}
              {project.skills.backend?.length > 0 && (
                <div className="flex flex-col items-center md:items-start gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                    Backend
                  </span>
                  <FloatingDock items={project.skills.backend} />
                </div>
              )}
            </motion.div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {project.content}
            </motion.div>
          </div>
        </ScrollArea>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ProjectsSection;
