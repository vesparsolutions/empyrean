import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, X } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  src: string;
  aspectRatio: number; // width / height
}

export interface VideoChapter {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  thumbnailUrl: string;
  youtubeId?: string;
  description: string;
}

// Curated Video (featuring official Empyrean 2025 After Movie)
const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'official-aftermovie',
    title: 'EMPYREAN 2025 | Official Festival Film',
    subtitle: 'The Grand After Movie • IIM Jammu',
    duration: '5:30',
    thumbnailUrl: 'https://i.ytimg.com/vi/WKozIOqGmio/maxresdefault.jpg',
    youtubeId: 'WKozIOqGmio',
    description:
      'Relive the thunderous beats, electric stages, and unforgettable nights at IIM Jammu Jagti campus.',
  },
];

// Clean Local WebP Photos from the past folder with authentic natural aspect ratios
const UPPER_PHOTOS: GalleryPhoto[] = [
  { id: 'u-1', src: '/past/memory-1.webp', aspectRatio: 616 / 888 },
  { id: 'u-2', src: '/past/memory-4.webp', aspectRatio: 1382 / 746 },
  { id: 'u-3', src: '/past/memory-2.webp', aspectRatio: 912 / 1572 },
  { id: 'u-4', src: '/past/memory-7.webp', aspectRatio: 1388 / 1000 },
  { id: 'u-5', src: '/past/memory-6.webp', aspectRatio: 1156 / 1320 },
  { id: 'u-6', src: '/past/memory-12.webp', aspectRatio: 1506 / 886 },
  { id: 'u-7', src: '/past/memory-3.webp', aspectRatio: 572 / 1036 },
  { id: 'u-8', src: '/past/memory-5.webp', aspectRatio: 1160 / 668 },
];

const LOWER_PHOTOS: GalleryPhoto[] = [
  { id: 'l-1', src: '/past/memory-8.webp', aspectRatio: 1064 / 832 },
  { id: 'l-2', src: '/past/memory-9.webp', aspectRatio: 970 / 1356 },
  { id: 'l-3', src: '/past/memory-10.webp', aspectRatio: 1040 / 716 },
  { id: 'l-4', src: '/past/memory-11.webp', aspectRatio: 1212 / 1714 },
  { id: 'l-5', src: '/past/memory-13.webp', aspectRatio: 1452 / 860 },
  { id: 'l-6', src: '/past/memory-4.webp', aspectRatio: 1382 / 746 },
  { id: 'l-7', src: '/past/memory-1.webp', aspectRatio: 616 / 888 },
  { id: 'l-8', src: '/past/memory-7.webp', aspectRatio: 1388 / 1000 },
];

