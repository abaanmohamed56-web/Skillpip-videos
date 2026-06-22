import { interpolate } from "remotion";
import { lerp, smoothstep, easeInOut } from "../anim";
import { BEATS } from "../constants";

export interface Cam {
  pos: [number, number, number];
  tgt: [number, number, number];
  fov: number;
}

// Cinematic camera waypoints (absolute frames). The camera sits BEHIND the
// runners (−z) looking toward the finish (+z). Channels are interpolated
// independently with easing for smooth, motivated moves.
const WP = {
  f: [0, 480, 840, 1080, 1140, 1470, 1560, 1680, 1900, 1980, 2040, 2100],
  px: [-0.7, -0.7, -0.7, 0.9, 1.4, 1.1, -0.2, -0.6, 0.5, 0.45, 0.1, -1.0],
  py: [2.3, 1.9, 1.7, 1.4, 1.1, 1.0, 1.5, 1.3, 1.2, 1.1, 1.4, 1.9],
  pz: [-6.6, -5.4, -4.4, -3.6, -3.0, -3.2, -4.2, -3.8, -3.4, -3.6, -3.8, -4.9],
  tx: [0.0, 0.05, 0.15, 0.6, 0.8, 0.5, 0.0, 0.1, 0.45, 0.45, 0.3, 0.0],
  ty: [1.15, 1.1, 1.05, 1.0, 0.6, 0.55, 1.0, 0.9, 0.75, 0.8, 1.05, 1.15],
  tz: [3.0, 2.5, 2.0, 1.5, 0.5, 0.6, 1.0, 1.0, 0.6, 0.6, 0.8, 1.2],
  fov: [45, 46, 47, 48, 50, 48, 45, 46, 43, 41, 44, 46],
};

function ch(frame: number, vals: number[]): number {
  return interpolate(frame, WP.f, vals, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
}

export function cameraAt(frame: number): Cam {
  // ── S5 climax: orbit around the two runners, then hero cross ──
  if (frame >= BEATS.RESUME) {
    const t = smoothstep(BEATS.RESUME, BEATS.CROSS, frame);
    // Sweep from behind-left to behind-right — the camera stays BEHIND the
    // runners (ang=0 is dead-behind) so the finish stays ahead in shot.
    const ang = lerp(-0.9, 0.95, easeInOut(t));
    const rad = lerp(5.0, 3.2, t);
    const cx = Math.sin(ang) * rad;
    const cz = -Math.cos(ang) * rad;
    const cy = lerp(2.0, 1.2, t) + Math.sin(t * Math.PI) * 0.28;
    const fov = lerp(46, 50, t);
    const blend = smoothstep(BEATS.RESUME, BEATS.RESUME + 70, frame);
    const base: Cam = {
      pos: [ch(frame, WP.px), ch(frame, WP.py), ch(frame, WP.pz)],
      tgt: [ch(frame, WP.tx), ch(frame, WP.ty), ch(frame, WP.tz)],
      fov: ch(frame, WP.fov),
    };
    const orbit: Cam = {
      pos: [cx, cy, cz],
      tgt: [Math.sin(ang) * 0.35, 1.2, 1.2], // keep the inside runner in frame
      fov,
    };
    return {
      pos: [
        lerp(base.pos[0], orbit.pos[0], blend),
        lerp(base.pos[1], orbit.pos[1], blend),
        lerp(base.pos[2], orbit.pos[2], blend),
      ],
      tgt: [
        lerp(base.tgt[0], orbit.tgt[0], blend),
        lerp(base.tgt[1], orbit.tgt[1], blend),
        lerp(base.tgt[2], orbit.tgt[2], blend),
      ],
      fov: lerp(base.fov, orbit.fov, blend),
    };
  }

  return {
    pos: [ch(frame, WP.px), ch(frame, WP.py), ch(frame, WP.pz)],
    tgt: [ch(frame, WP.tx), ch(frame, WP.ty), ch(frame, WP.tz)],
    fov: ch(frame, WP.fov),
  };
}
