import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT } from "../constants";
import { CandleChart } from "../components/CandleChart";
import { Particles } from "../components/Particles";

/* ─────────────────────────────────────────────────────────
   SCENE 3 — Intensity Build  (600 frames / 10 s)
   Word sequence with heavy-impact entrances:
     "SMARTER"  f  0 – 200
     "FASTER"   f 200 – 400
     "STRONGER" f 400 – 600
───────────────────────────────────────────────────────── */

interface WordProps {
  word: string;
  startF: number;
  endF: number;
  frame: number;
  color?: string;
  size?: number;
}

const ImpactWord: React.FC<WordProps> = ({
  word,
  startF,
  endF,
  frame,
  color = GOLD,
  size = WIDTH * 0.21,
}) => {
  if (frame < startF || frame > endF) return null;

  const local = frame - startF;
  const exitLocal = endF - frame;

  /* Impact entrance — spring-like: scale from 3.5 → 1 with overshoot */
  const ENTRANCE = 28;
  const entranceT = Math.min(local / ENTRANCE, 1);
  const scale = interpolate(
    local,
    [0, 8, 18, ENTRANCE],
    [3.5, 0.88, 1.06, 1.0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  /* Blur clears as it enters */
  const blur = interpolate(local, [0, ENTRANCE], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Opacity: fast snap in, hold, then fade out */
  const opacity =
    local < 4
      ? interpolate(local, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : exitLocal < 25
      ? interpolate(exitLocal, [0, 25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  /* Letter tracking: starts wide, tightens */
  const tracking = interpolate(local, [0, ENTRANCE, ENTRANCE + 30], [0.6, 0.16, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Glow breathe */
  const breathe = 0.8 + 0.2 * Math.sin(frame * 0.14);

  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: `${tracking}em`,
        textTransform: "uppercase",
        textAlign: "center",
        background: `linear-gradient(135deg, #B8962E 0%, ${GOLD} 30%, ${GOLD_B} 55%, ${GOLD} 80%, #6B4F12 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: `drop-shadow(0 0 ${WIDTH * 0.055}px rgba(212,175,55,${
          0.9 * breathe * opacity
        })) drop-shadow(0 0 ${WIDTH * 0.14}px rgba(212,175,55,${
          0.35 * opacity
        })) blur(${blur * Math.max(0, 1 - entranceT)}px)`,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {word}
    </div>
  );
};

/* Horizontal HUD slash lines flanking the word */
const AccentLines: React.FC<{ frame: number; startF: number; endF: number; alpha: number }> = ({
  frame,
  startF,
  endF,
  alpha,
}) => {
  if (frame < startF + 20 || frame > endF) return null;
  const a = interpolate(frame - startF, [20, 40], [0, alpha], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const w = interpolate(frame - startF, [20, 55], [0, WIDTH * 0.28], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      {/* Left line */}
      <div
        style={{
          position: "absolute",
          right: `calc(50% + ${WIDTH * 0.16}px)`,
          top: "50%",
          height: 2,
          width: w,
          background: `linear-gradient(to left, rgba(212,175,55,${a}), transparent)`,
        }}
      />
      {/* Right line */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% + ${WIDTH * 0.16}px)`,
          top: "50%",
          height: 2,
          width: w,
          background: `linear-gradient(to right, rgba(212,175,55,${a}), transparent)`,
        }}
      />
    </>
  );
};

/* Particle burst that intensifies over the scene */
const IntensityParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const count = Math.floor(interpolate(frame, [0, 400], [80, 280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const speed = interpolate(frame, [0, 600], [0.8, 2.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <Particles count={count} speedMult={speed} />;
};

export const VipScene3: React.FC = () => {
  const frame = useCurrentFrame();

  /* Charts scroll faster as energy builds */
  const chartSpeed1 = interpolate(frame, [0, 600], [1.2, 3.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chartSpeed2 = interpolate(frame, [0, 600], [0.8, 2.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Background glow intensifies */
  const bgGlow = interpolate(frame, [0, 300, 600], [0.03, 0.06, 0.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgPulse = bgGlow * (0.85 + 0.15 * Math.sin(frame * 0.16));

  /* Flash on each word impact */
  const flashAt = (f: number) => {
    const d = frame - f;
    return d >= 0 && d < 10
      ? interpolate(d, [0, 2, 10], [0, 0.55, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  };
  const impactFlash = Math.max(flashAt(0), flashAt(200), flashAt(400));

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* Chart layers */}
      <CandleChart
        x={0}
        y={HEIGHT * 0.08}
        width={WIDTH}
        height={HEIGHT * 0.42}
        alpha={0.18}
        speed={chartSpeed1}
        seed={9}
      />
      <CandleChart
        x={0}
        y={HEIGHT * 0.5}
        width={WIDTH}
        height={HEIGHT * 0.42}
        alpha={0.14}
        speed={-chartSpeed2}
        seed={17}
      />

      {/* Horizontal divider */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)`,
        }}
      />

      {/* Particles intensifying */}
      <IntensityParticles frame={frame} />

      {/* Background glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 55% at 50% 50%, rgba(212,175,55,${bgPulse}) 0%, transparent 65%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Word sequence */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImpactWord word="SMARTER"  startF={0}   endF={195}  frame={frame} />
        <ImpactWord word="FASTER"   startF={200}  endF={395}  frame={frame} size={WIDTH * 0.23} />
        <ImpactWord word="STRONGER" startF={400}  endF={600}  frame={frame} size={WIDTH * 0.175} />
      </AbsoluteFill>

      {/* Accent lines */}
      <AbsoluteFill>
        <AccentLines frame={frame} startF={0}   endF={195}  alpha={0.7} />
        <AccentLines frame={frame} startF={200}  endF={395}  alpha={0.7} />
        <AccentLines frame={frame} startF={400}  endF={600}  alpha={0.7} />
      </AbsoluteFill>

      {/* Sub-text label (small, below word) */}
      {[
        { word: "SMARTER",  s: 30,  e: 195,  sub: "ANALYSIS · PRECISION · EDGE" },
        { word: "FASTER",   s: 230, e: 395,  sub: "REAL-TIME · SIGNALS · ALERTS" },
        { word: "STRONGER", s: 430, e: 600,  sub: "COMMUNITY · GROWTH · RESULTS" },
      ].map(({ s, e, sub }) => {
        if (frame < s || frame > e) return null;
        const a = interpolate(frame - s, [0, 25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <AbsoluteFill
            key={sub}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: WIDTH * 0.35,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: WIDTH * 0.022,
                fontWeight: 300,
                letterSpacing: "0.36em",
                color: `rgba(212,175,55,${0.55 * a})`,
                textAlign: "center",
                textTransform: "uppercase",
                textShadow: `0 0 18px rgba(212,175,55,0.4)`,
                opacity: a,
              }}
            >
              {sub}
            </div>
          </AbsoluteFill>
        );
      })}

      {/* Word-impact flash */}
      {impactFlash > 0 && (
        <AbsoluteFill
          style={{
            background: `rgba(212,175,55,${impactFlash})`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 85% at 50% 50%, transparent 20%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
