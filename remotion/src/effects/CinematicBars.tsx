import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HEIGHT } from "../constants";

const BAR_H = HEIGHT * 0.072; // 2.39:1 letterbox

export const CinematicBars: React.FC = () => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [0, 45], [0, BAR_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: h,
          background: "#000",
          zIndex: 100,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: h,
          background: "#000",
          zIndex: 100,
        }}
      />
    </>
  );
};
