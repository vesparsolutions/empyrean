import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface SigilBannerData {
  id: string;
  name: 'crimson' | 'sapphire' | 'amber';
  topColor: string;
  midColor: string;
  bottomColor: string;
  height: number;
  chevronH: number;
  phaseOffset: number;
}

export const SIGIL_3D_DATA: SigilBannerData[] = [
  {
    id: 'sigil-crimson',
    name: 'crimson',
    topColor: '#580A18',
    midColor: '#831126',
    bottomColor: '#2D040A',
    height: 598, // 10% longer corner
    chevronH: 60,
    phaseOffset: 0.0,
  },
  {
    id: 'sigil-sapphire',
    name: 'sapphire',
    topColor: '#0E295E',
    midColor: '#1B4791',
    bottomColor: '#081736',
    height: 544, // Center banner
    chevronH: 58,
    phaseOffset: 1.8,
  },
  {
    id: 'sigil-amber',
    name: 'amber',
    topColor: '#5C3005',
    midColor: '#8C4D0A',
    bottomColor: '#2C1602',
    height: 598, // 10% longer corner
    chevronH: 60,
    phaseOffset: 3.5,
  },
];

/**
 * Calculates continuous wave scroll coordinates around the banner border:
 * Left edge -> Left chevron point -> Right chevron point -> Right edge.
 */
function calculateBorderCurls(w: number, h: number, chevronH: number, step = 25) {
  const inset = 13;
  const p1 = { x: inset, y: 0 };
  const p2 = { x: inset, y: h - chevronH };
  const p3 = { x: w / 2, y: h - inset };
  const p4 = { x: w - inset, y: h - chevronH };
  const p5 = { x: w - inset, y: 0 };

  const segments = [
    { start: p1, end: p2 },
    { start: p2, end: p3 },
    { start: p3, end: p4 },
    { start: p4, end: p5 },
  ];

  const curls: Array<{
    curlPath: string;
    pipX: number;
    pipY: number;
  }> = [];

  segments.forEach(({ start, end }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    const count = Math.floor(dist / step);
    const ux = dx / dist;
    const uy = dy / dist;
    const nx = -uy;
    const ny = ux;

    for (let i = 0; i < count; i++) {
      const t = ((i + 0.5) * step) / dist;
      const cx = start.x + dx * t;
      const cy = start.y + dy * t;

      const r = 7.5;
      const pStartX = cx - ux * r;
      const pStartY = cy - uy * r;
      const pEndX = cx + nx * 2;
      const pEndY = cy + ny * 2;

      const curlPath = `M ${pStartX.toFixed(1)} ${pStartY.toFixed(1)} A ${r} ${r} 0 1 1 ${(
        cx +
        ux * (r * 0.7)
      ).toFixed(1)} ${(cy + uy * (r * 0.7)).toFixed(1)} A ${(r * 0.55).toFixed(1)} ${(
        r * 0.55
      ).toFixed(1)} 0 0 1 ${pEndX.toFixed(1)} ${pEndY.toFixed(1)}`;

      curls.push({
        curlPath,
        pipX: pEndX,
        pipY: pEndY,
      });
    }
  });

  return curls;
}

/**
 * Builds the exact SVG vector graphic string for a banner at 1:1 scale
 */
