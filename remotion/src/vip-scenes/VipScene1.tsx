import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT } from "../constants";
import { Particles } from "../components/Particles";

/* ─────────────────────────────────────────────────────────
   SCENE 1 — Opening Darkness  (240 frames / 4 s)
   0-30   : black
   30-90  : particles + ambient gold glow rise
   90-150 : "THE NEXT EVOLUTION" fades in, metallic glow
   150-185: glitch dissolve
   185-240: massive gold flare sweeps L→R
───────────────────────────────────────────────────────── */
export const VipScene1: React.FC = () => {
  const frame = useCurrentFrame();

  /* Ambient glow */
  const ambientAlpha = interpolate(frame, [30, 100], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Particles */
  const particleOp = interpolate(frame, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Main text entrance */
  const txtIn = interpolate(frame, [90, 145], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const txtScale = interpolate(frame, [90, 145], [0.88, 1], {
    easing: Easing.out(Easing.back(1.6)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const txtBlur = interpolate(frame, [90, 140], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Breathing glow on text */
  const breathe = 0.75 + 0.25 * Math.sin(frame * 0.12);

  /* Text exit */
  const txtOut = interpolate(frame, [170, 195], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Glitch (150-185) */
  const glitch = frame >= 150 && frame <= 185;
  const gX = glitch ? Math.sin(frame * 31.7) * 16 : 0;
  const gY = glitch ? Math.sin(frame * 19.3) * 5 : 0;
  const gHue = glitch ? Math.sin(frame * 23.1) * 50 : 0;
  const gBright = glitch ? 0.75 + Math.abs(Math.sin(frame * 8.9)) * 0.6 : 1;
  const glitchOpacity = glitch
    ? Math.abs(Math.sin(frame * 11.3)) > 0.25 ? 1 : 0.55
    : 1;

  /* Gold flare sweep (185-235) */
  const flareP = interpolate(frame, [185, 233], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flareX = flareP * (WIDTH + 400) - 200;
  const flareAl = interpolate(
    frame,
    [185, 200, 225, 240],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const textOp = Math.min(txtIn, txtOut) * glitchOpacity;

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* Ambient deep gold glow from center */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 52%, rgba(212,175,55,${
            0.055 * ambientAlpha * breathe
          }) 0%, rgba(212,175,55,${
            0.015 * ambientAlpha
          }) 50%, transparent 75%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Subtle floor glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 25% at 50% 100%, rgba(212,175,55,${
            0.04 * ambientAlpha
          }) 0%, transparent 60%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Particles */}
      <div style={{ opacity: particleOp, position: "absolute", inset: 0 }}>
        <Particles count={100} speedMult={0.35} />
      </div>

      {/* THE NEXT EVOLUTION */}
      {frame < 200 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.065,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textAlign: "center",
              padding: "0 6%",
              lineHeight: 1.25,
              background: `linear-gradient(135deg, #B8962E 0%, ${GOLD} 25%, ${GOLD_B} 50%, ${GOLD} 72%, #8B6914 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 ${WIDTH * 0.05}px rgba(212,175,55,${
                0.9 * breathe * textOp
              })) drop-shadow(0 0 ${WIDTH * 0.12}px rgba(212,175,55,${
                0.35 * textOp
              })) blur(${txtBlur * (1 - Math.min(txtIn, 1))}px) hue-rotate(${gHue}deg) brightness(${gBright})`,
              opacity: textOp,
              transform: `scale(${txtScale}) translate(${gX}px, ${gY}px)`,
            }}
          >
            THE NEXT
            <br />
            EVOLUTION
          </div>
        </AbsoluteFill>
      )}

      {/* Chromatic aberration ghost — screen blend only during glitch */}
      {glitch && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: WIDTH * 0.065,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textAlign: "center",
              padding: "0 6%",
              lineHeight: 1.25,
              color: "rgba(255,30,100,0.35)",
              opacity: txtIn * 0.6,
              transform: `scale(${txtScale}) translate(${gX * 2.2 + 6}px, ${gY - 3}px)`,
            }}
          >
            THE NEXT
            <br />
            EVOLUTION
          </div>
        </AbsoluteFill>
      )}

      {/* ── Gold Flare Sweep ─────────────────────────────────── */}
      {flareAl > 0 && (
        <>
          {/* Wide warm glow leading edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg,
                transparent ${Math.max(0, flareX - 280)}px,
                rgba(180,130,30,${flareAl * 0.18}) ${flareX - 120}px,
                rgba(212,175,55,${flareAl * 0.65}) ${flareX}px,
                rgba(255,248,220,${flareAl * 0.9}) ${flareX + 18}px,
                rgba(212,175,55,${flareAl * 0.55}) ${flareX + 55}px,
                rgba(180,130,30,${flareAl * 0.18}) ${flareX + 160}px,
                transparent ${flareX + 320}px)`,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
          {/* Sharp bright center line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: flareX + 14,
              width: 4,
              background: `rgba(255,255,240,${flareAl * 0.75})`,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 28%, rgba(0,0,0,0.65) 72%, rgba(0,0,0,0.94) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
