import React, { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { FestivalFooter } from './FestivalFooter';

export interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  lead: string;
  description: string;
  website?: string;
  logoClassName?: string;
}

export const PARTNERS_DATA: PartnerItem[] = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: '/sponsors/sbi.webp',
    lead: 'The nation’s financial cornerstone, fueling ambition and youth leadership.',
    description:
      'India’s largest banking institution with two centuries of public trust and nationwide reach. Partnering with Empyrean 2026, SBI empowers the young management visionaries and student innovators of IIM Jammu to shape the future of Indian enterprise.',
    website: 'https://sbi.co.in',
    logoClassName: 'max-h-20 sm:max-h-26 md:max-h-30 max-w-[85%]',
  },
  {
    id: 'cbi',
    name: 'Central Bank of India',
    logo: '/sponsors/cbi.webp',
    lead: 'A historic Swadeshi pioneer dedicated to nation-building, integrity, and scholarship.',
    description:
      'Founded in 1911 as India’s first truly indigenous commercial bank. Central Bank of India joins Empyrean 2026 to foster principled commerce, financial wisdom, and academic excellence among future corporate leaders.',
    website: 'https://centralbankofindia.co.in',
    // 3x Size Multiplier: Expands fully across plaque with bold presence
    logoClassName: 'max-h-44 sm:max-h-52 md:max-h-60 max-w-[98%] w-auto scale-[1.3] sm:scale-[1.4] md:scale-[1.5]',
  },
  {
    id: 'bank-of-baroda',
    name: 'Bank of Baroda',
    logo: '/sponsors/bank-of-baroda.webp',
    lead: 'Royal visionary roots paired with world-class international horizons.',
    description:
      'Established in 1908 by Maharaja Sayajirao Gaekwad III, Bank of Baroda spans 17 nations. Through digital platforms like bob World, it inspires IIM Jammu delegates to bridge grassroots innovation with global finance.',
    website: 'https://bankofbaroda.in',
    // 2x Size Multiplier: Wide horizontal presence spanning plaque
    logoClassName: 'max-h-36 sm:max-h-44 md:max-h-48 max-w-[98%] w-auto scale-[1.15] sm:scale-[1.25] md:scale-[1.3]',
  },
  {
    id: 'canara-bank',
    name: 'Canara Bank',
    logo: '/sponsors/canara-bank.webp',
    lead: 'A century-long commitment to serving community, knowledge, and youth enterprise.',
    description:
      'Built upon the philanthropic vision of Ammembal Subba Rao Pai in 1906. Canara Bank partners with Empyrean to champion collegiate innovation, research, and inclusive economic growth.',
    website: 'https://canarabank.com',
    // 3x Size Multiplier: Amplified to fill plaque with prominent mark and typography
    logoClassName: 'max-h-44 sm:max-h-52 md:max-h-60 max-w-[98%] w-auto scale-[1.3] sm:scale-[1.4] md:scale-[1.5]',
  },
  {
    id: 'rassense',
    name: 'Rassense',
    logo: '/sponsors/rassense.webp',
    lead: 'Crafting world-class culinary experiences with uncompromising hygiene and warmth.',
    description:
      'India’s premier institutional food services and hospitality innovator. Rassense powers Empyrean 2026 with exceptional gastronomy, catering to thousands of festival attendees, celebrity artists, and delegates with royal warmth.',
    website: 'https://rassense.com',
    // 3x Size Multiplier: Rich prominent presence filling plaque
    logoClassName: 'max-h-44 sm:max-h-52 md:max-h-60 max-w-[98%] w-auto scale-[1.3] sm:scale-[1.4] md:scale-[1.5]',
  },
  {
    id: 'jk-bank',
    name: 'J&K Bank',
    logo: '/sponsors/jk-bank.webp',
    lead: 'The financial heartbeat and cultural pride of Jammu, Kashmir, and Ladakh.',
    description:
      'Incepted in 1938 under royal charter, J&K Bank anchors regional prosperity. Welcoming delegates to the City of Temples, the bank celebrates the confluence of Himalayan heritage with modern management excellence at IIM Jammu.',
    website: 'https://jkbank.com',
    logoClassName: 'max-h-20 sm:max-h-26 md:max-h-30 max-w-[85%]',
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    logo: '/sponsors/coca-cola.webp',
    lead: 'Sparking real magic, youth optimism, and unstoppable festival vibrancy.',
    description:
      'A universal symbol of music, joy, and celebration for over 135 years. Coca-Cola electrifies Empyrean 2026, keeping attendees refreshed across intense competitions, cultural showdowns, and high-octane star nights.',
    website: 'https://coca-cola.com',
    logoClassName: 'max-h-20 sm:max-h-26 md:max-h-30 max-w-[85%]',
  },
  {
    id: 'zencabs',
    name: 'Zen Cabs',
    logo: '/sponsors/zencabs.webp',
    lead: 'Dependable regional mobility ensuring safe, seamless, round-the-clock connectivity.',
    description:
      'Jammu’s trusted fleet service, delivering punctual transit across airports, railways, and highway hubs. Zen Cabs connects artists, jury members, and university delegations directly to the scenic IIM Jammu Jagti campus.',
    // 2x Size Multiplier: Tall squarish logo fills plaque vertically & horizontally
    logoClassName: 'max-h-48 sm:max-h-56 md:max-h-64 h-full max-w-[90%] scale-[1.2] sm:scale-[1.3] md:scale-[1.4]',
  },
  {
    id: 'vespar-solutions',
    name: 'Vespar Solutions',
    logo: '/sponsors/vespar-solutions.webp',
    lead: 'Architecting high-performance digital experiences, bespoke AI, and modern web platforms.',
    description:
      'A specialized digital engineering studio crafting fluid web architectures and intelligent systems. Vespar powers Empyrean’s interactive digital presence, bringing the royal splendour of the festival to screens worldwide.',
    website: 'https://vesparsolutions.in',
    // 2x Size Multiplier: Bold squarish logo fills plaque with high clarity
    logoClassName: 'max-h-48 sm:max-h-56 md:max-h-64 h-full max-w-[90%] scale-[1.2] sm:scale-[1.3] md:scale-[1.4]',
  },
  {
    id: 'nescafe',
    name: 'Nescafé',
    logo: '/sponsors/nescafe.webp',
    lead: 'Fueling early-morning breakthroughs, midnight strategy, and spirited conversation.',
    description:
      'Crafted from hand-selected beans with rich artisanal aroma. Nescafé keeps IIM Jammu’s sharpest minds and headline performers energized across late-night case preps, dawn sound checks, and spirited festival showdowns.',
    website: 'https://nescafe.com',
    // 1.5x Size Multiplier: Harmonious enlarged presence
    logoClassName: 'max-h-32 sm:max-h-40 md:max-h-44 max-w-[96%] scale-[1.1] sm:scale-[1.18] md:scale-[1.25]',
  },
];

