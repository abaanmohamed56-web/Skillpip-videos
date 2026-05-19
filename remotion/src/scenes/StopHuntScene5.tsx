import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT, GREEN } from "../constants";
import { Particles } from "../components/Particles";

interface RuleCardProps {
  num: string;
  title: string;
  sub: string;
  icon: string;
  color: string;
  opacity: number;
  ty: number;
  sc: number;
}

const RuleCard: React.FC<RuleCardProps> = ({ num, title, sub, icon, color, opacity, ty, sc }) => (
  <div style={{
    background: "rgba(6,6,12,0.92)",
    border: `1px solid ${color}55`,
    borderLeft: `3px solid ${color}`,
    borderRadius: 18,
    padding: `${WIDTH * 0.040}px ${WIDTH * 0.045}px`,
    display: "flex",
    alignItems: "flex-start",
    gap: WIDTH * 0.040,
    width: "100%",
    boxShadow: `0 0 ${WIDTH * 0.05}px ${color}18, 0 12px 40px rgba(0,0,0,0.5)`,
    opacity,
    transform: `translateY(${ty}px) scale(${sc})`,
  }}>
    {/* Icon circle */}
    <div style={{
      width: WIDTH * 0.14,
      height: WIDTH * 0.14,
      borderRadius: "50%",
      background: `${color}18`,
      border: `1px solid ${color}44`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: WIDTH * 0.058,
      flexShrink: 0,
      filter: `drop-shadow(0 0 8px ${color}66)`,
    }}>
      {icon}
    </div>

    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.022,
        fontWeight: 600,
        color: `${color}cc`,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: 4,
      }}>
        RULE {num}
      </div>
      <div style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.044,
        fontWeight: 800,
        color: "#fff",
        letterSpacing: "0.02em",
        lineHeight: 1.2,
        marginBottom: 6,
        textShadow: `0 0 12px ${color}44`,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.030,
        fontWeight: 300,
        color: "rgba(255,255,255,0.52)",
        letterSpacing: "0.03em",
        lineHeight: 1.4,
      }}>
        {sub}
      </div>
    </div>
  </div>
);

export const StopHuntScene5: React.FC = () => {
  const frame = useCurrentFrame();

  const card = (start: number, dur = 65) => ({
    opacity: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ty: interpolate(frame, [start, start + dur], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    sc: interpolate(frame, [start, start + dur], [0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });

  const c1 = card(50);
  const c2 = card(200);
  const c3 = card(360);

  const titleOp = interpolate(frame, [0, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = 0.04 + 0.014 * Math.sin(frame * 0.055);

  return (
    <AbsoluteFill style={{ background: "#040408" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 130% 60% at 50% 50%, rgba(212,175,55,${glowPulse}) 0%, transparent 68%)`,
        pointerEvents: "none",
      }} />

      <Particles count={90} speedMult={0.40} opacity={0.45} />

      {/* Section title */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.075,
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: titleOp,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.034,
          fontWeight: 200,
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.40)",
          textTransform: "uppercase",
        }}>
          How to protect yourself
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.065,
          fontWeight: 900,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${WIDTH * 0.04}px rgba(212,175,55,0.55))`,
        }}>
          3 RULES
        </div>
      </div>

      {/* Cards */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.21,
        left: WIDTH * 0.05,
        right: WIDTH * 0.05,
        display: "flex",
        flexDirection: "column",
        gap: HEIGHT * 0.022,
      }}>
        <RuleCard
          num="1"
          title="MORE ROOM FOR STOPS"
          sub="Don't place them exactly at the level — go 1.5× the average wick size below"
          icon="📏"
          color={GOLD}
          {...c1}
        />
        <RuleCard
          num="2"
          title="WAIT FOR CONFIRMATION"
          sub="After the sweep, wait for a candle to close back above the level before entering"
          icon="⏳"
          color={GREEN}
          {...c2}
        />
        <RuleCard
          num="3"
          title="FOLLOW SMART MONEY"
          sub="Trade WITH the reversal after the sweep — don't fight the institutional flow"
          icon="🐋"
          color="#60a5fa"
          {...c3}
        />
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: "absolute",
        bottom: HEIGHT * 0.075,
        left: WIDTH * 0.06,
        right: WIDTH * 0.06,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: interpolate(frame, [460, 520], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.038,
          fontWeight: 700,
          color: "rgba(255,255,255,0.72)",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}>
          Don't let them prey on you.
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.042,
          fontWeight: 900,
          textAlign: "center",
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_B})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 16px rgba(212,175,55,0.5))`,
          letterSpacing: "0.05em",
        }}>
          TRADE LIKE SMART MONEY
        </div>
      </div>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 28%, rgba(0,0,0,0.52) 76%, rgba(0,0,0,0.88) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
