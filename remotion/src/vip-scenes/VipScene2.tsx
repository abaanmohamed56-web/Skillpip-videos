import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GOLD, GOLD_B, GOLD_DARK, FONT, WIDTH, HEIGHT } from "../constants";
import { CandleChart } from "../components/CandleChart";
import { Particles } from "../components/Particles";
import { SkillPipsLogo } from "../components/SkillPipsLogo";

/* ─────────────────────────────────────────────────────────
   SCENE 2 — Fast Montage  (480 frames / 8 s)
   8 cuts × 60 frames — fast flashes between trading visuals
   Final: SKILL PIPS logo reveal
───────────────────────────────────────────────────────── */

const CUT = 60; // frames per cut
const FLASH = 7; // flash duration at cut boundary

/* Cut-boundary flash overlay */
const Flash: React.FC<{ frame: number }> = ({ frame }) => {
  const pos = frame % CUT;
  const isFlash = pos < FLASH;
  if (!isFlash) return null;
  const alpha = interpolate(pos, [0, 3, FLASH], [0.75, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `rgba(212,175,55,${alpha})`,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 90,
      }}
    />
  );
};

/* Scrolling market-data ticker row */
const Ticker: React.FC<{ y: number; frame: number; speed?: number }> = ({
  y,
  frame,
  speed = 1,
}) => {
  const items = [
    "XAUUSD ▲ 3,340.20",
    "EURUSD ▼ 1.0821",
    "GBPUSD ▲ 1.2654",
    "US500 ▲ 5,892.40",
    "NASDAQ ▲ 20,140.30",
    "OIL ▼ 79.40",
    "BTC ▲ 94,220.00",
    "DXY ▼ 103.12",
  ];
  const text = items.join("   ·   ");
  const scrollX = -(frame * speed * 1.1) % (WIDTH * 2.4);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        height: WIDTH * 0.036,
        overflow: "hidden",
        borderTop: `1px solid rgba(212,175,55,0.18)`,
        borderBottom: `1px solid rgba(212,175,55,0.18)`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          fontFamily: FONT,
          fontSize: WIDTH * 0.024,
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: GOLD,
          transform: `translateX(${scrollX}px)`,
          opacity: 0.72,
          textShadow: `0 0 12px rgba(212,175,55,0.6)`,
        }}
      >
        {text + "   ·   " + text + "   ·   " + text}
      </div>
    </div>
  );
};

/* HUD corner element */
const HudCorner: React.FC<{
  pos: React.CSSProperties;
  label: string;
  value: string;
  sub: string;
  color?: string;
  alpha?: number;
}> = ({ pos, label, value, sub, color = GOLD, alpha = 1 }) => (
  <div
    style={{
      position: "absolute",
      ...pos,
      background: "rgba(4,4,8,0.82)",
      border: `1px solid rgba(212,175,55,0.38)`,
      borderRadius: WIDTH * 0.022,
      padding: `${WIDTH * 0.018}px ${WIDTH * 0.024}px`,
      minWidth: WIDTH * 0.24,
      opacity: alpha,
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.019,
        color: "rgba(212,175,55,0.7)",
        fontWeight: 700,
        letterSpacing: "0.1em",
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.036,
        fontWeight: 800,
        color,
        textShadow: `0 0 14px ${color}88`,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: WIDTH * 0.017,
        color: "rgba(255,255,255,0.38)",
        marginTop: 3,
      }}
    >
      {sub}
    </div>
  </div>
);

