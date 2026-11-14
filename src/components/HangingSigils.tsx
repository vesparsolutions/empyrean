import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface SigilArtistData {
  id: string;
  pronite: string;
  name: string;
  subtitle: string;
  day: string;
  venue: string;
  themeColor: string;
  secondaryColor: string;
  darkColor: string;
  doodleColor: string;
  accentGold: string;
  image: string;
  category: 'folk' | 'bollywood' | 'edm';
}

const SIGIL_ARTISTS: SigilArtistData[] = [
  {
    id: 'sigil-crimson',
    pronite: 'PRO-NITE 01 • DAY 1',
    name: 'Sufi & Folk Symphony',
    subtitle: 'Acoustic Fusion & Sacred Qawwali',
    day: 'Friday • 6:00 PM',
    venue: 'Open-Air Amphitheater',
    themeColor: '#780B1C', // Rich Royal Maroon
    secondaryColor: '#4A040F',
    darkColor: '#220106',
    doodleColor: 'rgba(244, 114, 138, 0.38)', // Tone-on-tone coral-red line doodles
    accentGold: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=85&w=800&auto=format&fit=crop',
    category: 'folk',
  },
  {
    id: 'sigil-navy',
    pronite: 'PRO-NITE 02 • DAY 2',
    name: 'Bollywood Star Night',
    subtitle: 'Live Symphony & Playback Megastar',
    day: 'Saturday • 8:00 PM',
    venue: 'Main Festival Grounds',
    themeColor: '#123068', // Deep Royal Blue (Exact match to reference photo!)
    secondaryColor: '#0A1C3F',
    darkColor: '#040C1D',
    doodleColor: 'rgba(96, 165, 250, 0.42)', // Tone-on-tone vibrant blue line doodles
    accentGold: '#FCD34D',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=85&w=800&auto=format&fit=crop',
    category: 'bollywood',
  },
  {
    id: 'sigil-amber',
    pronite: 'PRO-NITE 03 • DAY 3',
    name: 'Sunburn Campus Drop',
    subtitle: 'Bass, Trap & EDM Laser Euphoria',
    day: 'Sunday • 7:30 PM',
    venue: 'Main Festival Arena',
    themeColor: '#A85A0A', // Warm Royal Saffron / Golden Amber
    secondaryColor: '#6B3503',
    darkColor: '#301601',
    doodleColor: 'rgba(253, 224, 71, 0.38)', // Tone-on-tone amber-gold line doodles
    accentGold: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=85&w=800&auto=format&fit=crop',
    category: 'edm',
  },
];

/**
 * Draws the authentic running spiral wave / guilloche scroll border
 * exactly as shown in the user's reference image!
 */
