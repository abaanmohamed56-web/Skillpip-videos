import React from "react";
import { GOLD, FONT } from "../constants";

export interface TgMessage {
  sender: string;
  body: React.ReactNode;
  time: string;
  views: string;
  isSignal?: boolean;
  opacity: number;
  tx: number; /* translateX px, used for slide-in */
}

interface Props {
  width: number;
  height: number;
  messages: TgMessage[];
  channelName?: string;
  subscribers?: string;
  inputPlaceholder?: string;
}

export const TelegramUI: React.FC<Props> = ({
  width,
  height,
  messages,
  channelName = "SKILLPIPS ✓",
  subscribers = "606 subscribers",
  inputPlaceholder = "Broadcast",
}) => {
  const fs = width * 0.028;

  return (
    <div
      style={{
        width,
        height,
        background: "#17212B",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: "#232E3C",
          padding: `${width * 0.022}px ${width * 0.028}px`,
          display: "flex",
          alignItems: "center",
          gap: width * 0.02,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: width * 0.082,
            height: width * 0.082,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: width * 0.03,
            fontWeight: 900,
            color: "#000",
            boxShadow: `0 0 8px rgba(212,175,55,0.4)`,
            flexShrink: 0,
          }}
        >
          SP
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: fs * 1.05, fontWeight: 700, color: "#fff" }}>
            {channelName}
          </div>
          <div style={{ fontSize: fs * 0.78, color: "rgba(255,255,255,0.42)" }}>
            {subscribers}
          </div>
        </div>
        <div style={{ fontSize: fs, color: "rgba(255,255,255,0.4)" }}>🔕</div>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: `${width * 0.02}px ${width * 0.02}px ${width * 0.012}px`,
          display: "flex",
          flexDirection: "column",
          gap: width * 0.014,
          justifyContent: "flex-end",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              maxWidth: "90%",
              background: "#1f2f3f",
              borderRadius: `${width * 0.028}px ${width * 0.028}px ${width * 0.028}px ${width * 0.006}px`,
              padding: `${width * 0.02}px ${width * 0.025}px`,
              opacity: msg.opacity,
              transform: `translateX(${msg.tx}px)`,
              ...(msg.isSignal
                ? {
                    border: "1px solid rgba(212,175,55,0.6)",
                    boxShadow:
                      "0 0 14px rgba(212,175,55,0.22), inset 0 0 6px rgba(212,175,55,0.04)",
                  }
                : {}),
            }}
          >
            <div
              style={{
                fontSize: fs * 0.78,
                fontWeight: 700,
                color: GOLD,
                marginBottom: 3,
              }}
            >
              {msg.sender}
            </div>
            <div style={{ fontSize: fs * 0.78, color: "#ddd", lineHeight: 1.45 }}>
              {msg.body}
            </div>
            <div
              style={{
                fontSize: fs * 0.62,
                color: "rgba(255,255,255,0.32)",
                textAlign: "right",
                marginTop: 3,
              }}
            >
              {msg.time} · 👁 {msg.views}
            </div>
          </div>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          background: "#232E3C",
          padding: `${width * 0.02}px ${width * 0.028}px`,
          display: "flex",
          alignItems: "center",
          gap: width * 0.016,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: fs, color: "rgba(255,255,255,0.4)" }}>📎</span>
        <div
          style={{
            flex: 1,
            background: "#17212B",
            borderRadius: width * 0.05,
            padding: `${width * 0.014}px ${width * 0.028}px`,
            fontSize: fs * 0.78,
            color: "rgba(255,255,255,0.28)",
          }}
        >
          {inputPlaceholder}
        </div>
        <span style={{ fontSize: fs, color: "rgba(255,255,255,0.4)" }}>🎙️</span>
      </div>
    </div>
  );
};
