import type { Metadata } from "next";

import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

export const seoTitle = `${siteConfig.name} — Full Stack & AI Engineer | MERN, Next.js & RAG`;

export const seoDescription =
  "Full stack and AI engineer working with React, Next.js, Node.js and MongoDB — building web products end to end, plus the AI layer on top: LLM APIs, embeddings and RAG.";

export const seoKeywords = [
  "Full Stack & AI Engineer",
  "AI Engineer",
  "Full Stack Developer",
  "Full Stack Engineer",
  "MERN Stack Developer",
  "Next.js Developer",
  "React Developer",
  "Node.js Developer",
  "TypeScript Developer",
  "MongoDB",
  "Web Developer Portfolio",
  "RAG",
  "LLM Integration",
];

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: seoTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: seoDescription,
  keywords: seoKeywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  applicationName: `${siteConfig.name} Portfolio`,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: `${siteConfig.name} — Portfolio`,
    title: seoTitle,
    description: seoDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Full Stack & AI Engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: ["/opengraph-image"],
    creator: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

/**
 * schema.org graph: Person + WebSite + the portfolio's project list.
 * Emitted once in the root layout.
 */
export function buildStructuredData(): Record<string, unknown> {
  const personId = `${siteConfig.url}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        url: siteConfig.url,
        email: `mailto:${siteConfig.email}`,
        telephone: siteConfig.phone,
        jobTitle: "Full Stack & AI Engineer",
        description: seoDescription,
        knowsAbout: [
          "Full Stack Development",
          "MERN Stack",
          "Next.js",
          "React",
          "Node.js",
          "MongoDB",
          "TypeScript",
          "Retrieval-Augmented Generation",
        ],
        sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: seoTitle,
        description: seoDescription,
        publisher: { "@id": personId },
        inLanguage: "en-US",
      },
      {
        "@type": "ItemList",
        "@id": `${siteConfig.url}/#projects`,
        name: "Projects",
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: project.title,
            description: project.description,
            author: { "@id": personId },
            programmingLanguage: project.stack.join(", "),
            ...(project.links.github ? { codeRepository: project.links.github } : {}),
            ...(project.links.demo ? { url: project.links.demo } : {}),
          },
        })),
      },
    ],
  };
}
