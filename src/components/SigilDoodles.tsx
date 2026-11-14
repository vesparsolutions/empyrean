import React from 'react';

/**
 * High-definition vector SVG components for the festival doodles
 * exactly matching the user's reference image:
 * - Acoustic guitar with authentic curves, soundhole rosette, frets, tuning pegs
 * - Classical violin with f-holes, purfling, bridge, tailpiece, scroll, bow
 * - Studio DJ headphones with padded earcups, headband
 * - Drama masks (comedy & tragedy with ribbons)
 * - Artist paint palette with thumbhole, dabs, brush
 * - Ballet pointe shoes with flowing satin ribbons
 * - Classical flute / bansuri
 * - Origami paper crane
 * - Treble clef, music notes, piano keyboard strip
 * - Sparkling starbursts, leaves, festive sparkles
 */

interface DoodleProps {
  color: string;
}

export const AcousticGuitar: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Guitar body outline with authentic upper bout, waist, and lower bout */}
    <path
      d="M 65 35 
         C 45 48, 38 78, 54 102 
         C 64 116, 64 126, 52 140 
         C 30 166, 38 214, 82 216 
         C 126 214, 134 166, 112 140 
         C 100 126, 100 116, 110 102 
         C 126 78, 119 48, 99 35 
         Z"
      strokeWidth="2.4"
    />
    {/* Inner purfling line */}
    <path
      d="M 68 40 
         C 52 52, 46 76, 58 97 
         C 67 110, 67 132, 57 143 
         C 38 165, 45 206, 82 208 
         C 119 206, 126 165, 107 143 
         C 97 132, 97 110, 106 97 
         C 118 76, 112 52, 96 40 
         Z"
      strokeWidth="1"
      strokeOpacity="0.6"
    />
    {/* Soundhole with rosette ring */}
    <circle cx="82" cy="98" r="16" strokeWidth="2" />
    <circle cx="82" cy="98" r="20" strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity="0.8" />
    <circle cx="82" cy="98" r="23" strokeWidth="0.8" strokeOpacity="0.5" />
    {/* Bridge & saddle */}
    <rect x="62" y="162" width="40" height="9" rx="2" strokeWidth="1.8" />
    <line x1="66" y1="166" x2="98" y2="166" strokeWidth="1.2" />
    <circle cx="70" cy="168" r="1.2" fill={color} />
    <circle cx="75" cy="168" r="1.2" fill={color} />
    <circle cx="80" cy="168" r="1.2" fill={color} />
    <circle cx="84" cy="168" r="1.2" fill={color} />
    <circle cx="89" cy="168" r="1.2" fill={color} />
    <circle cx="94" cy="168" r="1.2" fill={color} />
    {/* Neck & Fretboard */}
    <path d="M 75 35 L 75 -55 L 89 -55 L 89 35" strokeWidth="2" />
    {/* Frets */}
    <line x1="75" y1="20" x2="89" y2="20" strokeWidth="1.2" />
    <line x1="75" y1="5" x2="89" y2="5" strokeWidth="1.2" />
    <line x1="75" y1="-10" x2="89" y2="-10" strokeWidth="1.2" />
    <line x1="75" y1="-25" x2="89" y2="-25" strokeWidth="1.2" />
    <line x1="75" y1="-40" x2="89" y2="-40" strokeWidth="1.2" />
    {/* Headstock */}
    <path d="M 73 -55 L 71 -85 C 71 -90, 93 -90, 93 -85 L 91 -55 Z" strokeWidth="2" />
    <circle cx="82" cy="-72" r="3" strokeWidth="1" />
    {/* Tuning pegs */}
    <line x1="64" y1="-80" x2="71" y2="-80" strokeWidth="2" />
    <line x1="64" y1="-70" x2="72" y2="-70" strokeWidth="2" />
    <line x1="64" y1="-60" x2="73" y2="-60" strokeWidth="2" />
    <line x1="93" y1="-80" x2="100" y2="-80" strokeWidth="2" />
    <line x1="92" y1="-70" x2="100" y2="-70" strokeWidth="2" />
    <line x1="91" y1="-60" x2="100" y2="-60" strokeWidth="2" />
    <circle cx="63" cy="-80" r="2.2" fill={color} />
    <circle cx="63" cy="-70" r="2.2" fill={color} />
    <circle cx="63" cy="-60" r="2.2" fill={color} />
    <circle cx="101" cy="-80" r="2.2" fill={color} />
    <circle cx="101" cy="-70" r="2.2" fill={color} />
    <circle cx="101" cy="-60" r="2.2" fill={color} />
    {/* Strings */}
    <line x1="77" y1="-55" x2="77" y2="162" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="79" y1="-55" x2="79" y2="162" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="81" y1="-55" x2="81" y2="162" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="83" y1="-55" x2="83" y2="162" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="85" y1="-55" x2="85" y2="162" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="87" y1="-55" x2="87" y2="162" strokeWidth="0.8" strokeOpacity="0.85" />
  </g>
);

