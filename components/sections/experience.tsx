"use client";

import { motion, useScroll } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import * as React from "react";

import { sectionClass, SectionTitle } from "@/components/shared/section-title";
import { experience } from "@/data/experience";
import { formatDuration, formatPeriod, monthsWorked } from "@/lib/duration";
import { EASE_OUT_EXPO } from "@/lib/motion";

/** Timeline whose spine fills in as you scroll through it. */
export function Experience({ nowISO }: { nowISO: string }) {
  const now = new Date(nowISO);
  const ref = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });

  return (
    <section id="experience" className={sectionClass}>
      <div className="w-full">
        <SectionTitle
          index="04"
          eyebrow="Work Experience"
          title="Where I've worked"
          description="Short, honest entries with the real detail of what I did."
        />

        <ol ref={ref} className="relative ml-3 md:ml-0">
          <span className="absolute left-0 top-0 h-full w-px bg-white/10 md:left-[11.5rem]" />
          <motion.span
            style={{ scaleY: scrollYProgress }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-white md:left-[11.5rem]"
          />

          {experience.map((job) => (
            <li key={job.id} className="relative pb-16 pl-8 last:pb-0 md:grid md:grid-cols-[11.5rem_1fr] md:pl-0">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-30% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="absolute left-0 top-1.5 size-3 -translate-x-1/2 rounded-md bg-white ring-4 ring-black md:left-[11.5rem]"
              />

              <div className="mb-4 md:mb-0 md:pr-10 md:text-right">
                <p className="font-mono text-xs uppercase tracking-wider text-white/50">
                  {formatPeriod(job.startDate, job.endDate)}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatDuration(monthsWorked(job.startDate, job.endDate, now))}
                </p>
                {job.current ? (
                  <span className="mt-2 inline-block rounded-md bg-white px-2 py-0.5 text-[0.7rem] font-semibold uppercase text-black">
                    Current
                  </span>
                ) : null}
              </div>

              <motion.article
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                className="glass frame rounded-md p-6 transition-colors duration-500 hover:border-white/30 md:ml-10 md:p-8"
              >
                <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {job.role}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                  <span className="font-medium text-white">{job.company}</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3.5" /> {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" /> {job.location}
                  </span>
                </div>
                <p className="mt-4 leading-relaxed text-white/70">{job.summary}</p>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <List title="What I do" items={job.responsibilities} />
                  <List title="Highlights" items={job.achievements} />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-5">
                  {job.metrics.map((m) => (
                    <span key={m.label} className="mr-3 text-sm">
                      <span className="font-semibold">{m.value}</span>{" "}
                      <span className="text-white/45">{m.label}</span>
                    </span>
                  ))}
                  {job.technologies.map((tech) => (
                    <span key={tech} className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function List({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-wider text-white/45">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/70">
            <span className="mt-2 size-1 shrink-0 rounded-md bg-white" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
