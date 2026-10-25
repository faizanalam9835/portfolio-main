import type { Metadata } from "next";

import { About } from "@/components/sections/about";

export const revalidate = 86400;
export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <About nowISO={new Date().toISOString()} />;
}
