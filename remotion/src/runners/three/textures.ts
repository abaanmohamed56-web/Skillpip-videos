import * as THREE from "three";

// Soft radial sprite (white core → transparent) for additive glows.
let _glow: THREE.Texture | null = null;
export function glowTexture(): THREE.Texture {
  if (_glow) return _glow;
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(235,250,255,0.7)");
  g.addColorStop(0.55, "rgba(191,233,255,0.22)");
  g.addColorStop(1.0, "rgba(191,233,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  _glow = t;
  return t;
}

// Vertical light-shaft gradient (for the volumetric finish beam).
let _beam: THREE.Texture | null = null;
export function beamTexture(): THREE.Texture {
  if (_beam) return _beam;
  const w = 64;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(w / 2, 0, w / 2, h);
  g.addColorStop(0.0, "rgba(234,250,255,0)");
  g.addColorStop(0.5, "rgba(210,240,255,0.55)");
  g.addColorStop(1.0, "rgba(234,250,255,0)");
  ctx.fillStyle = g;
  // soft horizontal falloff
  const hg = ctx.createLinearGradient(0, 0, w, 0);
  hg.addColorStop(0, "rgba(0,0,0,0)");
  hg.addColorStop(0.5, "rgba(255,255,255,1)");
  hg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  _beam = t;
  return t;
}
