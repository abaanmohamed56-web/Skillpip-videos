import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT, RED } from "../constants";
import { Particles } from "../components/Particles";

const reveal = (frame: number, start: number, dur = 55) => ({
  op: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  ty: interpolate(frame, [start, start + dur], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
});

// Institution icon – bank/building silhouette in SVG
const InstitutionIcon: React.FC<{ size: number; glow: number }> = ({ size, glow }) => (
  <div style={{
    width: size, height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    filter: `drop-shadow(0 0 ${size * 0.15}px rgba(212,175,55,${glow}))`,
  }}>
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Pillars */}
      {[14, 24, 34, 44, 54].map((x) => (
        <rect key={x} x={x} y={28} width={7} height={28} fill={`rgba(212,175,55,0.88)`} rx={1} />
      ))}
      {/* Top bar */}
      <rect x={10} y={22} width={61} height={6} fill={GOLD} rx={1} />
      {/* Triangular roof */}
      <polygon points="40,6 8,22 72,22" fill={GOLD} />
      {/* Base */}
      <rect x={6} y={56} width={68} height={5} fill={GOLD} rx={1} />
      <rect x={2} y={61} width={76} height={5} fill={`rgba(212,175,55,0.65)`} rx={1} />
    </svg>
  </div>
);

// Stop loss cluster icon
const StopCluster: React.FC<{ x: number; y: number; alpha: number; size: number }> = ({ x, y, alpha, size }) => (
  <div style={{
    position: "absolute",
    left: x, top: y,
    transform: "translate(-50%,-50%)",
    opacity: alpha,
  }}>
    <div style={{
      width: size, height: size * 0.55,
      background: "rgba(239,68,68,0.15)",
      border: "1px solid rgba(239,68,68,0.5)",
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
      fontSize: size * 0.26,
      fontWeight: 700,
      color: RED,
      letterSpacing: "0.05em",
    }}>
      SL
    </div>
  </div>
);

