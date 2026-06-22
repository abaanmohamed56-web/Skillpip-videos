import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SCENES, BEATS, HEIGHT } from "../constants";
import { smoothstep, clamp01 } from "../anim";
import { WordReveal, WordByWord } from "./Text";

// SVG film grain as a tiled data URI.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export const Overlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Whiteout transition at the finish.
  const white = clamp01(smoothstep(BEATS.FLASH, BEATS.FLASH + 30, frame));
  const filmFade = 1 - white;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* ── Cinematic post FX (fade out as the frame turns white) ── */}
      <AbsoluteFill style={{ opacity: filmFade }}>
        {/* soft bloom haze rising from the finish line area */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            width: "120%",
            height: "55%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(closest-side, rgba(191,233,255,0.18), rgba(191,233,255,0) 70%)",
            opacity: 0.6 + smoothstep(2100, BEATS.CROSS, frame) * 0.5,
            mixBlendMode: "screen",
          }}
        />
        {/* vignette */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 80% at 50% 42%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* film grain */}
        <AbsoluteFill
          style={{
            backgroundImage: GRAIN,
            backgroundSize: "320px 320px",
            opacity: 0.05,
            mixBlendMode: "overlay",
          }}
        />
        {/* letterbox bars */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: HEIGHT * 0.05,
            background: "#000",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: HEIGHT * 0.05,
            background: "#000",
          }}
        />
      </AbsoluteFill>

      {/* ── Per-scene keywords ───────────────────────────────── */}
      <WordReveal text={SCENES.S1.word} from={90} to={420} top="14%" size={86} />
      <WordReveal text={SCENES.S2.word} from={540} to={1010} top="14%" size={86} />
      <WordReveal text={SCENES.S3.word} from={1150} to={1600} top="13%" size={104} />
      <WordReveal text={SCENES.S4.word} from={1700} to={2060} top="13%" size={92} />
      <WordReveal text={SCENES.S5.word} from={2120} to={2420} top="13%" size={104} />

      {/* ── Whiteout + finale typography ─────────────────────── */}
      <AbsoluteFill style={{ background: "#f7fbff", opacity: white }} />
      {frame >= BEATS.FLASH && (
        <>
          <WordByWord
            text="SOME PEOPLE RUN TO WIN."
            start={BEATS.FLASH + 24}
            top="26%"
            size={96}
          />
          <WordByWord
            text="SOME PEOPLE HELP OTHERS WIN TOO."
            start={BEATS.FLASH + 96}
            top="44%"
            size={88}
          />
          <WordByWord
            text="THAT'S TRUE GREATNESS."
            start={BEATS.FLASH + 180}
            top="64%"
            size={110}
            weight={800}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
