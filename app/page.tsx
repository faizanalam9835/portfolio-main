import { Hero } from "@/components/sections/hero";
import {
  AboutPreview,
  ContactPreview,
  EducationPreview,
  ExperiencePreview,
  ProjectsPreview,
  SkillsPreview,
} from "@/components/sections/previews";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { formatDuration, totalMonthsOfExperience } from "@/lib/duration";

/**
 * Revalidated daily so every derived duration ("6 months in role", the
 * months-of-experience stat) rolls over on its own, without a redeploy.
 */
export const revalidate = 86400;

/**
 * Home: the hero, then a short teaser of each section. The full detail of
 * each lives on its own page, reached from the navbar.
 */
export default function HomePage() {
  // One timestamp, taken on the server, so the server HTML and the client
  // hydration can never disagree about what month it is.
  const nowISO = new Date().toISOString();
  const heroStats = [
    {
      value: formatDuration(totalMonthsOfExperience(experience, new Date(nowISO))),
      label: "Experience",
    },
    { value: `${projects.length}+`, label: "Live projects" },
  ];

  return (
    <>
      <Hero stats={heroStats} />
      <AboutPreview nowISO={nowISO} />
      <SkillsPreview />
      <ProjectsPreview />
      <ExperiencePreview />
      <EducationPreview />
      <ContactPreview />
    </>
  );
}
