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
 * A personal portfolio, in the order a person reads one: who I am, what I
 * know, what I've built, where I've worked and studied, how to reach me.
 *
 * The page is a server component — only the interactive parts ship as
 * client bundles.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Technologies />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
