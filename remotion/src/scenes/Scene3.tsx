import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT, WIDTH } from "../constants";
import { Background } from "../components/Background";
import { Phone } from "../components/Phone";

/* iOS-accurate Telegram app icon — blue rounded square + SVG paper plane */
const TelegramIcon: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size, height: size,
      borderRadius: size * 0.22,
      background: "linear-gradient(180deg, #37AEE2 0%, #1E96C8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
      <path
        d="M2.29 11.4L21.13 4.06C21.97 3.74 22.77 4.55 22.44 5.39L18.14 19.47C17.8 20.37 16.63 20.53 16.06 19.75L12.3 14.71L9.42 17.47C8.88 17.99 8 17.61 8 16.87V13.5L2.37 12.58C1.48 12.43 1.43 11.75 2.29 11.4Z"
        fill="#fff"
      />
    </svg>
  </div>
);

const Notif: React.FC<{
  opacity: number; ty: number; msg: string;
  phoneW: number;
}> = ({ opacity, ty, msg, phoneW }) => {
  const fs = phoneW * 0.028;
  const iconSize = phoneW * 0.082;
  return (
    <div
      style={{
        background: "rgba(28,28,30,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: phoneW * 0.038,
        padding: `${phoneW * 0.022}px ${phoneW * 0.028}px`,
        display: "flex",
        alignItems: "center",
        gap: phoneW * 0.022,
        opacity,
        transform: `translateY(${ty}px)`,
        fontFamily: FONT,
      }}
    >
      <TelegramIcon size={iconSize} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <div style={{ fontSize: fs * 0.8, fontWeight: 600, color: "#fff" }}>SKILLPIPS</div>
          <div style={{ fontSize: fs * 0.68, color: "rgba(255,255,255,0.42)" }}>now</div>
        </div>
        <div style={{ fontSize: fs * 0.75, color: "rgba(255,255,255,0.68)", lineHeight: 1.3 }}>{msg}</div>
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
          {/* iOS lock screen with trading chart wallpaper */}
          <div
            style={{
              width: "100%", height: "100%",
              position: "relative",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Trading chart wallpaper — dark SVG with candles and glow */}
            <svg
              width="100%" height="100%"
              viewBox="0 0 100 180"
              preserveAspectRatio="xMidYMid slice"
              style={{ position: "absolute", inset: 0 }}
            >
              <defs>
                <linearGradient id="wbg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a0f1a" />
                  <stop offset="100%" stopColor="#060b14" />
                </linearGradient>
                <linearGradient id="wglow" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgba(212,175,55,0)" />
                  <stop offset="60%" stopColor="rgba(212,175,55,0.12)" />
                  <stop offset="100%" stopColor="rgba(212,175,55,0)" />
                </linearGradient>
                <filter id="wf">
                  <feGaussianBlur stdDeviation="1.2" />
                </filter>
              </defs>
              <rect width="100" height="180" fill="url(#wbg)" />
              {/* Grid lines */}
              {[40, 60, 80, 100, 120, 140].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
              ))}
              {[20, 40, 60, 80].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
              ))}
              {/* Glowing MA line */}
              <polyline
                points="0,130 10,125 18,122 25,118 32,115 40,108 48,104 55,98 62,94 70,88 78,84 88,78 100,72"
                fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8"
              />
              <polyline
                points="0,130 10,125 18,122 25,118 32,115 40,108 48,104 55,98 62,94 70,88 78,84 88,78 100,72"
                fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="2.5" filter="url(#wf)"
              />
              {/* Candles */}
              {[
                { x: 4,  o: 128, c: 122, h: 130, l: 120 },
                { x: 12, o: 122, c: 126, h: 127, l: 119 },
                { x: 20, o: 126, c: 118, h: 128, l: 116 },
                { x: 28, o: 118, c: 112, h: 120, l: 110 },
                { x: 36, o: 112, c: 108, h: 114, l: 106 },
                { x: 44, o: 108, c: 102, h: 110, l: 100 },
                { x: 52, o: 102, c: 106, h: 108, l: 100 },
                { x: 60, o: 106, c: 96,  h: 108, l: 94  },
                { x: 68, o: 96,  c: 90,  h: 98,  l: 88  },
                { x: 76, o: 90,  c: 85,  h: 92,  l: 83  },
                { x: 84, o: 85,  c: 80,  h: 87,  l: 78  },
                { x: 92, o: 80,  c: 76,  h: 82,  l: 74  },
              ].map((cd) => {
                const isUp = cd.c < cd.o;
                const col = isUp ? "#4ade80" : "#ef5350";
                return (
                  <g key={cd.x} opacity="0.7">
                    <line x1={cd.x + 2} y1={cd.h} x2={cd.x + 2} y2={cd.l} stroke={col} strokeWidth="0.5" />
                    <rect
                      x={cd.x} y={Math.min(cd.o, cd.c)}
                      width={4} height={Math.max(Math.abs(cd.o - cd.c), 1)}
                      fill={col}
                    />
                  </g>
                );
              })}
              {/* Glow overlay from bottom */}
              <rect x="0" y="0" width="100" height="180" fill="url(#wglow)" />
              {/* Darken top/bottom for readability */}
              <rect x="0" y="0" width="100" height="45" fill="rgba(0,0,0,0.55)" />
              <rect x="0" y="110" width="100" height="70" fill="rgba(0,0,0,0.4)" />
            </svg>
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
                msg="🔔 SIGNAL READY — XAUUSD"
                phoneW={PHONE_W}
              />
              <Notif
                opacity={n2p} ty={(1 - n2p) * -18}
                msg="XAUUSD SELL CONFIRMED ✓"
                phoneW={PHONE_W}
              />
            </div>
          </div>
        </Phone>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
