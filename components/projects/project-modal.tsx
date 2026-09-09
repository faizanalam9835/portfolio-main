"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, X } from "lucide-react";
import * as React from "react";

import { ProjectPreview } from "@/components/projects/project-preview";
import { Badge } from "@/components/ui/badge";
import { Github } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/hooks/use-scroll-state";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { accentStyles, cn } from "@/lib/utils";
import type { Project } from "@/types";

/**
 * Case-study dialog. Hand-built rather than pulled from a component library
 * so the enter/exit motion matches the rest of the site — but it still does
 * the accessibility work a dialog owes: labelled, modal, scroll-locked,
 * escape-to-close, focus moved in and restored on close, and Tab contained.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const open = project !== null;
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  useScrollLock(open);

  React.useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // Focus the close button so the dialog is immediately dismissible by keyboard.
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label="Close case study"
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/35 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className={cn(
              "relative flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden",
              "glass-raised rounded-t-3xl",
              "shadow-lift sm:rounded-3xl",
            )}
          >
            <ModalHeader
              project={project}
              onClose={onClose}
              closeRef={closeButtonRef}
            />
            <ModalBody project={project} />
            <ModalFooter project={project} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ModalHeader({
  project,
  onClose,
  closeRef,
}: {
  project: Project;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const accent = accentStyles[project.preview.accent];

  return (
    <div className="relative shrink-0">
      <ProjectPreview project={project} className="h-32 sm:h-40" />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close case study"
        className={cn(
          "absolute right-4 top-4 grid size-9 place-items-center rounded-full",
          "glass text-[var(--text-primary)] shadow-soft",
          "transition-colors duration-300 hover:border-accent-violet/40",
        )}
      >
        <X className="size-4" aria-hidden />
      </button>

      <div className="border-b border-[var(--border-subtle)] px-5 pb-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          <span className="font-mono">{project.index}</span>
          <span className={accent.text}>{project.category}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
        </div>

        <h2
          id="project-modal-title"
          className="mt-2 text-[1.375rem] font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl"
        >
          {project.title}
        </h2>
        <p className="mt-1.5 text-[0.9375rem] text-[var(--text-secondary)]">
          {project.tagline}
        </p>
      </div>
    </div>
  );
}

function ModalBody({ project }: { project: Project }) {
  return (
    <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {project.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3.5 py-3"
          >
            <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              {metric.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <Block title="Overview">
        <p>{project.description}</p>
      </Block>

      <Block title="The problem">
        <p>{project.problem}</p>
      </Block>

      <Block title="The approach">
        <p>{project.solution}</p>
      </Block>

      <Block title="Architecture">
        <ol className="relative flex flex-col gap-4 border-l border-[var(--border-subtle)] pl-5">
          {project.architecture.map((layer) => (
            <li key={layer.layer} className="relative">
              <span
                aria-hidden
                className="absolute -left-[1.4rem] top-1.5 size-2 rounded-full bg-[var(--color-accent-violet)]"
              />
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {layer.layer}
              </p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-[var(--text-secondary)]">
                {layer.detail}
              </p>
            </li>
          ))}
        </ol>
      </Block>

      <Block title="Features">
        <ul className="grid gap-2 sm:grid-cols-2">
          {project.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-[0.8125rem] text-[var(--text-secondary)]"
            >
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent-blue/10 text-accent-blue">
                <Check className="size-2.5" strokeWidth={3} aria-hidden />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Stack">
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge variant="neutral" size="md">
                {tech}
              </Badge>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 first-of-type:mt-8">
      <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
        {title}
      </h3>
      <div className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
        {children}
      </div>
    </section>
  );
}

function ModalFooter({ project }: { project: Project }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-4 sm:px-8">
      {project.links.github ? (
        <Button asChild variant="primary" size="sm">
          <a href={project.links.github} target="_blank" rel="noreferrer noopener">
            <Github />
            View source
          </a>
        </Button>
      ) : null}

      {project.links.demo ? (
        <Button asChild variant="outline" size="sm">
          <a href={project.links.demo} target="_blank" rel="noreferrer noopener">
            <ExternalLink />
            Live demo
          </a>
        </Button>
      ) : null}

      <p className="ml-auto hidden text-[0.75rem] text-[var(--text-tertiary)] sm:block">
        Press <kbd className="font-mono">Esc</kbd> to close
      </p>
    </div>
  );
}
