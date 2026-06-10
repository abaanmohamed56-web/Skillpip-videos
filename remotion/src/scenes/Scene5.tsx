/**
 * Scene 5 (30–40 s) — Community Growth / Stats
 * Cinematic stat counters animate up from zero.
 * Gold light streaks fly across the frame.
 * Floating trading chart visualisations.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { FONT, FPS, GOLD, GOLD_B, GOLD_LIGHT, WIDTH, HEIGHT, SITE } from "../constants";
import { Background } from "../components/Background";
import { Particles } from "../components/Particles";
import { StatCounter } from "../components/StatCounter";
import { GlassCard } from "../components/GlassCard";
import { CandleChart } from "../components/CandleChart";
import { GoldStreaks } from "../effects/GoldStreaks";
import { Vignette } from "../effects/Vignette";

// Mini pulsing dot
const LiveDot: React.FC<{ frame: number; size?: number }> = ({ frame, size = 10 }) => {
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18);
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: "50%",
        background: "#4ade80",
        boxShadow: `0 0 ${size * 1.8 * pulse}px #4ade80, 0 0 ${size * 3 * pulse}px rgba(74,222,128,0.4)`,
        flexShrink: 0,
      }}
    />
  );
};

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 300;

  /* ── Counter progress values ── */
  const counterStart = 30;
  const cProg = (delay: number) =>
    interpolate(
      frame,
      [counterStart + delay, counterStart + delay + 150],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: (t) => 1 - Math.pow(1 - t, 2.5),
      }
    );

  /* ── Spring reveals ── */
  const sp = (delay: number) =>
    spring({ frame: Math.max(0, frame - delay), fps: FPS, config: { stiffness: 50, damping: 14 } });

  const headerOp = interpolate(frame, [0, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headerY  = interpolate(frame, [0, 35], [20, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const badge1 = sp(200);
  const badge2 = sp(230);
  const badge3 = sp(260);

  /* ── Background chart alpha ramps up ── */
  const chartAlpha = interpolate(frame, [0, 100], [0, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Text ── */
  const textOp = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY  = interpolate(frame, [80, 120], [18, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* ── Testimonial card ── */
  const testOp = sp(180);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background gridOpacity={0.03} goldGlow glowIntensity={0.14} />

      {/* Background candle charts */}
      <CandleChart x={0} y={HEIGHT * 0.0}  width={WIDTH} height={HEIGHT * 0.45} alpha={chartAlpha} speed={0.5} seed={7} />
      <CandleChart x={0} y={HEIGHT * 0.55} width={WIDTH} height={HEIGHT * 0.45} alpha={chartAlpha * 0.6} speed={0.38} seed={42} />

      <Particles count={180} speedMult={0.65} opacity={0.72} />
      <GoldStreaks count={18} intensity={0.72} />

      {/* ── Main content ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: HEIGHT * 0.038,
        }}
      >
        {/* Section heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: HEIGHT * 0.008,
            opacity: headerOp,
            transform: `translateY(${headerY}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: WIDTH * 0.01,
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: 40,
              padding: `${HEIGHT * 0.008}px ${WIDTH * 0.018}px`,
            }}
          >
            <LiveDot frame={frame} size={9} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: WIDTH * 0.01,
                fontWeight: 600,
                color: GOLD,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {SITE.badge}
            </span>
          </div>
        </div>

        {/* ── 3 giant stat counters ── */}
        <div
          style={{
            display: "flex",
            gap: WIDTH * 0.09,
            alignItems: "center",
          }}
        >
          {/* Dividers */}
          <div style={{ display: "flex", alignItems: "center", gap: WIDTH * 0.09 }}>
            <StatCounter
              value={SITE.stats.winRate.value}
              label={SITE.stats.winRate.label}
              progress={cProg(0)}
              size="lg"
            />
            <div style={{ width: 1, height: HEIGHT * 0.12, background: "rgba(255,255,255,0.1)" }} />
            <StatCounter
              value={SITE.stats.pips.value}
              label={SITE.stats.pips.label}
              progress={cProg(25)}
              size="lg"
            />
            <div style={{ width: 1, height: HEIGHT * 0.12, background: "rgba(255,255,255,0.1)" }} />
            <StatCounter
              value={SITE.stats.members.value}
              label={SITE.stats.members.label}
              progress={cProg(50)}
              size="lg"
            />
          </div>
        </div>

        {/* ── Floating badge cards ── */}
        <div
          style={{
            display: "flex",
            gap: WIDTH * 0.018,
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          {[
            { p: badge1, icon: "▲", text: "+347 pips this week",  color: "#4ade80"  },
            { p: badge2, icon: "📊", text: "Daily SBR Setups",     color: "rgba(255,255,255,0.82)" },
            { p: badge3, icon: "🔔", text: "Instant Signal Alerts",color: "rgba(255,255,255,0.82)" },
          ].map(({ p, icon, text, color }) => (
            <div
              key={text}
              style={{
                opacity: p,
                transform: `scale(${0.72 + p * 0.28}) translateY(${(1 - p) * 18}px)`,
              }}
            >
              <GlassCard
                padding={`${HEIGHT * 0.016}px ${WIDTH * 0.02}px`}
                borderRadius={10}
                borderColor="rgba(212,175,55,0.18)"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: WIDTH * 0.008,
                    fontFamily: FONT,
                    fontSize: WIDTH * 0.012,
                    fontWeight: 500,
                    color,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: WIDTH * 0.014 }}>{icon}</span>
                  {text}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div
          style={{
            opacity: testOp,
            transform: `scale(${0.88 + testOp * 0.12}) translateY(${(1 - testOp) * 22}px)`,
            maxWidth: WIDTH * 0.44,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.014,
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(255,255,255,0.62)",
              lineHeight: 1.65,
              marginBottom: HEIGHT * 0.01,
            }}
          >
            "SkillPips has completely transformed how I trade. The signals are accurate,
            the analysis is clear, and the community is incredibly supportive."
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.011,
              fontWeight: 600,
              color: GOLD,
              letterSpacing: "0.06em",
            }}
          >
            Ahmed K. · <span style={{ color: "#4ade80", fontFamily: "'Courier New', monospace", fontSize: WIDTH * 0.012 }}>+340 pips this month</span>
          </div>
        </div>

        {/* Scene text */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.024,
            fontWeight: 300,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.82)",
            textAlign: "center",
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            textShadow: "0 2px 20px rgba(0,0,0,0.9)",
          }}
        >
          Join a growing trading community.
        </div>
      </AbsoluteFill>

      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};
