import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { WIDTH, HEIGHT } from "./constants";
import { Stage } from "./three/Stage";
import { Overlay } from "./overlays/Overlay";

// ──────────────────────────────────────────────────────────────
//  "RUNNERS" — a 45s vertical cinematic motivational TikTok.
//  Two runners chase a glowing finish line; the leader turns back
//  to lift his fallen friend. Built with Remotion + Three.js.
// ──────────────────────────────────────────────────────────────
export const RunnersTikTok: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        camera={{ fov: 45, position: [-3, 2.6, -5.6], near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Stage />
      </ThreeCanvas>

      <Overlay />

      {/*
        MUSIC: drop "Luz Roja" into remotion/public/ as luz-roja.mp3 and
        uncomment below. Scene cuts are already timed to the track's beats
        (see MUSIC_BEATS in constants.ts).

        <Audio src={staticFile("luz-roja.mp3")} />
      */}
    </AbsoluteFill>
  );
};
