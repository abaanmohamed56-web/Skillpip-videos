import React from "react";
import { GOLD, FONT } from "../constants";

interface Props {
  width: number;
  height: number;
}

/* Recreates the screenshot: XAUUSD M2 chart forwarded by Jay + profit messages */
export const TradingScreen: React.FC<Props> = ({ width, height }) => {
  const fs = width * 0.028;

  /* Chart candle data modelled from the screenshot (bearish then bounce) */
  const candles = [
    { o: 4762, c: 4759, h: 4764, l: 4757 },
    { o: 4759, c: 4756, h: 4761, l: 4754 },
    { o: 4756, c: 4758, h: 4760, l: 4754 },
    { o: 4758, c: 4753, h: 4760, l: 4751 },
    { o: 4753, c: 4749, h: 4755, l: 4747 },
    { o: 4749, c: 4751, h: 4753, l: 4747 },
    { o: 4751, c: 4746, h: 4753, l: 4744 },
    { o: 4746, c: 4742, h: 4748, l: 4740 },
    { o: 4742, c: 4744, h: 4746, l: 4740 },
    { o: 4744, c: 4740, h: 4746, l: 4738 },
  ];

  const chartW = width;
  const chartH = height * 0.42;
  const pMin = 4736, pRange = 30;
  const toY = (p: number) => chartH - ((p - pMin) / pRange) * chartH;
  const cw = chartW / (candles.length + 2);

  const priceLabels = [
    { price: 4760.349, color: "#ef5350" },
    { price: 4758.335, color: "#ef5350" },
    { price: 4748.628, color: "#4dd0e1" },
    { price: 4746.000, color: "#ffeb3b" },
    { price: 4741.665, color: "#ffeb3b" },
  ];

  return (
    <div
      style={{
        width,
        height,
        background: "#17212B",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {/* ── Telegram header ── */}
      <div
        style={{
          background: "#232E3C",
          padding: `${width * 0.088}px ${width * 0.025}px ${width * 0.02}px`,
          display: "flex",
          alignItems: "center",
          gap: width * 0.018,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: width * 0.075,
            height: width * 0.075,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: width * 0.026,
            fontWeight: 900,
            color: "#000",
            flexShrink: 0,
          }}
        >
          SP
        </div>
        <div>
          <div style={{ fontSize: fs * 0.92, fontWeight: 700, color: "#fff" }}>
            SKILLPIPS ✓
          </div>
          <div style={{ fontSize: fs * 0.7, color: "rgba(255,255,255,0.42)" }}>
            606 subscribers
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: fs * 0.8, color: "rgba(255,255,255,0.35)" }}>
          🔕
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: `${width * 0.018}px ${width * 0.016}px ${width * 0.01}px`,
          display: "flex",
          flexDirection: "column",
          gap: width * 0.014,
          justifyContent: "flex-end",
        }}
      >
        {/* Chart bubble — Forwarded from Jay */}
        <div
          style={{
            maxWidth: "97%",
            background: "#1f2f3f",
            borderRadius: `${width * 0.025}px ${width * 0.025}px ${width * 0.025}px ${width * 0.005}px`,
            overflow: "hidden",
            border: "1px solid rgba(77,160,77,0.25)",
          }}
        >
          {/* Forwarded header */}
          <div
            style={{
              padding: `${width * 0.014}px ${width * 0.016}px ${width * 0.006}px`,
              borderLeft: `2px solid #4ade80`,
            }}
          >
            <div style={{ fontSize: fs * 0.65, color: "#4ade80", fontWeight: 600 }}>
              Forwarded from
            </div>
            <div style={{ fontSize: fs * 0.65, color: "#4ade80" }}>🟢 Jay</div>
          </div>

          {/* TradingView-style chart */}
          <div style={{ background: "#0d0e0f", position: "relative" }}>
            {/* Chart toolbar row */}
            <div
              style={{
                padding: `${width * 0.008}px ${width * 0.012}px`,
                display: "flex",
                alignItems: "center",
                gap: width * 0.012,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ fontSize: fs * 0.58, color: "#90caf9", fontWeight: 700 }}>
                XAUUSD ▾ M2
              </span>
              <span style={{ fontSize: fs * 0.5, color: "rgba(255,255,255,0.35)" }}>
                Gold vs US Dollar
              </span>
            </div>

            {/* Candlestick SVG */}
            <svg
              width="100%"
              height={chartH}
              viewBox={`0 0 ${chartW} ${chartH}`}
              style={{ display: "block" }}
              preserveAspectRatio="none"
            >
              {/* Supply zone shading */}
              <rect
                x={0} y={toY(4762)} width={chartW}
                height={Math.max(toY(4748) - toY(4762), 0)}
                fill="rgba(239,83,80,0.1)"
              />
              <line x1={0} y1={toY(4762)} x2={chartW} y2={toY(4762)} stroke="rgba(239,83,80,0.4)" strokeWidth={0.6} />
              <line x1={0} y1={toY(4748)} x2={chartW} y2={toY(4748)} stroke="rgba(239,83,80,0.4)" strokeWidth={0.6} />

              {/* Candles */}
              {candles.map((c, i) => {
                const cx = (i + 1) * cw;
                const isUp = c.c >= c.o;
                const col = isUp ? "#4ade80" : "#ef5350";
                const bt = Math.min(toY(c.o), toY(c.c));
                const bh = Math.max(Math.abs(toY(c.c) - toY(c.o)), 1.5);
                return (
                  <g key={i}>
                    <line
                      x1={cx + cw * 0.4} y1={toY(c.h)}
                      x2={cx + cw * 0.4} y2={toY(c.l)}
                      stroke={col} strokeWidth={0.9}
                    />
                    <rect
                      x={cx} y={bt} width={cw * 0.8} height={bh}
                      fill={col}
                    />
                  </g>
                );
              })}

              {/* Price level lines + labels */}
              {priceLabels.map(({ price, color }, i) => (
                <g key={i}>
                  <line
                    x1={0} y1={toY(price)} x2={chartW * 0.72} y2={toY(price)}
                    stroke={color} strokeWidth={0.6} strokeDasharray="2,2" opacity={0.7}
                  />
                  <rect
                    x={chartW * 0.72} y={toY(price) - 5}
                    width={chartW * 0.28} height={10}
                    fill={color} rx={1}
                  />
                  <text
                    x={chartW * 0.73} y={toY(price) + 3.5}
                    fontSize={5.5} fill="#000" fontFamily={FONT} fontWeight="bold"
                  >
                    {price.toFixed(3)}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Message text */}
          <div style={{ padding: `${width * 0.012}px ${width * 0.016}px` }}>
            <div style={{ fontSize: fs * 0.78, color: "#fff", fontWeight: 500 }}>
              Cent acc but its worth 💥💥💥
            </div>
            <div
              style={{
                fontSize: fs * 0.6,
                color: "rgba(255,255,255,0.32)",
                textAlign: "right",
                marginTop: 2,
              }}
            >
              👁 109 · 7:39 PM
            </div>
          </div>
        </div>

        {/* Profit message bubble */}
        <div
          style={{
            maxWidth: "88%",
            background: "#1f2f3f",
            borderRadius: `${width * 0.025}px ${width * 0.025}px ${width * 0.025}px ${width * 0.005}px`,
            padding: `${width * 0.014}px ${width * 0.016}px`,
            border: "1px solid rgba(77,160,77,0.25)",
            borderLeft: `2px solid #4ade80`,
          }}
        >
          <div style={{ fontSize: fs * 0.65, color: "#4ade80", fontWeight: 600 }}>
            Forwarded from
          </div>
          <div style={{ fontSize: fs * 0.65, color: "#4ade80", marginBottom: 4 }}>🟢 Jay</div>
          <div style={{ fontSize: fs * 0.88, color: "#fff", fontWeight: 600 }}>
            100usd in the pocket 🤑🤑🤑
          </div>
          <div
            style={{
              fontSize: fs * 0.6,
              color: "rgba(255,255,255,0.32)",
              textAlign: "right",
              marginTop: 2,
            }}
          >
            👁 105 · 7:39 PM
          </div>
        </div>
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          background: "#232E3C",
          padding: `${width * 0.016}px ${width * 0.022}px`,
          display: "flex",
          alignItems: "center",
          gap: width * 0.014,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: fs, color: "rgba(255,255,255,0.4)" }}>📎</span>
        <div
          style={{
            flex: 1,
            background: "#17212B",
            borderRadius: width * 0.04,
            padding: `${width * 0.012}px ${width * 0.022}px`,
            fontSize: fs * 0.78,
            color: "rgba(255,255,255,0.28)",
          }}
        >
          Broadcast
        </div>
        <span style={{ fontSize: fs, color: "rgba(255,255,255,0.4)" }}>🎙️</span>
      </div>
    </div>
  );
};
