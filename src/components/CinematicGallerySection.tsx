import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Film,
  Camera,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface GalleryPhoto {
  id: string;
  title: string;
  tag: string;
  src: string;
  aspectRatio: number; // width / height
  widthClass: string;
  row: 'upper' | 'lower';
}

export interface VideoChapter {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  tag: string;
  thumbnailUrl: string;
  youtubeId?: string;
  description: string;
}

const SUPABASE_BUCKET_BASE_URL =
  'https://omgweuvobdpbotwteqxw.supabase.co/storage/v1/object/public/Memory';

// Curated Video Chapters (featuring official Empyrean 2025 After Movie)
const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'chapter-1',
    title: 'EMPYREAN 2025 | Official Festival Film',
    subtitle: 'The Grand After Movie • Produced by EKCetra',
    duration: '5:30',
    tag: 'Official 4K Film',
    thumbnailUrl: 'https://i.ytimg.com/vi/WKozIOqGmio/maxresdefault.jpg',
    youtubeId: 'WKozIOqGmio',
    description:
      'Relive the thunderous beats, electric stages, and unforgettable nights at IIM Jammu Jagti campus.',
  },
  {
    id: 'chapter-2',
    title: 'Star Night Euphoria — Pronites Live',
    subtitle: 'Celebrity Concerts & Ocean of Crowd',
    duration: '4:12',
    tag: 'Live Stage',
    thumbnailUrl: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-08 at 13.52.47.png')}`,
    youtubeId: 'WKozIOqGmio',
    description:
      'Headliners setting the stage ablaze under the starry Himalayan skies with thousands singing in unison.',
  },
  {
    id: 'chapter-3',
    title: 'Cultural Odyssey & Kashmiri Folk',
    subtitle: 'Traditional Rhythms & Classical Melodies',
    duration: '3:45',
    tag: 'Heritage',
    thumbnailUrl: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.32.png')}`,
    youtubeId: 'WKozIOqGmio',
    description:
      'The cultural soul of Jammu and Kashmir brought to life through intricate choreography and live instruments.',
  },
  {
    id: 'chapter-4',
    title: 'EDM Surge & Laser Mapping',
    subtitle: 'Midnight Basslines & Visual Spectacle',
    duration: '4:50',
    tag: 'Electronic',
    thumbnailUrl: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.11.png')}`,
    youtubeId: 'WKozIOqGmio',
    description:
      'Pulsing lights, neon fog, and high-octane electronic drops reverberating across the festival grounds.',
  },
];

// Curated Photos with authentic natural aspect ratios from Supabase "Memory" bucket
const INITIAL_UPPER_PHOTOS: GalleryPhoto[] = [
  {
    id: 'upper-1',
    title: 'Star Night — Live Headliner',
    tag: 'Pronite',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-08 at 13.52.47.png')}`,
    aspectRatio: 1.54,
    widthClass: 'w-[300px] sm:w-[360px] md:w-[410px] lg:w-[450px]',
    row: 'upper',
  },
  {
    id: 'upper-2',
    title: 'Campus Twilight & Lanterns',
    tag: 'Atmosphere',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.50.58.png')}`,
    aspectRatio: 0.69,
    widthClass: 'w-[155px] sm:w-[185px] md:w-[205px] lg:w-[225px]',
    row: 'upper',
  },
  {
    id: 'upper-3',
    title: 'Battle of the Bands Finale',
    tag: 'Music',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.32.png')}`,
    aspectRatio: 1.85,
    widthClass: 'w-[350px] sm:w-[420px] md:w-[480px] lg:w-[530px]',
    row: 'upper',
  },
  {
    id: 'upper-4',
    title: 'Kashmiri Ensemble & Harmony',
    tag: 'Folk Showcase',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.11.png')}`,
    aspectRatio: 0.78,
    widthClass: 'w-[170px] sm:w-[200px] md:w-[225px] lg:w-[245px]',
    row: 'upper',
  },
  {
    id: 'upper-5',
    title: 'Carnival & Artisan Bazaar',
    tag: 'Fest Grounds',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.01.png')}`,
    aspectRatio: 1.39,
    widthClass: 'w-[280px] sm:w-[330px] md:w-[370px] lg:w-[410px]',
    row: 'upper',
  },
  {
    id: 'upper-6',
    title: 'Street Dramatics & Nukkad Natak',
    tag: 'Dramatics',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.24.png')}`,
    aspectRatio: 0.55,
    widthClass: 'w-[135px] sm:w-[160px] md:w-[180px] lg:w-[195px]',
    row: 'upper',
  },
  {
    id: 'upper-7',
    title: 'Symphony of Lights & Crowd',
    tag: 'Main Stage',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.53.00.png')}`,
    aspectRatio: 1.7,
    widthClass: 'w-[340px] sm:w-[400px] md:w-[450px] lg:w-[500px]',
    row: 'upper',
  },
  {
    id: 'upper-8',
    title: 'Student Conclave & Arenas',
    tag: 'Management',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.21.png')}`,
    aspectRatio: 1.28,
    widthClass: 'w-[260px] sm:w-[310px] md:w-[350px] lg:w-[380px]',
    row: 'upper',
  },
];

