import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SH_SCENES, SH_CAPTIONS, FONT, WIDTH, HEIGHT } from "./constants";
import { StopHuntScene1 } from "./scenes/StopHuntScene1";
import { StopHuntScene2 } from "./scenes/StopHuntScene2";
import { StopHuntScene3 } from "./scenes/StopHuntScene3";
import { StopHuntScene4 } from "./scenes/StopHuntScene4";
import { StopHuntScene5 } from "./scenes/StopHuntScene5";
import { StopHuntScene6 } from "./scenes/StopHuntScene6";

const FADE = 24; // cross-fade frames

const Faded: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE, duration - FADE, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const caption = SH_CAPTIONS.find((c) => frame >= c.from && frame <= c.to);
  if (!caption) return null;

  const prog = interpolate(
    frame,
    [caption.from, caption.from + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      <div
        style={{
          position: "absolute",
          bottom: "6.5%",
          left: "5%",
          right: "5%",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: WIDTH * 0.030,
          fontWeight: 300,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.80)",
          letterSpacing: "0.04em",
          textShadow:
            "0 2px 14px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.75)",
          opacity: prog,
        }}
      >
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};

export const StopHuntVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={SH_SCENES.S1.from} durationInFrames={SH_SCENES.S1.duration + FADE}>
      <Faded duration={SH_SCENES.S1.duration}><StopHuntScene1 /></Faded>
    </Sequence>

    <Sequence from={SH_SCENES.S2.from} durationInFrames={SH_SCENES.S2.duration + FADE}>
      <Faded duration={SH_SCENES.S2.duration}><StopHuntScene2 /></Faded>
    </Sequence>

    <Sequence from={SH_SCENES.S3.from} durationInFrames={SH_SCENES.S3.duration + FADE}>
      <Faded duration={SH_SCENES.S3.duration}><StopHuntScene3 /></Faded>
    </Sequence>

    <Sequence from={SH_SCENES.S4.from} durationInFrames={SH_SCENES.S4.duration + FADE}>
      <Faded duration={SH_SCENES.S4.duration}><StopHuntScene4 /></Faded>
    </Sequence>

    <Sequence from={SH_SCENES.S5.from} durationInFrames={SH_SCENES.S5.duration + FADE}>
      <Faded duration={SH_SCENES.S5.duration}><StopHuntScene5 /></Faded>
    </Sequence>

    <Sequence from={SH_SCENES.S6.from} durationInFrames={SH_SCENES.S6.duration}>
      <StopHuntScene6 />
    </Sequence>

    <Subtitles />
  </AbsoluteFill>
);