export const ClassicalViolin: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Violin body with authentic C-bouts and corner points */}
    <path
      d="M 68 35 
         C 54 44, 48 64, 58 84 
         C 62 89, 58 92, 54 94 
         C 62 108, 62 122, 54 136 
         C 58 138, 62 141, 58 146 
         C 46 166, 52 192, 80 194 
         C 108 192, 114 166, 102 146 
         C 98 141, 102 138, 106 136 
         C 98 122, 98 108, 106 94 
         C 102 92, 98 89, 102 84 
         C 112 64, 106 44, 92 35 
         Z"
      strokeWidth="2.3"
    />
    {/* Symmetrical F-holes */}
    <path d="M 67 106 C 65 112, 69 118, 67 125 C 66 128, 63 128, 63 125" strokeWidth="1.8" />
    <circle cx="68" cy="106" r="1.4" fill={color} />
    <circle cx="63" cy="125" r="1.4" fill={color} />
    
    <path d="M 93 106 C 95 112, 91 118, 93 125 C 94 128, 97 128, 97 125" strokeWidth="1.8" />
    <circle cx="92" cy="106" r="1.4" fill={color} />
    <circle cx="97" cy="125" r="1.4" fill={color} />

    {/* Tailpiece */}
    <path d="M 75 186 L 85 186 L 83 148 L 77 148 Z" strokeWidth="1.6" fill={color} fillOpacity="0.2" />
    <circle cx="80" cy="191" r="2" fill={color} />

    {/* Fingerboard & Neck */}
    <path d="M 76 35 L 76 -30 L 84 -30 L 84 35" strokeWidth="1.8" fill={color} fillOpacity="0.15" />
    
    {/* Pegbox & Scroll */}
    <path d="M 76 -30 C 76 -46, 73 -50, 80 -55 C 87 -50, 84 -46, 84 -30" strokeWidth="1.8" />
    <path d="M 80 -55 C 80 -62, 85 -62, 85 -57 C 85 -54, 82 -54, 82 -56" strokeWidth="1.5" />
    {/* Pegs */}
    <line x1="68" y1="-44" x2="76" y2="-44" strokeWidth="1.8" />
    <line x1="68" y1="-36" x2="76" y2="-36" strokeWidth="1.8" />
    <line x1="84" y1="-42" x2="92" y2="-42" strokeWidth="1.8" />
    <line x1="84" y1="-34" x2="92" y2="-34" strokeWidth="1.8" />
    <circle cx="67" cy="-44" r="1.8" fill={color} />
    <circle cx="67" cy="-36" r="1.8" fill={color} />
    <circle cx="93" cy="-42" r="1.8" fill={color} />
    <circle cx="93" cy="-34" r="1.8" fill={color} />

    {/* Violin Bow crossing diagonally */}
    <line x1="20" y1="180" x2="140" y2="40" strokeWidth="1.6" strokeDasharray="none" />
    <line x1="22" y1="182" x2="142" y2="42" strokeWidth="0.8" strokeOpacity="0.7" />
    <rect x="18" y="176" width="6" height="8" rx="1" fill={color} />
  </g>
);

