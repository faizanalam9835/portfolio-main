import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { MoreLink, sectionClass, SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { certifications, education } from "@/data/education";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { aboutContent, getStats, siteConfig } from "@/data/site";
import { skillCategories } from "@/data/skills";
import { formatPeriod } from "@/lib/duration";

/*
 * Home-page teasers. Scrolling the home page shows only the best bits of
 * each section; the navbar (and the button under each teaser) opens the
 * section's own page with every detail.
 */

export function AboutPreview({ nowISO }: { nowISO: string }) {
  const stats = getStats(new Date(nowISO));

  return (
    <section id="about" className={sectionClass}>
      <SectionTitle index="01" eyebrow="About" title={aboutContent.heading} />
      <RevealGroup>
        <RevealItem as="span" className="block max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight md:text-4xl">
          {aboutContent.lead}
        </RevealItem>
      </RevealGroup>
      <RevealGroup className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <RevealItem
            key={stat.label}
            className="frame rounded-md bg-white p-6 text-black transition-transform duration-500 hover:-translate-y-1.5 md:p-8"
          >
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              className="font-display text-4xl font-semibold md:text-6xl"
            />
            <p className="mt-3 text-sm font-medium">{stat.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <MoreLink href="/about">Read my full story</MoreLink>
    </section>
  );
}

export function SkillsPreview() {
  return (
    <section id="skills" className={sectionClass}>
      <SectionTitle index="02" eyebrow="Skills" title="Tools I build with" />
      <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category) => {
          const Icon = category.icon;
          return (
            <RevealItem
              key={category.id}
              className="glass frame group rounded-md p-6 transition-colors duration-500 hover:bg-white hover:text-black"
            >
              <Icon className="size-6" />
              <h3 className="mt-5 font-display text-xl font-semibold">{category.label}</h3>
              <p className="mt-1 text-sm text-white/55 transition-colors group-hover:text-black/55">
                {category.skills
                  .slice(0, 3)
                  .map((s) => s.name)
                  .join(" · ")}
              </p>
            </RevealItem>
          );
        })}
      </RevealGroup>
      <MoreLink href="/skills">See every skill</MoreLink>
    </section>
  );
}

export function ProjectsPreview() {
  return (
    <section id="projects" className={sectionClass}>
      <SectionTitle index="03" eyebrow="Projects" title="Things I've built" />
      <RevealGroup className="grid gap-3 lg:grid-cols-3">
        {projects.map((project) => (
          <RevealItem
            key={project.id}
            className="glass frame group flex flex-col rounded-md p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/50"
          >
            <span className="text-outline font-display text-6xl font-bold leading-none text-white/40 transition-colors duration-500 group-hover:text-white">
              {project.index}
            </span>
            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-white/45">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{project.tagline}</p>
            {project.links.demo ? (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium"
              >
                Live demo
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            ) : null}
          </RevealItem>
        ))}
      </RevealGroup>
      <MoreLink href="/projects">See how they&rsquo;re built</MoreLink>
    </section>
  );
}

export function ExperiencePreview() {
  return (
    <section id="experience" className={sectionClass}>
      <SectionTitle index="04" eyebrow="Work Experience" title="Where I've worked" />
      <RevealGroup className="flex flex-col gap-3">
        {experience.map((job) => (
          <RevealItem
            key={job.id}
            className="glass frame flex flex-col gap-2 rounded-md p-6 transition-colors duration-500 hover:border-white/50 md:flex-row md:items-center md:justify-between md:p-8"
          >
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{job.role}</h3>
              <p className="mt-1 text-white/60">
                {job.company} · {job.employmentType}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {job.current ? (
                <span className="rounded-md bg-white px-2 py-0.5 text-[0.7rem] font-semibold uppercase text-black">
                  Current
                </span>
              ) : null}
              <span className="font-mono text-xs uppercase tracking-wider text-white/50">
                {formatPeriod(job.startDate, job.endDate)}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      <MoreLink href="/experience">Full work details</MoreLink>
    </section>
  );
}

export function EducationPreview() {
  return (
    <section id="education" className={sectionClass}>
      <SectionTitle index="05" eyebrow="Education" title="Learning, formally and otherwise" />
      <RevealGroup className="grid gap-3 lg:grid-cols-3">
        {education.map((item) => (
          <RevealItem
            key={item.id}
            className="frame rounded-md bg-white p-7 text-black transition-transform duration-500 hover:-translate-y-1.5"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-black/45">{item.duration}</p>
            <h3 className="mt-2 font-display text-xl font-semibold leading-tight">{item.degree}</h3>
            <p className="mt-2 text-sm text-black/60">{item.institution}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mt-6 text-sm text-white/55">
        + {certifications.length} certifications, including {certifications[certifications.length - 1]?.title}.
      </p>
      <MoreLink href="/education">Education &amp; certificates</MoreLink>
    </section>
  );
}

export function ContactPreview() {
  return (
    <section id="contact" className={sectionClass}>
      <SectionTitle index="06" eyebrow="Contact" title="Let's build something together" />
      <a
        href={`mailto:${siteConfig.email}`}
        className="group inline-flex items-center gap-3 break-all font-display text-2xl font-semibold sm:text-4xl md:text-5xl"
      >
        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
          {siteConfig.email}
        </span>
        <ArrowUpRight className="size-8 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
      </a>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="light" size="lg">
          <Link href="/contact">
            <Mail /> Send a message
          </Link>
        </Button>
        <Button asChild variant="outline-light" size="lg">
          <Link href="/resume">
            Resume <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
