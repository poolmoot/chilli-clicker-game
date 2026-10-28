# Tropical Llama Lagoon Clicker — Codebase Architecture & Engineering Guide

## 1. Project Overview
**Tropical Llama Lagoon Clicker (Alanya Summer Edition)** is a 3D Three.js + React 19 summer waterpark idle clicker game inspired by *Clicker Heroes*, *Cookie Clicker*, and Turkish Mediterranean resort vacation culture. Players boop a chilled 3D Alanya Llama lounging in a strawberry-frosted sprinkle donut floatie inside a luxury travertine infinity-pool island, unlock 16 tiers of Alanya food shacks and beach enterprises (Döner spits, Dürüm shacks, Baklava palaces, Teleferik cableways), buy 18 hilarious brainrot upgrades (Rizz, Mewing, Mogging), and execute **Alanya Rebirths** for permanent Golden Citrus multipliers.

---

## 2. Installed Agent Skills (`.agents/skills/`)
The repository includes three complete agent skill suites under `.agents/skills/`:

1. **`obra/superpowers` (15 Software Engineering Process Skills)**:
   - `using-superpowers`, `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `systematic-debugging`, `test-driven-development`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`, `using-git-worktrees`, `writing-skills`, `diagnosing-superpowers`.
2. **`majidmanzarpour/threejs-game-skills` (9 Three.js Game Production Skills)**:
   - `threejs-game-director`, `threejs-aaa-graphics-builder`, `threejs-game-ui-designer`, `threejs-gameplay-systems`, `threejs-debug-profiler`, `threejs-qa-release`, `threejs-3d-generator`, `threejs-image-generator`, `threejs-audio-generator`.
3. **`scottstts/Threejs-Awesome-Graphics-Agent-Skills` (24 Three.js Graphics & Shader Skills)**:
   - `threejs-water-optics`, `threejs-volumetric-clouds`, `threejs-atmosphere-aerial-perspective`, `threejs-procedural-geometry`, `threejs-procedural-vegetation`, `threejs-procedural-materials`, `threejs-procedural-architecture`, `threejs-procedural-animation`, `threejs-procedural-vfx`, `threejs-spectral-ocean`, `threejs-shadow-systems`, `threejs-bloom`, `threejs-exposure-color-grading`, `threejs-camera-direction`, `threejs-visual-validation`, and more.

---

## 3. Directory & Module Structure

```text
├── .agents/skills/                 # Installed Superpowers + Three.js Game & Graphics Skills
├── ARCHITECTURE.md                 # System architecture, module responsibilities & data flow
├── THREEJS_GAME_SKILLS.md          # Applied Three.js graphics, water, cloud & geometry contracts
├── src/
│   ├── App.jsx                     # Root state machine, 20Hz game loop, full-screen sky & HUD
│   ├── index.css                   # Typography, fluid animations, bubble pop & cloud drift keyframes
│   ├── audio/
│   │   └── soundEngine.js          # Web Audio API procedural synthesizer (zero external MP3s)
│   ├── data/
│   │   └── gameData.js             # Evolutions, click upgrades, helpers, weathers, badges
│   └── components/
│       ├── AlanyaWelcomeScreen.jsx # Mediterranean summer loading screen with text shimmer
│       ├── BubbleNumber.jsx        # Graffiti cartoon bubble numbers with 3D extrude & gloss shine
│       ├── ComicToast.jsx          # Cartoon comic splash notification banners (Images 1-3)
│       ├── GameIcons.jsx           # 100% custom multi-layer SVG vector game icon library
│       ├── ShopPanel.jsx           # Left cabana shop tabs, pedestal statues & progression cards
│       └── ThreeStage.jsx          # Full-viewport unclipped 3D Three.js WebGL world & Llama
```

---

## 4. Key Architectural Contracts

