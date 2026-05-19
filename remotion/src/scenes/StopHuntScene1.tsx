import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT, RED } from "../constants";
import { Particles } from "../components/Particles";
import { StopHuntChart } from "../components/StopHuntChart";

export const StopHuntScene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Chart progress: candles build 0→4 over frames 30–300, hunt candle 300–430
  const chartProg = interpolate(
    frame,
    [30, 300, 440, 520],
    [0,  0.45, 0.72, 0.80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Main headline lines
  const line1Op = interpolate(frame, [50,  90],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y  = interpolate(frame, [50,  90],  [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Op = interpolate(frame, [90,  140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y  = interpolate(frame, [90,  140], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "STOP LOSS HIT" flash — when wick crosses support (~frame 375)
  const hitFlash = interpolate(frame, [360, 390, 420, 450], [0, 1, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Reversal text
  const revOp = interpolate(frame, [420, 460], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Big finale text
  const bigOp  = interpolate(frame, [480, 530], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigSc  = interpolate(frame, [480, 530], [0.75, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowPulse = 0.45 + 0.15 * Math.sin(frame * 0.08);

  return (
    <AbsoluteFill style={{ background: "#040408" }}>
      {/* Ambient glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 120% 55% at 50% 58%, rgba(212,175,55,${glowPulse * 0.06}) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Particles */}
      <Particles count={120} speedMult={0.5} opacity={0.6} />

      {/* Chart – middle band */}
      <div style={{
        position: "absolute",
        left: 0, right: 0,
        top: HEIGHT * 0.28,
        height: HEIGHT * 0.44,
      }}>
        <StopHuntChart
          width={WIDTH}
          height={HEIGHT * 0.44}
          progress={chartProg}
          showSupport
          showStopZone
        />
      </div>

      {/* Red flash overlay when stop hit */}
      {hitFlash > 0 && (
        <AbsoluteFill style={{
          background: `rgba(239,68,68,${hitFlash * 0.22})`,
          pointerEvents: "none",
        }} />
      )}

      {/* Headline text – upper */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.09,
        left: WIDTH * 0.05,
        right: WIDTH * 0.05,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.048,
          fontWeight: 300,
          color: "rgba(255,255,255,0.82)",
          letterSpacing: "0.03em",
          lineHeight: 1.35,
          textAlign: "center",
          opacity: line1Op,
          transform: `translateY(${line1Y}px)`,
        }}>
          You put your stop loss
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.058,
          fontWeight: 800,
          color: GOLD,
          letterSpacing: "0.04em",
          textAlign: "center",
          textShadow: `0 0 20px rgba(212,175,55,0.7), 0 0 50px rgba(212,175,55,0.3)`,
          opacity: line2Op,
          transform: `translateY(${line2Y}px)`,
          marginTop: 4,
        }}>
          RIGHT BELOW SUPPORT
        </div>
      </div>

      {/* Stop loss hit label */}
      {hitFlash > 0.15 && (
        <div style={{
          position: "absolute",
          top: HEIGHT * 0.70,
          left: 0, right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: Math.min(hitFlash * 2, 1),
        }}>
          <div style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.050,
            fontWeight: 900,
            color: RED,
            letterSpacing: "0.08em",
            textShadow: `0 0 18px rgba(239,68,68,0.9), 0 0 40px rgba(239,68,68,0.5)`,
          }}>
            ✕ STOP LOSS TRIGGERED
          </div>
        </div>
      )}

      {/* Reversal text */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.70,
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: revOp,
        transform: `translateY(${(1 - revOp) * 12}px)`,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.040,
          fontWeight: 400,
          color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.04em",
          textAlign: "center",
        }}>
          Price immediately reversed.
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.038,
          fontWeight: 400,
          color: "rgba(255,255,255,0.50)",
          letterSpacing: "0.04em",
          textAlign: "center",
        }}>
          Hit every target you had.
        </div>
      </div>

      {/* BIG FINALE: "YOU JUST GOT STOP HUNTED" */}
      {bigOp > 0 && (
        <div style={{
          position: "absolute",
          bottom: HEIGHT * 0.08,
          left: WIDTH * 0.04,
          right: WIDTH * 0.04,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: bigOp,
          transform: `scale(${bigSc})`,
        }}>
          <div style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.040,
            fontWeight: 300,
            color: "rgba(255,255,255,0.60)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            Sound familiar?
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.068,
            fontWeight: 900,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.1,
            background: `linear-gradient(135deg, ${RED} 0%, #ff6b6b 50%, ${RED} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 22px rgba(239,68,68,0.75))`,
            letterSpacing: "0.04em",
          }}>
            YOU JUST GOT{"\n"}STOP HUNTED
          </div>
        </div>
      )}

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.90) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
