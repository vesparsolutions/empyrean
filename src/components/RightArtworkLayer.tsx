import React from 'react';

interface RightArtworkLayerProps {
  scrollProgress: number; // 0 (idle) to 1 (scrolled down)
  prefersReducedMotion?: boolean;
  mousePos?: { x: number; y: number };
}

export const RightArtworkLayer: React.FC<RightArtworkLayerProps> = ({
  scrollProgress,
  prefersReducedMotion = false,
  mousePos = { x: 0, y: 0 },
}) => {
  // Overall smooth progressive exit fade as user scrolls down towards the Ribbon section
  const exitOpacity = prefersReducedMotion
    ? 1
    : Math.max(0, 1 - Math.pow(scrollProgress, 1.25));

  // Scroll displacement towards bottom-right corner as specified by the user
  const tx = prefersReducedMotion ? 0 : scrollProgress * 30; // positive moves right (vw)
  const ty = prefersReducedMotion ? 0 : scrollProgress * 34; // positive moves down (vh)
  const rot = prefersReducedMotion ? 0 : scrollProgress * 4.5; // slight natural rotation (deg)
  const scale = prefersReducedMotion ? 1 : 1 - scrollProgress * 0.12;

  const scrollTransform = prefersReducedMotion
    ? 'none'
    : `translate3d(${tx}vw, ${ty}vh, 0) rotate(${rot}deg) scale(${scale})`;

  // Interactive subtle mouse parallax response when resting in the hero phase
  const isIdle = scrollProgress < 0.05;
  const mouseTiltX = !prefersReducedMotion && isIdle ? mousePos.y * -2.5 : 0;
  const mouseTiltY = !prefersReducedMotion && isIdle ? mousePos.x * 3.5 : 0;
  const mouseShiftX = !prefersReducedMotion && isIdle ? mousePos.x * 6 : 0;
  const mouseShiftY = !prefersReducedMotion && isIdle ? mousePos.y * 4 : 0;

  return (
    <div
      id="right-artwork-layer"
      className="absolute right-0 bottom-0 pointer-events-none select-none overflow-visible will-change-transform z-10"
      style={{
        transform: scrollTransform,
        opacity: exitOpacity,
        transition: 'opacity 0.15s ease-out',
      }}
      aria-hidden="true"
    >
      {/* 3D Parallax & Organic Floating Breathing Container */}
      <div
        className={`relative ${!prefersReducedMotion && isIdle ? 'mosaic-breathe' : ''}`}
        style={{
          transform:
            !prefersReducedMotion && isIdle
              ? `perspective(1000px) rotateX(${mouseTiltX}deg) rotateY(${mouseTiltY}deg) translate3d(${mouseShiftX}px, ${mouseShiftY}px, 0)`
              : undefined,
          transition: 'transform 0.12s ease-out',
          transformOrigin: 'bottom right',
        }}
      >
        {/* Soft Ambient Warm Golden/Amber Glow behind the mosaic */}
        <div
          className="absolute -inset-12 bg-radial from-[#f8c12c]/18 via-[#e11d48]/08 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
          style={{
            opacity: 1 - scrollProgress * 0.85,
          }}
        />

        {/* Master Mosaic Artwork Cutout (100% Transparent, No Black Box, Truck Wheels Intact) */}
        <picture>
          <source srcSet="/right-elements-trimmed.webp" type="image/webp" />
          <img
            src="/right-elements-trimmed.png"
            alt="Empyrean Jammu Cultural & Folk Art Mosaic"
            loading="eager"
            decoding="async"
            className="w-auto block object-contain object-bottom pointer-events-none select-none max-h-[82vh] max-w-[48vw] xl:max-h-[86vh] xl:max-w-[45vw] drop-shadow-[0_16px_36px_rgba(0,0,0,0.45)]"
            draggable={false}
          />
        </picture>

        {/* Subtle festive twinkling star sparks positioned near Diet Coke cap & frame */}
        {!prefersReducedMotion && isIdle && (
          <>
            <div
              className="absolute star-twinkle pointer-events-none"
              style={{
                top: '5%',
                left: '26%',
                width: '18px',
                height: '18px',
                animationDelay: '0s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="#f8c12c" className="w-full h-full drop-shadow-[0_0_8px_#f8c12c]">
                <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
              </svg>
            </div>

            <div
              className="absolute star-twinkle pointer-events-none"
              style={{
                top: '17%',
                left: '42%',
                width: '14px',
                height: '14px',
                animationDelay: '1.2s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="#fde047" className="w-full h-full drop-shadow-[0_0_6px_#fde047]">
                <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
              </svg>
            </div>

            <div
              className="absolute star-twinkle pointer-events-none"
              style={{
                top: '2%',
                right: '48%',
                width: '12px',
                height: '12px',
                animationDelay: '2.1s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="#f8c12c" className="w-full h-full drop-shadow-[0_0_6px_#f8c12c]">
                <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
