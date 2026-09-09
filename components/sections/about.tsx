"use client";

import { Check } from "lucide-react";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Section, SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { aboutContent, getStats } from "@/data/site";
import { experience } from "@/data/experience";
import { formatDuration, totalMonthsOfExperience } from "@/lib/duration";
import { fadeRight, fadeUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function About({ nowISO }: { nowISO: string }) {
  const now = new Date(nowISO);
  const tenure = formatDuration(totalMonthsOfExperience(experience, now));

  return (
    <Section id="about">
      {/* Full-width heading, same as every other section, so the eyebrow,
          number and title all start on the same left edge down the page. */}
      <SectionHeading
        index="01"
        eyebrow={aboutContent.eyebrow}
        title={aboutContent.heading}
        lead={aboutContent.lead}
      />

      <div className="mt-10 grid gap-8 sm:mt-16 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <RevealGroup className="flex flex-col gap-5" stagger={0.1}>
            {aboutContent.paragraphs.map((paragraph) => (
              <RevealItem
                as="span"
                key={paragraph.slice(0, 24)}
                variants={fadeUp}
                className="block text-[0.9375rem] leading-[1.75] text-[var(--text-secondary)] sm:text-base"
              >
                {paragraph.replace("{tenure}", tenure)}
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup className="mt-8 flex flex-wrap gap-2" stagger={0.035}>
            {aboutContent.disciplines.map((discipline) => (
              <RevealItem as="span" key={discipline} variants={scaleIn}>
                <Badge
                  variant="neutral"
                  size="lg"
                  className="transition-all duration-300 hover:border-accent-violet/35 hover:text-[var(--text-primary)]"
                >
                  {discipline}
                </Badge>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* The skimmable version — quick facts rather than a values manifesto. */}
        <Reveal variants={fadeRight}>
          <div className="card-surface edge-highlight h-full overflow-hidden">
            <div className="border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                Quick facts
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                The short version, if you&rsquo;re skimming.
              </p>
            </div>

            <ul className="divide-y divide-[var(--border-subtle)]">
              {aboutContent.considerations.map((item) => (
                <RevealItem
                  as="li"
                  key={item.title}
                  variants={fadeUp}
                  className="group flex items-start gap-3.5 px-5 py-4 transition-colors duration-300 hover:bg-[var(--surface-sunken)] sm:px-6"
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                      "bg-accent-blue/10 text-accent-blue",
                      "transition-transform duration-300 group-hover:scale-110",
                    )}
                  >
                    <Check className="size-3" aria-hidden strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[var(--text-primary)]">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-[var(--text-secondary)]">
                      {item.detail}
                    </span>
                  </span>
                </RevealItem>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <StatsRow nowISO={nowISO} />
    </Section>
  );
}

function StatsRow({ nowISO }: { nowISO: string }) {
  const stats = getStats(new Date(nowISO));

  return (
    <RevealGroup
      className="frost mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--border-subtle)] shadow-glass sm:mt-16 lg:grid-cols-4"
      stagger={0.09}
    >
      {stats.map((stat) => (
        <RevealItem
          key={stat.label}
          variants={fadeUp}
          className="group relative flex flex-col bg-[var(--surface)] p-5 transition-colors duration-500 hover:bg-[var(--surface-raised)] sm:p-7"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          <p className="text-gradient text-[1.75rem] font-semibold leading-none tracking-tight sm:text-[2.4rem]">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </p>
          <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
            {stat.label}
          </p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--text-tertiary)]">
            {stat.description}
          </p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
