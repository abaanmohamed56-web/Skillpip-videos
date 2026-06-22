// ──────────────────────────────────────────────────────────────
//  Deterministic animation helpers — all driven by the Remotion
//  frame so every render is bit-for-bit reproducible.
// ──────────────────────────────────────────────────────────────

import { interpolate } from "remotion";
import {
  BEATS,
  FINISH_Z_KEYS,
  LANE,
  SCROLL_KEYS,
} from "./constants";

export const TAU = Math.PI * 2;
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Smooth Hermite step in [0,1].
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;

// Deterministic value noise (no RNG state) — used for camera shake / wind.
export function noise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const h = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
  const u = f * f * (3 - 2 * f);
  return lerp(h(i), h(i + 1), u) * 2 - 1; // → [-1, 1]
}

// Piecewise-linear interpolation across keyframe arrays.
export function keyed(
  frame: number,
  keys: { frames: number[]; values: number[] }
): number {
  return interpolate(frame, keys.frames, keys.values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export const scrollAt = (frame: number) => keyed(frame, SCROLL_KEYS);
export const finishZAt = (frame: number) => keyed(frame, FINISH_Z_KEYS);

// Instantaneous ground speed (units / frame) — used for speed lines & blur.
export function speedAt(frame: number): number {
  return (scrollAt(frame + 0.5) - scrollAt(frame - 0.5));
}

// ──────────────────────────────────────────────────────────────
//  Runner pose
// ──────────────────────────────────────────────────────────────
export interface Pose {
  // root transform (relative to lane position)
  x: number;
  y: number;
  z: number;
  yaw: number; // facing rotation about Y
  lean: number; // forward lean about X
  // joint angles (radians)
  lShoulder: number;
  rShoulder: number;
  lElbow: number;
  rElbow: number;
  lHip: number;
  rHip: number;
  lKnee: number;
  rKnee: number;
  headTilt: number;
  // reach: extend right arm forward to offer a hand (0..1)
  reach: number;
  glow: number; // emissive boost
}

const RUN_BASE: Pose = {
  x: 0,
  y: 0,
  z: 0,
  yaw: 0,
  lean: 0.34,
  lShoulder: 0,
  rShoulder: 0,
  lElbow: 0.95,
  rElbow: 0.95,
  lHip: 0,
  rHip: 0,
  lKnee: 0.2,
  rKnee: 0.2,
  headTilt: 0,
  reach: 0,
  glow: 0,
};

// A natural running cycle parameterised by stride phase + intensity.
export function runningPose(phase: number, intensity = 1): Pose {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const bob = (1 - Math.abs(c)) * 0.07 * intensity; // weighty vertical bob
  const flexL = Math.max(0, -Math.cos(phase)); // knee tucks as leg swings back
  const flexR = Math.max(0, -Math.cos(phase + Math.PI));
  return {
    ...RUN_BASE,
    y: bob,
    lean: 0.30 + 0.08 * intensity,
    lHip: s * 0.85 * intensity,
    rHip: -s * 0.85 * intensity,
    lKnee: 0.18 + flexL * 1.55 * intensity,
    rKnee: 0.18 + flexR * 1.55 * intensity,
    lShoulder: -s * 0.7 * intensity,
    rShoulder: s * 0.7 * intensity,
    lElbow: 1.0 + Math.max(0, s) * 0.4,
    rElbow: 1.0 + Math.max(0, -s) * 0.4,
    headTilt: -0.05 * intensity,
  };
}

// Standing / idle pose (used as a blend target when stopped).
export const STAND: Pose = {
  ...RUN_BASE,
  lean: 0.05,
  lElbow: 0.3,
  rElbow: 0.3,
  lKnee: 0.05,
  rKnee: 0.05,
};

// Fallen-on-the-ground pose (lying, propped on one arm).
export const FALLEN: Pose = {
  ...RUN_BASE,
  y: -0.62,
  lean: 1.45, // pitched forward onto the ground
  yaw: 0.0,
  lHip: -0.6,
  rHip: -0.3,
  lKnee: 1.3,
  rKnee: 0.9,
  lShoulder: 0.9,
  rShoulder: 0.4,
  lElbow: 1.4,
  rElbow: 0.8,
  headTilt: 0.4,
};

// Blend two poses (linear on each channel).
export function blendPose(a: Pose, b: Pose, t: number): Pose {
  const k = clamp01(t);
  const m = (x: keyof Pose) => lerp(a[x] as number, b[x] as number, k);
  return {
    x: m("x"), y: m("y"), z: m("z"), yaw: m("yaw"), lean: m("lean"),
    lShoulder: m("lShoulder"), rShoulder: m("rShoulder"),
    lElbow: m("lElbow"), rElbow: m("rElbow"),
    lHip: m("lHip"), rHip: m("rHip"), lKnee: m("lKnee"), rKnee: m("rKnee"),
    headTilt: m("headTilt"), reach: m("reach"), glow: m("glow"),
  };
}

// ──────────────────────────────────────────────────────────────
//  Master per-frame story state for both runners + camera intent
// ──────────────────────────────────────────────────────────────
export interface RunnerState extends Pose {}

export interface World {
  leader: RunnerState; // runner A (helps)
  struggler: RunnerState; // runner B (falls)
  handClasp: number; // 0..1 — hands joined during the lift
  slowmo: number; // 0..1 — slow-motion intensity (lift moment)
  whiteout: number; // 0..1 — final flash to white
  shake: number; // camera shake intensity
}

const STRIDE_FREQ = 0.62; // stride cycles per ground unit

export function computeWorld(frame: number): World {
  const scroll = scrollAt(frame);
  const spd = speedAt(frame);

  // Slow-motion ramp around the hand-lift moment.
  const slowmo =
    smoothstep(BEATS.EXTEND_HAND - 40, BEATS.GRAB, frame) *
    (1 - smoothstep(BEATS.LIFT + 30, BEATS.RESUME, frame));

  // Whiteout flash at the finish.
  const whiteout =
    smoothstep(BEATS.FLASH, BEATS.FLASH + 36, frame) *
    (1 - smoothstep(BEATS.FLASH + 120, BEATS.FLASH + 220, frame) * 0.55);

  // Camera shake during the obstacle stretch.
  const shake =
    smoothstep(560, 700, frame) * (1 - smoothstep(1080, 1180, frame)) * 1.0 +
    smoothstep(BEATS.TRIP - 10, BEATS.TRIP, frame) *
      (1 - smoothstep(BEATS.TRIP, BEATS.TRIP + 40, frame)) *
      1.6;

  // ── Leader (runner A) ──────────────────────────────────────
  const leaderIntensity = lerp(1, 1.18, smoothstep(2100, 2360, frame));
  let leaderPhase = scroll * STRIDE_FREQ * Math.PI;
  let leader: Pose = runningPose(leaderPhase, leaderIntensity);
  leader.x = -LANE;
  leader.glow = 0.0;

  // Leader notices → slows → stops → turns and looks back.
  const slowing = smoothstep(BEATS.LEADER_NOTICES, BEATS.TURN_BACK - 60, frame);
  const stopped = smoothstep(BEATS.TURN_BACK - 80, BEATS.TURN_BACK - 20, frame);
  if (frame > BEATS.LEADER_NOTICES && frame < BEATS.TURN_BACK) {
    leader = blendPose(leader, STAND, stopped);
    // glance toward finish, then back toward fallen friend
    const lookFinish = smoothstep(BEATS.LEADER_LOOKS_FINISH, BEATS.LEADER_LOOKS_FINISH + 50, frame);
    const lookBack = smoothstep(BEATS.LEADER_LOOKS_BACK, BEATS.LEADER_LOOKS_BACK + 50, frame);
    leader.yaw = lerp(0, -0.5, lookFinish) + lerp(0, 1.4, lookBack);
    leader.headTilt = 0.1;
  }

  // ── Struggler (runner B) ───────────────────────────────────
  const strugglerLag = smoothstep(BEATS.STRUGGLER_SLOWS, BEATS.TRIP, frame);
  const strugglerIntensity = lerp(1, 0.55, strugglerLag);
  let strugglerPhase = scroll * STRIDE_FREQ * Math.PI + 0.9;
  let struggler: Pose = runningPose(strugglerPhase, strugglerIntensity);
  struggler.x = LANE;
  struggler.lean = lerp(struggler.lean, 0.5, strugglerLag); // labouring

  // Trip & fall.
  if (frame >= BEATS.TRIP) {
    const fallT = smoothstep(BEATS.TRIP, BEATS.TRIP + 26, frame);
    struggler = blendPose(struggler, FALLEN, fallT);
    // attempts to rise — small pushes upward that collapse back
    for (const a of BEATS.RISE_ATTEMPTS) {
      const up =
        smoothstep(a, a + 22, frame) * (1 - smoothstep(a + 30, a + 70, frame));
      struggler = blendPose(struggler, blendPose(FALLEN, STAND, 0.4), up * 0.7);
    }
  }

  // ── The lift (S4) — leader returns, offers hand, pulls up ──
  let handClasp = 0;
  if (frame >= BEATS.TURN_BACK) {
    // leader moves laterally toward the fallen friend
    const approach = smoothstep(BEATS.TURN_BACK, BEATS.REACH_FRIEND, frame);
    const retreat = smoothstep(BEATS.LIFT, BEATS.RESUME, frame);
    leader = blendPose(STAND, runningPose(scroll * STRIDE_FREQ * Math.PI, 1), retreat);
    leader.x = lerp(-LANE, LANE - 0.62, approach * (1 - retreat)) + lerp(0, -LANE, retreat);
    leader.yaw = lerp(0.0, 0.0, 1); // faces forward-ish
    // crouch + extend hand
    const reach =
      smoothstep(BEATS.REACH_FRIEND, BEATS.EXTEND_HAND, frame) *
      (1 - smoothstep(BEATS.LIFT, BEATS.LIFT + 30, frame));
    leader.reach = reach;
    leader.lean = lerp(leader.lean, 0.65, reach);
    leader.rShoulder = lerp(leader.rShoulder, -1.15, reach);
    leader.rElbow = lerp(leader.rElbow, 0.25, reach);

    // hand clasp + pulling the friend up
    handClasp = smoothstep(BEATS.GRAB, BEATS.GRAB + 24, frame) *
      (1 - smoothstep(BEATS.LIFT + 40, BEATS.RESUME, frame));
    const lift = smoothstep(BEATS.GRAB, BEATS.LIFT + 30, frame);
    struggler = blendPose(struggler, STAND, lift);
    struggler.lShoulder = lerp(struggler.lShoulder, -1.2, handClasp);
    struggler.lElbow = lerp(struggler.lElbow, 0.3, handClasp);
    struggler.glow = handClasp * 0.6;
    leader.glow = handClasp * 0.6;
  }

  // ── Resume together (S5) ───────────────────────────────────
  if (frame >= BEATS.RESUME) {
    const together = smoothstep(BEATS.RESUME, BEATS.RESUME + 90, frame);
    const intensity = lerp(1, 1.2, smoothstep(BEATS.RESUME, 2400, frame));
    const lp = runningPose(scroll * STRIDE_FREQ * Math.PI, intensity);
    lp.x = -LANE * 0.7;
    lp.glow = 0.25 + 0.4 * smoothstep(2300, BEATS.CROSS, frame);
    leader = blendPose(leader, lp, together);

    const sp = runningPose(scroll * STRIDE_FREQ * Math.PI + Math.PI, intensity);
    sp.x = LANE * 0.7;
    sp.glow = 0.25 + 0.4 * smoothstep(2300, BEATS.CROSS, frame);
    struggler = blendPose(struggler, sp, together);
  }

  return { leader, struggler, handClasp, slowmo, whiteout, shake };
}
