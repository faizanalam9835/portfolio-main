"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { sectionClass, SectionTitle } from "@/components/shared/section-title";
import { skillCategories } from "@/data/skills";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Skills() {
  const [activeId, setActiveId] = React.useState(skillCategories[0]!.id);
  const category = skillCategories.find((c) => c.id === activeId)!;

  return (
    <section id="skills" className={sectionClass}>
      <div className="w-full">
        <SectionTitle
          index="02"
          eyebrow="Skills"
          title="Tools I build with"
          description="Kept short and honest — the stack I actually reach for, not everything I've opened a tutorial on."
        />

        <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-2">
          {skillCategories.map((c) => {
            const Icon = c.icon;
            const selected = c.id === activeId;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                  selected ? "border-white text-black" : "glass text-white/70 hover:text-white",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="skill-tab"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-md bg-white"
                  />
                ) : null}
                <Icon className="relative size-4" />
                <span className="relative">{c.label}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-white/50">{category.blurb}</p>

        <AnimatePresence mode="wait">
          <motion.ul
            key={category.id}
            role="tabpanel"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {category.skills.map((skill) => (
              <motion.li
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
                }}
                className="glass frame group rounded-md p-6 transition-colors duration-500 hover:border-white/40 hover:bg-black/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold">{skill.name}</h3>
                  <span className="rounded-md border border-white/15 px-2 py-0.5 text-[0.7rem] uppercase tracking-wider text-white/60">
                    {skill.level}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{skill.description}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-md bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1.2, delay: 0.2, ease: EASE_OUT_EXPO }}
                      className="h-full rounded-md bg-white"
                    />
                  </div>
                  <span className="font-mono text-xs text-white/50">{skill.proficiency}%</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

    </section>
  );
}
