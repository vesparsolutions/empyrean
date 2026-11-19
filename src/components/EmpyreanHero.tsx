import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RightArtworkLayer } from './RightArtworkLayer';
import { CinematicRibbonGallery } from './CinematicRibbonGallery';

interface EmpyreanHeroProps {
  onExploreClick?: () => void;
  prefersReducedMotion?: boolean;
  imageUrls?: string[];
  onProgressChange?: (progress: number) => void;
}

export const EmpyreanHero: React.FC<EmpyreanHeroProps> = ({
  onExploreClick,
  prefersReducedMotion = false,
  imageUrls,
  onProgressChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logoProgress, setLogoProgress] = useState(0);
  const [isRibbonTriggered, setIsRibbonTriggered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Phase state:
  // 'hero' = Initial grand entrance (scroll locked on body, waiting for single scroll)
  // 'transitioning' = Animating between hero and ribbon (all inputs intercepted & swallowed)
  // 'ribbon' = Landed in Ribbon section (normal native scrolling active)
  const phaseRef = useRef<'hero' | 'transitioning' | 'ribbon'>('hero');
  const currentProgressRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to lock/unlock document scrolling
  const lockDocumentScroll = useCallback(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockDocumentScroll = useCallback(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }, []);

  // Initial lifecycle: strictly start locked in the hero entrance at scroll position 0
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);
    lockDocumentScroll();
    phaseRef.current = 'hero';
    currentProgressRef.current = 0;
    setLogoProgress(0);
    onProgressChange?.(0);

    return () => {
      unlockDocumentScroll();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, [lockDocumentScroll, unlockDocumentScroll, onProgressChange]);

  // Subtle interactive mouse parallax (active when near top on desktop/laptop)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Smooth cinematic animation engine (cubic ease-in-out transition)
  const animateTo = useCallback(
    (target: number, durationMs = 1250) => {
      phaseRef.current = 'transitioning';
      lockDocumentScroll();

      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }

      if (prefersReducedMotion) {
        currentProgressRef.current = target;
        setLogoProgress(target);
        if (target === 1) {
          phaseRef.current = 'ribbon';
          unlockDocumentScroll();
        } else {
          phaseRef.current = 'hero';
          lockDocumentScroll();
        }
        return;
      }

      if (animRef.current) cancelAnimationFrame(animRef.current);

      const start = currentProgressRef.current;
      const delta = target - start;
      if (Math.abs(delta) < 0.005) {
        currentProgressRef.current = target;
        setLogoProgress(target);
        if (target === 1) {
          phaseRef.current = 'ribbon';
          unlockDocumentScroll();
        } else {
          phaseRef.current = 'hero';
          lockDocumentScroll();
        }
        return;
      }

      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);

        // Natural physical easing (smooth acceleration, swift travel, soft landing)
        const eased =
          t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const current = start + delta * eased;
        currentProgressRef.current = current;
        setLogoProgress(current);
        onProgressChange?.(current);

        // While transitioning, guarantee window stays at 0
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }

        if (t < 1) {
          animRef.current = requestAnimationFrame(step);
        } else {
          currentProgressRef.current = target;
          setLogoProgress(target);
          onProgressChange?.(target);
          animRef.current = null;

          // Cooldown buffer to swallow trailing momentum / freak scrolling
          cooldownTimerRef.current = setTimeout(() => {
            if (target === 1) {
              phaseRef.current = 'ribbon';
              unlockDocumentScroll(); // Normal scrolling resumes!
            } else {
              phaseRef.current = 'hero';
              lockDocumentScroll(); // Hero locked waiting for scroll
            }
            cooldownTimerRef.current = null;
          }, 350);
        }
      };

      animRef.current = requestAnimationFrame(step);
    },
    [prefersReducedMotion, lockDocumentScroll, unlockDocumentScroll, onProgressChange]
  );

  // Global event trigger for navbar/external interactions
  useEffect(() => {
    const handleCustomTrigger = () => {
      if (phaseRef.current === 'hero') {
        animateTo(1, 1250);
        onExploreClick?.();
      }
    };
    window.addEventListener('empyrean:trigger-ribbon', handleCustomTrigger);
    return () => window.removeEventListener('empyrean:trigger-ribbon', handleCustomTrigger);
  }, [animateTo, onExploreClick]);

  // Update Ribbon trigger state with hysteresis
  useEffect(() => {
    if (logoProgress >= 0.78) {
      setIsRibbonTriggered(true);
    } else if (logoProgress <= 0.35) {
      setIsRibbonTriggered(false);
    }
  }, [logoProgress]);

  // One-Scroll Gesture Listener & Input Lock
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      const currentPhase = phaseRef.current;

      // 1. In Hero Phase (Initial State)
      if (currentPhase === 'hero') {
        // Prevent all native scroll in hero section
        e.preventDefault();
        e.stopPropagation();

        // Any downward scroll triggers the smooth animation into the ribbon section
        if (e.deltaY > 3) {
          animateTo(1, 1250);
        }
        return;
      }

      // 2. In Transitioning Phase: Swallow ALL wheel events completely
      if (currentPhase === 'transitioning') {
        e.preventDefault();
        e.stopPropagation();

        // If animation completed but user is still wheeling frantically, extend cooldown
        if (!animRef.current && cooldownTimerRef.current) {
          clearTimeout(cooldownTimerRef.current);
          cooldownTimerRef.current = setTimeout(() => {
            phaseRef.current = 'ribbon';
            unlockDocumentScroll();
            cooldownTimerRef.current = null;
          }, 250);
        }
        return;
      }

      // 3. In Ribbon Phase: Normal scrolling is active!
      // If user scrolls up when already at the top of the page, return to hero
      if (currentPhase === 'ribbon' && window.scrollY <= 5 && e.deltaY < -15) {
        e.preventDefault();
        e.stopPropagation();
        animateTo(0, 1100);
        return;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentPhase = phaseRef.current;

      if (currentPhase === 'hero') {
        if (e.cancelable) e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY; // positive = swipe up = scroll down
        if (deltaY > 10) {
          animateTo(1, 1200);
        }
        return;
      }

      if (currentPhase === 'transitioning') {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (currentPhase === 'ribbon' && window.scrollY <= 5) {
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        if (deltaY < -18) {
          if (e.cancelable) e.preventDefault();
          animateTo(0, 1100);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentPhase = phaseRef.current;

      if (currentPhase === 'hero') {
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
          e.preventDefault();
          animateTo(1, 1250);
        } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
          e.preventDefault();
        }
        return;
      }

      if (currentPhase === 'transitioning') {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
        }
        return;
      }

      if (currentPhase === 'ribbon' && window.scrollY <= 5) {
        if (['ArrowUp', 'PageUp'].includes(e.key)) {
          e.preventDefault();
          animateTo(0, 1100);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [animateTo, unlockDocumentScroll]);

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      className="relative w-full h-screen bg-[#0b1839]"
    >
      {/* Viewport stage container */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0b1839]">
        {/* Full-bleed stage container */}
        <div
          id="hero-stage"
          className="relative w-full h-full max-w-[1920px] mx-auto flex items-center justify-center fest-bg-pattern select-none"
          style={{ overflow: 'visible' }}
        >
          {/* Deep Navy Vignette & Subtle Atmospheric Radial Glow */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#0b1839]/30 to-[#0b1839] pointer-events-none z-0" />

          {/* 3D Cinematic S-Ribbon Gallery (Triggered when logo reaches ~80% to top middle) */}
          <div
            id="cinematic-ribbon-wrapper"
            className="absolute inset-0 z-[20] flex items-center justify-center overflow-hidden"
            style={{
              pointerEvents: isRibbonTriggered ? 'auto' : 'none',
            }}
          >
            <CinematicRibbonGallery
              isTriggered={isRibbonTriggered}
              prefersReducedMotion={prefersReducedMotion}
              initialImageUrls={imageUrls}
            />
          </div>

          {/* Right Mosaic Artwork Layer (Exits towards bottom-right corner as user scrolls) */}
          <div
            id="right-artwork-wrapper"
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          >
            <RightArtworkLayer
              scrollProgress={logoProgress}
              prefersReducedMotion={prefersReducedMotion}
              mousePos={mousePos}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