export const StudioHeadphones: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Headband double arch */}
    <path d="M 32 85 C 32 20, 108 20, 108 85" strokeWidth="3" />
    <path d="M 36 82 C 36 28, 104 28, 104 82" strokeWidth="1.4" strokeOpacity="0.6" />
    
    {/* Headband top cushion pad */}
    <path d="M 50 36 C 60 30, 80 30, 90 36" strokeWidth="5" strokeLinecap="round" />

    {/* Left Earcup */}
    <g transform="translate(18, 70)">
      {/* Outer shell */}
      <rect x="0" y="0" width="22" height="38" rx="10" strokeWidth="2.2" />
      {/* Ear cushion padding */}
      <rect x="12" y="4" width="10" height="30" rx="5" strokeWidth="1.8" fill={color} fillOpacity="0.25" />
      {/* Metal slider connector */}
      <path d="M 11 0 L 11 -8" strokeWidth="2.5" />
      <circle cx="11" cy="19" r="4" strokeWidth="1.2" />
    </g>

    {/* Right Earcup */}
    <g transform="translate(100, 70)">
      {/* Outer shell */}
      <rect x="0" y="0" width="22" height="38" rx="10" strokeWidth="2.2" />
      {/* Ear cushion padding */}
      <rect x="0" y="4" width="10" height="30" rx="5" strokeWidth="1.8" fill={color} fillOpacity="0.25" />
      {/* Metal slider connector */}
      <path d="M 11 0 L 11 -8" strokeWidth="2.5" />
      <circle cx="11" cy="19" r="4" strokeWidth="1.2" />
    </g>

    {/* Coiled Audio Cable */}
    <path
      d="M 29 108 
         C 26 122, 38 126, 32 138 
         C 28 146, 36 152, 30 160"
      strokeWidth="1.8"
    />
  </g>
);

export const DramaMasks: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Comedy Mask (Left) */}
    <g transform="translate(20, 20) rotate(-10)">
      <path d="M 15 10 C 35 6, 50 16, 50 40 C 50 62, 35 72, 15 68 C -2 64, -2 16, 15 10 Z" strokeWidth="2.2" />
      {/* Smiling eyes */}
      <path d="M 10 28 C 14 24, 20 24, 24 28" strokeWidth="2" />
      <path d="M 32 28 C 36 24, 42 24, 46 28" strokeWidth="2" />
      {/* Nose */}
      <path d="M 28 34 L 26 42 L 31 42" strokeWidth="1.6" />
      {/* Grinning open mouth */}
      <path d="M 12 48 C 28 62, 44 48, 44 48 C 38 58, 20 58, 12 48 Z" strokeWidth="1.8" fill={color} fillOpacity="0.3" />
    </g>

    {/* Tragedy Mask (Right) */}
    <g transform="translate(56, 34) rotate(14)">
      <path d="M 15 10 C 35 6, 50 16, 50 40 C 50 62, 35 72, 15 68 C -2 64, -2 16, 15 10 Z" strokeWidth="2.2" />
      {/* Sorrowful drooping eyes */}
      <path d="M 8 26 C 14 30, 22 28, 24 24" strokeWidth="2" />
      <path d="M 30 24 C 34 28, 40 30, 46 26" strokeWidth="2" />
      {/* Nose */}
      <path d="M 27 34 L 29 42 L 25 42" strokeWidth="1.6" />
      {/* Downturned mouth */}
      <path d="M 14 54 C 28 44, 42 54, 42 54" strokeWidth="2" />
    </g>
    
    {/* Intertwining ribbons */}
    <path d="M 22 75 C 32 90, 50 82, 60 96 C 68 106, 75 98, 85 108" strokeWidth="1.4" strokeDasharray="none" />
  </g>
);

