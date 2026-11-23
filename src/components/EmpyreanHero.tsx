import React, { useRef, useState, useEffect, useCallback } from 'react';
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

  // Phase state:
  // 'hero' = Initial grand entrance (scroll locked on body, waiting for single scroll)
  // 'transitioning' = Animating between hero and ribbon (all inputs intercepted & swallowed)
  // 'ribbon' = Landed in Ribbon section (normal native scrolling active)
  const phaseRef = useRef<'hero' | 'transitioning' | 'ribbon'>('hero');
  const currentProgressRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Generation counter — incremented every time a new animation is kicked off.
  // Each rAF step compares its own generation; if it's stale it self-cancels.
  const animGenRef = useRef(0);

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



  // Smooth cinematic animation engine — bullet-proof against aggressive/concurrent scrolling.
  // Uses a generation counter so stale rAF loops self-terminate immediately when a new
  // animation is kicked off, eliminating every race condition.
  const animateTo = useCallback(
    (target: number, durationMs = 1250) => {
      // ── 1. Bump generation so any currently-running rAF loop sees it's stale ──
      const gen = ++animGenRef.current;

      // ── 2. Clamp target just in case ──
      const clampedTarget = Math.min(1, Math.max(0, target));

      // ── 3. Lock phase & scroll immediately ──
      phaseRef.current = 'transitioning';
      lockDocumentScroll();
      window.scrollTo(0, 0);

      // ── 4. Cancel any pending cooldown timer ──
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }

      // ── 5. Cancel any in-flight rAF ──
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }

      // ── 6. Reduced-motion shortcut ──
      if (prefersReducedMotion) {
        currentProgressRef.current = clampedTarget;
        setLogoProgress(clampedTarget);
        onProgressChange?.(clampedTarget);
        phaseRef.current = clampedTarget === 1 ? 'ribbon' : 'hero';
        if (clampedTarget === 1) {
          unlockDocumentScroll();
        } else {
          lockDocumentScroll();
        }
        return;
      }

      // ── 7. Skip trivially short trips ──
      const start = currentProgressRef.current;
      const delta = clampedTarget - start;
      if (Math.abs(delta) < 0.004) {
        currentProgressRef.current = clampedTarget;
        setLogoProgress(clampedTarget);
        onProgressChange?.(clampedTarget);
        phaseRef.current = clampedTarget === 1 ? 'ribbon' : 'hero';
        if (clampedTarget === 1) unlockDocumentScroll();
        else lockDocumentScroll();
        return;
      }

      const startTime = performance.now();

      const step = (now: number) => {
        // ── Stale generation → self-terminate silently ──
        if (gen !== animGenRef.current) return;

        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);

        // Smooth cubic ease-in-out
        const eased =
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const current = start + delta * eased;
        currentProgressRef.current = current;
        setLogoProgress(current);
        onProgressChange?.(current);

        // Always keep window at 0 while animating
        if (window.scrollY !== 0) window.scrollTo(0, 0);

        if (t < 1) {
          animRef.current = requestAnimationFrame(step);
        } else {
          // Animation complete — snap to exact target
          currentProgressRef.current = clampedTarget;
          setLogoProgress(clampedTarget);
          onProgressChange?.(clampedTarget);
          animRef.current = null;

          // Short cooldown to swallow any trailing wheel/touch momentum
          // before handing control back (350 ms is enough for trackpads)
          cooldownTimerRef.current = setTimeout(() => {
            // Guard: only commit if this generation is still current
            if (gen !== animGenRef.current) return;
            if (clampedTarget === 1) {
              phaseRef.current = 'ribbon';
              unlockDocumentScroll();
            } else {
              phaseRef.current = 'hero';
              lockDocumentScroll();
            }
            cooldownTimerRef.current = null;
          }, 400);
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

      // 2. In Transitioning Phase: Swallow ALL wheel events completely — do nothing else.
      // The animation engine will finish on its own and transition phase correctly.
      if (currentPhase === 'transitioning') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // 3. In Ribbon Phase: Normal scrolling is active!
      // If user scrolls up when already at the top of the page, return to hero
      if (currentPhase === 'ribbon' && window.scrollY <= 5 && e.deltaY < -15) {
        e.preventDefault();
        e.stopPropagation();
        animateTo(0, 1100);
        return;
      }    };

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
      {/* Viewport stage — clips any overflow so border frame doesn't scroll */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0b1839]">
        {/* Full-bleed stage */}
        <div
          id="hero-stage"
          className="relative w-full h-full max-w-[1920px] mx-auto select-none"
          style={{ overflow: 'hidden' }}
        >

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 0 — Deep Navy sky background + subtle star twinkles
          ═══════════════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 z-0 bg-[#071126]" />

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 1 — Full-screen ornate folk-art border frame
              Reference: colorful red/gold border wrapping the full viewport
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - logoProgress * 2.5),
            }}
          >
            <img
              src="/hero/01_ornate_border_frame.webp"
              alt=""
              className="w-full h-full object-fill"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 2 — Floral toran canopy hanging from the top center
              Reference: wide decorative hanging arch with bells, spans ~70% of top
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute top-0 left-1/2 z-[8] pointer-events-none"
            style={{
              width: '70%',
              maxWidth: '1000px',
              transform: `translateX(-50%) translateY(calc(-10% + ${logoProgress * -22}%))`,
              opacity: Math.max(0, 1 - logoProgress * 2.8),
            }}
          >
            <img
              src="/hero/02_floral_canopy.webp"
              alt=""
              className="w-full h-auto object-contain"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 3 — Gold cloud left (upper-left, below canopy left side)
              Reference: small golden clouds about 20% from top, 8% from left
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[5] pointer-events-none"
            style={{
              left: '8%',
              top: '18%',
              width: '16%',
              maxWidth: '220px',
              opacity: Math.max(0, 1 - logoProgress * 3),
              transform: `translate(${logoProgress * -10}vw, ${logoProgress * -4}vh)`,
            }}
          >
            <img src="/hero/03_gold_cloud_left.webp" alt="" className="w-full h-auto" loading="eager" draggable={false} />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 4 — Gold cloud right (upper-right, symmetric to left cloud)
              Reference: ~74% from left, 18% from top
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[5] pointer-events-none"
            style={{
              right: '8%',
              top: '18%',
              width: '14%',
              maxWidth: '200px',
              opacity: Math.max(0, 1 - logoProgress * 3),
              transform: `translate(${logoProgress * 10}vw, ${logoProgress * -4}vh)`,
            }}
          >
            <img src="/hero/04_gold_cloud_right.webp" alt="" className="w-full h-auto" loading="eager" draggable={false} />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 5 — Snowy mountains & forest, full-width bottom panorama
              Reference: mountains span the full width along the bottom ~35vh tall
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[6] pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - logoProgress * 2),
              transform: `translateY(${logoProgress * 15}%)`,
            }}
          >
            <img
              src="/hero/05_mountains_and_forest.webp"
              alt=""
              style={{ width: '100%', height: 'auto', maxHeight: '38vh', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 6 — Jammu truck / bus (left side, bottom-left quadrant)
              Reference: colorful Jammu truck ~25-30% wide peeking from left edge
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[7] pointer-events-none"
            style={{
              left: '-1%',
              bottom: '3%',
              width: '28%',
              maxWidth: '400px',
              opacity: Math.max(0, 1 - logoProgress * 2.2),
              transform: `translateX(${logoProgress * -26}vw)`,
            }}
          >
            <img
              src="/right-elements/jammu-truck.webp"
              alt=""
              className="w-full h-auto object-contain"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 7 — Vintage microphone (right side, mid-lower area)
              Reference: retro chrome mic ~88% from left, ~45% from top, ~6% wide
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[9] pointer-events-none"
            style={{
              right: '6%',
              bottom: '12%',
              width: '6%',
              maxWidth: '80px',
              opacity: Math.max(0, 1 - logoProgress * 2.5),
              transform: `translate(${logoProgress * 14}vw, ${logoProgress * 10}vh)`,
            }}
          >
            <img src="/hero/07_vintage_microphone.webp" alt="" className="w-full h-auto" loading="eager" draggable={false} />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 8 — Vinyl record (bottom-right, partially behind mic)
              Reference: vinyl ~12% wide, bottom-right corner, z below mic
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[8] pointer-events-none"
            style={{
              right: '3%',
              bottom: '3%',
              width: '12%',
              maxWidth: '160px',
              opacity: Math.max(0, 1 - logoProgress * 2.5),
              transform: `translate(${logoProgress * 16}vw, ${logoProgress * 12}vh)`,
            }}
          >
            <img src="/hero/08_vinyl_record_cd.webp" alt="" className="w-full h-auto" loading="eager" draggable={false} />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 9 — Pink lotus (bottom-right corner, large, behind mic+vinyl)
              Reference: big pink lotus ~20% wide, anchored to bottom-right corner
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[7] pointer-events-none"
            style={{
              right: '-1%',
              bottom: '-1%',
              width: '20%',
              maxWidth: '280px',
              opacity: Math.max(0, 1 - logoProgress * 2),
              transform: `translate(${logoProgress * 18}vw, ${logoProgress * 14}vh)`,
            }}
          >
            <img src="/hero/06_pink_lotus.webp" alt="" className="w-full h-auto" loading="eager" draggable={false} />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 10 — Ribbon Gallery (triggers on scroll complete)
          ═══════════════════════════════════════════════════════════════ */}
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

        </div>
      </div>
    </div>
  );
};
