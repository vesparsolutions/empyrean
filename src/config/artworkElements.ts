export interface ArtworkElementConfig {
  id: string;
  name: string;
  side: 'left' | 'right' | 'center';
  src: string;
  webpSrc: string;
  alt: string;
  aspectRatio: string;
  desktop: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    width?: string;
    height?: string;
    maxHeight?: string;
    maxWidth?: string;
    zIndex: number;
    rotate?: number;
    origin?: string;
  };
  tablet?: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    width?: string;
    height?: string;
    maxHeight?: string;
    maxWidth?: string;
    zIndex: number;
    rotate?: number;
    origin?: string;
  };
  mobile?: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    width?: string;
    height?: string;
    maxHeight?: string;
    maxWidth?: string;
    zIndex: number;
    rotate?: number;
    origin?: string;
    hidden?: boolean;
    scale?: number;
  };
  scrollAnimation: {
    xVw: number;           // Horizontal displacement in vw units (negative: left, positive: right)
    yVh?: number;          // Vertical displacement in vh units
    rotateFactor?: number; // Degrees of rotation per scroll progress
    scaleFactor?: number;  // Scale factor change
    opacityEnd?: number;   // Opacity when scrolled down
  };
  idleAnimation?: 'fruit-sway' | 'star-twinkle-1' | 'star-twinkle-2' | 'star-twinkle-3' | 'gentle-float' | 'none';
}

export const LEFT_ARTWORK_ELEMENTS: ArtworkElementConfig[] = [
  // 1. Unified Pristine Left Artwork Collage (Palace, Coke bottle, mehendi hand, starburst, mountains, fort, corner mandala)
  // Takes the entire vertical space from bottom to top so there is no gap at the top on any device
  {
    id: 'left-artwork-collage',
    name: 'Heritage Palace & Mehendi Artwork',
    side: 'left',
    src: '/assets/empyrean/left-collage.png',
    webpSrc: '/assets/empyrean/left-collage.webp',
    alt: 'Heritage palace architecture, mehendi-adorned hand holding Coca-Cola bottle, Himalayan mountains, Jammu fort, and floral folk border',
    aspectRatio: '1011 / 682',
    desktop: {
      left: '0%',
      bottom: '0%',
      height: '98%',
      zIndex: 10,
      origin: 'bottom left',
    },
    tablet: {
      left: '-10%',
      bottom: '0%',
      height: '96%',
      zIndex: 10,
      origin: 'bottom left',
    },
    mobile: {
      left: '-12%',
      bottom: '0%',
      height: '96%',
      zIndex: 10,
      origin: 'bottom left',
    },
    scrollAnimation: {
      xVw: -28,
      yVh: -2,
      rotateFactor: -3,
      scaleFactor: 0.94,
      opacityEnd: 0.2,
    },
  },
];

export const RIGHT_ARTWORK_ELEMENTS: ArtworkElementConfig[] = [
  // 1. Unified Pristine Right Artwork Collage (Baroque portrait frame, Diet Coke cap, mic, truck, mountains, lotuses, corner mandala)
  // Takes the entire vertical space from bottom to top so there is no gap at the top on any device
  {
    id: 'right-artwork-collage',
    name: 'Jammu Truck Art & Baroque Frame',
    side: 'right',
    src: '/assets/empyrean/right-collage.png',
    webpSrc: '/assets/empyrean/right-collage.webp',
    alt: 'Decorated Jammu truck, ornate baroque frame with portrait, Diet Coke cap, vintage microphone, and Kashmiri lotus blossoms',
    aspectRatio: '1024 / 682',
    desktop: {
      right: '0%',
      bottom: '0%',
      height: '98%',
      zIndex: 10,
      origin: 'bottom right',
    },
    tablet: {
      right: '-10%',
      bottom: '0%',
      height: '96%',
      zIndex: 10,
      origin: 'bottom right',
    },
    mobile: {
      right: '-12%',
      bottom: '0%',
      height: '96%',
      zIndex: 10,
      origin: 'bottom right',
    },
    scrollAnimation: {
      xVw: 28,
      yVh: -2,
      rotateFactor: 3,
      scaleFactor: 0.94,
      opacityEnd: 0.2,
    },
  },
];