export const PaintPalette: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Kidney palette */}
    <path
      d="M 30 20 
         C 60 10, 85 24, 82 55 
         C 80 75, 68 85, 52 82 
         C 44 80, 38 88, 44 96 
         C 32 95, 14 85, 12 60 
         C 10 35, 20 22, 30 20 Z"
      strokeWidth="2.2"
    />
    {/* Thumbhole */}
    <ellipse cx="44" cy="74" rx="7" ry="9" strokeWidth="1.8" />
    {/* Paint blobs */}
    <circle cx="32" cy="34" r="4.5" fill={color} fillOpacity="0.4" />
    <circle cx="52" cy="28" r="4" fill={color} fillOpacity="0.4" />
    <circle cx="68" cy="38" r="4.5" fill={color} fillOpacity="0.4" />
    <circle cx="72" cy="56" r="4" fill={color} fillOpacity="0.4" />
    <circle cx="22" cy="54" r="3.5" fill={color} fillOpacity="0.4" />

    {/* Artist Brush crossing palette */}
    <g transform="translate(10, 15) rotate(42)">
      <path d="M 40 -25 L 42 65 L 45 65 L 47 -25 Z" strokeWidth="1.6" />
      <rect x="41" y="65" width="5" height="12" rx="1" fill={color} fillOpacity="0.6" />
      <path d="M 41 77 C 41 86, 46 86, 46 77 Z" fill={color} />
    </g>
  </g>
);

export const BalletShoes: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Left shoe */}
    <g transform="translate(20, 45) rotate(-8)">
      <path d="M 12 10 C 14 2, 24 2, 26 10 L 28 42 C 28 50, 10 50, 10 42 Z" strokeWidth="2" />
      <line x1="10" y1="42" x2="28" y2="42" strokeWidth="1.8" />
      <path d="M 12 20 C 18 24, 22 24, 26 20" strokeWidth="1.4" />
    </g>
    {/* Right shoe */}
    <g transform="translate(42, 48) rotate(12)">
      <path d="M 12 10 C 14 2, 24 2, 26 10 L 28 42 C 28 50, 10 50, 10 42 Z" strokeWidth="2" />
      <line x1="10" y1="42" x2="28" y2="42" strokeWidth="1.8" />
      <path d="M 12 20 C 18 24, 22 24, 26 20" strokeWidth="1.4" />
    </g>
    {/* Flowing satin criss-cross ribbons flowing up */}
    <path d="M 33 50 C 25 35, 45 25, 35 10 C 28 0, 48 -15, 38 -30" strokeWidth="1.5" />
    <path d="M 48 52 C 55 35, 35 25, 45 10 C 52 0, 32 -15, 42 -30" strokeWidth="1.5" />
  </g>
);

export const OrigamiCrane: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Geometric folded body */}
    <polygon points="40,30 25,50 40,65 55,50" strokeWidth="2" />
    {/* Left Wing */}
    <polygon points="25,50 5,20 35,42" strokeWidth="1.8" />
    {/* Right Wing */}
    <polygon points="55,50 75,18 45,42" strokeWidth="1.8" />
    {/* Neck and Head */}
    <polyline points="40,30 46,12 52,15" strokeWidth="2" />
    {/* Tail */}
    <line x1="40" y1="65" x2="35" y2="82" strokeWidth="2" />
    {/* Center crease */}
    <line x1="40" y1="30" x2="40" y2="65" strokeWidth="1.2" strokeOpacity="0.7" />
  </g>
);

