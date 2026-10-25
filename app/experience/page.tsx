import type { Metadata } from "next";

import { Experience } from "@/components/sections/experience";

export const revalidate = 86400;
export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return <Experience nowISO={new Date().toISOString()} />;
}
