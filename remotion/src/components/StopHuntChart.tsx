import React from "react";
import { interpolate } from "remotion";
import { GOLD, FONT, RED, GREEN } from "../constants";

// XAUUSD stop-hunt scenario: price drops to support 3287,
// wick sweeps to 3268, candle closes above, reverses to 3358
const CANDLES = [
  { o: 3320, c: 3308, h: 3325, l: 3305 }, // 0
  { o: 3308, c: 3301, h: 3312, l: 3297 }, // 1
  { o: 3301, c: 3295, h: 3305, l: 3292 }, // 2
  { o: 3295, c: 3292, h: 3300, l: 3289 }, // 3
  { o: 3292, c: 3290, h: 3296, l: 3286 }, // 4 – touching support
  { o: 3290, c: 3293, h: 3295, l: 3268 }, // 5 – STOP HUNT (wick to 3268)
  { o: 3293, c: 3306, h: 3309, l: 3291 }, // 6
  { o: 3306, c: 3318, h: 3322, l: 3304 }, // 7 – TP1 area
  { o: 3318, c: 3328, h: 3332, l: 3315 }, // 8
  { o: 3328, c: 3340, h: 3345, l: 3325 }, // 9 – TP2 hit
  { o: 3340, c: 3334, h: 3343, l: 3330 }, // 10 – pullback
  { o: 3334, c: 3358, h: 3362, l: 3332 }, // 11 – TP3 hit
];

export const SUPPORT      = 3287;
export const STOP_HUNT_LOW = 3268;
export const TP1          = 3318;
export const TP2          = 3340;
export const TP3          = 3358;
export const HUNT_IDX     = 5;

const PMIN  = 3255;
const PMAX  = 3378;
const PRANGE = PMAX - PMIN;

interface Props {
  width:  number;
  height: number;
  /** 0–1 drives the full animation */
  progress: number;
  showSupport?:     boolean;
  showStopZone?:    boolean;
  showTargets?:     boolean;
  showAnnotations?: boolean;
}

