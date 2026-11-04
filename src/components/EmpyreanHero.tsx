import React, { useRef, useState, useEffect } from 'react';
import { LeftArtworkLayer } from './LeftArtworkLayer';
import { RightArtworkLayer } from './RightArtworkLayer';
import { CentralLogo } from './CentralLogo';
import { Eye, EyeOff } from 'lucide-react';

interface EmpyreanHeroProps {
  onExploreClick: () => void;
  prefersReducedMotion?: boolean;
}

export const EmpyreanHero: React.FC<EmpyreanHeroProps> = ({
  onExploreClick,
  prefersReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showRefOverlay, setShowRefOverlay] = useState(false);
  const [refOpacity, setRefOpacity] = useState(0.4);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Monitor viewport resize for responsive element adjustments across mobile, tablet, and laptop
  useEffect(() => {
    const checkDevice = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setDeviceType('mobile');
      } else if (w < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Subtle interactive mouse parallax (active when near top on desktop/laptop)
  useEffect(() => {
    if (deviceType !== 'desktop' || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [deviceType, prefersReducedMotion]);

  // Compute scrubbed scroll progress within the pinned hero track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const totalScrollable = containerHeight - windowHeight;
      if (totalScrollable <= 0) {
        setScrollProgress(0);
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bottom border opacity - fades out quickly as user scrolls down
  const bottomBorderOpacity = Math.max(0, 1 - scrollProgress * 3.5);

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      className="relative w-full h-[125vh] bg-[#071026]"
    >
      {/* STICKY VIEWPORT: Pinned while user scrolls through the 125vh track */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#071026]">
        {/* Full-bleed stage container */}
        <div
          id="hero-stage"
          className="relative w-full h-full max-w-[1920px] mx-auto flex items-center justify-center overflow-hidden fest-bg-pattern select-none"
        >
          {/* Deep Navy Vignette & Subtle Atmospheric Radial Glow */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#071026]/40 to-[#071026] pointer-events-none z-0" />

          {/* Reference Image Comparison Overlay (QA Developer Tool) */}
          {showRefOverlay && (
            <div
              className="absolute inset-0 pointer-events-none z-50 transition-opacity"
              style={{ opacity: refOpacity }}
            >
              <img
                src="/assets/empyrean/reference-hero.jpg"
                alt="Source Truth Reference Composition"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* 1. Unified Left Artwork Layer (z-index: 10) */}
          <div
            id="left-artwork-wrapper"
            style={{
              transform: prefersReducedMotion || scrollProgress > 0.05
                ? 'none'
                : `translate3d(${mousePos.x * -8}px, ${mousePos.y * -4}px, 0)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="absolute inset-0 w-full h-full pointer-events-none z-[12]"
          >
            <LeftArtworkLayer
              scrollProgress={scrollProgress}
              prefersReducedMotion={prefersReducedMotion}
              deviceType={deviceType}
            />
          </div>

          {/* 2. Unified Right Artwork Layer (z-index: 10) */}
          <div
            id="right-artwork-wrapper"
            style={{
              transform: prefersReducedMotion || scrollProgress > 0.05
                ? 'none'
                : `translate3d(${mousePos.x * 8}px, ${mousePos.y * 4}px, 0)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            <RightArtworkLayer
              scrollProgress={scrollProgress}
              prefersReducedMotion={prefersReducedMotion}
              deviceType={deviceType}
            />
          </div>

          {/* 3. Central Logo Lockup (z-index: 30 - Always above artwork) */}
          <div
            id="central-logo-wrapper"
            style={{
              transform: prefersReducedMotion || scrollProgress > 0.05
                ? 'none'
                : `translate3d(${mousePos.x * -4}px, ${mousePos.y * -2}px, 0)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
          >
            <CentralLogo
              scrollProgress={scrollProgress}
              prefersReducedMotion={prefersReducedMotion}
              onExploreClick={onExploreClick}
            />
          </div>

          {/* 4. Bottom Folk-Art Border (z-index: 20 - Anchored to bottom edge) */}
          <div
            id="hero-bottom-border"
            className="absolute bottom-0 left-0 right-0 h-6 sm:h-7 md:h-8 pointer-events-none z-20 overflow-hidden"
            style={{
              opacity: bottomBorderOpacity,
              transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <picture>
              <source srcSet="/assets/empyrean/border-bottom.webp" type="image/webp" />
              <img
                src="/assets/empyrean/border-bottom.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </picture>
          </div>

          {/* Floating Reference Alignment Toggle (Developer QA tool) */}
          <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 bg-[#0c183a]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#f8c12c]/30 text-[11px] text-[#cbd5e1] shadow-xl">
            <button
              onClick={() => setShowRefOverlay(!showRefOverlay)}
              className="flex items-center gap-1.5 hover:text-[#f8c12c] transition-colors focus:outline-none"
              title="Compare rendered layers with the original reference image"
            >
              {showRefOverlay ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#f8c12c]" />
                  <span className="font-sub uppercase tracking-wider text-[#f8c12c]">Hide Ref</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span className="font-sub uppercase tracking-wider">Compare Ref</span>
                </>
              )}
            </button>
            {showRefOverlay && (
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={refOpacity}
                onChange={(e) => setRefOpacity(parseFloat(e.target.value))}
                className="w-16 h-1 accent-[#f8c12c] cursor-pointer"
                title="Overlay Opacity"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
