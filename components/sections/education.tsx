import { ArrowUpRight, Award, GraduationCap, MapPin } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { sectionClass, SectionTitle } from "@/components/shared/section-title";
import { certifications, education } from "@/data/education";

export function Education() {
  return (
    <section id="education" className={sectionClass}>
      <div className="w-full">
        <SectionTitle index="05" eyebrow="Education" title="Learning, formally and otherwise" />

        <RevealGroup className="grid gap-3 lg:grid-cols-3">
          {education.map((item) => (
            <RevealItem
              key={item.id}
              className="frame group flex flex-col rounded-md bg-white p-7 text-black transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[8px_8px_0_0_rgba(255,255,255,0.35)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-md bg-black text-white">
                  <GraduationCap className="size-5" />
                </span>
                {item.current ? (
                  <span className="rounded-md border border-black px-2 py-0.5 text-[0.7rem] font-semibold uppercase">
                    Ongoing
                  </span>
                ) : null}
              </div>
              <p className="mt-6 font-mono text-xs uppercase tracking-wider text-black/45">
                {item.duration}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-tight">{item.degree}</h3>
              <p className="mt-1 text-sm text-black/60">{item.field}</p>
              <p className="mt-4 font-medium">{item.institution}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-black/45">
                <MapPin className="size-3.5" /> {item.location}
              </p>
              <ul className="mt-5 space-y-2 border-t border-black/10 pt-5">
                {item.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-black/65">
                    <span className="mt-2 size-1 shrink-0 rounded-md bg-black" />
                    {h}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <h3 className="mb-6 mt-20 flex items-center gap-3 font-display text-2xl font-semibold">
          <Award className="size-6" /> Certifications
        </h3>
        <RevealGroup className="grid gap-3 md:grid-cols-3">
          {certifications.map((cert) => (
            <RevealItem key={cert.id}>
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="glass frame group flex h-full flex-col rounded-md p-7 transition-all hover:border-white/50 duration-500 hover:-translate-y-1.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-white/50">{cert.issued}</p>
                  <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                </div>
                <h4 className="mt-6 font-display text-xl font-semibold">{cert.title}</h4>
                <p className="mt-1 text-sm text-white/60">{cert.issuer}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {cert.skills.map((s) => (
                    <span key={s} className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/80">
                      {s}
                    </span>
                  ))}
                </div>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
