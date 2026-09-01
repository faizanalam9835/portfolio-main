"use client";

import { ArrowUpRight } from "lucide-react";
import * as React from "react";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectModal } from "@/components/projects/project-modal";
import { RevealItem, RevealGroup } from "@/components/shared/reveal";
import { Section, SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { fadeUp } from "@/lib/motion";
import type { Project } from "@/types";

export function Projects() {
  const [activeProject, setActiveProject] = React.useState<Project | null>(null);

  return (
    <Section id="projects">
      <SectionHeading
        index="03"
        eyebrow="Projects"
        title="Things I've built"
        lead="A few projects I've worked on. Open any one to see what it does, how it's put together and what I learned."
        action={
          <Button asChild variant="outline" size="md" className="group">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-label="Open"
            >
              All repositories
              <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        }
      />

      {/* Three equal cards. A full-width hero card looked oversized on a
          wide screen; the detail lives in the modal, not on the card. */}
      <RevealGroup
        className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        stagger={0.12}
      >
        {projects.map((project) => (
          <RevealItem key={project.id} variants={fadeUp} className="h-full">
            <ProjectCard project={project} onOpenCaseStudy={setActiveProject} />
          </RevealItem>
        ))}
      </RevealGroup>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </Section>
  );
}
