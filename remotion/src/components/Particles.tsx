import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GOLD } from "../constants";

/* Deterministic LCG so every render of frame N gives identical output */
function lcg(seed: number): number {
  return (((seed * 1664525 + 1013904223) >>> 0) / 4294967296);
}

interface PData {
  sx: number; sy: number;
  vx: number; vy: number;
  r: number; al: number;
  phi: number; dphi: number;
  lifespan: number; startFrame: number;
}

function mkParticle(i: number, w: number, h: number): PData {
  const s = (n: number) => lcg(i * 11 + n);
  return {
    sx: s(0) * w,
    sy: s(1) * h,
    vx: (s(2) - 0.5) * 0.45,
    vy: -(s(3) * 0.52 + 0.08),
    r:  s(4) * 1.7 + 0.35,
    al: s(5) * 0.52 + 0.1,
    phi:  s(6) * Math.PI * 2,
    dphi: 0.035 + s(7) * 0.04,
    lifespan:   120 + s(8) * 200,
    startFrame: s(9) * 300,
  };
}

interface Props {
  count?: number;
  speedMult?: number;
  opacity?: number;
}

export const Particles: React.FC<Props> = ({
  count = 200,
  speedMult = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const data = React.useMemo(
    () => Array.from({ length: count }, (_, i) => mkParticle(i, width, height)),
    [count, width, height]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {data.map((p, i) => {
        const localF = ((frame - p.startFrame + 100000) % p.lifespan);
        const x = ((p.sx + p.vx * localF * speedMult) % width + width) % width;
        const y = p.sy + p.vy * localF * speedMult;
        if (y < -10 || y > height + 10) return null;

        const phi = p.phi + frame * p.dphi;
        const fadeIn  = Math.min(localF / 20, 1);
        const fadeOut = Math.min((p.lifespan - localF) / 20, 1);
        const twinkle = 0.72 + 0.28 * Math.sin(phi);
        const alpha   = p.al * fadeIn * fadeOut * twinkle * opacity;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width:  p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: GOLD,
              opacity: alpha,
              boxShadow: `0 0 ${p.r * 4}px ${GOLD}`,
              transform: "translate(-50%,-50%)",
            }}
          />
        );
      })}
    </div>
  );
};
