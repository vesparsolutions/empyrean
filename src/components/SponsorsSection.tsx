import React from 'react';

export interface SponsorLogoItem {
  id: string;
  name: string;
  logo: string;
  category: string;
  logoClassName?: string;
}

interface SponsorsSectionProps {
  onRegisterClick?: (tier?: string) => void;
  onViewPartners?: () => void;
}

export const SPONSORS_LIST: SponsorLogoItem[] = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: '/sponsors/sbi.webp',
    category: 'Title Banking Partner',
    logoClassName: 'h-9 sm:h-11 md:h-12 max-w-[150px] sm:max-w-[180px] md:max-w-[200px]',
  },
  {
    id: 'cbi',
    name: 'Central Bank of India',
    logo: '/sponsors/cbi.webp',
    category: 'Associate Banking Partner',
    logoClassName: 'h-8 sm:h-10 md:h-11 max-w-[150px] sm:max-w-[180px] md:max-w-[200px]',
  },
  {
    id: 'bank-of-baroda',
    name: 'Bank of Baroda',
    logo: '/sponsors/bank-of-baroda.webp',
    category: 'Global Banking Partner',
    logoClassName: 'h-7 sm:h-9 md:h-10 max-w-[170px] sm:max-w-[200px] md:max-w-[220px]',
  },
  {
    id: 'canara-bank',
    name: 'Canara Bank',
    logo: '/sponsors/canara-bank.webp',
    category: 'Public Sector Banking Partner',
    logoClassName: 'h-8 sm:h-10 md:h-11 max-w-[150px] sm:max-w-[180px] md:max-w-[200px]',
  },
  {
    id: 'rassense',
    name: 'Rassense',
    logo: '/sponsors/rassense.webp',
    category: 'Hospitality & Culinary Partner',
    logoClassName: 'h-8 sm:h-10 md:h-11 max-w-[150px] sm:max-w-[180px] md:max-w-[200px]',
  },
  {
    id: 'jk-bank',
    name: 'J&K Bank',
    logo: '/sponsors/jk-bank.webp',
    category: 'Regional Heritage Partner',
    logoClassName: 'h-9 sm:h-10 md:h-12 max-w-[150px] sm:max-w-[180px] md:max-w-[200px]',
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    logo: '/sponsors/coca-cola.webp',
    category: 'Official Refreshment Partner',
    logoClassName: 'h-9 sm:h-11 md:h-12 max-w-[150px] sm:max-w-[180px] md:max-w-[200px]',
  },
  {
    id: 'zencabs',
    name: 'Zen Cabs',
    logo: '/sponsors/zencabs.webp',
    category: 'Official Mobility Partner',
    logoClassName: 'h-11 sm:h-13 md:h-15 max-w-[80px] sm:max-w-[95px] md:max-w-[110px]',
  },
  {
    id: 'vespar-solutions',
    name: 'Vespar Solutions',
    logo: '/sponsors/vespar-solutions.webp',
    category: 'Digital Experience Partner',
    logoClassName: 'h-10 sm:h-12 md:h-14 max-w-[100px] sm:max-w-[120px] md:max-w-[135px]',
  },
  {
    id: 'nescafe',
    name: 'Nescafé',
    logo: '/sponsors/nescafe.webp',
    category: 'Official Beverage Partner',
    logoClassName: 'h-8 sm:h-10 md:h-11 max-w-[160px] sm:max-w-[190px] md:max-w-[210px]',
  },
];

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  onViewPartners,
}) => {
  return (
    <section
      id="sponsors"
      className="relative w-full text-[#1e1b18] pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden"
      style={{
        backgroundColor: '#FAF4E8',
        backgroundImage: `
          radial-gradient(circle at 50% 25%, rgba(254, 240, 199, 0.85) 0%, transparent 60%),
          radial-gradient(circle at 50% 65%, rgba(255, 237, 213, 0.65) 0%, transparent 55%),
          linear-gradient(to bottom, #FAF4E8 0%, #FAF3E5 40%, #F6EBDA 70%, #FAF4E8 100%)
        `,
      }}
      aria-label="Our Sponsors"
    >
      {/* 1. Premium Mughal Jali & Architectural Grid Texture (warm parchment version) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045] z-0"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23854d0e' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23854d0e' stroke-width='1'/%3E%3C/svg%3E"),
            linear-gradient(to right, rgba(133, 77, 14, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(133, 77, 14, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px, 54px 54px, 54px 54px',
        }}
        aria-hidden="true"
      />

      {/* 2. Ambient Warm Golden Halo Behind Heading */}
      <div
        className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 w-[380px] sm:w-[580px] md:w-[760px] h-[300px] sm:h-[380px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(248, 193, 44, 0.18) 0%, rgba(180, 83, 9, 0.06) 50%, transparent 75%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      {/* 3. Section Header: "Our Sponsors" */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto select-none mb-8 sm:mb-12">
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#1a0f05] drop-shadow-[0_2px_12px_rgba(180,83,9,0.12)]">
          Our Sponsors
        </h2>
      </div>

      {/* 4. Single-Row Classic Logo Marquee: elegant responsive width and smooth mask */}
      <div className="relative z-10 w-full flex justify-center py-4 mb-2 sm:mb-4">
        <div
          className="relative w-[90%] sm:w-[84%] md:w-[78%] max-w-6xl mx-auto overflow-hidden py-4 sm:py-6"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
          aria-label="Festival Sponsors rotating in order"
        >
          {/* Single continuous row moving smoothly Left-to-Right */}
          <div className="animate-marquee-ltr flex items-center gap-12 sm:gap-16 md:gap-20">
            {[...SPONSORS_LIST, ...SPONSORS_LIST].map((sponsor, idx) => (
              <div
                key={`${sponsor.id}-${idx}`}
                onClick={onViewPartners}
                className="shrink-0 flex items-center justify-center h-16 sm:h-20 md:h-22 px-3 sm:px-4 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer select-none"
                title={`${sponsor.name} (${sponsor.category}) — Click to view partners`}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className={`w-auto object-contain shrink-0 filter drop-shadow-[0_2px_8px_rgba(90,40,10,0.08)] hover:drop-shadow-[0_4px_16px_rgba(180,83,9,0.20)] transition-all duration-300 hover:scale-105 ${
                    sponsor.logoClassName || 'h-9 sm:h-11 md:h-12 max-w-[150px] sm:max-w-[180px] md:max-w-[200px]'
                  }`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* 6. Subtle transition dissolve into Dark Footer */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 sm:h-20 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(7, 16, 38, 0.45) 60%, #071026 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
};
