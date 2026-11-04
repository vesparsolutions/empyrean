import React from 'react';
import { RIGHT_ARTWORK_ELEMENTS } from '../config/artworkElements';
import { ArtworkElement } from './ArtworkElement';

interface RightArtworkLayerProps {
  scrollProgress: number;
  prefersReducedMotion?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  isMobile?: boolean;
}

export const RightArtworkLayer: React.FC<RightArtworkLayerProps> = ({
  scrollProgress,
  prefersReducedMotion = false,
  deviceType,
  isMobile = false,
}) => {
  return (
    <div
      id="right-artwork-layer"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      {RIGHT_ARTWORK_ELEMENTS.map((el) => (
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
