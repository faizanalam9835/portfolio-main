"use client";

import { useEffect, useRef, useState } from "react";

export interface NormalizedPointer {
  /** −1 → 1 across the viewport. */
  x: number;
  /** −1 → 1 down the viewport. */
  y: number;
}

/**
 * Viewport-normalised pointer position, published through a ref so that
 * high-frequency consumers (the 3D scenes) can read it inside their own
 * animation loop without triggering React re-renders.
 */
export function usePointerRef(enabled = true) {
  const pointer = useRef<NormalizedPointer>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      pointer.current = { x: 0, y: 0 };
      return;
    }

    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };

    const onLeave = () => {
      pointer.current = { x: 0, y: 0 };
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return pointer;
}

/**
 * Element-local pointer position in pixels, for spotlight and tilt effects.
 * State-based (needed for render), but only active while hovered.
 */
export function useElementPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = element.getBoundingClientRect();
        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      });
    };

    const onEnter = () => setIsHovered(true);
    const onLeave = () => {
      setIsHovered(false);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, position, isHovered };
}
