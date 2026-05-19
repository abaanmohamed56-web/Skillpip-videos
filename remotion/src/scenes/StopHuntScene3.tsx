import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, FONT, WIDTH, HEIGHT, RED, GREEN } from "../constants";
import { Particles } from "../components/Particles";
import { StopHuntChart } from "../components/StopHuntChart";

interface LabelProps {
  text: string;
  sub?: string;
  color: string;
  opacity: number;
  ty: number;
}

const StepLabel: React.FC<LabelProps> = ({ text, sub, color, opacity, ty }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    opacity,
    transform: `translateY(${ty}px)`,
  }}>
    <div style={{
      fontFamily: FONT,
      fontSize: WIDTH * 0.042,
      fontWeight: 800,
      color,
      letterSpacing: "0.04em",
      textAlign: "center",
      textShadow: color === RED
        ? `0 0 16px rgba(239,68,68,0.7)`
        : color === GREEN
          ? `0 0 16px rgba(34,197,94,0.7)`
          : `0 0 16px rgba(212,175,55,0.6)`,
    }}>
      {text}
    </div>
    {sub && (
      <div style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.030,
        fontWeight: 300,
        color: "rgba(255,255,255,0.52)",
        letterSpacing: "0.04em",
        textAlign: "center",
      }}>
        {sub}
      </div>
    )}
  </div>
);

export const StopHuntScene3: React.FC = () => {
  const frame = useCurrentFrame();

  // Chart drives the full stop hunt from start → reversal
  const chartProg = interpolate(
    frame,
    [20, 180, 310, 440, 530],
    [0,  0.45, 0.72, 0.88, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const s = (start: number, dur = 50) => ({
    op: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ty: interpolate(frame, [start, start + dur], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });

  const step1 = s(30);   // "PRICE DROPS TO SUPPORT"
  const step2 = s(130);  // "STOPS CLUSTER BELOW"
  const step3 = s(260);  // "PUSHED THROUGH"
  const step4 = s(330);  // "STOPS TRIGGERED"
  const step5 = s(400);  // "HARD REVERSAL"
  const step6 = s(480);  // "YOUR LOSS = THEIR ENTRY"

  // Explosion flash at the stop hunt (frame ~330)
  const explodeFlash = interpolate(
    frame,
    [318, 342, 360, 390],
    [0, 1, 0.65, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const glowPulse = 0.04 + 0.015 * Math.sin(frame * 0.055);

  // Which step label to show (show them sequentially, clearing old)
  const showStep1 = frame >= 30  && frame < 240;
  const showStep2 = frame >= 130 && frame < 300;
  const showStep3 = frame >= 260 && frame < 400;
  const showStep4 = frame >= 330 && frame < 460;
  const showStep5 = frame >= 400 && frame < 520;
  const showStep6 = frame >= 480;

  const activeStep = showStep6 ? 6 : showStep5 ? 5 : showStep4 ? 4 : showStep3 ? 3 : showStep2 ? 2 : 1;
  const exitOp = (stepN: number) =>
    activeStep > stepN
      ? Math.max(0, 1 - (frame - [0, 240, 300, 400, 460, 520][stepN]) / 30)
      : 1;

  return (
    <AbsoluteFill style={{ background: "#040408" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 130% 55% at 50% 55%, rgba(212,175,55,${glowPulse}) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      <Particles count={90} speedMult={0.4} opacity={0.45} />

      {/* Full-screen chart (slightly above center) */}
      <div style={{
        position: "absolute",
        left: 0, right: 0,
        top: HEIGHT * 0.16,
        height: HEIGHT * 0.56,
      }}>
        <StopHuntChart
          width={WIDTH}
          height={HEIGHT * 0.56}
          progress={chartProg}
          showSupport
          showStopZone
          showTargets
          showAnnotations
        />
      </div>

      {/* Flash overlay */}
      {explodeFlash > 0 && (
        <AbsoluteFill style={{
          background: `rgba(239,68,68,${explodeFlash * 0.28})`,
          pointerEvents: "none",
        }} />
      )}

      {/* Top title */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.065,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.038,
          fontWeight: 200,
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.45)",
          textTransform: "uppercase",
        }}>
          THE MECHANISM
        </div>
      </div>

      {/* Step labels – bottom band */}
      <div style={{
        position: "absolute",
        bottom: HEIGHT * 0.07,
        left: WIDTH * 0.05,
        right: WIDTH * 0.05,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}>
        {showStep1 && (
          <StepLabel
            text="PRICE DROPS TO SUPPORT"
            sub="Retail traders see the level, place stops below"
            color="rgba(255,255,255,0.85)"
            opacity={step1.op * exitOp(1)}
            ty={step1.ty}
          />
        )}
        {showStep2 && (
          <StepLabel
            text="STOPS CLUSTER BELOW"
            sub="Hundreds of stop orders sitting below support"
            color={RED}
            opacity={step2.op * exitOp(2)}
            ty={step2.ty}
          />
        )}
        {showStep3 && (
          <StepLabel
            text="INSTITUTIONS PUSH PRICE DOWN"
            sub="They engineer the move below the level"
            color={RED}
            opacity={step3.op * exitOp(3)}
            ty={step3.ty}
          />
        )}
        {showStep4 && (
          <StepLabel
            text="💥 STOPS TRIGGERED"
            sub="Every retail stop in the zone fires"
            color={RED}
            opacity={step4.op * exitOp(4)}
            ty={step4.ty}
          />
        )}
        {showStep5 && (
          <StepLabel
            text="HARD REVERSAL ↑"
            sub="Liquidity collected — institutions enter long"
            color={GREEN}
            opacity={step5.op * exitOp(5)}
            ty={step5.ty}
          />
        )}
        {showStep6 && (
          <StepLabel
            text="YOUR LOSS = THEIR ENTRY"
            sub={undefined}
            color={GOLD}
            opacity={step6.op}
            ty={step6.ty}
          />
        )}
      </div>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 76%, rgba(0,0,0,0.90) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
