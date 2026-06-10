/**
 * Pixel-accurate recreation of the SkillPips website for use in the video.
 * All sizes proportional to `width` (1440-design-unit base).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT, GOLD, GOLD_B, GOLD_DARK, GOLD_LIGHT, SITE } from "../constants";

// ─── helpers ────────────────────────────────────────────────────────────────

const GoldText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children, style,
}) => (
  <span
    style={{
      background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 45%, ${GOLD_LIGHT} 55%, ${GOLD} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      ...style,
    }}
  >
    {children}
  </span>
);

// ─── NavBar ──────────────────────────────────────────────────────────────────

const NavBar: React.FC<{ w: number }> = ({ w }) => {
  const fs = w * 0.0097;
  const h  = w * 0.044;
  return (
    <div
      style={{
        width: "100%",
        height: h,
        background: "rgba(5,5,7,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(212,175,55,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${w * 0.038}px`,
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: w * 0.0135,
          fontWeight: 800,
          letterSpacing: "0.1em",
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 55%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        SKILLPIPS
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: w * 0.025, alignItems: "center" }}>
        {["Signals", "Education", "Community", "Pricing"].map((item) => (
          <div
            key={item}
            style={{
              fontFamily: FONT,
              fontSize: fs,
              fontWeight: 400,
              color: "rgba(255,255,255,0.62)",
              letterSpacing: "0.025em",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: w * 0.011, alignItems: "center" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: fs,
            fontWeight: 500,
            color: "rgba(255,255,255,0.72)",
            padding: `${w * 0.006}px ${w * 0.016}px`,
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: w * 0.005,
          }}
        >
          Sign In
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: fs,
            fontWeight: 600,
            color: "#000",
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 100%)`,
            padding: `${w * 0.006}px ${w * 0.018}px`,
            borderRadius: w * 0.005,
          }}
        >
          Join VIP
        </div>
      </div>
    </div>
  );
};

// ─── Live Signals widget ──────────────────────────────────────────────────────

const SignalsWidget: React.FC<{ w: number; frame: number }> = ({ w, frame }) => {
  const fs = w * 0.009;
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.15);

  return (
    <div
      style={{
        background: "rgba(5,5,7,0.78)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: `1px solid rgba(212,175,55,0.25)`,
        borderRadius: w * 0.012,
        padding: `${w * 0.018}px ${w * 0.022}px`,
        width: w * 0.265,
        boxSizing: "border-box",
        boxShadow: `0 0 ${w * 0.04}px rgba(212,175,55,0.12), 0 20px 60px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: w * 0.008,
          marginBottom: w * 0.014,
          paddingBottom: w * 0.012,
          borderBottom: "1px solid rgba(212,175,55,0.14)",
        }}
      >
        <div
          style={{
            width: w * 0.007,
            height: w * 0.007,
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px #4ade80",
            opacity: 0.7 + 0.3 * pulse,
          }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontSize: w * 0.0092,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.05em",
          }}
        >
          Live Signals
        </div>
      </div>

      {/* Signal rows */}
      {SITE.signals.map((sig, i) => {
        const isBuy = sig.dir === "BUY";
        const isActive = sig.active;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${w * 0.007}px 0`,
              borderBottom:
                i < SITE.signals.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            {/* Direction badge */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.0075,
                fontWeight: 700,
                color: isBuy ? "#4ade80" : "#f87171",
                background: isBuy ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                border: `1px solid ${isBuy ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                padding: `${w * 0.002}px ${w * 0.007}px`,
                borderRadius: w * 0.003,
                letterSpacing: "0.05em",
                minWidth: w * 0.032,
                textAlign: "center",
              }}
            >
              {sig.dir}
            </div>
            {/* Pair */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: fs,
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "0.04em",
                flex: 1,
                marginLeft: w * 0.01,
              }}
            >
              {sig.pair}
            </div>
            {/* Result */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.0082,
                fontWeight: 600,
                color: isActive
                  ? GOLD
                  : "#4ade80",
                opacity: isActive ? 0.7 + 0.3 * pulse : 1,
              }}
            >
              {sig.result}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Hero Section ────────────────────────────────────────────────────────────

