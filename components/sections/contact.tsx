import { ArrowUpRight, FileText, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Github, Linkedin } from "@/components/ui/brand-icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { sectionClass, SectionTitle } from "@/components/shared/section-title";
import { siteConfig } from "@/data/site";
import { fadeRight } from "@/lib/motion";

const CHANNELS = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  {
    label: "Phone",
    value: siteConfig.phone,
    // Strip spaces so the tel: URI stays valid.
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    icon: Phone,
  },
  { label: "LinkedIn", value: "Connect professionally", href: siteConfig.linkedin, icon: Linkedin },
  { label: "GitHub", value: `@${siteConfig.githubUser}`, href: siteConfig.github, icon: Github },
  { label: "Resume", value: "Download PDF", href: siteConfig.resumeUrl, icon: FileText },
] as const;

export function Contact() {
  return (
    <section id="contact" className={sectionClass}>
      <div className="w-full">
        <SectionTitle
          index="06"
          eyebrow="Contact"
          title="Let's build something together"
          description="Have a role, a project or just a question? Send a message — I read every one."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="group inline-flex items-center gap-2 break-all font-display text-xl font-semibold sm:text-2xl md:text-3xl"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {siteConfig.email}
              </span>
              <ArrowUpRight className="size-6 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
            </a>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-white/50">
              <MapPin className="size-4" /> {siteConfig.location} · {siteConfig.timezone}
            </p>

            <RevealGroup className="mt-10 flex flex-col gap-2">
              {CHANNELS.map(({ label, value, href, icon: Icon }) => (
                <RevealItem key={label} variants={fadeRight}>
                  <a
                    href={href}
                    target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="glass frame group flex items-center gap-4 rounded-md p-4 transition-colors duration-500 hover:bg-white hover:text-black"
                  >
                    <span className="grid size-10 place-items-center rounded-md bg-white/10 transition-colors group-hover:bg-black group-hover:text-white">
                      <Icon className="size-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs uppercase tracking-wider opacity-50">{label}</span>
                      <span className="block text-sm font-medium">{value}</span>
                    </span>
                    <ArrowUpRight className="size-4 opacity-40 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100" />
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal className="frame rounded-md bg-white p-6 text-black md:p-10">
            <h3 className="mb-6 font-display text-2xl font-semibold">Send a message</h3>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
