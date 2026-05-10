import React from "react";
import { GOLD } from "../constants";

interface Props {
  width: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  showSweep?: boolean;
  sweepOffset?: number; /* 0-1 position of shimmer sweep */
}

export const Phone: React.FC<Props> = ({
  width,
  children,
  style,
  showSweep = false,
  sweepOffset = 0,
}) => {
  const height = (width * 852) / 393;
  const br = width * 0.115;
  const screenBr = br * 0.91;

  const sweep = sweepOffset * 200 - 50; /* -50 to 150, percent offset */

  return (
    <div
      style={{
        width,
        height,
        borderRadius: br,
        background:
          "linear-gradient(160deg, #242426 0%, #1a1a1c 20%, #2c2c2e 50%, #1a1a1c 70%, #262628 100%)",
        boxShadow: [
          "0 0 0 1px #2a2a2c",
          `0 0 0 ${width * 0.007}px ${GOLD}`,
          `0 0 0 ${width * 0.011}px #111`,
          `0 0 0 ${width * 0.013}px rgba(212,175,55,0.2)`,
          `0 0 ${width * 0.12}px rgba(212,175,55,0.14)`,
          `0 ${width * 0.1}px ${width * 0.22}px rgba(0,0,0,0.95)`,
          "inset 0 1px 0 rgba(255,255,255,0.1)",
        ].join(", "),
        position: "relative",
        flexShrink: 0,
        overflow: "visible",
        ...style,
      }}
    >
      {/* Screen */}
      <div
        style={{
          position: "absolute",
          top: "1.4%", left: "2%", right: "2%", bottom: "1.4%",
          borderRadius: screenBr,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: width * 0.024,
            left: "50%",
            transform: "translateX(-50%)",
            width: "34%",
            height: width * 0.066,
            background: "#000",
            borderRadius: width * 0.04,
            zIndex: 10,
          }}
        />
        {children}
      </div>

      {/* Gold shimmer sweep */}
      {showSweep && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: br,
            background: `linear-gradient(110deg, transparent ${sweep - 12}%, rgba(212,175,55,0.22) ${sweep}%, rgba(255,215,0,0.08) ${sweep + 4}%, transparent ${sweep + 16}%)`,
            zIndex: 20,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        />
      )}

      {/* Side buttons */}
      {[
        { top: "24%", height: "9%" },
        { top: "37%", height: "6%" },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -3,
            top: b.top,
            width: 2.5,
            height: b.height,
            background: "linear-gradient(to bottom, #3a3a3c, #2a2a2a)",
            borderRadius: "2px 0 0 2px",
          }}
        />
      ))}
    </div>
  );
};
