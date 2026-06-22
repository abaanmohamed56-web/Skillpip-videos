// ──────────────────────────────────────────────────────────────
//  Runners — Cinematic motivational TikTok (Remotion + Three.js)
//  Output spec & global timing
// ──────────────────────────────────────────────────────────────

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// 45 s × 60 fps
export const DURATION = 2700;

export const FONT =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

// ── Palette ──────────────────────────────────────────────────
export const WHITE = "#ffffff";
export const FINISH_COLOR = "#bfe9ff"; // cool cinematic blue-white glow
export const FINISH_CORE = "#eafaff";

// ── Scene windows (absolute frames) ──────────────────────────
//  Mirrors the narrative beats of "Luz Roja":
//   S1 calm determination · S2 struggle · S3 hardship
//   S4 sacrifice/friendship (the drop) · S5 victory/purpose (climax)
export const SCENES = {
  S1: { from: 0, duration: 480, word: "MOTIVATION" }, //  0 –  8 s
  S2: { from: 480, duration: 600, word: "DISCIPLINE" }, //  8 – 18 s
  S3: { from: 1080, duration: 600, word: "HARDSHIP" }, // 18 – 28 s
  S4: { from: 1680, duration: 420, word: "CHARACTER" }, // 28 – 35 s
  S5: { from: 2100, duration: 600, word: "TOGETHER" }, // 35 – 45 s
} as const;

// ── Key story beats (absolute frames) ────────────────────────
export const BEATS = {
  RACE_START: 36,
  STRUGGLER_SLOWS: 840, // late S2 — one runner begins to lag
  TRIP: 1140, // early S3 — struggler trips and falls
  RISE_ATTEMPTS: [1230, 1350, 1470] as number[], // tries to stand, fails
  LEADER_NOTICES: 1380,
  LEADER_LOOKS_FINISH: 1470,
  LEADER_LOOKS_BACK: 1560,
  TURN_BACK: 1680, // S4 — leader turns and runs back
  REACH_FRIEND: 1860,
  EXTEND_HAND: 1900,
  GRAB: 1980, // slow-motion hand clasp
  LIFT: 2040, // pulled to his feet
  RESUME: 2100, // S5 — side by side again
  CROSS: 2460, // crossing the finish line
  FLASH: 2460, // everything turns white
} as const;

// Approximate musical down-beats (frames) used for pulses / cut accents.
export const MUSIC_BEATS = [
  36, 108, 180, 252, 324, 396, 480, 588, 696, 804, 912, 1020, 1140, 1248,
  1356, 1464, 1572, 1680, 1800, 1920, 2040, 2160, 2280, 2400, 2520, 2580,
];

// ── World layout (Three.js units, Y-up) ──────────────────────
// Treadmill model: runners stay near origin, the ground scrolls and the
// finish line travels toward them. Keeps camera math stable.
export const LANE = 0.78; // half-distance between the two lanes (x)
export const GROUND_Y = 0;

// Finish-line distance over time (z, world units). Far away → crossed.
export const FINISH_Z_KEYS = {
  frames: [0, 480, 1080, 1680, 2100, 2360, BEATS.CROSS, DURATION],
  values: [74, 66, 60, 56, 50, 34, 0, -8],
};

// Monotonic ground-scroll distance (drives stride + speed lines).
// Variable slope encodes the emotional pacing of the track.
export const SCROLL_KEYS = {
  frames: [0, BEATS.RACE_START, 480, 840, 1080, 1140, 1680, 2100, 2300, BEATS.CROSS, DURATION],
  values: [0, 0, 46, 96, 118, 124, 126, 128, 176, 320, 356],
};
