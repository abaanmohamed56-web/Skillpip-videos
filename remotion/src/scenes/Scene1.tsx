import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, FONT, WIDTH } from "../constants";
import { Background } from "../components/Background";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [66, 132], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [66, 132], [14, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background chartAlpha={0.18} particleSpeed={0.45} />

      <AbsoluteFill
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.05,
            fontWeight: 200,
            letterSpacing: "0.5em",
            color: GOLD,
            textTransform: "uppercase",
            textAlign: "center",
            padding: "0 8%",
            lineHeight: 1.6,
            textShadow: `0 0 18px rgba(212,175,55,0.7), 0 0 40px rgba(212,175,55,0.3), 0 0 80px rgba(212,175,55,0.12)`,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          The Market Never Sleeps
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
