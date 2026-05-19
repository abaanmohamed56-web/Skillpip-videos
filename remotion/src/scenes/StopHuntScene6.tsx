import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT, RED } from "../constants";
import { Particles } from "../components/Particles";
import { CandleChart } from "../components/CandleChart";

// Volumetric light rays rotating around center
const VolumetricBeams: React.FC<{ frame: number; alpha: number }> = ({ frame, alpha }) => {
  const beams = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + frame * 0.0015;
    const cx = WIDTH * 0.5, cy = HEIGHT * 0.36;
    const len = HEIGHT * 0.58;
    return {
      x2: cx + Math.cos(angle) * len,
      y2: cy + Math.sin(angle) * len,
      a: alpha * (0.55 + 0.45 * Math.sin(frame * 0.025 + i)),
      sw: 20 + 8 * Math.sin(frame * 0.018 + i * 0.8),
      id: `sh6-vb-${i}`,
    };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {beams.map((b) => (
            <linearGradient key={b.id} id={b.id}
              x1={WIDTH * 0.5} y1={HEIGHT * 0.36}
              x2={b.x2} y2={b.y2}
              gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={`rgba(212,175,55,${b.a})`} />
              <stop offset="100%" stopColor="rgba(212,175,55,0)" />
            </linearGradient>
          ))}
        </defs>
        {beams.map((b) => (
          <line key={b.id}
            x1={WIDTH * 0.5} y1={HEIGHT * 0.36}
            x2={b.x2} y2={b.y2}
            stroke={`url(#${b.id})`}
            strokeWidth={b.sw}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// Animated comment bubble bouncing up
const CommentBubble: React.FC<{ delay: number; x: number; frame: number }> = ({ delay, x, frame }) => {
  const localF = frame - delay;
  if (localF < 0) return null;
  const op = interpolate(localF, [0, 20, 60, 80], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y  = interpolate(localF, [0, 80], [0, -HEIGHT * 0.10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute",
      left: x,
      bottom: HEIGHT * 0.22,
      transform: `translateY(${y}px)`,
      opacity: op,
      fontSize: WIDTH * 0.06,
    }}>
      💬
    </div>
  );
};

export const StopHuntScene6: React.FC = () => {
  const frame = useCurrentFrame();

  const beamProg = Math.min(frame / 240, 1);
  const glowPulse = 0.038 + 0.016 * Math.sin(frame * 0.04);

  const s = (start: number, dur = 60) => ({
    op: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ty: interpolate(frame, [start, start + dur], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    sc: interpolate(frame, [start, start + dur], [0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });

  const q1    = s(50);
  const q2    = s(110);
  const q3    = s(175);
  const cta1  = s(310);
  const cta2  = s(390);
  const brand = s(470);
  const link  = s(510);

  return (
    <AbsoluteFill style={{ background: "#020204" }}>
      {/* Background candlestick chart (very dim) */}
      <CandleChart x={0} y={HEIGHT * 0.06} width={WIDTH} height={HEIGHT * 0.36} alpha={0.04} speed={0.55} seed={7} />

      {/* Volumetric beams */}
      <VolumetricBeams frame={frame} alpha={beamProg * 0.9} />

      {/* Gold ambient glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 100% 42% at 50% 58%, rgba(212,175,55,${glowPulse * beamProg}) 0%, transparent 68%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }} />

      <Particles count={150} speedMult={0.65} opacity={0.7} />

      {/* ── Question section ── */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.09,
        left: WIDTH * 0.06,
        right: WIDTH * 0.06,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: HEIGHT * 0.010,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.040,
          fontWeight: 200,
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.48)",
          textTransform: "uppercase",
          textAlign: "center",
          opacity: q1.op,
          transform: `translateY(${q1.ty}px)`,
        }}>
          Drop a comment below if
        </div>

        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.066,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          background: `linear-gradient(135deg, ${RED} 0%, #ff8a80 50%, ${RED} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${WIDTH * 0.04}px rgba(239,68,68,0.65))`,
          letterSpacing: "0.03em",
          opacity: q2.op,
          transform: `scale(${q2.sc})`,
        }}>
          YOU'VE BEEN{"\n"}STOP HUNTED
        </div>

        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.040,
          fontWeight: 300,
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          letterSpacing: "0.08em",
          opacity: q3.op,
          transform: `translateY(${q3.ty}px)`,
        }}>
          this week 👇
        </div>
      </div>

      {/* Floating comment bubbles */}
      {[220, 270, 320, 370, 420].map((delay, i) => (
        <CommentBubble key={i} delay={delay} x={WIDTH * (0.12 + i * 0.175)} frame={frame} />
      ))}

      {/* "I already know the answer" */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.41,
        left: WIDTH * 0.07,
        right: WIDTH * 0.07,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [290, 340], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.034,
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.42)",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}>
          "I already know the answer."
        </div>
      </div>

      {/* ── CTA divider line ── */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.48,
        left: WIDTH * 0.12,
        right: WIDTH * 0.12,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)`,
        opacity: cta1.op,
      }} />

      {/* ── Follow CTA ── */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.505,
        left: WIDTH * 0.06,
        right: WIDTH * 0.06,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: HEIGHT * 0.014,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.036,
          fontWeight: 300,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.08em",
          textAlign: "center",
          opacity: cta1.op,
          transform: `translateY(${cta1.ty}px)`,
        }}>
          Follow for more
        </div>

        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.058,
          fontWeight: 900,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textAlign: "center",
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${WIDTH * 0.04}px rgba(212,175,55,0.6))`,
          opacity: cta2.op,
          transform: `scale(${cta2.sc})`,
        }}>
          GOLD SETUPS DAILY
        </div>

        {/* VIP pill */}
        <div style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 100%)`,
          borderRadius: WIDTH * 0.1,
          padding: `${WIDTH * 0.024}px ${WIDTH * 0.070}px`,
          fontFamily: FONT,
          fontSize: WIDTH * 0.038,
          fontWeight: 900,
          color: "#000",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          boxShadow: `0 0 ${WIDTH * 0.08}px rgba(212,175,55,0.55), 0 8px 30px rgba(0,0,0,0.5)`,
          opacity: link.op,
          transform: `scale(${link.sc})`,
        }}>
          VIP SIGNALS
        </div>

        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.032,
          fontWeight: 400,
          color: `rgba(212,175,55,0.72)`,
          letterSpacing: "0.08em",
          opacity: link.op,
          transform: `translateY(${(1 - link.op) * 8}px)`,
        }}>
          🔗 Link in bio
        </div>
      </div>

      {/* ── SkillPips brand ── */}
      <div style={{
        position: "absolute",
        bottom: HEIGHT * 0.065,
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity: brand.op,
        transform: `scale(${brand.sc})`,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.072,
          fontWeight: 900,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${WIDTH * 0.055}px rgba(212,175,55,0.7))`,
        }}>
          SKILLPIPS
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.022,
          fontWeight: 300,
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}>
          Trade Smarter
        </div>
      </div>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 25%, rgba(0,0,0,0.58) 76%, rgba(0,0,0,0.92) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
