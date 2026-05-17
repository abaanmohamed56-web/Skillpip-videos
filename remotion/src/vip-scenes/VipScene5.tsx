import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GOLD, GOLD_B, FONT, WIDTH, HEIGHT } from "../constants";
import { Particles } from "../components/Particles";
import { CandleChart } from "../components/CandleChart";
import { SkillPipsLogo } from "../components/SkillPipsLogo";

/* ─────────────────────────────────────────────────────────
   SCENE 5 — Final Drop  (480 frames / 8 s)
   0-18   : impact flash
   18-80  : "SKILL PIPS" explodes in (spring scale)
   50-110 : "VIP 2.0" springs in below
   0-220  : radial particle burst outward
   160-240: "JOIN THE ELITE" entrance
   240-360: logo wordmark + glow
   360-480: hold / breathe
───────────────────────────────────────────────────────── */

/* Radial burst particles — deterministic LCG */
function lcg(s: number) {
  return (((s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const BURST_COUNT = 180;

const BurstParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const items = React.useMemo(
    () =>
      Array.from({ length: BURST_COUNT }, (_, i) => {
        const angle =
          (i / BURST_COUNT) * Math.PI * 2 + lcg(i * 7 + 1) * 0.6;
        const spd = 2.2 + lcg(i * 11 + 3) * 2.8;
        const r = 1.2 + lcg(i * 5 + 2) * 2.2;
        const delay = lcg(i * 3 + 4) * 18;
        return { angle, spd, r, delay };
      }),
    []
  );

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {items.map((p, i) => {
        const localF = Math.max(0, frame - p.delay);
        const dist = localF * p.spd;
        const x = WIDTH / 2 + Math.cos(p.angle) * dist;
        const y = HEIGHT / 2 + Math.sin(p.angle) * dist;
        const opacity = interpolate(localF, [0, 20, 200, 320], [0, 1, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (opacity <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 ${p.r * 5}px ${GOLD}`,
              opacity,
              transform: "translate(-50%,-50%)",
            }}
          />
        );
      })}
    </div>
  );
};

/* Volumetric beam radiating from center */
const VolumetricBeams: React.FC<{ frame: number; alpha: number }> = ({ frame, alpha }) => {
  const beams = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + frame * 0.004;
    const len = HEIGHT * 0.62;
    return {
      x1: WIDTH / 2,
      y1: HEIGHT * 0.44,
      x2: WIDTH / 2 + Math.cos(angle) * len,
      y2: HEIGHT * 0.44 + Math.sin(angle) * len,
      sw: 28 + 12 * Math.sin(frame * 0.018 + i * 0.8),
      a: alpha * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.025 + i))),
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {beams.map((b, i) => (
            <linearGradient
              key={i}
              id={`fvb${i}`}
              x1={b.x1}
              y1={b.y1}
              x2={b.x2}
              y2={b.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={`rgba(212,175,55,${b.a})`} />
              <stop offset="100%" stopColor="rgba(212,175,55,0)" />
            </linearGradient>
          ))}
        </defs>
        {beams.map((b, i) => (
          <line
            key={i}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            stroke={`url(#fvb${i})`}
            strokeWidth={b.sw}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* Energy pulse ring expanding outward */
const PulseRing: React.FC<{ frame: number; startF: number }> = ({ frame, startF }) => {
  const local = frame - startF;
  if (local < 0) return null;
  const rings = [0, 18, 36];
  return (
    <AbsoluteFill
      style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {rings.map((delay) => {
        const l = local - delay;
        if (l < 0) return null;
        const r = interpolate(l, [0, 120], [0, WIDTH * 0.9], {
          easing: Easing.out(Easing.quad),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const a = interpolate(l, [0, 10, 80, 120], [0, 0.7, 0.2, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={delay}
            style={{
              position: "absolute",
              width: r,
              height: r,
              borderRadius: "50%",
              border: `2px solid rgba(212,175,55,${a})`,
              boxShadow: `0 0 30px rgba(212,175,55,${a * 0.4})`,
              opacity: a,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const VipScene5: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Impact flash (0-18f) ─────────────────────────── */
  const flash = interpolate(frame, [0, 4, 18], [0.9, 0.75, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Beam alpha builds in ─────────────────────────── */
  const beamAlpha = interpolate(frame, [10, 80], [0, 0.038], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beamPulse = beamAlpha * (0.85 + 0.15 * Math.sin(frame * 0.024));

  /* ── "SKILL PIPS" entrance (spring, 18-75f) ─────── */
  const skillOp = interpolate(frame, [18, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skillScale = interpolate(frame, [18, 30, 52, 75], [4.0, 0.82, 1.05, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── "VIP 2.0" entrance (50-110f) ───────────────── */
  const vipOp = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vipScale = interpolate(frame, [50, 65, 90, 110], [3.0, 0.84, 1.04, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Breathing glow ──────────────────────────────── */
  const breathe = 0.8 + 0.2 * Math.sin(frame * 0.08);

  /* ── "JOIN THE ELITE" (160-240f) ─────────────────── */
  const joinOp = interpolate(frame, [160, 215], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const joinScale = interpolate(frame, [160, 215], [0.7, 1], {
    easing: Easing.out(Easing.back(1.4)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const joinY = interpolate(frame, [160, 215], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Logo mark (240-360f) ────────────────────────── */
  const logoOp = interpolate(frame, [240, 295], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(frame, [240, 295], [0.8, 1], {
    easing: Easing.out(Easing.back(1.3)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Divider line ─────────────────────────────────── */
  const dividerW = interpolate(frame, [145, 180], [0, WIDTH * 0.55], {
    easing: Easing.out(Easing.expo),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* Chart backdrop */}
      <CandleChart
        x={0}
        y={HEIGHT * 0.06}
        width={WIDTH}
        height={HEIGHT * 0.88}
        alpha={0.06}
        speed={1.8}
        seed={33}
      />

      {/* Volumetric beams */}
      <VolumetricBeams frame={frame} alpha={beamPulse} />

      {/* Burst particles */}
      <BurstParticles frame={frame} />

      {/* Ambient particles */}
      <Particles count={140} speedMult={0.9} opacity={0.6} />

      {/* Energy rings */}
      <PulseRing frame={frame} startF={18} />

      {/* Ambient radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% 44%, rgba(212,175,55,${
            0.065 * breathe * Math.min(1, frame / 80)
          }) 0%, transparent 62%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ── Typography stack ─────────────────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: HEIGHT * 0.014,
          padding: `0 4%`,
        }}
      >
        {/* SKILL PIPS */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.108,
            fontWeight: 900,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            textAlign: "center",
            background: `linear-gradient(135deg, #8B6914 0%, ${GOLD} 22%, ${GOLD_B} 50%, ${GOLD} 78%, #6B4F12 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 ${WIDTH * 0.065}px rgba(212,175,55,${
              0.95 * breathe
            })) drop-shadow(0 0 ${WIDTH * 0.16}px rgba(212,175,55,0.4))`,
            opacity: skillOp,
            transform: `scale(${skillScale})`,
          }}
        >
          SKILL PIPS
        </div>

        {/* VIP 2.0 */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.085,
            fontWeight: 900,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textAlign: "center",
            color: GOLD_B,
            textShadow: `0 0 ${WIDTH * 0.05}px rgba(255,215,0,${0.9 * breathe}), 0 0 ${WIDTH * 0.12}px rgba(212,175,55,0.5)`,
            opacity: vipOp,
            transform: `scale(${vipScale})`,
          }}
        >
          VIP 2.0
        </div>

        {/* Divider */}
        <div
          style={{
            height: 2,
            width: dividerW,
            background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.65), transparent)`,
            boxShadow: `0 0 14px rgba(212,175,55,0.4)`,
          }}
        />

        {/* JOIN THE ELITE */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: WIDTH * 0.052,
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            textAlign: "center",
            color: "#000",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_B}, ${GOLD})`,
            padding: `${WIDTH * 0.03}px ${WIDTH * 0.1}px`,
            borderRadius: WIDTH * 0.12,
            opacity: joinOp,
            transform: `scale(${joinScale}) translateY(${joinY}px)`,
            boxShadow: `0 0 ${WIDTH * 0.09}px rgba(212,175,55,0.55), 0 8px 40px rgba(0,0,0,0.5)`,
          }}
        >
          JOIN THE ELITE
        </div>

        {/* Skill Pips crest logo */}
        <SkillPipsLogo
          size={WIDTH * 0.48}
          uid="sp5logo"
          style={{
            opacity: logoOp,
            transform: `scale(${logoScale})`,
            marginTop: HEIGHT * 0.015,
            filter: `drop-shadow(0 0 ${WIDTH * 0.045}px rgba(212,175,55,${0.65 * breathe * logoOp}))`,
          }}
        />
      </AbsoluteFill>

      {/* ── Impact flash overlay ──────────────────────── */}
      {flash > 0 && (
        <AbsoluteFill
          style={{
            background: `rgba(255,245,200,${flash})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 82% 90% at 50% 50%, transparent 24%, rgba(0,0,0,0.5) 68%, rgba(0,0,0,0.88) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
