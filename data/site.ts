import type { NavItem, SiteConfig, SocialLink, Stat } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR PERSONAL CONTENT
 *
 *  Everything personal lives here. Edit the strings below (or supply the
 *  matching NEXT_PUBLIC_* env vars — see `.env.example`) and the whole
 *  site updates. Nothing else in the app hardcodes personal information.
 * ─────────────────────────────────────────────────────────────────────
 */

const env = {
  name: process.env.NEXT_PUBLIC_NAME,
  email: process.env.NEXT_PUBLIC_EMAIL,
  phone: process.env.NEXT_PUBLIC_PHONE,
  github: process.env.NEXT_PUBLIC_GITHUB_URL,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  resume: process.env.NEXT_PUBLIC_RESUME_URL,
  url: process.env.NEXT_PUBLIC_SITE_URL,
  avatar: process.env.NEXT_PUBLIC_AVATAR_URL,
};

export const siteConfig: SiteConfig = {
  name: env.name ?? "Faizan Alam",
  firstName: (env.name ?? "Faizan Alam").split(" ")[0] ?? "Faizan",
  role: "Full Stack & AI Engineer",

  /** Rotated under the hero copy. */
  titles: [
    "Full Stack & AI Engineer",
    "Full Stack Developer",
    "AI Engineer",
    "MERN Stack Developer",
    "RAG & LLM Developer",
  ],

  tagline:
    "I'm a full stack and AI engineer working with the MERN stack and Next.js. I build products end to end — and I build the AI layer that sits on top of them: LLM APIs, retrieval and RAG.",

  email: env.email ?? "faizansaikh786786f@gmail.com",
  phone: env.phone ?? "+91 98356 31769",
  location: "Jharkhand, India",
  timezone: "IST (UTC+5:30)",
  availability: "Open to opportunities",

  url: env.url ?? "https://www.faizanalam.pro",
  resumeUrl: env.resume ?? "/resume.pdf",

  /**
   * Drop your photo at `public/profile.jpg` — the hero frames it 4:5, so a
   * portrait or square crop works best. Or point NEXT_PUBLIC_AVATAR_URL at
   * a hosted image.
   */
  avatar: env.avatar ?? "/profile.jpg",

  github: env.github ?? "https://github.com/faizanalam9835",
  githubUser: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "faizanalam9835",
  linkedin: env.linkedin ?? "https://www.linkedin.com/in/faizan-alam-091063334/",
};

export const navItems: readonly NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "tech", label: "Tech", href: "#tech" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "education", label: "Education", href: "#education" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const;

export const socialLinks: readonly SocialLink[] = [
  { label: "GitHub", href: siteConfig.github, icon: "github" },
  { label: "LinkedIn", href: siteConfig.linkedin, icon: "linkedin" },
  { label: "Email", href: `mailto:${siteConfig.email}`, icon: "mail" },
  { label: "Resume", href: siteConfig.resumeUrl, icon: "file" },
] as const;

/**
 * Honest, early-career numbers. Keep these small and true — a short,
 * credible list reads far better than inflated claims.
 */
export const stats: readonly Stat[] = [
  {
    label: "Months of Experience",
    value: 5,
    suffix: "",
    description: "Hands-on, working on real production code.",
  },
  {
    label: "Projects Built",
    value: 5,
    suffix: "+",
    description: "Personal builds and work projects, shipped end to end.",
  },
  {
    label: "Technologies",
    value: 15,
    suffix: "+",
    description: "Across frontend, backend, databases and AI tooling.",
  },
  {
    label: "Certifications",
    value: 3,
    suffix: "",
    description: "Completed courses backing up the practical work.",
  },
] as const;

/** Copy for the About section — kept out of the component. */
export const aboutContent = {
  heading: "A little about me",
  eyebrow: "About",
  lead: "Full stack by day, AI by obsession. I like building things that actually work — and understanding why they work, not just that they do.",
  paragraphs: [
    "I'm a full stack and AI engineer with around 5 months of hands-on experience. I mostly work with React, Next.js, Node.js and MongoDB, and I've spent that time building features end to end rather than sticking to one layer.",
    "Right now I'm focused on getting the fundamentals right: clean components, sensible API design, data models that don't fall apart later, and UI that feels quick. I'd rather deeply understand a small stack than skim a big one.",
    "The AI side is where most of my curiosity goes: LLM APIs, embeddings, retrieval and RAG pipelines — wiring them into real products rather than notebooks, with a UI and a database behind them.",
  ],
  disciplines: [
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "REST APIs",
    "LLM APIs",
    "RAG",
    "AI Engineering",
  ],
  /** Short, personal "quick facts" rather than a corporate value list. */
  considerations: [
    {
      title: "Currently learning",
      detail: "System design basics and RAG pipelines end to end.",
    },
    {
      title: "Favourite stack",
      detail: "Next.js + TypeScript + MongoDB, with an LLM layer on top.",
    },
    {
      title: "How I work",
      detail: "Ask questions early, ship small, then refactor with context.",
    },
    {
      title: "What I enjoy",
      detail: "The moment a messy feature finally clicks into a clean shape.",
    },
    {
      title: "Looking for",
      detail: "A team where I can keep learning from people better than me.",
    },
    {
      title: "Based in",
      detail: "India — happy to work remote or hybrid.",
    },
  ],
} as const;
