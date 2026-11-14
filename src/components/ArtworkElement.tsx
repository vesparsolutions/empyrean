import React from 'react';
import type { ArtworkElementConfig } from '../config/artworkElements';

interface ArtworkElementProps {
  config: ArtworkElementConfig;
  scrollProgress: number; // 0 to 1
  prefersReducedMotion?: boolean;
}

export const ArtworkElement: React.FC<ArtworkElementProps> = ({
  config,
  scrollProgress,
  prefersReducedMotion = false,
}) => {
  const { scrollAnimation } = config;

  // Calculate transform and opacity dynamically from scroll progress
  let transform = '';
  let opacity = 1;

  if (prefersReducedMotion) {
    transform = 'none';
    opacity = 1;
  } else {
    // Parallax displacement using viewport-relative units (vw and vh)
    // Left elements move negative X (left) and positive Y (down -> bottom-left corner)
    // Right elements move positive X (right) and positive Y (down -> bottom-right corner)
    const tx = scrollProgress * scrollAnimation.xVw;
    const ty = scrollProgress * scrollAnimation.yVh;
    const rot = scrollProgress * (scrollAnimation.rotateFactor || 0);
    const scale = 1 - scrollProgress * (1 - (scrollAnimation.scaleFactor || 0.9));
    
    transform = `translate3d(${tx}vw, ${ty}vh, 0) rotate(${rot}deg) scale(${scale})`;
    
    // Smooth, progressive exit fade towards corners
    const endOpacity = scrollAnimation.opacityEnd ?? 0;
    // Fades smoothly to 0 as it exits to corners
    opacity = Math.max(endOpacity, 1 - Math.pow(scrollProgress, 1.1) * (1 - endOpacity));
  }

  return (
    <div
      id={config.id}
      data-artwork-id={config.id}
      data-side={config.side}
      className="absolute select-none pointer-events-none will-change-transform"
      style={{
        left: `${config.leftPercent}%`,
        top: `${config.topPercent}%`,
        width: `${config.widthPercent}%`,
        height: `${config.heightPercent}%`,
        zIndex: config.zIndex,
        transformOrigin: config.origin || (config.side === 'left' ? 'bottom left' : 'bottom right'),
        transform,
        opacity,
        transition: 'opacity 0.15s ease-out',
      }}
    >
      <picture className={`w-full h-full block ${config.idleAnimation && scrollProgress < 0.05 ? config.idleAnimation : ''}`}>
        <source srcSet={config.webpSrc} type="image/webp" />
        <img
          src={config.src}
          alt={config.alt}
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain block drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
          draggable={false}
        />
      </picture>
    </div>
  );
};