export const FluteAndClef: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Classical Flute */}
    <g transform="translate(10, 35) rotate(-22)">
      <rect x="0" y="0" width="110" height="7" rx="3" strokeWidth="2" />
      {/* Embouchure hole */}
      <ellipse cx="14" cy="3.5" rx="2" ry="1.4" fill={color} />
      {/* Finger holes */}
      <circle cx="45" cy="3.5" r="1.5" fill={color} />
      <circle cx="56" cy="3.5" r="1.5" fill={color} />
      <circle cx="67" cy="3.5" r="1.5" fill={color} />
      <circle cx="80" cy="3.5" r="1.5" fill={color} />
      <circle cx="91" cy="3.5" r="1.5" fill={color} />
      <circle cx="102" cy="3.5" r="1.5" fill={color} />
    </g>

    {/* Treble Clef */}
    <g transform="translate(68, 60)">
      <path
        d="M 20 54 
           C 20 58, 16 60, 14 58 
           C 11 55, 15 50, 17 50 
           L 17 12 
           C 17 4, 25 2, 27 8 
           C 29 16, 12 28, 12 40 
           C 12 50, 26 50, 26 38 
           C 26 30, 18 30, 18 36"
        strokeWidth="2.2"
      />
      <circle cx="14" cy="58" r="2.5" fill={color} />
    </g>
  </g>
);

export const MusicNotesCluster: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Beamed Eighth Notes */}
    <g transform="translate(10, 15)">
      <ellipse cx="10" cy="35" rx="5" ry="3.8" transform="rotate(-25 10 35)" />
      <line x1="14" y1="33" x2="14" y2="8" strokeWidth="2" />
      <ellipse cx="32" cy="27" rx="5" ry="3.8" transform="rotate(-25 32 27)" />
      <line x1="36" y1="25" x2="36" y2="0" strokeWidth="2" />
      <polygon points="13,8 37,0 37,5 13,13" stroke="none" fill={color} />
    </g>

    {/* Single Eighth Note */}
    <g transform="translate(58, 30)">
      <ellipse cx="10" cy="28" rx="4.5" ry="3.5" transform="rotate(-25 10 28)" />
      <line x1="13" y1="26" x2="13" y2="6" strokeWidth="1.8" />
      <path d="M 13 6 C 18 8, 22 14, 20 20" strokeWidth="2" fill="none" />
    </g>

    {/* Mini Piano Keys Ribbon */}
    <g transform="translate(12, 60)" fill="none">
      <rect x="0" y="0" width="60" height="18" rx="2" strokeWidth="1.6" />
      <line x1="10" y1="0" x2="10" y2="18" strokeWidth="1" />
      <line x1="20" y1="0" x2="20" y2="18" strokeWidth="1" />
      <line x1="30" y1="0" x2="30" y2="18" strokeWidth="1" />
      <line x1="40" y1="0" x2="40" y2="18" strokeWidth="1" />
      <line x1="50" y1="0" x2="50" y2="18" strokeWidth="1" />
      {/* Black keys */}
      <rect x="7" y="0" width="5" height="11" fill={color} />
      <rect x="17" y="0" width="5" height="11" fill={color} />
      <rect x="37" y="0" width="5" height="11" fill={color} />
      <rect x="47" y="0" width="5" height="11" fill={color} />
    </g>
  </g>
);

export const StarburstSparkles: React.FC<DoodleProps & { className?: string }> = ({ color, className }) => (
  <g className={className} stroke={color} fill={color}>
    {/* 4-point starburst */}
    <path d="M 25 10 Q 25 25 40 25 Q 25 25 25 40 Q 25 25 10 25 Q 25 25 25 10 Z" />
    <circle cx="25" cy="25" r="1.5" fill="#FFF" />
    
    {/* Small sparkle 1 */}
    <path d="M 60 15 Q 60 22 67 22 Q 60 22 60 29 Q 60 22 53 22 Q 60 22 60 15 Z" />
    
    {/* Small sparkle 2 */}
    <path d="M 15 65 Q 15 71 21 71 Q 15 71 15 77 Q 15 71 9 71 Q 15 71 15 65 Z" />
    
    {/* Floating tiny dots */}
    <circle cx="45" cy="18" r="1.2" />
    <circle cx="55" cy="40" r="1.5" />
    <circle cx="35" cy="55" r="1.2" />
    <circle cx="68" cy="62" r="1" />
  </g>
);

