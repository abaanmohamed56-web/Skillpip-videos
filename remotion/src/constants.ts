// ── Output spec ──────────────────────────────────────────────
export const FPS    = 60;
export const WIDTH  = 1080;
export const HEIGHT = 1920;
export const DURATION = 2700; // 45 s × 60 fps

// ── Gold palette ─────────────────────────────────────────────
export const GOLD       = "#D4AF37";
export const GOLD_B     = "#FFD700";
export const GOLD_DARK  = "#8B6914";
export const GOLD_GLOW  = "rgba(212,175,55,0.45)";
export const FONT       = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// ── Stop Hunt Video ───────────────────────────────────────────
export const RED        = "#ef4444";
export const RED_GLOW   = "rgba(239,68,68,0.5)";
export const GREEN      = "#22c55e";
export const GREEN_GLOW = "rgba(34,197,94,0.45)";

export const SH_DURATION = 3600; // 60 s × 60 fps

export const SH_SCENES = {
  S1: { from: 0,    duration: 600 }, //  0–10 s
  S2: { from: 600,  duration: 600 }, // 10–20 s
  S3: { from: 1200, duration: 600 }, // 20–30 s
  S4: { from: 1800, duration: 600 }, // 30–40 s
  S5: { from: 2400, duration: 600 }, // 40–50 s
  S6: { from: 3000, duration: 600 }, // 50–60 s
} as const;

export const SH_CAPTIONS = [
  { from: 60,   to: 270,  text: "You put your stop loss right below support…" },
  { from: 270,  to: 480,  text: "It got hit by one pip. Price immediately reversed." },
  { from: 480,  to: 590,  text: "Sound familiar? You just got stop hunted." },
  { from: 660,  to: 840,  text: "Here's the truth — that wasn't bad luck." },
  { from: 840,  to: 1050, text: "It was engineered. Institutions need liquidity." },
  { from: 1050, to: 1190, text: "And liquidity lives right at your stop losses." },
  { from: 1260, to: 1440, text: "They push price below that obvious level…" },
  { from: 1440, to: 1640, text: "…collect the liquidity, then reverse hard." },
  { from: 1640, to: 1790, text: "Your loss literally funded their entry." },
  { from: 1860, to: 2040, text: "Once you know this, stop hunts become your edge." },
  { from: 2040, to: 2280, text: "A wick that pierces a key level and closes back? That's your trigger." },
  { from: 2460, to: 2640, text: "Give your stops more room — not exactly at the level." },
  { from: 2640, to: 2830, text: "Wait for confirmation after the sweep before you enter." },
  { from: 2830, to: 2990, text: "Follow smart money — don't let them prey on you." },
  { from: 3060, to: 3250, text: "Drop a comment if you've been stop hunted this week." },
  { from: 3300, to: 3570, text: "Follow for more Gold setups — link in bio for VIP signals." },
];

// ── Scene windows (frames) ───────────────────────────────────
// Scene uses useCurrentFrame() which resets to 0 at sequence start.
// Frame offsets below are absolute, used in SkillpipsAd Sequence from=.
export const SCENES = {
  S1: { from: 0,    duration: 240  }, //  0 – 4 s
  S2: { from: 240,  duration: 360  }, //  4 – 10 s
  S3: { from: 600,  duration: 360  }, // 10 – 16 s
  S4: { from: 960,  duration: 600  }, // 16 – 26 s
  S5: { from: 1560, duration: 480  }, // 26 – 34 s
  S6: { from: 2040, duration: 660  }, // 34 – 45 s
} as const;

// ── Voiceover captions (absolute frames) ─────────────────────
export const CAPTIONS = [
  { from: 66,   to: 228,  text: '"The market moves fast…"' },
  { from: 312,  to: 492,  text: '"But smart traders move together…"' },
  { from: 672,  to: 852,  text: '"Signals. Analysis. Education."' },
  { from: 1050, to: 1230, text: '"One community. One mindset."' },
  { from: 1320, to: 1500, text: '"Over 1,000 traders."' },
  { from: 2160, to: 2370, text: '"Join SkillPips today."' },
];
