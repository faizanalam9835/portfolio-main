"use client";

import { Canvas, useThree, type CanvasProps } from "@react-three/fiber";
import * as React from "react";

import { useIsDesktop } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Shared <Canvas> shell for every 3D area.
 *
 * Performance contract:
 *  - The canvas only mounts once it has been scrolled near the viewport.
 *  - Offscreen the loop drops to `"demand"` rather than `"never"`, so the
 *    scene keeps its last painted frame instead of going blank.
 *  - DPR is capped so high-density displays don't quadruple the fill cost.
 *  - `powerPreference: "high-performance"` with antialias only on desktop.
 *
 * Reduced motion does NOT disable the scene — it renders a single static
 * frame. (Windows ships with animation effects off for a lot of people;
 * gating the whole canvas on that setting made the 3D disappear entirely.)
 */
export interface SceneFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Rendered until the canvas mounts, and if WebGL is unavailable. */
  fallback?: React.ReactNode;
  /** How far outside the viewport to start mounting. */
  rootMargin?: string;
  camera?: CanvasProps["camera"];
  /** Set false to keep the scene mounted but static. */
  interactive?: boolean;
}

/** True when the browser can actually give us a WebGL context. */
function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ?? canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Paints one frame as soon as the scene graph is ready. Required for the
 * `"demand"` loop — without it a parked canvas starts out empty.
 */
function InitialPaint() {
  const invalidate = useThree((state) => state.invalidate);

  React.useEffect(() => {
    invalidate();
    // A second pass after layout settles catches late-resolving geometry.
    const frame = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(frame);
  }, [invalidate]);

  return null;
}

export function SceneFrame({
  children,
  className,
  fallback = null,
  rootMargin = "200px",
  camera = { position: [0, 0, 9], fov: 42 },
  interactive = true,
}: SceneFrameProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = React.useState(false);
  const [inView, setInView] = React.useState(true);
  const [webglFailed, setWebglFailed] = React.useState(false);

  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // No IntersectionObserver (or no WebGL) → just show the fallback.
    if (typeof IntersectionObserver === "undefined" || !detectWebGL()) {
      setWebglFailed(!detectWebGL());
      setShouldMount(false);
      return;
    }

    // Mount early (rootMargin) but track actual visibility separately so the
    // frameloop can be parked without tearing down the WebGL context.
    const mountObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          mountObserver.disconnect();
        }
      },
      { rootMargin },
    );

    const viewObserver = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.01 },
    );

    mountObserver.observe(element);
    viewObserver.observe(element);

    return () => {
      mountObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [rootMargin]);

  const animate = inView && interactive && !prefersReducedMotion;
  const renderCanvas = shouldMount && !webglFailed;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* The fallback stays underneath so there is never a blank frame. */}
      {fallback ? (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            renderCanvas ? "opacity-0" : "opacity-100",
          )}
        >
          {fallback}
        </div>
      ) : null}

      {renderCanvas ? (
        <Canvas
          camera={camera}
          dpr={[1, isDesktop ? 1.8 : 1.4]}
          frameloop={animate ? "always" : "demand"}
          gl={{
            antialias: isDesktop,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            // If the context is lost (tab suspend, driver reset), fall back
            // to the static composition instead of leaving a dead canvas.
            gl.domElement.addEventListener("webglcontextlost", (event) => {
              event.preventDefault();
              setWebglFailed(true);
            });
          }}
          // The scene is decorative; the surrounding DOM carries the meaning.
          aria-hidden
          style={{ pointerEvents: "none" }}
          className="relative"
        >
          <InitialPaint />
          <React.Suspense fallback={null}>{children}</React.Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
