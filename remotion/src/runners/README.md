# RUNNERS — Cinematic Motivational TikTok (Remotion + Three.js)

A 9:16 vertical, 45-second cinematic short. Two stick-figure runners chase a
glowing finish line; when one falls, the leader turns back to lift his friend.
They cross together. Message: **"Success is not about beating others. It's
about helping each other rise."**

- **Composition id:** `RunnersTikTok`
- **Spec:** 1080×1920 · 60 fps · 2700 frames (45 s)
- **Renderer:** real Three.js (`@remotion/three` + `@react-three/fiber`), driven
  deterministically from the Remotion frame (no `useFrame` randomness).

## Emotional structure (synced to "Luz Roja")

| Scene | Time      | Word        | Beat                                   |
| ----- | --------- | ----------- | -------------------------------------- |
| 1     | 0 – 8 s   | MOTIVATION  | calm determination — they start strong |
| 2     | 8 – 18 s  | DISCIPLINE  | struggle: rain, wind, rocks, one lags  |
| 3     | 18 – 28 s | HARDSHIP    | the friend trips, falls, tries to rise |
| 4     | 28 – 35 s | CHARACTER   | the leader returns and lifts him up    |
| 5     | 35 – 45 s | TOGETHER    | victory: orbit, cross, whiteout, lines |

The finale fades to white and reveals, one word at a time:

> SOME PEOPLE RUN TO WIN. · SOME PEOPLE HELP OTHERS WIN TOO. · THAT'S TRUE GREATNESS.

## Structure

```
src/runners/
  constants.ts          spec, scene windows, story beats, music beats, keyframes
  anim.ts               easing/noise + runner pose model + per-frame world state
  RunnersTikTok.tsx      composition: ThreeCanvas + HTML overlay
  three/
    Stage.tsx           scene assembly, lights, fog, camera rig
    camera.ts           cinematic waypoints + S5 orbit
    Runner.tsx          posable 3D stick figure (legs/arms/spine/head)
    Ground.tsx          scrolling speed-line floor
    FinishLine.tsx      glowing gate + volumetric light shaft + bloom halo
    Particles.tsx       dust · rain · wind · falling rocks · light-ray burst
    textures.ts         canvas-generated additive glow / beam sprites
  overlays/
    Overlay.tsx         vignette, grain, letterbox, bloom haze, whiteout, text
    Text.tsx            kinetic per-scene words + finale word-by-word reveal
```

## Music

Drop the track into `remotion/public/luz-roja.mp3`, then uncomment the `<Audio>`
line in `RunnersTikTok.tsx`. Scene cuts and the keyword reveals are pre-timed to
the beat grid in `MUSIC_BEATS` (see `constants.ts`).

## Render

```bash
cd remotion
npm ci
npm run render:runners          # -> out/runners-tiktok.mp4
npm run still:runners -- --frame=2600   # single frame preview
```

CI renders it automatically on push (`.github/workflows/render-runners.yml`)
and uploads the MP4 as a build artifact. Headless rendering uses ANGLE/SwiftShader
(`--gl=angle`), so no GPU is required.
