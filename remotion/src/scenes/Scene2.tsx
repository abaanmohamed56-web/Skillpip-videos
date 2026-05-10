import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GOLD, FONT, WIDTH, HEIGHT } from "../constants";
import { Background } from "../components/Background";
import { Phone } from "../components/Phone";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Phone 3-D reveal ── */
  const phoneOpacity = interpolate(frame, [0, 42], [0, 1], { extrapolateRight: "clamp" });
  const rotY  = interpolate(frame, [0, 180, 270, 360], [-65, 12, -10, -6], { extrapolateRight: "clamp" });
  const rotX  = interpolate(frame, [0, 180, 270, 360], [10, -5, 3, 2],   { extrapolateRight: "clamp" });
  const tY    = interpolate(frame, [0, 180, 270, 360], [40, -8, 0, 0],   { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 180, 270, 360], [0.82, 1.02, 1, 1], { extrapolateRight: "clamp" });

  /* ── Gold sweep ── */
  const sweepOffset = ((frame * 0.8) % 100) / 100;

  /* ── Holographic cards ── */
  const holoP = (delay: number) =>
    interpolate(frame, [delay, delay + 36], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

  /* ── Lens flare ── */
  const flareP = interpolate(frame, [48, 216], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const PHONE_W = WIDTH * 0.62;

  const holos = [
    { delay: 96,  pos: { top: "16%",    right: "3%" }, label: "XAUUSD",  val: "▲ 3,340.20", valCol: "#4ade80", sub: "+1.24% today"   },
    { delay: 129, pos: { top: "44%",    left:  "3%" }, label: "SIGNAL",  val: "● SELL",      valCol: "#f87171", sub: "TP: 200 pips"   },
    { delay: 162, pos: { bottom: "16%", right: "3%" }, label: "MEMBERS", val: "1,000+",      valCol: "#fff",    sub: "active traders" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background chartAlpha={0.10} particleSpeed={0.80} showGlow glowY={0.46} />

      {/* Phone */}
      <AbsoluteFill
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          perspective: "1200px",
        }}
      >
        <div
          style={{
            opacity: phoneOpacity,
            transform: `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(${tY}px) scale(${scale})`,
          }}
        >
          <Phone width={PHONE_W} showSweep sweepOffset={sweepOffset} />
        </div>
      </AbsoluteFill>

      {/* Lens flare */}
      {flareP > 0.2 && (
        <div
          style={{
            position: "absolute",
            top: "22%", right: "8%",
            width: PHONE_W * 0.35, height: PHONE_W * 0.35,
            background: `radial-gradient(circle, rgba(212,175,55,${0.32 * flareP}) 0%, rgba(255,215,0,${0.1 * flareP}) 40%, transparent 70%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Holo cards */}
      {holos.map(({ delay, pos, label, val, valCol, sub }) => {
        const hp = holoP(delay);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              ...pos,
              background: "rgba(4,4,6,0.9)",
              border: "1px solid rgba(212,175,55,0.5)",
              borderRadius: WIDTH * 0.028,
              padding: `${WIDTH * 0.022}px ${WIDTH * 0.028}px`,
              minWidth: WIDTH * 0.22,
              opacity: hp,
              transform: `scale(${0.8 + 0.2 * hp}) translateY(${(1 - hp) * 8}px)`,
              zIndex: 5,
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.022, color: GOLD, fontWeight: 700, marginBottom: 3, letterSpacing: "0.08em" }}>
              {label}
            </div>
            <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.034, fontWeight: 800, color: valCol }}>
              {val}
            </div>
            <div style={{ fontFamily: FONT, fontSize: WIDTH * 0.02, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
              {sub}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
