import React from "react";
import { Composition } from "remotion";
import { SkillpipsAd } from "./SkillpipsAd";
import { VipTrailer, VIP_DURATION, VIP_FPS } from "./VipTrailer";
import { FPS, DURATION, WIDTH, HEIGHT } from "./constants";

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
      id="VipTrailer"
      component={VipTrailer}
      durationInFrames={VIP_DURATION}
      fps={VIP_FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
