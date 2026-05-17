import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { WIDTH, HEIGHT } from "./constants";
import { VipScene1 } from "./vip-scenes/VipScene1";
import { VipScene2 } from "./vip-scenes/VipScene2";
import { VipScene3 } from "./vip-scenes/VipScene3";
import { VipScene4 } from "./vip-scenes/VipScene4";
import { VipScene5 } from "./vip-scenes/VipScene5";

/* ─────────────────────────────────────────────────────────
   SKILL PIPS VIP 2.0 — Cinematic Sneak Peek Trailer
   38 s · 60 fps · 1080 × 1920 (9:16 vertical)

   Scene layout (all frames absolute):
     S1  Opening Darkness      0  – 240  (4 s)
     S2  Fast Montage        240  – 720  (8 s)
     S3  Intensity Build     720  – 1320 (10 s)
     S4  The Tease          1320  – 1800 (8 s)
     S5  Final Drop         1800  – 2280 (8 s)
───────────────────────────────────────────────────────── */
export const VIP_SCENES = {
  S1: { from: 0,    duration: 240  },
  S2: { from: 240,  duration: 480  },
  S3: { from: 720,  duration: 600  },
  S4: { from: 1320, duration: 480  },
  S5: { from: 1800, duration: 480  },
} as const;

export const VIP_DURATION = 2280;
export const VIP_FPS      = 60;

/* Cross-fade wrapper — fades in over first FADE frames, out over last FADE */
const FADE = 25;
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

/* Cinematic letter-box bars */
const LetterBox: React.FC = () => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [8, 60], [0, HEIGHT * 0.042], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000", zIndex: 40 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000", zIndex: 40 }} />
    </>
  );
};

export const VipTrailer: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* S1 — Opening Darkness */}
    <Sequence from={VIP_SCENES.S1.from} durationInFrames={VIP_SCENES.S1.duration + FADE}>
      <Faded duration={VIP_SCENES.S1.duration}>
        <VipScene1 />
      </Faded>
    </Sequence>

    {/* S2 — Fast Montage */}
    <Sequence from={VIP_SCENES.S2.from} durationInFrames={VIP_SCENES.S2.duration + FADE}>
      <Faded duration={VIP_SCENES.S2.duration}>
        <VipScene2 />
      </Faded>
    </Sequence>

    {/* S3 — Intensity Build */}
    <Sequence from={VIP_SCENES.S3.from} durationInFrames={VIP_SCENES.S3.duration + FADE}>
      <Faded duration={VIP_SCENES.S3.duration}>
        <VipScene3 />
      </Faded>
    </Sequence>

    {/* S4 — The Tease */}
    <Sequence from={VIP_SCENES.S4.from} durationInFrames={VIP_SCENES.S4.duration + FADE}>
      <Faded duration={VIP_SCENES.S4.duration}>
        <VipScene4 />
      </Faded>
    </Sequence>

    {/* S5 — Final Drop */}
    <Sequence from={VIP_SCENES.S5.from} durationInFrames={VIP_SCENES.S5.duration}>
      <VipScene5 />
    </Sequence>

    {/* Global cinematic letter-box */}
    <LetterBox />
  </AbsoluteFill>
);
