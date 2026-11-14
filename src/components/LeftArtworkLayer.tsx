import React from 'react';
import { LEFT_ARTWORK_ELEMENTS } from '../config/artworkElements';
import { ArtworkElement } from './ArtworkElement';

interface LeftArtworkLayerProps {
  scrollProgress: number;
  prefersReducedMotion?: boolean;
}

export const LeftArtworkLayer: React.FC<LeftArtworkLayerProps> = ({
  scrollProgress,
  prefersReducedMotion = false,
}) => {
  return (
    <div
      id="left-artwork-layer"
      className="absolute left-0 bottom-0 pointer-events-none select-none overflow-visible"
      style={{
        height: '98%',
        aspectRatio: '1011 / 682',
        maxWidth: '54vw',
      }}
      aria-hidden="true"
    >
      {LEFT_ARTWORK_ELEMENTS.map((el) => (
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