/* Grid HUD overlay lines */
const HudGrid: React.FC<{ alpha: number }> = ({ alpha }) => (
  <svg
    style={{ position: "absolute", inset: 0, opacity: alpha, pointerEvents: "none" }}
    width={WIDTH}
    height={HEIGHT}
  >
    {[0.2, 0.4, 0.6, 0.8].map((t) => (
      <line
        key={t}
        x1={0}
        y1={HEIGHT * t}
        x2={WIDTH}
        y2={HEIGHT * t}
        stroke={`rgba(212,175,55,0.08)`}
        strokeWidth={0.8}
      />
    ))}
    {[0.25, 0.5, 0.75].map((t) => (
      <line
        key={t}
        x1={WIDTH * t}
        y1={0}
        x2={WIDTH * t}
        y2={HEIGHT}
        stroke={`rgba(212,175,55,0.08)`}
        strokeWidth={0.8}
      />
    ))}
    {/* Corner bracket marks */}
    {(
      [
        [0, 0, 1, 1],
        [WIDTH, 0, -1, 1],
        [0, HEIGHT, 1, -1],
        [WIDTH, HEIGHT, -1, -1],
      ] as [number, number, number, number][]
    ).map(([cx, cy, dx, dy], i) => (
      <g key={i}>
        <line
          x1={cx}
          y1={cy}
          x2={cx + dx * 50}
          y2={cy}
          stroke={`rgba(212,175,55,0.55)`}
          strokeWidth={2}
        />
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy + dy * 50}
          stroke={`rgba(212,175,55,0.55)`}
          strokeWidth={2}
        />
      </g>
    ))}
  </svg>
);

/* Animated MA line chart */
const PriceLine: React.FC<{ frame: number; alpha: number }> = ({
  frame,
  alpha,
}) => {
  const pts = [
    [0, 0.72],
    [0.07, 0.68],
    [0.13, 0.65],
    [0.19, 0.6],
    [0.26, 0.55],
    [0.32, 0.58],
    [0.38, 0.52],
    [0.44, 0.47],
    [0.5, 0.42],
    [0.56, 0.45],
    [0.63, 0.38],
    [0.7, 0.34],
    [0.77, 0.29],
    [0.84, 0.26],
    [0.9, 0.22],
    [1, 0.2],
  ];
  const offset = (frame * 0.8) % WIDTH;
  const svgPts = pts
    .map(([x, y]) => `${x * WIDTH + offset},${y * HEIGHT}`)
    .join(" ");
  return (
    <svg
      style={{ position: "absolute", inset: 0, opacity: alpha, pointerEvents: "none" }}
      width={WIDTH}
      height={HEIGHT}
    >
      <defs>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polyline
        points={svgPts}
        fill="none"
        stroke={`rgba(212,175,55,0.22)`}
        strokeWidth={12}
        filter="url(#glow2)"
      />
      <polyline
        points={svgPts}
        fill="none"
        stroke={GOLD}
        strokeWidth={2.5}
        filter="url(#glow2)"
      />
    </svg>
  );
};

