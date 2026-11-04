import React from 'react';
import { LEFT_ARTWORK_ELEMENTS } from '../config/artworkElements';
import { ArtworkElement } from './ArtworkElement';

interface LeftArtworkLayerProps {
  scrollProgress: number;
  prefersReducedMotion?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  isMobile?: boolean;
}

export const LeftArtworkLayer: React.FC<LeftArtworkLayerProps> = ({
  scrollProgress,
  prefersReducedMotion = false,
  deviceType,
  isMobile = false,
}) => {
  return (
    <div
      id="left-artwork-layer"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      {LEFT_ARTWORK_ELEMENTS.map((el) => (
        <ArtworkElement
          key={el.id}
          config={el}
          scrollProgress={scrollProgress}
          prefersReducedMotion={prefersReducedMotion}
          deviceType={deviceType}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
