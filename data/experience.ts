import type { ExperienceItem } from "@/types";

/**
 * Work experience, newest first. Keep it honest: short, accurate entries
 * with real detail beat padded ones.
 */
export const experience: readonly ExperienceItem[] = [
  {
    id: "exp-current",
    company: "Excelerate Technologies",
    role: "Software Development Engineer",
    employmentType: "Full-time",
    startDate: "2026-04",
    location: "Remote",
    current: true,
    summary:
      "My first full-time role, working across a Next.js frontend and a Node.js + MongoDB backend. I pick up features end to end, from the data model to the deployed UI.",
    responsibilities: [
      "Build React / Next.js pages and reusable components from design handoffs",
      "Write REST endpoints in Node.js and Express, with input validation and consistent error responses",
      "Design MongoDB schemas and queries for the features I work on",
      "Integrate third-party and LLM APIs into product features",
      "Fix bugs across the stack and improve page load and query performance",
      "Review my own PRs against team conventions before asking for feedback",
    ],
    achievements: [
      "Shipped my first production feature end to end within the first month.",
      "Reduced a slow list page's load time by adding indexes and paginating the query.",
      "Refactored repeated form logic into shared components used across three pages.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "REST APIs",
      "Git",
    ],
    // "Time in role" is prepended by the section from startDate/endDate.
    metrics: [
      { label: "Features shipped", value: "10+" },
      { label: "Stack", value: "MERN + Next.js" },
    ],
  },
  {
    id: "exp-elevate-labs",
    company: "Elevate Labs",
    role: "Full Stack Web Developer Intern",
    employmentType: "Internship",
    startDate: "2025-06",
    endDate: "2025-07",
    location: "Remote",
    summary:
      "My first professional development role. Worked across the MERN stack on real features, and learned what changes when code has to survive other people using it.",
    responsibilities: [
      "Built full-stack web applications using React.js, Node.js and MongoDB",
      "Integrated RESTful APIs between the React frontend and the Express backend",
      "Profiled and optimised database queries on the slowest pages",
      "Worked to team conventions on branching, reviews and delivery",
    ],
    achievements: [
      "Improved page load times by roughly 30% by optimising queries and API integration.",
      "Completed the internship with a Full Stack Web Development certification.",
    ],
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "JavaScript",
      "Git",
    ],
    metrics: [
      { label: "Load time", value: "−30%" },
      { label: "Mode", value: "Remote" },
    ],
  },
] as const;
