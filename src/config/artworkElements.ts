export interface ArtworkElementConfig {
  id: string;
  name: string;
  side: 'left' | 'right';
  src: string;
  webpSrc: string;
  alt: string;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  zIndex: number;
  origin?: string;
  scrollAnimation: {
    xVw: number;           // Horizontal displacement in vw units (negative: left, positive: right)
    yVh: number;           // Vertical displacement in vh units (positive: downwards towards bottom)
    rotateFactor?: number; // Degrees of rotation per scroll progress
    scaleFactor?: number;  // Scale factor change
    opacityEnd?: number;   // Opacity when scrolled down to 1.0 (default: 0 for clean exit)
  };
  idleAnimation?: string;
}

// Canvas dimensions for Left side: 1011 x 682
export const LEFT_ARTWORK_ELEMENTS: ArtworkElementConfig[] = [
  // 1. Background Mountains & Palace Architecture (deepest layer)
  {
    id: 'left-mountains-palace',
    name: 'Himalayan Mountains Backdrop',
    side: 'left',
    src: '/assets/empyrean/left-mountains-palace.png',
    webpSrc: '/assets/empyrean/left-mountains-palace.webp',
    alt: 'Himalayan mountain ranges and historic palace walls',
    leftPercent: 0,
    topPercent: 61.58,
    widthPercent: 73.79,
    heightPercent: 38.42,
    zIndex: 1,
    origin: 'bottom left',
    scrollAnimation: {
      xVw: -24,
      yVh: 28,
      rotateFactor: -2,
      scaleFactor: 0.94,
      opacityEnd: 0,
    },
  },

  // 2. Fort Architecture on Mountains
  {
    id: 'left-mountains-fort',
    name: 'Jammu Fort and Ridge',
    side: 'left',
    src: '/assets/empyrean/left-mountains-fort.png',
    webpSrc: '/assets/empyrean/left-mountains-fort.webp',
    alt: 'Historic Jammu fort crest overlooking the mountains',
    leftPercent: 4.95,
    topPercent: 64.52,
    widthPercent: 68.84,
    heightPercent: 35.48,
    zIndex: 2,
    origin: 'bottom left',
    scrollAnimation: {
      xVw: -28,
      yVh: 32,
      rotateFactor: -4,
      scaleFactor: 0.92,
      opacityEnd: 0,
    },
  },

  // 3. Heritage Palace Architecture / Pillars
  {
    id: 'left-palace-architecture',
    name: 'Heritage Palace Pillars',
    side: 'left',
    src: '/assets/empyrean/left-palace-architecture.png',
    webpSrc: '/assets/empyrean/left-palace-architecture.webp',
    alt: 'Carved stone palace arch and pillar architecture',
    leftPercent: 0,
    topPercent: 20.53,
    widthPercent: 18.30,
    heightPercent: 55.72,
    zIndex: 3,
    origin: 'bottom left',
    scrollAnimation: {
      xVw: -32,
      yVh: 38,
      rotateFactor: -6,
      scaleFactor: 0.90,
      opacityEnd: 0,
    },
  },

  // 4. Radiant Golden Starburst
  {
    id: 'left-gold-starburst',
    name: 'Radiant Golden Starburst',
    side: 'left',
    src: '/assets/empyrean/left-gold-starburst.png',
    webpSrc: '/assets/empyrean/left-gold-starburst.webp',
    alt: 'Radiant golden folk-art starburst aura',
    leftPercent: 21.76,
    topPercent: 14.66,
    widthPercent: 17.90,
    heightPercent: 52.93,
    zIndex: 4,
    origin: 'center center',
    scrollAnimation: {
      xVw: -38,
      yVh: 44,
      rotateFactor: -24,
      scaleFactor: 0.86,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-float-gentle',
  },

  // 5. Mehendi Hand holding Coca-Cola Bottle
  {
    id: 'left-mehendi-hand-coke',
    name: 'Mehendi Hand Holding Coca-Cola',
    side: 'left',
    src: '/assets/empyrean/left-mehendi-hand-coke.png',
    webpSrc: '/assets/empyrean/left-mehendi-hand-coke.webp',
    alt: 'Intricately patterned mehendi-adorned hand holding a glass bottle of Coca-Cola',
    leftPercent: 0,
    topPercent: 10.99,
    widthPercent: 34.22,
    heightPercent: 65.40,
    zIndex: 5,
    origin: 'bottom left',
    scrollAnimation: {
      xVw: -42,
      yVh: 48,
      rotateFactor: -9,
      scaleFactor: 0.90,
      opacityEnd: 0,
    },
  },

  // 6. Hanging Fruit / Pomegranates
  {
    id: 'left-hanging-fruit',
    name: 'Hanging Pomegranate Foliage',
    side: 'left',
    src: '/assets/empyrean/left-hanging-fruit.png',
    webpSrc: '/assets/empyrean/left-hanging-fruit.webp',
    alt: 'Hanging pomegranates and lush floral boughs',
    leftPercent: 32.64,
    topPercent: 0,
    widthPercent: 17.80,
    heightPercent: 43.26,
    zIndex: 6,
    origin: 'top center',
    scrollAnimation: {
      xVw: -36,
      yVh: 58,
      rotateFactor: -18,
      scaleFactor: 0.82,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-fruit-sway',
  },

  // 7. Pink Lotus Blossoms
  {
    id: 'left-lotus-flowers',
    name: 'Pink Lotus Blossoms',
    side: 'left',
    src: '/assets/empyrean/left-lotus-flowers.png',
    webpSrc: '/assets/empyrean/left-lotus-flowers.webp',
    alt: 'Vibrant pink Kashmiri lotus flowers blooming at the base',
    leftPercent: 0,
    topPercent: 64.52,
    widthPercent: 33.73,
    heightPercent: 35.34,
    zIndex: 7,
    origin: 'bottom left',
    scrollAnimation: {
      xVw: -30,
      yVh: 28,
      rotateFactor: -10,
      scaleFactor: 0.90,
      opacityEnd: 0,
    },
  },

  // 8. Top Ornate Border Trim
  {
    id: 'left-ornate-border-top',
    name: 'Top Corner Ornate Border',
    side: 'left',
    src: '/assets/empyrean/left-ornate-border-top.png',
    webpSrc: '/assets/empyrean/left-ornate-border-top.webp',
    alt: 'Traditional ornate archway border corner',
    leftPercent: 0,
    topPercent: 0,
    widthPercent: 18.30,
    heightPercent: 32.26,
    zIndex: 8,
    origin: 'top left',
    scrollAnimation: {
      xVw: -28,
      yVh: 54,
      rotateFactor: -16,
      scaleFactor: 0.84,
      opacityEnd: 0,
    },
  },

  // 9. Bottom Ornamental Corner Mandala
  {
    id: 'left-ornamental-corner-bottom',
    name: 'Bottom Corner Mandala',
    side: 'left',
    src: '/assets/empyrean/left-ornamental-corner-bottom.png',
    webpSrc: '/assets/empyrean/left-ornamental-corner-bottom.webp',
    alt: 'Intricate folk mandala corner ornament',
    leftPercent: 0,
    topPercent: 74.78,
    widthPercent: 28.68,
    heightPercent: 25.22,
    zIndex: 9,
    origin: 'bottom left',
    scrollAnimation: {
      xVw: -22,
      yVh: 22,
      rotateFactor: -8,
      scaleFactor: 0.92,
      opacityEnd: 0,
    },
  },

  // 10. Stars
  {
    id: 'left-star-top',
    name: 'Top Gold Star',
    side: 'left',
    src: '/assets/empyrean/left-star-top.png',
    webpSrc: '/assets/empyrean/left-star-top.webp',
    alt: 'Twinkling golden star',
    leftPercent: 26.71,
    topPercent: 10.26,
    widthPercent: 3.86,
    heightPercent: 6.60,
    zIndex: 10,
    origin: 'center center',
    scrollAnimation: {
      xVw: -35,
      yVh: 52,
      rotateFactor: -30,
      scaleFactor: 0.75,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-star-twinkle-1',
  },
  {
    id: 'left-star-mid',
    name: 'Middle Gold Star',
    side: 'left',
    src: '/assets/empyrean/left-star-mid.png',
    webpSrc: '/assets/empyrean/left-star-mid.webp',
    alt: 'Twinkling golden star',
    leftPercent: 33.33,
    topPercent: 35.92,
    widthPercent: 3.76,
    heightPercent: 7.33,
    zIndex: 10,
    origin: 'center center',
    scrollAnimation: {
      xVw: -40,
      yVh: 44,
      rotateFactor: -30,
      scaleFactor: 0.75,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-star-twinkle-2',
  },
  {
    id: 'left-star-bot',
    name: 'Bottom Gold Star',
    side: 'left',
    src: '/assets/empyrean/left-star-bot.png',
    webpSrc: '/assets/empyrean/left-star-bot.webp',
    alt: 'Twinkling golden star',
    leftPercent: 31.16,
    topPercent: 51.76,
    widthPercent: 4.85,
    heightPercent: 8.36,
    zIndex: 10,
    origin: 'center center',
    scrollAnimation: {
      xVw: -36,
      yVh: 38,
      rotateFactor: -30,
      scaleFactor: 0.75,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-star-twinkle-3',
  },
];

// Canvas dimensions for Right side: 1024 x 682
export const RIGHT_ARTWORK_ELEMENTS: ArtworkElementConfig[] = [
  // 1. Jammu Mountain Greenery & Highway Scene Backdrop
  {
    id: 'right-jammu-truck-scene',
    name: 'Jammu Foothills & Highway Backdrop',
    side: 'right',
    src: '/assets/empyrean/right-jammu-truck-scene.png',
    webpSrc: '/assets/empyrean/right-jammu-truck-scene.webp',
    alt: 'Scenic Jammu mountains and highway valley landscape',
    leftPercent: 32.32,
    topPercent: 52.79,
    widthPercent: 67.68,
    heightPercent: 47.21,
    zIndex: 1,
    origin: 'bottom right',
    scrollAnimation: {
      xVw: 24,
      yVh: 28,
      rotateFactor: 2,
      scaleFactor: 0.94,
      opacityEnd: 0,
    },
  },

  // 2. Radiant Golden Starburst (Right)
  {
    id: 'right-gold-starburst',
    name: 'Radiant Golden Starburst',
    side: 'right',
    src: '/assets/empyrean/right-gold-starburst.png',
    webpSrc: '/assets/empyrean/right-gold-starburst.webp',
    alt: 'Radiant golden folk-art starburst aura behind portrait frame',
    leftPercent: 52.83,
    topPercent: 20.53,
    widthPercent: 18.55,
    heightPercent: 45.60,
    zIndex: 2,
    origin: 'center center',
    scrollAnimation: {
      xVw: 38,
      yVh: 44,
      rotateFactor: 24,
      scaleFactor: 0.86,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-float-gentle',
  },

  // 3. Ornate Baroque Frame with Girl Portrait
  {
    id: 'right-portrait-frame',
    name: 'Girl Photo Frame',
    side: 'right',
    src: '/assets/empyrean/right-portrait-frame.png',
    webpSrc: '/assets/empyrean/right-portrait-frame.webp',
    alt: 'Golden baroque ornamental frame featuring a classic painted portrait of a girl',
    leftPercent: 63.48,
    topPercent: 2.93,
    widthPercent: 31.84,
    heightPercent: 63.20,
    zIndex: 3,
    origin: 'top right',
    scrollAnimation: {
      xVw: 40,
      yVh: 48,
      rotateFactor: 9,
      scaleFactor: 0.90,
      opacityEnd: 0,
    },
  },

  // 4. Diet Coke Bottle Cap / Lid
  {
    id: 'right-diet-coke-cap',
    name: 'Diet Coke Bottle Cap',
    side: 'right',
    src: '/assets/empyrean/right-diet-coke-cap.png',
    webpSrc: '/assets/empyrean/right-diet-coke-cap.webp',
    alt: 'Iconic silver Diet Coke bottle cap',
    leftPercent: 51.37,
    topPercent: 5.87,
    widthPercent: 13.57,
    heightPercent: 20.82,
    zIndex: 4,
    origin: 'center center',
    scrollAnimation: {
      xVw: 46,
      yVh: 58,
      rotateFactor: 55,
      scaleFactor: 0.82,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-float-gentle',
  },

  // 5. Top Kashmiri Lotus
  {
    id: 'right-lotus-top',
    name: 'Top Kashmiri Lotus',
    side: 'right',
    src: '/assets/empyrean/right-lotus-top.png',
    webpSrc: '/assets/empyrean/right-lotus-top.webp',
    alt: 'Blooming pink lotus blossom at top right',
    leftPercent: 66.41,
    topPercent: 1.32,
    widthPercent: 16.70,
    heightPercent: 18.62,
    zIndex: 5,
    origin: 'top right',
    scrollAnimation: {
      xVw: 36,
      yVh: 54,
      rotateFactor: 18,
      scaleFactor: 0.84,
      opacityEnd: 0,
    },
  },

  // 6. Decorated Jammu Truck
  {
    id: 'right-jammu-truck',
    name: 'Decorated Jammu Truck',
    side: 'right',
    src: '/assets/empyrean/right-jammu-truck.png',
    webpSrc: '/assets/empyrean/right-jammu-truck.webp',
    alt: 'Vibrantly painted traditional Jammu truck art with ornate patterns',
    leftPercent: 43.46,
    topPercent: 75.51,
    widthPercent: 50.39,
    heightPercent: 24.49,
    zIndex: 6,
    origin: 'bottom right',
    scrollAnimation: {
      xVw: 42,
      yVh: 32,
      rotateFactor: 6,
      scaleFactor: 0.94,
      opacityEnd: 0,
    },
  },

  // 7. Vintage Microphone
  {
    id: 'right-vintage-mic',
    name: 'Vintage Microphone',
    side: 'right',
    src: '/assets/empyrean/right-vintage-mic.png',
    webpSrc: '/assets/empyrean/right-vintage-mic.webp',
    alt: 'Classic chrome vintage broadcast microphone',
    leftPercent: 81.54,
    topPercent: 54.25,
    widthPercent: 11.33,
    heightPercent: 36.07,
    zIndex: 7,
    origin: 'bottom center',
    scrollAnimation: {
      xVw: 34,
      yVh: 38,
      rotateFactor: 15,
      scaleFactor: 0.88,
      opacityEnd: 0,
    },
  },

  // 8. Mid Kashmiri Lotus
  {
    id: 'right-lotus-mid',
    name: 'Mid Lotus Cluster',
    side: 'right',
    src: '/assets/empyrean/right-lotus-mid.png',
    webpSrc: '/assets/empyrean/right-lotus-mid.webp',
    alt: 'Blooming lotus flowers alongside the truck and frame',
    leftPercent: 68.36,
    topPercent: 51.32,
    widthPercent: 25.49,
    heightPercent: 30.94,
    zIndex: 8,
    origin: 'bottom right',
    scrollAnimation: {
      xVw: 36,
      yVh: 34,
      rotateFactor: 12,
      scaleFactor: 0.90,
      opacityEnd: 0,
    },
  },

  // 9. Bottom Kashmiri Lotus
  {
    id: 'right-lotus-bottom',
    name: 'Bottom Lotus Bud',
    side: 'right',
    src: '/assets/empyrean/right-lotus-bottom.png',
    webpSrc: '/assets/empyrean/right-lotus-bottom.webp',
    alt: 'Lotus flower bud near the wheels of the truck',
    leftPercent: 32.42,
    topPercent: 75.51,
    widthPercent: 16.50,
    heightPercent: 24.49,
    zIndex: 8,
    origin: 'bottom right',
    scrollAnimation: {
      xVw: 32,
      yVh: 26,
      rotateFactor: 9,
      scaleFactor: 0.90,
      opacityEnd: 0,
    },
  },

  // 10. Top Ornate Corner Border
  {
    id: 'right-ornate-corner-top',
    name: 'Top Right Ornate Archway',
    side: 'right',
    src: '/assets/empyrean/right-ornate-corner-top.png',
    webpSrc: '/assets/empyrean/right-ornate-corner-top.webp',
    alt: 'Traditional folk archway decorative top-right corner border',
    leftPercent: 83.98,
    topPercent: 0,
    widthPercent: 16.02,
    heightPercent: 42.52,
    zIndex: 9,
    origin: 'top right',
    scrollAnimation: {
      xVw: 28,
      yVh: 54,
      rotateFactor: 16,
      scaleFactor: 0.84,
      opacityEnd: 0,
    },
  },

  // 11. Bottom Ornamental Corner Mandala
  {
    id: 'right-ornamental-corner-bottom',
    name: 'Bottom Right Corner Mandala',
    side: 'right',
    src: '/assets/empyrean/right-ornamental-corner-bottom.png',
    webpSrc: '/assets/empyrean/right-ornamental-corner-bottom.webp',
    alt: 'Intricate folk mandala corner flourish',
    leftPercent: 71.29,
    topPercent: 74.78,
    widthPercent: 28.71,
    heightPercent: 25.22,
    zIndex: 9,
    origin: 'bottom right',
    scrollAnimation: {
      xVw: 22,
      yVh: 22,
      rotateFactor: 8,
      scaleFactor: 0.92,
      opacityEnd: 0,
    },
  },

  // 12. Stars
  {
    id: 'right-star-mid',
    name: 'Middle Gold Star',
    side: 'right',
    src: '/assets/empyrean/right-star-mid.png',
    webpSrc: '/assets/empyrean/right-star-mid.webp',
    alt: 'Twinkling golden star',
    leftPercent: 59.38,
    topPercent: 38.27,
    widthPercent: 3.61,
    heightPercent: 7.18,
    zIndex: 10,
    origin: 'center center',
    scrollAnimation: {
      xVw: 40,
      yVh: 44,
      rotateFactor: 30,
      scaleFactor: 0.75,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-star-twinkle-1',
  },
  {
    id: 'right-star-bot',
    name: 'Bottom Gold Star',
    side: 'right',
    src: '/assets/empyrean/right-star-bot.png',
    webpSrc: '/assets/empyrean/right-star-bot.webp',
    alt: 'Twinkling golden star',
    leftPercent: 57.62,
    topPercent: 55.72,
    widthPercent: 3.91,
    heightPercent: 10.26,
    zIndex: 10,
    origin: 'center center',
    scrollAnimation: {
      xVw: 36,
      yVh: 38,
      rotateFactor: 30,
      scaleFactor: 0.75,
      opacityEnd: 0,
    },
    idleAnimation: 'animate-star-twinkle-2',
  },
];
