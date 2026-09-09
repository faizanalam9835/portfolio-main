/**
 * The single ground the whole page floats on.
 *
 * One fixed layer holds the blueprint grid, three slow aurora fields and
 * a fine grain overlay; every surface above it is translucent, so this is
 * what reads through the cards, the nav and the section bands. Fixed
 * rather than per-section, so the grid never breaks alignment as the page
 * scrolls and the browser paints it exactly once.
 *
 * Pure CSS and a server component — no client JS, no second GL context.
 */

/** Fine film grain, inlined so it costs no request. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")";

export function SiteBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden"
    >
      {/* Colour wash under the grid — keeps the ground from going flat grey.
          Kept faint: the grid is the feature here, not the colour. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 70% at 50% -10%, var(--page-tint-b), transparent 62%)",
        }}
      />

      {/* Aurora fields. Large, heavily blurred and slowly drifting. */}
      <div
        className="absolute -left-[18%] top-[-12%] size-[46rem] rounded-full blur-[130px] motion-safe:animate-[aurora_26s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(closest-side, var(--page-tint-a), transparent)",
        }}
      />
      <div
        className="absolute -right-[16%] top-[26%] size-[42rem] rounded-full blur-[140px] motion-safe:animate-[aurora_32s_ease-in-out_infinite_reverse]"
        style={{
          background: "radial-gradient(closest-side, var(--page-tint-b), transparent)",
        }}
      />
      <div
        className="absolute bottom-[-18%] left-[28%] size-[38rem] rounded-full blur-[150px] motion-safe:animate-[aurora_38s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(closest-side, var(--page-tint-c), transparent)",
        }}
      />

      {/*
        The blueprint grid, on top of the colour so the lines stay crisp
        instead of being washed out by the blur.

        Masked to the middle of the viewport: at full strength edge to edge
        the lines fought the content and made the page look boxed in. The
        gutters run clean and the grid only gathers weight behind the
        column you actually read.
      */}
      <div
        className="bg-grid absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 0.25) 16%, black 38%, black 62%, rgb(0 0 0 / 0.25) 84%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 0.25) 16%, black 38%, black 62%, rgb(0 0 0 / 0.25) 84%, transparent 100%)",
        }}
      />

      {/* No vignette here on purpose: darkening the far edges made the page
          read as a narrow centre column instead of a full-width layout. */}

      {/* Grain — barely there, but it stops the gradients from banding. */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay dark:opacity-[0.06]"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}