export const StopHuntChart: React.FC<Props> = ({
  width, height, progress,
  showSupport     = true,
  showStopZone    = false,
  showTargets     = false,
  showAnnotations = false,
}) => {
  const PL = width * 0.04;
  const PR = width * 0.04;
  const PT = height * 0.06;
  const PB = height * 0.04;
  const cW = (width - PL - PR) / CANDLES.length;
  const bW = cW * 0.62;

  const toY = (p: number) => PT + ((PMAX - p) / PRANGE) * (height - PT - PB);
  const toX = (i: number) => PL + (i + 0.5) * cW;

  // Animation timeline:
  // 0.00–0.45  pre-hunt candles 0–4
  // 0.45–0.72  hunt candle (body @ 0.45, wick sweeps 0.58–0.95)
  // 0.72–1.00  post-hunt candles 6–11
  const preP  = Math.min(progress / 0.45, 1);
  const huntP = progress < 0.45 ? 0 : Math.min((progress - 0.45) / 0.27, 1);
  const postP = progress < 0.72 ? 0 : Math.min((progress - 0.72) / 0.28, 1);

  const supportY     = toY(SUPPORT);
  const stopHuntLowY = toY(STOP_HUNT_LOW);
  const tp1Y = toY(TP1);
  const tp2Y = toY(TP2);
  const tp3Y = toY(TP3);

  const hc       = CANDLES[HUNT_IDX];
  const hBTop    = toY(Math.max(hc.o, hc.c));
  const hBBot    = toY(Math.min(hc.o, hc.c));
  const hWickTop = toY(hc.h);
  const hBodyAlpha = Math.min(huntP / 0.28, 1);

  const wickBotY =
    huntP < 0.55
      ? hBBot
      : interpolate(huntP, [0.55, 0.95], [hBBot, stopHuntLowY], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const wickGlow = huntP > 0.72 ? Math.min((huntP - 0.72) / 0.23, 1) : 0;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <filter id="sh-glow-gold" x="-30%" y="-200%" width="160%" height="500%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sh-glow-red" x="-60%" y="-100%" width="220%" height="300%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sh-glow-green" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="sh-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={GOLD} />
        </marker>
      </defs>

      {/* Background grid */}
      {[PMIN + 20, 3280, SUPPORT, 3300, 3320, TP1, 3330, TP2, 3350, TP3].map((p, i) => (
        <line key={i} x1={PL} y1={toY(p)} x2={width - PR} y2={toY(p)}
          stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
      ))}

      {/* Stop zone fill */}
      {showStopZone && (
        <rect
          x={PL} y={supportY}
          width={width - PL - PR}
          height={stopHuntLowY - supportY}
          fill="rgba(239,68,68,0.10)"
        />
      )}

      {/* Support line – glowing gold */}
      {showSupport && (
        <g>
          <line x1={PL} y1={supportY} x2={width - PR} y2={supportY}
            stroke="rgba(212,175,55,0.35)" strokeWidth={14}
            filter="url(#sh-glow-gold)" />
          <line x1={PL} y1={supportY} x2={width - PR} y2={supportY}
            stroke={GOLD} strokeWidth={1.5} />
          <text x={PL + 5} y={supportY - 7}
            fill={GOLD} fontSize={width * 0.022} fontFamily={FONT} fontWeight="700"
            letterSpacing="0.06em">
            SUPPORT
          </text>
          <text x={width - PR - 5} y={supportY - 7}
            fill={`rgba(212,175,55,0.7)`} fontSize={width * 0.018} fontFamily={FONT}
            fontWeight="600" textAnchor="end">
            3,287
          </text>
        </g>
      )}

      {/* Stop zone label */}
      {showStopZone && (
        <text
          x={PL + 5} y={supportY + (stopHuntLowY - supportY) * 0.55}
          fill="rgba(239,68,68,0.85)" fontSize={width * 0.020} fontFamily={FONT}
          fontWeight="700" letterSpacing="0.06em">
          STOP LOSS ZONE
        </text>
      )}

      {/* Target lines */}
      {showTargets && (
        <g opacity={Math.min(postP * 3, 1)}>
          {([{ y: tp1Y, label: "TP1  3,318", delay: 0 },
             { y: tp2Y, label: "TP2  3,340", delay: 0.33 },
             { y: tp3Y, label: "TP3  3,358", delay: 0.66 }] as const).map(({ y, label, delay }) => {
            const a = Math.min(Math.max(postP * 3 - delay * 3, 0), 1);
            return (
              <g key={label} opacity={a}>
                <line x1={PL} y1={y} x2={width - PR} y2={y}
                  stroke="rgba(34,197,94,0.55)" strokeWidth={1} strokeDasharray="8 4" />
                <text x={width - PR - 5} y={y - 6}
                  fill={GREEN} fontSize={width * 0.021} fontFamily={FONT}
                  fontWeight="700" textAnchor="end" letterSpacing="0.04em">
                  {label}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* Pre-hunt candles 0–4 */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = Math.min(preP * 5 - i, 1);
        if (a <= 0) return null;
        const c = CANDLES[i];
        const x = toX(i);
        const isUp = c.c >= c.o;
        const col = isUp ? GREEN : RED;
        const bTop = toY(Math.max(c.o, c.c));
        const bBot = toY(Math.min(c.o, c.c));
        return (
          <g key={i} opacity={a}>
            <line x1={x} y1={toY(c.h)} x2={x} y2={bTop} stroke={col} strokeWidth={1.5} />
            <line x1={x} y1={bBot}     x2={x} y2={toY(c.l)} stroke={col} strokeWidth={1.5} />
            <rect x={x - bW / 2} y={bTop} width={bW} height={Math.max(bBot - bTop, 2)}
              fill={col} fillOpacity={0.88} rx={1.5} />
          </g>
        );
      })}

      {/* Hunt candle (5) */}
      {huntP > 0 && (() => {
        const x = toX(HUNT_IDX);
        const isUp = hc.c >= hc.o;
        const col = isUp ? GREEN : RED;
        return (
          <g opacity={hBodyAlpha}>
            {/* Upper wick */}
            {huntP > 0.28 && (
              <line x1={x} y1={hWickTop} x2={x} y2={hBTop} stroke={col} strokeWidth={1.5} />
            )}
            {/* Body */}
            <rect x={x - bW / 2} y={hBTop} width={bW} height={Math.max(hBBot - hBTop, 2)}
              fill={col} fillOpacity={0.88} rx={1.5} />
            {/* Lower wick – the dramatic stop hunt sweep */}
            {huntP > 0.55 && (
              <>
                {wickGlow > 0 && (
                  <line x1={x} y1={hBBot} x2={x} y2={wickBotY}
                    stroke={`rgba(239,68,68,${0.38 * wickGlow})`}
                    strokeWidth={10} filter="url(#sh-glow-red)" />
                )}
                <line x1={x} y1={hBBot} x2={x} y2={wickBotY}
                  stroke={RED} strokeWidth={2.5} />
                {/* Pulse ring at wick tip when it crosses support */}
                {huntP > 0.72 && (
                  <circle cx={x} cy={wickBotY} r={bW * 0.8 * wickGlow}
                    fill="none" stroke={`rgba(239,68,68,${0.6 * wickGlow})`} strokeWidth={1.5} />
                )}
              </>
            )}
          </g>
        );
      })()}

      {/* Post-hunt candles 6–11 */}
      {[6, 7, 8, 9, 10, 11].map((ci, si) => {
        const a = Math.min(postP * 6 - si, 1);
        if (a <= 0) return null;
        const c = CANDLES[ci];
        const x = toX(ci);
        const isUp = c.c >= c.o;
        const col = isUp ? GREEN : RED;
        const bTop = toY(Math.max(c.o, c.c));
        const bBot = toY(Math.min(c.o, c.c));
        return (
          <g key={ci} opacity={a}>
            {si === 0 && (
              <g filter="url(#sh-glow-green)" opacity={0.5}>
                <rect x={x - bW / 2} y={bTop} width={bW} height={Math.max(bBot - bTop, 2)}
                  fill={GREEN} rx={1.5} />
              </g>
            )}
            <line x1={x} y1={toY(c.h)} x2={x} y2={bTop} stroke={col} strokeWidth={1.5} />
            <line x1={x} y1={bBot}     x2={x} y2={toY(c.l)} stroke={col} strokeWidth={1.5} />
            <rect x={x - bW / 2} y={bTop} width={bW} height={Math.max(bBot - bTop, 2)}
              fill={col} fillOpacity={0.88} rx={1.5} />
          </g>
        );
      })}

      {/* Sweep annotation */}
      {showAnnotations && huntP >= 0.95 && (
        <g opacity={Math.min((huntP - 0.95) / 0.05, 1)}>
          <line
            x1={toX(HUNT_IDX) + bW * 0.8}
            y1={(hBBot + stopHuntLowY) / 2}
            x2={toX(HUNT_IDX) + bW * 0.8 + width * 0.11}
            y2={(hBBot + stopHuntLowY) / 2}
            stroke={GOLD} strokeWidth={1.5} markerEnd="url(#sh-arrow)" />
          <text
            x={toX(HUNT_IDX) + bW * 0.8 + width * 0.13}
            y={(hBBot + stopHuntLowY) / 2 + 5}
            fill={GOLD} fontSize={width * 0.025} fontFamily={FONT} fontWeight="800">
            THE SWEEP
          </text>
        </g>
      )}

      {/* Entry label */}
      {showAnnotations && postP > 0.12 && (
        <g opacity={Math.min((postP - 0.12) / 0.15, 1)}>
          <text
            x={toX(6)} y={toY(3306) - 10}
            fill={GREEN} fontSize={width * 0.023} fontFamily={FONT}
            fontWeight="800" textAnchor="middle">
            ENTRY ▲
          </text>
        </g>
      )}
    </svg>
  );
};
