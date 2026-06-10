import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WIDTH, HEIGHT, BG } from "../constants";

interface BackgroundProps {
  gridOpacity?: number;
  burgandyOrbs?: boolean;
  goldGlow?: boolean;
  glowIntensity?: number;
}

export const Background: React.FC<BackgroundProps> = ({
  gridOpacity = 0.028,
  burgandyOrbs = true,
  goldGlow = true,
  glowIntensity = 0.12,
}) => {
  const frame = useCurrentFrame();
  const t = frame * 0.007;

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      {/* Animated burgundy/wine orbs — matching the real website */}
      {burgandyOrbs && (
        <>
          <div
            style={{
              position: "absolute",
              width: WIDTH * 0.7,
              height: WIDTH * 0.7,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(109,16,36,0.38) 0%, transparent 68%)",
              top: -WIDTH * 0.18,
              left: -WIDTH * 0.08,
              transform: `translate(${Math.sin(t) * 25}px, ${Math.cos(t * 0.6) * 18}px)`,
              filter: "blur(55px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: WIDTH * 0.55,
              height: WIDTH * 0.55,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(109,16,36,0.28) 0%, transparent 68%)",
              bottom: -WIDTH * 0.12,
              right: -WIDTH * 0.06,
              transform: `translate(${-Math.sin(t * 0.8) * 20}px, ${Math.cos(t * 0.5) * 14}px)`,
              filter: "blur(45px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: WIDTH * 0.35,
              height: WIDTH * 0.35,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(70,10,25,0.22) 0%, transparent 70%)",
              top: "35%",
              right: "15%",
              transform: `translate(${Math.cos(t * 0.9) * 15}px, ${Math.sin(t * 0.7) * 12}px)`,
              filter: "blur(35px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Subtle gold grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(212,175,55,${gridOpacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,${gridOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${WIDTH * 0.052}px ${HEIGHT * 0.092}px`,
          pointerEvents: "none",
        }}
      />

      {/* Ambient gold glow at bottom */}
      {goldGlow && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 40% at 50% 100%, rgba(212,175,55,${glowIntensity + 0.04 * Math.sin(t)}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
