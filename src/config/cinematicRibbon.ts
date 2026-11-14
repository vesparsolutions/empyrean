/**
 * Configuration for the 3D Cinematic Ribbon Gallery.
 * Easily replace or customize media items, titles, subtitles, and categories.
 */

export interface RibbonMediaItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  mediaType: 'image' | 'video';
  src: string;
  posterSrc?: string;
  aspectRatio?: number; // width / height, e.g. 16/9 = 1.777
  colorAccent?: string;
}

export interface RibbonGalleryConfig {
  heading: string;
  subtitle: string;
  items: RibbonMediaItem[];
}

export const CINEMATIC_RIBBON_CONFIG: RibbonGalleryConfig = {
  heading: 'Moments Worth Watching',
  subtitle: 'An era reimagined through timeless memories',
  items: [
    {
      id: 'pronite-star-night',
      title: 'Pronite Star Arena',
      subtitle: 'Main Stage • Celebrity Night',
      category: 'Headliner Concert',
      mediaType: 'image',
      // High-resolution dramatic concert arena with stage lighting & lasers
      src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 16 / 9,
      colorAccent: '#00f0ff',
    },
    {
      id: 'carnival-euphoria',
      title: 'Carnival Euphoria',
      subtitle: 'Fest Grounds • Live Celebration',
      category: 'Festival Atmosphere',
      mediaType: 'image',
      // Ecstatic festival crowd with neon stage glow & confetti
      src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 16 / 9,
      colorAccent: '#10b981',
    },
    {
      id: 'battle-of-bands',
      title: 'Battle of the Bands',
      subtitle: 'Rock Amp • Electric Showdown',
      category: 'Music Competition',
      mediaType: 'image',
      // High-energy band performance with dramatic silhouette & spotlights
      src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 16 / 9,
      colorAccent: '#06b6d4',
    },
    {
      id: 'sanskriti-heritage',
      title: 'Sanskriti Showcase',
      subtitle: 'Grand Auditorium • Classical Fusion',
      category: 'Cultural Elegance',
      mediaType: 'image',
      // Classical dance & heritage performance with rich theatrical backdrop
      src: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 16 / 9,
      colorAccent: '#22c55e',
    },
    {
      id: 'twilight-celebration',
      title: 'Starry Fest Vignette',
      subtitle: 'Campus Square • Lantern Nights',
      category: 'Night Carnival',
      mediaType: 'image',
      // Warm golden hour & illuminated campus gathering
      src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 16 / 9,
      colorAccent: '#00ffcc',
    },
  ],
};

