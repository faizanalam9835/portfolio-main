import type { CertificationItem, EducationItem } from "@/types";

/**
 * Education history, in the order it should read on the page.
 * `score` is optional — leave it off rather than putting an estimate in.
 */
export const education: readonly EducationItem[] = [
  {
    id: "edu-bsc",
    institution: "Ranchi University",
    degree: "Bachelor of Science (B.Sc.)",
    field: "Information Technology",
    duration: "Aug 2024 — Present",
    location: "Ranchi, Jharkhand · Distance Learning",
    current: true,
    highlights: [
      "Undergraduate degree in Information Technology, studied alongside working full time",
      "Coursework across programming fundamentals, databases, operating systems and networks",
    ],
  },
  {
    id: "edu-masai",
    institution: "Masai School",
    degree: "Full Stack Web Development",
    field: "MERN Stack — JavaScript, React, Node.js, MongoDB",
    duration: "Oct 2024 — Nov 2025",
    location: "Bengaluru, Karnataka",
    highlights: [
      "Full-time, intensive software development program covering the MERN stack end to end",
      "Built and shipped projects with regular code reviews, pair programming and assessments",
      "Where most of my practical full-stack habits came from",
    ],
  },
  {
    id: "edu-school",
    institution: "Gomia High School",
    degree: "Higher Secondary (Class XII)",
    field: "Science — Physics, Chemistry, Mathematics",
    duration: "2022 — 2024",
    location: "Gomia, Jharkhand",
    highlights: [
      "Science stream with Mathematics",
      "First proper exposure to programming — where the interest started",
    ],
  },
] as const;

/**
 * Certifications and completed courses. Add `url` to make the card
 * clickable through to the credential.
 */
export const certifications: readonly CertificationItem[] = [
  {
    id: "cert-masai",
    title: "Software Development Program",
    issuer: "Masai School",
    issued: "Oct 2024 — Nov 2025",
    url: "https://drive.google.com/file/d/1S5K7T9X-BSKJMA09dg223L3GdMjxZVBk/view?usp=sharing",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    accent: "blue",
  },
  {
    id: "cert-elevate-labs",
    title: "Full Stack Web Development",
    issuer: "Elevate Labs",
    issued: "Jun — Jul 2025",
    url: "https://drive.google.com/file/d/19tDNa7pDeOfsZMzZV2q7owUtFLCryjLg/view?usp=sharing",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    accent: "violet",
  },
  {
    id: "cert-hackarena",
    title: "HackArena 2.0 — Runner-Up",
    issuer: "Full-stack web application development hackathon",
    issued: "2025",
    url: "https://drive.google.com/file/d/1UcOXHT3BILOl0SavG0iSs0iZdQbpHS_c/view?usp=sharing",
    skills: ["MERN", "Team Build", "Hackathon"],
    accent: "cyan",
  },
] as const;
