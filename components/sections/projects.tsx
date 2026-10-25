"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import * as React from "react";

import { Github } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { sectionClass, SectionTitle } from "@/components/shared/section-title";
import { projects } from "@/data/projects";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export function Projects() {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <section id="projects" className={sectionClass}>
      <div className="w-full">
        <SectionTitle
          index="03"
          eyebrow="Projects"
          title="Things I've built"
          description="Real projects, each with a live demo and public source. Open one to see how it's put together."
        />

        <ol className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              open={openId === project.id}
              onToggle={() => setOpenId((id) => (id === project.id ? null : project.id))}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `project-${project.id}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      className={cn(
        "frame group overflow-hidden rounded-md border transition-colors duration-500",
        open ? "border-white bg-black" : "border-white/10 bg-black/40 backdrop-blur-md hover:border-white/60",
      )}
    >
      <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:p-10">
        <span
          className={cn(
            "font-display text-6xl font-bold leading-none transition-all duration-500 md:text-8xl",
            open ? "text-white" : "text-outline text-white/40 group-hover:text-white",
          )}
        >
          {project.index}
        </span>

        <div>
          <div
            className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/50"
          >
            <span>{project.category}</span>
            <span>·</span>
            <span>{project.year}</span>
            <span
              className="rounded-md border border-white/30 px-2 py-0.5 text-white"
            >
              {project.status}
            </span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
            {project.title}
          </h3>
          <p className="mt-2 max-w-2xl text-white/65">
            {project.tagline}
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/80"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-col">
          {project.links.demo ? (
            <Button asChild size="sm" variant="light">
              <a href={project.links.demo} target="_blank" rel="noreferrer">
                Live demo <ArrowUpRight />
              </a>
            </Button>
          ) : null}
          {project.links.github ? (
            <Button asChild size="sm" variant="outline-light">
              <a href={project.links.github} target="_blank" rel="noreferrer">
                <Github /> Source
              </a>
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline-light"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
          >
            <Plus className={cn("transition-transform duration-500", open && "rotate-45")} />
            {open ? "Close" : "Details"}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <div className="grid gap-8 border-t border-white/10 p-6 md:grid-cols-2 md:p-10">
              <div className="space-y-6">
                <p className="text-white/75">{project.description}</p>
                <Detail title="The problem" body={project.problem} />
                <Detail title="The solution" body={project.solution} />
                <dl className="grid grid-cols-3 gap-2">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded-md border border-white/10 p-3">
                      <dt className="text-[0.65rem] uppercase tracking-wider text-white/45">
                        {m.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-white/45">
                  Architecture
                </h4>
                <ol className="mt-3 space-y-2">
                  {project.architecture.map((layer, i) => (
                    <motion.li
                      key={layer.layer}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, ease: EASE_OUT_EXPO, duration: 0.6 }}
                      className="rounded-md border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-sm font-semibold">{layer.layer}</p>
                      <p className="mt-1 text-sm text-white/60">{layer.detail}</p>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}

function Detail({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-wider text-white/45">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
    </div>
  );
}
