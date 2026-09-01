"use client";

import { Section, SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { skillCategories } from "@/data/skills";
import { fadeUp } from "@/lib/motion";
import { accentStyles, cn } from "@/lib/utils";
import type { SkillCategory } from "@/types";

/**
 * Technologies, laid out as one row per category.
 *
 * A fixed-width label column on the left and a wrapping chip field on the
 * right means every category starts at exactly the same x — the chips can
 * reflow freely without the section ever looking ragged.
 */
export function Technologies() {
  return (
    <Section id="tech" className="bg-[var(--surface)]">
      <SectionHeading
        index="02"
        eyebrow="Stack"
        title="Technologies I work with"
        lead="Grouped the way I actually use them, with how comfortable I am on each one."
      />

      <RevealGroup
        className="mt-10 divide-y divide-[var(--border-subtle)] sm:mt-16"
        stagger={0.1}
      >
        {skillCategories.map((category) => (
          <RevealItem key={category.id} variants={fadeUp}>
            <CategoryRow category={category} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function CategoryRow({ category }: { category: SkillCategory }) {
  const accent = accentStyles[category.accent];
  const Icon = category.icon;

  return (
    <div className="grid gap-4 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8 sm:py-9 lg:grid-cols-[13rem_1fr] lg:gap-10">
      {/* Label column — fixed width, so every row lines up. */}
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl",
            accent.soft,
            accent.text,
          )}
          aria-hidden
        >
          <Icon className="size-4.5" />
        </span>

        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
            {category.label}
          </h3>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-[var(--text-tertiary)]">
            {category.blurb}
          </p>
        </div>
      </div>

      {/* Chip field — wraps freely without shifting the label column. */}
      <ul className="flex flex-wrap content-start gap-2">
        {category.skills.map((skill) => (
          <li key={skill.name}>
            <span
              title={`${skill.name} — ${skill.level}`}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 sm:px-3.5 sm:py-2",
                "border-[var(--border-subtle)] bg-[var(--surface-muted)]",
                "text-[0.75rem] font-medium text-[var(--text-primary)] sm:text-[0.8125rem]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-accent-violet/30 hover:bg-[var(--surface)] hover:shadow-soft",
              )}
            >
              <LevelMeter level={skill.level} accent={category.accent} />
              {skill.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LEVEL_STEPS: Record<string, number> = {
  Foundational: 1,
  Proficient: 2,
  Advanced: 3,
  Expert: 3,
};

/** Three dots showing comfort level — quieter than a percentage bar. */
function LevelMeter({
  level,
  accent,
}: {
  level: string;
  accent: keyof typeof accentStyles;
}) {
  const filled = LEVEL_STEPS[level] ?? 1;

  return (
    <span className="flex shrink-0 items-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((step) => (
        <span
          key={step}
          className={cn(
            "size-1.5 rounded-full transition-colors duration-300",
            step < filled ? accentStyles[accent].bg : "bg-[var(--border-strong)]",
          )}
        />
      ))}
    </span>
  );
}
