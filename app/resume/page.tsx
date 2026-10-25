import { Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

import { sectionClass, SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <section className={sectionClass}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          index="07"
          eyebrow="Resume"
          title="My resume"
          description="Everything on one page. Read it here, or download the PDF."
          className="mb-0 md:mb-0"
        />
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="light" size="lg">
            <a href={siteConfig.resumeUrl} download="Faizan_Alam_Resume.pdf">
              <Download /> Download PDF
            </a>
          </Button>
          <Button asChild variant="outline-light" size="lg">
            <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">
              <ExternalLink /> Open in new tab
            </a>
          </Button>
        </div>
      </div>

      {/* The browser's own PDF viewer; phones without one get the buttons above. */}
      <div className="mt-10 overflow-hidden rounded-md border border-white/15 bg-white">
        <iframe
          src={`${siteConfig.resumeUrl}#view=FitH&toolbar=0`}
          title={`${siteConfig.name} — Resume`}
          className="h-[80svh] w-full"
        />
      </div>
    </section>
  );
}