const HeroSection: React.FC<{ w: number; frame: number }> = ({ w, frame }) => {
  const h = w * 0.625; // 900/1440
  const badgePulse = 0.5 + 0.5 * Math.sin(frame * 0.1);
  const scanY = ((frame * 3) % (h + 20)) - 10;

  return (
    <div
      style={{
        width: "100%",
        height: h,
        position: "relative",
        background: "#050507",
        overflow: "hidden",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Burgundy orbs */}
      <div
        style={{
          position: "absolute",
          width: w * 0.55, height: w * 0.55,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,16,36,0.42) 0%, transparent 65%)",
          top: -w * 0.15, left: -w * 0.05,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: w * 0.4, height: w * 0.4,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,16,36,0.3) 0%, transparent 65%)",
          bottom: -w * 0.1, right: w * 0.05,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Gold grid */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)
          `,
          backgroundSize: `${w * 0.055}px ${w * 0.055}px`,
          pointerEvents: "none",
        }}
      />

      {/* Horizontal scan line */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: scanY,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 20%, rgba(212,175,55,0.25) 50%, rgba(212,175,55,0.15) 80%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute", inset: 0,
          padding: `${h * 0.12}px ${w * 0.09}px ${h * 0.08}px`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: w * 0.03,
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: w * 0.015,
            flex: 1,
            maxWidth: w * 0.52,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: w * 0.007,
              background: "rgba(212,175,55,0.1)",
              border: `1px solid rgba(212,175,55,0.28)`,
              borderRadius: w * 0.03,
              padding: `${w * 0.005}px ${w * 0.013}px`,
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: w * 0.006,
                height: w * 0.006,
                borderRadius: "50%",
                background: GOLD,
                opacity: 0.6 + 0.4 * badgePulse,
                boxShadow: `0 0 8px ${GOLD}`,
              }}
            />
            <span
              style={{
                fontFamily: FONT,
                fontSize: w * 0.0083,
                fontWeight: 500,
                color: GOLD,
                letterSpacing: "0.04em",
              }}
            >
              {SITE.badge}
            </span>
          </div>

          {/* Main headline */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.062,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "#fff",
              }}
            >
              {SITE.headline1}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.058,
                fontWeight: 800,
                fontStyle: "italic",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 50%, ${GOLD} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {SITE.headline2}
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: w * 0.013,
              fontWeight: 400,
              color: "rgba(255,255,255,0.62)",
              lineHeight: 1.6,
              maxWidth: w * 0.44,
            }}
          >
            {SITE.tagline}
            <br />
            <span style={{ color: "rgba(255,255,255,0.42)" }}>{SITE.subtext}</span>
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: "flex",
              gap: w * 0.038,
              padding: `${w * 0.014}px 0`,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              marginTop: w * 0.006,
            }}
          >
            {[
              { val: SITE.stats.winRate.value,   lbl: "Win Rate"          },
              { val: SITE.stats.pips.value,       lbl: "Total Pips 2025"  },
              { val: SITE.stats.members.value,    lbl: "VIP Members"      },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: w * 0.028,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {val}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: w * 0.008,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.42)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: w * 0.014, alignItems: "center" }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.011,
                fontWeight: 700,
                color: "#000",
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_B} 100%)`,
                padding: `${w * 0.01}px ${w * 0.028}px`,
                borderRadius: w * 0.005,
                letterSpacing: "0.03em",
                boxShadow: `0 0 20px rgba(212,175,55,0.4)`,
              }}
            >
              {SITE.cta1}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.011,
                fontWeight: 500,
                color: "rgba(255,255,255,0.72)",
                padding: `${w * 0.01}px ${w * 0.022}px`,
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: w * 0.005,
              }}
            >
              {SITE.cta2}
            </div>
          </div>
        </div>

        {/* Right column — signals widget */}
        <div style={{ flexShrink: 0, marginTop: h * 0.04 }}>
          <SignalsWidget w={w} frame={frame} />
        </div>
      </div>
    </div>
  );
};

// ─── About Section ───────────────────────────────────────────────────────────

