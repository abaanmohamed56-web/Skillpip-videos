import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT } from "../constants";
import { Particles } from "../components/Particles";
import { CandleChart } from "../components/CandleChart";

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const energy = Math.min(1, frame / 480);

  /* Logo entrance at 4.2 s into scene */
  const logoOp = interpolate(frame, [252, 312], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoSc = interpolate(frame, [252, 312], [0.65, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp  = interpolate(frame, [276, 336], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY   = interpolate(frame, [276, 336], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* Central pulse */
  const pulse = 0.28 + 0.72 * Math.abs(Math.sin(frame * 0.04));

  /* Flash */
  const flashPhase = Math.sin(frame * 0.075 + 1.2);
  const flashAlpha = flashPhase > 0.85 ? (flashPhase - 0.85) * energy * 0.55 : 0;

  /* Lightning — deterministic jagged paths */
  const lightningPaths: string[] = [];
  if (energy > 0.35) {
    for (let b = 0; b < 3; b++) {
      if (Math.sin(frame * 2.3 + b * 1.7) < 0.7) continue;
      const x1 = WIDTH * (0.2 + ((Math.sin(frame * 0.13 + b) * 0.5 + 0.5) * 0.6));
      const x2 = WIDTH * 0.5, y2 = HEIGHT * 0.5;
      const pts: string[] = [`${x1},0`];
      for (let j = 1; j < 7; j++) {
        const jx = x1 + (x2 - x1) * j / 7 + Math.sin(frame * 0.3 + j * b * 2.1) * 45;
        const jy = HEIGHT * j / 7;
        pts.push(`${jx},${jy}`);
      }
      pts.push(`${x2},${y2}`);
      lightningPaths.push(pts.join(" "));
    }
  }

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Energized charts */}
      <CandleChart x={0} y={HEIGHT * 0.08} width={WIDTH} height={HEIGHT * 0.38} alpha={0.22} speed={0.65} seed={0} />
      <CandleChart x={0} y={HEIGHT * 0.58} width={WIDTH} height={HEIGHT * 0.28} alpha={0.12} speed={0.40} seed={42} />

      {/* Fast particles */}
      <Particles count={200} speedMult={1.6} />

      {/* Central pulse glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,${0.07 * pulse * energy}) 0%, transparent 60%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Lightning */}
      {lightningPaths.length > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
          <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <filter id="lglow">
                <feGaussianBlur stdDeviation="3" result="cb" />
                <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {lightningPaths.map((pts, i) => (
              <polyline
                key={i}
                points={pts}
                fill="none"
                stroke="#FFD700"
                strokeWidth={1.5}
                opacity={0.45 * energy}
                filter="url(#lglow)"
              />
            ))}
          </svg>
        </AbsoluteFill>
      )}

      {/* Screen flash */}
      {flashAlpha > 0 && (
        <AbsoluteFill
          style={{
            background: `rgba(212,175,55,${flashAlpha})`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Logo */}
      <AbsoluteFill
        style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.095,
            fontWeight: 900,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 30%, ${GOLD} 55%, #8B6914 80%, ${GOLD} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 ${WIDTH * 0.07}px rgba(212,175,55,0.75))`,
            opacity: logoOp,
            transform: `scale(${logoSc})`,
          }}
        >
          SKILLPIPS
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.028,
            fontWeight: 300,
            letterSpacing: "0.42em",
            color: "rgba(212,175,55,0.75)",
            textTransform: "uppercase",
            marginTop: WIDTH * 0.032,
            opacity: tagOp,
            transform: `translateY(${tagY}px)`,
          }}
        >
          Signals · Analysis · Community
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 50%, transparent 25%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.9) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
