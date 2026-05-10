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

/* Cross-fade wrapper: fades in over first 30 frames, out over last 30 */
const FADE = 30;
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

/* Subtitles overlay */
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const caption = CAPTIONS.find((c) => frame >= c.from && frame <= c.to);
  if (!caption) return null;
  const progress = interpolate(
    frame,
    [caption.from, caption.from + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{ pointerEvents: "none", zIndex: 50 }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          left: "5%",
          right: "5%",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: WIDTH * 0.028,
          fontWeight: 300,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.04em",
          textShadow:
            "0 2px 12px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.7)",
          opacity: progress,
        }}
      >
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};

/* Cinematic top/bottom bars */
const CinematicBars: React.FC = () => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [12, 72], [0, HEIGHT * 0.045], {
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
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: h,
          background: "#000",
          zIndex: 40,
        }}
      />
    </>
  );
};

export const SkillpipsAd: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* Scene 1: Opening Darkness */}
    <Sequence from={SCENES.S1.from} durationInFrames={SCENES.S1.duration + FADE}>
      <Faded duration={SCENES.S1.duration}><Scene1 /></Faded>
    </Sequence>

    {/* Scene 2: iPhone Hero Reveal */}
    <Sequence from={SCENES.S2.from} durationInFrames={SCENES.S2.duration + FADE}>
      <Faded duration={SCENES.S2.duration}><Scene2 /></Faded>
    </Sequence>

    {/* Scene 3: Phone Activation */}
    <Sequence from={SCENES.S3.from} durationInFrames={SCENES.S3.duration + FADE}>
      <Faded duration={SCENES.S3.duration}><Scene3 /></Faded>
    </Sequence>

    {/* Scene 4: Telegram Community */}
    <Sequence from={SCENES.S4.from} durationInFrames={SCENES.S4.duration + FADE}>
      <Faded duration={SCENES.S4.duration}><Scene4 /></Faded>
    </Sequence>

    {/* Scene 5: Cinematic Buildup */}
    <Sequence from={SCENES.S5.from} durationInFrames={SCENES.S5.duration + FADE}>
      <Faded duration={SCENES.S5.duration}><Scene5 /></Faded>
    </Sequence>

    {/* Scene 6: Final Hero Shot */}
    <Sequence from={SCENES.S6.from} durationInFrames={SCENES.S6.duration}>
      <Scene6 />
    </Sequence>

    {/* Global overlays */}
    <CinematicBars />
    <Subtitles />
  </AbsoluteFill>
);
