import React from 'react';
import { RIGHT_ARTWORK_ELEMENTS } from '../config/artworkElements';
import { ArtworkElement } from './ArtworkElement';

interface RightArtworkLayerProps {
  scrollProgress: number;
  prefersReducedMotion?: boolean;
}

export const RightArtworkLayer: React.FC<RightArtworkLayerProps> = ({
  scrollProgress,
  prefersReducedMotion = false,
}) => {
  return (
    <div
      id="right-artwork-layer"
      className="absolute right-0 bottom-0 pointer-events-none select-none overflow-visible"
      style={{
        height: '98%',
        aspectRatio: '1024 / 682',
        maxWidth: '54vw',
      }}
      aria-hidden="true"
    >
      {RIGHT_ARTWORK_ELEMENTS.map((el) => (
        <ArtworkElement
          key={el.id}
          config={el}
          scrollProgress={scrollProgress}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
};