### 4.1 Full-Viewport Unclipped 3D World (`100dvw × 100dvh`)
- [`ThreeStage.jsx`](file:///Users/bamsefar/Desktop/Chilli%20clicker%20game/src/components/ThreeStage.jsx) is mounted inside a `fixed inset-0 z-[5]` container spanning the entire viewport.
- On desktop (`cw >= 1024`), `camera.setViewOffset(cw, ch, -cw * 0.21, 0, cw, ch)` shifts the projection center to the right 54% of the screen while allowing 3D clouds, flying Golden Piñata Llamas, splash rings, and water droplets to travel across the entire screen without clipping.

### 4.2 Full-Screen Atmospheric Sky & Multi-Layer Drifting Clouds
- **3D Layer (`threejs-volumetric-clouds` & `threejs-atmosphere-aerial-perspective`)**:
  - A `BackSide` `ShaderMaterial` sky dome (`skyDome`) renders a Rayleigh/Mie horizon gradient and sun halo that adapts to the active weather realm.
  - 12 sculpted 3D cumulus cloud clusters (`driftingClouds`) with `onBeforeCompile` silver-lining rim illumination drift continuously from `x = -24.5` to `x = +19.5` across the entire viewport.
- **2D Horizon Layer (`App.jsx` + `index.css`)**:
  - 8 parallax vector cumulus clouds (`FULL_SCREEN_CLOUDS`) animate via `@keyframes drift-cloud-across` from `-32dvw` to `+124dvw`.

### 4.3 Authored 3D Tropical Resort Atoll Island (`threejs-procedural-geometry`, `threejs-water-optics`, `threejs-procedural-vegetation`)
- **PMREM Studio/Resort Environment IBL**: Uses `RoomEnvironment` + `PMREMGenerator` for realistic specular reflections on water, wet rocks, ceramic tiles, gold crowns, and aviator sunglasses.
- **Sculpted Basalt Cliffs with Vertex-Color AO**: `createSculptedCliffTier()` displaces radial cliff rings with harmonic rock facets and bakes vertex-color ambient occlusion into crevices.
- **Travertine Marble Infinity Pool & Ceramic Mosaic Floor**: Built with `THREE.ExtrudeGeometry` and a central hole (`poolHole`) plus a procedural `512×512` ceramic tile mosaic texture (`createPoolMosaicTexture()`).
- **`threejs-water-optics` Lagoon Water**: A `52×52` grid mesh clamped to radius 1.74 (under the coping bevel) driven by a 4-band directional Gerstner wave cascade plus interactive click-ripple impulses. Features 100% opaque physical water (`transmission: 0`, `transparent: false`, `roughness: 0.04`, `clearcoat: 1.0`) so the pool floor is completely hidden, while vertex colors animate between deep sapphire troughs, aquamarine crests, and seafoam edges.
- **Curved Coconut Palm Trees & Resort Props**: Two curved, ringed-trunk coconut palms (`buildCurvedPalmTree`), a multi-boulder bamboo waterfall, a striped cabana umbrella, a timber tiki boardwalk pier with lifebuoy, a surfboard, and two flickering 3D tiki torches.

### 4.4 Graffiti Cartoon Bubble Numbers (`src/components/BubbleNumber.jsx`)
- Matches the user's reference graffiti bubble lettering style:
  - **Bulbous Bubble Typography**: Styled with `Rubik Bubbles`, `DynaPuff`, and `Fredoka` font families.
  - **Multi-Layer 3D Extruded Block Shadow**: Stacked vector offsets in deep crimson (`#700c28` / `#be123c`), amber (`#78350f`), or ocean navy (`#082f49`).
  - **Glossy Specular Shine Capsules & Reflection Dots**: Curved elongated pill highlights on each letter lobe with crisp white specular dots.
  - **Comic Accents**: Floating cartoon halo ring, bottom drip droplets, and 4-point sparkle star glints.
  - **Water Splash Micro-Bubble Bursts**: 4–6 radial splash particles bursting outwards on each click.

### 4.4 3D Chilled Tropical Llama on a Frosted Donut Floatie (Zero Z-Fighting)
- Uses procedural `512×512` fluffy Llama fleece + bump textures (`createProceduralFleeceTextures()`) and a Peruvian fiesta poncho collar (`createPonchoStripeTexture()`) on single clean meshes with **zero co-planar shell overlaps**.
- Features articulated chewing/laughing lower jaw (`jawPivot`), banana-shaped ears, cloven hooves, and expressive 3D eyelids/eyebrows/star-eyes that react to **Chilled**, **Wave Splash**, **Mega Crit**, and **Rage Frenzy** states.

### 4.5 Accessible, High-Craft Game UI (`threejs-game-ui-designer` & `modern-web-guidance`)
- Zero standard OS text emojis: all icons are rendered via [`<GameIcon />`](file:///Users/bamsefar/Desktop/Chilli%20clicker%20game/src/components/GameIcons.jsx).
- Uses dynamic viewport units (`h-dvh w-dvw`), `rem`-based and `clamp()` fluid typography, ≥44px interactive touch targets on stage carousel and active skill buttons, and native `<dialog closedby="any">` modals with light-dismiss fallback.

### 4.6 Alanya Street Food, Brainrot Humor & 16 Helper Tiers
- **18 Click Upgrades**: From Maraş Dondurma Rizz to Mewing at Cleopatra Beach, 40-Layer Pistachio Baklava, Grand Bazaar Genuine Fake Rolex, and Alanya Teleferik High-Altitude Mog.
- **16 Helper Enterprises**: From rotating Döner spits and 5 AM Dürüm shacks to Dimçay river picnic rafts, Red Tower pirate foam party ships, and Seljuk cosmic sultan hover-bazaars.
- **Multi-Hour Progression Curve**: Stretches idle economy through quadrillions ($10^{15}-10^{18}$), preventing fast max-outs.

### 4.7 Alanya VIP Lagoon Rebirth System
- All references across state, UI, badges, modals, and toasts strictly use **Rebirth** (no "Ascend").
- Requires a minimum of 1,000,000 lifetime vibes for the first Golden Citrus token, scaling as $\lfloor(\text{lifetimeVibes} / 10^6)^{0.45}\rfloor$. Each token yields +25% permanent Global Vibes.