interface PartnersPageProps {
  onBackToHome?: () => void;
  onRegisterClick?: (tier?: string) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({
  onRegisterClick,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="relative min-h-screen text-[#1e1b18] font-body selection:bg-[#991b1b] selection:text-[#FAF5EB] overflow-x-hidden"
      style={{
        backgroundColor: '#FAF4E8',
        backgroundImage: `
          radial-gradient(circle at 50% 15%, rgba(254, 240, 199, 0.85) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(255, 237, 213, 0.65) 0%, transparent 55%),
          radial-gradient(circle at 50% 85%, rgba(254, 243, 199, 0.50) 0%, transparent 55%),
          linear-gradient(to bottom, #FFFDF9 0%, #FAF3E5 22%, #F6EBDA 55%, #FAF3E5 80%, #FAF4E8 100%)
        `,
      }}
    >
      {/* 
        ========================================================================
        1. ROYAL PARCHMENT & SIGNATURE JALI GRID TEXTURE
        (Identical to the signature premium background texture of the Artists section)
        ========================================================================
      */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.055] z-0"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23854d0e' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23854d0e' stroke-width='1'/%3E%3C/svg%3E"),
            linear-gradient(to right, rgba(133, 77, 14, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(133, 77, 14, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px, 54px 54px, 54px 54px',
        }}
        aria-hidden="true"
      />

      {/* Atmospheric warm ambient sun-wash */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] pointer-events-none z-0 rounded-full blur-3xl opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(248, 193, 44, 0.22) 0%, rgba(180, 83, 9, 0.06) 50%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* 
        ========================================================================
        2. EDITORIAL HERO HEADER
        ========================================================================
      */}
      <header className="relative z-10 pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        {/* Display Title */}
        <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#1a0f05] mb-4">
          Our Partners
        </h1>

        {/* Editorial Subtitle */}
        <p className="font-editorial italic text-xl sm:text-2xl md:text-3xl text-[#991b1b] max-w-2xl mx-auto leading-snug">
          The visionary organizations and heritage brands powering Empyrean 2026.
        </p>
      </header>

      {/* 
        ========================================================================
        3. SHOWCASE LIST: ALTERNATING ZIG-ZAG LAYOUT
        Odd rows (0, 2, 4...): Big Logo on Left, Narrative on Right
        Even rows (1, 3, 5...): Narrative on Left, Big Logo on Right
        ========================================================================
      */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 sm:pb-32 space-y-16 sm:space-y-24">
        {PARTNERS_DATA.map((partner, index) => {
          const isEven = index % 2 !== 0; // Even 1-based: Narrative on Left, Logo on Right

          return (
            <article
              key={partner.id}
              id={`partner-${partner.id}`}
              className="relative"
            >
              <div
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-8 lg:gap-14 xl:gap-16`}
              >
                {/* 
                  A. BIG LOGO COLUMN
                  Spacious, elegant plaque that lets the logo breathe and fill the frame
                */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[16/9] min-h-[200px] sm:min-h-[250px] md:min-h-[280px] bg-white/85 hover:bg-white rounded-2xl sm:rounded-3xl border border-[#b45309]/15 hover:border-[#b45309]/35 shadow-[0_8px_30px_rgba(90,40,10,0.04)] hover:shadow-[0_16px_40px_rgba(90,40,10,0.09)] transition-all duration-300 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden group cursor-pointer">
                    {/* Subtle warm hover aura */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(248, 193, 44, 0.14) 0%, transparent 70%)',
                      }}
                    />

                    {/* Big Logo Image with Smooth Hover Zoom */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className={`w-auto object-contain transition-all duration-300 ${
                          partner.logoClassName || 'max-h-24 sm:max-h-32 md:max-h-36 max-w-[90%]'
                        }`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* 
                  B. EDITORIAL TEXT COLUMN
                  Clean, punchy headline, lead, and description without any numbers or tag clutter
                */}
                <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                  {/* Partner Name Heading */}
                  <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-[#1a0f05] tracking-tight mb-2">
                    {partner.name}
                  </h2>

                  {/* Poetic Italic Lead in Instrument Serif */}
                  <p className="font-editorial italic text-lg sm:text-xl md:text-2xl text-[#991b1b] leading-snug mb-3">
                    {partner.lead}
                  </p>

                  {/* Short & Concise Narrative (2 Sentences) */}
                  <p className="font-body text-sm sm:text-base text-[#473e35] leading-relaxed mb-4">
                    {partner.description}
                  </p>

                  {/* Clean Website Link */}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sub font-semibold tracking-wider uppercase text-[#b45309] hover:text-[#991b1b] transition-colors cursor-pointer group mt-1"
                    >
                      <span className="underline underline-offset-4 decoration-[#b45309]/30 group-hover:decoration-[#991b1b]">
                        Visit Official Website
                      </span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>

              {/* Delicate Separator between items */}
              {index < PARTNERS_DATA.length - 1 && (
                <div className="pt-16 sm:pt-24 flex items-center justify-center">
                  <span className="w-16 sm:w-24 h-[1px] bg-[#b45309]/20" />
                </div>
              )}
            </article>
          );
        })}
      </main>

      {/* 
        ========================================================================
        4. FESTIVAL FOOTER
        ========================================================================
      */}
      <FestivalFooter onRegisterClick={onRegisterClick} />
    </div>
  );
};
