const fs = require('fs');
const path = require('path');

const outDir = path.resolve('public/assets/tunnel');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const cards = [
  {
    id: 'pronite-star',
    title: 'Star Pronite Live',
    category: 'Mega Concert',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#070b1e', bg2: '#380c2e', accent1: '#f43f5e', accent2: '#f59e0b', glow: '#fb7185' },
    iconType: 'mic',
  },
  {
    id: 'edm-carnival',
    title: 'Sunburn Campus EDM',
    category: 'DJ & Laser Night',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#061026', bg2: '#0b2e3e', accent1: '#06b6d4', accent2: '#a855f7', glow: '#22d3ee' },
    iconType: 'waves',
  },
  {
    id: 'battle-bands',
    title: 'Decibel Rock Clash',
    category: 'Battle of the Bands',
    aspect: 'square',
    w: 500,
    h: 500,
    theme: { bg1: '#140c1a', bg2: '#4a1525', accent1: '#f97316', accent2: '#e11d48', glow: '#fb923c' },
    iconType: 'guitar',
  },
  {
    id: 'vogue-runway',
    title: 'Couture & Vogue',
    category: 'Fashion Runway',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#0a0d1a', bg2: '#20183b', accent1: '#c084fc', accent2: '#fbbf24', glow: '#e879f9' },
    iconType: 'star',
  },
  {
    id: 'nukkad-natak',
    title: 'Awaaz: Street Theatre',
    category: 'Dramatic Arts',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#180a0a', bg2: '#3b1212', accent1: '#ef4444', accent2: '#eab308', glow: '#f87171' },
    iconType: 'mask',
  },
  {
    id: 'sufi-fusion',
    title: 'Sufi & Classical Strings',
    category: 'Fusion Night',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#07161b', bg2: '#133535', accent1: '#10b981', accent2: '#f59e0b', glow: '#34d399' },
    iconType: 'mandala',
  },
  {
    id: 'hiphop-cypher',
    title: 'Street Cypher Battle',
    category: 'Urban Dance',
    aspect: 'square',
    w: 500,
    h: 500,
    theme: { bg1: '#0d1117', bg2: '#261b47', accent1: '#8b5cf6', accent2: '#ec4899', glow: '#a78bfa' },
    iconType: 'dancer',
  },
  {
    id: 'esports-grand-finals',
    title: 'Cyber Arena Finals',
    category: 'E-Sports Tourney',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#030b14', bg2: '#08253b', accent1: '#0284c7', accent2: '#38bdf8', glow: '#38bdf8' },
    iconType: 'gamepad',
  },
  {
    id: 'kashmiri-folk-harmony',
    title: 'Rouf & Pahadi Melody',
    category: 'Jammu & Kashmir Heritage',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#0d140e', bg2: '#23371f', accent1: '#84cc16', accent2: '#eab308', glow: '#a3e635' },
    iconType: 'lotus',
  },
  {
    id: 'drone-aerial-spectacle',
    title: 'Constellation Drone Sky',
    category: 'Aero Lights Show',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#050a18', bg2: '#161947', accent1: '#6366f1', accent2: '#60a5fa', glow: '#818cf8' },
    iconType: 'sparks',
  },
  {
    id: 'standup-comedy-club',
    title: 'Laughter Riot Pronite',
    category: 'Comedy Club',
    aspect: 'square',
    w: 500,
    h: 500,
    theme: { bg1: '#1a1005', bg2: '#3d2508', accent1: '#f59e0b', accent2: '#fbbf24', glow: '#fbbf24' },
    iconType: 'mic',
  },
  {
    id: 'graffiti-street-mural',
    title: 'Kaleidoscope Murals',
    category: 'Fine Arts Live',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#120a1c', bg2: '#33123d', accent1: '#d946ef', accent2: '#06b6d4', glow: '#e879f9' },
    iconType: 'palette',
  },
  {
    id: 'acoustic-unplugged',
    title: 'Amphitheatre Unplugged',
    category: 'Acoustic Sunset',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#160d08', bg2: '#381c10', accent1: '#ea580c', accent2: '#fbbf24', glow: '#f97316' },
    iconType: 'guitar',
  },
  {
    id: 'neon-silent-disco',
    title: 'Neon Silent Disco',
    category: 'Midnight Rave',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#0b0818', bg2: '#1b1240', accent1: '#a855f7', accent2: '#06b6d4', glow: '#c084fc' },
    iconType: 'waves',
  },
  {
    id: 'poetry-slam-stage',
    title: 'Nazm: Moonlight Poetry',
    category: 'Literary Arts',
    aspect: 'square',
    w: 500,
    h: 500,
    theme: { bg1: '#0e0e1a', bg2: '#1b1c3b', accent1: '#818cf8', accent2: '#c084fc', glow: '#a5b4fc' },
    iconType: 'feather',
  },
  {
    id: 'film-fest-screening',
    title: 'Celluloid Frames',
    category: 'Short Film Showcase',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#070b14', bg2: '#10223b', accent1: '#38bdf8', accent2: '#94a3b8', glow: '#7dd3fc' },
    iconType: 'camera',
  },
  {
    id: 'pyro-fire-show',
    title: 'Ignite: Pyrotechnics',
    category: 'Festival Finale',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#1f0907', bg2: '#47160c', accent1: '#dc2626', accent2: '#f59e0b', glow: '#ef4444' },
    iconType: 'fire',
  },
  {
    id: 'quiz-conclave',
    title: 'Cerebrum: National Quiz',
    category: 'Intellectual Fest',
    aspect: 'square',
    w: 500,
    h: 500,
    theme: { bg1: '#051119', bg2: '#0b2938', accent1: '#0ea5e9', accent2: '#10b981', glow: '#38bdf8' },
    iconType: 'brain',
  },
  {
    id: 'choreo-night',
    title: 'Natraj: Choreography',
    category: 'Dance Championship',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#13081e', bg2: '#2e1247', accent1: '#c026d3', accent2: '#f43f5e', glow: '#e879f9' },
    iconType: 'dancer',
  },
  {
    id: 'sitar-ensemble',
    title: 'Raga Reimagined',
    category: 'Hindustani Classical',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#120d04', bg2: '#2e210a', accent1: '#d97706', accent2: '#fcd34d', glow: '#fbbf24' },
    iconType: 'mandala',
  },
  {
    id: 'jammu-culture-pavilion',
    title: 'Dogra Heritage & Crafts',
    category: 'Cultural Exhibition',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#170c0c', bg2: '#3d1c1a', accent1: '#b91c1c', accent2: '#f59e0b', glow: '#ef4444' },
    iconType: 'lotus',
  },
  {
    id: 'carnival-parade',
    title: 'Empyrean Carnival Parade',
    category: 'Campus Parade',
    aspect: 'square',
    w: 500,
    h: 500,
    theme: { bg1: '#06131c', bg2: '#123145', accent1: '#14b8a6', accent2: '#f59e0b', glow: '#2dd4bf' },
    iconType: 'mask',
  },
  {
    id: 'band-solos',
    title: 'Lead Riffs & Drum Solos',
    category: 'Rock Championship',
    aspect: 'portrait',
    w: 450,
    h: 600,
    theme: { bg1: '#0d091a', bg2: '#241445', accent1: '#9333ea', accent2: '#ec4899', glow: '#a855f7' },
    iconType: 'guitar',
  },
  {
    id: 'laser-mapping-spectacle',
    title: 'Architectural 3D Projection',
    category: 'Visual Showcase',
    aspect: 'landscape',
    w: 600,
    h: 450,
    theme: { bg1: '#040d1f', bg2: '#0b264e', accent1: '#2563eb', accent2: '#06b6d4', glow: '#60a5fa' },
    iconType: 'waves',
  },
];

