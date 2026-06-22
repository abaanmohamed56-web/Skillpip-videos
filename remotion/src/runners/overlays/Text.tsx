import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { FONT } from "../constants";
import { smoothstep, clamp01 } from "../anim";

// A single huge cinematic word that blurs/letter-spaces into view, holds,
// then dissolves. Used for the per-scene keywords.
export const WordReveal: React.FC<{
  text: string;
  from: number;
  to: number;
  top?: string;
  size?: number;
}> = ({ text, from, to, top = "20%", size = 150 }) => {
  const frame = useCurrentFrame();
  if (frame < from - 4 || frame > to + 4) return null;

  const inT = smoothstep(from, from + 26, frame);
  const outT = smoothstep(to - 26, to, frame);
  const op = clamp01(inT - outT);
  const blur = (1 - inT) * 16 + outT * 10;
  const ls = interpolate(inT, [0, 1], [0.55, 0.2]);
  const y = interpolate(inT, [0, 1], [26, 0]) + outT * -18;
  const scale = interpolate(inT, [0, 1], [1.08, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 200,
        fontSize: size,
        letterSpacing: `${ls}em`,
        color: "#ffffff",
        opacity: op,
        filter: `blur(${blur}px)`,
        transform: `translateY(${y}px) scale(${scale})`,
        textShadow:
          "0 0 24px rgba(191,233,255,0.55), 0 0 60px rgba(191,233,255,0.25)",
        textTransform: "uppercase",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

// Reveals a phrase one word at a time (staggered blur-in). Used in the finale.
export const WordByWord: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  size?: number;
  color?: string;
  weight?: number;
  top: string;
}> = ({ text, start, stagger = 9, size = 92, color = "#0a0a0a", weight = 600, top }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "6%",
        right: "6%",
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: "0.01em",
        color,
        textTransform: "uppercase",
        pointerEvents: "none",
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.32em",
        justifyContent: "center",
      }}
    >
      {words.map((wd, i) => {
        const f0 = start + i * stagger;
        const t = smoothstep(f0, f0 + 16, frame);
        return (
          <span
            key={i}
            style={{
              opacity: t,
              filter: `blur(${(1 - t) * 10}px)`,
              transform: `translateY(${(1 - t) * 14}px)`,
              display: "inline-block",
            }}
          >
            {wd}
          </span>
        );
      })}
    </div>
  );
};