/** Clean Gallery Photo Card — Pure photographic presentation without text clutter */
const GalleryPhotoCard: React.FC<{
  photo: GalleryPhoto;
}> = ({ photo }) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div
      className="relative shrink-0 h-full group/card overflow-hidden rounded-lg border border-white/[0.08] bg-[#071022] shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:scale-105 hover:z-20 hover:border-[#f8c12c]/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.85)] cursor-pointer"
      style={{
        aspectRatio: `${photo.aspectRatio}`,
      }}
    >
      <img
        src={photo.src}
        alt="Empyrean Festival Moment"
        loading="lazy"
        decoding="async"
        onLoad={() => setHasLoaded(true)}
        className={`w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
          hasLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Subtle cinematic edge vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-30 transition-opacity duration-300 group-hover/card:opacity-0 pointer-events-none" />
    </div>
  );
};

export interface CinematicGallerySectionProps {
  prefersReducedMotion?: boolean;
  onRegisterClick?: (tier?: string) => void;
}

export const CinematicGallerySection: React.FC<CinematicGallerySectionProps> = ({
  prefersReducedMotion = false,
}) => {
  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const activeChapter = VIDEO_CHAPTERS[0];

  // Marquee duration states (computed dynamically from measured track widths)
  const [upperDuration, setUpperDuration] = useState(75);
  const [lowerDuration, setLowerDuration] = useState(90);

  // Track measurement refs
  const singleTrackRefUpper = useRef<HTMLDivElement>(null);
  const singleTrackRefLower = useRef<HTMLDivElement>(null);

  // Calculate precise independent marquee durations based on actual rendered widths
  const calculateDurations = useCallback(() => {
    if (singleTrackRefUpper.current) {
      const widthUpper = singleTrackRefUpper.current.scrollWidth;
      if (widthUpper > 0) {
        setUpperDuration(Math.max(35, Math.round(widthUpper / 32)));
      }
    }
    if (singleTrackRefLower.current) {
      const widthLower = singleTrackRefLower.current.scrollWidth;
      if (widthLower > 0) {
        setLowerDuration(Math.max(40, Math.round(widthLower / 26)));
      }
    }
  }, []);

  useEffect(() => {
    calculateDurations();
    const timer = setTimeout(calculateDurations, 500);
    window.addEventListener('resize', calculateDurations);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateDurations);
    };
  }, [calculateDurations]);

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

      {/* Subtle celestial star sparkles */}
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
          1. INTRODUCTORY TEXT
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
          2. FEATURED VIDEO AND DESCRIPTION SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Cinematic 16:9 Video Player Card */}
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
                    className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-[#f8fafc] text-xs font-sub uppercase tracking-wider border border-white/20 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-lg cursor-pointer"
                    aria-label="Close video player"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </div>
              ) : (
                /* Cinematic Video Thumbnail & Controls */
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={activeChapter.thumbnailUrl}
                    alt={activeChapter.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 pointer-events-none" />

                  {/* Top Header Bar */}
                  <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-end z-10 pointer-events-none">
                    <span className="text-xs font-body text-[#e2d9cc]/80 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/10">
                      {activeChapter.duration}
                    </span>
                  </div>

                  {/* Central Subtle Play Button */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/50 hover:bg-[#071026]/90 border border-white/25 hover:border-[#f8c12c]/60 text-[#f8fafc] hover:text-[#f8c12c] flex items-center justify-center backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label={`Play video: ${activeChapter.title}`}
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5 text-[#fff8ed] group-hover:text-[#f8c12c] transition-colors" />
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
          </div>

          {/* Right Column: Editorial Description */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#f3ede2] font-normal tracking-wide leading-tight mb-5">
              Where Heritage Meets The Pulse of Tomorrow
            </h3>

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
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. MAIN PHOTO GALLERY — TWO INFINITE HORIZONTAL ROWS
          - Upper Row: ~30 px/s
          - Lower Row: ~25 px/s
          - Hovering pauses animation and magnifies photo slightly
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full pb-16 sm:pb-24 md:pb-28 overflow-hidden">
        {/* Soft edge fade gradients for seamless emergence */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-28 bg-gradient-to-r from-[#060a14] to-transparent z-20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-28 bg-gradient-to-l from-[#060a14] to-transparent z-20"
          aria-hidden="true"
        />

        {/* UPPER PHOTO ROW (~30px/s) */}
        <div className="w-full overflow-hidden select-none mb-3 sm:mb-4 md:mb-5 group/upper">
          <div
            className={`flex items-center ${
              prefersReducedMotion ? '' : 'animate-marquee-rtl'
            } will-change-transform group-hover/upper:[animation-play-state:paused]`}
            style={
              {
                '--marquee-duration': `${upperDuration}s`,
                animationDuration: `${upperDuration}s`,
              } as React.CSSProperties
            }
          >
            {/* Primary Track */}
            <div
              ref={singleTrackRefUpper}
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[210px] sm:h-[235px] md:h-[260px] lg:h-[280px]"
            >
              {UPPER_PHOTOS.map((photo) => (
                <GalleryPhotoCard key={photo.id} photo={photo} />
              ))}
            </div>

            {/* Seamless Infinite Duplicate Track */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[210px] sm:h-[235px] md:h-[260px] lg:h-[280px]"
            >
              {UPPER_PHOTOS.map((photo) => (
                <GalleryPhotoCard key={`${photo.id}-dup`} photo={photo} />
              ))}
            </div>
          </div>
        </div>

        {/* LOWER PHOTO ROW (~25px/s) */}
        <div className="w-full overflow-hidden select-none group/lower">
          <div
            className={`flex items-center ${
              prefersReducedMotion ? '' : 'animate-marquee-rtl'
            } will-change-transform group-hover/lower:[animation-play-state:paused]`}
            style={
              {
                '--marquee-duration': `${lowerDuration}s`,
                animationDuration: `${lowerDuration}s`,
              } as React.CSSProperties
            }
          >
            {/* Primary Track */}
            <div
              ref={singleTrackRefLower}
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[190px] sm:h-[215px] md:h-[240px] lg:h-[260px]"
            >
              {LOWER_PHOTOS.map((photo) => (
                <GalleryPhotoCard key={photo.id} photo={photo} />
              ))}
            </div>

            {/* Seamless Infinite Duplicate Track */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 h-[190px] sm:h-[215px] md:h-[240px] lg:h-[260px]"
            >
              {LOWER_PHOTOS.map((photo) => (
                <GalleryPhotoCard key={`${photo.id}-dup`} photo={photo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