function generateSvg(card) {
  const { w, h, title, category, theme, id } = card;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="grad-main-${id}" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="${theme.bg2}" />
      <stop offset="85%" stop-color="${theme.bg1}" />
      <stop offset="100%" stop-color="#050a18" />
    </radialGradient>
    <linearGradient id="grad-accent-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent1}" />
      <stop offset="100%" stop-color="${theme.accent2}" />
    </linearGradient>
    <linearGradient id="grad-overlay-${id}" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#050a18" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#050a18" stop-opacity="0.4" />
      <stop offset="100%" stop-color="transparent" />
    </linearGradient>
  </defs>

  <!-- Background base -->
  <rect width="${w}" height="${h}" fill="url(#grad-main-${id})" />

  <!-- Ambient Stage Light Beams -->
  <g opacity="0.4">
    <polygon points="${w * 0.1},0 ${w * 0.4},0 ${w * 0.8},${h} ${w * 0.3},${h}" fill="url(#grad-accent-${id})" opacity="0.4" />
    <polygon points="${w * 0.9},0 ${w * 0.6},0 ${w * 0.2},${h} ${w * 0.7},${h}" fill="${theme.accent2}" opacity="0.3" />
  </g>

  <!-- Dynamic concert energy particles & rings -->
  <g opacity="0.65">
    <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${w * 0.28}" fill="none" stroke="${theme.accent1}" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.5" />
    <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${w * 0.38}" fill="none" stroke="${theme.accent2}" stroke-width="1" stroke-dasharray="3 12" opacity="0.35" />
    <circle cx="${w * 0.2}" cy="${h * 0.25}" r="3" fill="#ffffff" opacity="0.8" />
    <circle cx="${w * 0.82}" cy="${h * 0.3}" r="4" fill="${theme.accent2}" opacity="0.9" />
    <circle cx="${w * 0.75}" cy="${h * 0.18}" r="2.5" fill="#ffffff" opacity="0.7" />
    <circle cx="${w * 0.3}" cy="${h * 0.55}" r="3.5" fill="${theme.accent1}" opacity="0.85" />
    <circle cx="${w * 0.15}" cy="${h * 0.48}" r="2" fill="${theme.glow}" opacity="0.75" />
    <circle cx="${w * 0.88}" cy="${h * 0.52}" r="3" fill="#ffffff" opacity="0.8" />
  </g>

  <!-- Stage Graphic / Silhouette Iconography -->
  <g transform="translate(${w * 0.5}, ${h * 0.42})" opacity="0.9">
    <path d="M 0 -36 L 9 -12 L 35 -12 L 14 4 L 22 28 L 0 14 L -22 28 L -14 4 L -35 -12 L -9 -12 Z" fill="url(#grad-accent-${id})" />
    <circle cx="0" cy="0" r="9" fill="#ffffff" />
  </g>

  <!-- Stage Spotlights from bottom -->
  <path d="M ${w * 0.05} ${h} L ${w * 0.35} ${h * 0.35} L ${w * 0.65} ${h * 0.35} L ${w * 0.95} ${h} Z" fill="url(#grad-accent-${id})" opacity="0.1" />

  <!-- Bottom Dark Vignette Overlay -->
  <rect width="${w}" height="${h}" fill="url(#grad-overlay-${id})" />

  <!-- Empyrean Fest Watermark Pill -->
  <g transform="translate(20, 22)">
    <rect width="108" height="24" rx="12" fill="#071026" fill-opacity="0.85" stroke="#f8c12c" stroke-opacity="0.45" stroke-width="1" />
    <text x="54" y="16" fill="#f8c12c" font-family="'Marcellus', serif, sans-serif" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="1.5">EMPYREAN</text>
  </g>

  <!-- Card Category Badge & Title -->
  <g transform="translate(22, ${h - 24})">
    <text x="0" y="-30" fill="${theme.accent2}" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" text-transform="uppercase" letter-spacing="2" opacity="0.95">✦ ${category}</text>
    <text x="0" y="-8" fill="#ffffff" font-family="'Cinzel', serif, sans-serif" font-size="${w > 500 ? 20 : 17}" font-weight="700" letter-spacing="0.5">${title}</text>
  </g>

  <!-- Elegant Inner Border -->
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="#f8c12c" stroke-opacity="0.22" stroke-width="1" rx="8" />
  <rect x="5" y="5" width="${w - 10}" height="${h - 10}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" rx="6" />
</svg>`;
}

cards.forEach((card) => {
  const svg = generateSvg(card);
  fs.writeFileSync(path.join(outDir, `${card.id}.svg`), svg, 'utf-8');
});

console.log(`Generated ${cards.length} SVG festival photograph placeholders in ${outDir}`);

