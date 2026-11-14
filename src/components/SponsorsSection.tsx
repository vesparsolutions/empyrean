import React from 'react';

interface LogoItem {
  id: string;
  name: string;
  svg: React.ReactNode;
}

interface SponsorsSectionProps {
  onRegisterClick?: (tier?: string) => void;
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = () => {
  // Pure, classic placeholder logos (single row)
  const logos: LogoItem[] = [
    {
      id: 'coca-cola',
      name: 'Coca-Cola',
      svg: (
        <div className="flex flex-col items-center">
          <span className="font-display font-black text-2xl sm:text-3xl tracking-wider text-[#fff6e0] italic hover:text-[#ef4444] transition-colors">
            Coca-Cola
          </span>
          <svg className="w-20 h-2 mt-0.5" viewBox="0 0 80 8" fill="none">
            <path
              d="M0 4 Q 20 8, 40 4 T 80 4"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 'google-cloud',
      name: 'Google Cloud',
      svg: (
        <div className="flex items-center gap-2.5">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
              fill="#4285F4"
            />
            <path
              d="M19 19H6c-2.76 0-5-2.24-5-5 0-2.52 1.87-4.59 4.31-4.92.51-.07.96-.38 1.19-.84C7.71 6.07 9.7 5 12 5c2.97 0 5.48 1.93 6.34 4.7.17.55.67.94 1.25.96C21.44 10.84 23 12.3 23 14.5c0 2.48-2.02 4.5-4 4.5z"
              fill="#fff"
              fillOpacity="0.2"
            />
          </svg>
          <span className="font-body font-bold text-base sm:text-lg text-[#fff6e0] tracking-tight hover:text-[#4285f4] transition-colors whitespace-nowrap">
            Google Cloud
          </span>
        </div>
      ),
    },
    {
      id: 'spotify',
      name: 'Spotify',
      svg: (
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" viewBox="0 0 24 24" fill="#22c55e">
            <circle cx="12" cy="12" r="11" />
            <path
              d="M16.5 15.5c-.2 0-.4-.1-.5-.2-1.8-1.1-4.1-1.3-6.8-.7-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 3-.7 5.6-.4 7.6.8.3.2.4.6.2.9-.1.3-.3.5-.6.5zm1-2.5c-.2 0-.4-.1-.6-.2-2.2-1.3-5.5-1.7-8.1-.9-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3-.9 6.6-.5 9.1 1.1.4.2.5.7.3 1.1-.1.3-.4.4-.9.4zm.1-2.6c-.3 0-.5-.1-.7-.2-2.6-1.5-6.9-1.7-9.4-.9-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 2.9-.9 7.7-.7 10.7 1.1.5.3.6.9.3 1.4-.2.3-.7.5-1.2.5z"
              fill="#071026"
            />
          </svg>
          <span className="font-body font-extrabold text-base sm:text-lg text-[#fff6e0] tracking-tight hover:text-[#22c55e] transition-colors whitespace-nowrap">
            Spotify
          </span>
        </div>
      ),
    },
    {
      id: 'sbi',
      name: 'State Bank of India',
      svg: (
        <div className="flex items-center gap-2.5">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#0fb8a2" />
            <circle cx="12" cy="10" r="3.5" fill="#071026" />
            <rect x="10.5" y="10" width="3" height="10" fill="#071026" />
          </svg>
          <span className="font-display font-bold text-base sm:text-lg text-[#fff6e0] tracking-wider hover:text-[#0fb8a2] transition-colors whitespace-nowrap">
            State Bank of India
          </span>
        </div>
      ),
    },
    {
      id: 'red-bull',
      name: 'Red Bull',
      svg: (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#facc15] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#dc2626]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z" />
            </svg>
          </div>
          <span className="font-display font-black text-base sm:text-lg text-[#fff6e0] tracking-wider hover:text-[#facc15] transition-colors italic whitespace-nowrap">
            Red Bull
          </span>
        </div>
      ),
    },
    {
      id: 'apple',
      name: 'Apple',
      svg: (
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#fff6e0] hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.8 1.1-1.92.98-3.04-.95.04-2.1.64-2.77 1.43-.59.68-1.11 1.79-.97 2.87 1.06.08 2.14-.52 2.76-1.26z" />
          </svg>
          <span className="font-body font-semibold text-base sm:text-lg text-[#fff6e0] tracking-tight hover:text-white transition-colors">
            Apple
          </span>
        </div>
      ),
    },
    {
      id: 'jk-tourism',
      name: 'J&K Tourism',
      svg: (
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#f8c12c]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 9 7 9 10C9 12 10.5 13.5 12 14C13.5 13.5 15 12 15 10C15 7 12.5 4 12 2ZM12 14V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 8C6 9 4 12 5 15C6 17 8 18 10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 8C18 9 20 12 19 15C18 17 16 18 14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-display font-bold text-sm sm:text-base text-[#f8c12c] tracking-wider whitespace-nowrap">
            J&K TOURISM
          </span>
        </div>
      ),
    },
    {
      id: 'amazon-prime',
      name: 'Amazon Prime',
      svg: (
        <div className="flex flex-col items-center">
          <span className="font-body font-black text-xl sm:text-2xl text-[#fff6e0] tracking-tight hover:text-[#00a8e1] transition-colors leading-none">
            prime
          </span>
          <svg className="w-14 h-2.5 mt-0.5" viewBox="0 0 70 12" fill="none">
            <path d="M5 4 Q 35 12, 65 4" stroke="#00a8e1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M60 2 L 67 4 L 62 8" fill="#00a8e1" />
          </svg>
        </div>
      ),
    },
    {
      id: 'nike',
      name: 'Nike',
      svg: (
        <div className="flex items-center gap-2">
          <svg className="w-10 h-5 sm:w-12 sm:h-6 text-[#fff6e0] hover:text-white transition-colors" viewBox="0 0 24 12" fill="currentColor">
            <path d="M23.5 1C17.5 4 10 7.5 3 11C1.5 11.5 0 11 0 9.5C0 8.5 1 7.5 2.5 6.5C7.5 3.5 15 1.5 23.5 1Z" />
          </svg>
          <span className="font-display font-black text-base sm:text-lg text-[#fff6e0] tracking-wider italic">
            NIKE
          </span>
        </div>
      ),
    },
    {
      id: 'samsung',
      name: 'Samsung',
      svg: (
        <div className="flex items-center">
          <span className="font-body font-black text-base sm:text-lg tracking-[0.24em] text-[#fff6e0] hover:text-[#3b82f6] transition-colors">
            SAMSUNG
          </span>
        </div>
      ),
    },
    {
      id: 'intel',
      name: 'Intel',
      svg: (
        <div className="flex items-center">
          <span className="font-body font-light text-2xl sm:text-3xl text-[#fff6e0] tracking-tighter hover:text-[#0284c7] transition-colors">
            inte<span className="font-bold text-[#0284c7]">l</span>
          </span>
        </div>
      ),
    },
    {
      id: 'sony-music',
      name: 'Sony Music',
      svg: (
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-1 h-4 sm:h-5">
            <span className="w-1 h-3 bg-[#ef4444] rounded-sm" />
            <span className="w-1 h-5 bg-[#f8c12c] rounded-sm" />
            <span className="w-1 h-4 bg-[#ef4444] rounded-sm" />
          </div>
          <span className="font-display font-bold text-sm sm:text-base text-[#fff6e0] tracking-widest hover:text-[#ef4444] transition-colors whitespace-nowrap">
            SONY MUSIC
          </span>
        </div>
      ),
    },
  ];

  return (
    <section
      id="sponsors"
      className="relative z-20 w-full bg-[#071026] text-[#f8fafc] flex flex-col items-center justify-between pt-14 sm:pt-16 md:pt-20 pb-12 select-none overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(26, 52, 107, 0.45) 0%, transparent 65%),
          radial-gradient(circle at 10% 25%, rgba(248, 193, 44, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 90% 40%, rgba(224, 36, 117, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(11, 24, 57, 0.95) 0%, #071026 100%)
        `,
      }}
    >
      {/* 1. Subtle Traditional Jali Watermark Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23f8c12c' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23f8c12c' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '54px 54px',
        }}
        aria-hidden="true"
      />

      {/* 2. Ambient Golden Halo Behind Heading */}
      <div
        className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 w-[380px] sm:w-[580px] md:w-[760px] h-[300px] sm:h-[380px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(248, 193, 44, 0.14) 0%, rgba(224, 36, 117, 0.04) 50%, transparent 75%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      {/* 3. Section Header: "Our Sponsors" */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto select-none mb-8 sm:mb-12">
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#fff6e0] drop-shadow-[0_4px_24px_rgba(248,193,44,0.30)]">
          Our Sponsors
        </h2>
      </div>

      {/* 4. Single-Row Classic Logo Marquee: 15% margin on both sides (w-[70%]), pure logos only */}
      <div className="relative z-10 w-full flex justify-center py-4 mb-4 sm:mb-8">
        <div
          className="relative w-[70%] max-w-6xl mx-auto overflow-hidden py-4"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
          aria-label="Festival Sponsors and Partners"
        >
          {/* Single continuous row moving smoothly Left-to-Right */}
          <div className="animate-marquee-ltr flex items-center gap-14 sm:gap-20 md:gap-24">
            {[...logos, ...logos].map((sponsor, idx) => (
              <div
                key={`${sponsor.id}-${idx}`}
                className="shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer select-none"
              >
                {sponsor.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
