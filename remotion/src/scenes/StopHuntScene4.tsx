import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT, GREEN } from "../constants";
import { Particles } from "../components/Particles";
import { StopHuntChart } from "../components/StopHuntChart";

export const StopHuntScene4: React.FC = () => {
  const frame = useCurrentFrame();

  // Chart starts from after the stop hunt (progress 0.72+) then shows reversal fully
  const chartProg = interpolate(
    frame,
    [40, 160, 340, 530],
    [0.72, 0.80, 0.95, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const s = (start: number, dur = 55) => ({
    op: interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ty: interpolate(frame, [start, start + dur], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });

  const good    = s(0, 45);    // "THE GOOD NEWS"
  const t1      = s(60);       // "Once you know this..."
  const t2      = s(160);      // "stop hunts = powerful entry"
  const sweep   = s(270);      // "SEE THIS WICK?" annotation context
  const trigger = s(380);      // "THAT'S YOUR TRIGGER"
  const tpReveal = s(460);     // TP labels appear text

  // Pulsing glow on "good news"
  const goldGlow = 0.5 + 0.2 * Math.sin(frame * 0.10);

  return (
    <AbsoluteFill style={{ background: "#040408" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 120% 50% at 50% 42%, rgba(34,197,94,${0.04 + 0.015 * Math.sin(frame * 0.05)}) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 100% 45% at 50% 60%, rgba(212,175,55,${0.03 + 0.01 * Math.sin(frame * 0.04)}) 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <Particles count={110} speedMult={0.50} opacity={0.55} />

      {/* ── Top text ── */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.075,
        left: WIDTH * 0.06,
        right: WIDTH * 0.06,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: HEIGHT * 0.010,
      }}>
        {/* "THE GOOD NEWS" */}
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.072,
          fontWeight: 900,
          textTransform: "uppercase",
          textAlign: "center",
          background: `linear-gradient(135deg, ${GREEN} 0%, #86efac 50%, ${GREEN} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${WIDTH * 0.04}px rgba(34,197,94,${goldGlow * 0.5}))`,
          opacity: good.op,
          transform: `scale(${0.80 + 0.20 * good.op})`,
          letterSpacing: "0.05em",
          lineHeight: 1.1,
        }}>
          THE GOOD{"\n"}NEWS
        </div>

        {/* Line 1 */}
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.040,
          fontWeight: 300,
          color: "rgba(255,255,255,0.68)",
          textAlign: "center",
          letterSpacing: "0.04em",
          lineHeight: 1.4,
          opacity: t1.op,
          transform: `translateY(${t1.ty}px)`,
          marginTop: 4,
        }}>
          Once you know this…
        </div>

        {/* Line 2 */}
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.044,
          fontWeight: 700,
          color: "rgba(255,255,255,0.88)",
          textAlign: "center",
          letterSpacing: "0.03em",
          lineHeight: 1.3,
          opacity: t2.op,
          transform: `translateY(${t2.ty}px)`,
        }}>
          Stop hunts become one of your{"\n"}
          <span style={{
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_B})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 900,
          }}>
            most powerful entry signals
          </span>
        </div>
      </div>

      {/* Chart – centre */}
      <div style={{
        position: "absolute",
        left: 0, right: 0,
        top: HEIGHT * 0.36,
        height: HEIGHT * 0.40,
        opacity: interpolate(frame, [30, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <StopHuntChart
          width={WIDTH}
          height={HEIGHT * 0.40}
          progress={chartProg}
          showSupport
          showStopZone
          showTargets
          showAnnotations
        />
      </div>

      {/* Sweep callout */}
      <div style={{
        position: "absolute",
        top: HEIGHT * 0.365 + HEIGHT * 0.40 * 0.72, // approx at wick midpoint
        left: WIDTH * 0.56,
        opacity: sweep.op,
        transform: `translateY(${sweep.ty}px)`,
      }}>
        <div style={{
          background: "rgba(4,4,8,0.92)",
          border: `1px solid ${GOLD}`,
          borderRadius: 10,
          padding: `${WIDTH * 0.018}px ${WIDTH * 0.024}px`,
          fontFamily: FONT,
        }}>
          <div style={{ fontSize: WIDTH * 0.022, fontWeight: 700, color: GOLD, letterSpacing: "0.05em" }}>
            SEE THIS WICK?
          </div>
          <div style={{ fontSize: WIDTH * 0.019, color: "rgba(255,255,255,0.50)", marginTop: 3 }}>
            Pierced support, closed back above
          </div>
        </div>
      </div>

      {/* Bottom trigger + TP reveal */}
      <div style={{
        position: "absolute",
        bottom: HEIGHT * 0.07,
        left: WIDTH * 0.05,
        right: WIDTH * 0.05,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: HEIGHT * 0.010,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.038,
          fontWeight: 300,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          textAlign: "center",
          opacity: trigger.op,
          transform: `translateY(${trigger.ty}px)`,
        }}>
          That's your trigger
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: WIDTH * 0.062,
          fontWeight: 900,
          textTransform: "uppercase",
          textAlign: "center",
          background: `linear-gradient(135deg, ${GREEN} 0%, #86efac 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 20px rgba(34,197,94,0.65))`,
          letterSpacing: "0.05em",
          opacity: trigger.op,
          transform: `scale(${0.85 + 0.15 * trigger.op})`,
        }}>
          THE SWEEP
        </div>

        {/* TP labels row */}
        <div style={{
          display: "flex",
          gap: WIDTH * 0.040,
          opacity: tpReveal.op,
          transform: `translateY(${tpReveal.ty}px)`,
          marginTop: 6,
        }}>
          {[
            { label: "TP1", val: "3,318", delay: 0 },
            { label: "TP2", val: "3,340", delay: 0.25 },
            { label: "TP3", val: "3,358", delay: 0.5 },
          ].map(({ label, val, delay }) => {
            const chipOp = interpolate(frame, [460 + delay * 80, 460 + delay * 80 + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={label} style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.45)",
                borderRadius: 8,
                padding: `${WIDTH * 0.014}px ${WIDTH * 0.020}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                opacity: chipOp,
              }}>
                <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.022, fontWeight: 700, color: GREEN, letterSpacing: "0.05em" }}>
                  {label}
                </div>
                <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.020, fontWeight: 400, color: "rgba(255,255,255,0.60)" }}>
                  {val}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 28%, rgba(0,0,0,0.55) 76%, rgba(0,0,0,0.90) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
