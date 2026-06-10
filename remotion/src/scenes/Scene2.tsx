/**
 * Scene 2 (5–12 s) — Website Floating in 3-D Space
 * The SkillPips website homepage appears floating in dark space.
 * Camera orbits slowly around the UI with a reflection below.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { FONT, FPS, GOLD, GOLD_B, WIDTH, HEIGHT } from "../constants";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { WebsitePanel } from "../components/WebsitePanel";
import { Vignette } from "../effects/Vignette";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 210;

  /* ── Website panel enter ── */
  const panelOp = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelSc = spring({ frame, fps: FPS, config: { stiffness: 45, damping: 16 } });
  const scale   = 0.62 + panelSc * 0.12; // 0.62 → 0.74

  /* ── Camera orbit ── */
  const rotY  = interpolate(frame, [0, dur], [28, -8],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotX  = interpolate(frame, [0, dur], [5, 2],    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tilt  = Math.sin(frame * 0.012) * 0.4; // gentle bob

  /* ── Reflection fade-in ── */
  const reflOp = interpolate(frame, [20, 70], [0, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Highlight ring animations ── */
  const h1Op = interpolate(frame, [45, 75],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h2Op = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h3Op = interpolate(frame, [115, 145],[0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Text reveal ── */
  const textOp = interpolate(frame, [90, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY  = interpolate(frame, [90, 125], [16, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const PANEL_W = WIDTH * 0.74;
  const PANEL_H = PANEL_W * 0.694; // 1440:1000 aspect
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background gridOpacity={0.022} goldGlow glowIntensity={0.08} />
      <Particles count={140} speedMult={0.42} opacity={0.6} />

      {/* ── Panel + reflection in 3-D stage ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: `${WIDTH * 1.6}px`,
        }}
      >
        <div
          style={{
            opacity: panelOp,
            transform: `rotateY(${rotY}deg) rotateX(${rotX + tilt}deg) scale(${scale})`,
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Main panel */}
          <WebsitePanel
            width={PANEL_W}
            scrollY={0}
            showSections={["hero"]}
            clipHeight={PANEL_H}
          />

          {/* Reflection */}
          <div
            style={{
              position: "absolute",
              top: PANEL_H + 2,
              left: 0,
              width: PANEL_W,
              height: PANEL_H * 0.35,
              overflow: "hidden",
              opacity: reflOp,
              transform: "scaleY(-1)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 80%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 80%)",
            }}
          >
            <WebsitePanel
              width={PANEL_W}
              scrollY={0}
              showSections={["hero"]}
              clipHeight={PANEL_H}
            />
          </div>

          {/* Ground shadow */}
          <div
            style={{
              position: "absolute",
              top: PANEL_H + PANEL_H * 0.35 + 8,
              left: PANEL_W * 0.1,
              width: PANEL_W * 0.8,
              height: PANEL_W * 0.04,
              background: "radial-gradient(ellipse, rgba(212,175,55,0.18) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* ── Section highlight rings ── */}
      {/* Signal widget highlight */}
      <div
        style={{
          position: "absolute",
          right: WIDTH * 0.155,
          top: HEIGHT * 0.275,
          width: WIDTH * 0.155,
          height: HEIGHT * 0.32,
          border: `1px solid rgba(212,175,55,${0.65 * h1Op})`,
          borderRadius: 12,
          boxShadow: `0 0 20px rgba(212,175,55,${0.22 * h1Op}), inset 0 0 15px rgba(212,175,55,${0.06 * h1Op})`,
          opacity: h1Op,
          pointerEvents: "none",
        }}
      />
      {/* Stats bar highlight */}
      <div
        style={{
          position: "absolute",
          left: WIDTH * 0.133,
          top: HEIGHT * 0.505,
          width: WIDTH * 0.28,
          height: HEIGHT * 0.1,
          border: `1px solid rgba(255,255,255,${0.22 * h2Op})`,
          borderRadius: 6,
          boxShadow: `0 0 14px rgba(255,255,255,${0.08 * h2Op})`,
          opacity: h2Op,
          pointerEvents: "none",
        }}
      />
      {/* CTA button highlight */}
      <div
        style={{
          position: "absolute",
          left: WIDTH * 0.135,
          top: HEIGHT * 0.63,
          width: WIDTH * 0.11,
          height: HEIGHT * 0.068,
          border: `1px solid rgba(212,175,55,${0.55 * h3Op})`,
          borderRadius: 5,
          boxShadow: `0 0 18px rgba(212,175,55,${0.2 * h3Op})`,
          opacity: h3Op,
          pointerEvents: "none",
        }}
      />

      {/* ── Caption text ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: HEIGHT * 0.14,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.026,
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.88)",
            textAlign: "center",
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            textShadow: "0 2px 20px rgba(0,0,0,0.9)",
          }}
        >
          Built for serious traders.
        </div>
      </AbsoluteFill>

      <Vignette strength={0.68} />
    </AbsoluteFill>
  );
};
