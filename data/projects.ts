import type { Project } from "@/types";

/**
 * Real projects, each with a live demo and public source. The grid and
 * modal are fully data-driven, so adding or removing an entry needs no
 * component changes.
 */
export const projects: readonly Project[] = [
  {
    id: "care-ease",
    index: "01",
    title: "CareEase — Hospital Management",
    category: "Multi-tenant SaaS",
    year: "2025",
    status: "Live",
    featured: true,
    tagline: "One platform, many hospitals, and data that never crosses between them.",
    description:
      "Designed and developed a multi-tenant Hospital Management SaaS platform using MERN, implementing schema-per-tenant data isolation and OAuth2 + JWT authentication. Implemented enterprise-grade authorization using RBAC and ABAC, enabling role-based dynamic UI rendering, protected APIs, and fine-grained access control across users.",
    problem:
      "Serving several hospitals from one deployment means two hard problems at once: tenant data must never bleed across boundaries, and doctor, receptionist and admin all need genuinely different views of the same screens — not a role check bolted on at the end.",
    solution:
      "Schema-per-tenant isolation so a query cannot reach another hospital's data by accident, OAuth2 + JWT for authentication, and a combined RBAC + ABAC layer that drives both the protected API routes and the UI a user actually renders.",
    architecture: [
      {
        layer: "Tenancy",
        detail:
          "Schema-per-tenant data isolation, so each hospital's records sit behind their own boundary rather than a shared tenant id column.",
      },
      {
        layer: "Authentication",
        detail:
          "OAuth2 sign-in with JWT access tokens, verified in middleware before any route handler runs.",
      },
      {
        layer: "Authorization",
        detail:
          "RBAC for coarse role permissions plus ABAC for fine-grained, record-level checks; the same rules gate the API and the UI.",
      },
      {
        layer: "Frontend",
        detail:
          "React with React Router v6 and Tailwind CSS, rendering dynamically per role instead of hiding buttons after the fact.",
      },
      {
        layer: "Data",
        detail: "MongoDB with Mongoose schemas and per-tenant connections.",
      },
    ],
    features: [
      "Multi-tenant architecture",
      "Schema-per-tenant isolation",
      "OAuth2 + JWT authentication",
      "Role-based access control (RBAC)",
      "Attribute-based access control (ABAC)",
      "Role-driven dynamic UI",
      "Protected API routes",
    ],
    stack: [
      "React",
      "React Router v6",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "OAuth2",
      "JWT",
    ],
    metrics: [
      { label: "Tenancy", value: "Schema per tenant" },
      { label: "Auth", value: "OAuth2 + JWT" },
      { label: "Access", value: "RBAC + ABAC" },
    ],
    links: {
      github: "https://github.com/faizanalam9835/CareEase",
      demo: "https://careease-app.vercel.app/",
      caseStudy: "/projects",
    },
    preview: { accent: "violet", pattern: "orbit" },
  },
  {
    id: "task-tracker",
    index: "02",
    title: "TaskTracker Collaboration",
    category: "Full Stack",
    year: "2025",
    status: "Live",
    featured: true,
    tagline: "Shared task boards, with authorization that actually holds.",
    description:
      "A full-stack MERN collaboration app for tracking work across a team — create, update and complete tasks, with every operation scoped to the signed-in user.",
    problem:
      "A task app is only useful if people can share a board, and only safe if none of them can read or edit someone else's data through a hand-crafted request.",
    solution:
      "JWT-based authentication with authorization enforced in Express middleware, and Mongoose models that scope every read and write to the authenticated user rather than trusting an id sent by the client.",
    architecture: [
      {
        layer: "Frontend",
        detail:
          "React on Vite, with protected routes and immediate feedback on task actions.",
      },
      {
        layer: "API",
        detail:
          "Express routes behind JWT verification middleware, with consistent error responses.",
      },
      {
        layer: "Authorization",
        detail:
          "Every task query is scoped to the token's user, so ownership is enforced at the data layer rather than in the UI.",
      },
      {
        layer: "Data",
        detail: "MongoDB with Mongoose schemas for users and tasks.",
      },
    ],
    features: [
      "JWT authentication",
      "Task CRUD",
      "Protected routes",
      "User-scoped queries",
      "Shared collaboration",
    ],
    stack: [
      "React",
      "Vite",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "JWT",
    ],
    metrics: [
      { label: "Stack", value: "MERN" },
      { label: "Auth", value: "JWT" },
      { label: "Scope", value: "Full stack" },
    ],
    links: {
      github: "https://github.com/faizanalam9835/TaskTracker_Collaboration",
      demo: "https://task-traker-beta.vercel.app/",
      caseStudy: "/projects",
    },
    preview: { accent: "blue", pattern: "grid" },
  },
  {
    id: "wellness-tracker",
    index: "03",
    title: "Wellness Habit Tracker",
    category: "Full Stack",
    year: "2025",
    status: "Live",
    tagline: "Habits, streaks and goals on a dashboard that stays quick.",
    description:
      "A wellness habit tracking SPA: add habits, set goals, keep streaks alive, and see the whole picture on a responsive dashboard with smooth transitions.",
    problem:
      "Habit trackers live or die on friction. If logging today's habit takes more than a tap, or the dashboard stalls while it recalculates streaks, people stop opening it.",
    solution:
      "A React SPA on React Router v6 with Tailwind CSS, streak and goal state computed client-side so interactions stay instant, session state persisted to localStorage, and protected routing so a reload does not drop you back at the login screen.",
    architecture: [
      {
        layer: "Frontend",
        detail:
          "React with React Router v6 and Tailwind CSS, with animated transitions on habit and streak state.",
      },
      {
        layer: "Session",
        detail:
          "Auth state persisted to localStorage, with protected routing logic layered on top.",
      },
      {
        layer: "API",
        detail: "Node.js and Express endpoints for habits, goals and history.",
      },
      {
        layer: "Data",
        detail: "MongoDB collections for users, habits and daily entries.",
      },
    ],
    features: [
      "Habit management",
      "Goal tracking",
      "Streak counters",
      "Responsive dashboard",
      "Authentication",
      "Protected routing",
      "Persisted session state",
    ],
    stack: [
      "React",
      "React Router v6",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    metrics: [
      { label: "Type", value: "SPA" },
      { label: "Stack", value: "MERN" },
      { label: "Layout", value: "Responsive" },
    ],
    links: {
      github: "https://github.com/faizanalam9835/Wellness-Tracker",
      demo: "https://wellness-tracker-mu.vercel.app/",
      caseStudy: "/projects",
    },
    preview: { accent: "cyan", pattern: "bars" },
  },
] as const;
