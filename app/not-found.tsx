import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center px-5">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]"
      />

      <div className="relative flex max-w-md flex-col items-center text-center">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          This route doesn&rsquo;t resolve
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
          The page you were looking for isn&rsquo;t here. Everything worth seeing
          lives on the home page.
        </p>

        <Button asChild variant="primary" size="lg" className="mt-8 group">
          <Link href="/">
            <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to portfolio
          </Link>
        </Button>
      </div>
    </main>
  );
}
