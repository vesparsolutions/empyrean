import React, { useId, useMemo, useState } from 'react';

export interface SigilBannerData {
  id: string;
  name: 'crimson' | 'sapphire' | 'amber';
  topColor: string;
  midColor: string;
  bottomColor: string;
}

export const SIGIL_BANNERS_DATA: SigilBannerData[] = [
  {
    id: 'sigil-crimson',
    name: 'crimson',
    topColor: '#580A18',
    midColor: '#831126',
    bottomColor: '#2D040A',
  },
  {
    id: 'sigil-sapphire',
    name: 'sapphire',
    topColor: '#0E295E',
    midColor: '#1B4791',
    bottomColor: '#081736',
  },
  {
    id: 'sigil-amber',
    name: 'amber',
    topColor: '#5C3005',
    midColor: '#8C4D0A',
    bottomColor: '#2C1602',
  },
];

/**
 * Calculates continuous wave scroll coordinates around the banner border:
 * Left edge -> Left chevron point -> Right chevron point -> Right edge.
 */
function useBannerBorderCurls(w: number, h: number, chevronH: number, step = 25) {
  return useMemo(() => {
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
      cx: number;
      cy: number;
      angle: number;
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
      // Normal vector pointing inward into banner
      const nx = -uy;
      const ny = ux;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      for (let i = 0; i < count; i++) {
        const t = ((i + 0.5) * step) / dist;
        const cx = start.x + dx * t;
        const cy = start.y + dy * t;

        const r = 7.5;
        const pStartX = cx - ux * r;
        const pStartY = cy - uy * r;
        const pEndX = cx + nx * 2;
        const pEndY = cy + ny * 2;

        const curlPath = `
          M ${pStartX} ${pStartY} 
          A ${r} ${r} 0 1 1 ${cx + ux * (r * 0.7)} ${cy + uy * (r * 0.7)} 
          A ${r * 0.55} ${r * 0.55} 0 0 1 ${pEndX} ${pEndY}
        `;

        curls.push({
          cx,
          cy,
          angle,
          curlPath,
          pipX: pEndX,
          pipY: pEndY,
        });
      }
    });

    return curls;
  }, [w, h, chevronH, step]);
}

interface SingleBannerProps {
  data: SigilBannerData;
  index: number;
}

