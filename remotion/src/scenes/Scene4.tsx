/**
 * Scene 4 (20–30 s) — Website Scroll Sequence
 * The full website scrolls slowly past, revealing each section.
 * Parallax depth layers add cinematic dimension.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT, GOLD, GOLD_B, WIDTH, HEIGHT } from "../constants";
import { WebsitePanel } from "../components/WebsitePanel";
import { Particles } from "../components/Particles";
import { Vignette } from "../effects/Vignette";
import { GoldStreaks } from "../effects/GoldStreaks";

const PANEL_W = WIDTH * 0.78;
const PANEL_H = PANEL_W * 0.694;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 300;

  /* ── Camera slow drift ── */
  const camX = Math.sin(frame * 0.008) * WIDTH * 0.008;
  const camY = Math.cos(frame * 0.006) * HEIGHT * 0.006;

  /* ── Scroll progress ── */
  const scrollProgress = interpolate(
    frame,
    [20, dur - 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // ease-in-out
    }
  );

  /* ── Panel reveal ── */
  const panelOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelSc = interpolate(frame, [0, 25], [0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Section label overlays ── */
  // Show labels at quarter points of the scroll
  const sectionLabels = [
    { from: 0,   to: 0.22, label: "Hero",        sub: "Premium Trading Platform" },
    { from: 0.22,to: 0.45, label: "About",       sub: "Built by traders, for traders" },
    { from: 0.45,to: 0.72, label: "Performance", sub: "Real signals. Real results." },
    { from: 0.72,to: 1.0,  label: "Pricing",     sub: "Simple, honest pricing" },
  ];
  const currentSection = sectionLabels.find(
    (s) => scrollProgress >= s.from && scrollProgress < s.to
  ) ?? sectionLabels[0];

  const labelOp = interpolate(
    scrollProgress % 0.25,
    [0, 0.04, 0.21, 0.25],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  /* ── Depth blur layers ── */
  const bg2X = camX * -1.8;
  const bg2Y = camY * -1.8;

  /* ── Text ── */
  const text1Op = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const text2Op = interpolate(frame, [145, 185], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Far background particles (parallax — slower) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${bg2X}px, ${bg2Y}px)`,
        }}
      >
        <Particles count={90} speedMult={0.28} opacity={0.38} />
      </div>

      {/* Gold light streaks */}
      <GoldStreaks count={8} intensity={0.55} />

      {/* ── Website panel ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${camX}px, ${camY}px)`,
        }}
      >
        <div
          style={{
            opacity: panelOp,
            transform: `scale(${panelSc})`,
            boxShadow: "0 40px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.1)",
            borderRadius: PANEL_W * 0.008,
          }}
        >
          <WebsitePanel
            width={PANEL_W}
            scrollY={scrollProgress}
            showSections={["hero", "about", "performance", "pricing"]}
            clipHeight={PANEL_H}
          />
        </div>
      </AbsoluteFill>

      {/* ── Section progress indicator ── */}
      <div
        style={{
          position: "absolute",
          right: WIDTH * 0.025,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 20,
        }}
      >
        {sectionLabels.map((s) => {
          const isActive = scrollProgress >= s.from && scrollProgress < s.to;
          return (
            <div
              key={s.label}
              style={{
                width: isActive ? 28 : 4,
                height: 4,
                borderRadius: 2,
                background: isActive ? GOLD : "rgba(255,255,255,0.2)",
                transition: "all 0.3s",
                boxShadow: isActive ? `0 0 8px ${GOLD}` : "none",
              }}
            />
          );
        })}
      </div>

      {/* ── Current section label ── */}
      <div
        style={{
          position: "absolute",
          right: WIDTH * 0.045,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
          opacity: 0.7 * labelOp,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.009,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: GOLD,
          }}
        >
          {currentSection.label}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.0075,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.05em",
            marginTop: 3,
          }}
        >
          {currentSection.sub}
        </div>
      </div>

      {/* ── Cinematic text overlays ── */}
      <div
        style={{
          position: "absolute",
          bottom: HEIGHT * 0.14,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.025,
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 2px 20px rgba(0,0,0,0.95)",
            opacity: text1Op * (frame < 145 ? 1 : Math.max(0, 1 - (frame - 145) / 30)),
          }}
        >
          Everything you need.
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.025,
            fontWeight: 700,
            letterSpacing: "0.08em",
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 12px rgba(212,175,55,0.4))",
            opacity: text2Op,
            marginTop: HEIGHT * 0.008,
          }}
        >
          One powerful platform.
        </div>
      </div>

      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};
