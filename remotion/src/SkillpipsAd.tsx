/**
 * SkillpipsAd — main composition.
 * 60 s · 1920×1080 · 30 fps
 * 7 scenes, cross-faded with cinematic letterbox bars, captions, and vignette.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SCENES, CAPTIONS, FONT, WIDTH, HEIGHT } from "./constants";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";
import { CinematicBars } from "./effects/CinematicBars";

// ── Cross-fade wrapper ────────────────────────────────────────────────────────
const FADE = 22; // frames (~0.73 s at 30 fps)

const Faded: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE, duration - FADE, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// ── Caption / subtitle overlay ────────────────────────────────────────────────
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const caption = CAPTIONS.find((c) => frame >= c.from && frame <= c.to);
  if (!caption) return null;

  const progress = interpolate(
    frame,
    [caption.from, caption.from + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    frame,
    [caption.to - 14, caption.to],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60 }}>
      <div
        style={{
          position: "absolute",
          bottom: "8.5%",
          left: "5%",
          right: "5%",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: WIDTH * 0.018,
          fontWeight: 300,
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.88)",
          textShadow:
            "0 2px 16px rgba(0,0,0,0.98), 0 0 30px rgba(0,0,0,0.75)",
          opacity: progress * fadeOut,
          transform: `translateY(${(1 - progress) * 10}px)`,
        }}
      >
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};

// ── Film grain (subtle static noise) ─────────────────────────────────────────
const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  // Shift pattern per-frame to look like film grain
  const shift = (frame * 37) % 200;
  return (
    <AbsoluteFill
      style={{
        opacity: 0.022,
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundPosition: `${shift}px ${(shift * 1.3) % 200}px`,
        mixBlendMode: "overlay",
        zIndex: 70,
      }}
    />
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const SkillpipsAd: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* ── Scenes (each gets extra FADE frames at tail for cross-fade) ── */}

    <Sequence from={SCENES.S1.from} durationInFrames={SCENES.S1.duration + FADE}>
      <Faded duration={SCENES.S1.duration}><Scene1 /></Faded>
    </Sequence>

    <Sequence from={SCENES.S2.from} durationInFrames={SCENES.S2.duration + FADE}>
      <Faded duration={SCENES.S2.duration}><Scene2 /></Faded>
    </Sequence>

    <Sequence from={SCENES.S3.from} durationInFrames={SCENES.S3.duration + FADE}>
      <Faded duration={SCENES.S3.duration}><Scene3 /></Faded>
    </Sequence>

    <Sequence from={SCENES.S4.from} durationInFrames={SCENES.S4.duration + FADE}>
      <Faded duration={SCENES.S4.duration}><Scene4 /></Faded>
    </Sequence>

    <Sequence from={SCENES.S5.from} durationInFrames={SCENES.S5.duration + FADE}>
      <Faded duration={SCENES.S5.duration}><Scene5 /></Faded>
    </Sequence>

    <Sequence from={SCENES.S6.from} durationInFrames={SCENES.S6.duration + FADE}>
      <Faded duration={SCENES.S6.duration}><Scene6 /></Faded>
    </Sequence>

    <Sequence from={SCENES.S7.from} durationInFrames={SCENES.S7.duration}>
      {/* Last scene — no fade-out on tail */}
      <Scene7 />
    </Sequence>

    {/* ── Global overlays ──
        <Captions /> is available but disabled: every scene already renders
        its key text in-frame, so subtitles would duplicate it. */}
    <CinematicBars />
    <FilmGrain />
  </AbsoluteFill>
);
