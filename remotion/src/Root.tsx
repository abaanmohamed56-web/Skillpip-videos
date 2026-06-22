import React from "react";
import { Composition } from "remotion";
import { SkillpipsAd } from "./SkillpipsAd";
import { FPS, DURATION, WIDTH, HEIGHT } from "./constants";
import { RunnersTikTok } from "./runners/RunnersTikTok";
import {
  FPS as R_FPS,
  DURATION as R_DURATION,
  WIDTH as R_WIDTH,
  HEIGHT as R_HEIGHT,
} from "./runners/constants";

export const Root: React.FC = () => (
  <>
    <Composition
      id="SkillpipsAd"
      component={SkillpipsAd}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="RunnersTikTok"
      component={RunnersTikTok}
      durationInFrames={R_DURATION}
      fps={R_FPS}
      width={R_WIDTH}
      height={R_HEIGHT}
    />
  </>
);
