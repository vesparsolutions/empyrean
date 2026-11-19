import React from 'react';

interface EventsSectionProps {
  onRegisterClick?: (tier?: string) => void;
}

const EVENT_CARDS = [
  {
    id: 'cultural',
    title: 'Cultural',
    image: '/cultural.png',
    alt: 'Empyrean Cultural Events - Music, Dance & Dramatics',
  },
  {
    id: 'sports',
    title: 'Sports',
    image: '/sports.png',
    alt: 'Empyrean Sports Events - Athletics, Basketball & Field Championships',
  },
  {
    id: 'management',
    title: 'Management',
    image: '/mgmt.png',
    alt: 'Empyrean Management Events - Strategy, Leadership & Case Competitions',
  },
];

export const EventsSection: React.FC<EventsSectionProps> = ({ onRegisterClick }) => {
  return (
    <section
      id="events"
      className="relative w-full text-[#f8fafc] overflow-hidden select-none"
      style={{
        backgroundColor: '#071026',
        backgroundImage: `
          radial-gradient(circle at 50% 35%, rgba(11, 24, 57, 0.85) 0%, transparent 70%),
          radial-gradient(circle at 15% 75%, rgba(224, 36, 117, 0.05) 0%, transparent 55%),
          radial-gradient(circle at 85% 75%, rgba(248, 193, 44, 0.05) 0%, transparent 55%)
        `,
      }}
      aria-label="Events"
    >
      {/* 1. Indian Jali Grid Texture (matching Artists section foothill background) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045] z-0"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23f8c12c' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23f8c12c' stroke-width='1'/%3E%3C/svg%3E"),
            linear-gradient(to right, rgba(248, 193, 44, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(248, 193, 44, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px, 54px 54px, 54px 54px',
        }}
        aria-hidden="true"
      />

      {/* 2. Atmospheric Ambient Halo */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[450px] sm:h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(248, 193, 44, 0.08) 0%, rgba(224, 36, 117, 0.04) 45%, transparent 75%)',
          filter: 'blur(75px)',
        }}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-32 pb-28 sm:pb-36 md:pb-44">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#fff6e0] drop-shadow-[0_4px_24px_rgba(248,193,44,0.25)] mb-3">
            Events
          </h2>
          <p className="font-editorial italic text-lg sm:text-xl text-[#f8c12c]/75 max-w-md mx-auto leading-snug">
            Three arenas of excellence
          </p>
        </div>

        {/* 3 User-Uploaded Event Cards (1.25x Larger Cards & 1.25x Larger Gaps) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-[50px] items-stretch max-w-[1320px] mx-auto">
          {EVENT_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => onRegisterClick?.(card.id)}
              className="group relative flex flex-col cursor-pointer select-none transition-all duration-500 hover:-translate-y-3.5 hover:scale-[1.025] max-w-[420px] md:max-w-none mx-auto w-full"
              title={`Explore ${card.title} Events`}
            >
              {/* Card Container */}
              <div
                className="relative w-full rounded-[32px] overflow-hidden transition-all duration-500"
                style={{
                  filter: 'drop-shadow(0 20px 44px rgba(0, 0, 0, 0.60))',
                }}
              >
                {/* The Custom Card Image */}
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* Subtle Hover Glow Ring */}
                <div
                  className="absolute inset-0 rounded-[32px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: 'inset 0 0 28px rgba(248, 193, 44, 0.28), 0 0 36px rgba(248, 193, 44, 0.22)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Gradient: Seamlessly dissolve dark navy #071026 into light parchment #FAF4E8 for Sponsors */}
      <div
        className="absolute inset-x-0 bottom-0 h-[120px] sm:h-[160px] pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(250, 244, 232, 0.08) 30%, rgba(250, 244, 232, 0.35) 60%, #FAF4E8 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
};
