import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WIDTH, HEIGHT } from "../constants";
import { Particles } from "./Particles";
import { CandleChart } from "./CandleChart";

interface Props {
  chartAlpha?: number;
  particleSpeed?: number;
  showGlow?: boolean;
  glowY?: number;   /* 0-1 vertical center of ambient glow */
  glowIntensity?: number;
}

export const Background: React.FC<Props> = ({
  chartAlpha    = 0.10,
  particleSpeed = 0.70,
  showGlow      = false,
  glowY         = 0.46,
  glowIntensity = 1,
}) => {
  const frame     = useCurrentFrame();
  const glowPulse = 0.038 + 0.018 * Math.sin(frame * 0.03);

  return (
    <>
      {/* Candlestick chart layer 1 */}
      <CandleChart
        x={0} y={HEIGHT * 0.08}
        width={WIDTH} height={HEIGHT * 0.38}
        alpha={chartAlpha} speed={0.65} seed={0}
      />
      {/* Candlestick chart layer 2 */}
      <CandleChart
        x={0} y={HEIGHT * 0.58}
        width={WIDTH} height={HEIGHT * 0.28}
        alpha={chartAlpha * 0.55} speed={0.40} seed={42}
      />

      {/* Gold particles */}
      <Particles count={180} speedMult={particleSpeed} />

      {/* Ambient glow behind phone */}
      {showGlow && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 130% 60% at 50% ${glowY * 100}%, rgba(212,175,55,${glowPulse * glowIntensity}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 50%, transparent 25%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.88) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
};