function drawRunningWaveBorder(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  step = 28
) {
  ctx.save();
  ctx.strokeStyle = '#FCD34D';
  ctx.fillStyle = '#F59E0B';
  ctx.lineWidth = 3;

  for (let p = 0; p < points.length - 1; p++) {
    const p1 = points[p];
    const p2 = points[p + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    const count = Math.floor(dist / step);
    const ux = dx / dist;
    const uy = dy / dist;
    // Normal vector pointing inward
    const nx = -uy;
    const ny = ux;

    for (let i = 0; i <= count; i++) {
      const t = (i * step) / dist;
      const cx = p1.x + dx * t;
      const cy = p1.y + dy * t;

      // Draw elegant running spiral curl
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 1.8, false);
      ctx.stroke();

      // Inner center pip
      ctx.beginPath();
      ctx.arc(cx + nx * 2, cy + ny * 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * Draws rich tone-on-tone festival doodles across the banner fabric
 * (Guitars, violins, headphones, sheet music, theater masks, origami, paint palette, stars)
 * matching the user's reference image!
 */
function drawFestivalDoodles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  _category?: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Acoustic Guitar (Central Left)
  ctx.save();
  ctx.translate(w * 0.42, h * 0.28);
  ctx.rotate(-0.4);
  // Guitar body
  ctx.beginPath();
  ctx.ellipse(0, 70, 65, 80, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -10, 48, 55, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Sound hole
  ctx.beginPath();
  ctx.arc(0, 15, 22, 0, Math.PI * 2);
  ctx.stroke();
  // Neck
  ctx.strokeRect(-10, -140, 20, 130);
  // Headstock
  ctx.strokeRect(-14, -180, 28, 40);
  ctx.restore();

  // 2. Classical Violin (Lower Right)
  ctx.save();
  ctx.translate(w * 0.65, h * 0.46);
  ctx.rotate(0.35);
  ctx.beginPath();
  ctx.ellipse(0, 40, 38, 55, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -25, 30, 40, 0, 0, Math.PI * 2);
  ctx.stroke();
  // F-holes
  ctx.beginPath();
  ctx.arc(-12, 10, 8, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(12, 10, 8, Math.PI, 0);
  ctx.stroke();
  // Neck
  ctx.strokeRect(-6, -110, 12, 90);
  ctx.restore();

  // 3. Studio DJ Headphones (Bottom Center)
  ctx.save();
  ctx.translate(w * 0.5, h * 0.62);
  // Headband
  ctx.beginPath();
  ctx.arc(0, 0, 65, Math.PI * 0.85, Math.PI * 2.15);
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.lineWidth = 2.4;
  // Ear cups
  ctx.beginPath();
  ctx.roundRect(-75, -10, 26, 48, 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(49, -10, 26, 48, 12);
  ctx.stroke();
  ctx.restore();

  // 4. Music Notes & Treble Clefs (Floating all around)
  const notes = [
    { x: w * 0.22, y: h * 0.18, scale: 1.2, rot: 0.2 },
    { x: w * 0.35, y: h * 0.48, scale: 1.0, rot: -0.3 },
    { x: w * 0.78, y: h * 0.22, scale: 1.4, rot: 0.4 },
    { x: w * 0.25, y: h * 0.72, scale: 1.1, rot: 0.1 },
    { x: w * 0.72, y: h * 0.75, scale: 1.3, rot: -0.2 },
  ];

  notes.forEach((n) => {
    ctx.save();
    ctx.translate(n.x, n.y);
    ctx.rotate(n.rot);
    ctx.scale(n.scale, n.scale);
    // Beamed Eighth Note
    ctx.beginPath();
    ctx.ellipse(-12, 12, 7, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.ellipse(12, 6, 7, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-7, -18, 3, 30);
    ctx.fillRect(17, -24, 3, 30);
    ctx.fillRect(-7, -24, 27, 6);
    ctx.restore();
  });

  // 5. Theater Comedy/Tragedy Masks (Upper Right)
  ctx.save();
  ctx.translate(w * 0.75, h * 0.14);
  ctx.rotate(-0.25);
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 46, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Eyes
  ctx.beginPath();
  ctx.arc(-14, -10, 7, 0, Math.PI * 2);
  ctx.arc(14, -10, 7, 0, Math.PI * 2);
  ctx.stroke();
  // Smile
  ctx.beginPath();
  ctx.arc(0, 10, 18, 0, Math.PI);
  ctx.stroke();
  ctx.restore();

  // 6. Artist Paint Palette (Top Center-Right)
  ctx.save();
  ctx.translate(w * 0.65, h * 0.08);
  ctx.beginPath();
  ctx.ellipse(0, 0, 45, 34, 0.4, 0, Math.PI * 2);
  ctx.stroke();
  // Thumb hole
  ctx.beginPath();
  ctx.arc(20, 10, 8, 0, Math.PI * 2);
  ctx.stroke();
  // Paint drops
  for (let i = -20; i <= 10; i += 15) {
    ctx.beginPath();
    ctx.arc(i, -10, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 7. Stars & Sparkles
  const stars = [
    { x: w * 0.28, y: h * 0.38, r: 12 },
    { x: w * 0.82, y: h * 0.36, r: 16 },
    { x: w * 0.35, y: h * 0.62, r: 10 },
    { x: w * 0.68, y: h * 0.66, r: 14 },
    { x: w * 0.5, y: h * 0.16, r: 15 },
  ];

  stars.forEach((s) => {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.beginPath();
    ctx.moveTo(0, -s.r);
    ctx.lineTo(s.r * 0.3, -s.r * 0.3);
    ctx.lineTo(s.r, 0);
    ctx.lineTo(s.r * 0.3, s.r * 0.3);
    ctx.lineTo(0, s.r);
    ctx.lineTo(-s.r * 0.3, s.r * 0.3);
    ctx.lineTo(-s.r, 0);
    ctx.lineTo(-s.r * 0.3, -s.r * 0.3);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });

  ctx.restore();
}

/**
 * Creates high-resolution canvas texture for a hanging heraldic sigil banner.
 * Seamlessly incorporates:
 * - Straight hanging banner originating from top edge
 * - Pointed V-tail bottom (exact match to user's photo!)
 * - Running golden wave spiral scroll border
 * - Rich tone-on-tone festival doodles
 * - Circular artist portrait emblem with golden frame
 * - Headliner typography (Pro-Nite, Name, Genre, Venue)
 */
function createSigilBannerTexture(
  config: SigilArtistData,
  loadedImg: HTMLImageElement | null
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1680;
  const ctx = canvas.getContext('2d')!;

  const W = canvas.width;
  const H = canvas.height;
  const tailH = 260; // height of pointed V-tail

  // 1. Clip banner to straight sides + pointed V-tail at bottom
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(20, 0); // straight from top edge!
  ctx.lineTo(W - 20, 0);
  ctx.lineTo(W - 20, H - tailH); // right shoulder
  ctx.lineTo(W / 2, H - 15); // sharp V-tail point
  ctx.lineTo(20, H - tailH); // left shoulder
  ctx.closePath();
  ctx.clip();

  // 2. Base Fabric Gradient
  const bgGrad = ctx.createLinearGradient(W / 2, 0, W / 2, H);
  bgGrad.addColorStop(0, config.themeColor);
  bgGrad.addColorStop(0.55, config.secondaryColor);
  bgGrad.addColorStop(1, config.darkColor);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // 3. Subtle micro-weave texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // 4. Tone-on-tone Illustrated Doodles (exact match to reference photo!)
  drawFestivalDoodles(ctx, W, H, config.doodleColor, config.category);

  // 5. Running Wave / Guilloche Golden Border
  const borderPoints = [
    { x: 50, y: 0 },
    { x: 50, y: H - tailH },
    { x: W / 2, y: H - 45 },
    { x: W - 50, y: H - tailH },
    { x: W - 50, y: 0 },
  ];

  // Outer solid gold framing line
  ctx.beginPath();
  ctx.moveTo(35, 0);
  ctx.lineTo(35, H - tailH + 6);
  ctx.lineTo(W / 2, H - 24);
  ctx.lineTo(W - 35, H - tailH + 6);
  ctx.lineTo(W - 35, 0);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Running wave spiral border
  drawRunningWaveBorder(ctx, borderPoints, 26);

  // Inner gold hairline
  ctx.beginPath();
  ctx.moveTo(65, 0);
  ctx.lineTo(65, H - tailH - 6);
  ctx.lineTo(W / 2, H - 65);
  ctx.lineTo(W - 65, H - tailH - 6);
  ctx.lineTo(W - 65, 0);
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 6. EMBLEM: Golden Circular Frame with Artist Portrait
  const emblemY = H * 0.46;
  const emblemRadius = 135;

  ctx.save();
  ctx.translate(W / 2, emblemY);

  // Outer Gold Radiance Ring
  ctx.beginPath();
  ctx.arc(0, 0, emblemRadius + 14, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Decorative dashed ring
  ctx.beginPath();
  ctx.arc(0, 0, emblemRadius + 6, 0, Math.PI * 2);
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(254, 240, 199, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setLineDash([]);

  // Clipped Artist Picture (or Sleek Placeholder)
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, emblemRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (loadedImg && loadedImg.complete) {
    ctx.drawImage(loadedImg, -emblemRadius, -emblemRadius, emblemRadius * 2, emblemRadius * 2);
  } else {
    // Sleek Dark Mystery Portrait Placeholder
    const phGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, emblemRadius);
    phGrad.addColorStop(0, '#1c0c14');
    phGrad.addColorStop(1, '#060204');
    ctx.fillStyle = phGrad;
    ctx.fill();

    // Golden Mystery Silhouette
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, -22, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 65, 75, 45, 0, 0, Math.PI);
    ctx.fill();
  }

  // Subtle circular glass vignette
  const vig = ctx.createRadialGradient(0, 0, emblemRadius * 0.5, 0, 0, emblemRadius);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
  ctx.fillStyle = vig;
  ctx.fillRect(-emblemRadius, -emblemRadius, emblemRadius * 2, emblemRadius * 2);

  ctx.restore(); // Restore clip
  ctx.restore(); // Restore emblem translate

  // 7. TEXTS: Pro-Nite Badge, Title, Subtitle, Venue & Timing
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Pro-Nite Golden Tag
  const tagY = H * 0.63;
  ctx.save();
  ctx.translate(W / 2, tagY);
  ctx.beginPath();
  const tagW = 240;
  const tagH = 40;
  ctx.roundRect(-tagW / 2, -tagH / 2, tagW, tagH, 20);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.fillStyle = '#FEF3C7';
  ctx.font = '600 18px "Outfit", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(config.pronite, 0, 1);
  ctx.restore();

  // Artist Main Headline Name
  const nameY = H * 0.70;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#FFFDF5';
  ctx.font = '700 40px "Rozha One", "Cinzel", serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(config.name, W / 2, nameY);

  // Subtitle / Genre
  const subY = H * 0.75;
  ctx.fillStyle = '#FDE68A';
  ctx.font = 'italic 500 22px "Marcellus", serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText(config.subtitle, W / 2, subY);

  // Sleek Gold Divider
  const divY = H * 0.79;
  const lineW = 220;
  const divGrad = ctx.createLinearGradient(W / 2 - lineW / 2, 0, W / 2 + lineW / 2, 0);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.5, '#F59E0B');
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(W / 2 - lineW / 2, divY, lineW, 2);

  // Day & Timing
  ctx.fillStyle = '#E5E7EB';
  ctx.font = '500 20px "Outfit", sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText(config.day, W / 2, H * 0.83);

  // Venue
  ctx.fillStyle = '#FBBF24';
  ctx.font = '600 17px "Outfit", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(config.venue.toUpperCase(), W / 2, H * 0.865);

  ctx.restore();
  ctx.restore(); // Restore main clip

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Builds 3D banner geometry where the top originates flush at the ceiling,
 * and the bottom 18% tapers into the pointed V-shape tail!
 */
function createFlushSigilGeometry(
  width: number,
  height: number,
  cols = 36,
  rows = 56
): THREE.PlaneGeometry {
  const geom = new THREE.PlaneGeometry(width, height, cols, rows);
  const pos = geom.attributes.position;
  const uvs = geom.attributes.uv;

  const tailRatio = 0.18; // bottom 18% tapers to sharp V-point

  for (let i = 0; i < pos.count; i++) {
    const v = uvs.getY(i); // 0 at bottom, 1 at top
    if (v < tailRatio) {
      const taper = Math.max(0.01, v / tailRatio);
      const origX = pos.getX(i);
      pos.setX(i, origX * taper);
    }
  }

  geom.computeVertexNormals();
  return geom;
}

export const HangingSigils: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const width = container.clientWidth || 1100;
    const height = container.clientHeight || 750;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // --- Studio Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffedd5, 1.5);
    mainLight.position.set(2, 6, 7);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xfef08a, 0.7);
    fillLight.position.set(-4, -2, 5);
    scene.add(fillLight);

    // --- Dimensions in 3D Units ---
    // Banner hangs straight down from the very top of the visible screen!
    const vFOV = (camera.fov * Math.PI) / 180;
    const visibleH = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const visibleTop = visibleH / 2;

    const bannerW = 2.15;
    const bannerH = 5.6; // Tall majestic banners originating from the top

    // Banner Meshes & Physics State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const bannerItems: {
      group: THREE.Group;
      clothMesh: THREE.Mesh;
      baseX: number;
      seed: number;
    }[] = [];

    // Spacing across 3 columns
    const xOffsets = [-2.65, 0, 2.65];

    SIGIL_ARTISTS.forEach((config, idx) => {
      const bannerGroup = new THREE.Group();

      // Top of banner aligns precisely with visibleTop (originates from top edge of section!)
      const topY = visibleTop;
      const centerY = topY - bannerH / 2;

      // Center banner is slightly elevated/forward
      const isCenter = idx === 1;
      const xPos = xOffsets[idx];
      const zPos = isCenter ? 0.2 : 0;

      bannerGroup.position.set(xPos, centerY, zPos);

      // Geometry: Flush top + Pointed V-tail bottom
      const clothGeom = createFlushSigilGeometry(bannerW, bannerH, 36, 56);

      // Load Artist Image for Emblem
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const texture = createSigilBannerTexture(config, null);

      img.onload = () => {
        const updatedTex = createSigilBannerTexture(config, img);
        clothMat.map = updatedTex;
        clothMat.needsUpdate = true;
      };
      img.src = config.image;

      const clothMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.65,
        metalness: 0.12,
        side: THREE.DoubleSide,
      });

      // Shader Modification for Subtle Cloth Physics & Wind Ripples
      clothMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uSeed = { value: idx * 2.1 };
        shader.uniforms.uMouseInfluence = { value: new THREE.Vector2(0, 0) };

        shader.vertexShader = `
          uniform float uTime;
          uniform float uSeed;
          uniform vec2 uMouseInfluence;
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>

          // Pinned at the very top edge of the section (uv.y == 1.0 has strictly 0 movement)
          float pinWeight = pow(1.0 - uv.y, 1.4);

          // 1. Natural pendular swing wave
          float swingZ = sin(uTime * 1.25 + uSeed) * 0.05 * pinWeight;

          // 2. Traveling harmonic cloth flutter (breeze moving down the tapestry)
          float waveZ1 = sin(uTime * 2.1 - (1.0 - uv.y) * 4.5 + uSeed) * 0.05 * pinWeight;
          float waveZ2 = cos(uTime * 1.5 + uv.x * 3.14159 + uSeed * 0.8) * 0.025 * pinWeight;

          // 3. Subtle fabric edge curl along free bottom chevron
          float edgeCurl = abs(uv.x - 0.5) * 2.0 * sin(uTime * 1.8 + uv.y * 3.0 + uSeed) * 0.02 * pinWeight;

          // 4. Mouse interactive breeze ripple
          float mouseWind = uMouseInfluence.x * sin(uv.y * 3.14159) * 0.07 * pinWeight;

          transformed.z += swingZ + waveZ1 + waveZ2 + edgeCurl + mouseWind;
          transformed.x += sin(uTime * 0.9 + uSeed) * 0.012 * pinWeight;
          `
        );

        clothMat.userData.shader = shader;
      };

      const clothMesh = new THREE.Mesh(clothGeom, clothMat);
      bannerGroup.add(clothMesh);

      scene.add(bannerGroup);

      bannerItems.push({
        group: bannerGroup,
        clothMesh,
        baseX: xPos,
        seed: idx * 1.6,
      });
    });

    // --- Mouse Move Listener for Interactive Physics ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Responsive Resize ---
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;

      // Adjust camera distance for mobile/tablet so all 3 banners remain visible
      if (newW < 640) {
        camera.position.z = 13.0;
      } else if (newW < 960) {
        camera.position.z = 10.5;
      } else {
        camera.position.z = 8.8;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    // --- Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Update Physics on Banners
      bannerItems.forEach((item) => {
        const { group, clothMesh, seed } = item;

        // Subtle pendular rotation (swaying gently in 3D from the top anchor)
        const swayY = Math.sin(elapsedTime * 0.8 + seed) * 0.03;
        const swayZ = Math.sin(elapsedTime * 0.6 + seed) * 0.012;
        const mouseTilt = (mouse.x - item.baseX * 0.25) * 0.035;

        group.rotation.y = swayY + mouseTilt;
        group.rotation.z = swayZ;

        // Update Cloth Shader Uniforms
        const shader = (clothMesh.material as THREE.MeshStandardMaterial).userData.shader;
        if (shader) {
          shader.uniforms.uTime.value = elapsedTime;
          shader.uniforms.uMouseInfluence.value.set(mouse.x, mouse.y);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      {/* 3D WebGL Canvas filling the section from top: 0 */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-pointer"
        aria-label="Three Grand Hanging Sigil Banners — Empyrean 2026 Star Artists"
      />
    </div>
  );
};
