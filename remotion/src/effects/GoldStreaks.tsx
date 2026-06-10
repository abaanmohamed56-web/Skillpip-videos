import React from "react";
import { useCurrentFrame } from "remotion";
import { WIDTH, HEIGHT, GOLD, GOLD_B } from "../constants";

function lcg(seed: number): number {
  return (((seed * 1664525 + 1013904223) >>> 0) / 4294967296);
}

interface GoldStreaksProps {
  count?: number;
  intensity?: number;
}

export const GoldStreaks: React.FC<GoldStreaksProps> = ({
  count = 14,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  const streaks = Array.from({ length: count }, (_, i) => {
    const s = (n: number) => lcg(i * 17 + n);
    const angle = -35 + s(0) * 50; // -35° to +15° from horizontal
    const startX = s(1) * WIDTH * 1.4 - WIDTH * 0.2;
    const startY = s(2) * HEIGHT * 1.4 - HEIGHT * 0.2;
    const speed = 4 + s(3) * 8;
    const length = WIDTH * (0.08 + s(4) * 0.22);
    const width = 0.5 + s(5) * 1.5;
    const lifetime = 18 + Math.floor(s(6) * 30);
    const birthFrame = Math.floor(s(7) * 120);
    const cycleLen = lifetime + Math.floor(s(8) * 40);

    const localF = ((frame - birthFrame) % cycleLen + cycleLen) % cycleLen;
    if (localF > lifetime) return null;

    const progress = localF / lifetime;
    const rad = (angle * Math.PI) / 180;
    const x = startX + Math.cos(rad) * localF * speed;
    const y = startY + Math.sin(rad) * localF * speed;

    const opacity =
      Math.min(progress * 6, 1) * Math.max(0, 1 - (progress - 0.4) / 0.6);

    const isGold = s(9) > 0.3;

    return { x, y, length, width, angle, opacity, isGold };
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        mixBlendMode: "screen",
        overflow: "hidden",
      }}
    >
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {streaks.map((s, i) => {
            if (!s) return null;
            const rad = (s.angle * Math.PI) / 180;
            const ex = s.x + Math.cos(rad) * s.length;
            const ey = s.y + Math.sin(rad) * s.length;
            const col = s.isGold ? GOLD_B : "#fff";
            return (
              <linearGradient
                key={i}
                id={`gs${i}`}
                x1={s.x} y1={s.y} x2={ex} y2={ey}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor={col} stopOpacity="0" />
                <stop offset="50%"  stopColor={col} stopOpacity={s.opacity * intensity} />
                <stop offset="100%" stopColor={col} stopOpacity="0" />
              </linearGradient>
            );
          })}
        </defs>
        {streaks.map((s, i) => {
          if (!s) return null;
          const rad = (s.angle * Math.PI) / 180;
          const ex = s.x + Math.cos(rad) * s.length;
          const ey = s.y + Math.sin(rad) * s.length;
          return (
            <line
              key={i}
              x1={s.x} y1={s.y} x2={ex} y2={ey}
              stroke={`url(#gs${i})`}
              strokeWidth={s.width}
            />
          );
        })}
      </svg>
    </div>
  );
};
