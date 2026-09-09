import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Technologies } from "@/components/sections/technologies";

/**
 * Revalidated daily so every derived duration ("6 months in role", the
 * months-of-experience stat) rolls over on its own, without a redeploy.
 */
export const revalidate = 86400;

/**
 * A personal portfolio, in the order a person reads one: who I am, what I
 * know, what I've built, where I've worked and studied, how to reach me.
 *
 * The page is a server component — only the interactive parts ship as
 * client bundles.
 */
export default function HomePage() {
  // One timestamp, taken on the server and handed to both sections that
  // derive text from it — so the server HTML and the client hydration
  // can never disagree about what month it is.
  const nowISO = new Date().toISOString();

  return (
    <>
      <Navbar />

      <main id="main">
        <Hero />
        <About nowISO={nowISO} />
        <Technologies />
        <Projects />
        <Experience nowISO={nowISO} />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