const AboutSection: React.FC<{ w: number }> = ({ w }) => {
  const h = w * 0.5;
  const features = [
    { title: "Precision Signals",    desc: "High-accuracy entry & exit points with risk management built-in."  },
    { title: "Risk First",           desc: "Never risk more than 1–2% per trade. Capital preservation is key." },
    { title: "Proven Track Record",  desc: "89.3% win rate across verified trades in 2025."                    },
    { title: "Elite Community",      desc: "Trade alongside 847+ serious traders in our private channel."       },
  ];

  return (
    <div
      style={{
        width: "100%",
        minHeight: h,
        background: "#080810",
        padding: `${w * 0.06}px ${w * 0.09}px`,
        boxSizing: "border-box",
        flexShrink: 0,
        borderTop: "1px solid rgba(212,175,55,0.08)",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: w * 0.009,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: w * 0.012,
        }}
      >
        About SkillPips
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: w * 0.035,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.01em",
          marginBottom: w * 0.01,
        }}
      >
        Built by traders, for traders
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: w * 0.012,
          color: "rgba(255,255,255,0.52)",
          maxWidth: w * 0.55,
          lineHeight: 1.65,
          marginBottom: w * 0.04,
        }}
      >
        We started SkillPips because we were tired of low-quality signals and empty promises.
        Everything we do is built on transparency, discipline, and results.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: w * 0.018 }}>
        {features.map(({ title, desc }) => (
          <div
            key={title}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,175,55,0.12)",
              borderRadius: w * 0.01,
              padding: `${w * 0.02}px ${w * 0.022}px`,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.013,
                fontWeight: 700,
                color: "#fff",
                marginBottom: w * 0.007,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: w * 0.0095,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.55,
              }}
            >
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Performance Section ──────────────────────────────────────────────────────

