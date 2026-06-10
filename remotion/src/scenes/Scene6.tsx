/**
 * Scene 6 (40–50 s) — Multi-Panel Glassmorphism
 * The website splits into three floating glass panels in 3-D space.
 * Each panel shows a different section. Dynamic camera movement.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { FONT, FPS, GOLD, GOLD_B, GOLD_LIGHT, WIDTH, HEIGHT, SITE } from "../constants";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { WebsitePanel } from "../components/WebsitePanel";
import { GlassCard } from "../components/GlassCard";
import { GoldStreaks } from "../effects/GoldStreaks";
import { LensFlare } from "../effects/LensFlare";
import { Vignette } from "../effects/Vignette";

interface FloatingPanelProps {
  panelW: number;
  panelH: number;
  sections: ("hero" | "about" | "performance" | "pricing")[];
  scrollY: number;
  rotY: number;
  rotX: number;
  tx: number;
  ty: number;
  opacity: number;
  label: string;
  labelColor?: string;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  panelW, panelH, sections, scrollY, rotY, rotX, tx, ty, opacity, label, labelColor = GOLD,
}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
      opacity,
      transformStyle: "preserve-3d",
    }}
  >
    {/* Panel label chip */}
    <div
      style={{
        position: "absolute",
        top: -HEIGHT * 0.042,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(5,5,7,0.8)",
        border: `1px solid ${labelColor}40`,
        borderRadius: 20,
        padding: `${HEIGHT * 0.007}px ${WIDTH * 0.016}px`,
        whiteSpace: "nowrap",
        zIndex: 5,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.009,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: labelColor,
        }}
      >
        {label}
      </span>
    </div>

    <WebsitePanel
      width={panelW}
      scrollY={scrollY}
      showSections={sections}
      clipHeight={panelH}
    />

    {/* Gold border glow */}
    <div
      style={{
        position: "absolute",
        inset: -1,
        borderRadius: panelW * 0.01,
        border: `1px solid rgba(212,175,55,0.18)`,
        boxShadow: `0 0 30px rgba(212,175,55,0.08), 0 30px 80px rgba(0,0,0,0.8)`,
        pointerEvents: "none",
      }}
    />
  </div>
);

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 300;

  /* ── Panel size ── */
  const PANEL_W = WIDTH * 0.36;
  const PANEL_H = PANEL_W * 0.7;

  /* ── Spring separation ── */
  const sepSp = spring({ frame: Math.max(0, frame - 20), fps: FPS, config: { stiffness: 38, damping: 16 } });

  /* ── Camera drift ── */
  const camRY = Math.sin(frame * 0.006) * 4;
  const camRX = Math.cos(frame * 0.004) * 1.5;

  /* ── Panel positions ── */
  const sep = sepSp * WIDTH * 0.31;

  // Left panel (Hero)
  const txL = interpolate(sepSp, [0, 1], [0, -sep]);
  const tyL = interpolate(sepSp, [0, 1], [0, HEIGHT * 0.02]);
  const ry_L = interpolate(sepSp, [0, 1], [0, 12]);

  // Center panel (Performance)
  const txC = 0;
  const tyC = interpolate(sepSp, [0, 1], [0, -HEIGHT * 0.03]);
  const ry_C = 0;

  // Right panel (Pricing)
  const txR = interpolate(sepSp, [0, 1], [0, sep]);
  const tyR = interpolate(sepSp, [0, 1], [0, HEIGHT * 0.02]);
  const ry_R = interpolate(sepSp, [0, 1], [0, -12]);

  /* ── Overall panel opacity ── */
  const panelOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Scroll progress for each panel ── */
  const heroScroll    = 0;
  const perfScroll    = 0;
  const pricingScroll = 0;

  /* ── Text ── */
  const textOp = interpolate(frame, [100, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY  = interpolate(frame, [100, 140], [16, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Lens flare ── */
  const flareOp = interpolate(frame, [60, 100], [0, 0.65], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Background gridOpacity={0.025} goldGlow glowIntensity={0.1} />
      <Particles count={120} speedMult={0.5} opacity={0.55} />
      <GoldStreaks count={10} intensity={0.45} />

      {/* ── 3-D stage ── */}
      <AbsoluteFill
        style={{
          perspective: `${WIDTH * 1.8}px`,
          perspectiveOrigin: "50% 48%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `rotateY(${camRY}deg) rotateX(${camRX}deg)`,
          }}
        >
          {/* Left — Hero */}
          <FloatingPanel
            panelW={PANEL_W} panelH={PANEL_H}
            sections={["hero"]}
            scrollY={heroScroll}
            rotY={ry_L} rotX={2}
            tx={txL} ty={tyL}
            opacity={panelOp}
            label="Hero"
            labelColor={GOLD}
          />

          {/* Center — Performance */}
          <FloatingPanel
            panelW={PANEL_W * 1.08} panelH={PANEL_H * 1.08}
            sections={["performance"]}
            scrollY={perfScroll}
            rotY={ry_C} rotX={-1}
            tx={txC} ty={tyC}
            opacity={panelOp}
            label="Performance"
            labelColor="#4ade80"
          />

          {/* Right — Pricing */}
          <FloatingPanel
            panelW={PANEL_W} panelH={PANEL_H}
            sections={["pricing"]}
            scrollY={pricingScroll}
            rotY={ry_R} rotX={2}
            tx={txR} ty={tyR}
            opacity={panelOp}
            label="Pricing"
            labelColor={GOLD_LIGHT}
          />
        </div>
      </AbsoluteFill>

      {/* ── Connection lines between panels ── */}
      {sepSp > 0.3 && (
        <svg
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: (sepSp - 0.3) / 0.7 * 0.35 }}
        >
          <defs>
            <linearGradient id="cline" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="rgba(212,175,55,0)" />
              <stop offset="50%"  stopColor="rgba(212,175,55,0.55)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0)" />
            </linearGradient>
          </defs>
          <line
            x1={WIDTH * 0.5 + txL} y1={HEIGHT * 0.5}
            x2={WIDTH * 0.5 + txC} y2={HEIGHT * 0.5}
            stroke="url(#cline)" strokeWidth="1.5"
          />
          <line
            x1={WIDTH * 0.5 + txC} y1={HEIGHT * 0.5}
            x2={WIDTH * 0.5 + txR} y2={HEIGHT * 0.5}
            stroke="url(#cline)" strokeWidth="1.5"
          />
        </svg>
      )}

      {/* Text overlay */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: HEIGHT * 0.14,
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.025,
            fontWeight: 300,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            textShadow: "0 2px 20px rgba(0,0,0,0.95)",
          }}
        >
          Designed for modern traders.
        </div>
      </AbsoluteFill>

      {flareOp > 0.05 && (
        <div style={{ opacity: flareOp }}>
          <LensFlare x={0.5} y={0.12} intensity={0.5} size={WIDTH * 0.22} />
        </div>
      )}

      <Vignette strength={0.7} />
    </AbsoluteFill>
  );
};
