import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */

export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
  href: `/${string}`;
}

/* ------------------------------------------------------------------ *
 * Site / personal config
 * ------------------------------------------------------------------ */

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "twitter" | "file";
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
}

export interface SiteConfig {
  name: string;
  firstName: string;
  role: string;
  titles: string[];
  tagline: string;
  email: string;
  /** Displayed and used for the tel: link in the contact section. */
  phone: string;
  location: string;
  timezone: string;
  availability: string;
  url: string;
  resumeUrl: string;
  github: string;
  githubUser: string;
  linkedin: string;
  /** Path or URL to the profile photo shown in the hero. */
  avatar: string;
  twitter?: string;
  calendly?: string;
}

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

export interface ImpactMetric {
  label: string;
  value: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  employmentType: string;
  /** Month the role started, as `YYYY-MM`. */
  startDate: string;
  /** Month it ended, as `YYYY-MM`. Omit while the role is current. */
  endDate?: string;
  location: string;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  metrics: ImpactMetric[];
  current?: boolean;
}

/* ------------------------------------------------------------------ *
 * Education & certifications
 * ------------------------------------------------------------------ */

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  location: string;
  score?: string;
  highlights: string[];
  current?: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  url?: string;
  skills: string[];
  accent: "blue" | "violet" | "cyan";
}

/* ------------------------------------------------------------------ *
 * Skills
 * ------------------------------------------------------------------ */

export type SkillLevel = "Foundational" | "Proficient" | "Advanced" | "Expert";

export interface Skill {
  name: string;
  level: SkillLevel;
  /** 0–100, drives the proficiency meter. */
  proficiency: number;
  years: number;
  description: string;
  /** Project ids from `data/projects.ts`. */
  projects: string[];
}

export interface SkillCategory {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
  accent: "blue" | "violet" | "cyan";
  skills: Skill[];
}

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

export interface ProjectArchitectureLayer {
  layer: string;
  detail: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  status: "Live" | "Personal Project" | "In Progress" | "Open Source";
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  architecture: ProjectArchitectureLayer[];
  features: string[];
  stack: string[];
  metrics: ImpactMetric[];
  links: {
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
  /** Visual identity for the generated preview (no binary assets required). */
  preview: {
    accent: "blue" | "violet" | "cyan";
    pattern: "grid" | "orbit" | "flow" | "bars";
  };
  featured?: boolean;
}

/* ------------------------------------------------------------------ *
 * Contact
 * ------------------------------------------------------------------ */

export interface ContactResponse {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
