// ── Output spec — landscape (promo) ──────────────────────────────────────────
export const FPS      = 30;
export const WIDTH    = 1920;
export const HEIGHT   = 1080;
export const DURATION = 1800; // 60 s × 30 fps

// ── Output spec — vertical (TikTok / Reels / Shorts) ─────────────────────────
export const TK_WIDTH    = 1080;
export const TK_HEIGHT   = 1920;
export const TK_DURATION = 1200; // 40 s × 30 fps

// ── Gold / brand palette ─────────────────────────────────────────────────────
export const GOLD         = "#D4AF37";
export const GOLD_B       = "#FFD700";
export const GOLD_LIGHT   = "#F5E27A";
export const GOLD_DARK    = "#8B6914";
export const GOLD_GLOW    = "rgba(212,175,55,0.45)";
export const BG           = "#050507";

// ── Typography ───────────────────────────────────────────────────────────────
export const FONT =
  "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// ── Scene windows  (absolute frame offsets at 30 fps) ────────────────────────
export const SCENES = {
  S1: { from: 0,    duration: 150 }, //  0– 5 s  Opening darkness
  S2: { from: 150,  duration: 210 }, //  5–12 s  Website 3-D float
  S3: { from: 360,  duration: 240 }, // 12–20 s  Hero zoom-in
  S4: { from: 600,  duration: 300 }, // 20–30 s  Website scroll
  S5: { from: 900,  duration: 300 }, // 30–40 s  Community / counters
  S6: { from: 1200, duration: 300 }, // 40–50 s  Multi-panel glass
  S7: { from: 1500, duration: 300 }, // 50–60 s  Final convergence + CTA
} as const;

// ── Caption overlays (absolute frames) ───────────────────────────────────────
export const CAPTIONS = [
  { from: 45,   to: 130,  text: "Trading Excellence · Redefined"        },
  { from: 195,  to: 340,  text: "Built for serious traders."             },
  { from: 395,  to: 480,  text: "Professional analysis."                 },
  { from: 480,  to: 555,  text: "Actionable signals."                    },
  { from: 555,  to: 590,  text: "Real results."                          },
  { from: 645,  to: 765,  text: "Everything you need."                   },
  { from: 765,  to: 870,  text: "One powerful platform."                 },
  { from: 945,  to: 1080, text: "Join a growing trading community."      },
  { from: 1245, to: 1360, text: "Designed for modern traders."           },
  { from: 1545, to: 1665, text: "Trade Smarter."                         },
  { from: 1710, to: 1785, text: "Join Today →"                           },
] as const;

// ── Live website data (sourced from skillpips.vercel.app) ─────────────────────
export const SITE = {
  headline1: "Master Forex",
  headline2: "With SkillPips",
  tagline:   "Premium Signals. Professional Education. Elite Community.",
  subtext:   "Built for traders who demand results.",
  badge:     "847 Members Trading Live",
  cta1:      "Join VIP Now",
  cta2:      "View Performance →",
  stats: {
    winRate: { value: "89.3%",   label: "Win Rate"          },
    pips:    { value: "+12,840", label: "Total Pips 2025"   },
    members: { value: "847+",    label: "VIP Members"       },
  },
  signals: [
    { dir: "BUY",  pair: "XAUUSD", result: "+45 pips", active: false },
    { dir: "BUY",  pair: "EURUSD", result: "Active",   active: true  },
    { dir: "SELL", pair: "GBPJPY", result: "+38 pips", active: false },
    { dir: "BUY",  pair: "GBPUSD", result: "Active",   active: true  },
    { dir: "SELL", pair: "USDJPY", result: "+52 pips", active: false },
  ],
  pricing: [
    { name: "Monthly",   price: "$14.80", period: "/month",    tag: ""             },
    { name: "Quarterly", price: "$34.80", period: "/3 months", tag: "MOST POPULAR" },
    { name: "Yearly",    price: "$64.80", period: "/year",     tag: "BEST VALUE"   },
  ],
  testimonial: {
    quote: "SkillPips has completely transformed how I trade. The signals are accurate, the analysis is clear, and the community is incredibly supportive. Up +340 pips this month alone.",
    author: "Ahmed K.",
    handle: "@ahmedk_trader",
    result: "+340 pips this month",
  },
} as const;
