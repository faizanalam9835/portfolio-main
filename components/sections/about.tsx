import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { sectionClass, SectionTitle } from "@/components/shared/section-title";
import { experience } from "@/data/experience";
import { aboutContent, getStats } from "@/data/site";
import { formatDuration, totalMonthsOfExperience } from "@/lib/duration";

export function About({ nowISO }: { nowISO: string }) {
  const now = new Date(nowISO);
  const tenure = formatDuration(totalMonthsOfExperience(experience, now));
  const stats = getStats(now);

  return (
    <section id="about" className={sectionClass}>
      <div className="w-full">
        <SectionTitle index="01" eyebrow={aboutContent.eyebrow} title={aboutContent.heading} />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="font-display text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              {aboutContent.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {aboutContent.disciplines.map((item) => (
                <span
                  key={item}
                  className="glass rounded-md px-3 py-1.5 text-sm transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          <RevealGroup className="space-y-5 text-base leading-relaxed text-white/70 md:text-lg">
            {aboutContent.paragraphs.map((paragraph) => (
              <RevealItem as="span" key={paragraph} className="block">
                {paragraph.replace("{tenure}", tenure)}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Stats */}
        <RevealGroup className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="frame group rounded-md bg-white p-6 text-black transition-transform duration-500 hover:-translate-y-1.5 md:p-8"
            >
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="font-display text-4xl font-semibold md:text-6xl"
              />
              <p className="mt-3 text-sm font-medium">{stat.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-black/50">{stat.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Quick facts */}
        <RevealGroup className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aboutContent.considerations.map((fact, i) => (
            <RevealItem
              key={fact.title}
              className="glass frame group rounded-md p-6 transition-colors duration-500 hover:bg-white hover:text-black"
            >
              <span className="font-mono text-xs text-white/40 transition-colors group-hover:text-black/40">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{fact.title}</h3>
              <p className="mt-1.5 text-sm text-white/60 transition-colors group-hover:text-black/60">
                {fact.detail}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
