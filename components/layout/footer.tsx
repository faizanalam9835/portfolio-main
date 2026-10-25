import { ArrowUp } from "lucide-react";
import Link from "next/link";

import { Github, Linkedin } from "@/components/ui/brand-icons";
import { navItems, siteConfig } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="w-full px-5 py-12 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-semibold uppercase">{siteConfig.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{siteConfig.role}</p>
            <div className="mt-5 flex gap-2">
              {[
                { href: siteConfig.github, label: "GitHub", Icon: Github },
                { href: siteConfig.linkedin, label: "LinkedIn", Icon: Linkedin },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-md border border-white/15 transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-white/60 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/45">
          <span>
            © {year} {siteConfig.name}. All rights reserved.
          </span>
          <a
            href="#main"
            className="group inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-2 text-white transition-colors hover:bg-white hover:text-black"
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
