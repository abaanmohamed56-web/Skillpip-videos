/**
 * Scene 7 (50–60 s) — Final Convergence + CTA
 * Everything converges toward centre. Logo returns.
 * Gold particles swirl. Cinematic lens flare. "Trade Smarter." CTA.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { FONT, FPS, GOLD, GOLD_B, GOLD_LIGHT, GOLD_DARK, WIDTH, HEIGHT } from "../constants";
import { Particles } from "../components/Particles";
import { GoldStreaks } from "../effects/GoldStreaks";
import { LensFlare } from "../effects/LensFlare";
import { Vignette } from "../effects/Vignette";

// Swirling particle ring
const SwirlingRing: React.FC<{ frame: number; count?: number; radius?: number; opacity?: number }> = ({
  frame, count = 60, radius = WIDTH * 0.15, opacity = 1,
}) => {
  function lcg(seed: number): number {
    return (((seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const baseAngle = (i / count) * Math.PI * 2;
        const speed = 0.012 + lcg(i * 7) * 0.008;
        const angle  = baseAngle + frame * speed;
        const r      = radius * (0.7 + 0.3 * Math.sin(frame * 0.025 + i * 0.5));
        const x = WIDTH  / 2 + Math.cos(angle) * r;
        const y = HEIGHT / 2 + Math.sin(angle) * r;
        const size = 1 + lcg(i * 13) * 3;
        const alpha = opacity * (0.4 + 0.6 * lcg(i * 11) * (0.7 + 0.3 * Math.sin(frame * 0.04 + i)));
        const isGold = lcg(i * 17) > 0.3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x, top: y,
              width: size, height: size,
              borderRadius: "50%",
              background: isGold ? GOLD_B : "#fff",
              opacity: alpha,
              transform: "translate(-50%,-50%)",
              boxShadow: `0 0 ${size * 4}px ${isGold ? "rgba(255,215,0,0.9)" : "rgba(255,255,255,0.7)"}`,
            }}
          />
        );
      })}
    </div>
  );
};

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 300;

  /* ── Reveals ── */
  const sp = (delay: number, cfg = { stiffness: 52, damping: 14 }) =>
    spring({ frame: Math.max(0, frame - delay), fps: FPS, config: cfg });

  const logoSp  = sp(28);
  const line1   = sp(65);
  const line2   = sp(90);
  const line3   = sp(115);
  const btnSp   = sp(148, { stiffness: 60, damping: 12 });

  /* ── Ambient build ── */
  const energy = Math.min(1, frame / 200);
  const glowPulse = 0.6 + 0.4 * Math.sin(frame * 0.05);

  /* ── Lens flare progression ── */
  const flare1 = interpolate(frame, [60,  120],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flare2 = interpolate(frame, [120, 200],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Converging panels (faint ghost) ── */
  const ghostOp = interpolate(frame, [0, 40], [0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Button shine sweep ── */
  const shineProg = (frame * 1.2) % 100 / 100;

  /* ── Logo pulsing glow ── */
  const logoGlow = energy * (0.7 + 0.3 * glowPulse);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Central ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 65% 60% at 50% 50%, rgba(212,175,55,${0.12 * energy * glowPulse}) 0%, rgba(109,16,36,${0.08 * energy}) 45%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Background particles */}
      <Particles count={240} speedMult={0.7} opacity={0.75} />
      <GoldStreaks count={22} intensity={0.85 * energy} />

      {/* Swirling ring */}
      <SwirlingRing
        frame={frame}
        count={80}
        radius={WIDTH * 0.17 + frame * 0.08}
        opacity={0.65 * energy}
      />

      {/* ── Lens flares ── */}
      {flare1 > 0.05 && (
        <div style={{ opacity: flare1 * 0.8 }}>
          <LensFlare x={0.5} y={0.5} intensity={0.7 * flare1} size={WIDTH * 0.3} />
        </div>
      )}
      {flare2 > 0.05 && (
        <div style={{ opacity: flare2 * 0.55 }}>
          <LensFlare x={0.5} y={0.5} intensity={1.1 * flare2 * energy} size={WIDTH * 0.55} />
        </div>
      )}

      {/* ── Main content ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: HEIGHT * 0.028,
          zIndex: 10,
        }}
      >
        {/* Diamond mark */}
        <div
          style={{
            width: WIDTH * 0.022,
            height: WIDTH * 0.022,
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
            transform: `rotate(45deg) scale(${0.4 + logoSp * 0.6})`,
            opacity: logoSp,
            boxShadow: `0 0 ${WIDTH * 0.06 * logoGlow}px rgba(212,175,55,${0.85 * logoGlow}), 0 0 ${WIDTH * 0.015}px rgba(255,215,0,0.7)`,
            marginBottom: -HEIGHT * 0.005,
          }}
        />

        {/* SKILLPIPS wordmark */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.072,
            fontWeight: 900,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_B} 20%, ${GOLD} 50%, ${GOLD_DARK} 70%, ${GOLD} 85%, ${GOLD_B} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 ${WIDTH * 0.06 * logoGlow}px rgba(212,175,55,${0.9 * logoGlow}))`,
            opacity: logoSp,
            transform: `scale(${0.55 + logoSp * 0.45})`,
            lineHeight: 1,
          }}
        >
          SKILLPIPS
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: WIDTH * 0.15 * line1,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            opacity: line1 * 0.8,
          }}
        />

        {/* "Trade Smarter." */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.038,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#fff",
            opacity: line2,
            transform: `scale(${0.72 + line2 * 0.28}) translateY(${(1 - line2) * 18}px)`,
            filter: `drop-shadow(0 0 ${WIDTH * 0.025}px rgba(255,255,255,${0.22 * line2}))`,
          }}
        >
          Trade Smarter.
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.012,
            fontWeight: 300,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(212,175,55,0.72)",
            opacity: line3,
            transform: `translateY(${(1 - line3) * 12}px)`,
          }}
        >
          Signals · Analysis · Community
        </div>

        {/* ── JOIN TODAY button ── */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            fontFamily: FONT,
            fontSize: WIDTH * 0.016,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#000",
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 45%, ${GOLD_LIGHT} 55%, ${GOLD} 100%)`,
            padding: `${HEIGHT * 0.022}px ${WIDTH * 0.065}px`,
            borderRadius: HEIGHT * 0.1,
            opacity: btnSp,
            transform: `scale(${0.72 + btnSp * 0.28}) translateY(${(1 - btnSp) * 18}px)`,
            boxShadow: `0 0 ${WIDTH * 0.05 * energy * glowPulse}px rgba(212,175,55,0.65), 0 12px 40px rgba(0,0,0,0.6)`,
            cursor: "pointer",
            marginTop: HEIGHT * 0.008,
          }}
        >
          {/* Shine sweep */}
          <div
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: `${shineProg * 200 - 50}%`,
              width: "35%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
              transform: "skewX(-20deg)",
              pointerEvents: "none",
            }}
          />
          Join Today
        </div>

        {/* Website URL */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.0095,
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.32)",
            opacity: btnSp,
            marginTop: -HEIGHT * 0.01,
          }}
        >
          skillpips.vercel.app
        </div>
      </AbsoluteFill>

      <Vignette strength={0.72} />
    </AbsoluteFill>
  );
};
