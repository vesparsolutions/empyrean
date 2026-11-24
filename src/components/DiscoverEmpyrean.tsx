import React from 'react';
import borderImg from '../assets/border.png';
import trikutaImg from '../assets/trikuta.png';
import { HangingSigilsWebGL } from './HangingSigilsWebGL';

interface DiscoverEmpyreanProps {
  onRegisterClick?: (tier?: string) => void;
  isRibbonActive?: boolean;
}

/**
 * =========================================================================
 * ARTISTS SECTION — REVEAL MODE TOGGLE
 * =========================================================================
 * - Set SHOW_SIGILS = false (Current Teaser Mode):
 *     Sigils are hidden, Trikuta mountains are elevated, and an evocative
 *     anticipation line emerges from behind the misty peaks.
 *
 * - Set SHOW_SIGILS = true (Artist Reveal Mode):
 *     Instantly restores the interactive 3D WebGL Hanging Sigil banners!
 *
 * (A full backup is also preserved at:
 *  src/components/DiscoverEmpyrean.with-sigils.backup.tsx)
 * =========================================================================
 */
const SHOW_SIGILS = false;

export const DiscoverEmpyrean: React.FC<DiscoverEmpyreanProps> = ({
  isRibbonActive = true,
}) => {
  return (
    <section
      id="artists"
      className={`relative z-30 ${SHOW_SIGILS ? 'min-h-screen' : 'min-h-0'} w-full flex flex-col items-center overflow-visible pt-12 sm:pt-16 md:pt-20 select-none`}
      style={{
        backgroundColor: '#FAF4E8',
        backgroundImage: `
          radial-gradient(circle at 50% 25%, rgba(254, 240, 199, 0.85) 0%, transparent 60%),
          radial-gradient(circle at 50% 65%, rgba(255, 237, 213, 0.65) 0%, transparent 55%),
          linear-gradient(to bottom, #FFFDF9 0%, #FAF3E5 24%, #F4E7CE 55%, #dfc8a5 78%, #071026 100%)
        `,
      }}
    >
      {/* 
        0. Grand Toran Arch Border (Bridging Seam between Ribbon & Artists)
        Layered ON TOP OF BOTH the dark Ribbon background (#0b1839) and light Artists background (#FAF4E8).
      */}
      <div
        id="fest-transitional-toran"
        className="absolute top-0 left-0 right-0 w-full pointer-events-none z-35 flex justify-center -translate-y-[22%] sm:-translate-y-[21%] md:-translate-y-[20%]"
        style={{
          opacity: isRibbonActive ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative w-full min-w-full">
          <picture className="w-full min-w-full block">
            <source srcSet="/border.png" type="image/png" />
            <img
              src={borderImg || '/border.png'}
              alt="Empyrean Royal Toran Border"
              className="w-full min-w-full h-auto object-cover object-top block"
              style={{
                filter: 'drop-shadow(0 14px 28px rgba(11, 24, 57, 0.20))',
              }}
            />
          </picture>
          {/* Color Harmonization Gradient: Perfectly matches & dissolves top into Ribbon #0b1839 */}
          <div
            className="absolute inset-x-0 top-0 h-[36%] pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, #0b1839 0%, rgba(11, 24, 57, 0.82) 42%, rgba(11, 24, 57, 0) 100%)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 
        1. Subtle Traditional Indian Jali Watermark Pattern
      */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23854d0e' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23854d0e' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '54px 54px',
        }}
        aria-hidden="true"
      />

      {/* 
        2. Golden Morning Halo Behind Heading
      */}
      <div
        className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 w-[340px] sm:w-[540px] md:w-[700px] h-[340px] sm:h-[540px] md:h-[700px] rounded-full pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      {/* 
        3. Heading: "Artists"
      */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 pt-4 sm:pt-6 md:pt-8 max-w-4xl mx-auto select-none">
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#1a0f05] drop-shadow-[0_4px_18px_rgba(90,40,15,0.14)]">
          Artists
        </h2>
        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#b46d1c]/50 to-transparent mt-3" />
      </div>

      {SHOW_SIGILS ? (
        /* 
          ═════════════════════════════════════════════════════════════════
          A. REVEALED ARTISTS MODE (3D Interactive WebGL Hanging Sigils)
          ═════════════════════════════════════════════════════════════════
        */
        <>
          <div className="relative z-20 w-full max-w-[1300px] mx-auto px-2 mt-4 sm:mt-6 mb-2 sm:mb-3 -translate-y-[5%] overflow-visible">
            <HangingSigilsWebGL />
          </div>

          <div className="relative w-full min-w-full flex flex-col justify-end pointer-events-none select-none z-10 -mt-[12vw] sm:-mt-[14vw] md:-mt-[16vw] lg:-mt-[17vw] overflow-hidden">
            <div className="relative w-full min-w-full">
              <picture className="w-full min-w-full block">
                <source srcSet="/trikuta.png" type="image/png" />
                <img
                  src={trikutaImg || '/trikuta.png'}
                  alt="Trikuta Mountains Jammu"
                  className="w-full min-w-full h-auto object-cover object-bottom block"
                  style={{
                    filter: `
                      contrast(1.08)
                      saturate(1.12)
                      drop-shadow(0 -10px 24px rgba(70, 25, 10, 0.18))
                    `,
                  }}
                />
              </picture>

              <div
                className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.25) 25%, rgba(11, 24, 57, 0.70) 60%, #071026 100%)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </>
      ) : (
        /* 
          ═════════════════════════════════════════════════════════════════
          B. TEASER MODE (Elevated Trikuta Mountains + Anticipation Line)
          ═════════════════════════════════════════════════════════════════
        */
        <div className="relative w-full flex flex-col items-center mt-6 sm:mt-10 md:mt-12 overflow-visible">
          {/* 
            Ethereal Dawn Sunburst Glow behind the Mountain Ridge
          */}
          <div
            className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] md:w-[900px] h-[300px] sm:h-[450px] md:h-[600px] rounded-full pointer-events-none z-10 opacity-75"
            style={{
              background:
                'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.12) 45%, rgba(248, 193, 44, 0.04) 65%, transparent 75%)',
              filter: 'blur(50px)',
            }}
            aria-hidden="true"
          />

          {/* 
            ANTICIPATION LINE: Emerging gracefully from behind the mountain peaks
            Layered at z-10 behind the foreground peaks (z-20)
          */}
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center select-none pt-4 sm:pt-6 pb-8 sm:pb-12 md:pb-16">
            {/* Main Majestic Line Building Anticipation in Cinzel serif */}
            <h3 className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#1a0f05] tracking-wide leading-snug max-w-2xl drop-shadow-[0_2px_16px_rgba(140,82,20,0.16)]">
              Behind the silence of the peaks, the legends gather.
            </h3>
          </div>

          {/* 
            ELEVATED TRIKUTA MOUNTAINS (Foreground Ridge Layer z-20)
            - Shifted upwards so the peaks rise directly around & in front of the anticipation glow.
            - Full-bleed width seamlessly dissolving at the base into deep navy #071026 for EventsSection.
          */}
          <div className="relative w-full min-w-full flex flex-col justify-end pointer-events-none select-none z-20 -mt-8 sm:-mt-14 md:-mt-20 lg:-mt-24 overflow-hidden">
            <div className="relative w-full min-w-full">
              <picture className="w-full min-w-full block">
                <source srcSet="/trikuta.png" type="image/png" />
                <img
                  src={trikutaImg || '/trikuta.png'}
                  alt="Trikuta Mountains Jammu"
                  className="w-full min-w-full h-auto object-cover object-bottom block"
                  style={{
                    filter: `
                      contrast(1.08)
                      saturate(1.12)
                      drop-shadow(0 -10px 24px rgba(70, 25, 10, 0.18))
                    `,
                  }}
                />
              </picture>

              {/* Atmospheric Foothill Mist: Dissolves into deep navy #071026 for seamless entry into Events */}
              <div
                className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.25) 25%, rgba(11, 24, 57, 0.70) 60%, #071026 100%)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

