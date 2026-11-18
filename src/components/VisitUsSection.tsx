import React from 'react';
import { Navigation, ArrowUpRight } from 'lucide-react';

export const VisitUsSection: React.FC = () => {
  const googleMapsDirectionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=IIM+Jammu+Jagti+Campus';

  return (
    <section
      id="visit-us"
      className="relative w-full text-[#f8fafc] overflow-hidden select-none"
      style={{
        backgroundColor: '#071026',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(11, 24, 57, 0.85) 0%, transparent 70%),
          radial-gradient(circle at 80% 80%, rgba(248, 193, 44, 0.05) 0%, transparent 60%)
        `,
      }}
      aria-label="Visit Us - IIM Jammu Jagti Campus"
    >
      {/* 1. Indian Jali Grid Texture (matching Artists & Events foothill texture) */}
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

      {/* 2. Ambient Gold Halo */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[400px] sm:h-[550px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(248, 193, 44, 0.09) 0%, rgba(180, 83, 9, 0.03) 50%, transparent 75%)',
          filter: 'blur(70px)',
        }}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-20 sm:pb-28">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#fff6e0] drop-shadow-[0_4px_24px_rgba(248,193,44,0.25)] mb-3">
            Visit Us
          </h2>
          <p className="font-editorial italic text-lg sm:text-xl md:text-2xl text-[#f8c12c]/75 max-w-xl mx-auto leading-snug">
            Find your way to the foothills of the Trikuta Mountains.
          </p>
        </div>

        {/* Content Grid: Left details card + Right Google Map iframe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* LEFT COLUMN: Campus Details & Direct Get Directions Action (Sharp Edges, No Gold Corners) */}
          <div
            className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 md:p-10 border border-white/10"
            style={{
              background: 'linear-gradient(180deg, rgba(14, 28, 64, 0.92) 0%, rgba(7, 16, 38, 0.98) 100%)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            }}
          >
            <div>
              {/* Institute Name */}
              <h3 className="font-heading text-3xl sm:text-4xl text-[#fff6e0] tracking-wide mb-3">
                IIM Jammu
              </h3>

              {/* Address */}
              <p className="font-body text-sm sm:text-base text-[#cbd5e1] leading-relaxed mb-4">
                Indian Institute of Management Jammu
                <br />
                <span className="text-[#94a3b8] text-xs sm:text-sm">
                  Jagti, PO Nagrota, NH-44, Jammu,
                  <br />
                  Jammu & Kashmir – 181221
                </span>
              </p>

              {/* Campus Context Note */}
              <p className="font-body text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-8">
                Located on the Jammu-Srinagar National Highway (NH-44), the 200-acre permanent Jagti campus lies at the scenic foothills of the Trikutas, ~14 km from Jammu Tawi Railway Station and ~18 km from Jammu Airport.
              </p>
            </div>

            {/* Primary Action: Get Directions Button (Sharp Edges, No Pill Shape) */}
            <div>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 sm:h-13 rounded-none flex items-center justify-center gap-2 font-sub text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#ebb11d] cursor-pointer"
                style={{
                  backgroundColor: '#f8c12c',
                  color: '#071026',
                  boxShadow: '0 4px 16px rgba(248, 193, 44, 0.20)',
                }}
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions to IIM Jammu</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <p className="text-center text-[11px] text-[#94a3b8] mt-2.5">
                Opens Google Maps with turn-by-turn navigation
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Embedded Google Maps Iframe (Sharp Edges, No Overlay Tags) */}
          <div
            className="lg:col-span-7 overflow-hidden border border-white/10 min-h-[380px] sm:min-h-[460px] lg:min-h-full flex flex-col"
            style={{
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Clean Full-Bleed Google Maps Iframe */}
            <iframe
              title="IIM Jammu Jagti Campus Location Map"
              src="https://maps.google.com/maps?q=Indian+Institute+of+Management+Jammu+Jagti+Campus&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full flex-1 border-0 min-h-[380px] sm:min-h-[460px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
