/**
 * Scene 3 (12–20 s) — Hero Section Zoom
 * Camera slowly pushes in on the hero section.
 * Individual UI elements animate out with staggered spring reveals.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { FONT, FPS, GOLD, GOLD_B, GOLD_LIGHT, WIDTH, HEIGHT, SITE } from "../constants";
import { WebsitePanel } from "../components/WebsitePanel";
import { GlassCard } from "../components/GlassCard";
import { Particles } from "../components/Particles";
import { Vignette } from "../effects/Vignette";
import { LensFlare } from "../effects/LensFlare";

const PANEL_W = WIDTH;
const PANEL_H = PANEL_W * 0.694;

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Camera zoom ── */
  const zoomSc = interpolate(
    frame,
    [0, 180],
    [0.72, 1.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const zoomX = interpolate(frame, [0, 180], [0,  WIDTH * 0.05],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoomY = interpolate(frame, [0, 180], [0, -HEIGHT * 0.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Panel opacity: already fully visible from Scene 2 ── */
  const panelOp = interpolate(frame, [0, 18], [0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Floating stat cards reveal (staggered) ── */
  const sp = (delay: number) =>
    spring({ frame: Math.max(0, frame - delay), fps: FPS, config: { stiffness: 60, damping: 14 } });

  const card1 = sp(50);
  const card2 = sp(75);
  const card3 = sp(100);

  /* ── Depth-of-field blur on edges ── */
  const dofBlur = interpolate(frame, [100, 180], [0, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Text lines ── */
  const makeText = (start: number) => ({
    op: interpolate(frame, [start, start + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    y:  interpolate(frame, [start, start + 30], [14, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });
  const t1 = makeText(70);
  const t2 = makeText(110);
  const t3 = makeText(150);

  /* ── Lens flare intensity ── */
  const flareOp = interpolate(frame, [80, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardStyle = (prog: number): React.CSSProperties => ({
    opacity:   prog,
    transform: `scale(${0.72 + prog * 0.28}) translateY(${(1 - prog) * 28}px)`,
  });

  return (
    <AbsoluteFill style={{ background: "#050507", overflow: "hidden" }}>
      {/* ── Zoomed website panel ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: `blur(${dofBlur}px)`,
        }}
      >
        <div
          style={{
            opacity: panelOp,
            transform: `scale(${zoomSc}) translate(${zoomX}px, ${zoomY}px)`,
          }}
        >
          <WebsitePanel
            width={PANEL_W}
            scrollY={0}
            showSections={["hero"]}
            clipHeight={PANEL_H}
          />
        </div>
      </AbsoluteFill>

      {/* ── Dark overlay to create focal plane ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 65% at 42% 52%, transparent 28%, rgba(0,0,0,${0.55 * (frame / 240)}) 70%, rgba(0,0,0,0.8) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Floating stat cards (float out from the panel) ── */}
      {/* Win Rate card */}
      <div
        style={{
          position: "absolute",
          left: WIDTH * 0.04,
          top: HEIGHT * 0.22,
          zIndex: 10,
          ...cardStyle(card1),
        }}
      >
        <GlassCard
          padding={`${HEIGHT * 0.022}px ${WIDTH * 0.025}px`}
          borderRadius={14}
          borderColor="rgba(74,222,128,0.3)"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(74,222,128,0.1)" }}
        >
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.009, fontWeight: 600, color: "rgba(255,255,255,0.48)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Win Rate</div>
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.038, fontWeight: 800, letterSpacing: "-0.02em", background: `linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>89.3%</div>
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.0082, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>Last 90 days · verified</div>
        </GlassCard>
      </div>

      {/* Total Pips card */}
      <div
        style={{
          position: "absolute",
          right: WIDTH * 0.04,
          top: HEIGHT * 0.15,
          zIndex: 10,
          ...cardStyle(card2),
        }}
      >
        <GlassCard
          padding={`${HEIGHT * 0.022}px ${WIDTH * 0.025}px`}
          borderRadius={14}
          borderColor="rgba(212,175,55,0.32)"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(212,175,55,0.12)" }}
        >
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.009, fontWeight: 600, color: "rgba(255,255,255,0.48)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Total Pips 2025</div>
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.038, fontWeight: 800, letterSpacing: "-0.02em", background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>+12,840</div>
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.0082, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>Across all verified trades</div>
        </GlassCard>
      </div>

      {/* Members card */}
      <div
        style={{
          position: "absolute",
          right: WIDTH * 0.04,
          bottom: HEIGHT * 0.22,
          zIndex: 10,
          ...cardStyle(card3),
        }}
      >
        <GlassCard
          padding={`${HEIGHT * 0.022}px ${WIDTH * 0.025}px`}
          borderRadius={14}
          borderColor="rgba(212,175,55,0.22)"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.7)" }}
        >
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.009, fontWeight: 600, color: "rgba(255,255,255,0.48)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>VIP Members</div>
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.038, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>847+</div>
          <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.0082, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>Traders trading live</div>
        </GlassCard>
      </div>

      {/* ── Scene text lines ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: WIDTH * 0.06,
          paddingTop: HEIGHT * 0.05,
          gap: HEIGHT * 0.005,
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        {[
          { t: t1, text: "Professional analysis.", size: WIDTH * 0.028, weight: 300 },
          { t: t2, text: "Actionable signals.",     size: WIDTH * 0.028, weight: 300 },
          { t: t3, text: "Real results.",           size: WIDTH * 0.034, weight: 700 },
        ].map(({ t, text, size, weight }) => (
          <div
            key={text}
            style={{
              fontFamily: FONT,
              fontSize: size,
              fontWeight: weight,
              color: text === "Real results." ? GOLD_B : "rgba(255,255,255,0.82)",
              letterSpacing: "0.04em",
              opacity: t.op,
              transform: `translateY(${t.y}px)`,
              textShadow: "0 2px 16px rgba(0,0,0,0.95)",
              filter: text === "Real results." ? `drop-shadow(0 0 12px rgba(212,175,55,0.5))` : "none",
            }}
          >
            {text}
          </div>
        ))}
      </AbsoluteFill>

      {/* Lens flare in top-right */}
      {flareOp > 0.1 && (
        <div style={{ opacity: flareOp }}>
          <LensFlare x={0.82} y={0.18} intensity={0.55} size={WIDTH * 0.18} />
        </div>
      )}

      <Vignette strength={0.72} />
      <Particles count={60} speedMult={0.3} opacity={0.35} />
    </AbsoluteFill>
  );
};
