import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { getBucketImageUrls } from '../lib/supabase';

interface CinematicRibbonGalleryProps {
  isTriggered?: boolean;
  prefersReducedMotion?: boolean;
  initialImageUrls?: string[];
}

export interface GalleryProject {
  id: string;
  brand: string;
  description: string;
  url: string;
  aspect: number;
}

const SUPABASE_BUCKET_BASE_URL =
  'https://omgweuvobdpbotwteqxw.supabase.co/storage/v1/object/public/Memory';

// All 15 images from the Supabase "Memory" storage bucket
export const DEFAULT_PROJECTS: GalleryProject[] = [
  {
    id: 'proj-1',
    brand: 'Star Night — Euphoria',
    description: 'Live Concert & Headliner Performance',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-08 at 13.52.47.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-2',
    brand: 'Campus Twilight',
    description: 'Lantern Night & Campus Illuminations',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.50.58.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-3',
    brand: 'DJ Ignition & EDM Surge',
    description: 'Electrifying Soundstage & Laser Spectacle',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.11.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-4',
    brand: 'Acoustic Serenade',
    description: 'Unplugged Harmonies & Soulful Rhythms',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.17.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-5',
    brand: 'Street Carnival & Flea',
    description: 'Artisan Bazaars & Youth Street Vibe',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.24.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-6',
    brand: 'Symphony of Lights',
    description: 'Campus Fest Atmosphere & Ocean of Crowd',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.32.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-7',
    brand: 'Battle of the Bands',
    description: 'National Collegiate Rock & Fusion Clash',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.37.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-8',
    brand: 'Kashmiri Folk & Classical',
    description: 'Traditional Dance Ensemble & Rhythms',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.45.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-9',
    brand: 'Theatrical Spotlight',
    description: 'Expressive Drama & Stage Storytelling',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.01.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-10',
    brand: 'Esports Arena & Gaming',
    description: 'High Stakes Tournaments & LAN Battles',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.21.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-11',
    brand: 'Comedy Riot Showcase',
    description: 'Celebrity Stand-Up & Hilarious Punchlines',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.31.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-12',
    brand: 'Hackathon & Innovation Hub',
    description: 'Coding Through the Midnight Fire',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.36.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-13',
    brand: 'Artistry Alley & Murals',
    description: 'Vibrant Canvas & Festive Graffiti Walls',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.52.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-14',
    brand: 'Couture Elegance',
    description: 'Annual Runway & High Fashion Extravaganza',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.53.00.png')}`,
    aspect: 16 / 9,
  },
  {
    id: 'proj-15',
    brand: 'Grand Finale — Dawn of Empyrean',
    description: 'Closing Ceremony & Pyro Spectacle',
    url: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.53.08.png')}`,
    aspect: 16 / 9,
  },
];

