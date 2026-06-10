/**
 * Scene 1 (0–5 s) — Opening Darkness
 * Gold particles emerge from black, logo materialises, title text reveals.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { FONT, FPS, GOLD, GOLD_B, GOLD_LIGHT, WIDTH, HEIGHT } from "../constants";
import { Particles } from "../components/Particles";
import { Vignette } from "../effects/Vignette";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Logo reveal ── */
  const logoSc = spring({ frame: Math.max(0, frame - 12), fps: FPS, config: { stiffness: 55, damping: 14 } });
  const logoOp = interpolate(frame, [12, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoGlow = 0.6 + 0.4 * Math.sin(frame * 0.07);

  /* ── "SKILLPIPS" wordmark glow pulse ── */
  const wordOp = interpolate(frame, [28, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Headline lines ── */
  const line1Op = interpolate(frame, [70, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y  = interpolate(frame, [70, 105], [22, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Op = interpolate(frame, [88, 123], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y  = interpolate(frame, [88, 123], [22, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Divider bar ── */
  const barW = interpolate(frame, [60, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Central ambient glow ── */
  const glowR = interpolate(frame, [0, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Expanding central glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,${0.08 * glowR}) 0%, rgba(109,16,36,${0.12 * glowR}) 40%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Gold particles drifting upward */}
      <Particles count={220} speedMult={0.55} opacity={0.85} />

      {/* Logo container — centred */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: HEIGHT * 0.025,
        }}
      >
        {/* Gold divider bar (above) */}
        <div
          style={{
            width: WIDTH * 0.18 * barW,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            opacity: 0.7,
            marginBottom: -HEIGHT * 0.01,
          }}
        />

        {/* Logo */}
        <div
          style={{
            opacity: logoOp,
            transform: `scale(${0.55 + logoSc * 0.45})`,
          }}
        >
          {/* Diamond mark */}
          <div
            style={{
              width: WIDTH * 0.028,
              height: WIDTH * 0.028,
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
              transform: "rotate(45deg)",
              margin: "0 auto",
              marginBottom: WIDTH * 0.012,
              boxShadow: `0 0 ${WIDTH * 0.04 * logoGlow}px rgba(212,175,55,${0.7 * logoGlow}), 0 0 ${WIDTH * 0.012}px rgba(255,215,0,0.5)`,
            }}
          />
          {/* Wordmark */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.068,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_B} 25%, ${GOLD} 50%, #8B6914 75%, ${GOLD} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 ${WIDTH * 0.05}px rgba(212,175,55,${0.85 * logoGlow}))`,
              opacity: wordOp,
            }}
          >
            SKILLPIPS
          </div>
        </div>

        {/* Tagline tag */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.011,
            fontWeight: 400,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(212,175,55,0.62)",
            opacity: wordOp,
          }}
        >
          Premium Trading Signals
        </div>

        {/* Gold divider bar (below) */}
        <div
          style={{
            width: WIDTH * 0.18 * barW,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            opacity: 0.7,
            marginTop: -HEIGHT * 0.01,
            marginBottom: HEIGHT * 0.018,
          }}
        />

        {/* Title lines */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: HEIGHT * 0.004 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.033,
              fontWeight: 200,
              letterSpacing: "0.52em",
              textTransform: "uppercase",
              color: "#fff",
              opacity: line1Op,
              transform: `translateY(${line1Y}px)`,
            }}
          >
            Trading Excellence
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.048,
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 40%, ${GOLD_LIGHT} 55%, ${GOLD} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 ${WIDTH * 0.03}px rgba(212,175,55,0.5))`,
              opacity: line2Op,
              transform: `translateY(${line2Y}px)`,
            }}
          >
            Redefined
          </div>
        </div>
      </AbsoluteFill>

      <Vignette strength={0.82} />
    </AbsoluteFill>
  );
};
