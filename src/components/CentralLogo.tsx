import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CentralLogoProps {
  scrollProgress: number; // 0 to 1 logo travel progress
  prefersReducedMotion?: boolean;
  onExploreClick?: () => void;
}

export const CentralLogo: React.FC<CentralLogoProps> = ({
  scrollProgress = 0,
  prefersReducedMotion = false,
  onExploreClick,
}) => {
  // logoProgress: 0 = dead center, 1 = docked at top middle
  const logoProgress = Math.min(1, Math.max(0, scrollProgress));

  // Scale: 1.0 (dead center) -> 0.26 (scaled down when going on top)
  const scale = prefersReducedMotion ? 1 : 1.0 - logoProgress * 0.74;

  // Translate Y: 0vh (dead center) -> -41vh - 15px (top middle, 15px higher)
  const ty = prefersReducedMotion ? 0 : -logoProgress * 41;
  const extraUp = prefersReducedMotion ? 0 : logoProgress * 15;

  const transform = `translate3d(0, calc(${ty}vh - ${extraUp}px), 0) scale(${scale})`;

  // Scroll hint button fades out quickly as user starts scrolling
  const hintOpacity = Math.max(0, 1 - logoProgress * 5);

  return (
    <div
      id="central-logo-lockup"
      className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 pointer-events-none px-4 select-none"
      style={{
        transform,
        opacity: 1, // Logo stays visible throughout the experience
        willChange: 'transform',
      }}
    >
      <div className="flex flex-col items-center max-w-[960px] w-full pt-2 sm:pt-4 md:pt-6">
        {/* Presenter Pre-title */}
        <div
          className="flex items-center gap-2 sm:gap-3 text-[#f8c12c] text-xs sm:text-sm md:text-base font-sub tracking-[0.28em] uppercase mb-2 sm:mb-3 drop-shadow-md"
          style={{
            opacity: Math.max(0.4, 1 - logoProgress * 0.6),
          }}
        >
          <span className="w-5 sm:w-10 h-[1px] bg-[#f8c12c]/60"></span>
          <span>✦</span>
          <span className="font-semibold text-[#f8e5b0]">IIM Jammu Presents</span>
          <span>✦</span>
          <span className="w-5 sm:w-10 h-[1px] bg-[#f8c12c]/60"></span>
        </div>

        {/* Main Logo Emblem - Grand at start in dead center, glides smoothly to top middle */}
        <div className="relative w-[88%] sm:w-[82%] md:w-[76%] lg:w-[70%] xl:w-[65%] max-w-[420px] sm:max-w-[580px] md:max-w-[740px] lg:max-w-[840px] xl:max-w-[900px] my-1 sm:my-2">
          {/* Ambient Warm Aura Glow behind the logo */}
          <div
            className="absolute inset-0 bg-[#f8c12c]/20 rounded-full blur-3xl pointer-events-none -z-10 scale-95 transition-opacity"
            style={{
              opacity: 1 - logoProgress * 0.4,
            }}
          />
          
          <picture>
            <source srcSet="/assets/empyrean/logo-empyrean.webp" type="image/webp" />
            <img
              src="/assets/empyrean/logo-empyrean.png"
              alt="EMPYREAN - An Era Reimagined - Annual Fest of IIM Jammu"
              className="w-full h-auto object-contain block drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
      </div>

      {/* Floating subtle scroll hint at start when in dead center */}
      {hintOpacity > 0.05 && (
        <button
          type="button"
          className="absolute bottom-10 flex flex-col items-center gap-1 text-[#f8c12c]/80 hover:text-[#f8c12c] text-xs font-sub tracking-[0.2em] uppercase pointer-events-auto cursor-pointer transition-all duration-200 focus:outline-none"
          style={{ opacity: hintOpacity }}
          onClick={onExploreClick}
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#f8c12c]" />
        </button>
      )}
    </div>
  );
};
