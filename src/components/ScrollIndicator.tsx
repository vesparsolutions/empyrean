import React from 'react';

interface ScrollIndicatorProps {
  scrollProgress: number;
  onClick?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  scrollProgress,
  onClick,
}) => {
  // Fades out immediately as user scrolls
  const opacity = Math.max(0, 1 - scrollProgress * 3.5);
  const pointerEvents = scrollProgress > 0.3 ? 'none' : 'auto';

  return (
    <div
      id="scroll-indicator-container"
      onClick={onClick}
      className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-35 cursor-pointer select-none transition-all duration-300 group"
      style={{
        opacity,
        pointerEvents,
      }}
    >
      <div className="flex flex-col items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#071026]/70 backdrop-blur-sm border border-[#f8c12c]/25 shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:border-[#f8c12c]/60 group-hover:shadow-[0_4px_20px_rgba(248,193,44,0.3)] transition-all">
        {/* Mouse Pill Icon */}
        <div className="w-4.5 h-7 sm:w-5 sm:h-8 rounded-full border border-[#f8c12c]/80 flex items-start justify-center p-1 group-hover:border-[#f8c12c] group-hover:shadow-[0_0_10px_rgba(248,193,44,0.4)] transition-all">
          <div className="w-1 h-2 rounded-full bg-[#f8c12c] animate-bounce"></div>
        </div>

        {/* Label */}
        <span className="text-[9px] sm:text-[10px] font-sub tracking-[0.26em] text-[#f8c12c] uppercase font-semibold drop-shadow-[0_2px_4px_rgba(7,16,38,0.9)] group-hover:text-[#ffe082] transition-colors whitespace-nowrap">
          Scroll to discover
        </span>
      </div>

      {/* Vertical Indicator Line */}
      <div className="w-[1px] h-3 sm:h-4 bg-gradient-to-b from-[#f8c12c]/70 to-transparent"></div>
    </div>
  );
};
