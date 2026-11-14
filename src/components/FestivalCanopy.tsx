import React from 'react';
import canopyImg from '../assets/canopy.png';

interface FestivalCanopyProps {
  scrollProgress?: number; // 0 (dead center) to 1 (logo at top)
  prefersReducedMotion?: boolean;
  className?: string;
}

export const FestivalCanopy: React.FC<FestivalCanopyProps> = ({
  scrollProgress = 0,
  prefersReducedMotion = false,
  className = '',
}) => {
  // Canopy exits upwards and disappears completely before logo reaches the top (by 40% of logo travel)
  const CANOPY_EXIT_END = 0.40;
  const exitProgress = Math.min(1, Math.max(0, scrollProgress / CANOPY_EXIT_END));

  // Smooth ease-out acceleration for natural physical lift-off
  const eased = exitProgress * exitProgress * (3 - 2 * exitProgress);

  // Vertical position: starts at -15%, translates up to -130% (well off-screen)
  const translateY = prefersReducedMotion ? -15 : -15 - eased * 115;
  const opacity = Math.max(0, 1 - exitProgress);

  // Hide completely when gone to avoid any layout/GPU impact
  if (opacity <= 0.001) {
    return null;
  }

  return (
    <div
      id="festival-physical-canopy"
      className={`absolute top-0 left-1/2 w-[68%] sm:w-[58%] md:w-[50%] lg:w-[50%] max-w-[960px] min-w-[280px] pointer-events-none z-[35] select-none flex flex-col items-center ${className}`}
      style={{
        transform: `translate3d(-50%, ${translateY}%, 0)`,
        opacity,
        willChange: 'transform, opacity',
      }}
      aria-hidden="true"
    >
      <img
        src={canopyImg}
        alt="Festival Canopy"
        className="w-full h-auto object-contain object-top block select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
