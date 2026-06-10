import React from "react";
import { Composition } from "remotion";
import { SkillpipsAd }    from "./SkillpipsAd";
import { SkillpipsTikTok } from "./SkillpipsTikTok";
import {
  FPS, DURATION, WIDTH, HEIGHT,
  TK_WIDTH, TK_HEIGHT, TK_DURATION,
} from "./constants";

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
      id="SkillpipsTikTok"
      component={SkillpipsTikTok}
      durationInFrames={TK_DURATION}
      fps={FPS}
      width={TK_WIDTH}
      height={TK_HEIGHT}
    />
  </>
);
