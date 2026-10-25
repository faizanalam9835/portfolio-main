import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} — Full Stack & AI Engineer | MERN, Next.js & RAG`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card generated at build/request time — no design tool round-trip,
 * and it stays in sync with `data/site.ts` automatically.
 */
export default function OpenGraphImage() {
  const chips = ["Next.js", "React", "Node.js", "MongoDB", "RAG", "Vector DB"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#000000",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 6,
              background: "#000000",
              border: "2px solid #ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {siteConfig.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#ffffff" }}>
              {siteConfig.name}
            </div>
            <div style={{ fontSize: 18, color: "#a3a3a3", marginTop: 4 }}>
              {siteConfig.role}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.08,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              maxWidth: 940,
              display: "flex",
            }}
          >
            {`Hi, I'm ${siteConfig.firstName}. I build things for the web.`}
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#a3a3a3",
              marginTop: 26,
              maxWidth: 880,
              display: "flex",
            }}
          >
            React · Next.js · Node.js · MongoDB · LLM APIs · RAG
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: 6,
                border: "1px solid #ffffff",
                background: "#ffffff",
                color: "#000000",
                fontSize: 20,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
