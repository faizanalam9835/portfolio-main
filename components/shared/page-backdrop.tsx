"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";

import { siteConfig } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { introDelay } from "@/lib/intro";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * The portrait sits fixed behind every page. Sharp on the home hero; as
 * soon as you scroll — or on any other page — a blur + dim layer covers it
 * so the content reads on top of a frosted version of the same photo.
 *
 * The blur is a single `backdrop-filter` layer whose opacity animates —
 * far cheaper than animating `filter: blur()` on the image every frame.
 */
export function PageBackdrop() {
  const reduced = usePrefersReducedMotion();
  const onHome = usePathname() === "/";
  const { scrollY } = useScroll();
  const [vh, setVh] = React.useState(800);

  React.useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const frost = useTransform(scrollY, [0, vh * 0.6], [0, 1]);
  const scale = useTransform(scrollY, [0, vh], [1, 1.08]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const driftX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const driftY = useSpring(pointerY, { stiffness: 60, damping: 20 });

  React.useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerX.set((e.clientX / window.innerWidth - 0.5) * -24);
      pointerY.set((e.clientY / window.innerHeight - 0.5) * -14);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, pointerX, pointerY]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <motion.div style={reduced ? undefined : { scale }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.25, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: introDelay() - 0.4, ease: EASE_OUT_EXPO }}
          style={{ x: driftX, y: driftY }}
          // Below the navbar so the head never touches the top. On phones and
          // tablets the photo takes the upper half and the copy sits under it,
          // so text never lands on the face.
          className="absolute -inset-x-6 top-20 h-[50svh] sm:top-24 sm:h-[52svh] lg:bottom-0 lg:h-auto"
        >
          <Image
            src={siteConfig.avatar}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top lg:object-contain lg:object-bottom"
          />
          {/* Melts the photo's top edge into the black above it. */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent lg:hidden" />
        </motion.div>
      </motion.div>

      {/* Vignette: keeps the copy either side of the face legible. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_70%_at_50%_45%,transparent_40%,rgba(0,0,0,0.85))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent lg:h-1/3" />

      {/* Frost layer — invisible on the hero, fully on after it. */}
      <motion.div
        style={{ opacity: onHome ? frost : 1 }}
        className="absolute inset-0 bg-black/65 backdrop-blur-2xl"
      />
    </div>
  );
}
