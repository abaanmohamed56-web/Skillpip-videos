import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { WIDTH } from "../constants";
import { Background } from "../components/Background";
import { Phone } from "../components/Phone";
import { TelegramUI, TgMessage } from "../components/TelegramUI";

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = Math.sin(frame * 0.016) * 6;

  /* Message reveal helper — frames relative to this scene */
  const msgAnim = (startF: number) => ({
    opacity: interpolate(frame, [startF, startF + 27], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }),
    tx: interpolate(frame, [startF, startF + 27], [-12, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }),
  });

  /* 1.2 s, 3.4 s, 5.5 s, 8.2 s into scene */
  const a = [msgAnim(72), msgAnim(204), msgAnim(330), msgAnim(492)];

  const PHONE_W = WIDTH * 0.62;
  const PHONE_H = (PHONE_W * 852) / 393;
  const fs      = PHONE_W * 0.028;

  const messages: TgMessage[] = [
    {
      sender: "SKILLPIPS", time: "7:26 PM", views: "110",
      body: "Okay guys be ready 👀",
      ...a[0],
    },
    {
      sender: "SKILLPIPS", time: "7:26 PM", views: "107",
      body: "Sell now 🔥",
      ...a[1],
    },
    {
      sender: "SKILLPIPS", time: "7:27 PM", views: "105",
      isSignal: true,
      body: (
        <div style={{ fontSize: fs * 0.78 }}>
          <div>Zone is big so layer slowly</div>
          <div style={{ height: 5 }} />
          <div style={{ color: "#4ade80", fontWeight: 700 }}>4760–4770</div>
          <div style={{ height: 3 }} />
          <div>Tp200/300/400/500/open</div>
          <div>Sl4785</div>
        </div>
      ),
      ...a[2],
    },
    {
      sender: "SKILLPIPS", time: "7:27 PM", views: "102",
      body: "Daily SBR setup 📊",
      ...a[3],
    },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background chartAlpha={0.07} particleSpeed={0.62} showGlow glowY={0.46} />

      <AbsoluteFill
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Phone
          width={PHONE_W}
          style={{ transform: `translateY(${floatY}px) rotate(${Math.sin(frame * 0.013) * 0.3}deg)` }}
        >
          <TelegramUI
            width={PHONE_W * 0.956}
            height={PHONE_H * 0.972}
            messages={messages}
          />
        </Phone>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
