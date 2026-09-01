# Faizan Alam — Portfolio

Personal portfolio for a full stack & AI engineer. Built as a real application
rather than a template: a data-driven content layer, one purposeful 3D scene
behind the hero portrait, and a hardened contact endpoint.

**Live:** https://www.faizanalam.pro

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) ·
Tailwind CSS 4 · Framer Motion · React Three Fiber + three.js · Zod ·
next-themes · lucide-react

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev                  # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

---

## Page structure

`app/page.tsx` composes the sections in reading order:

| # | Section | File | Notes |
| --- | --- | --- | --- |
| — | Hero | `components/sections/hero.tsx` | Portrait card with the 3D scene behind it |
| 01 | About | `components/sections/about.tsx` | Intro, quick facts, stat band |
| 02 | Technologies | `components/sections/technologies.tsx` | One aligned row per category |
| 03 | Projects | `components/sections/projects.tsx` | Compact cards → detail modal |
| 04 | Experience | `components/sections/experience.tsx` | Scroll-linked timeline |
| 05 | Education | `components/sections/education.tsx` | Education + certifications |
| 06 | Contact | `components/sections/contact.tsx` | Validated form → `app/api/contact` |

Adding or removing a section means editing `app/page.tsx` and `navItems` in
`data/site.ts`.

---

## Editing content

**Everything personal lives in `data/`. No component hardcodes personal information.**

| File | What it holds |
| --- | --- |
| `data/site.ts` | Name, role, email, phone, location, social URLs, resume URL, avatar path, hero tagline, nav items, stats, About copy |
| `data/experience.ts` | Roles, companies, responsibilities, achievements, tech, metrics |
| `data/education.ts` | Education history **and** certifications (with credential links) |
| `data/projects.ts` | Projects: problem, approach, architecture, features, stack, links |
| `data/skills.ts` | Technology categories with comfort level and description |

Values in `data/site.ts` can also come from environment variables, so the same
codebase can be deployed per-person without editing source. See `.env.example`.

### Your files

- `public/profile.jpg` — the hero photo. The card frames it 4:5; a portrait or
  square crop works best. If the file is missing the hero falls back to a
  bundled placeholder, then to your initials, so nothing ever breaks.
- `public/resume.pdf` — linked from the hero, footer and contact section.

To use a hosted image instead, set `NEXT_PUBLIC_AVATAR_URL` and add the
hostname to `images.remotePatterns` in `next.config.ts`.

---

## The 3D layer

Three files under `components/3d/`:

- **`scene-frame.tsx`** — the shared `<Canvas>` shell. Mounts only when scrolled
  near, drops the render loop to `"demand"` offscreen (so the last frame stays
  painted rather than going blank), caps DPR, and falls back to a static SVG if
  WebGL is unavailable or the context is lost.
- **`hero-scene.tsx`** — the scene graph: nodes, edges, travelling packets and
  orbit rings. Core three.js primitives only, no drei.
- **`hero-visual.tsx`** — composes the canvas, the portrait card on top of it,
  and the floating tech chips.

**Reduced motion does not disable the canvas** — it renders a single static
frame instead. Windows ships with animation effects off for a lot of people,
and gating the whole canvas on that setting made the 3D disappear entirely.

---

## Contact endpoint

`app/api/contact/route.ts` validates with Zod, rate-limits by IP, and includes a
honeypot field. Delivery is pluggable:

| Variable | Effect |
| --- | --- |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` | Send submissions by email |
| `CONTACT_WEBHOOK_URL` | POST submissions to a webhook (Slack, Discord, n8n…) |
| *(neither set)* | Validate, rate-limit and log server-side — the form still works end to end in development |

---

## Environment variables

All optional. Every feature degrades gracefully. See `.env.example`.

```
NEXT_PUBLIC_NAME              NEXT_PUBLIC_PHONE
NEXT_PUBLIC_EMAIL             NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GITHUB_URL        NEXT_PUBLIC_GITHUB_USERNAME
NEXT_PUBLIC_LINKEDIN_URL      NEXT_PUBLIC_RESUME_URL
NEXT_PUBLIC_AVATAR_URL

RESEND_API_KEY   CONTACT_TO_EMAIL   CONTACT_FROM_EMAIL   CONTACT_WEBHOOK_URL
```

`NEXT_PUBLIC_*` values are inlined into the client bundle — never put a secret
behind that prefix.

---

## Deploying

The app is a standard Next.js project with no custom server.

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

Set the same environment variables in the Vercel project settings. `SITE_URL`
should point at the production domain so `sitemap.xml`, `robots.txt` and the
Open Graph image resolve correctly.

---

## Notes

- Light-first design with a working dark theme (`next-themes`, class strategy).
- Fonts are self-hosted at build time by `next/font` — no runtime request to Google.
- The page is a server component; only interactive parts ship as client bundles.
- SEO: `lib/seo.ts` builds the metadata plus a `Person` + `WebSite` + project
  `ItemList` schema.org graph, emitted once in the root layout.