function buildBannerSVGString(data: SigilBannerData, w: number, h: number, chevronH: number): string {
  const curls = calculateBorderCurls(w, h, chevronH, 25);
  const outerBorderPath = `M 0 0 L 0 ${h - chevronH} L ${w / 2} ${h} L ${w} ${h - chevronH} L ${w} 0 Z`;
  const innerInset = 24;
  const innerBorderPath = `M ${innerInset} 0 L ${innerInset} ${h - chevronH - 8} L ${w / 2} ${
    h - innerInset
  } L ${w - innerInset} ${h - chevronH - 8} L ${w - innerInset} 0`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="fabric-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${data.topColor}" />
          <stop offset="35%" stop-color="${data.midColor}" />
          <stop offset="75%" stop-color="${data.midColor}" />
          <stop offset="100%" stop-color="${data.bottomColor}" />
        </linearGradient>
        <linearGradient id="fabric-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#000" stop-opacity="0.28" />
          <stop offset="25%" stop-color="#FFF" stop-opacity="0.06" />
          <stop offset="50%" stop-color="#FFF" stop-opacity="0.14" />
          <stop offset="75%" stop-color="#FFF" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#000" stop-opacity="0.28" />
        </linearGradient>
        <linearGradient id="gold-border" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="28%" stop-color="#F59E0B" />
          <stop offset="55%" stop-color="#D97706" />
          <stop offset="82%" stop-color="#FCD34D" />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
        <radialGradient id="gold-pip" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="60%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#92400E" />
        </radialGradient>
      </defs>

      <!-- Fabric background -->
      <path d="${outerBorderPath}" fill="url(#fabric-grad)" />
      <path d="${outerBorderPath}" fill="url(#fabric-sheen)" />

      <!-- Outer and Inner Gold Lines -->
      <path d="${outerBorderPath}" fill="none" stroke="url(#gold-border)" stroke-width="3.2" stroke-linejoin="round" />
      <path d="${innerBorderPath}" fill="none" stroke="url(#gold-border)" stroke-width="1.8" stroke-opacity="0.85" stroke-linejoin="round" />

      <!-- Golden Wave Scroll Running Rings -->
      <g stroke="url(#gold-border)" fill="none" stroke-width="2.2" stroke-linecap="round">
        ${curls
          .map(
            (c) =>
              `<path d="${c.curlPath}" /><circle cx="${c.pipX.toFixed(1)}" cy="${c.pipY.toFixed(
                1
              )}" r="2.2" fill="url(#gold-pip)" stroke="none" />`
          )
          .join('')}
      </g>
    </svg>
  `;
}

/**
 * Creates an ultra-sharp retina Three.js CanvasTexture from the SVG string
 */
function createRetinaTexture(svgString: string, w: number, h: number, scale = 2.5): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
    URL.revokeObjectURL(url);
  };
  img.src = url;

  return texture;
}

export const HangingSigilsWebGL: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Dimensions
    const bannerWidth = 289;
    const bannerGap = 42;
    const totalSceneWidth = bannerWidth * 3 + bannerGap * 2; // ~951px
    const sceneHeight = 670;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const fov = 38;
    const aspect = totalSceneWidth / sceneHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, 1, 3000);
    // Position camera to view all three banners comfortably
    camera.position.set(0, -295, 960);
    camera.lookAt(0, -295, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setSize(totalSceneWidth, sceneHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // 2. Lights (Realistic Royal Palace Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6dd, 1.4);
    sunLight.position.set(-180, 260, 400);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xffd580, 0.6);
    rimLight.position.set(220, -100, 250);
    scene.add(rimLight);

    // Dynamic mouse point light to create subtle specular shimmer as user explores
    const mouseLight = new THREE.PointLight(0xffe899, 0.8, 600);
    mouseLight.position.set(0, -250, 150);
    scene.add(mouseLight);

    // 3. Create 3D Cloth Banners
    interface BannerMeshInfo {
      mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
      shadowMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
      originalPositions: Float32Array;
      data: SigilBannerData;
      width: number;
      height: number;
      xPos: number;
    }

    const bannerMeshes: BannerMeshInfo[] = [];

    SIGIL_3D_DATA.forEach((bannerData, i) => {
      const w = bannerWidth;
      const h = bannerData.height;
      const chevronH = bannerData.chevronH;
      const xPos = (i - 1) * (bannerWidth + bannerGap); // -331, 0, +331

      // High-density cloth geometry (32 cols, 54 rows for ultra-smooth cloth bends)
      const segmentsX = 32;
      const segmentsY = 54;
      const geo = new THREE.PlaneGeometry(w, h, segmentsX, segmentsY);
      // Anchor top at y = 0
      geo.translate(0, -h / 2, 0);

      const shadowGeo = geo.clone();

      const originalPositions = new Float32Array(geo.attributes.position.array);

      // Ultra-sharp vector texture
      const svgStr = buildBannerSVGString(bannerData, w, h, chevronH);
      const texture = createRetinaTexture(svgStr, w, h, 2.5);

      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.35,
        metalness: 0.2,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.02,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(xPos, 0, 0);
      scene.add(mesh);

      // Realistic bending drop shadow on parchment wall behind cloth
      const shadowMat = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x140508,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        alphaTest: 0.02,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(xPos + 6, -14, -28); // Offset down and right
      scene.add(shadowMesh);

      bannerMeshes.push({
        mesh,
        shadowMesh,
        originalPositions,
        data: bannerData,
        width: w,
        height: h,
        xPos,
      });
    });

    // 4. Mouse Interactivity & Wind Aerodynamics
    let mouseX = 0;
    let mouseY = -250;
    let targetMouseX = 0;
    let targetMouseY = -250;
    let isHovering = false;
    let mouseSpeed = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Convert to Three.js coordinates
      const normX = (clientX / rect.width) * 2 - 1;
      const normY = -(clientY / rect.height) * 2 + 1;

      targetMouseX = normX * (totalSceneWidth / 2);
      targetMouseY = normY * (sceneHeight / 2) - 295;

      const dx = targetMouseX - lastMouseX;
      const dy = targetMouseY - lastMouseY;
      mouseSpeed = Math.min(Math.hypot(dx, dy) * 0.1, 4.0);
      lastMouseX = targetMouseX;
      lastMouseY = targetMouseY;

      isHovering = true;
    };

    const handlePointerLeave = () => {
      isHovering = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('touchend', handlePointerLeave);

    // 5. Physics Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;
      mouseSpeed *= 0.95;

      mouseLight.position.set(mouseX, mouseY, 140);
      mouseLight.intensity = isHovering ? 1.0 : 0.4;

      // Update cloth vertices for each banner
      bannerMeshes.forEach((info) => {
        const { mesh, shadowMesh, originalPositions, data, width, height, xPos } = info;
        const pos = mesh.geometry.attributes.position;
        const shadowPos = shadowMesh.geometry.attributes.position;
        const phase = data.phaseOffset;

        // Banner-relative mouse coordinate
        const relMouseX = mouseX - xPos;
        const relMouseY = mouseY;

        for (let i = 0; i < pos.count; i++) {
          const x0 = originalPositions[i * 3];
          const y0 = originalPositions[i * 3 + 1];
          const z0 = originalPositions[i * 3 + 2];

          // Normalized vertical coordinate v in [0, 1] (0 = top pinned, 1 = bottom chevron tip)
          const v = Math.min(Math.max(-y0 / height, 0), 1);
          // Normalized horizontal coordinate u in [0, 1] (0 = left, 1 = right)
          const u = (x0 + width / 2) / width;

          // Flex factor: top edge has ZERO movement (pinned), bottom flexes gracefully
          const flexFactor = Math.pow(v, 1.35);

          // A. Natural resting 3D cloth drape curvature:
          // Heavy velvet curls slightly forward in a smooth C-drape across width
          const zDrape = Math.sin(Math.PI * u) * 11.0 * flexFactor;

          // B. Progressive traveling wind waves down the banner:
          const wave1 = Math.sin(elapsed * 2.1 - v * 4.6 + phase) * 14.0 * flexFactor;
          const wave2 = Math.sin(elapsed * 3.3 - v * 7.8 + u * 2.2 + phase * 1.4) * 5.0 * flexFactor;
          const wave3 = Math.cos(elapsed * 1.4 - v * 2.8 + u * 1.6) * 6.5 * flexFactor;

          // C. Harmonic pendulum sway (gentle lateral swing):
          const swayX = Math.sin(elapsed * 1.1 + phase) * 6.5 * flexFactor;
          const swayZ = Math.cos(elapsed * 1.1 + phase) * 8.0 * flexFactor;

          // D. Interactive mouse aerodynamic pressure field:
          const distToMouse = Math.hypot(x0 - relMouseX, y0 - relMouseY);
          let zMouse = 0;
          if (distToMouse < 220) {
            const push = Math.exp(-distToMouse * 0.016);
            zMouse = (push * (18.0 + mouseSpeed * 6.0) * Math.sin(elapsed * 4.0 - distToMouse * 0.04)) * flexFactor;
          }

          const finalX = x0 + swayX;
          const finalY = y0;
          const finalZ = z0 + zDrape + wave1 + wave2 + wave3 + swayZ + zMouse;

          pos.setXYZ(i, finalX, finalY, finalZ);
          shadowPos.setXYZ(i, finalX, finalY, finalZ);
        }

        pos.needsUpdate = true;
        mesh.geometry.computeVertexNormals();

        shadowPos.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('touchend', handlePointerLeave);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center items-center select-none overflow-visible pointer-events-auto"
      style={{
        maxWidth: '100%',
        touchAction: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-pointer filter drop-shadow-[0_15px_30px_rgba(20,5,8,0.28)]"
        style={{
          width: '951px',
          height: '670px',
        }}
      />
    </div>
  );
};
