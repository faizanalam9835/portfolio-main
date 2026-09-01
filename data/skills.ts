import { Brain, Database, Layers, Server, Wrench } from "lucide-react";

import type { SkillCategory } from "@/types";

/**
 * Kept deliberately short and honest — the tools I actually reach for,
 * not everything I've ever opened a tutorial on.
 *
 * `projects` entries are ids from `data/projects.ts`.
 */
export const skillCategories: readonly SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Where I spend most of my time.",
    icon: Layers,
    accent: "blue",
    skills: [
      {
        name: "Next.js",
        level: "Proficient",
        proficiency: 80,
        years: 1,
        description:
          "App Router, server components, streaming and caching — this site is built on it.",
        projects: ["care-ease"],
      },
      {
        name: "React",
        level: "Proficient",
        proficiency: 82,
        years: 1,
        description:
          "Components, hooks, state management and keeping re-renders under control.",
        projects: ["care-ease", "task-tracker", "wellness-tracker"],
      },
      {
        name: "TypeScript",
        level: "Proficient",
        proficiency: 74,
        years: 1,
        description:
          "Typing props, API responses and shared helpers — still learning the deeper generics.",
        projects: ["care-ease", "task-tracker"],
      },
      {
        name: "JavaScript",
        level: "Proficient",
        proficiency: 85,
        years: 2,
        description:
          "ES6+, async patterns, and the language quirks that bite you in reviews.",
        projects: ["task-tracker"],
      },
      {
        name: "Chakra UI",
        level: "Proficient",
        proficiency: 72,
        years: 1,
        description:
          "Component library work — theming, responsive props and accessible defaults.",
        projects: [],
      },
      {
        name: "Bootstrap",
        level: "Proficient",
        proficiency: 70,
        years: 1,
        description: "Grid system and utility classes for quick, consistent layouts.",
        projects: [],
      },
      {
        name: "Tailwind CSS",
        level: "Proficient",
        proficiency: 84,
        years: 1,
        description:
          "Responsive layouts, design tokens and building a consistent component look.",
        projects: ["wellness-tracker"],
      },
      {
        name: "HTML & CSS",
        level: "Proficient",
        proficiency: 86,
        years: 2,
        description:
          "Semantic markup, flexbox and grid, and accessible, keyboard-friendly UI.",
        projects: ["task-tracker"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "APIs and the logic behind the screens.",
    icon: Server,
    accent: "violet",
    skills: [
      {
        name: "Next.js (Server)",
        level: "Proficient",
        proficiency: 76,
        years: 1,
        description:
          "Route handlers, server actions and server components — the API layer without a separate server.",
        projects: [],
      },
      {
        name: "Node.js",
        level: "Proficient",
        proficiency: 76,
        years: 1,
        description:
          "Server-side JavaScript, async flows, file and stream handling.",
        projects: ["task-tracker", "care-ease"],
      },
      {
        name: "Express.js",
        level: "Proficient",
        proficiency: 78,
        years: 1,
        description:
          "Routing, middleware, validation at the boundary and consistent error responses.",
        projects: ["task-tracker"],
      },
      {
        name: "REST APIs",
        level: "Proficient",
        proficiency: 76,
        years: 1,
        description:
          "Designing endpoints, status codes, pagination and predictable response shapes.",
        projects: ["task-tracker", "wellness-tracker"],
      },
      {
        name: "Authentication",
        level: "Foundational",
        proficiency: 65,
        years: 1,
        description:
          "JWT and session auth, password hashing, protected routes and role checks.",
        projects: ["task-tracker"],
      },
    ],
  },
  {
    id: "database",
    label: "Database",
    blurb: "Modelling data so it holds up later.",
    icon: Database,
    accent: "cyan",
    skills: [
      {
        name: "MongoDB",
        level: "Proficient",
        proficiency: 76,
        years: 1,
        description:
          "Schema design with Mongoose, indexes and basic aggregation pipelines.",
        projects: ["task-tracker", "care-ease"],
      },
      {
        name: "SQL / PostgreSQL",
        level: "Foundational",
        proficiency: 58,
        years: 1,
        description:
          "Joins, constraints and normalised schema design — comfortable, not fluent.",
        projects: ["wellness-tracker"],
      },
      {
        name: "Mongoose",
        level: "Proficient",
        proficiency: 74,
        years: 1,
        description:
          "Schemas, validation, population and scoping every query to its owner.",
        projects: ["task-tracker", "care-ease"],
      },
      {
        name: "Firebase",
        level: "Foundational",
        proficiency: 55,
        years: 1,
        description: "Auth and hosting basics on smaller builds.",
        projects: [],
      },
      {
        name: "Database Design",
        level: "Foundational",
        proficiency: 62,
        years: 1,
        description:
          "Choosing relationships and indexes for the queries a feature actually runs.",
        projects: ["task-tracker"],
      },
    ],
  },
  {
    id: "ai",
    label: "AI / RAG",
    blurb: "The part I'm most curious about right now.",
    icon: Brain,
    accent: "violet",
    skills: [
      {
        name: "LLM APIs",
        level: "Proficient",
        proficiency: 72,
        years: 1,
        description:
          "Calling chat and embedding APIs, streaming responses, handling failures and cost.",
        projects: ["care-ease"],
      },
      {
        name: "RAG",
        level: "Foundational",
        proficiency: 64,
        years: 1,
        description:
          "Chunking, embedding, retrieval and grounding answers in sources you can cite.",
        projects: ["care-ease"],
      },
      {
        name: "Vector Search",
        level: "Foundational",
        proficiency: 58,
        years: 1,
        description:
          "Storing embeddings and running similarity search over them.",
        projects: ["care-ease"],
      },
      {
        name: "Prompt Engineering",
        level: "Proficient",
        proficiency: 70,
        years: 1,
        description:
          "Structuring prompts and output formats so responses stay parseable.",
        projects: ["care-ease"],
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    blurb: "Everyday workflow.",
    icon: Wrench,
    accent: "blue",
    skills: [
      {
        name: "Git & GitHub",
        level: "Proficient",
        proficiency: 80,
        years: 2,
        description:
          "Branching, rebasing, resolving conflicts and writing reviewable PRs.",
        projects: ["task-tracker"],
      },
      {
        name: "Vercel",
        level: "Proficient",
        proficiency: 74,
        years: 1,
        description:
          "Deploying Next.js apps, preview builds and environment configuration.",
        projects: ["wellness-tracker"],
      },
      {
        name: "Vite",
        level: "Proficient",
        proficiency: 76,
        years: 1,
        description: "Fast dev server and build tooling for React SPAs.",
        projects: ["task-tracker"],
      },
      {
        name: "Postman",
        level: "Proficient",
        proficiency: 78,
        years: 1,
        description:
          "Testing endpoints, collections and debugging request/response payloads.",
        projects: ["task-tracker"],
      },
      {
        name: "Docker",
        level: "Foundational",
        proficiency: 50,
        years: 1,
        description:
          "Running services locally from a compose file — still early days here.",
        projects: [],
      },
    ],
  },
] as const;
