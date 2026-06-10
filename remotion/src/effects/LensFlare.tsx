import React from "react";
import { useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, WIDTH, HEIGHT } from "../constants";

interface LensFlareProps {
  x?: number;   // 0-1 normalized
  y?: number;
  intensity?: number;
  size?: number;
}

export const LensFlare: React.FC<LensFlareProps> = ({
  x = 0.5,
  y = 0.5,
  intensity = 1,
  size = WIDTH * 0.35,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.06);

  const cx = x * WIDTH;
  const cy = y * HEIGHT;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen" }}>
      {/* Primary halo */}
      <div
        style={{
          position: "absolute",
          left: cx, top: cy,
          width: size, height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,215,0,${0.55 * intensity * pulse}) 0%, rgba(212,175,55,${0.22 * intensity * pulse}) 25%, rgba(212,175,55,${0.08 * intensity}) 55%, transparent 75%)`,
          transform: "translate(-50%, -50%)",
          filter: `blur(${size * 0.015}px)`,
        }}
      />
      {/* Secondary streak horizontal */}
      <div
        style={{
          position: "absolute",
          left: cx, top: cy,
          width: size * 2.8, height: size * 0.04,
          background: `linear-gradient(90deg, transparent 0%, rgba(255,215,0,${0.18 * intensity}) 40%, rgba(255,255,255,${0.35 * intensity * pulse}) 50%, rgba(255,215,0,${0.18 * intensity}) 60%, transparent 100%)`,
          transform: "translate(-50%, -50%)",
          filter: `blur(${size * 0.008}px)`,
        }}
      />
      {/* Vertical streak */}
      <div
        style={{
          position: "absolute",
          left: cx, top: cy,
          width: size * 0.04, height: size * 1.8,
          background: `linear-gradient(180deg, transparent 0%, rgba(255,215,0,${0.12 * intensity}) 40%, rgba(255,255,255,${0.25 * intensity * pulse}) 50%, rgba(255,215,0,${0.12 * intensity}) 60%, transparent 100%)`,
          transform: "translate(-50%, -50%)",
          filter: `blur(${size * 0.006}px)`,
        }}
      />
      {/* Small bright core */}
      <div
        style={{
          position: "absolute",
          left: cx, top: cy,
          width: size * 0.06, height: size * 0.06,
          borderRadius: "50%",
          background: `rgba(255,255,240,${0.95 * intensity * pulse})`,
          transform: "translate(-50%, -50%)",
          filter: `blur(${size * 0.003}px)`,
        }}
      />
      {/* Ghost artifact */}
      <div
        style={{
          position: "absolute",
          left: WIDTH - cx, top: HEIGHT - cy,
          width: size * 0.35, height: size * 0.35,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(212,175,55,${0.12 * intensity}) 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};
