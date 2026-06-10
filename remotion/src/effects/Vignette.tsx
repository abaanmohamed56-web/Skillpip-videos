import React from "react";
import { AbsoluteFill } from "remotion";

interface VignetteProps {
  strength?: number; // 0–1
}

export const Vignette: React.FC<VignetteProps> = ({ strength = 0.7 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,${strength * 0.65}) 75%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);
