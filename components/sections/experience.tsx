"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import * as React from "react";

import { RevealItem, RevealGroup } from "@/components/shared/reveal";
import { Section, SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/data/experience";
import { useHasFinePointer } from "@/hooks/use-media-query";
import { EASE_OUT_EXPO, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types";

export function Experience() {
  const railRef = React.useRef<HTMLDivElement>(null);
  const isTimeline = experience.length > 1;

  // Scroll-linked fill on the timeline rail.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 65%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <Section id="experience" className="bg-[var(--surface)]">
      <SectionHeading
        index="04"
        eyebrow="Work"
        title="Experience"
        lead="Early in my career — about 5 months in — but every month of it has been hands-on across the stack."
      />

      <div ref={railRef} className="relative mt-10 sm:mt-16">
        {/* A timeline needs more than one point on it. With a single role the
            rail and its 3.5rem indent are just dead space, so both are
            dropped and the card runs full width. */}
        {isTimeline ? (
          <div
            aria-hidden
            className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-[var(--border-subtle)] sm:block"
          >
            <motion.div
              style={{ scaleY: fill }}
              className="h-full w-full origin-top bg-gradient-to-b from-accent-blue via-accent-violet to-accent-cyan"
            />
          </div>
        ) : null}

        <RevealGroup className="flex flex-col gap-6 sm:gap-8" stagger={0.14}>
          {experience.map((item, index) => (
            <RevealItem
              key={item.id}
              variants={fadeUp}
              className={cn("relative", isTimeline && "sm:pl-14")}
            >
              {isTimeline ? (
                <TimelineMarker current={item.current} index={index} />
              ) : null}
              {/* One role means nothing to compare against, so the detail is
                  open from the start rather than hidden behind a toggle. */}
              <ExperienceCard item={item} defaultOpen={!isTimeline} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

function TimelineMarker({
  current,
  index,
}: {
  current?: boolean;
  index: number;
}) {
  return (
    <div
      aria-hidden
      className="absolute left-0 top-7 hidden size-8 place-items-center sm:grid"
    >
      <span
        className={cn(
          "grid size-8 place-items-center rounded-full border bg-[var(--surface)]",
          current
            ? "border-accent-violet/40 shadow-[0_0_0_4px_rgba(124,92,246,0.08)]"
            : "border-[var(--border-strong)]",
        )}
      >
        {current ? (
          <span className="relative grid place-items-center">
            <span className="absolute size-2.5 rounded-full bg-accent-violet/50 motion-safe:animate-[pulse-ring_2.6s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
            <span className="size-2.5 rounded-full bg-gradient-to-br from-accent-blue to-accent-violet" />
          </span>
        ) : (
          <span className="font-mono text-[0.625rem] text-[var(--text-tertiary)]">
            {String(experience.length - index).padStart(2, "0")}
          </span>
        )}
      </span>
    </div>
  );
}

function ExperienceCard({
  item,
  defaultOpen = false,
}: {
  item: ExperienceItem;
  defaultOpen?: boolean;
}) {
  const hasFinePointer = useHasFinePointer();
  const [hovered, setHovered] = React.useState(false);
  const [pinned, setPinned] = React.useState(defaultOpen);

  // Hover reveals on pointer devices; the toggle is the accessible path and
  // the only path on touch.
  const expanded = pinned || (hasFinePointer && hovered);
  const detailsId = `${item.id}-details`;

  return (
    <SpotlightCard
      tilt={0}
      accentHex={item.current ? "#7c5cf6" : "#3b6cf6"}
      className={cn(
        "transition-transform duration-500",
        expanded && "sm:-translate-y-1",
      )}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:text-xl">
                {item.role}
              </h3>
              {item.current ? (
                <Badge variant="violet" size="sm">
                  Current
                </Badge>
              ) : null}
            </div>

            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                <Briefcase className="size-3.5 text-accent-blue" aria-hidden />
                {item.company}
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span>{item.employmentType}</span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                {item.location}
              </span>
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-[var(--surface-sunken)] px-3 py-1 font-mono text-[0.6875rem] text-[var(--text-secondary)]">
            {item.duration}
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
          {item.summary}
        </p>

        {/* Impact metrics stay visible — they are the headline, not a detail. */}
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {item.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2.5"
            >
              <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {metric.label}
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {item.technologies.map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.025,
                duration: 0.4,
                ease: EASE_OUT_EXPO,
              }}
            >
              <Badge
                variant="muted"
                size="sm"
                className="border border-transparent transition-colors duration-300 hover:border-accent-blue/30 hover:bg-accent-blue/[0.06] hover:text-accent-blue"
              >
                {tech}
              </Badge>
            </motion.span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPinned((value) => !value)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className={cn(
            "mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 -ml-3",
            "text-[0.8125rem] font-medium text-[var(--text-secondary)]",
            "transition-colors duration-300 hover:text-accent-violet",
          )}
        >
          {pinned ? "Hide details" : "Responsibilities & achievements"}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-300",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              id={detailsId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <div className="mt-5 grid gap-6 border-t border-[var(--border-subtle)] pt-5 lg:grid-cols-2">
                <DetailList
                  title="Responsibilities"
                  icon={
                    <Briefcase className="size-3.5 text-accent-blue" aria-hidden />
                  }
                  items={item.responsibilities}
                />
                <DetailList
                  title="Key achievements"
                  icon={
                    <TrendingUp
                      className="size-3.5 text-accent-violet"
                      aria-hidden
                    />
                  }
                  items={item.achievements}
                  accent
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SpotlightCard>
  );
}

function DetailList({
  title,
  items,
  icon,
  accent = false,
}: {
  title: string;
  items: readonly string[];
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        {icon}
        {title}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((entry) => (
          <li
            key={entry}
            className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-[var(--text-secondary)]"
          >
            {accent ? (
              <Sparkles
                className="mt-0.5 size-3 shrink-0 text-accent-violet"
                aria-hidden
              />
            ) : (
              <span
                className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-[var(--text-tertiary)]"
                aria-hidden
              />
            )}
            {entry}
          </li>
        ))}
      </ul>
    </div>
  );
}