const INITIAL_LOWER_PHOTOS: GalleryPhoto[] = [
  {
    id: 'lower-1',
    title: 'Grand Stage Pyrotechnics',
    tag: 'Visuals',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.37.png')}`,
    aspectRatio: 1.74,
    widthClass: 'w-[330px] sm:w-[390px] md:w-[440px] lg:w-[490px]',
    row: 'lower',
  },
  {
    id: 'lower-2',
    title: 'Acoustic Serenade Unplugged',
    tag: 'Unplugged',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.17.png')}`,
    aspectRatio: 0.58,
    widthClass: 'w-[140px] sm:w-[165px] md:w-[185px] lg:w-[200px]',
    row: 'lower',
  },
  {
    id: 'lower-3',
    title: 'National Dance Showcase',
    tag: 'Choreography',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.36.png')}`,
    aspectRatio: 1.45,
    widthClass: 'w-[285px] sm:w-[335px] md:w-[375px] lg:w-[415px]',
    row: 'lower',
  },
  {
    id: 'lower-4',
    title: 'Starlit Campus Reflections',
    tag: 'Campus',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.31.png')}`,
    aspectRatio: 0.72,
    widthClass: 'w-[160px] sm:w-[190px] md:w-[210px] lg:w-[230px]',
    row: 'lower',
  },
  {
    id: 'lower-5',
    title: 'Laser Mapping & EDM Rave',
    tag: 'DJ Night',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.53.08.png')}`,
    aspectRatio: 1.69,
    widthClass: 'w-[340px] sm:w-[400px] md:w-[450px] lg:w-[500px]',
    row: 'lower',
  },
  {
    id: 'lower-6',
    title: 'Heritage & Cultural Regalia',
    tag: 'Vogue Runway',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.51.45.png')}`,
    aspectRatio: 0.88,
    widthClass: 'w-[180px] sm:w-[210px] md:w-[235px] lg:w-[260px]',
    row: 'lower',
  },
  {
    id: 'lower-7',
    title: 'Classical Harmony & Sitar',
    tag: 'Classical',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-09 at 11.52.52.png')}`,
    aspectRatio: 0.71,
    widthClass: 'w-[155px] sm:w-[185px] md:w-[205px] lg:w-[225px]',
    row: 'lower',
  },
  {
    id: 'lower-8',
    title: 'The Midnight Euphoria Finale',
    tag: 'Memories',
    src: `${SUPABASE_BUCKET_BASE_URL}/${encodeURIComponent('Screenshot 2026-11-08 at 13.52.47.png')}`,
    aspectRatio: 1.54,
    widthClass: 'w-[300px] sm:w-[360px] md:w-[400px] lg:w-[440px]',
    row: 'lower',
  },
];

