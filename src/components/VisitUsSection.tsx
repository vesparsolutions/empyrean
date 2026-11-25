import React from 'react';

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
      {/* Jali Grid Texture */}
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

      {/* Ambient Gold Halo */}
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
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#fff6e0] drop-shadow-[0_4px_24px_rgba(248,193,44,0.25)]">
            Visit Us
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

          {/* LEFT: Campus Info */}
          <div
            className="lg:col-span-5 flex flex-col justify-between p-7 sm:p-9 md:p-10 rounded-sm border border-[#1e2d50]"
            style={{
              background: 'rgba(11, 20, 46, 0.7)',
            }}
          >
            <div>
              <h3 className="font-heading text-3xl sm:text-4xl text-[#fff6e0] tracking-wide mb-6">
                IIM Jammu
              </h3>

              <p className="font-body text-sm sm:text-[15px] text-[#b8c4d6] leading-relaxed mb-2">
                Indian Institute of Management Jammu
              </p>
              <p className="font-body text-xs sm:text-sm text-[#7b8da6] leading-relaxed mb-8">
                Jagti, PO Nagrota, NH-44
                <br />
                Jammu &amp; Kashmir – 181221
              </p>

              <p className="font-body text-xs sm:text-sm text-[#7b8da6] leading-relaxed">
                200-acre permanent campus on the Jammu–Srinagar Highway, at the foothills of the Trikutas. 14 km from Jammu Tawi railway station, 18 km from the airport.
              </p>
            </div>

            {/* Get Directions */}
            <div className="mt-10">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sub text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[#f8c12c] hover:text-[#fff6e0] transition-colors duration-200 cursor-pointer group"
              >
                <span>Get Directions</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <div className="mt-2 h-px w-16 bg-[#f8c12c]/30" />
            </div>
          </div>

          {/* RIGHT: Google Maps */}
          <div
            className="lg:col-span-7 overflow-hidden rounded-sm border border-[#1e2d50] min-h-[380px] sm:min-h-[460px] lg:min-h-full flex flex-col"
          >
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
