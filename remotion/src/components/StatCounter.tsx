import React from "react";
import { interpolate } from "remotion";
import { FONT, GOLD, GOLD_B, WIDTH, HEIGHT } from "../constants";

interface StatCounterProps {
  value: string;         // final display value e.g. "89.3%"
  label: string;
  progress: number;      // 0–1 animation progress
  size?: "sm" | "md" | "lg";
  glowColor?: string;
}

// Parse numeric part from value string like "89.3%", "+12,840", "847+"
function parseNumeric(value: string): { prefix: string; num: number; suffix: string } {
  const match = value.match(/^([+\-]?)([\d,]+\.?\d*)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: value };
  const prefix = match[1] || "";
  const num = parseFloat(match[2].replace(/,/g, ""));
  const suffix = match[3] || "";
  return { prefix, num, suffix };
}

function formatNumber(num: number, originalValue: string): string {
  if (originalValue.includes(",")) {
    return Math.round(num).toLocaleString("en-US");
  }
  if (originalValue.includes(".")) {
    const decimals = (originalValue.split(".")[1]?.replace(/[^\d]/g, "") || "").length;
    return num.toFixed(decimals);
  }
  return Math.round(num).toString();
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  progress,
  size = "lg",
  glowColor = GOLD,
}) => {
  const { prefix, num, suffix } = parseNumeric(value);
  const eased = progress < 1
    ? 1 - Math.pow(1 - progress, 3) // ease-out cubic
    : 1;
  const currentNum = num * eased;
  const displayValue = prefix + formatNumber(currentNum, value) + suffix;

  const fontSize = size === "lg" ? WIDTH * 0.052 : size === "md" ? WIDTH * 0.038 : WIDTH * 0.028;
  const labelSize = size === "lg" ? WIDTH * 0.014 : size === "md" ? WIDTH * 0.011 : WIDTH * 0.009;

  const op = Math.min(progress * 3, 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: op,
        transform: `translateY(${(1 - op) * 20}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${fontSize * 0.4}px rgba(212,175,55,0.6))`,
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: labelSize,
          fontWeight: 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          marginTop: labelSize * 0.5,
        }}
      >
        {label}
      </div>
    </div>
  );
};