/** Reusable Abstract SVG & CSS Placeholder for loading or missing photographs */
const GalleryPlaceholder: React.FC<{
  photo: GalleryPhoto;
  className?: string;
}> = ({ photo, className = '' }) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-4 overflow-hidden select-none bg-gradient-to-br from-[#0c162d] via-[#071022] to-[#040814] ${className}`}
    >
      {/* Subtle geometric jali line pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(248, 193, 44, 0.4) 1px, transparent 1px),
            linear-gradient(45deg, rgba(224, 36, 117, 0.15) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(248, 193, 44, 0.15) 25%, transparent 25%)
          `,
          backgroundSize: '20px 20px, 40px 40px, 40px 40px',
        }}
      />
      {/* Ambient center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#f8c12c]/10 blur-2xl pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 w-full flex items-center justify-between text-[10px] tracking-widest uppercase font-sub text-[#f8c12c]/80">
        <span>{photo.tag}</span>
        <Sparkles className="w-3 h-3 text-[#f8c12c]/60" />
      </div>

      {/* Center Camera Icon with Rings */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full border border-[#f8c12c]/30 flex items-center justify-center bg-[#071026]/70 shadow-[0_0_15px_rgba(248,193,44,0.15)]">
          <Camera className="w-5 h-5 text-[#f8c12c]/90" />
        </div>
        <span className="text-xs text-[#e2d9cc]/75 font-editorial text-center px-2 line-clamp-1">
          {photo.title}
        </span>
      </div>

      {/* Bottom Accent */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <span className="text-[9px] uppercase tracking-wider text-[#94a3b8]/60 font-body">
          Empyrean Archive
        </span>
      </div>
    </div>
  );
};

/** Reusable Gallery Photo Card with lazy loading, graceful fallback and click zoom */
const GalleryPhotoCard: React.FC<{
  photo: GalleryPhoto;
  onOpenLightbox: (photo: GalleryPhoto) => void;
  isDuplicate?: boolean;
}> = ({ photo, onOpenLightbox, isDuplicate = false }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={() => onOpenLightbox(photo)}
      role="button"
      tabIndex={isDuplicate ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenLightbox(photo);
        }
      }}
      aria-label={`View photo: ${photo.title} (${photo.tag})`}
      className={`relative shrink-0 h-full ${photo.widthClass} group cursor-pointer overflow-hidden rounded-md border border-white/[0.08] bg-[#071022] shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:border-[#f8c12c]/40 hover:shadow-[0_8px_30px_rgba(248,193,44,0.18)] focus:outline-none focus:ring-1 focus:ring-[#f8c12c]/60`}
    >
      {/* Fallback / Loading Skeleton Placeholder */}
      {(!hasLoaded || hasError) && (
        <GalleryPlaceholder photo={photo} className="absolute inset-0 z-0" />
      )}

      {/* Actual Photograph */}
      {!hasError && (
        <img
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setHasLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out will-change-transform group-hover:scale-105 ${
            hasLoaded ? 'opacity-100': 'opacity-0'
          }`}
        />
      )}

      {/* Subtle Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-85 pointer-events-none" />

      {/* Delicate Hover Label Bar */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col justify-end translate-y-1 transition-transform duration-300 group-hover:translate-y-0 pointer-events-none">
        <span className="text-[10px] sm:text-[11px] font-sub uppercase tracking-widest text-[#f8c12c] font-medium drop-shadow-sm line-clamp-1">
          {photo.tag}
        </span>
        <h4 className="text-xs sm:text-sm font-editorial text-[#f8fafc] font-normal leading-snug drop-shadow-md line-clamp-1">
          {photo.title}
        </h4>
      </div>

      {/* Hover Zoom Icon Badge */}
      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-white/90">
        <Maximize2 className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};

export interface CinematicGallerySectionProps {
  prefersReducedMotion?: boolean;
  onRegisterClick?: (tier?: string) => void;
}

export const CinematicGallerySection: React.FC<CinematicGallerySectionProps> = ({
  prefersReducedMotion = false,
  onRegisterClick,
}) => {
  // Video player states
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeChapter = VIDEO_CHAPTERS[activeChapterIndex];

  // Photo data states
  const [upperPhotos, setUpperPhotos] = useState<GalleryPhoto[]>(INITIAL_UPPER_PHOTOS);
  const [lowerPhotos, setLowerPhotos] = useState<GalleryPhoto[]>(INITIAL_LOWER_PHOTOS);

  // Marquee duration states (computed dynamically from measured track widths)
  const [upperDuration, setUpperDuration] = useState(82); // default ~82s at 30px/s
  const [lowerDuration, setLowerDuration] = useState(98); // default ~98s at 25px/s

  // Track measurement refs
  const singleTrackRefUpper = useRef<HTMLDivElement>(null);
  const singleTrackRefLower = useRef<HTMLDivElement>(null);

  // Lightbox modal state
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Fetch real images from Supabase Storage "Memory" bucket if available
  useEffect(() => {
    let isMounted = true;
    async function loadSupabaseImages() {
      try {
        const { data, error } = await supabase.storage.from('Memory').list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });

        if (error || !data || data.length === 0) return;

        const imageFiles = data.filter((f) =>
          /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name)
        );

        if (!isMounted || imageFiles.length === 0) return;

        // Map files to public URLs
        const urls = imageFiles.map((f) => ({
          name: f.name,
          url: supabase.storage.from('Memory').getPublicUrl(f.name).data.publicUrl,
        }));

        // Rehydrate upper and lower photo arrays with live URLs
        setUpperPhotos((prev) =>
          prev.map((p, idx) => {
            const match = urls[idx % urls.length];
            return match ? { ...p, src: match.url } : p;
          })
        );

        setLowerPhotos((prev) =>
          prev.map((p, idx) => {
            // Offset by 3 for a different photographic arrangement
            const match = urls[(idx + 4) % urls.length];
            return match ? { ...p, src: match.url } : p;
          })
        );
      } catch (err) {
        console.warn('[CinematicGallery] Using curated fallback archive photos:', err);
      }
    }

    loadSupabaseImages();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate precise independent marquee durations based on actual rendered widths
  // Target speeds:
  // Upper row = ~30 CSS px / sec
  // Lower row = ~25 CSS px / sec (1.2x speed ratio)
  const calculateDurations = useCallback(() => {
    if (singleTrackRefUpper.current) {
      const widthUpper = singleTrackRefUpper.current.scrollWidth;
      if (widthUpper > 200) {
        const calculated = Math.round(widthUpper / 30);
        setUpperDuration(Math.max(35, calculated));
      }
    }
    if (singleTrackRefLower.current) {
      const widthLower = singleTrackRefLower.current.scrollWidth;
      if (widthLower > 200) {
        const calculated = Math.round(widthLower / 25);
        setLowerDuration(Math.max(40, calculated));
      }
    }
  }, []);

  useEffect(() => {
    // Initial measurement
    calculateDurations();

    // Measurement with ResizeObserver
    const observer = new ResizeObserver(() => {
      calculateDurations();
    });

    if (singleTrackRefUpper.current) observer.observe(singleTrackRefUpper.current);
    if (singleTrackRefLower.current) observer.observe(singleTrackRefLower.current);

    window.addEventListener('resize', calculateDurations);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateDurations);
    };
  }, [calculateDurations, upperPhotos, lowerPhotos]);

  // Handle Video Chapter Navigation
  const handlePrevChapter = () => {
    setIsPlaying(false);
    setActiveChapterIndex((prev) =>
      prev === 0 ? VIDEO_CHAPTERS.length - 1 : prev - 1
    );
  };

  const handleNextChapter = () => {
    setIsPlaying(false);
    setActiveChapterIndex((prev) =>
      prev === VIDEO_CHAPTERS.length - 1 ? 0 : prev + 1
    );
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section
      id="gallery"
      className="relative w-full overflow-hidden select-none text-[#f8fafc]"
      style={{
        backgroundColor: '#060a14',
        backgroundImage: `
          radial-gradient(circle at 50% 15%, rgba(16, 28, 58, 0.45) 0%, transparent 65%),
          radial-gradient(circle at 10% 85%, rgba(224, 36, 117, 0.04) 0%, transparent 55%),
          radial-gradient(circle at 90% 85%, rgba(248, 193, 44, 0.04) 0%, transparent 55%),
          linear-gradient(to bottom, #071026 0%, #060a14 18%, #050811 82%, #071026 100%)
        `,
      }}
      aria-label="Festival Aftermovie and Photo Gallery"
    >
      {/* ═══════════════════════════════════════════════════════════════
          0. ATMOSPHERIC BACKGROUND TEXTURE & AMBIENT STAR PARTICLES
      ═══════════════════════════════════════════════════════════════ */}
      {/* Subtle geometric jali motif overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(248, 193, 44, 0.6) 1px, transparent 1px),
            linear-gradient(to right, rgba(248, 193, 44, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(248, 193, 44, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px, 48px 48px, 48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Very subtle celestial star sparkles */}
      <div
        className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-[#f8c12c] rounded-full blur-[0.5px] opacity-40 animate-pulse pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-36 right-1/4 w-1 h-1 bg-[#fff] rounded-full blur-[0.5px] opacity-30 animate-pulse pointer-events-none"
        style={{ animationDelay: '1.4s' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-28 left-1/3 w-1.5 h-1.5 bg-[#f8c12c] rounded-full blur-[0.5px] opacity-35 animate-pulse pointer-events-none"
        style={{ animationDelay: '2.1s' }}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════════════
          1. INTRODUCTORY TEXT (Centered, Small, Elegant Serif)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-12 text-center">
        <span className="font-sub text-xs sm:text-sm uppercase tracking-[0.32em] text-[#f8c12c] font-medium inline-block mb-3">
          Chronicles of an Era Reimagined
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#f5ebd7] font-normal tracking-wide max-w-2xl mx-auto leading-snug">
          Moments & Reverie — The Visual Archive
        </h2>
        {/* Subtle Warm Divider */}
        <div
          className="w-16 h-px bg-gradient-to-r from-transparent via-[#f8c12c]/40 to-transparent mx-auto mt-4"
          aria-hidden="true"
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2. FEATURED VIDEO AND DESCRIPTION SECTION (Two Columns)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Cinematic 16:9 Video Player Card (col-span-7) */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-[#03060f] border border-white/[0.12] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] group">
              {isPlaying ? (
                /* Interactive Video Embed */
                <div className="relative w-full h-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeChapter.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeChapter.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                  {/* Close / Return to Poster Button */}
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-[#f8fafc] text-xs font-sub uppercase tracking-wider border border-white/20 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-lg"
                    aria-label="Close video player"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </div>
              ) : (
                /* Cinematic Video Thumbnail & Controls */
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* High-Resolution Thumbnail */}
                  <img
                    src={activeChapter.thumbnailUrl}
                    alt={activeChapter.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Vignette & Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 pointer-events-none" />

                  {/* Top Header Bar */}
                  <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#f8c12c]/30 text-[#f8c12c] text-[10px] sm:text-xs font-sub uppercase tracking-widest">
                      <Film className="w-3 h-3 text-[#f8c12c]" />
                      {activeChapter.tag}
                    </span>
                    <span className="text-xs font-body text-[#e2d9cc]/80 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/10">
                      {activeChapter.duration}
                    </span>
                  </div>

                  {/* Central Play Button */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f8c12c] text-[#071026] flex items-center justify-center shadow-[0_0_35px_rgba(248,193,44,0.55)] transition-all duration-300 transform group-hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#f8c12c] focus:ring-offset-2 focus:ring-offset-black"
                    aria-label={`Play video: ${activeChapter.title}`}
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#071026] ml-1" />
                    {/* Pulsing ambient ring */}
                    <span className="absolute inset-0 rounded-full border border-[#f8c12c]/60 animate-ping opacity-40 pointer-events-none" />
                  </button>

                  {/* Left & Right Chapter Switcher Chevrons */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevChapter();
                    }}
                    className="absolute left-3 sm:left-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/90 border border-white/15 backdrop-blur-md flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-[#f8c12c]"
                    aria-label="Previous video chapter"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextChapter();
                    }}
                    className="absolute right-3 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/90 border border-white/15 backdrop-blur-md flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-[#f8c12c]"
                    aria-label="Next video chapter"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Bottom Video Title & Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col pointer-events-none">
                    <h4 className="font-editorial text-lg sm:text-xl md:text-2xl text-[#f8fafc] font-normal drop-shadow-md line-clamp-1">
                      {activeChapter.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#cbd5e1]/90 font-body drop-shadow line-clamp-1 mt-0.5">
                      {activeChapter.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Chapter Carousel Indicators */}
            <div className="flex items-center justify-between mt-3 px-1 text-xs text-[#94a3b8]">
              <span className="font-sub text-[11px] uppercase tracking-wider text-[#e2d9cc]/70">
                Chapter {activeChapterIndex + 1} of {VIDEO_CHAPTERS.length}
              </span>
              <div className="flex items-center gap-1.5">
                {VIDEO_CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveChapterIndex(idx);
                    }}
                    aria-label={`Switch to ${ch.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeChapterIndex
                        ? 'w-6 bg-[#f8c12c]': 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Description (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Small Gold Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8c12c]/10 border border-[#f8c12c]/20 text-[#f8c12c] text-xs font-sub uppercase tracking-widest w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Echoes of Euphoria</span>
            </div>

            {/* Editorial Headline */}
            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#f3ede2] font-normal tracking-wide leading-tight mb-5">
              Where Heritage Meets The Pulse of Tomorrow
            </h3>

            {/* Narrative Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#d8cfc4] font-body leading-relaxed">
              <p>
                Set against the majestic silhouette of the Trikuta foothills, Empyrean is
                far more than an annual celebration—it is an ethereal convergence where youth
                culture, academic rigor, and creative grandeur coalesce into a three-day
                sanctuary of unbridled euphoria.
              </p>
              <p>
                From the thunderous basslines of headliner star nights to the intimate
                acoustic strums of starlit campfires, every hour resonates with collective
                passion. Our visual archive immortalizes these shared memories—spontaneous
                cheers, intense conclave debates, breathtaking dance showcases, and friendships
                forged beneath the night skies of IIM Jammu.
              </p>
            </div>

            {/* Festival Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10">
              <div>
                <span className="block font-editorial text-2xl sm:text-3xl text-[#f8c12c]">
                  25K+
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#94a3b8] font-sub">
                  Total Footfall
                </span>
              </div>
              <div>
                <span className="block font-editorial text-2xl sm:text-3xl text-[#f8c12c]">
                  50+
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#94a3b8] font-sub">
                  Fest Arenas
                </span>
              </div>
              <div>
                <span className="block font-editorial text-2xl sm:text-3xl text-[#f8c12c]">
                  3 Days
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#94a3b8] font-sub">
                  Pure Reverie
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. MAIN PHOTO GALLERY — TWO INFINITE HORIZONTAL ROWS
          Upper Row: ~30 px/s (approx. 1.2x faster)
          Lower Row: ~25 px/s
          Both scroll from RIGHT to LEFT seamlessly
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full pb-20 sm:pb-28 md:pb-36 overflow-hidden">
        {/* Soft edge fade gradients for seamless emergence */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-28 bg-gradient-to-r from-[#060a14] to-transparent z-20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-28 bg-gradient-to-l from-[#060a14] to-transparent z-20"
          aria-hidden="true"
        />

        {/* ─────────────────────────────────────────────────────────────
            A. UPPER PHOTO ROW (~30px/s)
        ───────────────────────────────────────────────────────────── */}
        <div className="w-full overflow-hidden select-none mb-3 sm:mb-4 md:mb-5">
          <div
            className={`flex items-center ${
              prefersReducedMotion ? '' : 'animate-marquee-rtl'
            } will-change-transform`}
            style={
              {
                '--marquee-duration': `${upperDuration}s`,
                animationDuration: `${upperDuration}s`,
              } as React.CSSProperties
            }
          >
            {/* Primary Track (measured for dynamic duration) */}
            <div
              ref={singleTrackRefUpper}
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[210px] sm:h-[235px] md:h-[260px] lg:h-[280px]"
            >
              {upperPhotos.map((photo) => (
                <GalleryPhotoCard
                  key={photo.id}
                  photo={photo}
                  onOpenLightbox={setSelectedPhoto}
                />
              ))}
            </div>

            {/* Identical Duplicate Track for 100% Seamless Infinite Looping */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[210px] sm:h-[235px] md:h-[260px] lg:h-[280px]"
            >
              {upperPhotos.map((photo) => (
                <GalleryPhotoCard
                  key={`${photo.id}-dup`}
                  photo={photo}
                  onOpenLightbox={setSelectedPhoto}
                  isDuplicate
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            B. LOWER PHOTO ROW (~25px/s, approx. 1.2x slower)
        ───────────────────────────────────────────────────────────── */}
        <div className="w-full overflow-hidden select-none">
          <div
            className={`flex items-center ${
              prefersReducedMotion ? '' : 'animate-marquee-rtl'
            } will-change-transform`}
            style={
              {
                '--marquee-duration': `${lowerDuration}s`,
                animationDuration: `${lowerDuration}s`,
              } as React.CSSProperties
            }
          >
            {/* Primary Track (measured for dynamic duration) */}
            <div
              ref={singleTrackRefLower}
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[190px] sm:h-[215px] md:h-[240px] lg:h-[260px]"
            >
              {lowerPhotos.map((photo) => (
                <GalleryPhotoCard
                  key={photo.id}
                  photo={photo}
                  onOpenLightbox={setSelectedPhoto}
                />
              ))}
            </div>

            {/* Identical Duplicate Track for 100% Seamless Infinite Looping */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[190px] sm:h-[215px] md:h-[240px] lg:h-[260px]"
            >
              {lowerPhotos.map((photo) => (
                <GalleryPhotoCard
                  key={`${photo.id}-dup`}
                  photo={photo}
                  onOpenLightbox={setSelectedPhoto}
                  isDuplicate
                />
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Bottom Caption */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-[#94a3b8]/70 font-body">
            Hover over any photograph to pause the gallery stream • Click to expand in high definition
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          4. CINEMATIC LIGHTBOX MODAL (Full Resolution View)
      ═══════════════════════════════════════════════════════════════ */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-[#071026] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white/90 border border-white/20 flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-[#f8c12c]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Preview */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center bg-black/40 overflow-hidden">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[75vh] object-contain block select-none"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="w-full p-4 sm:p-6 bg-[#060a14] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-widest font-sub text-[#f8c12c] font-medium">
                  {selectedPhoto.tag}
                </span>
                <h3 className="font-editorial text-xl sm:text-2xl text-[#f8fafc] font-normal leading-snug">
                  {selectedPhoto.title}
                </h3>
              </div>

              {onRegisterClick && (
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    onRegisterClick();
                  }}
                  className="px-5 py-2 rounded-full bg-[#f8c12c] hover:bg-[#c98c11] text-[#071026] text-xs uppercase tracking-wider font-sub font-semibold transition-colors shadow-[0_0_15px_rgba(248,193,44,0.3)]"
                >
                  Join Empyrean 2026
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
