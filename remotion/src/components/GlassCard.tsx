import React from "react";
import { GOLD } from "../constants";

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  borderColor?: string;
  blur?: number;
  padding?: string | number;
  borderRadius?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  borderColor = "rgba(212,175,55,0.22)",
  blur = 24,
  padding,
  borderRadius = 16,
}) => (
  <div
    style={{
      background: "rgba(5,5,7,0.72)",
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      border: `1px solid ${borderColor}`,
      borderRadius,
      padding,
      ...style,
    }}
  >
    {children}
  </div>
);
