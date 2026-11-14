import React from 'react';

interface BoxConfig {
  id: string;
  pronite: string;
  day: string;
  category: string;
  date: string;
  venue: string;
  coord: string;
  isCenter?: boolean;
}

const BOXES: BoxConfig[] = [
  {
    id: 'box-day1',
    pronite: 'PRO-NITE 01',
    day: 'DAY 01',
    category: 'HERITAGE SHOWCASE',
    date: 'FRIDAY • 6:00 PM',
    venue: 'OPEN-AIR AMPHITHEATER',
    coord: 'SEC // 01 • STAGE A',
    isCenter: false,
  },
  {
    id: 'box-day2',
    pronite: 'PRO-NITE 02',
    day: 'DAY 02',
    category: 'CELEBRITY HEADLINER',
    date: 'SATURDAY • 8:00 PM',
    venue: 'MAIN FESTIVAL GROUNDS',
    coord: 'SEC // 02 • MAIN ARENA',
    isCenter: true,
  },
  {
    id: 'box-day3',
    pronite: 'PRO-NITE 03',
    day: 'DAY 03',
    category: 'GRAND EDM FINALE',
    date: 'SUNDAY • 7:30 PM',
    venue: 'FESTIVAL LASER ARENA',
    coord: 'SEC // 03 • SOUNDSTAGE',
    isCenter: false,
  },
];

export const ArtistBoxes: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-center justify-items-center select-none">
      {BOXES.map((box) => (
        <div
          key={box.id}
          className={`relative w-full max-w-[320px] sm:max-w-[340px] group transition-all duration-500 hover:-translate-y-2.5 ${
            box.isCenter
              ? 'z-10 md:-translate-y-4 lg:-translate-y-6'
              : 'z-0 md:translate-y-4 lg:translate-y-6'
          }`}
        >
          {/* 
            ====================================================================
            SLEEK MODERN TEASER BOX
            - 1.5px metallic gold gradient border
            - Deep obsidian glassmorphic body
            - Technical festival micro-detailings & corner brackets
            - High-impact "COMING SOON" center
            ====================================================================
          */}
          <div
            className={`relative p-[1.5px] rounded-2xl transition-all duration-500 ${
              box.isCenter
                ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_20px_50px_rgba(217,119,6,0.22)] group-hover:shadow-[0_28px_60px_rgba(245,158,11,0.32)]'
                : 'bg-gradient-to-b from-amber-300/80 via-amber-500/35 to-amber-700/60 shadow-[0_14px_38px_rgba(30,10,5,0.14)] group-hover:shadow-[0_22px_48px_rgba(217,119,6,0.24)]'
            }`}
          >
            {/* Box Inner Body */}
            <div className="relative rounded-[15px] overflow-hidden bg-gradient-to-b from-[#13060a] via-[#090205] to-[#030102] aspect-[10/14] flex flex-col justify-between p-6 sm:p-7">
              
              {/* Subtle Ambient Golden Core Glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                style={{
                  backgroundImage: box.isCenter
                    ? 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.28) 0%, transparent 65%)'
                    : 'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.18) 0%, transparent 65%)',
                }}
              />

              {/* Technical Dot Grid Watermark Detailing */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: `radial-gradient(#f59e0b 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Inner Sleek Gold Hairline Border with 12px Margin */}
              <div className="absolute inset-3.5 rounded-xl border border-amber-400/20 group-hover:border-amber-400/40 transition-colors duration-500 pointer-events-none" />

              {/* 4 Minimal Corner Accent Brackets */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />

              {/* 
                ----------------------------------------------------------------
                TOP HEADER: PRONITE BADGE & COORDINATES
                ----------------------------------------------------------------
              */}
              <div className="relative z-10 flex items-center justify-between">
                {/* Pro-Nite Active Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/35 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-200 text-[9.5px] font-sub uppercase tracking-[0.24em] font-semibold">
                    {box.pronite}
                  </span>
                </div>

                {/* Day Tag */}
                <span className="text-amber-400/60 font-mono text-[9px] tracking-widest uppercase">
                  {box.coord}
                </span>
              </div>

              {/* 
                ----------------------------------------------------------------
                CENTER: COMING SOON + ICON + RADAR PULSE
                ----------------------------------------------------------------
              */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-4">
                {/* Center Royal Insignia with Subtle Glow */}
                <div className="relative w-14 h-14 rounded-full border border-amber-400/30 bg-amber-500/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-amber-400/60 transition-all duration-500 shadow-[0_0_24px_rgba(245,158,11,0.18)]">
                  <div className="absolute inset-1 rounded-full border border-amber-300/20 rotate-45" />
                  <span className="text-amber-300 text-xl font-heading">✦</span>
                </div>

                {/* High-Impact "COMING SOON" */}
                <h3 className="text-[#fffdf8] font-heading text-2xl sm:text-[26px] font-bold tracking-[0.28em] uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-tight">
                  COMING SOON
                </h3>

                {/* Status Tagline */}
                <p className="text-amber-300/80 font-sub text-[10px] tracking-[0.28em] uppercase mt-2.5 font-medium">
                  {box.category}
                </p>
              </div>

              {/* 
                ----------------------------------------------------------------
                BOTTOM FOOTER: VENUE & DAY DETAILS
                ----------------------------------------------------------------
              */}
              <div className="relative z-10 flex flex-col items-center text-center pt-2">
                {/* Sleek Golden Hairline Divider */}
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mb-3" />

                <span className="text-[#fef3c7]/85 text-[10px] font-body tracking-[0.16em] uppercase font-medium">
                  {box.date}
                </span>

                <span className="text-amber-400/70 text-[9px] font-body tracking-[0.22em] uppercase mt-0.5">
                  {box.venue}
                </span>
              </div>

              {/* Modern Light Sweep on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

