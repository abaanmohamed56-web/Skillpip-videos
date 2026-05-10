import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT, WIDTH } from "../constants";
import { Background } from "../components/Background";
import { Phone } from "../components/Phone";

const Notif: React.FC<{
  opacity: number; ty: number; emoji: string; msg: string;
  phoneW: number;
}> = ({ opacity, ty, emoji, msg, phoneW }) => {
  const fs = phoneW * 0.028;
  return (
    <div
      style={{
        background: "rgba(28,28,30,0.97)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(212,175,55,0.4)",
        borderRadius: phoneW * 0.036,
        padding: `${phoneW * 0.025}px ${phoneW * 0.03}px`,
        display: "flex",
        alignItems: "center",
        gap: phoneW * 0.025,
        opacity,
        transform: `translateY(${ty}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: phoneW * 0.08, height: phoneW * 0.08,
          borderRadius: phoneW * 0.02,
          background: "linear-gradient(135deg, #2196F3, #1565C0)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: phoneW * 0.044, flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div>
        <div style={{ fontSize: fs * 0.85, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
          SKILLPIPS
        </div>
        <div style={{ fontSize: fs * 0.72, color: "rgba(255,255,255,0.62)" }}>{msg}</div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY  = Math.sin(frame * 0.02) * 9;
  const floatRX = Math.sin(frame * 0.02) * 2;

  /* Notifications appear at 1.6 s and 3.3 s into the scene */
  const n1p = interpolate(frame, [96, 126], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n2p = interpolate(frame, [198, 228], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const PHONE_W = WIDTH * 0.62;
  const fs = PHONE_W * 0.028;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background chartAlpha={0.08} particleSpeed={0.70} showGlow glowY={0.44} />

      <AbsoluteFill
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Phone
          width={PHONE_W}
          style={{ transform: `translateY(${floatY}px) rotateX(${floatRX}deg)` }}
        >
          {/* iOS lock screen */}
          <div
            style={{
              width: "100%", height: "100%",
              background: "linear-gradient(180deg,#1c1c1e,#111)",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Status bar */}
            <div
              style={{
                display: "flex", justifyContent: "space-between",
                padding: `${PHONE_W * 0.038}px ${PHONE_W * 0.05}px ${PHONE_W * 0.014}px`,
                paddingTop: PHONE_W * 0.09,
                fontSize: fs * 0.78, fontWeight: 600, color: "#fff", fontFamily: FONT,
              }}
            >
              <span>9:41</span>
              <span style={{ width: "34%" }} />
              <span>●●● 5G ▌</span>
            </div>

            {/* Clock */}
            <div
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", marginTop: "6%", gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: PHONE_W * 0.072, fontWeight: 100, color: "#fff",
                  letterSpacing: "-0.02em", fontFamily: FONT,
                }}
              >
                9:41
              </div>
              <div style={{ fontSize: fs * 0.78, color: "rgba(255,255,255,0.52)", fontFamily: FONT }}>
                Saturday, May 10
              </div>
            </div>

            {/* Notifications */}
            <div
              style={{
                display: "flex", flexDirection: "column",
                gap: PHONE_W * 0.018,
                padding: `${PHONE_W * 0.04}px ${PHONE_W * 0.022}px`,
              }}
            >
              <Notif
                opacity={n1p} ty={(1 - n1p) * -18}
                emoji="✈️" msg="🔔 SIGNAL READY — XAUUSD"
                phoneW={PHONE_W}
              />
              <Notif
                opacity={n2p} ty={(1 - n2p) * -18}
                emoji="✈️" msg="XAUUSD SELL CONFIRMED ✓"
                phoneW={PHONE_W}
              />
            </div>
          </div>
        </Phone>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
