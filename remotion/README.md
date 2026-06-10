# SkillPips Cinematic Promo — Remotion Project

World-class Apple-style promotional video for [SkillPips](https://skillpips.vercel.app/).

## Specs

| Property   | Value           |
|------------|-----------------|
| Resolution | 1920 × 1080     |
| Frame Rate | 30 fps          |
| Duration   | 60 seconds      |
| Format     | H.264 MP4       |
| Style      | Apple Event     |
| Palette    | Black · Gold · White |

---

## Scene Structure

| Scene | Time     | Description                              | Key Text                              |
|-------|----------|------------------------------------------|---------------------------------------|
| 1     | 0–5s     | Opening darkness · gold particles · logo | "Trading Excellence · Redefined"      |
| 2     | 5–12s    | Website floating in 3-D space            | "Built for serious traders."          |
| 3     | 12–20s   | Hero section zoom-in · stat cards float  | "Professional analysis. Real results."|
| 4     | 20–30s   | Full website scroll sequence             | "Everything you need."                |
| 5     | 30–40s   | Community stats · animated counters      | "Join a growing trading community."   |
| 6     | 40–50s   | Three floating glass panels              | "Designed for modern traders."        |
| 7     | 50–60s   | Final convergence · logo · CTA           | "Trade Smarter. Join Today."          |

---

## Project Structure

```
src/
  constants.ts            — dimensions, palette, timing, live site data
  index.tsx               — Remotion entry point
  Root.tsx                — Composition registration
  SkillpipsAd.tsx         — Main composition (7 scenes + overlays)
  components/
    Background.tsx        — Animated dark bg with burgundy orbs + gold grid
    CandleChart.tsx       — SVG candlestick chart (background element)
    GlassCard.tsx         — Glassmorphism card wrapper
    Particles.tsx         — Deterministic gold particle system
    StatCounter.tsx       — Animated count-up number widget
    WebsitePanel.tsx      — Pixel-accurate SkillPips website recreation
                            (NavBar, Hero, About, Performance, Pricing)
  effects/
    CinematicBars.tsx     — Letterbox black bars (2.39:1)
    GoldStreaks.tsx        — Cinematic gold light streaks
    LensFlare.tsx         — Multi-layer camera lens flare
    Vignette.tsx          — Edge darkening vignette
  scenes/
    Scene1.tsx            — Opening: particles + logo formation
    Scene2.tsx            — 3-D website float + camera orbit
    Scene3.tsx            — Hero zoom + floating stat cards
    Scene4.tsx            — Parallax website scroll
    Scene5.tsx            — Community stats + animated counters
    Scene6.tsx            — Three-panel glassmorphism display
    Scene7.tsx            — Final convergence + swirling particles + CTA
```

---

## Render Instructions

### Prerequisites

- Node.js 18+  
- Chrome/Chromium (Remotion uses it for rendering)
- ffmpeg (for encoding)

```bash
# Install Chrome if missing
npx remotion browser ensure
```

### Install dependencies

```bash
cd remotion
npm install
```

### Preview in Remotion Studio (live editing)

```bash
npm run start
# Opens http://localhost:3000
```

### Render to MP4 (H.264, 1080p, 96% quality)

```bash
npm run render
# Output: out/skillpips-promo.mp4
```

### Render to ProRes (for professional editing)

```bash
npm run render:prores
# Output: out/skillpips-promo.mov
```

### Render to 4K (2× scale = 3840×2160)

```bash
npm run render:4k
# Output: out/skillpips-promo-4k.mp4
```

### Custom render options

```bash
# Specific frame range (for testing)
npx remotion render SkillpipsAd out/test.mp4 --frames=0-90

# Higher concurrency (faster on powerful machines)
npx remotion render SkillpipsAd out/skillpips-promo.mp4 --concurrency=8

# Still image of a specific frame
npx remotion still SkillpipsAd out/frame-900.png --frame=900
```

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/render-video.yml`) automatically renders the video and uploads it as an artifact on every push to the `claude/skillpips-promo-video-umu8r8` branch, or on manual trigger.

---

## Key Design Decisions

- **All animations** use Remotion's `spring()` and `interpolate()` for frame-accurate rendering
- **3-D effects** implemented with CSS `perspective` + `rotateY/X` transforms — works reliably in headless Chrome rendering
- **Website panel** is a full React recreation of the live SkillPips site, not a screenshot (screenshot-based embedding is not possible in Remotion)
- **Particle system** uses a deterministic LCG random number generator so every frame renders identically
- **Gold palette** matches the actual SkillPips site: `#D4AF37` (gold), `#FFD700` (bright gold)
- **Film grain** overlay adds subtle cinematic texture without performance overhead

## Customisation

Edit `src/constants.ts` to update:
- `SITE.*` — live stats, headlines, pricing (re-fetch from site if needed)
- `SCENES.*` — scene timing
- `GOLD`, `GOLD_B` — accent colours
- `FPS`, `DURATION` — video length
