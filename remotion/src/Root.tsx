import React from "react";
import { Composition } from "remotion";
import { SkillpipsAd } from "./SkillpipsAd";
import { StopHuntVideo } from "./StopHuntVideo";
import { FPS, DURATION, WIDTH, HEIGHT, SH_DURATION } from "./constants";

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
      id="StopHunt"
      component={StopHuntVideo}
      durationInFrames={SH_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
