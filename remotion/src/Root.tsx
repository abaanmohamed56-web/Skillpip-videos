import React from "react";
import { Composition } from "remotion";
import { SkillpipsAd } from "./SkillpipsAd";
import { FPS, DURATION, WIDTH, HEIGHT } from "./constants";

export const Root: React.FC = () => (
  <Composition
    id="SkillpipsAd"
    component={SkillpipsAd}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