export const VipScene2: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = Math.floor(frame / CUT);
  const local = frame - cut * CUT;

  /* Entrance alpha for each cut (fades in after flash) */
  const cutIn = interpolate(local, [FLASH, FLASH + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Shared glow that pulses */
  const glowPulse = 0.04 + 0.02 * Math.sin(frame * 0.08);

  /* SKILL PIPS text for cuts 6-7 */
  const logoAlpha =
    cut >= 6
      ? interpolate(frame - 6 * CUT, [FLASH, FLASH + 30], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const logoScale =
    cut >= 6
      ? interpolate(frame - 6 * CUT, [FLASH, FLASH + 35], [0.7, 1], {
          easing: Easing.out(Easing.back(1.5)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  /* Glow pulse for cut 7 (logo pulse) */
  const logoPulse = cut >= 7 ? 0.7 + 0.3 * Math.sin(frame * 0.18) : 0.7;

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* ── CUT 0: Full-screen chart ───────────────────── */}
      {cut === 0 && (
        <>
          <CandleChart
            x={0}
            y={HEIGHT * 0.1}
            width={WIDTH}
            height={HEIGHT * 0.75}
            alpha={0.55 * cutIn}
            speed={1.2}
            seed={0}
          />
          <Ticker y={HEIGHT * 0.07} frame={frame} speed={1.5} />
          <Ticker y={HEIGHT * 0.88} frame={frame} speed={-1.2} />
          <HudGrid alpha={0.7 * cutIn} />
          <HudCorner
            pos={{ top: "18%", right: "4%" }}
            label="XAUUSD"
            value="3,340.20"
            sub="▲ +1.24% today"
            color="#4ade80"
            alpha={cutIn}
          />
        </>
      )}

      {/* ── CUT 1: Dashboard HUD ───────────────────────── */}
      {cut === 1 && (
        <>
          <CandleChart
            x={0}
            y={HEIGHT * 0.35}
            width={WIDTH}
            height={HEIGHT * 0.5}
            alpha={0.28 * cutIn}
            speed={0.9}
            seed={3}
          />
          <HudGrid alpha={0.5 * cutIn} />
          <Ticker y={HEIGHT * 0.3} frame={frame} speed={1.8} />
          <HudCorner
            pos={{ top: "8%", left: "4%" }}
            label="WIN RATE"
            value="78.4%"
            sub="last 30 signals"
            color={GOLD}
            alpha={cutIn}
          />
          <HudCorner
            pos={{ top: "8%", right: "4%" }}
            label="SIGNALS"
            value="1,240+"
            sub="all-time issued"
            color={GOLD}
            alpha={cutIn}
          />
          <HudCorner
            pos={{ top: "46%", left: "4%" }}
            label="AVG ROI"
            value="+340 pips"
            sub="per trade avg"
            color="#4ade80"
            alpha={cutIn}
          />
          <HudCorner
            pos={{ top: "46%", right: "4%" }}
            label="MEMBERS"
            value="1,000+"
            sub="active traders"
            color={GOLD}
            alpha={cutIn}
          />
        </>
      )}

      {/* ── CUT 2: Gold price-line close-up ───────────── */}
      {cut === 2 && (
        <>
          <PriceLine frame={frame} alpha={0.9 * cutIn} />
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "5%",
              fontFamily: FONT,
              fontSize: WIDTH * 0.046,
              fontWeight: 800,
              color: GOLD,
              textShadow: `0 0 28px rgba(212,175,55,0.9)`,
              opacity: cutIn,
              letterSpacing: "0.04em",
            }}
          >
            XAUUSD
          </div>
          <div
            style={{
              position: "absolute",
              top: "24%",
              left: "5%",
              fontFamily: FONT,
              fontSize: WIDTH * 0.072,
              fontWeight: 900,
              color: "#4ade80",
              textShadow: `0 0 22px rgba(74,222,128,0.7)`,
              opacity: cutIn,
            }}
          >
            3,340.20
          </div>
          <div
            style={{
              position: "absolute",
              top: "33%",
              left: "5%",
              fontFamily: FONT,
              fontSize: WIDTH * 0.028,
              fontWeight: 400,
              color: "rgba(74,222,128,0.8)",
              opacity: cutIn,
              letterSpacing: "0.08em",
            }}
          >
            ▲ +1.24% · +41.20
          </div>
          <HudGrid alpha={0.35 * cutIn} />
        </>
      )}

      {/* ── CUT 3: Luxury stat cards ───────────────────── */}
      {cut === 3 && (
        <>
          {[
            {
              top: "12%",
              label: "TOTAL PIP GAINS",
              value: "+8,450",
              sub: "Q1 2025",
              col: GOLD,
            },
            {
              top: "34%",
              label: "SIGNALS SENT",
              value: "1,240+",
              sub: "all time",
              col: GOLD,
            },
            {
              top: "56%",
              label: "SUCCESS RATE",
              value: "78.4%",
              sub: "verified",
              col: "#4ade80",
            },
            {
              top: "78%",
              label: "COMMUNITY",
              value: "1,000+",
              sub: "traders",
              col: GOLD,
            },
          ].map(({ top, label, value, sub, col }, i) => {
            const delay = i * 10;
            const a = interpolate(local - FLASH - delay, [0, 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  top,
                  left: "5%",
                  right: "5%",
                  background:
                    "linear-gradient(135deg, rgba(14,12,8,0.95) 0%, rgba(20,16,8,0.9) 100%)",
                  border: `1px solid rgba(212,175,55,${0.4 * a})`,
                  borderRadius: WIDTH * 0.03,
                  padding: `${WIDTH * 0.025}px ${WIDTH * 0.035}px`,
                  opacity: a,
                  transform: `translateX(${(1 - a) * -30}px)`,
                  boxShadow: `inset 0 0 40px rgba(212,175,55,0.04), 0 0 20px rgba(0,0,0,0.6)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: WIDTH * 0.02,
                    color: "rgba(212,175,55,0.6)",
                    letterSpacing: "0.14em",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: WIDTH * 0.058,
                    fontWeight: 900,
                    color: col,
                    textShadow: `0 0 20px ${col}88`,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: WIDTH * 0.018,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 4,
                  }}
                >
                  {sub}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* ── CUT 4: Multiple chart layers ───────────────── */}
      {cut === 4 && (
        <>
          <CandleChart
            x={0}
            y={0}
            width={WIDTH}
            height={HEIGHT * 0.5}
            alpha={0.48 * cutIn}
            speed={1.8}
            seed={7}
          />
          <CandleChart
            x={0}
            y={HEIGHT * 0.5}
            width={WIDTH}
            height={HEIGHT * 0.5}
            alpha={0.35 * cutIn}
            speed={-1.4}
            seed={14}
          />
          <HudGrid alpha={0.4 * cutIn} />
          <Ticker y={HEIGHT * 0.48} frame={frame} speed={2.2} />
          {/* Center divider */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)`,
              opacity: cutIn,
            }}
          />
        </>
      )}

      {/* ── CUT 5: Particle storm + abstract ──────────── */}
      {cut === 5 && (
        <>
          <div style={{ opacity: cutIn, position: "absolute", inset: 0 }}>
            <Particles count={220} speedMult={1.4} />
          </div>
          <CandleChart
            x={0}
            y={HEIGHT * 0.15}
            width={WIDTH}
            height={HEIGHT * 0.7}
            alpha={0.18 * cutIn}
            speed={2.5}
            seed={22}
          />
          {/* Abstract center ring */}
          <AbsoluteFill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: cutIn,
            }}
          >
            <div
              style={{
                width: WIDTH * 0.6,
                height: WIDTH * 0.6,
                borderRadius: "50%",
                border: `2px solid rgba(212,175,55,${
                  0.35 + 0.2 * Math.sin(frame * 0.15)
                })`,
                boxShadow: `0 0 60px rgba(212,175,55,0.15), inset 0 0 60px rgba(212,175,55,0.06)`,
              }}
            />
          </AbsoluteFill>
        </>
      )}

      {/* ── CUTS 6-7: SKILL PIPS logo reveal ─────────── */}
      {cut >= 6 && (
        <>
          <CandleChart
            x={0}
            y={HEIGHT * 0.12}
            width={WIDTH}
            height={HEIGHT * 0.76}
            alpha={0.14 * logoAlpha}
            speed={1.0}
            seed={5}
          />
          <div style={{ opacity: logoAlpha * 0.5, position: "absolute", inset: 0 }}>
            <Particles count={120} speedMult={0.8} />
          </div>

          {/* Radial glow behind logo */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse 80% 45% at 50% 50%, rgba(212,175,55,${
                glowPulse * logoPulse * logoAlpha
              }) 0%, transparent 65%)`,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />

          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SkillPipsLogo
              size={WIDTH * 0.62}
              uid="sp2logo"
              style={{
                opacity: logoAlpha,
                transform: `scale(${logoScale})`,
                filter: `drop-shadow(0 0 ${WIDTH * 0.055}px rgba(212,175,55,${0.7 * logoPulse}))`,
              }}
            />
          </AbsoluteFill>
        </>
      )}

      {/* ── Ambient background glow ─────────────────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 45% at 50% 55%, rgba(212,175,55,${glowPulse}) 0%, transparent 60%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      {/* ── Cut flash ───────────────────────────────── */}
      <Flash frame={frame} />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 50%, transparent 22%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