// --- EXACT MOTION LABS GLASS LENS SHADER (bo) ---
const GLASS_LENS_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const GLASS_LENS_FRAGMENT_SHADER = `
  #define PI 3.14159265
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uTex;
  uniform vec2  uRes;
  uniform vec2  uCenter;
  uniform float uSizeX;
  uniform float uSizeY;
  uniform float uAspect;
  uniform float uZoom;
  uniform float uDispersion;
  uniform float uBlur;
  uniform float uGlow;
  uniform float uWhiteGlow;
  uniform float uNovaSize;
  uniform float uBlueRing;
  uniform float uRingRadius;
  uniform float uRingWidth;
  uniform float uShimmer;
  uniform float uShimmerFreq;
  uniform float uShimmerSpeed;
  uniform float uShimmerDepth;
  uniform float uTime;
  uniform float uRimStart;
  uniform float uRimTangential;
  uniform float uRimInward;
  uniform float uRimFreq1;
  uniform float uRimFreq2;
  uniform vec3  uBlueColor;
  uniform float uRimLine;
  uniform float uRimLinePos;
  uniform float uRimLineWidth;
  uniform float uShape;
  uniform float uSquareRound;
  uniform float uRotation;
  uniform int   uSamples;

  const int MAX_SAMPLES = 16;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  vec3 glassLens(vec2 center, float aspectCorrect, out float outMask, out float outAlpha) {
    vec2 p = vUv - center;
    p.x *= aspectCorrect;
    float ca = cos(uRotation), sa = sin(uRotation);
    p = mat2(ca, -sa, sa, ca) * p;
    vec2 halfSize = vec2(uSizeX, uSizeY);
    float dist = length(p / halfSize);
    outMask = 0.0;
    outAlpha = 0.0;

    float maskND;
    if (uShape > 0.5) {
      float corner = min(uSizeX, uSizeY) * clamp(uSquareRound, 0.0, 1.0);
      float sd = sdRoundBox(p, halfSize, corner);
      maskND = 1.0 + sd / min(uSizeX, uSizeY);
    } else {
      maskND = dist;
    }

    if (maskND > 1.0) return vec3(0.0);

    float shapeND = clamp(maskND, 0.0, 1.0);
    float nd = clamp(dist, 0.0, 1.0);
    vec2 offset = vUv - center;
    vec2 radialDir = normalize(offset + 1e-6);
    vec2 tangentDir = vec2(-radialDir.y, radialDir.x);
    float angle = atan(p.y, p.x);

    float pull = uZoom * 0.30 * nd * nd;
    float rimStrength = smoothstep(uRimStart, 1.0, nd);
    float fluidWave = sin(angle * uRimFreq1) * 0.55 + sin(angle * uRimFreq2) * 0.25;
    float rScreen = (uSizeX + uSizeY) * 0.5;

    vec2 rimOff = tangentDir * fluidWave * rimStrength * rScreen * uRimTangential;
    vec2 rimPull = -radialDir * rimStrength * rScreen * uRimInward;
    vec2 baseUV = center + offset * (1.0 - pull) + rimOff + rimPull;

    float rimMask = smoothstep(0.55, 1.0, nd);
    vec2 dispDir = offset * uDispersion * 0.004 * rimMask;

    int count = uSamples;
    if (count < 2) count = 2;
    if (count > MAX_SAMPLES) count = MAX_SAMPLES;

    vec3 col = vec3(0.0);
    vec3 caW = vec3(0.0);
    float totalAlpha = 0.0;
    float totalAlphaW = 0.0;

    for (int i = 0; i < MAX_SAMPLES; i++) {
      if (i >= count) break;

      float t = float(i) / float(count - 1);
      vec2 sUV = baseUV + dispDir * (t - 0.5);
      vec4 sampleColor = texture2D(uTex, sUV);

      vec3 weight = vec3(
        exp(-pow((t - 0.00) / 0.38, 2.0)),
        exp(-pow((t - 0.50) / 0.38, 2.0)),
        exp(-pow((t - 1.00) / 0.38, 2.0))
      );

      col += sampleColor.rgb * weight;
      caW += weight;
      float w = (weight.r + weight.g + weight.b) / 3.0;
      totalAlpha += sampleColor.a * w;
      totalAlphaW += w;
    }

    col /= max(caW, vec3(0.001));
    outAlpha = totalAlpha / max(totalAlphaW, 0.001);

    float blurFade = 1.0 - smoothstep(0.72, 0.98, nd);

    if (uBlur > 0.01 && blurFade > 0.01) {
      vec2 blurRad = vec2(uBlur) / uRes * blurFade;
      vec3 bcol = vec3(0.0);
      float totalWeight = 0.0;

      for (float a = 0.0; a < PI * 2.0; a += PI * 2.0 / 6.0) {
        for (float rr = 0.4; rr <= 1.001; rr += 0.3) {
          vec2 o = vec2(cos(a), sin(a)) * blurRad * rr;
          float weight = 1.0 - rr * 0.38;
          bcol += texture2D(uTex, baseUV + o).rgb * weight;
          totalWeight += weight;
        }
      }

      col = mix(bcol / totalWeight, col, rimMask);
    }

    // Normalized true photographic brightness
    col *= 1.0;

    // Nova center aura (0 when uWhiteGlow = 0)
    float r2 = shapeND * shapeND * 0.25;
    float gs = max(uNovaSize * uGlow * 0.003, 0.004);
    float nova = exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18;
    nova *= uWhiteGlow * (uGlow / 17.0) * 1.15;
    col += vec3(nova);

    // Colorless lens: chromatic rim ring is disabled (uBlueRing = 0.0)
    float dC = shapeND * 0.5;
    float tR = clamp(uRingRadius, 0.1, 0.49);
    float rW = max(uRingWidth, 0.003);

    float ring = exp(-pow((dC - tR) / rW, 2.0));
    ring *= uBlueRing * (uGlow / 17.0) * 1.8;

    if (uShimmer > 0.5) {
      ring *= sin(angle * uShimmerFreq + uTime * uShimmerSpeed) * uShimmerDepth + (1.0 - uShimmerDepth);
    }

    float aura = exp(-pow((dC - tR) / (rW * 6.0), 2.0)) * 0.28 * uBlueRing * (uGlow / 17.0);
    col += uBlueColor * (ring + aura);

    // Thin razor rim line (disabled when uRimLine = 0.0)
    col += vec3(
      exp(
        -pow(
          (dC - uRimLinePos) /
          max(uRimLineWidth, 0.0001),
          2.0
        )
      ) * uRimLine
    );

    outMask = smoothstep(1.0, 0.93, maskND);
    return col;
  }

  void main() {
    vec4 directTex = texture2D(uTex, vUv);
    float maskA = 0.0;
    float lensA = 0.0;
    vec3 lensColor = glassLens(uCenter, uAspect, maskA, lensA);

    vec3 finalColor = mix(directTex.rgb, lensColor, maskA);
    float finalAlpha = mix(directTex.a, lensA, maskA);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

// Motion Labs exact easing formulas
function easePower3Out(t: number): number {
  const p = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - p, 3);
}

function easePower2InOut(t: number): number {
  const p = Math.max(0, Math.min(1, t));
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}

function easeExpoInOut(t: number): number {
  const p = Math.max(0, Math.min(1, t));
  if (p === 0) return 0;
  if (p === 1) return 1;
  return p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2;
}

export const CinematicRibbonGallery: React.FC<CinematicRibbonGalleryProps> = ({
  isTriggered = false,
  prefersReducedMotion = false,
  initialImageUrls,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<GalleryProject[]>(() => {
    if (initialImageUrls && initialImageUrls.length > 0) {
      return initialImageUrls.map((url, idx) => ({
        id: `proj-${idx + 1}`,
        brand: DEFAULT_PROJECTS[idx]?.brand || `Festival Memory ${idx + 1}`,
        description: DEFAULT_PROJECTS[idx]?.description || 'EMPYREAN Live Captures',
        url,
        aspect: 16 / 9,
      }));
    }
    return DEFAULT_PROJECTS;
  });

  const stepRef = useRef<((dir: number) => void) | null>(null);
  const isTriggeredRef = useRef(isTriggered);
  isTriggeredRef.current = isTriggered;

  // Background fetch if initialImageUrls was not provided
  useEffect(() => {
    if (initialImageUrls && initialImageUrls.length > 0) return;
    getBucketImageUrls('Memory').then((urls) => {
      if (urls.length > 0) {
        setProjects(
          urls.map((url, idx) => ({
            id: `proj-${idx + 1}`,
            brand: DEFAULT_PROJECTS[idx]?.brand || `Festival Memory ${idx + 1}`,
            description: DEFAULT_PROJECTS[idx]?.description || 'EMPYREAN Live Captures',
            url,
            aspect: 16 / 9,
          }))
        );
      }
    });
  }, [initialImageUrls]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = Math.max(1, container.clientWidth || window.innerWidth);
    let height = Math.max(1, container.clientHeight || window.innerHeight);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    // --- WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);

    const themeBg = new THREE.Color('#0b1839');
    renderer.setClearColor(themeBg, 0.0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.background = 'transparent';
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    // --- Pass 1: Orthographic Scene for Panels ---
    const panelScene = new THREE.Scene();
    const orthoCamera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      -100,
      100
    );
    orthoCamera.position.z = 10;

    const renderTarget = new THREE.WebGLRenderTarget(
      Math.max(1, Math.round(width * pixelRatio)),
      Math.max(1, Math.round(height * pixelRatio)),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    // --- Pass 2: Post-Processing Scene with 65° Refractive Shader ---
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Ribbon scale: 0.75x
    const RIBBON_SCALE = 0.75;

    // Corner lens calculation: ensures the fluid wave bend element reaches screen corners
    const computeLensSize = (w: number, h: number) => {
      const aspect = w / h;
      const rot = 65 * (Math.PI / 180);
      const px = 0.5 * aspect;
      const py = 0.5;
      const ry = Math.sin(rot) * px + Math.cos(rot) * py;
      const targetDist = 0.92;
      const sizeY = Math.max(1.15, Math.abs(ry) / targetDist);
      const sizeX = Math.max(0.72, 0.72 * (sizeY / 1.15));
      return { sizeX, sizeY };
    };

    const initialLensSize = computeLensSize(width, height);

    // Exact Motion Labs shader parameters (Colourless lens, 65° tilt, corner reach)
    const lensUniforms = {
      uTex: { value: renderTarget.texture },
      uRes: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uSizeX: { value: initialLensSize.sizeX },
      uSizeY: { value: initialLensSize.sizeY },
      uShape: { value: 0.0 }, // circle
      uSquareRound: { value: 0.0 },
      uRotation: { value: 65 * (Math.PI / 180) }, // EXACT 65° TILT
      uAspect: { value: width / height },
      uZoom: { value: 0.0 },
      uDispersion: { value: 11.0 },
      uBlur: { value: 0.0 },
      uGlow: { value: 4.2 },
      uWhiteGlow: { value: 0.0 },
      uNovaSize: { value: 12.0 },
      uBlueRing: { value: 0.0 }, // Colorless: no green circle
      uRingRadius: { value: 0.49 },
      uRingWidth: { value: 0.014 },
      uShimmer: { value: 0.0 },
      uShimmerFreq: { value: 12.0 },
      uShimmerSpeed: { value: 3.5 },
      uShimmerDepth: { value: 0.12 },
      uTime: { value: 0.0 },
      uRimStart: { value: 0.578 },
      uRimTangential: { value: 0.0 },
      uRimInward: { value: 0.0 },
      uRimFreq1: { value: 2.0 },
      uRimFreq2: { value: 1.0 },
      uBlueColor: { value: new THREE.Color(0x000000) }, // Colorless
      uRimLine: { value: 0.0 },
      uRimLinePos: { value: 0.488 },
      uRimLineWidth: { value: 0.003 },
      uSamples: { value: 16 },
    };

    const postMaterial = new THREE.ShaderMaterial({
      vertexShader: GLASS_LENS_VERTEX_SHADER,
      fragmentShader: GLASS_LENS_FRAGMENT_SHADER,
      uniforms: lensUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
    postScene.add(postQuad);

    // --- Panel Layout Calculations ---
    const getPanelHeight = () => {
      const panelH = Math.round(280 * RIBBON_SCALE); // 210px
      const t = height * 0.48 * RIBBON_SCALE;
      const n = width * 0.78 * RIBBON_SCALE;
      return Math.max(90, Math.min(panelH, t, n));
    };

    const getGap = () => {
      const scale = getPanelHeight() / (280 * RIBBON_SCALE);
      return Math.max(5, Math.round(12 * RIBBON_SCALE * Math.min(1, scale)));
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const unitPlaneGeom = new THREE.PlaneGeometry(1, 1);

    interface PanelItem {
      mesh: THREE.Mesh;
      material: THREE.MeshBasicMaterial;
      project: GalleryProject;
      sourceIndex: number;
    }

    const panelItems: PanelItem[] = [];
    const repeatCount = 4; // 4 full cycles = 60 panels for seamless infinite ribbon
    const totalPanels = projects.length * repeatCount;

    for (let c = 0; c < repeatCount; c++) {
      for (let s = 0; s < projects.length; s++) {
        const proj = projects[s];
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
        });

        textureLoader.load(proj.url, (tex) => {
          tex.colorSpace = THREE.NoColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          material.map = tex;
          material.needsUpdate = true;
        });

        const mesh = new THREE.Mesh(unitPlaneGeom, material);
        mesh.visible = false;
        panelScene.add(mesh);

        panelItems.push({
          mesh,
          material,
          project: proj,
          sourceIndex: s,
        });
      }
    }

    // Motion Labs metrics calculation
    const computePositions = () => {
      const pH = getPanelHeight();
      const gapVal = getGap();
      const pitches = projects.map((p) => p.aspect * pH + gapVal);
      const totalCycleWidth = pitches.reduce((a, b) => a + b, 0);

      const cumX: number[] = [0];
      for (let i = 0; i < pitches.length - 1; i++) {
        cumX.push(cumX[i] + pitches[i]);
      }

      return { pH, gapVal, pitches, totalCycleWidth, cumX };
    };

    let metrics = computePositions();

    const calcCenterOffset = (idx: number) => {
      const count = projects.length;
      const cycle = Math.floor(idx / count);
      const r = ((idx % count) + count) % count;
      return (
        metrics.cumX[r] +
        metrics.pitches[r] / 2 -
        metrics.gapVal / 2 +
        cycle * metrics.totalCycleWidth
      );
    };

    const findClosestIndex = (posX: number) => {
      const count = projects.length;
      let best = 0;
      let minDiff = Infinity;
      for (let r = 0; r < count; r++) {
        const itemCenter = metrics.cumX[r] + metrics.pitches[r] / 2 - metrics.gapVal / 2;
        const cycle = Math.round((posX - itemCenter) / metrics.totalCycleWidth);
        const diff = Math.abs(itemCenter + cycle * metrics.totalCycleWidth - posX);
        if (diff < minDiff) {
          minDiff = diff;
          best = r + cycle * count;
        }
      }
      return best;
    };



    // Scroll, Timer & Physics State
    // Start centered on image index 2 (center of initial 5 cards)
    let currentTargetIndex = 2;
    let N = calcCenterOffset(2);
    let P = N;
    let ee = N;
    let te = 0; // speedShrink progress
    let lastUserInteractTime = 0;
    let lastAutoAdvanceTime = performance.now();
    let isUserActive = false;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;

    // --- Entrance Animation State (Ye) ---
    // ue: Y rising animation progress per panel (0 -> 1)
    // de: Card scale zoom-in animation progress per panel (0 -> 1)
    const ueArr = new Float32Array(totalPanels).fill(0);
    const deArr = new Float32Array(totalPanels).fill(0);

    let wasTriggered = false;
    let triggerTimestamp = 0;
    let isEntranceRising = false;
    let isEntranceMorphing = false;
    let currentLensFx = 0.0;
    let autoTimerStarted = false;

    const step = (dir: number) => {
      if (isEntranceRising || isEntranceMorphing) return;
      currentTargetIndex = findClosestIndex(P) + dir;
      P = calcCenterOffset(currentTargetIndex);
      lastUserInteractTime = performance.now();
      lastAutoAdvanceTime = performance.now();
      isUserActive = true;
    };
    stepRef.current = step;

    // --- Pointer Drag Listeners ---
    const onPointerDown = (e: PointerEvent) => {
      if (isEntranceRising || isEntranceMorphing) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartOffset = P;
      lastUserInteractTime = performance.now();
      lastAutoAdvanceTime = performance.now();
      isUserActive = true;
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      P = dragStartOffset - deltaX * 1.0;
      lastUserInteractTime = performance.now();
      lastAutoAdvanceTime = performance.now();
      isUserActive = true;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        renderer.domElement.releasePointerCapture(e.pointerId);
        isDragging = false;
        lastUserInteractTime = performance.now();
        lastAutoAdvanceTime = performance.now();
        currentTargetIndex = findClosestIndex(P);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    // --- Viewport Resize Handler ---
    const onResize = () => {
      if (!container) return;
      width = Math.max(1, container.clientWidth || window.innerWidth);
      height = Math.max(1, container.clientHeight || window.innerHeight);

      renderer.setSize(width, height);
      renderTarget.setSize(
        Math.max(1, Math.round(width * pixelRatio)),
        Math.max(1, Math.round(height * pixelRatio))
      );

      orthoCamera.left = -width / 2;
      orthoCamera.right = width / 2;
      orthoCamera.top = height / 2;
      orthoCamera.bottom = -height / 2;
      orthoCamera.updateProjectionMatrix();

      lensUniforms.uRes.value.set(width * pixelRatio, height * pixelRatio);
      lensUniforms.uAspect.value = width / height;

      const nextLensSize = computeLensSize(width, height);
      lensUniforms.uSizeX.value = nextLensSize.sizeX;
      lensUniforms.uSizeY.value = nextLensSize.sizeY;

      metrics = computePositions();
    };
    window.addEventListener('resize', onResize);

    // --- Main Animation Loop ---
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const trig = isTriggeredRef.current;

      // Handle trigger state transition
      if (trig && !wasTriggered) {
        wasTriggered = true;
        triggerTimestamp = now;
        isEntranceRising = true;
        isEntranceMorphing = false;
        currentLensFx = 0.0;
        autoTimerStarted = false;
        ueArr.fill(0);
        deArr.fill(0);

        currentTargetIndex = 2; // Center on initial middle card
        N = calcCenterOffset(2);
        P = N;
        ee = N;
      } else if (!trig && wasTriggered) {
        wasTriggered = false;
        triggerTimestamp = 0;
        isEntranceRising = false;
        isEntranceMorphing = false;
        currentLensFx = 0.0;
        autoTimerStarted = false;
        ueArr.fill(0);
        deArr.fill(0);
      }

      if (!wasTriggered) {
        // Not triggered: keep meshes hidden and clear buffer
        panelItems.forEach((p) => {
          p.mesh.visible = false;
        });
        renderer.setRenderTarget(renderTarget);
        renderer.setClearColor(themeBg, 0.0);
        renderer.clear();
        renderer.setRenderTarget(null);
        renderer.clear();
        return;
      }

      // --- Drive Entrance Animation Timeline (Ye) ---
      const elapsedSec = (now - triggerTimestamp) / 1000.0;

      if (elapsedSec < 1.6) {
        // Phase 1: Only the first 5 images rise up from the bottom!
        // Middle image (c = 2) rises first, then surrounding cards staggered
        isEntranceRising = true;
        isEntranceMorphing = false;
        currentLensFx = 0.0;
        deArr.fill(0.0);

        const riseDelays: { [key: number]: number } = {
          2: 0.00,
          3: 0.15,
          1: 0.30,
          4: 0.45,
          0: 0.60,
        };

        panelItems.forEach((item, o) => {
          const srcIdx = item.sourceIndex;
          if (srcIdx < 5) {
            const delay = riseDelays[srcIdx] ?? 0.60;
            const t = Math.max(0, (elapsedSec - delay) / 0.75);
            ueArr[o] = easePower3Out(t);
          }
        });
      } else if (elapsedSec < 3.2) {
        // Phase 2: The 5 cards now ZOOM IN and morph into the 65° curved ribbon!
        isEntranceRising = false;
        isEntranceMorphing = true;

        const morphElapsed = elapsedSec - 1.6;
        currentLensFx = easePower2InOut(morphElapsed / 1.4);

        // Zoom-in progress: blooms outward from center card (idx 2)
        panelItems.forEach((item, o) => {
          const c = item.sourceIndex;
          if (c < 5) {
            const distRank = Math.abs(c - 2);
            const rankOrder = 2 - distRank;
            const cardDelay = rankOrder * 0.08;
            const zoomT = Math.max(0, Math.min(1, (morphElapsed - cardDelay) / 1.35));
            deArr[o] = easeExpoInOut(zoomT);
          }
        });
      } else {
        // Phase 3: Entrance complete, 65° curved ribbon active with all 15 images
        isEntranceRising = false;
        isEntranceMorphing = false;
        deArr.fill(1.0);
        currentLensFx = 1.0;

        if (!autoTimerStarted) {
          autoTimerStarted = true;
          lastAutoAdvanceTime = now;
        }
      }

      // --- 2-Second Auto-Centering Carousel (Runs once entrance completes) ---
      const inEntrance = isEntranceRising || isEntranceMorphing;
      if (!inEntrance) {
        if (!isDragging && now - lastUserInteractTime > 1500) {
          if (now - lastAutoAdvanceTime >= 2000) {
            lastAutoAdvanceTime = now;
            currentTargetIndex++;
            P = calcCenterOffset(currentTargetIndex);
          }
        } else {
          lastAutoAdvanceTime = now;
          currentTargetIndex = findClosestIndex(P);
        }

        // Magnetic snapping
        if (
          isUserActive &&
          !isDragging &&
          now - lastUserInteractTime > 120 &&
          Math.abs(P - N) < 60
        ) {
          currentTargetIndex = findClosestIndex(P);
          P = calcCenterOffset(currentTargetIndex);
          isUserActive = false;
        }

        N += (P - N) * (prefersReducedMotion ? 0.25 : 0.095);

        const deltaN = N - ee;
        ee = N;
        const speedRatio = Math.min(1, Math.abs(deltaN) / 40);
        const shrinkEase = speedRatio > te ? 0.25 : 0.06;
        te += (speedRatio - te) * shrinkEase;
      } else {
        N = calcCenterOffset(2);
        P = N;
        ee = N;
        te = 0;
      }

      // --- Position Panels ---
      const halfW = width / 2;
      const nHeight = getPanelHeight();
      const count = projects.length;
      const totalSpan = metrics.totalCycleWidth * repeatCount;
      const speedShrinkFactor = 1 - 0.25 * te;
      const basePanelH = nHeight * speedShrinkFactor;
      const gapVal = getGap();

      // Compact initial card height for the 5 loading images
      const minCardH = Math.min(Math.round(80 * RIBBON_SCALE), nHeight * 0.38);
      const compactGap = 8;

      panelItems.forEach((item, o) => {
        const cycle = Math.floor(o / count);
        const c = item.sourceIndex;
        const proj = item.project;

        let posX = 0;
        let posY = 0;
        let scaleH = basePanelH;
        let scaleW = proj.aspect * scaleH;

        if (inEntrance) {
          // WHILE LOADING: ONLY contain the first 5 images (c < 5 in center cycle 2)
          if (cycle !== 2 || c >= 5) {
            item.mesh.visible = false;
            return;
          }

          const uY = ueArr[o];
          const sDe = deArr[o];

          // Cards zoom in from minCardH -> full basePanelH
          scaleH = minCardH + (basePanelH - minCardH) * sDe;
          scaleW = scaleH * proj.aspect;

          const currentCardH = (idx: number) =>
            minCardH + (basePanelH - minCardH) * deArr[2 * count + idx];
          const currentGap = compactGap + (gapVal - compactGap) * sDe;

          // Compute horizontal position relative to center card (idx 2)
          let accumX = 0;
          if (c > 2) {
            for (let sIdx = 2; sIdx < c; sIdx++) {
              accumX +=
                (projects[sIdx].aspect * currentCardH(sIdx) +
                  projects[sIdx + 1].aspect * currentCardH(sIdx + 1)) /
                  2 +
                currentGap;
            }
          } else if (c < 2) {
            for (let sIdx = 2; sIdx > c; sIdx--) {
              accumX -=
                (projects[sIdx].aspect * currentCardH(sIdx) +
                  projects[sIdx - 1].aspect * currentCardH(sIdx - 1)) /
                  2 +
                currentGap;
            }
          }

          posX = accumX;
          const startY = -height * 0.85;
          posY = startY + (0 - startY) * uY;
        } else {
          // Fully formed ribbon: continuous conveyor belt with all 15 images
          const panelCenter =
            metrics.cumX[c] +
            metrics.pitches[c] / 2 -
            metrics.gapVal / 2 +
            cycle * metrics.totalCycleWidth;

          let d = panelCenter - N;
          d = ((d % totalSpan) + totalSpan) % totalSpan;
          if (d > totalSpan / 2) d -= totalSpan;

          // Frustum culling
          if (d < -halfW - scaleW || d > halfW + scaleW) {
            item.mesh.visible = false;
            return;
          }

          posX = d;
          posY = 0;
        }

        item.mesh.visible = true;
        item.mesh.position.set(posX, posY, 0);
        item.mesh.scale.set(scaleW, scaleH, 1);
      });

      // Update 65° Glass Lens Uniforms via currentLensFx
      lensUniforms.uTime.value = now * 0.001;
      lensUniforms.uDispersion.value = 11.0 * currentLensFx;
      lensUniforms.uBlueRing.value = 0.0; // Colorless
      lensUniforms.uRimLine.value = 0.0;  // Colorless
      lensUniforms.uZoom.value = 0.0;
      lensUniforms.uRimTangential.value = 0.30 * currentLensFx; // 65° S-curve fluid wave

      // Pass 1: Render Panels to WebGLRenderTarget
      renderer.setRenderTarget(renderTarget);
      renderer.setClearColor(themeBg, 0.0);
      renderer.clear();
      renderer.render(panelScene, orthoCamera);

      // Pass 2: Render 65° Post-Processing Quad to Screen
      renderer.setRenderTarget(null);
      renderer.setClearColor(themeBg, 0.0);
      renderer.clear();
      renderer.render(postScene, postCamera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      panelItems.forEach((p) => {
        p.mesh.geometry.dispose();
        p.material.dispose();
      });
      unitPlaneGeom.dispose();
      postQuad.geometry.dispose();
      postMaterial.dispose();
      renderTarget.dispose();
      renderer.dispose();

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [projects, prefersReducedMotion]);

  const handlePrev = useCallback(() => {
    stepRef.current?.(-1);
  }, []);

  const handleNext = useCallback(() => {
    stepRef.current?.(1);
  }, []);

  return (
    <div
      id="cinematic-s-ribbon-container"
      className="absolute inset-0 z-[20] flex flex-col items-center justify-between select-none overflow-hidden transition-opacity duration-500 ease-out"
      style={{
        opacity: isTriggered ? 1 : 0,
        pointerEvents: isTriggered ? 'auto' : 'none',
      }}
      aria-label="3D Cinematic S-Ribbon Gallery"
    >
      {/* 1. MAIN 3D RIBBON CANVAS CONTAINER (No header text) */}
      <div className="absolute inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* 2. MINIMAL BOTTOM CONTROLS (Chevron Buttons Only - All text removed) */}
      <div className="absolute bottom-[5%] sm:bottom-[7%] left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center justify-center">
        <div className="flex items-center justify-center gap-5 sm:gap-7 pointer-events-auto">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous video"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#f8e5b0]/80 hover:text-[#f8e5b0] hover:bg-white/10 active:scale-95 transition-all border border-[#f8e5b0]/30 shadow-lg cursor-pointer focus:outline-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next video"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#f8e5b0]/80 hover:text-[#f8e5b0] hover:bg-white/10 active:scale-95 transition-all border border-[#f8e5b0]/30 shadow-lg cursor-pointer focus:outline-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
