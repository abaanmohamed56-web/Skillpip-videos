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
