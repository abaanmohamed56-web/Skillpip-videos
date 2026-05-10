import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT } from "../constants";
import { Particles } from "../components/Particles";
import { CandleChart } from "../components/CandleChart";
import { Phone } from "../components/Phone";
import { TelegramUI, TgMessage } from "../components/TelegramUI";

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY    = Math.sin(frame * 0.015) * 10;
  const beamProg  = Math.min(1, frame / 300);

  /* Reveal helpers */
  const reveal = (f: number, dur = 60) => ({
    op: interpolate(frame, [f, f + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ty: interpolate(frame, [f, f + dur], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    sc: interpolate(frame, [f, f + dur], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });

  const logo = reveal(84);
  const cta1 = reveal(126);
  const cta2 = reveal(168);
  const btn  = reveal(213);
  const icon = reveal(258, 42);

  const PHONE_W = WIDTH * 0.44;
  const PHONE_H = (PHONE_W * 852) / 393;
  const fs      = PHONE_W * 0.028;

  const messages: TgMessage[] = [
    {
      sender: "SKILLPIPS", time: "7:35 PM", views: "150",
      body: <span style={{ color: "#4ade80", fontWeight: 700 }}>✅ TP Hit — +500 pips!</span>,
      opacity: 1, tx: 0,
    },
    {
      sender: "SKILLPIPS", time: "7:36 PM", views: "155",
      isSignal: true,
      body: "Join us. Trade smarter. 🔥",
      opacity: 1, tx: 0,
    },
  ];

  /* Volumetric beam gradients as SVG */
  const beams = Array.from({ length: 5 }, (_, i) => {
    const angle  = (i / 5) * Math.PI * 2 + frame * 0.001;
    const cx = WIDTH * 0.5, cy = HEIGHT * 0.38;
    const len = HEIGHT * 0.55;
    const ex = cx + Math.cos(angle) * len, ey = cy + Math.sin(angle) * len;
    const a = 0.026 * beamProg * (0.6 + 0.4 * Math.sin(frame * 0.03 + i));
    return { cx, cy, ex, ey, a, sw: 22 + 8 * Math.sin(frame * 0.016 + i) };
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Volumetric beams */}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
          <defs>
            {beams.map((b, i) => (
              <linearGradient
                key={i}
                id={`vb${i}`}
                x1={b.cx} y1={b.cy} x2={b.ex} y2={b.ey}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor={`rgba(212,175,55,${b.a})`} />
                <stop offset="100%" stopColor="rgba(212,175,55,0)" />
              </linearGradient>
            ))}
          </defs>
          {beams.map((b, i) => (
            <line
              key={i}
              x1={b.cx} y1={b.cy} x2={b.ex} y2={b.ey}
              stroke={`url(#vb${i})`}
              strokeWidth={b.sw}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Charts + particles */}
      <CandleChart x={0} y={HEIGHT * 0.08} width={WIDTH} height={HEIGHT * 0.38} alpha={0.05} speed={0.65} seed={0} />
      <Particles count={160} speedMult={0.72} />

      {/* Ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 40% at 50% 62%, rgba(212,175,55,${0.045 * beamProg * (0.85 + 0.15 * Math.sin(frame * 0.025))}) 0%, transparent 70%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Main content column */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: HEIGHT * 0.018,
          padding: `${HEIGHT * 0.055}px ${WIDTH * 0.05}px`,
        }}
      >
        {/* Phone */}
        <Phone
          width={PHONE_W}
          showSweep
          sweepOffset={((frame * 0.6) % 100) / 100}
          style={{ transform: `translateY(${floatY}px)` }}
        >
          <TelegramUI
            width={PHONE_W * 0.956}
            height={PHONE_H * 0.972}
            messages={messages}
            channelName="SKILLPIPS ✓"
            subscribers="1,000+ traders"
            inputPlaceholder="Join the community…"
          />
        </Phone>

        {/* Logo */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.072,
            fontWeight: 900,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_B}, ${GOLD})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 ${WIDTH * 0.055}px rgba(212,175,55,0.7))`,
            opacity: logo.op,
            transform: `scale(${logo.sc})`,
          }}
        >
          SKILLPIPS
        </div>

        {/* CTA 1 */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.030,
            fontWeight: 300,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.78)",
            textAlign: "center",
            opacity: cta1.op,
            transform: `translateY(${cta1.ty}px)`,
          }}
        >
          Join the SkillPips Community
        </div>

        {/* CTA 2 */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.030,
            fontWeight: 300,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.78)",
            textAlign: "center",
            opacity: cta2.op,
            transform: `translateY(${cta2.ty}px)`,
          }}
        >
          Trade With 1,000+ Traders
        </div>

        {/* JOIN NOW button */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.042,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#000",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_B}, ${GOLD})`,
            padding: `${WIDTH * 0.028}px ${WIDTH * 0.09}px`,
            borderRadius: WIDTH * 0.1,
            opacity: btn.op,
            transform: `scale(${btn.sc}) translateY(${btn.ty}px)`,
            boxShadow: `0 0 ${WIDTH * 0.08}px rgba(212,175,55,0.5), 0 8px 30px rgba(0,0,0,0.5)`,
          }}
        >
          JOIN NOW
        </div>

        {/* Telegram icon */}
        <div
          style={{
            fontSize: WIDTH * 0.088,
            opacity: icon.op,
            transform: `scale(${icon.sc})`,
            filter: "drop-shadow(0 0 14px rgba(33,150,243,0.9))",
          }}
        >
          ✈️
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 50%, transparent 25%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.88) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
