---
name: threejs-awesome-game-graphics
description: |
  Best practices and techniques synthesized from `majidmanzarpour/threejs-game-skills` (14 3D game skills) and `scottstts/Threejs-Awesome-Graphics-Agent-Skills` (43 procedural & shader skills). Use whenever building or upgrading Three.js 3D games, procedural characters, realistic water/waves, particle VFX, or game UI.
---

# Three.js Awesome Game & Graphics Agent Skill

## 1. Zero Z-Fighting & Procedural Sculpting (`threejs-object-sculptor`)
- **NEVER stack co-planar meshes** at `1.005x` scale for belly patches, markings, or facial decals—this causes WebGL depth-buffer z-fighting and color flickering.
- Instead:
  1. Bake multi-color markings, wool curls, wood grain, and strata directly into a **`THREE.CanvasTexture` (`map` + `bumpMap`)** on the primary mesh, OR
  2. Build distinct 3D volumetric sub-parts (`muzzleGroup`, `eyelidTop`, `eyelidBottom`, `browMesh`, `ponchoCollar`) that protrude cleanly in 3D space with genuine depth separation (`> 0.03` world units).
- **Deform Base Primitives**: Never use raw unmodified spheres/cylinders for organic creatures—iterate over `geometry.attributes.position` to sculpt tapers/curves and call `geometry.computeVertexNormals()`.

## 2. Hierarchical Pivots & Phase-Offset Animation (`threejs-character-builder`)
- Structure characters as a multi-joint pivot hierarchy: `rootGroup -> torsoGroup -> neckPivot -> headPivot -> { jawPivot, earLeftPivot, earRightPivot, browL/R, eyelidTopL/R, eyelidBotL/R }`.
- Apply **phase-offset sine waves** (`sin(t * freq - phaseLag)`) across spine/neck/head/ears so motion ripples organically rather than moving like a rigid balloon.

## 3. Full-Viewport Unclipped 3D World (`threejs-environment-artist`)
- Mount the Three.js `<canvas>` across the full `100vw x 100vh` viewport (`fixed inset-0`) behind floating UI panels so flying entities, orbital helpers, and particle bursts are never clipped by a rectangular DOM box.
- Use `camera.setViewOffset(fullW, fullH, offsetX, offsetY, fullW, fullH)` to position the hero island in the open stage while keeping the full screen available for 3D motion.

## 4. Real-Time Gerstner Water Waves & Interactive Splash Waves (`procedural/water`)
- Displace a subdivided water mesh (`PlaneGeometry` or `CircleGeometry`, `44x44` segments) each frame using summed directional Gerstner/sine waves plus interactive click-ripple impulses:
  `dy_splash = amp * Math.sin(10 * r - 18 * age) * Math.exp(-1.4 * r - 2.5 * age)`
- Call `waterGeo.computeVertexNormals()` each frame so specular highlights react dynamically to wave crests.
- Pair vertex waves with **3D Crown Splash Wave Rings** and velocity-stretched droplet fountains when rapid clicking occurs.

## 5. Custom Vector SVG Game Iconography (`game-ui-designer`)
- Never use standard OS text emojis (`🍊`, `🌊`, `🏖️`) in game UI—use custom multi-layered SVG vector game icons with `<linearGradient>`, specular highlights, and bold comic outlines.
