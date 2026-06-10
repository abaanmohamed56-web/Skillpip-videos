/**
 * SkillpipsTikTok — vertical composition
 * 1080 × 1920 · 30 fps · 40 s
 * Designed for TikTok, Instagram Reels, YouTube Shorts.
 *
 * 5 punchy scenes:
 *   S1  0–3 s   Hook  — logo flash + "SkillPips" over gold particles
 *   S2  3–12 s  Float — website panel floating in dark 3-D space
 *   S3 12–24 s  Stats — giant animated counters + gold streaks
 *   S4 24–34 s  Feed  — live signals + community proof
 *   S5 34–40 s  CTA   — logo convergence + "Join Today" button
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import {
  TK_WIDTH as W, TK_HEIGHT as H, TK_DURATION,
  FPS, GOLD, GOLD_B, GOLD_LIGHT, GOLD_DARK, BG, FONT, SITE,
} from "./constants";
import { WebsitePanel }  from "./components/WebsitePanel";
import { StatCounter }   from "./components/StatCounter";
import { GlassCard }     from "./components/GlassCard";
import { Particles }     from "./components/Particles";
import { Background }    from "./components/Background";
import { GoldStreaks }   from "./effects/GoldStreaks";
import { LensFlare }     from "./effects/LensFlare";
import { Vignette }      from "./effects/Vignette";
import { CinematicBars } from "./effects/CinematicBars";

// ── helpers ───────────────────────────────────────────────────────────────────

const FADE = 18;

const Faded: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, FADE, dur - FADE, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

function lcg(s: number) { return (((s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// ── Scene 1 — Hook (0–3 s) ────────────────────────────────────────────────────

const SceneTK1: React.FC = () => {
  const frame = useCurrentFrame();

  const logoSp   = spring({ frame: Math.max(0, frame - 8),  fps: FPS, config: { stiffness: 65, damping: 14 } });
  const wordOp   = interpolate(frame, [18, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow     = 0.65 + 0.35 * Math.sin(frame * 0.1);
  const line1Op  = interpolate(frame, [38, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y   = interpolate(frame, [38, 68], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Op  = interpolate(frame, [52, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barW     = interpolate(frame, [38, 80], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(212,175,55,${0.1 * glow}) 0%, rgba(109,16,36,${0.14 * glow}) 45%, transparent 70%)`, pointerEvents: "none" }} />
      <Particles count={260} speedMult={0.55} opacity={0.8} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: H * 0.018 }}>
        {/* Diamond */}
        <div style={{ width: W * 0.065, height: W * 0.065, background: `linear-gradient(135deg,${GOLD},${GOLD_B},${GOLD})`, transform: `rotate(45deg) scale(${0.4 + logoSp * 0.6})`, opacity: logoSp, boxShadow: `0 0 ${W * 0.1 * glow}px rgba(212,175,55,${0.85 * glow})`, marginBottom: H * 0.01 }} />
        {/* SKILLPIPS */}
        <div style={{ fontFamily: FONT, fontSize: W * 0.11, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", background: `linear-gradient(135deg,${GOLD_LIGHT},${GOLD_B},${GOLD},${GOLD_DARK},${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: `drop-shadow(0 0 ${W * 0.08 * glow}px rgba(212,175,55,${0.9 * glow}))`, opacity: wordOp, transform: `scale(${0.55 + logoSp * 0.45})` }}>
          SKILLPIPS
        </div>
        {/* Tagline */}
        <div style={{ fontFamily: FONT, fontSize: W * 0.028, fontWeight: 300, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(212,175,55,0.65)", opacity: wordOp }}>
          Premium Trading Signals
        </div>
        {/* Divider */}
        <div style={{ width: W * 0.45 * barW, height: 1, background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, opacity: 0.7, margin: `${H * 0.008}px 0` }} />
        {/* Lines */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: H * 0.006 }}>
          <div style={{ fontFamily: FONT, fontSize: W * 0.052, fontWeight: 200, letterSpacing: "0.48em", textTransform: "uppercase", color: "#fff", opacity: line1Op, transform: `translateY(${line1Y}px)` }}>
            Trading Excellence
          </div>
          <div style={{ fontFamily: FONT, fontSize: W * 0.072, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", background: `linear-gradient(135deg,${GOLD},${GOLD_B},${GOLD_LIGHT},${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: `drop-shadow(0 0 ${W * 0.04}px rgba(212,175,55,0.6))`, opacity: line2Op }}>
            Redefined
          </div>
        </div>
      </AbsoluteFill>
      <Vignette strength={0.8} />
    </AbsoluteFill>
  );
};

// ── Scene 2 — Website Float (3–12 s) ─────────────────────────────────────────

const PANEL_W = W * 0.92;
const PANEL_H = PANEL_W * 0.694;

const SceneTK2: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 270;

  const panelOp = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelSc = spring({ frame, fps: FPS, config: { stiffness: 42, damping: 16 } });
  const scale   = 0.7 + panelSc * 0.14;

  const rotY    = interpolate(frame, [0, dur], [22, -6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotX    = interpolate(frame, [0, dur], [4, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob     = Math.sin(frame * 0.014) * 0.4;

  const reflOp  = interpolate(frame, [18, 60], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* highlight rings */
  const h1 = interpolate(frame, [50, 80],   [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h2 = interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const textOp = interpolate(frame, [140, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background gridOpacity={0.02} goldGlow glowIntensity={0.07} />
      <Particles count={130} speedMult={0.4} opacity={0.55} />

      {/* 3-D stage — panel centred vertically */}
      <AbsoluteFill style={{ perspective: `${W * 2.2}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: panelOp, transform: `rotateY(${rotY}deg) rotateX(${rotX + bob}deg) scale(${scale})`, transformStyle: "preserve-3d", position: "relative" }}>
          <WebsitePanel width={PANEL_W} scrollY={0} showSections={["hero"]} clipHeight={PANEL_H} />
          {/* Reflection */}
          <div style={{ position: "absolute", top: PANEL_H + 2, left: 0, width: PANEL_W, height: PANEL_H * 0.28, overflow: "hidden", opacity: reflOp, transform: "scaleY(-1)", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 85%)", maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 85%)" }}>
            <WebsitePanel width={PANEL_W} scrollY={0} showSections={["hero"]} clipHeight={PANEL_H} />
          </div>
          {/* Ground glow */}
          <div style={{ position: "absolute", top: PANEL_H + PANEL_H * 0.28 + 4, left: PANEL_W * 0.12, width: PANEL_W * 0.76, height: PANEL_W * 0.03, background: "radial-gradient(ellipse, rgba(212,175,55,0.2) 0%, transparent 70%)", filter: "blur(14px)" }} />
        </div>
      </AbsoluteFill>

      {/* Highlight rings (positioned for signals widget + CTA) */}
      <div style={{ position: "absolute", right: W * 0.04, top: "43%", width: W * 0.32, height: H * 0.12, border: `1px solid rgba(212,175,55,${0.6 * h1})`, borderRadius: 10, boxShadow: `0 0 16px rgba(212,175,55,${0.2 * h1})`, opacity: h1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: W * 0.08, top: "56%", width: W * 0.36, height: H * 0.045, border: `1px solid rgba(212,175,55,${0.5 * h2})`, borderRadius: 5, boxShadow: `0 0 12px rgba(212,175,55,${0.18 * h2})`, opacity: h2, pointerEvents: "none" }} />

      {/* Bottom text */}
      <div style={{ position: "absolute", bottom: H * 0.1, left: 0, right: 0, textAlign: "center", opacity: textOp }}>
        <div style={{ fontFamily: FONT, fontSize: W * 0.048, fontWeight: 300, letterSpacing: "0.1em", color: "rgba(255,255,255,0.88)", textShadow: "0 2px 20px rgba(0,0,0,0.95)" }}>
          Built for serious traders.
        </div>
      </div>

      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};

// ── Scene 3 — Stats (12–24 s) ─────────────────────────────────────────────────

const SceneTK3: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 360;

  const sp = (d: number) => spring({ frame: Math.max(0, frame - d), fps: FPS, config: { stiffness: 50, damping: 14 } });

  const cProg = (d: number) => interpolate(frame, [d, d + 160], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 2.5),
  });

  const headerOp = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeSp  = sp(20);
  const divOp    = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tag1     = sp(220);
  const tag2     = sp(250);
  const tag3     = sp(280);

  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background gridOpacity={0.028} goldGlow glowIntensity={0.15} />
      <Particles count={220} speedMult={0.68} opacity={0.75} />
      <GoldStreaks count={20} intensity={0.8} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: H * 0.028 }}>
        {/* Section label */}
        <div style={{ fontFamily: FONT, fontSize: W * 0.028, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, opacity: headerOp }}>
          Track Record
        </div>

        {/* Live badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: W * 0.018, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 40, padding: `${H * 0.014}px ${W * 0.04}px`, opacity: badgeSp, transform: `scale(${0.8 + badgeSp * 0.2})` }}>
          <div style={{ width: W * 0.022, height: W * 0.022, borderRadius: "50%", background: "#4ade80", boxShadow: `0 0 ${W * 0.015 * pulse}px #4ade80`, opacity: 0.7 + 0.3 * pulse }} />
          <span style={{ fontFamily: FONT, fontSize: W * 0.034, fontWeight: 600, color: GOLD, letterSpacing: "0.08em" }}>{SITE.badge}</span>
        </div>

        {/* Divider */}
        <div style={{ width: W * 0.6 * divOp, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.7 }} />

        {/* Three counters */}
        <div style={{ display: "flex", justifyContent: "center", gap: W * 0.04, width: "100%", padding: `0 ${W * 0.06}px`, boxSizing: "border-box" }}>
          {[
            { val: SITE.stats.winRate.value,  lbl: SITE.stats.winRate.label,  delay: 0   },
            { val: SITE.stats.pips.value,     lbl: SITE.stats.pips.label,     delay: 20  },
            { val: SITE.stats.members.value,  lbl: SITE.stats.members.label,  delay: 40  },
          ].map(({ val, lbl, delay }, i) => (
            <div key={lbl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {i > 0 && <div style={{ position: "absolute" }} />}
              <StatCounter value={val} label={lbl} progress={cProg(delay)} size="md" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: W * 0.6 * divOp, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.5 }} />

        {/* Feature tags */}
        {[
          { sp: tag1, icon: "▲", text: "+347 pips this week",   col: "#4ade80" },
          { sp: tag2, icon: "⚡", text: "Instant Signal Alerts",  col: "rgba(255,255,255,0.82)" },
          { sp: tag3, icon: "🎯", text: "89.3% Win Rate · Verified", col: GOLD },
        ].map(({ sp: p, icon, text, col }) => (
          <div key={text} style={{ opacity: p, transform: `scale(${0.75 + p * 0.25}) translateY(${(1 - p) * 16}px)` }}>
            <GlassCard padding={`${H * 0.018}px ${W * 0.055}px`} borderRadius={12} borderColor="rgba(212,175,55,0.2)">
              <div style={{ fontFamily: FONT, fontSize: W * 0.038, fontWeight: 500, color: col, display: "flex", alignItems: "center", gap: W * 0.016, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: W * 0.04 }}>{icon}</span>{text}
              </div>
            </GlassCard>
          </div>
        ))}

        {/* Scene text */}
        <div style={{ fontFamily: FONT, fontSize: W * 0.046, fontWeight: 300, letterSpacing: "0.08em", color: "rgba(255,255,255,0.82)", textAlign: "center", opacity: interpolate(frame, [100, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
          Join a growing trading community.
        </div>
      </AbsoluteFill>
      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};

// ── Scene 4 — Signals Feed (24–34 s) ─────────────────────────────────────────

const SceneTK4: React.FC = () => {
  const frame = useCurrentFrame();

  const sp = (d: number) => spring({ frame: Math.max(0, frame - d), fps: FPS, config: { stiffness: 55, damping: 14 } });
  const headSp = sp(8);
  const pulse  = 0.5 + 0.5 * Math.sin(frame * 0.15);
  const CARD_W = W * 0.88;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background gridOpacity={0.022} goldGlow glowIntensity={0.1} />
      <Particles count={150} speedMult={0.5} opacity={0.6} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: H * 0.025 }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: H * 0.01, opacity: headSp, transform: `scale(${0.8 + headSp * 0.2})` }}>
          <div style={{ fontFamily: FONT, fontSize: W * 0.028, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>Live Signals</div>
          <div style={{ fontFamily: FONT, fontSize: W * 0.08, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Real Results.</div>
        </div>

        {/* Signals card */}
        <div style={{ opacity: sp(30), transform: `scale(${0.8 + sp(30) * 0.2}) translateY(${(1 - sp(30)) * 24}px)` }}>
          <GlassCard
            padding={`${H * 0.022}px ${W * 0.045}px`}
            borderRadius={18}
            borderColor="rgba(212,175,55,0.26)"
            style={{ width: CARD_W, boxSizing: "border-box", boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.08)" }}
          >
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: W * 0.02, marginBottom: H * 0.018, paddingBottom: H * 0.014, borderBottom: "1px solid rgba(212,175,55,0.14)" }}>
              <div style={{ width: W * 0.022, height: W * 0.022, borderRadius: "50%", background: "#4ade80", boxShadow: `0 0 ${W * 0.015 * pulse}px #4ade80`, opacity: 0.7 + 0.3 * pulse }} />
              <div style={{ fontFamily: FONT, fontSize: W * 0.042, fontWeight: 700, color: "#fff" }}>Live Signals</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontSize: W * 0.028, color: "rgba(255,255,255,0.38)" }}>SkillPips</div>
            </div>
            {SITE.signals.map((sig, i) => {
              const rowSp = sp(55 + i * 22);
              const isBuy = sig.dir === "BUY";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${H * 0.012}px 0`, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none", opacity: rowSp, transform: `translateX(${(1 - rowSp) * 20}px)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: W * 0.025 }}>
                    <div style={{ fontFamily: FONT, fontSize: W * 0.032, fontWeight: 700, color: isBuy ? "#4ade80" : "#f87171", background: isBuy ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", border: `1px solid ${isBuy ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, padding: `${H * 0.004}px ${W * 0.018}px`, borderRadius: 6, minWidth: W * 0.1, textAlign: "center" }}>{sig.dir}</div>
                    <div style={{ fontFamily: FONT, fontSize: W * 0.042, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>{sig.pair}</div>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: W * 0.038, fontWeight: 600, color: sig.active ? GOLD : "#4ade80", opacity: sig.active ? 0.7 + 0.3 * pulse : 1 }}>{sig.result}</div>
                </div>
              );
            })}
          </GlassCard>
        </div>

        {/* Testimonial */}
        <div style={{ opacity: sp(160), transform: `translateY(${(1 - sp(160)) * 20}px)`, maxWidth: CARD_W, textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontSize: W * 0.036, fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: H * 0.01 }}>
            "Up +340 pips this month alone."
          </div>
          <div style={{ fontFamily: FONT, fontSize: W * 0.032, fontWeight: 600, color: GOLD }}>Ahmed K. · <span style={{ color: "#4ade80", fontFamily: "'Courier New',monospace" }}>+340 pips</span></div>
        </div>

        {/* Scene text */}
        <div style={{ fontFamily: FONT, fontSize: W * 0.044, fontWeight: 300, letterSpacing: "0.08em", color: "rgba(255,255,255,0.82)", textAlign: "center", opacity: interpolate(frame, [190, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
          Designed for modern traders.
        </div>
      </AbsoluteFill>
      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};

// ── Scene 5 — Final CTA (34–40 s) ────────────────────────────────────────────

const SwirlingRing: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: 70 }, (_, i) => {
      const angle  = (i / 70) * Math.PI * 2 + frame * (0.012 + lcg(i * 7) * 0.008);
      const r      = W * 0.28 * (0.7 + 0.3 * Math.sin(frame * 0.025 + i * 0.5));
      const x = W / 2 + Math.cos(angle) * r;
      const y = H / 2 + Math.sin(angle) * r * 0.7;
      const size  = 1 + lcg(i * 13) * 3.5;
      const alpha = 0.4 + 0.6 * lcg(i * 11) * (0.7 + 0.3 * Math.sin(frame * 0.04 + i));
      return (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: lcg(i * 17) > 0.3 ? GOLD_B : "#fff", opacity: alpha * Math.min(1, frame / 60), transform: "translate(-50%,-50%)", boxShadow: `0 0 ${size * 4}px ${lcg(i * 17) > 0.3 ? "rgba(255,215,0,0.9)" : "rgba(255,255,255,0.7)"}` }} />
      );
    })}
  </div>
);

const SceneTK5: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 180;

  const sp  = (d: number) => spring({ frame: Math.max(0, frame - d), fps: FPS, config: { stiffness: 55, damping: 13 } });
  const energy     = Math.min(1, frame / 120);
  const glow       = 0.65 + 0.35 * Math.sin(frame * 0.07);
  const logoSp     = sp(12);
  const line1      = sp(48);
  const line2      = sp(70);
  const btnSp      = sp(95);
  const flareOp    = interpolate(frame, [55, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shine      = (frame * 1.4) % 100 / 100;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 65% 55% at 50% 50%, rgba(212,175,55,${0.14 * energy * glow}) 0%, rgba(109,16,36,${0.1 * energy}) 45%, transparent 70%)`, pointerEvents: "none" }} />
      <Particles count={280} speedMult={0.75} opacity={0.78} />
      <GoldStreaks count={28} intensity={0.9 * energy} />
      <SwirlingRing frame={frame} />
      {flareOp > 0.05 && <div style={{ opacity: flareOp * 0.85 }}><LensFlare x={0.5} y={0.5} intensity={0.85 * flareOp} size={W * 0.55} /></div>}

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: H * 0.022, zIndex: 10 }}>
        {/* Diamond */}
        <div style={{ width: W * 0.06, height: W * 0.06, background: `linear-gradient(135deg,${GOLD},${GOLD_B},${GOLD})`, transform: `rotate(45deg) scale(${0.4 + logoSp * 0.6})`, opacity: logoSp, boxShadow: `0 0 ${W * 0.1 * energy * glow}px rgba(212,175,55,${0.9 * energy * glow})`, marginBottom: H * 0.01 }} />

        {/* SKILLPIPS */}
        <div style={{ fontFamily: FONT, fontSize: W * 0.105, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", background: `linear-gradient(135deg,${GOLD_LIGHT},${GOLD_B},${GOLD},${GOLD_DARK},${GOLD_B})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: `drop-shadow(0 0 ${W * 0.08 * energy * glow}px rgba(212,175,55,${0.95 * energy * glow}))`, opacity: logoSp, transform: `scale(${0.55 + logoSp * 0.45})`, lineHeight: 1 }}>
          SKILLPIPS
        </div>

        <div style={{ width: W * 0.42 * line1, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.8 }} />

        {/* Trade Smarter */}
        <div style={{ fontFamily: FONT, fontSize: W * 0.072, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", opacity: line1, transform: `scale(${0.72 + line1 * 0.28}) translateY(${(1 - line1) * 18}px)`, filter: `drop-shadow(0 0 ${W * 0.03}px rgba(255,255,255,${0.2 * line1}))` }}>
          Trade Smarter.
        </div>

        <div style={{ fontFamily: FONT, fontSize: W * 0.03, fontWeight: 300, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(212,175,55,0.72)", opacity: line2, transform: `translateY(${(1 - line2) * 12}px)` }}>
          Signals · Analysis · Community
        </div>

        {/* JOIN TODAY button */}
        <div style={{ position: "relative", overflow: "hidden", fontFamily: FONT, fontSize: W * 0.048, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#000", background: `linear-gradient(135deg,${GOLD},${GOLD_B},${GOLD_LIGHT},${GOLD})`, padding: `${H * 0.024}px ${W * 0.14}px`, borderRadius: H * 0.1, opacity: btnSp, transform: `scale(${0.72 + btnSp * 0.28}) translateY(${(1 - btnSp) * 18}px)`, boxShadow: `0 0 ${W * 0.08 * energy * glow}px rgba(212,175,55,0.65), 0 14px 40px rgba(0,0,0,0.65)`, marginTop: H * 0.01 }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine * 200 - 50}%`, width: "35%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)", transform: "skewX(-20deg)", pointerEvents: "none" }} />
          Join Today
        </div>

        <div style={{ fontFamily: FONT, fontSize: W * 0.028, color: "rgba(255,255,255,0.3)", opacity: btnSp, letterSpacing: "0.06em", marginTop: -H * 0.01 }}>
          skillpips.vercel.app
        </div>
      </AbsoluteFill>
      <Vignette strength={0.7} />
    </AbsoluteFill>
  );
};

// ── TikTok-specific CinematicBars (slimmer for 9:16) ─────────────────────────

const TkBars: React.FC = () => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [0, 38], [0, H * 0.038], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000", zIndex: 100 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000", zIndex: 100 }} />
    </>
  );
};

// ── Scene timings ─────────────────────────────────────────────────────────────

const TK_SCENES = {
  S1: { from: 0,    dur: 90  }, //  0– 3 s  Hook
  S2: { from: 90,   dur: 270 }, //  3–12 s  Website float
  S3: { from: 360,  dur: 360 }, // 12–24 s  Stats
  S4: { from: 720,  dur: 300 }, // 24–34 s  Signals feed
  S5: { from: 1020, dur: 180 }, // 34–40 s  CTA
} as const;

// ── Main composition ──────────────────────────────────────────────────────────

export const SkillpipsTikTok: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={TK_SCENES.S1.from} durationInFrames={TK_SCENES.S1.dur + FADE}>
      <Faded dur={TK_SCENES.S1.dur}><SceneTK1 /></Faded>
    </Sequence>
    <Sequence from={TK_SCENES.S2.from} durationInFrames={TK_SCENES.S2.dur + FADE}>
      <Faded dur={TK_SCENES.S2.dur}><SceneTK2 /></Faded>
    </Sequence>
    <Sequence from={TK_SCENES.S3.from} durationInFrames={TK_SCENES.S3.dur + FADE}>
      <Faded dur={TK_SCENES.S3.dur}><SceneTK3 /></Faded>
    </Sequence>
    <Sequence from={TK_SCENES.S4.from} durationInFrames={TK_SCENES.S4.dur + FADE}>
      <Faded dur={TK_SCENES.S4.dur}><SceneTK4 /></Faded>
    </Sequence>
    <Sequence from={TK_SCENES.S5.from} durationInFrames={TK_SCENES.S5.dur}>
      <SceneTK5 />
    </Sequence>
    <TkBars />
  </AbsoluteFill>
);
