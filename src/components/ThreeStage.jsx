import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const WEATHER_THEMES = {
  sunny_onsen: {
    colorA: 0xe0f2fe,
    colorB: 0xfef08a,
    waterColor: 0x06b6d4,
    waterDeepColor: 0x0369a1,
    waterEmissive: 0x0284c7,
    rimColor: 0x38bdf8,
    keyColor: 0xfff7ed,
    auraColor: 0x22d3ee,
    skyTop: 0x0284c7,
    skyHorizon: 0xbae6fd,
    mode: 'rise_steam',
  },
  sakura: {
    colorA: 0xfbcfe8,
    colorB: 0xf472b6,
    waterColor: 0x22d3ee,
    waterDeepColor: 0x0891b2,
    waterEmissive: 0x0e7490,
    rimColor: 0xf472b6,
    keyColor: 0xffe4e6,
    auraColor: 0xf472b6,
    skyTop: 0xdb2777,
    skyHorizon: 0xfce7f3,
    mode: 'sakura_drift',
  },
  gold_rain: {
    colorA: 0xfef08a,
    colorB: 0xf59e0b,
    waterColor: 0x06b6d4,
    waterDeepColor: 0x0284c7,
    waterEmissive: 0x0369a1,
    rimColor: 0xfacc15,
    keyColor: 0xfef9c3,
    auraColor: 0xfacc15,
    skyTop: 0xd97706,
    skyHorizon: 0xfef08a,
    mode: 'gold_fall',
  },
  matrix: {
    colorA: 0x4ade80,
    colorB: 0x22d3ee,
    waterColor: 0x10b981,
    waterDeepColor: 0x047857,
    waterEmissive: 0x065f46,
    rimColor: 0x22c55e,
    keyColor: 0xd1fae5,
    auraColor: 0x4ade80,
    skyTop: 0x064e3b,
    skyHorizon: 0x6ee7b7,
    mode: 'matrix_rise',
  },
  cosmic: {
    colorA: 0xc084fc,
    colorB: 0x38bdf8,
    waterColor: 0x6366f1,
    waterDeepColor: 0x3730a3,
    waterEmissive: 0x4338ca,
    rimColor: 0xa855f7,
    keyColor: 0xf3e8ff,
    auraColor: 0xc084fc,
    skyTop: 0x311042,
    skyHorizon: 0xc084fc,
    mode: 'cosmic_orbit',
  },
};

const HELPER_PALETTE = [
  { id: 'rubber_duck', color: 0xfacc15, accent: 0xf97316, type: 'duck' },
  { id: 'intern', color: 0x38bdf8, accent: 0xfef08a, type: 'float' },
  { id: 'pelican', color: 0xf8fafc, accent: 0xfb923c, type: 'pelican' },
  { id: 'slop_server', color: 0xa855f7, accent: 0x22d3ee, type: 'server' },
  { id: 'influencer', color: 0xf472b6, accent: 0xffffff, type: 'ringlight' },
  { id: 'yuzu_shrine', color: 0xef4444, accent: 0xfbbf24, type: 'torii' },
  { id: 'collider', color: 0x06b6d4, accent: 0xec4899, type: 'atom' },
  { id: 'time_tub', color: 0x10b981, accent: 0xfacc15, type: 'portal' },
  { id: 'dyson_sphere', color: 0xfbbf24, accent: 0xfffbeb, type: 'dyson' },
];

/**
 * Generates a procedural 3D fluffy alpaca/llama wool texture + bumpMap
 * Zero overlapping co-planar meshes -> 100% zero z-fighting!
 */
function createProceduralFleeceTextures() {
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = 512;
  colorCanvas.height = 512;
  const cCtx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');

  // Base warm cream-sand alpaca wool gradient
  const baseGrad = cCtx.createLinearGradient(0, 0, 0, 512);
  baseGrad.addColorStop(0, '#fff7dc');
  baseGrad.addColorStop(0.5, '#f6dfb2');
  baseGrad.addColorStop(1, '#e3be82');
  cCtx.fillStyle = baseGrad;
  cCtx.fillRect(0, 0, 512, 512);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  // Layer 900 fluffy wool curl tufts
  for (let i = 0; i < 900; i++) {
    const x = (i * 73) % 512;
    const y = ((i * 139) % 512);
    const r = 10 + (i % 9);

    // Subtle warm shadow under each curl
    cCtx.fillStyle = 'rgba(180, 125, 65, 0.16)';
    cCtx.beginPath();
    cCtx.arc(x, y + 3, r, 0, Math.PI * 2);
    cCtx.fill();

    // Bright fluffy wool puff highlight
    cCtx.fillStyle = i % 2 === 0 ? 'rgba(255, 250, 232, 0.36)' : 'rgba(248, 226, 182, 0.32)';
    cCtx.beginPath();
    cCtx.arc(x, y, r * 0.85, 0, Math.PI * 2);
    cCtx.fill();

    // Bump height puff
    const bGrad = bCtx.createRadialGradient(x - 2, y - 2, 1, x, y, r);
    bGrad.addColorStop(0, '#ffffff');
    bGrad.addColorStop(0.7, '#a8a8a8');
    bGrad.addColorStop(1, '#505050');
    bCtx.fillStyle = bGrad;
    bCtx.beginPath();
    bCtx.arc(x, y, r, 0, Math.PI * 2);
    bCtx.fill();
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(2, 2);
  colorMap.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);

  return { colorMap, bumpMap };
}

/**
 * Generates a vibrant Andean / Peruvian woven fiesta poncho stripe texture
 */
function createPonchoStripeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const stripes = [
    '#e11d48',
    '#facc15',
    '#06b6d4',
    '#ffffff',
    '#9333ea',
    '#22c55e',
    '#f97316',
    '#fde047',
  ];
  const h = 256 / stripes.length;
  stripes.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, i * h, 256, h);
  });

  // Woven diamond geometric motifs
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  for (let x = 16; x < 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 64);
    ctx.lineTo(x + 10, 76);
    ctx.lineTo(x, 88);
    ctx.lineTo(x - 10, 76);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, 160);
    ctx.lineTo(x + 10, 172);
    ctx.lineTo(x, 184);
    ctx.lineTo(x - 10, 172);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Resort Mosaic Pool Tile Texture (`threejs-aaa-graphics-builder`)
 * Generates a shimmering turquoise & aqua ceramic mosaic floor with grout lines and caustic highlights.
 */
function createPoolMosaicTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0369a1';
  ctx.fillRect(0, 0, size, size);

  const tileSize = 32;
  const palette = ['#0284c7', '#0369a1', '#0ea5e9', '#0891b2', '#06b6d4', '#38bdf8'];
  for (let y = 0; y < size; y += tileSize) {
    for (let x = 0; x < size; x += tileSize) {
      const idx = ((x / tileSize) * 7 + (y / tileSize) * 13) % palette.length;
      ctx.fillStyle = palette[idx];
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Subtle glossy corner highlight on each ceramic tile
      ctx.fillStyle = 'rgba(224, 242, 254, 0.22)';
      ctx.fillRect(x + 4, y + 4, tileSize - 14, 5);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Cartoon Crown Splash Geometry (Matching user reference Image 4)
 * Generates an authored 3D cartoon splash crown with sharp spires, outward curling tips,
 * and vertex colors (ocean blue base -> vibrant cyan body -> pure white seafoam tips).
 */
function createCartoonCrownGeometry(radius = 1.1, height = 0.85, numSpires = 8) {
  const segments = 48;
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const indices = [];

  const colBase = new THREE.Color(0x0284c7); // Deep ocean blue
  const colBody = new THREE.Color(0x38bdf8); // Vibrant tropical cyan
  const colFoam = new THREE.Color(0xffffff); // Seafoam white tip

  // Ring 0: Submerged base ring at water level
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(a) * radius * 0.94, -0.05, Math.sin(a) * radius * 0.94);
    colors.push(colBase.r, colBase.g, colBase.b);
  }

  // Ring 1: Mid splash body with outward flare
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const wave = Math.sin(a * numSpires);
    const flare = 1.12 + wave * 0.08;
    positions.push(Math.cos(a) * radius * flare, height * 0.42, Math.sin(a) * radius * flare);
    colors.push(colBody.r, colBody.g, colBody.b);
  }

  // Ring 2: Spire tips (scalloped crests with outward curl)
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const wave = Math.sin(a * numSpires);
    const spireNorm = Math.max(0, wave);
    const tipH = height * (0.35 + spireNorm * 0.95);
    const tipR = radius * (1.18 + spireNorm * 0.38);
    positions.push(Math.cos(a) * tipR, tipH, Math.sin(a) * tipR);

    const c = new THREE.Color().copy(colBody).lerp(colFoam, spireNorm * 0.92);
    colors.push(c.r, c.g, c.b);
  }

  const ringSize = segments + 1;
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i < segments; i++) {
      const a = r * ringSize + i;
      const b = a + 1;
      const c = (r + 1) * ringSize + i;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Procedural Cartoon Water Vortex Spiral Ribbon (Matching user reference Image 5)
 * Generates an authored 3D water tornado spiral wrapping around the llama during stacked click frenzy.
 */
function createWaterVortexGeometry() {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const indices = [];
  const steps = 64;
  const turns = 2.4;

  const colDeep = new THREE.Color(0x0284c7);
  const colBright = new THREE.Color(0x38bdf8);
  const colFoam = new THREE.Color(0xffffff);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    const r = 1.08 + t * 0.52;
    const y = 0.12 + t * 1.35;

    // Inner edge
    positions.push(Math.cos(angle) * (r - 0.16), y, Math.sin(angle) * (r - 0.16));
    const cIn = new THREE.Color().copy(colDeep).lerp(colBright, t);
    colors.push(cIn.r, cIn.g, cIn.b);

    // Outer edge with white foam crest
    positions.push(Math.cos(angle) * (r + 0.14), y + 0.12, Math.sin(angle) * (r + 0.14));
    const cOut = new THREE.Color().copy(colBright).lerp(colFoam, 0.9);
    colors.push(cOut.r, cOut.g, cOut.b);
  }

  for (let i = 0; i < steps; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b);
    indices.push(b, c, d);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export default function ThreeStage({
  evolutionIndex = 0,
  helperCounts = {},
  weatherId = 'sunny_onsen',
  isFrenzy = false,
  goldenSpawn = null,
  screenShakeEnabled = true,
  externalClickPulse = 0,
  onMascotClick,
  onGoldenClick,
}) {
  const mountRef = useRef(null);

  const isGoldenActive = Boolean(
    goldenSpawn && (typeof goldenSpawn === 'object' ? goldenSpawn.active : goldenSpawn)
  );

  const stateRef = useRef({
    evolutionIndex,
    helperCounts,
    weatherId,
    isFrenzy,
    isGoldenActive,
    screenShakeEnabled,
    onMascotClick,
    onGoldenClick,
  });

  const rebuildOrbitersRef = useRef(null);
  const triggerCenterBoopRef = useRef(null);

  useEffect(() => {
    stateRef.current.evolutionIndex = evolutionIndex;
    stateRef.current.weatherId = weatherId;
    stateRef.current.isFrenzy = isFrenzy;
    stateRef.current.isGoldenActive = isGoldenActive;
    stateRef.current.screenShakeEnabled = screenShakeEnabled;
    stateRef.current.onMascotClick = onMascotClick;
    stateRef.current.onGoldenClick = onGoldenClick;
  }, [
    evolutionIndex,
    weatherId,
    isFrenzy,
    isGoldenActive,
    screenShakeEnabled,
    onMascotClick,
    onGoldenClick,
  ]);

  const helperSignature = JSON.stringify(helperCounts || {});
  useEffect(() => {
    stateRef.current.helperCounts = helperCounts || {};
    if (rebuildOrbitersRef.current) {
      rebuildOrbitersRef.current(helperCounts || {});
    }
  }, [helperSignature, helperCounts]);

  useEffect(() => {
    if (externalClickPulse > 0 && triggerCenterBoopRef.current) {
      triggerCenterBoopRef.current();
    }
  }, [externalClickPulse]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // =========================================================================
    // 1. FULL-VIEWPORT UNCLIPPED SCENE, CAMERA (WITH VIEW OFFSET) & RENDERER
    // =========================================================================
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 160);
    const baseCamPos = new THREE.Vector3(0, 3.65, 10.1);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0.32, 0);

    // Apply camera view offset on desktop so the island centers in the right 54% of the screen
    // while the 3D canvas spans 100vw x 100vh with ZERO rectangular clipping!
    const applyCameraFraming = (cw, ch) => {
      camera.aspect = cw / ch;
      if (cw >= 1024) {
        camera.setViewOffset(cw, ch, -cw * 0.21, 0, cw, ch);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
    };
    applyCameraFraming(width, height);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const disposableGeometries = [];
    const disposableMaterials = [];
    const disposableTextures = [];
    const trackGeo = (g) => {
      disposableGeometries.push(g);
      return g;
    };
    const trackMat = (m) => {
      disposableMaterials.push(m);
      return m;
    };
    const trackTex = (t) => {
      disposableTextures.push(t);
      return t;
    };

    // PMREM Studio/Resort Environment IBL (`shader-cookbook.md: Prerequisite: Renderer And Environment Map`)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = trackTex(envTarget.texture);
    scene.environmentIntensity = 0.72;
    pmrem.dispose();

    // =========================================================================
    // 2. SUN-DRENCHED RESORT LIGHTING RIG + ATMOSPHERIC SKY DOME + FULL-SCREEN 3D CLOUDS
    // =========================================================================
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x0284c7, 1.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.25);
    keyLight.position.set(6.5, 11.5, 7.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    const d = 5.4;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0016;
    keyLight.shadow.normalBias = 0.04;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.45);
    rimLight.position.set(-6.5, 4.5, -5.5);
    scene.add(rimLight);

    const bounceLight = new THREE.PointLight(0x22d3ee, 1.55, 11);
    bounceLight.position.set(0, 0.5, 2.5);
    scene.add(bounceLight);

    const tikiGlowLight = new THREE.PointLight(0xf97316, 1.35, 6.5);
    tikiGlowLight.position.set(1.5, 1.1, 1.2);
    scene.add(tikiGlowLight);

    const frenzyLightA = new THREE.PointLight(0xff007f, 0, 15);
    const frenzyLightB = new THREE.PointLight(0x00f5d4, 0, 15);
    scene.add(frenzyLightA, frenzyLightB);

    // --- 2B. Atmospheric Gradient Sky Dome (`shader-cookbook.md: Gradient Sky Dome`) ---
    const skyUniforms = {
      uTop: { value: new THREE.Color(0x0284c7) },
      uHorizon: { value: new THREE.Color(0xbae6fd) },
      uSunColor: { value: new THREE.Color(0xfffbeb) },
      uSunDir: { value: new THREE.Vector3(0.42, 0.34, 0.55).normalize() },
    };
    const skyDomeMat = trackMat(
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        transparent: true,
        uniforms: skyUniforms,
        vertexShader: `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vDir;
          uniform vec3 uTop;
          uniform vec3 uHorizon;
          uniform vec3 uSunColor;
          uniform vec3 uSunDir;
          void main() {
            float h = clamp(vDir.y * 0.55 + 0.45, 0.0, 1.0);
            vec3 col = mix(uHorizon, uTop, pow(h, 0.65));
            float sunDot = clamp(dot(normalize(vDir), normalize(uSunDir)), 0.0, 1.0);
            col += uSunColor * (pow(sunDot, 520.0) * 0.9 + pow(sunDot, 7.0) * 0.28);
            gl_FragColor = vec4(col, 0.42);
          }
        `,
      })
    );
    const skyDome = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(85, 32, 16)), skyDomeMat);
    skyDome.frustumCulled = false;
    scene.add(skyDome);

    // --- 2C. Full-Viewport 3D Drifting Volumetric Cumulus Cloud System (`threejs-volumetric-clouds`) ---
    // Spans x from -24 to +18 so 3D clouds drift across the ENTIRE screen (left shop + center + right island!)
    const cloudSystemGroup = new THREE.Group();
    scene.add(cloudSystemGroup);

    const cloudMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xe0f2fe,
        emissiveIntensity: 0.28,
        roughness: 0.88,
        metalness: 0.0,
      })
    );
    // Inject silver-lining rim & sky-blue underside shading (`shader-cookbook.md: onBeforeCompile`)
    cloudMat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
         float cloudFres = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 2.2);
         totalEmissiveRadiance += vec3(1.0, 0.98, 0.88) * cloudFres * 0.45;`
      );
    };
    cloudMat.customProgramCacheKey = () => 'cumulus-silver-lining';

    const puffGeo = trackGeo(new THREE.IcosahedronGeometry(1, 2));
    const driftingClouds = [];
    const CLOUD_SPECS = [
      { x: -21.0, y: 3.8, z: -11.5, scale: 1.15, speed: 0.36, phase: 0.2 },
      { x: -16.2, y: 2.1, z: -9.5, scale: 0.85, speed: 0.44, phase: 1.4 },
      { x: -11.5, y: 4.5, z: -13.2, scale: 1.35, speed: 0.31, phase: 2.7 },
      { x: -7.0, y: 2.8, z: -10.8, scale: 0.95, speed: 0.48, phase: 3.9 },
      { x: -2.4, y: 4.1, z: -12.4, scale: 1.22, speed: 0.35, phase: 0.8 },
      { x: 2.2, y: 3.2, z: -11.0, scale: 1.05, speed: 0.42, phase: 2.1 },
      { x: 6.8, y: 4.6, z: -13.8, scale: 1.38, speed: 0.29, phase: 4.5 },
      { x: 11.4, y: 2.5, z: -9.8, scale: 0.88, speed: 0.46, phase: 5.2 },
      { x: 15.8, y: 3.9, z: -12.0, scale: 1.18, speed: 0.38, phase: 1.9 },
      { x: -18.5, y: 0.9, z: -14.5, scale: 1.08, speed: 0.33, phase: 3.1 },
      { x: -5.2, y: 1.2, z: -15.0, scale: 1.12, speed: 0.37, phase: 4.8 },
      { x: 8.5, y: 1.1, z: -14.2, scale: 1.02, speed: 0.41, phase: 0.6 },
    ];

    const PUFF_OFFSETS = [
      [0, 0, 0, 0.72, 0.52, 0.58],
      [-0.58, -0.08, 0.08, 0.54, 0.42, 0.48],
      [0.62, -0.06, -0.05, 0.56, 0.44, 0.48],
      [-0.25, 0.24, -0.08, 0.48, 0.42, 0.44],
      [0.28, 0.22, 0.09, 0.46, 0.4, 0.44],
      [-0.95, -0.16, 0.02, 0.38, 0.3, 0.36],
      [0.96, -0.15, 0.04, 0.4, 0.32, 0.38],
    ];

    CLOUD_SPECS.forEach((spec) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(spec.x, spec.y, spec.z);
      cGroup.scale.setScalar(spec.scale);
      PUFF_OFFSETS.forEach(([px, py, pz, sx, sy, sz]) => {
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set(px, py, pz);
        puff.scale.set(sx, sy, sz);
        cGroup.add(puff);
      });
      cloudSystemGroup.add(cGroup);
      driftingClouds.push({
        group: cGroup,
        baseY: spec.y,
        speed: spec.speed,
        phase: spec.phase,
      });
    });

    // =========================================================================
    // 3. AUTHORED 3D TROPICAL RESORT ATOLL ISLAND (`threejs-procedural-geometry`)
    //    Replaces boxy primitives with sculpted multi-tier volcanic basalt cliffs
    //    (with Vertex-Color AO), organic golden sand beach cove, travertine
    //    infinity-pool rim & spillway, wooden tiki pier, waterfall, and resort props!
    // =========================================================================
    const worldRoot = new THREE.Group();
    worldRoot.position.set(0, -0.42, 0);
    scene.add(worldRoot);

    const islandGroup = new THREE.Group();
    islandGroup.rotation.y = Math.PI / 4; // 45-degree isometric diamond orientation
    worldRoot.add(islandGroup);

    // Helper: Sculpted organic rock/cliff tier with harmonic facets + Vertex-Color AO (`shader-cookbook.md`)
    const createSculptedCliffTier = (rTop, rBot, height, radialSegs, heightSegs, topHex, botHex, seed) => {
      const geo = trackGeo(new THREE.CylinderGeometry(rTop, rBot, height, radialSegs, heightSegs));
      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      const colTop = new THREE.Color(topHex);
      const colBot = new THREE.Color(botHex);
      const colTmp = new THREE.Color();

      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        const angle = Math.atan2(vz, vx);
        const radius = Math.hypot(vx, vz);
        const normY = (vy + height / 2) / Math.max(0.001, height); // 0 at bottom, 1 at top

        if (radius > 0.05) {
          // Harmonic rock crag displacement (preserves closed seam at angle wrap)
          const crag =
            1.0 +
            Math.cos(angle * 4 + seed) * 0.075 +
            Math.sin(angle * 7 - seed * 1.7) * 0.055 +
            Math.cos(angle * 11 + normY * 3.2) * 0.035;
          // Keep top rim flatter where the resort terrace sits
          const rimBlend = normY > 0.85 ? 0.35 : 1.0;
          const factor = 1.0 + (crag - 1.0) * rimBlend;
          pos.setX(i, vx * factor);
          pos.setZ(i, vz * factor);

          // Bake Vertex-Color Ambient Occlusion (cavities & lower spire darker)
          const cavityAO = 0.82 + 0.18 * Math.cos(angle * 7 - seed * 1.7);
          colTmp.copy(colBot).lerp(colTop, Math.pow(normY, 0.75)).multiplyScalar(cavityAO);
        } else {
          colTmp.copy(normY > 0.5 ? colTop : colBot);
        }
        colors[i * 3] = colTmp.r;
        colors[i * 3 + 1] = colTmp.g;
        colors[i * 3 + 2] = colTmp.b;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.computeVertexNormals();
      return geo;
    };

    const cliffVertexColorMat = trackMat(
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.84,
        metalness: 0.06,
        flatShading: true,
      })
    );

    // Tier 1: Upper Sunlit Limestone & Terracotta Cliff Shelf
    const upperCliff = new THREE.Mesh(
      createSculptedCliffTier(2.86, 2.32, 0.62, 28, 3, 0xd97706, 0x92400e, 0.4),
      cliffVertexColorMat
    );
    upperCliff.position.y = -0.54;
    upperCliff.castShadow = true;
    upperCliff.receiveShadow = true;
    islandGroup.add(upperCliff);

    // Tier 2: Mid Volcanic Canyon Basalt Crags
    const midCliff = new THREE.Mesh(
      createSculptedCliffTier(2.26, 1.42, 0.78, 24, 3, 0x92400e, 0x57260b, 1.9),
      cliffVertexColorMat
    );
    midCliff.position.y = -1.18;
    midCliff.castShadow = true;
    islandGroup.add(midCliff);

    // Tier 3: Deep Inverted Basalt Sea-Spire Root
    const lowerSpire = new THREE.Mesh(
      createSculptedCliffTier(1.38, 0.18, 1.05, 18, 3, 0x57260b, 0x271206, 3.3),
      cliffVertexColorMat
    );
    lowerSpire.position.y = -2.02;
    islandGroup.add(lowerSpire);

    // Orbiting Floating Reef Outcrops & Glowing Sea-Cave Crystals Underneath
    const crystalMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        flatShading: true,
      })
    );
    [
      [-1.85, -0.88, 1.35, 0.46, true],
      [1.82, -0.98, -1.42, 0.5, false],
      [1.42, -1.22, 1.65, 0.42, true],
      [-1.48, -1.15, -1.62, 0.44, false],
    ].forEach(([cx, cy, cz, cr, hasCrystal]) => {
      const crag = new THREE.Mesh(
        createSculptedCliffTier(cr, cr * 0.45, cr * 1.4, 9, 2, 0xb45309, 0x451a03, cx * 2),
        cliffVertexColorMat
      );
      crag.position.set(cx, cy, cz);
      islandGroup.add(crag);

      if (hasCrystal) {
        const shard = new THREE.Mesh(
          trackGeo(new THREE.OctahedronGeometry(cr * 0.38, 0)),
          crystalMat
        );
        shard.scale.set(0.65, 1.65, 0.65);
        shard.position.set(cx * 1.04, cy + cr * 0.55, cz * 1.04);
        shard.rotation.set(0.25, cx, -0.2);
        islandGroup.add(shard);
      }
    });

    // --- 3B. Contoured Golden Sand Beach Cove & Lush Emerald Turf Terraces ---
    const beachCoveGeo = createSculptedCliffTier(2.68, 2.86, 0.28, 36, 2, 0xfef08a, 0xeab308, 2.5);
    const sandMat = trackMat(
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.64,
        metalness: 0.02,
      })
    );
    const beachCoveMesh = new THREE.Mesh(beachCoveGeo, sandMat);
    beachCoveMesh.position.y = -0.14;
    beachCoveMesh.receiveShadow = true;
    beachCoveMesh.castShadow = true;
    islandGroup.add(beachCoveMesh);

    // Sculpted Lush Emerald Tropical Lawn Terrace Pad
    // Sculpted Lush Emerald Tropical Lawn Terrace Pad
    // IMPORTANT: Built with a central hole matching the pool perimeter so ZERO green grass exists inside or under the pool!
    const turfShape = new THREE.Shape();
    const turfOuterSides = 36;
    for (let i = 0; i < turfOuterSides; i++) {
      const a = (i / turfOuterSides) * Math.PI * 2;
      const r = 2.48 + Math.cos(a * 4 + 1.1) * 0.08 + Math.sin(a * 7 - 1.8) * 0.05;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) turfShape.moveTo(x, y);
      else turfShape.lineTo(x, y);
    }
    turfShape.closePath();

    // Cut out pool hole (radius 1.72) so turf stops cleanly under the travertine coping
    const turfHole = new THREE.Path();
    for (let i = 0; i < turfOuterSides; i++) {
      const a = (i / turfOuterSides) * Math.PI * 2;
      const x = Math.cos(a) * 1.72;
      const y = Math.sin(a) * 1.72;
      if (i === 0) turfHole.moveTo(x, y);
      else turfHole.lineTo(x, y);
    }
    turfHole.closePath();
    turfShape.holes.push(turfHole);

    const turfGeo = trackGeo(
      new THREE.ExtrudeGeometry(turfShape, {
        depth: 0.14,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
      })
    );
    turfGeo.rotateX(-Math.PI / 2);

    const turfMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x65a30d,
        roughness: 0.72,
      })
    );
    const turfTerrace = new THREE.Mesh(turfGeo, turfMat);
    turfTerrace.position.y = -0.05;
    turfTerrace.receiveShadow = true;
    islandGroup.add(turfTerrace);

    // --- 3C. Sculpted Travertine Marble Infinity-Pool Basin & Deep Ceramic Liner ---
    const travertineMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xfef3c7,
        roughness: 0.34,
        metalness: 0.03,
        clearcoat: 0.35,
        clearcoatRoughness: 0.2,
      })
    );
    const cedarWoodMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x9a3412,
        roughness: 0.48,
      })
    );

    const poolOuterRadius = 1.98;
    const poolInnerRadius = 1.66;
    const waterRadius = 1.74; // Extends 0.08 units neatly under the travertine coping bevel (zero gaps!)

    // 12-sided Sculpted Travertine Infinity Pool Coping Ring (via ExtrudeGeometry with hole)
    const copingShape = new THREE.Shape();
    const copingSides = 12;
    for (let i = 0; i < copingSides; i++) {
      const a = (i / copingSides) * Math.PI * 2 + Math.PI / copingSides;
      const x = Math.cos(a) * poolOuterRadius;
      const y = Math.sin(a) * poolOuterRadius;
      if (i === 0) copingShape.moveTo(x, y);
      else copingShape.lineTo(x, y);
    }
    copingShape.closePath();

    const poolHole = new THREE.Path();
    for (let i = 0; i < copingSides; i++) {
      const a = (i / copingSides) * Math.PI * 2 + Math.PI / copingSides;
      const x = Math.cos(a) * poolInnerRadius;
      const y = Math.sin(a) * poolInnerRadius;
      if (i === 0) poolHole.moveTo(x, y);
      else poolHole.lineTo(x, y);
    }
    poolHole.closePath();
    copingShape.holes.push(poolHole);

    const copingGeo = trackGeo(
      new THREE.ExtrudeGeometry(copingShape, {
        depth: 0.14,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 2,
      })
    );
    copingGeo.rotateX(-Math.PI / 2);
    const poolCopingMesh = new THREE.Mesh(copingGeo, travertineMat);
    poolCopingMesh.position.y = 0.03;
    poolCopingMesh.castShadow = true;
    poolCopingMesh.receiveShadow = true;
    islandGroup.add(poolCopingMesh);

    // Deep Ceramic Sunken Basin Liner (Under Coping)
    const basinGeo = trackGeo(new THREE.CylinderGeometry(1.72, 1.70, 0.45, 32, 1, true));
    const basinMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        roughness: 0.35,
        side: THREE.BackSide,
      })
    );
    const basinMesh = new THREE.Mesh(basinGeo, basinMat);
    basinMesh.position.y = -0.10;
    islandGroup.add(basinMesh);

    // Deep Ceramic Mosaic Floor (Submerged safely below the water)
    const mosaicTex = trackTex(createPoolMosaicTexture());
    const lagoonFloorMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: mosaicTex,
        color: 0x0284c7,
        roughness: 0.28,
      })
    );
    const lagoonFloor = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(1.72, 32)),
      lagoonFloorMat
    );
    lagoonFloor.rotation.x = -Math.PI / 2;
    lagoonFloor.position.y = -0.32;
    lagoonFloor.receiveShadow = true;
    islandGroup.add(lagoonFloor);

    // =========================================================================
    // 4. `threejs-water-optics` MULTI-WAVE OPAQUE LAGOON WATER + CREST FOAM
    // =========================================================================
    // Subdivided 52x52 grid plane clamped to waterRadius circle (tucks under coping)
    const WATER_SEGMENTS = 52;
    const gridWaterGeo = trackGeo(
      new THREE.PlaneGeometry(3.6, 3.6, WATER_SEGMENTS, WATER_SEGMENTS)
    );
    gridWaterGeo.rotateX(-Math.PI / 2);

    const waterPosAttr = gridWaterGeo.attributes.position;
    const waterBaseXZ = new Float32Array(waterPosAttr.count * 2);
    const waterColors = new Float32Array(waterPosAttr.count * 3);

    // Clamp grid vertices cleanly to waterRadius circle with full perimeter coverage
    for (let i = 0; i < waterPosAttr.count; i++) {
      let gx = waterPosAttr.getX(i);
      let gz = waterPosAttr.getZ(i);
      const r = Math.hypot(gx, gz);
      if (r > waterRadius) {
        gx = (gx / r) * waterRadius;
        gz = (gz / r) * waterRadius;
        waterPosAttr.setX(i, gx);
        waterPosAttr.setZ(i, gz);
      }
      waterBaseXZ[i * 2] = gx;
      waterBaseXZ[i * 2 + 1] = gz;
      // Initialize with vibrant tropical sapphire color
      waterColors[i * 3] = 0.01;
      waterColors[i * 3 + 1] = 0.52;
      waterColors[i * 3 + 2] = 0.78;
    }
    gridWaterGeo.setAttribute('color', new THREE.BufferAttribute(waterColors, 3));

    // Opaque, physical water material with Gerstner waves and dynamic vertex colors
    // NOTE: transparent: false + depthWrite: true ensures the pool floor & terrain NEVER show through!
    const waterMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        color: 0x0284c7, // Vibrant tropical deep azure
        emissive: 0x0369a1, // Radiant internal aquatic glow
        emissiveIntensity: 0.35,
        roughness: 0.04, // Mirror-smooth fluid reflection
        metalness: 0.06,
        clearcoat: 1.0, // Crystal gloss surface sheen
        clearcoatRoughness: 0.02,
        reflectivity: 0.92,
        transparent: false, // 100% OPAQUE - completely hides the floor!
        depthWrite: true,
      })
    );

    const waterMesh = new THREE.Mesh(gridWaterGeo, waterMat);
    waterMesh.position.y = 0.115;
    waterMesh.receiveShadow = true;
    islandGroup.add(waterMesh);

    // --- 4B. Stylized Cartoon Water Splash System (Matching user reference Images 4 & 5) ---
    const waveImpulses = []; // { x, z, age, amp }
    let clickStack = 0; // Click combo stack tracker

    const cartoonSplashMat = trackMat(
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.18,
        metalness: 0.04,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      })
    );

    // Sculpted Cartoon Crown Splashes with sharp spires & white foam crests (Image 4)
    const crownSplashGeo1 = trackGeo(createCartoonCrownGeometry(1.08, 0.75, 8));
    const crownSplashGeo2 = trackGeo(createCartoonCrownGeometry(1.24, 1.15, 6));
    const crownSplash1 = new THREE.Mesh(crownSplashGeo1, cartoonSplashMat);
    const crownSplash2 = new THREE.Mesh(crownSplashGeo2, cartoonSplashMat);
    crownSplash1.position.y = 0.12;
    crownSplash2.position.y = 0.12;
    crownSplash1.visible = false;
    crownSplash2.visible = false;
    islandGroup.add(crownSplash1, crownSplash2);

    // Cartoon Water Vortex Spiral Ribbon (Image 5)
    const vortexGeo = trackGeo(createWaterVortexGeometry());
    const waterVortexMesh = new THREE.Mesh(vortexGeo, cartoonSplashMat);
    waterVortexMesh.position.y = 0.12;
    waterVortexMesh.visible = false;
    islandGroup.add(waterVortexMesh);

    const triggerSplashWaveRing = (intensity = 1.0) => {
      waveImpulses.push({ x: 0, z: 0, age: 0, amp: 0.15 * intensity });
      if (waveImpulses.length > 6) waveImpulses.shift();

      // Surge click stack on every boop!
      clickStack = Math.min(25, clickStack + intensity * 2.2);
    };

    // --- 4C. `threejs-procedural-vegetation` Twin Curved Coconut Palm Trees + Resort World Prop Kit ---
    const trunkMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.78,
      })
    );
    const trunkRingMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.85,
      })
    );
    const frondMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.45,
        side: THREE.DoubleSide,
      })
    );
    const coconutMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3f2305,
        roughness: 0.7,
      })
    );

    const palmFronds = [];

    const buildCurvedPalmTree = (x, z, scale, leanX, leanZ, frondCount) => {
      const treeRoot = new THREE.Group();
      treeRoot.position.set(x, 0.05, z);
      treeRoot.scale.setScalar(scale);
      islandGroup.add(treeRoot);

      const segs = 8;
      let topPos = new THREE.Vector3(0, 0, 0);
      for (let s = 0; s < segs; s++) {
        const t = s / segs;
        const rTop = 0.105 * (1 - t * 0.42);
        const rBot = 0.125 * (1 - t * 0.36);
        const sx = Math.pow(t, 1.35) * leanX;
        const sy = s * 0.21 + 0.1;
        const sz = Math.pow(t, 1.35) * leanZ;

        const seg = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(rTop, rBot, 0.24, 10)),
          s % 2 === 0 ? trunkMat : trunkRingMat
        );
        seg.position.set(sx, sy, sz);
        seg.rotation.z = -t * leanX * 0.65;
        seg.rotation.x = t * leanZ * 0.65;
        seg.castShadow = true;
        treeRoot.add(seg);
        topPos.set(sx, sy + 0.11, sz);
      }

      const crownGroup = new THREE.Group();
      crownGroup.position.copy(topPos);
      treeRoot.add(crownGroup);

      // 3 Coconuts nestled under the frond crown
      for (let c = 0; c < 3; c++) {
        const ca = (c / 3) * Math.PI * 2;
        const nut = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.068, 10, 10)),
          coconutMat
        );
        nut.position.set(Math.cos(ca) * 0.08, -0.04, Math.sin(ca) * 0.08);
        crownGroup.add(nut);
      }

      // Multi-segment arched palm fronds
      for (let f = 0; f < frondCount; f++) {
        const frondPivot = new THREE.Group();
        frondPivot.rotation.y = (f / frondCount) * Math.PI * 2 + (f % 2) * 0.15;

        const leafletA = new THREE.Mesh(
          trackGeo(new THREE.ConeGeometry(0.15, 0.52, 5)),
          frondMat
        );
        leafletA.rotation.z = -Math.PI / 2 - 0.15;
        leafletA.scale.set(1, 1, 0.32);
        leafletA.position.set(0.24, 0.05, 0);
        leafletA.castShadow = true;

        const leafletTip = new THREE.Mesh(
          trackGeo(new THREE.ConeGeometry(0.11, 0.46, 5)),
          frondMat
        );
        leafletTip.rotation.z = -Math.PI / 2 - 0.52;
        leafletTip.scale.set(1, 1, 0.28);
        leafletTip.position.set(0.56, -0.06, 0);
        leafletTip.castShadow = true;

        frondPivot.add(leafletA, leafletTip);
        crownGroup.add(frondPivot);
        palmFronds.push({ pivot: frondPivot, phase: f * 0.9 + x });
      }
    };

    // Hero Tall Coconut Palm on Back-Left Promontory & Leaning Lagoon Palm on Front-Left Cove
    buildCurvedPalmTree(-1.55, -1.35, 1.08, 0.34, 0.12, 8);
    buildCurvedPalmTree(-1.82, 0.72, 0.78, 0.28, -0.18, 7);

    // --- 4D. Multi-Tiered Basalt Rock Waterfall & Bamboo Fountain on Back-Right Cliff ---
    const spoutCornerGroup = new THREE.Group();
    spoutCornerGroup.position.set(1.32, 0.05, -1.32);
    islandGroup.add(spoutCornerGroup);

    // Stacked volcanic waterfall boulders
    [
      [0.12, 0.16, -0.12, 0.34, 0.28, 0.32],
      [-0.18, 0.12, 0.14, 0.26, 0.22, 0.26],
      [0.24, 0.36, -0.22, 0.28, 0.32, 0.28],
    ].forEach(([rx, ry, rz, sx, sy, sz]) => {
      const rock = new THREE.Mesh(
        trackGeo(new THREE.DodecahedronGeometry(1, 1)),
        cliffVertexColorMat
      );
      rock.position.set(rx, ry, rz);
      rock.scale.set(sx, sy, sz);
      rock.castShadow = true;
      spoutCornerGroup.add(rock);
    });

    const bambooMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.38 })
    );
    const bambooPost = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.055, 0.065, 0.48, 10)),
      bambooMat
    );
    bambooPost.position.set(0.02, 0.28, -0.02);
    const bambooSpout = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.046, 0.046, 0.48, 10)),
      bambooMat
    );
    bambooSpout.position.set(-0.14, 0.42, 0.14);
    bambooSpout.rotation.set(0.55, 0, 0.55);
    spoutCornerGroup.add(bambooPost, bambooSpout);

    const waterStreamMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.45,
        roughness: 0.1,
        transparent: true,
        opacity: 0.88,
      })
    );
    const waterStreamMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.032, 0.068, 0.38, 12)),
      waterStreamMat
    );
    waterStreamMesh.position.set(-0.26, 0.21, 0.26);
    spoutCornerGroup.add(waterStreamMesh);

    // --- 4E. Luxury Resort World Props: Striped Cabana Umbrella, Timber Pier, Surfboard & Tiki Torches ---
    // 1. Striped Resort Cabana Umbrella on Back-Right Sun Deck
    const umbrellaGroup = new THREE.Group();
    umbrellaGroup.position.set(0.25, 0.1, -1.88);
    umbrellaGroup.rotation.z = 0.12;
    islandGroup.add(umbrellaGroup);

    const umbrellaPole = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.03, 0.035, 1.05, 10)),
      cedarWoodMat
    );
    umbrellaPole.position.y = 0.52;
    umbrellaPole.castShadow = true;
    umbrellaGroup.add(umbrellaPole);

    const umbrellaCanopy = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.58, 0.28, 8)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.45 }))
    );
    umbrellaCanopy.position.y = 1.02;
    umbrellaCanopy.castShadow = true;
    umbrellaGroup.add(umbrellaCanopy);

    const umbrellaTopFinial = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.055, 10, 10)),
      travertineMat
    );
    umbrellaTopFinial.position.y = 1.17;
    umbrellaGroup.add(umbrellaTopFinial);

    // 2. Timber Tiki Boardwalk Pier on Front-Right Overlook
    const pierGroup = new THREE.Group();
    pierGroup.position.set(1.55, 0.08, 1.25);
    pierGroup.rotation.y = -Math.PI / 4;
    islandGroup.add(pierGroup);

    for (let p = 0; p < 5; p++) {
      const plank = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.56, 0.045, 0.12)),
        cedarWoodMat
      );
      plank.position.set(0, 0.04, p * 0.15 - 0.25);
      plank.castShadow = true;
      plank.receiveShadow = true;
      pierGroup.add(plank);
    }
    // Lifebuoy ring on the pier post
    const postR = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.045, 0.05, 0.36, 8)),
      cedarWoodMat
    );
    postR.position.set(0.26, 0.18, 0.32);
    const lifebuoy = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.095, 0.032, 10, 20)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 }))
    );
    lifebuoy.position.set(0.26, 0.22, 0.36);
    pierGroup.add(postR, lifebuoy);

    // 3. Tropical Surfboard planted in the Golden Sand Cove
    const surfboardMesh = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.11, 0.52, 8, 16)),
      trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xfacc15,
          roughness: 0.18,
          clearcoat: 0.9,
        })
      )
    );
    surfboardMesh.scale.set(1.0, 1.0, 0.22);
    surfboardMesh.position.set(-1.12, 0.34, 1.65);
    surfboardMesh.rotation.set(-0.22, 0.45, -0.18);
    surfboardMesh.castShadow = true;
    islandGroup.add(surfboardMesh);

    // 4. Twin Flickering Tiki Torches with Animated 3D Flame Plumes
    const tikiFlames = [];
    const flameMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf97316,
        emissiveIntensity: 2.2,
        roughness: 0.2,
      })
    );
    [
      [1.72, 0.06, 0.42],
      [-0.42, 0.06, 1.78],
    ].forEach(([tx, ty, tz], idx) => {
      const torchGroup = new THREE.Group();
      torchGroup.position.set(tx, ty, tz);
      islandGroup.add(torchGroup);

      const pole = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.028, 0.036, 0.68, 8)),
        trunkMat
      );
      pole.position.y = 0.34;
      pole.castShadow = true;
      const basket = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.075, 0.04, 0.16, 8)),
        trunkRingMat
      );
      basket.position.y = 0.72;
      const flame = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.068, 0.22, 8)),
        flameMat
      );
      flame.position.y = 0.88;
      torchGroup.add(pole, basket, flame);
      tikiFlames.push({ mesh: flame, phase: idx * 2.1 });
    });

    // =========================================================================
    // 5. FROSTED STRAWBERRY & SPRINKLE INFLATABLE POOL DONUT RING (`donutGroup`)
    // =========================================================================
    const floatAssembly = new THREE.Group();
    floatAssembly.position.set(0, 0.24, 0.08);
    worldRoot.add(floatAssembly);

    const donutGroup = new THREE.Group();
    floatAssembly.add(donutGroup);

    const donutBaseMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffb703,
        roughness: 0.24,
        metalness: 0.02,
        clearcoat: 0.65,
      })
    );
    const donutTubeMesh = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.92, 0.34, 28, 56)),
      donutBaseMat
    );
    donutTubeMesh.rotation.x = Math.PI / 2;
    donutTubeMesh.castShadow = true;
    donutTubeMesh.receiveShadow = true;
    donutGroup.add(donutTubeMesh);

    // Strawberry Pink Frosting Layer (sits at y = +0.11 above tube center -> zero z-fighting!)
    const frostingMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xff4d94,
        roughness: 0.22,
        clearcoat: 0.75,
      })
    );
    const frostingMesh = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.92, 0.29, 24, 56)),
      frostingMat
    );
    frostingMesh.rotation.x = Math.PI / 2;
    frostingMesh.position.y = 0.11;
    frostingMesh.scale.set(1, 1, 0.52);
    frostingMesh.castShadow = true;
    donutGroup.add(frostingMesh);

    // 18 Colorful 3D Candy Sprinkles
    const sprinkleColors = [0x22d3ee, 0xfacc15, 0x4ade80, 0xffffff, 0xc084fc];
    const sprinkleMats = sprinkleColors.map((c) =>
      trackMat(new THREE.MeshStandardMaterial({ color: c, roughness: 0.3 }))
    );
    const sprinkleGeo = trackGeo(new THREE.CapsuleGeometry(0.032, 0.095, 6, 8));
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + 0.15;
      const radialOffset = ((i % 3) - 1) * 0.085;
      const r = 0.92 + radialOffset;
      const sp = new THREE.Mesh(sprinkleGeo, sprinkleMats[i % sprinkleMats.length]);
      sp.position.set(Math.cos(angle) * r, 0.26 - Math.abs(radialOffset) * 0.2, Math.sin(angle) * r);
      sp.rotation.set(Math.PI / 2, angle + 0.4, Math.PI / 2);
      donutGroup.add(sp);
    }

    // =========================================================================
    // 6. DETAILED 3D CHILLED TROPICAL LLAMA WITH PROCEDURAL FLEECE TEXTURE
    //    (ZERO OVERLAPPING CO-PLANAR MESHES -> 100% ZERO COLOR FLICKERING!)
    // =========================================================================
    const llamaGroup = new THREE.Group();
    floatAssembly.add(llamaGroup);

    const { colorMap: fleeceColorMap, bumpMap: fleeceBumpMap } = createProceduralFleeceTextures();
    trackTex(fleeceColorMap);
    trackTex(fleeceBumpMap);

    const ponchoTex = trackTex(createPonchoStripeTexture());

    // Fluffy Alpaca/Llama Wool Material with 3D Bump Depth
    const fleeceMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfff8e7,
        map: fleeceColorMap,
        bumpMap: fleeceBumpMap,
        bumpScale: 0.038,
        roughness: 0.85,
        metalness: 0.0,
      })
    );

    // Smooth Warm Caramel-Tan Muzzle & Face Skin Material
    const muzzleMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4945a,
        roughness: 0.68,
        metalness: 0.0,
      })
    );

    // Dark Espresso Cloven Hooves & Eyebrows Material
    const hoofMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3b1f0e,
        roughness: 0.45,
        metalness: 0.05,
      })
    );

    const innerEarPinkMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf4978e,
        roughness: 0.78,
      })
    );

    const ponchoMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: ponchoTex,
        roughness: 0.65,
      })
    );

    // --- 6A. Plush Llama Torso sitting inside the Donut Ring ---
    const torsoGroup = new THREE.Group();
    llamaGroup.add(torsoGroup);

    const bodyMesh = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.58, 0.42, 24, 32)),
      fleeceMat
    );
    bodyMesh.position.set(0, 0.48, -0.05);
    bodyMesh.scale.set(1.02, 0.95, 1.08);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    torsoGroup.add(bodyMesh);

    // Fluffy Llama Tail Puff at the back
    const tailPuff = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.22, 16, 16)),
      fleeceMat
    );
    tailPuff.position.set(0, 0.56, -0.68);
    tailPuff.scale.set(0.85, 1.1, 0.95);
    torsoGroup.add(tailPuff);

    // Peruvian Woven Fiesta Poncho Collar around the lower neck/shoulders
    const ponchoCollar = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.46, 0.11, 18, 40)),
      ponchoMat
    );
    ponchoCollar.rotation.x = Math.PI / 2 + 0.14;
    ponchoCollar.position.set(0, 0.84, 0.06);
    ponchoCollar.scale.set(1.0, 1.05, 0.65);
    ponchoCollar.castShadow = true;
    torsoGroup.add(ponchoCollar);

    // --- 6B. Articulated Front Llama Forelegs & Cloven Hooves Resting on the Donut ---
    const buildLlamaForeleg = (sideSign) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(sideSign * 0.45, 0.46, 0.68);

      // Fluffy wool upper sleeve
      const woolSleeve = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.135, 0.18, 12, 16)),
        fleeceMat
      );
      woolSleeve.rotation.set(Math.PI / 2 - 0.25, 0, sideSign * 0.14);
      woolSleeve.castShadow = true;
      legPivot.add(woolSleeve);

      // Distinct dark espresso Llama hoof sticking out the front (zero overlap!)
      const hoof = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.095, 0.115, 0.14, 14)),
        hoofMat
      );
      hoof.rotation.x = Math.PI / 2 - 0.2;
      hoof.position.set(sideSign * -0.02, -0.04, 0.18);
      hoof.castShadow = true;
      legPivot.add(hoof);

      return legPivot;
    };

    const pawLeftPivot = buildLlamaForeleg(-1);
    const pawRightPivot = buildLlamaForeleg(1);
    llamaGroup.add(pawLeftPivot, pawRightPivot);

    // --- 6C. Iconic Tall Fluffy Llama Neck & Head Hierarchy ---
    const neckPivot = new THREE.Group();
    neckPivot.position.set(0, 0.86, 0.08);
    llamaGroup.add(neckPivot);

    // Graceful tall fluffy Llama neck cylinder/capsule
    const neckMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.34, 0.42, 0.68, 24)),
      fleeceMat
    );
    neckMesh.position.set(0, 0.28, 0.02);
    neckMesh.rotation.x = -0.08;
    neckMesh.castShadow = true;
    neckMesh.receiveShadow = true;
    neckPivot.add(neckMesh);

    // Sculpted Llama Head Group at top of neck
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.68, 0.06);
    neckPivot.add(headGroup);

    // Fluffy Llama Cranium
    const craniumMesh = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.46, 28, 28)),
      fleeceMat
    );
    craniumMesh.scale.set(0.95, 0.96, 1.06);
    craniumMesh.castShadow = true;
    craniumMesh.receiveShadow = true;
    headGroup.add(craniumMesh);

    // Fluffy Llama Topknot Wool Puffs on the Crown (3 soft rounded wool puffs)
    const topknotGroup = new THREE.Group();
    topknotGroup.position.set(0, 0.42, 0.12);
    [
      [0, 0.04, 0.04, 0.16],
      [-0.13, 0.0, -0.02, 0.13],
      [0.13, 0.0, -0.02, 0.13],
    ].forEach(([tx, ty, tz, tr]) => {
      const puff = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(tr, 14, 14)),
        fleeceMat
      );
      puff.position.set(tx, ty, tz);
      puff.castShadow = true;
      topknotGroup.add(puff);
    });
    headGroup.add(topknotGroup);

    // Fluffy Cheek Side-Puffs
    [-1, 1].forEach((side) => {
      const cheekWool = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.22, 16, 16)),
        fleeceMat
      );
      cheekWool.position.set(side * 0.34, -0.06, 0.08);
      cheekWool.scale.set(0.85, 0.9, 1.05);
      headGroup.add(cheekWool);

      // Soft rosy blush oval positioned strictly outside the cheek surface
      const blushDisk = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.085, 12, 12)),
        trackMat(
          new THREE.MeshBasicMaterial({
            color: 0xfb7185,
            transparent: true,
            opacity: 0.55,
          })
        )
      );
      blushDisk.scale.set(1.2, 0.72, 0.35);
      blushDisk.position.set(side * 0.35, -0.06, 0.36);
      blushDisk.rotation.y = side * 0.42;
      headGroup.add(blushDisk);
    });

    // --- 6D. Sculpted 3D Llama Muzzle & Articulated Chewing/Laughing Lower Jaw ---
    const muzzleGroup = new THREE.Group();
    muzzleGroup.position.set(0, -0.08, 0.42);
    headGroup.add(muzzleGroup);

    // Upper Llama Snout Bridge (protrudes cleanly forward in 3D space -> zero z-fighting!)
    const upperSnout = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.2, 0.18, 16, 20)),
      muzzleMat
    );
    upperSnout.rotation.x = Math.PI / 2 + 0.12;
    upperSnout.scale.set(1.08, 1.0, 0.86);
    upperSnout.castShadow = true;
    muzzleGroup.add(upperSnout);

    // Dark Espresso Nostrils & Smiling Lip Line
    [-1, 1].forEach((side) => {
      const nostril = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.036, 10, 10)),
        hoofMat
      );
      nostril.scale.set(0.75, 1.2, 0.6);
      nostril.position.set(side * 0.085, 0.06, 0.24);
      muzzleGroup.add(nostril);
    });

    const philtrumLine = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.13, 8)),
      hoofMat
    );
    philtrumLine.position.set(0, -0.02, 0.265);
    muzzleGroup.add(philtrumLine);

    // Articulated Lower Jaw (`jawPivot`) with Pink Tongue & Happy Laugh Reaction
    const jawPivot = new THREE.Group();
    jawPivot.position.set(0, -0.1, -0.04);
    muzzleGroup.add(jawPivot);

    const lowerJawMesh = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.145, 0.14, 14, 16)),
      muzzleMat
    );
    lowerJawMesh.rotation.x = Math.PI / 2;
    lowerJawMesh.position.set(0, -0.02, 0.12);
    lowerJawMesh.scale.set(1.0, 0.95, 0.72);
    jawPivot.add(lowerJawMesh);

    const tongueMesh = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.095, 12, 12)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.4 }))
    );
    tongueMesh.scale.set(0.95, 0.45, 1.25);
    tongueMesh.position.set(0, 0.035, 0.14);
    jawPivot.add(tongueMesh);

    // --- 6E. Signature Long Curved Banana-Shaped Llama Ears (`earLeftPivot`, `earRightPivot`) ---
    const buildBananaLlamaEar = (sideSign) => {
      const earPivot = new THREE.Group();
      earPivot.position.set(sideSign * 0.28, 0.38, -0.06);
      earPivot.rotation.set(-0.1, sideSign * -0.15, sideSign * -0.22);

      // Tall tapered Llama ear outer shell
      const earOuter = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.105, 0.34, 14, 18)),
        fleeceMat
      );
      earOuter.position.set(0, 0.22, 0);
      earOuter.scale.set(0.75, 1.0, 0.62);
      earOuter.rotation.z = sideSign * 0.14; // Banana inward tip curve
      earOuter.castShadow = true;
      earPivot.add(earOuter);

      // Recessed terracotta-pink inner ear hollow positioned strictly in front (+z = 0.045)
      const earInner = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.062, 0.24, 10, 14)),
        innerEarPinkMat
      );
      earInner.position.set(sideSign * -0.01, 0.21, 0.048);
      earInner.scale.set(0.7, 1.0, 0.4);
      earInner.rotation.z = sideSign * 0.14;
      earPivot.add(earInner);

      return earPivot;
    };

    const earLeftPivot = buildBananaLlamaEar(-1);
    const earRightPivot = buildBananaLlamaEar(1);
    headGroup.add(earLeftPivot, earRightPivot);

    // --- 6F. Expressive 3D Eyes, Articulated Eyelids & 3D Eyebrows ---
    const eyeScleraMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
    );
    const pupilMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.1 })
    );
    const shineMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const starMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xfde047 }));

    const buildExpressive3DEye = (sideSign) => {
      const eyeRoot = new THREE.Group();
      eyeRoot.position.set(sideSign * 0.24, 0.11, 0.39);
      eyeRoot.rotation.y = sideSign * 0.26;

      // White Sclera Base
      const sclera = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.105, 18, 18)),
        eyeScleraMat
      );
      sclera.scale.set(0.95, 1.08, 0.68);
      eyeRoot.add(sclera);

      // Pupil & Specular Catchlights Group (tracks mouse cursor cleanly outside sclera!)
      const irisGroup = new THREE.Group();
      irisGroup.position.z = 0.055;
      eyeRoot.add(irisGroup);

      const pupil = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.068, 16, 16)),
        pupilMat
      );
      pupil.scale.set(0.92, 1.05, 0.45);
      irisGroup.add(pupil);

      const catchlightBig = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.024, 10, 10)),
        shineMat
      );
      catchlightBig.position.set(sideSign * -0.022, 0.028, 0.028);
      const catchlightSmall = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.013, 8, 8)),
        shineMat
      );
      catchlightSmall.position.set(sideSign * 0.02, -0.022, 0.028);
      irisGroup.add(catchlightBig, catchlightSmall);

      // Golden Star-Eye Overlay for Crit / Frenzy Mode
      const starEye = new THREE.Mesh(
        trackGeo(new THREE.OctahedronGeometry(0.052, 0)),
        starMat
      );
      starEye.scale.set(1, 1, 0.35);
      starEye.position.z = 0.032;
      starEye.visible = false;
      irisGroup.add(starEye);

      // Upper Chill Eyelid Cap (rotates on X to blink, relax in Chill mode, or open wide on Crit!)
      const upperLid = new THREE.Mesh(
        trackGeo(
          new THREE.SphereGeometry(0.114, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.52)
        ),
        muzzleMat
      );
      upperLid.scale.set(0.96, 1.08, 0.72);
      upperLid.rotation.x = 0.25; // Half-lowered chill expression by default
      eyeRoot.add(upperLid);

      // Expressive 3D Eyebrow above eye
      const brow = new THREE.Mesh(
        trackGeo(new THREE.CapsuleGeometry(0.026, 0.13, 8, 12)),
        hoofMat
      );
      brow.rotation.z = Math.PI / 2 + sideSign * -0.08;
      brow.position.set(0, 0.145, 0.04);
      eyeRoot.add(brow);

      return { eyeRoot, irisGroup, upperLid, brow, starEye, sideSign };
    };

    const eyeL = buildExpressive3DEye(-1);
    const eyeR = buildExpressive3DEye(1);
    headGroup.add(eyeL.eyeRoot, eyeR.eyeRoot);

    // =========================================================================
    // 7. 7 EVOLUTION ACCESSORIES FOR THE LLAMA
    // =========================================================================
    const goldMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        emissive: 0xb45309,
        emissiveIntensity: 0.18,
        metalness: 0.85,
        roughness: 0.16,
        clearcoat: 1.0,
      })
    );
    const silverFoilMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        metalness: 0.9,
        roughness: 0.2,
        flatShading: true,
      })
    );
    const neonCyanMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
    const neonMagentaMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xf43f5e }));

    // Evo 1: Deal-With-It Pixel Sunglasses + Gold Chain
    const evo1ShadesGroup = new THREE.Group();
    const shadeBlackMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 })
    );
    const shadeBridge = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.68, 0.045, 0.05)),
      shadeBlackMat
    );
    shadeBridge.position.set(0, 0.15, 0.48);
    const lensL = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.24, 0.13, 0.05)),
      shadeBlackMat
    );
    lensL.position.set(-0.2, 0.11, 0.48);
    const lensR = lensL.clone();
    lensR.position.x = 0.2;
    const glintL = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.09, 0.056)),
      shineMat
    );
    glintL.position.set(-0.24, 0.11, 0.485);
    glintL.rotation.z = -0.3;
    const glintR = glintL.clone();
    glintR.position.x = 0.16;
    evo1ShadesGroup.add(shadeBridge, lensL, lensR, glintL, glintR);
    headGroup.add(evo1ShadesGroup);

    // Evo 2: Tin-Foil Pyramid Hat + Orbiting UFO
    const evo2TinfoilGroup = new THREE.Group();
    const foilCone = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.38, 0.56, 4)),
      silverFoilMat
    );
    foilCone.position.set(0, 0.68, 0.04);
    foilCone.rotation.y = Math.PI / 4;
    const miniUfo = new THREE.Group();
    const ufoDisc = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.2, 0.08, 0.05, 16)),
      silverFoilMat
    );
    const ufoDome = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.09, 12, 12)),
      neonCyanMat
    );
    ufoDome.position.y = 0.03;
    miniUfo.add(ufoDisc, ufoDome);
    miniUfo.position.set(0.75, 0.85, 0);
    evo2TinfoilGroup.add(foilCone, miniUfo);
    headGroup.add(evo2TinfoilGroup);

    // Evo 3: Grand Arch-Mage Wizard Hat + Orbiting Arcane Runes
    const evo3WizardGroup = new THREE.Group();
    const wizardMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x6b21a8,
        emissive: 0x3b0764,
        emissiveIntensity: 0.25,
        roughness: 0.5,
      })
    );
    const wizBrim = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.56, 0.6, 0.05, 24)),
      wizardMat
    );
    wizBrim.position.set(0, 0.46, 0.02);
    const wizCone = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.34, 0.75, 24)),
      wizardMat
    );
    wizCone.position.set(0, 0.84, 0.0);
    evo3WizardGroup.add(wizBrim, wizCone);

    const wizardRuneRing = new THREE.Group();
    wizardRuneRing.position.set(0, 0.35, 0);
    const runeGeo = trackGeo(new THREE.OctahedronGeometry(0.085, 0));
    const runeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0xa855f7,
        emissiveIntensity: 0.85,
      })
    );
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const rune = new THREE.Mesh(runeGeo, runeMat);
      rune.position.set(Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85);
      wizardRuneRing.add(rune);
    }
    evo3WizardGroup.add(wizardRuneRing);
    headGroup.add(evo3WizardGroup);

    // Evo 4: 24K Royal Crown
    const evo4CrownGroup = new THREE.Group();
    evo4CrownGroup.position.set(0, 0.54, 0.04);
    const crownCyl = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.24, 0.18, 16)),
      goldMat
    );
    evo4CrownGroup.add(crownCyl);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const spike = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.06, 0.15, 6)),
        goldMat
      );
      spike.position.set(Math.cos(a) * 0.25, 0.15, Math.sin(a) * 0.25);
      evo4CrownGroup.add(spike);
    }
    headGroup.add(evo4CrownGroup);

    // Evo 5: Cyber Visor + Holographic Rings
    const evo5CyberGroup = new THREE.Group();
    const cyberVisor = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.62, 0.14, 0.12)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x22d3ee,
          emissiveIntensity: 0.9,
          roughness: 0.15,
        })
      )
    );
    cyberVisor.position.set(0, 0.12, 0.44);
    const cyberRingA = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.95, 0.018, 10, 48)),
      neonCyanMat
    );
    cyberRingA.rotation.x = Math.PI / 3;
    const cyberRingB = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.08, 0.016, 10, 48)),
      neonMagentaMat
    );
    cyberRingB.rotation.y = Math.PI / 4;
    evo5CyberGroup.add(cyberVisor, cyberRingA, cyberRingB);
    headGroup.add(evo5CyberGroup);

    // Evo 6: Biblically Accurate Seraphim Rings
    const evo6BiblicalGroup = new THREE.Group();
    evo6BiblicalGroup.position.set(0, 1.05, 0);
    const seraphimRings = [];
    for (let r = 0; r < 3; r++) {
      const ringHolder = new THREE.Group();
      const radius = 1.48 + r * 0.18;
      const torus = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(radius, 0.04, 14, 56)),
        goldMat
      );
      ringHolder.add(torus);
      evo6BiblicalGroup.add(ringHolder);
      seraphimRings.push(ringHolder);
    }
    llamaGroup.add(evo6BiblicalGroup);

    let lastAppliedEvo = -1;
    const applyEvolutionVisuals = (evoIdx) => {
      if (evoIdx === lastAppliedEvo) return;
      lastAppliedEvo = evoIdx;

      evo1ShadesGroup.visible = evoIdx === 1;
      evo2TinfoilGroup.visible = evoIdx === 2;
      evo3WizardGroup.visible = evoIdx === 3;
      evo4CrownGroup.visible = evoIdx === 4;
      evo5CyberGroup.visible = evoIdx === 5;
      evo6BiblicalGroup.visible = evoIdx === 6;

      // Hide topknot wool tuft when wearing a tall hat so nothing clips
      topknotGroup.visible = !(evoIdx === 2 || evoIdx === 3 || evoIdx === 4);

      if (evoIdx === 4) {
        fleeceMat.color.setHex(0xfde047);
        fleeceMat.metalness = 0.35;
        fleeceMat.roughness = 0.42;
      } else if (evoIdx === 5) {
        fleeceMat.color.setHex(0xa5f3fc);
        fleeceMat.metalness = 0.15;
        fleeceMat.roughness = 0.6;
      } else {
        fleeceMat.color.setHex(0xfff8e7);
        fleeceMat.metalness = 0.0;
        fleeceMat.roughness = 0.85;
      }
    };
    applyEvolutionVisuals(stateRef.current.evolutionIndex);

    // =========================================================================
    // 8. SLEEK MINIATURE 3D GOLDEN WINGED PIÑATA LLAMA FLYER (NO UGLY RINGS!)
    // =========================================================================
    const goldenFlyerGroup = new THREE.Group();
    goldenFlyerGroup.visible = false;
    worldRoot.add(goldenFlyerGroup);

    const pinataBody = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.18, 0.22, 12, 16)),
      goldMat
    );
    pinataBody.rotation.z = Math.PI / 2;
    goldenFlyerGroup.add(pinataBody);

    const pinataNeck = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.1, 0.13, 0.28, 12)),
      goldMat
    );
    pinataNeck.position.set(0.16, 0.2, 0);
    goldenFlyerGroup.add(pinataNeck);

    const pinataHead = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.14, 14, 14)),
      goldMat
    );
    pinataHead.position.set(0.22, 0.36, 0);
    goldenFlyerGroup.add(pinataHead);

    const wingMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfef08a,
        emissiveIntensity: 0.45,
        roughness: 0.3,
      })
    );
    const wingGeo = trackGeo(new THREE.BoxGeometry(0.18, 0.04, 0.38));
    const wingLeft = new THREE.Mesh(wingGeo, wingMat);
    wingLeft.position.set(0, 0.12, -0.26);
    const wingRight = new THREE.Mesh(wingGeo, wingMat);
    wingRight.position.set(0, 0.12, 0.26);
    goldenFlyerGroup.add(wingLeft, wingRight);

    const goldenHitBox = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.75, 10, 10)),
      trackMat(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }))
    );
    goldenFlyerGroup.add(goldenHitBox);

    // =========================================================================
    // 9. 3D ORBITING HELPER SATELLITES
    // =========================================================================
    const orbitGroupInner = new THREE.Group();
    orbitGroupInner.position.set(0, 0.28, 0);
    const orbitGroupOuter = new THREE.Group();
    orbitGroupOuter.position.set(0, 0.72, 0);
    worldRoot.add(orbitGroupInner, orbitGroupOuter);

    const clearGroupChildren = (grp) => {
      while (grp.children.length > 0) {
        grp.remove(grp.children[0]);
      }
    };

    const createHelperMiniMesh = (spec) => {
      const holder = new THREE.Group();
      const mainMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: spec.color,
          roughness: 0.38,
          metalness: 0.15,
        })
      );
      const accentMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: spec.accent,
          emissive: spec.accent,
          emissiveIntensity: 0.3,
          roughness: 0.35,
        })
      );

      if (spec.type === 'duck') {
        const body = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.15, 14, 14)), mainMat);
        body.scale.set(1.2, 0.85, 1);
        const head = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.1, 12, 12)), mainMat);
        head.position.set(0.11, 0.13, 0);
        const beak = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.045, 0.11, 8)), accentMat);
        beak.rotation.z = -Math.PI / 2;
        beak.position.set(0.22, 0.13, 0);
        holder.add(body, head, beak);
      } else if (spec.type === 'pelican') {
        const body = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.15, 14, 14)), mainMat);
        const pouch = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.085, 0.24, 10)), accentMat);
        pouch.rotation.z = -Math.PI / 2;
        pouch.position.set(0.2, 0.04, 0);
        holder.add(body, pouch);
      } else {
        const core = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.15, 1)), mainMat);
        const ring = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.22, 0.025, 10, 24)),
          accentMat
        );
        ring.rotation.x = Math.PI / 3;
        holder.add(core, ring);
      }
      return holder;
    };

    const rebuildOrbiters = (counts) => {
      clearGroupChildren(orbitGroupInner);
      clearGroupChildren(orbitGroupOuter);

      const innerItems = [];
      const outerItems = [];

      HELPER_PALETTE.forEach((spec, tierIdx) => {
        const owned = Number(counts?.[spec.id] || 0);
        if (owned <= 0) return;
        const visualCount = Math.min(3, Math.max(1, Math.ceil(Math.log2(owned + 1))));
        for (let k = 0; k < visualCount; k++) {
          if (tierIdx < 4 && innerItems.length < 12) innerItems.push(spec);
          else if (outerItems.length < 14) outerItems.push(spec);
        }
      });

      innerItems.forEach((spec, i) => {
        const mesh = createHelperMiniMesh(spec);
        const angle = (i / innerItems.length) * Math.PI * 2;
        const radius = 3.05;
        mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        mesh.userData = { phase: i * 0.9 };
        orbitGroupInner.add(mesh);
      });

      outerItems.forEach((spec, i) => {
        const mesh = createHelperMiniMesh(spec);
        const angle = (i / outerItems.length) * Math.PI * 2;
        const radius = 3.75;
        mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        mesh.userData = { phase: i * 1.1 };
        orbitGroupOuter.add(mesh);
      });
    };

    rebuildOrbitersRef.current = rebuildOrbiters;
    rebuildOrbiters(stateRef.current.helperCounts);

    // =========================================================================
    // 10. 3D WEATHER & WATER-SPLASH DROPLET PARTICLE POOLS (INSTANCED MESHES)
    // =========================================================================
    const WEATHER_COUNT = 90;
    const weatherGeo = trackGeo(new THREE.OctahedronGeometry(0.075, 1));
    const weatherMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        transparent: true,
        opacity: 0.8,
      })
    );
    const weatherInstanced = new THREE.InstancedMesh(weatherGeo, weatherMat, WEATHER_COUNT);
    worldRoot.add(weatherInstanced);

    const weatherData = Array.from({ length: WEATHER_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 8 - 1,
      speed: 0.6 + Math.random() * 1.1,
      drift: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 0.85,
      isSecondary: i % 2 === 0,
    }));

    const BURST_COUNT = 80;
    const burstGeo = trackGeo(new THREE.SphereGeometry(0.08, 10, 10));
    const burstMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        clearcoat: 1.0,
      })
    );
    const burstInstanced = new THREE.InstancedMesh(burstGeo, burstMat, BURST_COUNT);
    worldRoot.add(burstInstanced);

    const burstPool = Array.from({ length: BURST_COUNT }, () => ({
      active: false,
      pos: new THREE.Vector3(0, -999, 0),
      vel: new THREE.Vector3(),
      scale: 0,
      life: 0,
      maxLife: 0.7,
    }));

    const splashPalette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xe0f2fe),
      new THREE.Color(0x67e8f9),
      new THREE.Color(0xfde047),
      new THREE.Color(0xffffff),
    ];

    let burstCursor = 0;
    const spawn3DSplashDroplets = (origin, count = 24, goldenBurst = false) => {
      for (let i = 0; i < count; i++) {
        const p = burstPool[burstCursor];
        const idx = burstCursor;
        burstCursor = (burstCursor + 1) % BURST_COUNT;

        p.active = true;
        p.pos.copy(origin);
        const theta = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        const speed = 2.2 + Math.random() * 3.6;
        p.vel.set(
          Math.cos(theta) * speed,
          2.6 + Math.random() * 3.8,
          Math.sin(theta) * speed
        );
        p.life = 0;
        p.maxLife = 0.5 + Math.random() * 0.35;
        p.scale = goldenBurst ? 1.45 : 1.05;

        const c = goldenBurst
          ? new THREE.Color(0xfef08a)
          : splashPalette[idx % splashPalette.length];
        burstInstanced.setColorAt(idx, c);
      }
      if (burstInstanced.instanceColor) {
        burstInstanced.instanceColor.needsUpdate = true;
      }
    };

    // =========================================================================
    // 11. CRITICALLY DAMPED SPRING PHYSICS & INTERACTIVE SPLASH WAVE TRIGGERS
    // =========================================================================
    const spring = {
      scale: new THREE.Vector3(1, 1, 1),
      scaleVel: new THREE.Vector3(0, 0, 0),
      donutScale: new THREE.Vector3(1, 1, 1),
      donutScaleVel: new THREE.Vector3(0, 0, 0),
      rot: new THREE.Vector2(0, 0),
      rotVel: new THREE.Vector2(0, 0),
      headRot: new THREE.Vector3(0, 0, 0),
      headRotVel: new THREE.Vector3(0, 0, 0),
      headPopY: 0,
      headPopVel: 0,
      earBounce: 0,
      pawSplashTimer: 0,
      pawSplashSide: 1,
      boopSmileTimer: 0,
      shakeTimer: 0,
      clickTimestamps: [],
      nextBlinkTime: 2.2,
      blinkDuration: 0,
    };

    const triggerBoopPhysics = (hitPoint) => {
      const nowSec = performance.now() / 1000;
      spring.clickTimestamps.push(nowSec);
      spring.clickTimestamps = spring.clickTimestamps.filter((t) => nowSec - t < 1.2);
      const clickRate = spring.clickTimestamps.length;

      // Torso & Donut recoil
      spring.scale.set(1.13, 0.87, 1.13);
      spring.scaleVel.set(1.2, -1.8, 1.2);

      spring.donutScale.set(1.12, 0.82, 1.12);
      spring.donutScaleVel.set(1.3, -2.0, 1.3);

      const offsetX = hitPoint ? hitPoint.x : (Math.random() - 0.5) * 0.4;
      const offsetZ = hitPoint ? hitPoint.z - 0.2 : 0.3;
      spring.rotVel.x = -offsetZ * 5.2;
      spring.rotVel.y = -offsetX * 5.8;

      // Secondary head nod & happy laugh
      spring.headPopVel = 2.6;
      spring.headRotVel.x = -4.2;
      spring.headRotVel.z = (Math.random() - 0.5) * 4.5;

      spring.earBounce = 1.0;
      spring.pawSplashTimer = 0.42;
      spring.pawSplashSide *= -1;
      spring.boopSmileTimer = 0.52;

      if (stateRef.current.screenShakeEnabled) {
        spring.shakeTimer = 0.14;
      }

      // Trigger 3D Crown Splash Wave Ring + Pool Wave Impulse (bigger on fast combos!)
      const wavePower = clickRate >= 4 ? 1.55 : 1.0;
      triggerSplashWaveRing(wavePower);

      // Spawn ring of 3D water droplets around the inflatable donut
      spawn3DSplashDroplets(new THREE.Vector3(0, 0.25, 0.1), clickRate >= 4 ? 32 : 18, false);
    };

    triggerCenterBoopRef.current = () => {
      triggerBoopPhysics(new THREE.Vector3(0, 1.1, 0.5));
    };

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(0, 0);
    const targetParallax = new THREE.Vector2(0, 0);

    const updatePointerNDC = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (e) => {
      updatePointerNDC(e.clientX, e.clientY);
      targetParallax.x = pointerNDC.x * 0.42;
      targetParallax.y = pointerNDC.y * 0.24;

      raycaster.setFromCamera(pointerNDC, camera);
      if (stateRef.current.isGoldenActive && goldenFlyerGroup.visible) {
        const goldenHits = raycaster.intersectObjects(goldenFlyerGroup.children, true);
        if (goldenHits.length > 0) {
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }

      const hits = raycaster.intersectObjects([llamaGroup, donutGroup, islandGroup], true);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
    };

    const onPointerDown = (e) => {
      updatePointerNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);

      // 1. Check 3D Flying Golden Piñata Llama
      if (stateRef.current.isGoldenActive && goldenFlyerGroup.visible) {
        const goldenHits = raycaster.intersectObjects(goldenFlyerGroup.children, true);
        if (goldenHits.length > 0) {
          spawn3DSplashDroplets(goldenFlyerGroup.position.clone(), 34, true);
          if (stateRef.current.onGoldenClick) {
            stateRef.current.onGoldenClick(e.clientX, e.clientY);
          }
          return;
        }
      }

      // 2. Check Llama mascot, inflatable donut, or lagoon island
      const hits = raycaster.intersectObjects([llamaGroup, donutGroup, islandGroup], true);
      if (hits.length > 0) {
        triggerBoopPhysics(hits[0].point);
        if (stateRef.current.onMascotClick) {
          stateRef.current.onMascotClick(e.clientX, e.clientY);
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointermove', onPointerMove);
    domElem.addEventListener('pointerdown', onPointerDown);

    // =========================================================================
    // 12. RESIZE OBSERVER (MAINTAINS FULL-SCREEN VIEW OFFSET)
    // =========================================================================
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: cw, height: ch } = entry.contentRect;
        if (cw > 0 && ch > 0) {
          applyCameraFraming(cw, ch);
          renderer.setSize(cw, ch);
        }
      }
    });
    resizeObserver.observe(container);

    // =========================================================================
    // 13. MAIN 60FPS ANIMATION LOOP
    // =========================================================================
    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();
    const waterShallowCol = new THREE.Color(0x06b6d4);
    const waterDeepCol = new THREE.Color(0x0369a1);
    const waterFoamCol = new THREE.Color(0xf0f9ff);
    const waterColorAttr = gridWaterGeo.attributes.color;
    let prevTime = performance.now();
    let elapsed = 0;
    let currentWeatherApplied = '';
    let rafId = null;

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      elapsed += dt;

      const {
        evolutionIndex: curEvo,
        weatherId: curWeatherId,
        isFrenzy: curFrenzy,
        isGoldenActive: curGolden,
      } = stateRef.current;

      applyEvolutionVisuals(curEvo);

      const weatherSpec = WEATHER_THEMES[curWeatherId] || WEATHER_THEMES.sunny_onsen;
      if (currentWeatherApplied !== curWeatherId) {
        currentWeatherApplied = curWeatherId;
        waterMat.emissive.setHex(weatherSpec.waterEmissive);
        waterShallowCol.setHex(weatherSpec.waterColor);
        waterDeepCol.setHex(weatherSpec.waterDeepColor);
        rimLight.color.setHex(weatherSpec.rimColor);
        keyLight.color.setHex(weatherSpec.keyColor);
        bounceLight.color.setHex(weatherSpec.waterColor);
        skyUniforms.uTop.value.setHex(weatherSpec.skyTop || 0x0284c7);
        skyUniforms.uHorizon.value.setHex(weatherSpec.skyHorizon || 0xbae6fd);

        weatherData.forEach((p, i) => {
          tempColor.setHex(p.isSecondary ? weatherSpec.colorB : weatherSpec.colorA);
          weatherInstanced.setColorAt(i, tempColor);
        });
        if (weatherInstanced.instanceColor) {
          weatherInstanced.instanceColor.needsUpdate = true;
        }
      }

      // --- 13.0 Full-Screen 3D Drifting Cumulus Clouds (`threejs-volumetric-clouds`) ---
      for (let c = 0; c < driftingClouds.length; c++) {
        const cl = driftingClouds[c];
        cl.group.position.x += cl.speed * dt;
        if (cl.group.position.x > 19.5) {
          cl.group.position.x = -24.5;
        }
        cl.group.position.y = cl.baseY + Math.sin(elapsed * 0.65 + cl.phase) * 0.14;
      }

      // --- 13A. `threejs-water-optics` Multi-Wave Displacement + Crest Foam & Beer-Lambert Absorption ---
      for (let k = waveImpulses.length - 1; k >= 0; k--) {
        waveImpulses[k].age += dt;
        if (waveImpulses[k].age > 2.2) {
          waveImpulses.splice(k, 1);
        }
      }

      const waveSpeedMult = curFrenzy ? 2.1 : 1.0;
      const tWave = elapsed * waveSpeedMult;

      for (let i = 0; i < waterPosAttr.count; i++) {
        const bx = waterBaseXZ[i * 2];
        const bz = waterBaseXZ[i * 2 + 1];

        // 4-band directional Gerstner wave cascade
        const w1 = Math.sin(bx * 2.8 + bz * 1.6 + tWave * 3.2) * 0.032;
        const w2 = Math.cos(bx * 2.1 - bz * 3.1 + tWave * 2.6) * 0.024;
        const w3 = Math.sin((bx + bz) * 4.5 - tWave * 4.1) * 0.015;
        const w4 = Math.cos((bx - bz) * 6.2 + tWave * 5.2) * 0.008;
        let wy = w1 + w2 + w3 + w4;
        let rippleCrest = 0;

        // Add interactive circular splash wave ripples from clicking!
        const distFromCenter = Math.hypot(bx, bz);
        for (let k = 0; k < waveImpulses.length; k++) {
          const imp = waveImpulses[k];
          const phase = distFromCenter * 8.5 - imp.age * 16.0;
          if (phase < 2.0 && phase > -14.0) {
            const env = Math.exp(-distFromCenter * 0.72 - imp.age * 1.85);
            const rWave = Math.sin(phase) * imp.amp * env;
            wy += rWave;
            if (rWave > 0) rippleCrest += rWave * 6.5;
          }
        }

        waterPosAttr.setY(i, wy);

        // Depth absorption + causal wave crest & coping shoreline foam (`threejs-water-optics`)
        const heightNorm = THREE.MathUtils.clamp((wy + 0.06) / 0.12, 0, 1);
        const shoreProximity = THREE.MathUtils.smoothstep(distFromCenter, 1.48, 1.72);
        const foamFactor = THREE.MathUtils.clamp(
          Math.pow(heightNorm, 3.0) * 0.55 + rippleCrest + shoreProximity * 0.7,
          0,
          1
        );

        tempColor.copy(waterDeepCol).lerp(waterShallowCol, heightNorm).lerp(waterFoamCol, foamFactor);
        waterColorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
      }
      waterPosAttr.needsUpdate = true;
      waterColorAttr.needsUpdate = true;
      gridWaterGeo.computeVertexNormals();

      // --- Animate Stylized Cartoon Splashes on Stacked Clicks (Images 4 & 5) ---
      clickStack = Math.max(0, clickStack - dt * 3.8);
      if (curFrenzy) {
        clickStack = Math.max(clickStack, 18);
      }

      // 1. Cartoon Crown Splash with spires and white foam (Image 4 top-left)
      if (clickStack > 2.0) {
        crownSplash1.visible = true;
        const p1 = Math.min(1.0, (clickStack - 2.0) / 6.0);
        const bounce1 = 0.88 + Math.sin(elapsed * 9.0) * 0.12 + p1 * 0.42;
        const h1 = Math.max(0.08, p1 * 1.35);
        crownSplash1.scale.set(bounce1, h1, bounce1);
        crownSplash1.rotation.y = elapsed * 3.4;
      } else {
        crownSplash1.visible = false;
      }

      // 2. Towering Geyser Splash Wall (Image 4 top-right)
      if (clickStack > 6.0) {
        crownSplash2.visible = true;
        const p2 = Math.min(1.0, (clickStack - 6.0) / 7.0);
        const bounce2 = 0.9 + Math.cos(elapsed * 7.2) * 0.14 + p2 * 0.38;
        const h2 = Math.max(0.1, p2 * 1.6);
        crownSplash2.scale.set(bounce2, h2, bounce2);
        crownSplash2.rotation.y = -elapsed * 2.9;
      } else {
        crownSplash2.visible = false;
      }

      // 3. Water Vortex Spiral (Image 5)
      if (clickStack > 11.0) {
        waterVortexMesh.visible = true;
        const p3 = Math.min(1.0, (clickStack - 11.0) / 8.0);
        const s3 = 0.85 + p3 * 0.38;
        waterVortexMesh.scale.set(s3, Math.max(0.15, p3 * 1.35), s3);
        waterVortexMesh.rotation.y += dt * (9.0 + p3 * 7.5);
      } else {
        waterVortexMesh.visible = false;
      }

      // Coupled Buoyancy: Donut & Llama bob and pitch with the exact center Gerstner wave!
      const centerWaveY =
        Math.sin(tWave * 3.2) * 0.032 + Math.cos(tWave * 2.6) * 0.024;
      floatAssembly.position.y = 0.24 + centerWaveY;

      // --- 13B. Spring Physics Integration ---
      const stiffness = 280;
      const damping = 15;
      ['x', 'y', 'z'].forEach((axis) => {
        const disp = spring.scale[axis] - 1.0;
        const accel = -stiffness * disp - damping * spring.scaleVel[axis];
        spring.scaleVel[axis] += accel * dt;
        spring.scale[axis] += spring.scaleVel[axis] * dt;

        const dDisp = spring.donutScale[axis] - 1.0;
        const dAccel = -260 * dDisp - 13 * spring.donutScaleVel[axis];
        spring.donutScaleVel[axis] += dAccel * dt;
        spring.donutScale[axis] += spring.donutScaleVel[axis] * dt;
      });
      torsoGroup.scale.copy(spring.scale);
      donutGroup.scale.copy(spring.donutScale);

      // Rotational spring recovery
      spring.rotVel.x += (-210 * spring.rot.x - 12 * spring.rotVel.x) * dt;
      spring.rotVel.y += (-210 * spring.rot.y - 12 * spring.rotVel.y) * dt;
      spring.rot.x += spring.rotVel.x * dt;
      spring.rot.y += spring.rotVel.y * dt;

      // Secondary neck/head spring
      ['x', 'y', 'z'].forEach((axis) => {
        spring.headRotVel[axis] +=
          (-230 * spring.headRot[axis] - 13 * spring.headRotVel[axis]) * dt;
        spring.headRot[axis] += spring.headRotVel[axis] * dt;
      });
      spring.headPopVel += (-260 * spring.headPopY - 14 * spring.headPopVel) * dt;
      spring.headPopY += spring.headPopVel * dt;

      const grooveRoll = curFrenzy ? Math.sin(elapsed * 10) * 0.08 : 0;
      donutGroup.rotation.x = Math.sin(elapsed * 2.1) * 0.04 + spring.rot.x * 0.4;
      donutGroup.rotation.z = Math.cos(elapsed * 1.8) * 0.04 + spring.rot.y * 0.4;

      llamaGroup.rotation.x = spring.rot.x;
      llamaGroup.rotation.z = spring.rot.y + grooveRoll;
      llamaGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.06 + targetParallax.x * 0.16;

      // Neck & Head Cursor Gaze Tracking + Phase-Offset Sway
      const lookYaw = pointerNDC.x * 0.28 + Math.sin(elapsed * 0.7) * 0.05;
      const lookPitch = -pointerNDC.y * 0.15 + Math.sin(elapsed * 1.6) * 0.03;
      neckPivot.rotation.z = Math.sin(elapsed * 1.4 - 0.4) * 0.03 + grooveRoll * 0.5;
      headGroup.position.y = 0.68 + Math.max(-0.04, spring.headPopY);
      headGroup.rotation.x = lookPitch + spring.headRot.x;
      headGroup.rotation.y = lookYaw + spring.headRot.y;
      headGroup.rotation.z = spring.headRot.z;

      // --- 13C. Dynamic Facial Expressions (Chill, Blink, Happy Boop, Crit, Frenzy) ---
      if (spring.boopSmileTimer > 0) {
        spring.boopSmileTimer = Math.max(0, spring.boopSmileTimer - dt);
      }
      if (elapsed >= spring.nextBlinkTime) {
        spring.blinkDuration = 0.15;
        spring.nextBlinkTime = elapsed + 2.8 + Math.random() * 2.5;
      }
      if (spring.blinkDuration > 0) {
        spring.blinkDuration = Math.max(0, spring.blinkDuration - dt);
      }

      const recentClicks = spring.clickTimestamps.filter((t) => elapsed - t < 1.0).length;
      const isBooped = spring.boopSmileTimer > 0;
      const isRapidCombo = recentClicks >= 5;

      // Animate Articulated Lower Jaw (Laughs wide on click/frenzy, chews contentedly when idle!)
      if (isBooped || curFrenzy) {
        jawPivot.rotation.x = 0.36 + Math.sin(elapsed * 22) * 0.06;
      } else {
        // Chill rhythmic grass/gum chewing motion
        jawPivot.rotation.x = Math.max(0, Math.sin(elapsed * 4.5) * 0.08);
        jawPivot.position.x = Math.cos(elapsed * 4.5) * 0.015;
      }

      // Animate 3D Eyelids, Eyebrows & Star-Eyes
      [eyeL, eyeR].forEach((eye) => {
        // Pupil tracks mouse cursor cleanly
        eye.irisGroup.position.x = pointerNDC.x * 0.022;
        eye.irisGroup.position.y = pointerNDC.y * 0.018;

        if (spring.blinkDuration > 0) {
          // Closed blink
          eye.upperLid.rotation.x = 1.35;
          eye.starEye.visible = false;
        } else if (curFrenzy || isRapidCombo) {
          // Wide-open Star/Rage Eyes + angled fierce eyebrows!
          eye.upperLid.rotation.x = -0.35;
          eye.starEye.visible = true;
          eye.starEye.rotation.z = elapsed * 6 * eye.sideSign;
          eye.brow.rotation.z = Math.PI / 2 + eye.sideSign * 0.32;
          eye.brow.position.y = 0.155;
        } else if (isBooped) {
          // Happy surprised wide eyes + raised arched eyebrows!
          eye.upperLid.rotation.x = -0.25;
          eye.starEye.visible = false;
          eye.brow.rotation.z = Math.PI / 2 + eye.sideSign * -0.22;
          eye.brow.position.y = 0.175;
        } else {
          // Ultra-chilled half-lowered relaxed eyelids
          eye.upperLid.rotation.x = 0.28;
          eye.starEye.visible = false;
          eye.brow.rotation.z = Math.PI / 2 + eye.sideSign * -0.08;
          eye.brow.position.y = 0.145;
        }
      });

      // Banana Llama Ears Flicking & Perking
      spring.earBounce = Math.max(0, spring.earBounce - dt * 3.5);
      const earWave = Math.sin(elapsed * 24) * spring.earBounce * 0.35;
      earLeftPivot.rotation.z = -0.22 - earWave + Math.sin(elapsed * 1.9) * 0.04;
      earRightPivot.rotation.z = 0.22 + earWave - Math.cos(elapsed * 2.1) * 0.04;

      // Front Hooves Drumming / Splashing on the Donut
      if (spring.pawSplashTimer > 0) {
        spring.pawSplashTimer = Math.max(0, spring.pawSplashTimer - dt);
        const lift = Math.abs(Math.sin(spring.pawSplashTimer * Math.PI * 4)) * 0.14;
        if (spring.pawSplashSide > 0) {
          pawRightPivot.position.y = 0.46 + lift;
          pawLeftPivot.position.y = 0.46 + lift * 0.35;
        } else {
          pawLeftPivot.position.y = 0.46 + lift;
          pawRightPivot.position.y = 0.46 + lift * 0.35;
        }
      } else if (curFrenzy) {
        const drum = Math.sin(elapsed * 18) * 0.07;
        pawLeftPivot.position.y = 0.46 + Math.max(0, drum);
        pawRightPivot.position.y = 0.46 + Math.max(0, -drum);
      } else {
        pawLeftPivot.position.y = 0.46;
        pawRightPivot.position.y = 0.46;
      }

      // Secondary Evolution Animations
      if (curEvo === 2) {
        foilCone.rotation.y = elapsed * 1.2;
        miniUfo.position.x = Math.cos(elapsed * 2.5) * 0.78;
        miniUfo.position.z = Math.sin(elapsed * 2.5) * 0.78;
      } else if (curEvo === 3) {
        wizardRuneRing.rotation.y = elapsed * 1.8;
      } else if (curEvo === 5) {
        cyberRingA.rotation.z = elapsed * 1.8;
        cyberRingB.rotation.x = elapsed * 1.4;
      } else if (curEvo === 6) {
        seraphimRings[0].rotation.x = elapsed * 0.9;
        seraphimRings[1].rotation.y = -elapsed * 1.1;
        seraphimRings[2].rotation.z = elapsed * 0.8;
      }

      // Swaying Palm Fronds & Flickering Tiki Torches
      palmFronds.forEach((f) => {
        f.pivot.rotation.z = Math.sin(elapsed * 2.2 + f.phase) * 0.085;
      });
      tikiFlames.forEach((tf) => {
        const flicker = 0.92 + Math.sin(elapsed * 18 + tf.phase) * 0.14;
        tf.mesh.scale.set(flicker, 0.9 + Math.cos(elapsed * 23 + tf.phase) * 0.18, flicker);
      });
      tikiGlowLight.intensity = 1.3 + Math.sin(elapsed * 16) * 0.25;

      // Flying 3D Golden Winged Piñata Llama across the Full Unclipped Sky!
      goldenFlyerGroup.visible = curGolden;
      if (curGolden) {
        const gx = Math.sin(elapsed * 1.2) * 3.4;
        const gy = 2.35 + Math.sin(elapsed * 2.6) * 0.35;
        const gz = 0.6 + Math.cos(elapsed * 1.2) * 0.9;
        goldenFlyerGroup.position.set(gx, gy, gz);
        goldenFlyerGroup.rotation.y = Math.cos(elapsed * 1.2) * 0.65;
        const flap = Math.sin(elapsed * 22) * 0.55;
        wingLeft.rotation.x = flap;
        wingRight.rotation.x = -flap;
      }

      // Orbiting 3D Helpers
      const orbitSpeedMult = curFrenzy ? 2.6 : 1.0;
      orbitGroupInner.rotation.y += dt * 0.55 * orbitSpeedMult;
      orbitGroupOuter.rotation.y -= dt * 0.38 * orbitSpeedMult;

      // 3D Weather & Splash Droplet Instanced Meshes
      for (let i = 0; i < WEATHER_COUNT; i++) {
        const p = weatherData[i];
        p.y += p.speed * dt * (weatherSpec.mode.includes('fall') ? -1.4 : 0.85);
        p.x += Math.sin(elapsed * 1.5 + p.drift) * dt * 0.4;
        if (p.y > 4.8) p.y = -2.4;
        if (p.y < -2.6) p.y = 4.6;

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(elapsed * p.speed, elapsed * 1.2, 0);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        weatherInstanced.setMatrixAt(i, dummy.matrix);
      }
      weatherInstanced.instanceMatrix.needsUpdate = true;

      for (let i = 0; i < BURST_COUNT; i++) {
        const b = burstPool[i];
        if (!b.active) {
          dummy.position.set(0, -999, 0);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          burstInstanced.setMatrixAt(i, dummy.matrix);
          continue;
        }
        b.life += dt;
        if (b.life >= b.maxLife) {
          b.active = false;
          dummy.position.set(0, -999, 0);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          burstInstanced.setMatrixAt(i, dummy.matrix);
          continue;
        }
        b.vel.y -= 9.8 * dt;
        b.pos.addScaledVector(b.vel, dt);
        const curScale = b.scale * (1 - Math.pow(b.life / b.maxLife, 2));
        dummy.position.copy(b.pos);
        dummy.scale.set(curScale * 0.8, curScale * 1.25, curScale * 0.8);
        dummy.updateMatrix();
        burstInstanced.setMatrixAt(i, dummy.matrix);
      }
      burstInstanced.instanceMatrix.needsUpdate = true;

      // Camera Parallax + Trauma Shake
      let shakeX = 0;
      let shakeY = 0;
      if (spring.shakeTimer > 0) {
        spring.shakeTimer = Math.max(0, spring.shakeTimer - dt);
        const mag = spring.shakeTimer * 0.35;
        shakeX = (Math.random() - 0.5) * mag;
        shakeY = (Math.random() - 0.5) * mag;
      }

      camera.position.x += (baseCamPos.x + targetParallax.x - camera.position.x) * 0.08 + shakeX;
      camera.position.y += (baseCamPos.y + targetParallax.y - camera.position.y) * 0.08 + shakeY;
      camera.lookAt(0, 0.35, 0);

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      domElem.removeEventListener('pointermove', onPointerMove);
      domElem.removeEventListener('pointerdown', onPointerDown);
      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      disposableTextures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full select-none overflow-hidden"
      aria-label="Full-Viewport 3D Chilled Tropical Llama Lagoon Stage"
    />
  );
}
