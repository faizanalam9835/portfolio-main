"use client";

import { ArrowUpRight, ExternalLink, ScanSearch } from "lucide-react";
import type * as React from "react";

import { ProjectPreview } from "@/components/projects/project-preview";
import { Github } from "@/components/ui/brand-icons";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { accentStyles, cn } from "@/lib/utils";
import type { Project } from "@/types";

const STATUS_VARIANT: Record<Project["status"], "blue" | "violet" | "cyan" | "muted"> =
  {
    Live: "blue",
    "Personal Project": "violet",
    "In Progress": "cyan",
    "Open Source": "muted",
  };

/**
 * One compact card per project. Everything here is the summary — the
 * problem/solution write-up, architecture and feature list live in the
 * modal, which is what keeps the card from growing into a page section.
 */
export function ProjectCard({
  project,
  onOpenCaseStudy,
}: {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
}) {
  const accent = accentStyles[project.preview.accent];
  const VISIBLE_STACK = 4;
  const overflow = project.stack.length - VISIBLE_STACK;

  return (
    <SpotlightCard accentHex={accent.hex} tilt={5} className="h-full">
      <div className="relative shrink-0">
        <ProjectPreview
          project={project}
          className="aspect-[16/9] border-b border-[var(--border-subtle)]"
        />

        <span className="absolute left-3.5 top-3.5 font-mono text-[0.625rem] tracking-widest text-[var(--text-tertiary)]">
          {project.index}
        </span>

        <div className="absolute right-3.5 top-3.5">
          <Badge variant={STATUS_VARIANT[project.status]} size="sm">
            {project.status}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          <span className={accent.text}>{project.category}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
        </div>

        <h3 className="mt-2.5 text-[1.0625rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
          {project.title}
        </h3>

        <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--text-secondary)]">
          {project.tagline}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, VISIBLE_STACK).map((tech) => (
            <li key={tech}>
              <Badge variant="muted" size="sm">
                {tech}
              </Badge>
            </li>
          ))}
          {overflow > 0 ? (
            <li>
              <Badge variant="outline" size="sm">
                +{overflow}
              </Badge>
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <button
            type="button"
            onClick={() => onOpenCaseStudy(project)}
            data-cursor-label="Explore"
            className={cn(
              "group/btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5",
              "bg-ink-900 text-[0.75rem] font-medium text-white",
              "transition-colors duration-300 hover:bg-ink-950",
              "dark:bg-white dark:text-ink-900 dark:hover:bg-ink-50",
            )}
          >
            <ScanSearch className="size-3.5" aria-hidden />
            Details
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>

          {project.links.demo ? (
            <IconLink
              href={project.links.demo}
              label={`${project.title} live demo`}
              cursorLabel="Open"
            >
              <ExternalLink className="size-3.5" aria-hidden />
              Live
            </IconLink>
          ) : null}

          {project.links.github ? (
            <IconLink
              href={project.links.github}
              label={`${project.title} source on GitHub`}
              cursorLabel="Open"
            >
              <Github className="size-3.5" aria-hidden />
              Code
            </IconLink>
          ) : null}
        </div>
      </div>
    </SpotlightCard>
  );
}

function IconLink({
  href,
  label,
  cursorLabel,
  children,
}: {
  href: string;
  label: string;
  cursorLabel: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      data-cursor-label={cursorLabel}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5",
        "border-[var(--border-strong)] text-[0.75rem] font-medium text-[var(--text-secondary)]",
        "transition-colors duration-300 hover:border-accent-blue/40 hover:text-[var(--text-primary)]",
      )}
    >
      {children}
    </a>
  );
}
