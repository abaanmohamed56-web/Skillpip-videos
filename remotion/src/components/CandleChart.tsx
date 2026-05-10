import React from "react";
import { useCurrentFrame } from "remotion";
import { GOLD } from "../constants";

interface Candle { o: number; c: number; h: number; l: number; }

function genCandles(seed: number, n: number): Candle[] {
  const out: Candle[] = [];
  let p = 3280 + (seed % 120);
  for (let i = 0; i < n; i++) {
    const o = p;
    const hash  = (Math.sin(seed * 9.7  + i * 3.1) * 0.5 + 0.5);
    const hash2 = (Math.sin(seed * 7.3  + i * 5.2) * 0.5 + 0.5);
    const hash3 = (Math.sin(seed * 6.1  + i * 4.7) * 0.5 + 0.5);
    p = Math.max(3100, Math.min(3580, p + (hash - 0.46) * 19));
    const c = p;
    out.push({ o, c, h: Math.max(o, c) + hash2 * 9, l: Math.min(o, c) - hash3 * 9 });
  }
  return out;
}

interface Props {
  x?: number; y?: number;
  width: number; height: number;
  alpha?: number; speed?: number; seed?: number;
}

export const CandleChart: React.FC<Props> = ({
  x = 0, y = 0, width, height,
  alpha = 0.13, speed = 0.65, seed = 0,
}) => {
  const frame  = useCurrentFrame();
  const candles = React.useMemo(() => genCandles(seed, 50), [seed]);

  const cw     = width / 15;
  const scroll = ((frame * speed * 0.025) + seed) % cw;
  const pMin = 3080, pRange = 520;
  const toY = (p: number) => height - ((p - pMin) / pRange) * height;

  return (
    <svg
      style={{ position: "absolute", left: x, top: y, opacity: alpha, overflow: "hidden" }}
      width={width}
      height={height}
    >
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={0} y1={height * i / 4}
          x2={width} y2={height * i / 4}
          stroke="rgba(212,175,55,0.18)"
          strokeWidth={0.5}
        />
      ))}

      {/* Candles */}
      {candles.map((c, i) => {
        const cx = i * cw - scroll;
        if (cx < -cw * 2 || cx > width + cw) return null;
        const isUp = c.c >= c.o;
        const col = isUp ? GOLD : "#7a5b22";
        const bt  = Math.min(toY(c.o), toY(c.c));
        const bh  = Math.max(Math.abs(toY(c.c) - toY(c.o)), 1);
        return (
          <g key={i}>
            <line
              x1={cx + cw * 0.5} y1={toY(c.h)}
              x2={cx + cw * 0.5} y2={toY(c.l)}
              stroke={col} strokeWidth={0.75}
            />
            <rect
              x={cx + 1} y={bt} width={cw - 2} height={bh}
              fill={isUp ? "rgba(212,175,55,0.82)" : "rgba(122,91,34,0.82)"}
            />
          </g>
        );
      })}
    </svg>
  );
};