export const StopHuntScene2: React.FC = () => {
  const frame = useCurrentFrame();

  const t1  = reveal(frame, 40);   // "HERE'S THE TRUTH"
  const t2  = reveal(frame, 110);  // "THAT WASN'T BAD LUCK"
  const t3  = reveal(frame, 195);  // "IT WAS ENGINEERED"
  const t4  = reveal(frame, 290);  // institution icon + label
  const t5  = reveal(frame, 370);  // "LIQUIDITY LIVES HERE"
  const t6  = reveal(frame, 460);  // "YOUR STOP = THEIR FUEL"

  // Strikethrough on "bad luck" from frame 195
  const strikeW = interpolate(frame, [195, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowPulse = 0.55 + 0.2 * Math.sin(frame * 0.06);
  const iconGlow = Math.max(0, (frame - 290) / 150);

  // Stop loss clusters appear at frame 370
  const clusterAlpha = interpolate(frame, [370, 430], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clusters = [
    { x: WIDTH * 0.18, y: HEIGHT * 0.615 },
    { x: WIDTH * 0.32, y: HEIGHT * 0.610 },
    { x: WIDTH * 0.48, y: HEIGHT * 0.620 },
    { x: WIDTH * 0.62, y: HEIGHT * 0.605 },
    { x: WIDTH * 0.78, y: HEIGHT * 0.618 },
    { x: WIDTH * 0.25, y: HEIGHT * 0.648 },
    { x: WIDTH * 0.55, y: HEIGHT * 0.645 },
    { x: WIDTH * 0.72, y: HEIGHT * 0.652 },
  ];

  return (
    <AbsoluteFill style={{ background: "#040408" }}>
      {/* Gold radial glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 110% 50% at 50% 44%, rgba(212,175,55,${glowPulse * 0.055}) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      <Particles count={100} speedMult={0.45} opacity={0.5} />

      {/* ── Text stack ── */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.10,
        left: WIDTH * 0.06,
        right: WIDTH * 0.06,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: HEIGHT * 0.012,
      }}>
        {/* Line 1 */}
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.040,
          fontWeight: 200,
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
          opacity: t1.op,
          transform: `translateY(${t1.ty}px)`,
        }}>
          Here's the truth
        </div>

        {/* Line 2 – "THAT WASN'T BAD LUCK" with strikethrough */}
        <div style={{
          position: "relative",
          fontFamily: FONT,
          fontSize: WIDTH * 0.054,
          fontWeight: 700,
          color: "rgba(255,255,255,0.80)",
          letterSpacing: "0.03em",
          textAlign: "center",
          opacity: t2.op,
          transform: `translateY(${t2.ty}px)`,
        }}>
          That wasn't bad luck
          {/* Strikethrough bar */}
          <div style={{
            position: "absolute",
            left: `${(1 - strikeW) * 50}%`,
            right: `${(1 - strikeW) * 50}%`,
            top: "50%",
            height: 3,
            background: RED,
            boxShadow: `0 0 8px rgba(239,68,68,0.7)`,
            transition: "none",
          }} />
        </div>

        {/* Line 3 – "IT WAS ENGINEERED" */}
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.072,
          fontWeight: 900,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.1,
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${WIDTH * 0.045}px rgba(212,175,55,0.65))`,
          opacity: t3.op,
          transform: `scale(${0.82 + 0.18 * t3.op}) translateY(${t3.ty}px)`,
        }}>
          IT WAS{"\n"}ENGINEERED
        </div>
      </div>

      {/* Institution icon */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.40,
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: HEIGHT * 0.012,
        opacity: t4.op,
        transform: `translateY(${t4.ty}px)`,
      }}>
        <InstitutionIcon size={WIDTH * 0.20} glow={Math.min(iconGlow, 0.7)} />
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.036,
          fontWeight: 700,
          color: GOLD,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          textShadow: `0 0 14px rgba(212,175,55,0.55)`,
        }}>
          SMART MONEY
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.028,
          fontWeight: 300,
          color: "rgba(255,255,255,0.50)",
          letterSpacing: "0.06em",
        }}>
          needs liquidity to fill massive orders
        </div>
      </div>

      {/* Support line visual + cluster labels */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.59,
        left: 0, right: 0,
        opacity: t5.op,
      }}>
        {/* Support line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: WIDTH * 0.06,
          right: WIDTH * 0.06,
          height: 2,
          background: GOLD,
          boxShadow: `0 0 12px rgba(212,175,55,0.6), 0 0 30px rgba(212,175,55,0.25)`,
        }} />
        <div style={{
          position: "absolute",
          top: 6,
          left: WIDTH * 0.06,
          fontFamily: FONT,
          fontSize: WIDTH * 0.020,
          fontWeight: 600,
          color: `rgba(212,175,55,0.7)`,
          letterSpacing: "0.07em",
        }}>
          SUPPORT LEVEL
        </div>

        {/* Liquidity label */}
        <div style={{
          position: "absolute",
          top: HEIGHT * 0.035,
          left: 0, right: 0,
          display: "flex",
          justifyContent: "center",
        }}>
          <div style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.030,
            fontWeight: 700,
            color: RED,
            letterSpacing: "0.08em",
            textShadow: `0 0 14px rgba(239,68,68,0.6)`,
            opacity: t5.op,
          }}>
            ↓ STOP LOSSES CLUSTER HERE ↓
          </div>
        </div>

        {/* SL cluster chips */}
        {clusters.map(({ x, y }, i) => (
          <StopCluster
            key={i}
            x={x}
            y={y - HEIGHT * 0.59}
            alpha={clusterAlpha * (0.7 + 0.3 * Math.sin(i * 1.7))}
            size={WIDTH * 0.13}
          />
        ))}
      </div>

      {/* Bottom reveal */}
      <div style={{
        position: "absolute",
        bottom: HEIGHT * 0.07,
        left: WIDTH * 0.05,
        right: WIDTH * 0.05,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: t6.op,
        transform: `translateY(${t6.ty}px)`,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.050,
          fontWeight: 900,
          textAlign: "center",
          color: "rgba(255,255,255,0.90)",
          letterSpacing: "0.04em",
        }}>
          Your stop loss
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.058,
          fontWeight: 900,
          textAlign: "center",
          background: `linear-gradient(90deg, ${RED} 0%, #ff8a80 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 18px rgba(239,68,68,0.6))`,
          letterSpacing: "0.05em",
        }}>
          = FREE LIQUIDITY
        </div>
      </div>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 28%, rgba(0,0,0,0.60) 78%, rgba(0,0,0,0.92) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
