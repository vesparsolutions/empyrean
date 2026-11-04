import React from 'react';

interface CentralLogoProps {
  scrollProgress: number;
  prefersReducedMotion?: boolean;
  onExploreClick?: () => void;
}

export const CentralLogo: React.FC<CentralLogoProps> = ({
  scrollProgress,
  prefersReducedMotion = false,
}) => {
  // Transform values based on scroll progress
  let transform = '';
  let opacity = 1;
  let pointerEvents: 'auto' | 'none' = 'auto';

  if (prefersReducedMotion) {
    transform = 'none';
    opacity = 1;
  } else {
    // Scales down gently and floats upward as scroll progresses
    const scale = Math.max(0.85, 1 - scrollProgress * 0.2);
    const ty = -scrollProgress * 45;
    transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
    
    // Fades out smoothly between 0 and 0.38
    opacity = Math.max(0, 1 - scrollProgress * 2.6);
    if (scrollProgress > 0.35) {
      pointerEvents = 'none';
    }
  }

  return (
    <div
      id="central-logo-lockup"
      className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none px-4 select-none"
      style={{
        transform,
        opacity,
        pointerEvents,
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      }}
    >
      <div className="flex flex-col items-center max-w-[960px] w-full pt-2 sm:pt-4 md:pt-6">
        {/* Presenter Pre-title */}
        <div className="flex items-center gap-2 sm:gap-3 text-[#f8c12c] text-xs sm:text-sm md:text-base font-sub tracking-[0.28em] uppercase mb-2 sm:mb-3 drop-shadow-md">
          <span className="w-5 sm:w-10 h-[1px] bg-[#f8c12c]/60"></span>
          <span>✦</span>
          <span className="font-semibold text-[#f8e5b0]">IIM Jammu Presents</span>
          <span>✦</span>
          <span className="w-5 sm:w-10 h-[1px] bg-[#f8c12c]/60"></span>
        </div>

        {/* Main Logo Emblem - Prominent, Grand & Majestic on Laptops and All Devices */}
        <div className="relative w-[88%] sm:w-[82%] md:w-[76%] lg:w-[70%] xl:w-[65%] max-w-[420px] sm:max-w-[580px] md:max-w-[740px] lg:max-w-[840px] xl:max-w-[900px] my-1 sm:my-2">
          {/* Subtle center warm glow */}
          <div className="absolute inset-0 bg-[#f8c12c]/15 rounded-full blur-3xl pointer-events-none -z-10 scale-95"></div>
          
          <picture>
            <source srcSet="/assets/empyrean/logo-empyrean.webp" type="image/webp" />
            <img
              src="/assets/empyrean/logo-empyrean.png"
              alt="EMPYREAN - An Era Reimagined - Annual Fest of IIM Jammu"
              className="w-full h-auto object-contain block drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)]"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </div>
  );
};