const PerformanceSection: React.FC<{ w: number }> = ({ w }) => {
  const rows = [
    { pair: "XAUUSD", dir: "BUY",  entry: "2381", tp: "2396", result: "+45 pips", win: true  },
    { pair: "EURUSD", dir: "BUY",  entry: "1.087", tp: "1.092", result: "+49 pips", win: true  },
    { pair: "GBPJPY", dir: "SELL", entry: "192.8", tp: "191.9", result: "+38 pips", win: true  },
    { pair: "USDJPY", dir: "SELL", entry: "149.5", tp: "148.8", result: "+52 pips", win: true  },
    { pair: "GBPUSD", dir: "BUY",  entry: "1.268", tp: "1.273", result: "−22 pips", win: false },
  ];

  return (
    <div
      style={{
        width: "100%",
        background: "#050507",
        padding: `${w * 0.06}px ${w * 0.09}px`,
        boxSizing: "border-box",
        flexShrink: 0,
        borderTop: "1px solid rgba(212,175,55,0.08)",
      }}
    >
      <div style={{ fontFamily: FONT, fontSize: w * 0.009, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: w * 0.012 }}>
        Track Record
      </div>
      <div style={{ fontFamily: FONT, fontSize: w * 0.032, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", marginBottom: w * 0.035 }}>
        Real signals. Real results.
      </div>
      {/* Stats trio */}
      <div style={{ display: "flex", gap: w * 0.055, marginBottom: w * 0.04 }}>
        {[
          { val: "89.3%",    lbl: "Win Rate (90 days)"  },
          { val: "+12,840",  lbl: "Total Pips 2025"     },
          { val: "847+",     lbl: "VIP Members"         },
        ].map(({ val, lbl }) => (
          <div key={lbl}>
            <div style={{ fontFamily: FONT, fontSize: w * 0.04, fontWeight: 800, letterSpacing: "-0.01em", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_B})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{val}</div>
            <div style={{ fontFamily: FONT, fontSize: w * 0.009, color: "rgba(255,255,255,0.42)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{lbl}</div>
          </div>
        ))}
      </div>
      {/* Recent signals table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)", borderRadius: w * 0.008, overflow: "hidden" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1fr 1fr 1fr", padding: `${w * 0.012}px ${w * 0.018}px`, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          {["Pair", "Dir", "Entry", "TP1", "Result"].map((h) => (
            <div key={h} style={{ fontFamily: FONT, fontSize: w * 0.0082, fontWeight: 600, color: "rgba(255,255,255,0.38)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {rows.map(({ pair, dir, entry, tp, result, win }) => (
          <div key={pair + dir} style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1fr 1fr 1fr", padding: `${w * 0.01}px ${w * 0.018}px`, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontFamily: FONT, fontSize: w * 0.0095, fontWeight: 600, color: "#fff" }}>{pair}</div>
            <div style={{ fontFamily: FONT, fontSize: w * 0.0085, fontWeight: 700, color: dir === "BUY" ? "#4ade80" : "#f87171" }}>{dir}</div>
            <div style={{ fontFamily: FONT, fontSize: w * 0.0085, color: "rgba(255,255,255,0.52)" }}>{entry}</div>
            <div style={{ fontFamily: FONT, fontSize: w * 0.0085, color: "rgba(255,255,255,0.52)" }}>{tp}</div>
            <div style={{ fontFamily: FONT, fontSize: w * 0.0095, fontWeight: 700, color: win ? "#4ade80" : "#f87171" }}>{result}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Pricing Section ─────────────────────────────────────────────────────────

const PricingSection: React.FC<{ w: number }> = ({ w }) => (
  <div
    style={{
      width: "100%",
      background: "#080810",
      padding: `${w * 0.06}px ${w * 0.09}px`,
      boxSizing: "border-box",
      flexShrink: 0,
      borderTop: "1px solid rgba(212,175,55,0.08)",
    }}
  >
    <div style={{ textAlign: "center", marginBottom: w * 0.035 }}>
      <div style={{ fontFamily: FONT, fontSize: w * 0.009, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: w * 0.01 }}>
        Membership
      </div>
      <div style={{ fontFamily: FONT, fontSize: w * 0.032, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
        Simple, honest pricing
      </div>
      <div style={{ fontFamily: FONT, fontSize: w * 0.01, color: "rgba(255,255,255,0.42)", marginTop: w * 0.008 }}>
        No hidden fees. Cancel anytime.
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: w * 0.02 }}>
      {SITE.pricing.map(({ name, price, period, tag }) => {
        const isPopular = tag === "MOST POPULAR";
        return (
          <div
            key={name}
            style={{
              background: isPopular ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isPopular ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: w * 0.012,
              padding: `${w * 0.028}px ${w * 0.025}px`,
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {tag && (
              <div style={{
                position: "absolute", top: -w * 0.01, left: "50%", transform: "translateX(-50%)",
                background: isPopular ? GOLD : GOLD_B,
                color: "#000",
                fontFamily: FONT, fontSize: w * 0.007, fontWeight: 700, letterSpacing: "0.08em",
                padding: `${w * 0.003}px ${w * 0.012}px`,
                borderRadius: w * 0.01,
              }}>
                {tag}
              </div>
            )}
            <div style={{ fontFamily: FONT, fontSize: w * 0.014, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: w * 0.012 }}>{name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.004, marginBottom: w * 0.018 }}>
              <div style={{ fontFamily: FONT, fontSize: w * 0.036, fontWeight: 800, color: "#fff" }}>{price}</div>
              <div style={{ fontFamily: FONT, fontSize: w * 0.009, color: "rgba(255,255,255,0.42)" }}>{period}</div>
            </div>
            <div style={{
              fontFamily: FONT, fontSize: w * 0.0095, fontWeight: 700, color: "#000",
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_B})`,
              padding: `${w * 0.009}px`,
              borderRadius: w * 0.005,
              textAlign: "center",
              letterSpacing: "0.04em",
            }}>
              Get Started
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Main WebsitePanel export ─────────────────────────────────────────────────

interface WebsitePanelProps {
  width: number;
  scrollY?: number;   // 0 = top (hero), 1 = bottom (pricing)
  showSections?: ("hero" | "about" | "performance" | "pricing")[];
  clipHeight?: number; // viewport clip height (default = width * 0.625)
}

export const WebsitePanel: React.FC<WebsitePanelProps> = ({
  width,
  scrollY = 0,
  showSections = ["hero", "about", "performance", "pricing"],
  clipHeight,
}) => {
  const frame = useCurrentFrame();
  const w = width;
  const viewportH = clipHeight ?? w * 0.625;

  // Calculate total content height for scroll offset
  const heroH   = showSections.includes("hero")        ? w * 0.044 + w * 0.625 : 0;
  const aboutH  = showSections.includes("about")       ? w * 0.5               : 0;
  const perfH   = showSections.includes("performance") ? w * 0.56              : 0;
  const priceH  = showSections.includes("pricing")     ? w * 0.52              : 0;
  const totalH  = heroH + aboutH + perfH + priceH;
  const maxScroll = Math.max(0, totalH - viewportH);
  const translateY = -scrollY * maxScroll;

  return (
    <div
      style={{
        width: w,
        height: viewportH,
        overflow: "hidden",
        position: "relative",
        borderRadius: w * 0.008,
        boxShadow: `0 30px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.12)`,
      }}
    >
      <div
        style={{
          width: w,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showSections.includes("hero") && (
          <>
            <NavBar w={w} />
            <HeroSection w={w} frame={frame} />
          </>
        )}
        {showSections.includes("about") && <AboutSection w={w} />}
        {showSections.includes("performance") && <PerformanceSection w={w} />}
        {showSections.includes("pricing") && <PricingSection w={w} />}
      </div>
    </div>
  );
};