export const SingleHangingSigil: React.FC<SingleBannerProps> = ({ data, index: _index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const uid = useId();

  // Banner proportions: Width reduced by 15% (340px * 0.85 = 289px)
  const isCorner = data.name === 'crimson' || data.name === 'amber';
  const width = 289;
  const height = isCorner ? 598 : 544;
  const chevronH = isCorner ? 60 : 58;

  const curls = useBannerBorderCurls(width, height, chevronH, 25);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 5, y: -y * 4 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Outer SVG path for the banner polygon with chevron bottom
  const outerBorderPath = `
    M 0 0 
    L 0 ${height - chevronH} 
    L ${width / 2} ${height} 
    L ${width} ${height - chevronH} 
    L ${width} 0 
    Z
  `;

  // Inner inset border line (inset by 24px)
  const innerInset = 24;
  const innerBorderPath = `
    M ${innerInset} 0 
    L ${innerInset} ${height - chevronH - 8} 
    L ${width / 2} ${height - innerInset} 
    L ${width - innerInset} ${height - chevronH - 8} 
    L ${width - innerInset} 0
  `;

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-700 ease-out select-none shrink-0 snap-center
        ${data.name === 'sapphire' ? 'z-20 sigil-sway-sapphire' : data.name === 'crimson' ? 'z-10 sigil-sway-crimson' : 'z-10 sigil-sway-amber'}
      `}
      style={{
        width: `${width}px`,
        minWidth: `${width}px`,
        maxWidth: `${width}px`,
        flex: `0 0 ${width}px`,
        transform: `
          perspective(1200px) 
          rotateY(${tilt.x}deg) 
          rotateX(${tilt.y}deg) 
          ${isHovered ? 'scale(1.025) translateY(4px)' : 'scale(1) translateY(0)'}
        `,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        A. Deep Royal Drop Shadow (Casting onto parchment wall behind)
      */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          filter: isHovered
            ? `drop-shadow(0 32px 42px rgba(20, 4, 8, 0.52)) drop-shadow(0 10px 16px rgba(0, 0, 0, 0.38))`
            : `drop-shadow(0 22px 30px rgba(25, 6, 10, 0.35)) drop-shadow(0 6px 10px rgba(10, 2, 4, 0.22))`,
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="w-full h-auto overflow-visible"
        >
          <path d={outerBorderPath} fill="#000" fillOpacity="0.25" />
        </svg>
      </div>

      {/* 
        B. The Royal Hanging Banner SVG:
        - Plain Sigil: Pure background color gradient with subtle velvet sheen
        - Outer & inner golden line border
        - Continuous running spiral wave curls / golden rings
        - ZERO emblems, ZERO text, ZERO badges — 100% clean, plain royal sigil
      */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="w-full h-auto overflow-hidden block"
        style={{
          clipPath: `polygon(0% 0%, 100% 0%, 100% calc(100% - ${chevronH}px), 50% 100%, 0% calc(100% - ${chevronH}px))`,
        }}
      >
        <defs>
          {/* 1. Fabric Vertical Gradient (Deep, rich background color) */}
          <linearGradient id={`fabric-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={data.topColor} />
            <stop offset="35%" stopColor={data.midColor} />
            <stop offset="75%" stopColor={data.midColor} />
            <stop offset="100%" stopColor={data.bottomColor} />
          </linearGradient>

          {/* 2. Fabric Sheen (Subtle velvet highlight along the vertical axis) */}
          <linearGradient id={`fabric-sheen-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
            <stop offset="25%" stopColor="#FFF" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#FFF" stopOpacity="0.14" />
            <stop offset="75%" stopColor="#FFF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
          </linearGradient>

          {/* 3. Metallic Gold Gradient for Scroll Border */}
          <linearGradient id={`gold-border-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="28%" stopColor="#F59E0B" />
            <stop offset="55%" stopColor="#D97706" />
            <stop offset="82%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* 4. Gold Pip Radial Gradient */}
          <radialGradient id={`gold-pip-${uid}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
        </defs>

        {/* --- Pure Fabric Background (Clean, rich color) --- */}
        <path d={outerBorderPath} fill={`url(#fabric-grad-${uid})`} />
        {/* Velvet sheen overlay */}
        <path d={outerBorderPath} fill={`url(#fabric-sheen-${uid})`} />

        {/* 
          ====================================================================
          AUTHENTIC GOLDEN WAVE SCROLL BORDER RIBBON (LINES & RUNNING RINGS)
          ====================================================================
        */}
        {/* 1. Outer Solid Gold Border Line */}
        <path
          d={outerBorderPath}
          fill="none"
          stroke={`url(#gold-border-${uid})`}
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* 2. Inner Inset Gold Border Line */}
        <path
          d={innerBorderPath}
          fill="none"
          stroke={`url(#gold-border-${uid})`}
          strokeWidth="1.8"
          strokeOpacity="0.85"
          strokeLinejoin="round"
        />

        {/* 3. The Continuous Running Spiral Wave Curls (Golden Rings) */}
        <g stroke={`url(#gold-border-${uid})`} fill="none" strokeWidth="2.2" strokeLinecap="round">
          {curls.map((curl, i) => (
            <React.Fragment key={`curl-${i}`}>
              <path d={curl.curlPath} />
              <circle cx={curl.pipX} cy={curl.pipY} r="2.2" fill={`url(#gold-pip-${uid})`} stroke="none" />
            </React.Fragment>
          ))}
        </g>
      </svg>
    </div>
  );
};

/**
 * Three Grand Hanging Sigil Banners Section Component:
 * - Plain Sigils: Clean, royal fabric colors with golden lines and rings outline
 * - No text, no emblems, no badges
 * - Arranged horizontally side by side
 * - Cleanly situated BELOW the "Artists" heading
 * - Center banner (Royal Sapphire Blue) elevated as the headliner showcase
 * - Flanked by Royal Crimson (Left) and Royal Amber (Right)
 */
export const HangingSigilBanners: React.FC = () => {
  return (
    <div className="relative w-full flex flex-row overflow-x-auto md:overflow-visible snap-x snap-mandatory items-start justify-start md:justify-center gap-5 sm:gap-7 lg:gap-10 xl:gap-12 py-4 px-4 md:px-6 scrollbar-none">
      {SIGIL_BANNERS_DATA.map((banner, index) => (
        <SingleHangingSigil key={banner.id} data={banner} index={index} />
      ))}
    </div>
  );
};
