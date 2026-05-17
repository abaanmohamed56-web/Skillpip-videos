import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT } from "../constants";
import { Particles } from "../components/Particles";

/* ─────────────────────────────────────────────────────────
   SCENE 4 — The Tease  (480 frames / 8 s)
   0-60   : near-black, hint of particles
   60-120 : "VIP 2.0" slowly emerges from shadows
   120-210: gold scan light reveals it fully
   210-270: fully revealed + ambient glow settles
   270-360: "COMING SOON" fades in
   360-480: "THE MARKET WILL NEVER LOOK THE SAME"
───────────────────────────────────────────────────────── */

/* The gold scan-light reveal effect:
   - Text rendered twice: shadow (always dim) + bright (revealed by clip)
   - A glowing strip sweeps left → right, after which text stays lit */
const ScanReveal: React.FC<{
  children: React.ReactNode;
  scanStart: number;
  scanEnd: number;
  frame: number;
  style?: React.CSSProperties;
}> = ({ children, scanStart, scanEnd, frame, style }) => {
  /* 0 = fully hidden, 1 = fully revealed */
  const scanP = interpolate(frame, [scanStart, scanEnd], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Clip the "lit" version from left edge up to scan position */
  const clipRight = 100 - scanP * 100;

  /* Scan line X position (slightly ahead of clip edge) */
  const scanX = scanP * WIDTH;

  /* Alpha of scan line */
  const scanLineAlpha = interpolate(frame, [scanStart, scanStart + 15, scanEnd - 15, scanEnd], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", ...style }}>
      {/* Shadow (dim) version — always visible at low opacity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          filter: "blur(4px)",
        }}
      >
        {children}
      </div>

      {/* Revealed (bright) version — clipped from left */}
      <div
        style={{
          clipPath: `inset(0 ${clipRight}% 0 0)`,
          transition: "clip-path 0s",
        }}
      >
        {children}
      </div>

      {/* Scan light strip */}
      {scanLineAlpha > 0 && (
        <div
          style={{
            position: "absolute",
            top: "-40%",
            bottom: "-40%",
            left: scanX - 60,
            width: 120,
            background: `radial-gradient(ellipse 50% 100% at 50% 50%, rgba(255,248,200,${scanLineAlpha * 0.9}) 0%, rgba(212,175,55,${scanLineAlpha * 0.55}) 30%, transparent 70%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export const VipScene4: React.FC = () => {
  const frame = useCurrentFrame();

  /* Particle density — very sparse at start, builds slightly */
  const particleOp = interpolate(frame, [0, 90], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const particleCount = 55;

  /* Ambient emergence glow (builds slowly behind VIP 2.0) */
  const emergeGlow = interpolate(frame, [60, 200], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* VIP 2.0 shadow presence — faint, slightly blurred */
  const vipShadowOp = interpolate(frame, [60, 115], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* After scan: full bright glow settles */
  const vipGlowSettle = interpolate(frame, [210, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Breathing glow on settled text */
  const breathe = 0.78 + 0.22 * Math.sin(frame * 0.1);

  /* "COMING SOON" */
  const comingOp = interpolate(frame, [270, 320], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const comingY = interpolate(frame, [270, 320], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* "THE MARKET WILL NEVER LOOK THE SAME" */
  const taglineOp = interpolate(frame, [380, 440], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [380, 440], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Horizontal reflection line */
  const reflectOp = interpolate(frame, [215, 265], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* The VIP 2.0 typography node */
  const Vip2Text = (
    <div
      style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.175,
        fontWeight: 900,
        letterSpacing: "0.08em",
        textAlign: "center",
        background: `linear-gradient(160deg, #8B6914 0%, ${GOLD} 28%, ${GOLD_B} 50%, ${GOLD} 72%, #6B4F12 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: `drop-shadow(0 0 ${WIDTH * 0.06}px rgba(212,175,55,0.95)) drop-shadow(0 0 ${WIDTH * 0.14}px rgba(212,175,55,0.45))`,
        lineHeight: 1,
      }}
    >
      VIP
      <br />
      2.0
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {/* Sparse particles */}
      <div style={{ opacity: particleOp, position: "absolute", inset: 0 }}>
        <Particles count={particleCount} speedMult={0.25} />
      </div>

      {/* Emergence glow behind VIP text */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 65% 45% at 50% 48%, rgba(212,175,55,${
            0.05 * emergeGlow * (0.85 + 0.15 * breathe)
          }) 0%, rgba(212,175,55,${0.015 * emergeGlow}) 45%, transparent 70%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ── Main VIP 2.0 Layout ──────────────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: HEIGHT * 0.04,
        }}
      >
        {/* Label above */}
        {frame > 220 && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.022,
              fontWeight: 400,
              letterSpacing: "0.52em",
              textTransform: "uppercase",
              color: `rgba(212,175,55,${0.45 * vipGlowSettle})`,
              opacity: vipGlowSettle,
            }}
          >
            SKILL PIPS
          </div>
        )}

        {/* VIP 2.0 — before scan (shadow) */}
        {frame >= 60 && frame < 120 && (
          <div
            style={{
              opacity: vipShadowOp,
              filter: `blur(${interpolate(frame, [60, 120], [8, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) brightness(0.25)`,
            }}
          >
            {Vip2Text}
          </div>
        )}

        {/* VIP 2.0 — scan reveal (120-210) */}
        {frame >= 120 && frame < 215 && (
          <ScanReveal scanStart={120} scanEnd={210} frame={frame}>
            {Vip2Text}
          </ScanReveal>
        )}

        {/* VIP 2.0 — post-scan, fully revealed with settled glow */}
        {frame >= 215 && (
          <div
            style={{
              opacity: vipGlowSettle,
              filter: `drop-shadow(0 0 ${WIDTH * 0.07 * breathe * vipGlowSettle}px rgba(212,175,55,0.8))`,
            }}
          >
            {Vip2Text}
          </div>
        )}

        {/* Reflection line */}
        {reflectOp > 0 && (
          <div
            style={{
              width: WIDTH * 0.65,
              height: 1,
              background: `linear-gradient(90deg, transparent, rgba(212,175,55,${
                0.5 * reflectOp
              }), transparent)`,
              opacity: reflectOp,
            }}
          />
        )}

        {/* COMING SOON */}
        {comingOp > 0 && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.048,
              fontWeight: 700,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: GOLD,
              textAlign: "center",
              textShadow: `0 0 24px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.25)`,
              opacity: comingOp,
              transform: `translateY(${comingY}px)`,
            }}
          >
            COMING SOON
          </div>
        )}

        {/* THE MARKET WILL NEVER LOOK THE SAME */}
        {taglineOp > 0 && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.028,
              fontWeight: 300,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: `rgba(255,255,255,0.62)`,
              textAlign: "center",
              padding: "0 8%",
              lineHeight: 1.55,
              textShadow: `0 0 18px rgba(212,175,55,0.25)`,
              opacity: taglineOp,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            The Market Will Never
            <br />
            Look The Same
          </div>
        )}
      </AbsoluteFill>

      {/* Subtle floor reflection */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 18% at 50% 100%, rgba(212,175,55,${
            0.025 * emergeGlow
          }) 0%, transparent 60%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 25%, rgba(0,0,0,0.58) 68%, rgba(0,0,0,0.95) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
