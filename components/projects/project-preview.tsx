"use client";

import { motion } from "framer-motion";

import { accentStyles, cn } from "@/lib/utils";
import type { Project } from "@/types";

/**
 * Generated project previews.
 *
 * Screenshots would be the obvious choice, but placeholder screenshots look
 * fake and real ones don't exist yet. These are lightweight SVG "system
 * portraits" — one per project archetype — that scale to any viewport, need
 * no binary assets, and animate on hover. Swap this component for
 * next/image when real captures are available.
 */
export function ProjectPreview({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const accent = accentStyles[project.preview.accent];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--surface-muted)]",
        className,
      )}
    >
      {/* Soft accent wash */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.55]"
        style={{
          background: `radial-gradient(120% 90% at 78% 10%, ${accent.hex}26, transparent 60%),
                       radial-gradient(90% 80% at 10% 95%, ${accent.hex}14, transparent 62%)`,
        }}
      />

      <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />

      <svg
        viewBox="0 0 480 300"
        className="relative size-full"
        aria-hidden
        role="presentation"
      >
        <Pattern pattern={project.preview.pattern} color={accent.hex} />
      </svg>

      {/* Top-edge sheen that sweeps across on card hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover/card:translate-x-full dark:via-white/10"
      />
    </div>
  );
}

function Pattern({
  pattern,
  color,
}: {
  pattern: Project["preview"]["pattern"];
  color: string;
}) {
  switch (pattern) {
    case "orbit":
      return <OrbitPattern color={color} />;
    case "flow":
      return <FlowPattern color={color} />;
    case "bars":
      return <BarsPattern color={color} />;
    default:
      return <GridPattern color={color} />;
  }
}

/** RAG / AI archetype: a retrieval hub with orbiting document nodes. */
function OrbitPattern({ color }: { color: string }) {
  const satellites = [
    { angle: 0, radius: 96 },
    { angle: 52, radius: 112 },
    { angle: 118, radius: 88 },
    { angle: 186, radius: 108 },
    { angle: 242, radius: 94 },
    { angle: 305, radius: 116 },
  ];

  return (
    <g transform="translate(240 150)">
      {[64, 96, 128].map((radius, index) => (
        <motion.circle
          key={radius}
          r={radius}
          fill="none"
          stroke={color}
          strokeOpacity={0.22 - index * 0.05}
          strokeDasharray={index === 1 ? "4 6" : undefined}
          animate={{ rotate: index % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: 46 + index * 14,
            repeat: Infinity,
            ease: "linear",
          }}
          // transform-box: fill-box makes `center` resolve to the circle's own
          // centre rather than the SVG viewport origin.
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}

      <circle r="26" fill={color} fillOpacity="0.12" />
      <circle r="13" fill={color} fillOpacity="0.85" />

      {satellites.map((satellite, index) => {
        const radians = (satellite.angle * Math.PI) / 180;
        const x = Math.cos(radians) * satellite.radius;
        const y = Math.sin(radians) * satellite.radius * 0.62;

        return (
          <g key={index}>
            <line
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke={color}
              strokeOpacity="0.2"
              strokeWidth="1"
            />
            <rect
              x={x - 11}
              y={y - 8}
              width="22"
              height="16"
              rx="3"
              fill="white"
              stroke={color}
              strokeOpacity="0.35"
            />
            <line
              x1={x - 6}
              y1={y - 2}
              x2={x + 6}
              y2={y - 2}
              stroke={color}
              strokeOpacity="0.5"
            />
            <line
              x1={x - 6}
              y1={y + 3}
              x2={x + 2}
              y2={y + 3}
              stroke={color}
              strokeOpacity="0.3"
            />
          </g>
        );
      })}
    </g>
  );
}

/** Platform archetype: an application shell with list rows and a sidebar. */
function GridPattern({ color }: { color: string }) {
  return (
    <g>
      <rect
        x="56"
        y="46"
        width="368"
        height="208"
        rx="12"
        fill="white"
        fillOpacity="0.72"
        stroke={color}
        strokeOpacity="0.22"
      />
      <line
        x1="56"
        y1="76"
        x2="424"
        y2="76"
        stroke={color}
        strokeOpacity="0.18"
      />
      {[70, 84, 98].map((cx) => (
        <circle key={cx} cx={cx} cy="61" r="3.5" fill={color} fillOpacity="0.3" />
      ))}

      <rect
        x="56"
        y="76"
        width="92"
        height="178"
        fill={color}
        fillOpacity="0.05"
      />
      {[96, 118, 140, 162, 184].map((y, index) => (
        <rect
          key={y}
          x="70"
          y={y}
          width={index === 1 ? 58 : 46}
          height="7"
          rx="3.5"
          fill={color}
          fillOpacity={index === 1 ? 0.45 : 0.2}
        />
      ))}

      {[96, 128, 160, 192, 224].map((y, index) => (
        <g key={y}>
          <rect
            x="166"
            y={y}
            width="244"
            height="22"
            rx="6"
            fill={color}
            fillOpacity="0.06"
          />
          <circle cx="180" cy={y + 11} r="6" fill={color} fillOpacity="0.28" />
          <rect
            x="194"
            y={y + 7}
            width={92 - index * 8}
            height="6"
            rx="3"
            fill={color}
            fillOpacity="0.32"
          />
          <rect
            x={330 + index * 4}
            y={y + 7}
            width="34"
            height="6"
            rx="3"
            fill={color}
            fillOpacity="0.18"
          />
        </g>
      ))}
    </g>
  );
}

/** Streaming archetype: packets flowing left to right through stages. */
function FlowPattern({ color }: { color: string }) {
  const stages = [80, 176, 272, 368];

  return (
    <g>
      {stages.map((x, index) => (
        <g key={x}>
          <rect
            x={x - 30}
            y={index % 2 === 0 ? 108 : 132}
            width="60"
            height="52"
            rx="10"
            fill="white"
            fillOpacity="0.8"
            stroke={color}
            strokeOpacity="0.28"
          />
          <rect
            x={x - 18}
            y={(index % 2 === 0 ? 108 : 132) + 14}
            width="36"
            height="5"
            rx="2.5"
            fill={color}
            fillOpacity="0.4"
          />
          <rect
            x={x - 18}
            y={(index % 2 === 0 ? 108 : 132) + 26}
            width="24"
            height="5"
            rx="2.5"
            fill={color}
            fillOpacity="0.22"
          />
        </g>
      ))}

      {stages.slice(0, -1).map((x, index) => {
        const y1 = index % 2 === 0 ? 134 : 158;
        const y2 = index % 2 === 0 ? 158 : 134;
        const from = x + 30;
        const to = x + 66;

        return (
          <g key={x}>
            <path
              d={`M ${from} ${y1} C ${x + 58} ${y1}, ${to + 2} ${y2}, ${to} ${y2}`}
              fill="none"
              stroke={color}
              strokeOpacity="0.3"
              strokeWidth="1.5"
            />
            {/* Packet animated on cx/cy — plain attribute interpolation, no
                offset-path support required. */}
            <motion.circle
              r="3.5"
              fill={color}
              initial={{ cx: from, cy: y1, opacity: 0 }}
              animate={{ cx: [from, to], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.55,
                // Opacity has four keyframes to fade at both ends, so it needs
                // its own timing rather than inheriting the two-keyframe one.
                opacity: {
                  duration: 2.2,
                  repeat: Infinity,
                  delay: index * 0.55,
                  times: [0, 0.15, 0.85, 1],
                },
              }}
            />
          </g>
        );
      })}

      {[60, 96, 132].map((y, index) => (
        <rect
          key={y}
          x="56"
          y={y - 10}
          width={140 + index * 40}
          height="4"
          rx="2"
          fill={color}
          fillOpacity={0.12 - index * 0.03}
        />
      ))}
    </g>
  );
}

/** Analytics archetype: a chart card with animated bars and a trend line. */
function BarsPattern({ color }: { color: string }) {
  const bars = [58, 96, 74, 132, 108, 158, 122, 176];

  return (
    <g>
      <rect
        x="52"
        y="42"
        width="376"
        height="216"
        rx="12"
        fill="white"
        fillOpacity="0.72"
        stroke={color}
        strokeOpacity="0.2"
      />

      {[92, 132, 172, 212].map((y) => (
        <line
          key={y}
          x1="76"
          y1={y}
          x2="404"
          y2={y}
          stroke={color}
          strokeOpacity="0.1"
          strokeDasharray="3 5"
        />
      ))}

      {bars.map((height, index) => {
        const x = 88 + index * 40;
        return (
          <motion.rect
            key={index}
            x={x}
            width="20"
            rx="5"
            fill={color}
            fillOpacity={index === bars.length - 1 ? 0.75 : 0.3}
            initial={{ height: 0, y: 232 }}
            whileInView={{ height, y: 232 - height }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: index * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}

      <motion.path
        d="M 98 174 L 138 136 L 178 152 L 218 100 L 258 118 L 298 74 L 338 110 L 378 56"
        fill="none"
        stroke={color}
        strokeOpacity="0.85"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />

      <rect
        x="76"
        y="58"
        width="86"
        height="7"
        rx="3.5"
        fill={color}
        fillOpacity="0.35"
      />
      <rect
        x="76"
        y="71"
        width="52"
        height="6"
        rx="3"
        fill={color}
        fillOpacity="0.18"
      />
    </g>
  );
}
