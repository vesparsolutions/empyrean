import React from 'react';
import type { ArtworkElementConfig } from '../config/artworkElements';

interface ArtworkElementProps {
  config: ArtworkElementConfig;
  scrollProgress: number; // 0 to 1
  prefersReducedMotion?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  isMobile?: boolean;
}

export const ArtworkElement: React.FC<ArtworkElementProps> = ({
  config,
  scrollProgress,
  prefersReducedMotion = false,
  deviceType,
  isMobile = false,
}) => {
  const { desktop, tablet, mobile, scrollAnimation } = config;

  // Active positioning based on viewport deviceType
  const activeDevice = deviceType || (isMobile ? 'mobile' : 'desktop');
  const pos =
    activeDevice === 'mobile' && mobile
      ? mobile
      : activeDevice === 'tablet' && tablet
      ? tablet
      : desktop;

  // Check if hidden on mobile
  if (activeDevice === 'mobile' && mobile?.hidden) {
    return null;
  }

  // Calculate transform from scroll progress
  let transform = '';
  let opacity = 1;

  if (prefersReducedMotion) {
    transform = 'none';
    opacity = 1;
  } else {
    // Parallax displacement using viewport-relative units (vw and vh) for consistent proportional speed
    const tx = scrollProgress * scrollAnimation.xVw;
    const ty = scrollProgress * (scrollAnimation.yVh || 0);
    const rot = (desktop.rotate || 0) + scrollProgress * (scrollAnimation.rotateFactor || 0);
    const scale = 1 - scrollProgress * (1 - (scrollAnimation.scaleFactor || 0.95));
    
    transform = `translate3d(${tx}vw, ${ty}vh, 0) rotate(${rot}deg) scale(${scale})`;
    
    // Smooth, progressive fade as user scrolls through the hero track (maintains framing presence)
    const endOpacity = scrollAnimation.opacityEnd ?? 0.2;
    opacity = Math.max(endOpacity, 1 - Math.pow(scrollProgress, 1.2) * (1 - endOpacity));
  }

  return (
    <div
      id={config.id}
      data-artwork-id={config.id}
      data-side={config.side}
      className="absolute select-none pointer-events-none will-change-transform"
      style={{
        left: pos.left,
        right: pos.right,
        top: pos.top,
        bottom: pos.bottom,
        width: pos.width,
        height: pos.height,
        maxHeight: pos.maxHeight,
        maxWidth: pos.maxWidth,
        aspectRatio: config.aspectRatio,
        zIndex: pos.zIndex,
        transformOrigin: pos.origin || desktop.origin || 'center center',
        transform,
        opacity,
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <picture className="w-full h-full block">
        <source srcSet={config.webpSrc} type="image/webp" />
        <img
          src={config.src}
          alt={config.alt}
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain block drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          draggable={false}
        />
      </picture>
    </div>
  );
};
