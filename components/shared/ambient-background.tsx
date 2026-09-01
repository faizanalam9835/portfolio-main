import { cn } from "@/lib/utils";

/**
 * Soft floating colour fields behind sections.
 *
 * Deliberately CSS, not WebGL: these are three blurred radial gradients, so
 * they cost one paint instead of a second GL context, and they still read as
 * depth on a white ground. A server component — no client JS at all.
 */
export function AmbientBackground({
  variant = "default",
  className,
}: {
  variant?: "default" | "warm" | "cool";
  className?: string;
}) {
  const palettes = {
    default: [
      "rgba(59,108,246,0.10)",
      "rgba(124,92,246,0.11)",
      "rgba(34,184,217,0.08)",
    ],
    warm: [
      "rgba(124,92,246,0.13)",
      "rgba(59,108,246,0.07)",
      "rgba(124,92,246,0.06)",
    ],
    cool: [
      "rgba(34,184,217,0.11)",
      "rgba(59,108,246,0.09)",
      "rgba(124,92,246,0.06)",
    ],
  } as const;

  const [a, b, c] = palettes[variant];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute -left-[14%] top-[-10%] size-[42rem] rounded-full blur-[100px] motion-safe:animate-[float_16s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(closest-side, ${a}, transparent)` }}
      />
      <div
        className="absolute -right-[12%] top-[22%] size-[38rem] rounded-full blur-[110px] motion-safe:animate-[float_20s_ease-in-out_infinite_reverse]"
        style={{ background: `radial-gradient(closest-side, ${b}, transparent)` }}
      />
      <div
        className="absolute bottom-[-14%] left-[26%] size-[34rem] rounded-full blur-[120px] motion-safe:animate-[float_24s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(closest-side, ${c}, transparent)` }}
      />
    </div>
  );
}
