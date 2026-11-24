import React, { useRef, useState, useEffect, useCallback } from 'react';

interface EmpyreanHeroProps {
  onExploreClick?: () => void;
  prefersReducedMotion?: boolean;
  imageUrls?: string[];
  onProgressChange?: (progress: number) => void;
}

export const EmpyreanHero: React.FC<EmpyreanHeroProps> = ({
  onExploreClick,
  prefersReducedMotion = false,
  onProgressChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logoProgress, setLogoProgress] = useState(0);
  const [phase, setPhase] = useState<'hero' | 'transitioning' | 'content'>('hero');

  // Phase state:
  // 'hero' = Initial grand entrance (scroll locked on body, waiting for single scroll)
  // 'transitioning' = Animating between hero and content (all inputs intercepted & swallowed)
  // 'content' = Landed in content section (normal native scrolling active)
  const phaseRef = useRef<'hero' | 'transitioning' | 'content'>('hero');
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
    setPhase('hero');
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
      setPhase('transitioning');
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
        const nextPhase = clampedTarget === 1 ? 'content' : 'hero';
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
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
        const nextPhase = clampedTarget === 1 ? 'content' : 'hero';
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
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
              phaseRef.current = 'content';
              setPhase('content');
              unlockDocumentScroll();
            } else {
              phaseRef.current = 'hero';
              setPhase('hero');
              lockDocumentScroll();
            }
            cooldownTimerRef.current = null;
          }, 350);
        }
      };

      animRef.current = requestAnimationFrame(step);
    },
    [prefersReducedMotion, lockDocumentScroll, unlockDocumentScroll, onProgressChange]
  );

  // Global event triggers for navbar/external interactions
  useEffect(() => {
    const handleCustomTrigger = () => {
      if (phaseRef.current === 'hero') {
        animateTo(1, 1250);
        onExploreClick?.();
      }
    };

    const handleReturnToHero = () => {
      if (phaseRef.current === 'content') {
        window.scrollTo({ top: 0 });
        animateTo(0, 1100);
      }
    };

    window.addEventListener('empyrean:trigger-ribbon', handleCustomTrigger);
    window.addEventListener('empyrean:trigger-moments', handleCustomTrigger);
    window.addEventListener('empyrean:return-to-hero', handleReturnToHero);

    return () => {
      window.removeEventListener('empyrean:trigger-ribbon', handleCustomTrigger);
      window.removeEventListener('empyrean:trigger-moments', handleCustomTrigger);
      window.removeEventListener('empyrean:return-to-hero', handleReturnToHero);
    };
  }, [animateTo, onExploreClick]);

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

        // Any downward scroll triggers the smooth animation into the moments section
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

      // 3. In Content Phase: Normal scrolling is active!
      // If user scrolls up when already at the top of the page, return to hero
      if (currentPhase === 'content' && window.scrollY <= 5 && e.deltaY < -25) {
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

      if (currentPhase === 'content' && window.scrollY <= 5) {
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

      if (currentPhase === 'content' && window.scrollY <= 5) {
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

  const isHidden = phase === 'content' && logoProgress >= 0.99;

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      className="fixed inset-0 z-30 overflow-hidden select-none"
      style={{
        opacity: Math.max(0, 1 - logoProgress * 1.5),
        pointerEvents: logoProgress >= 0.8 ? 'none' : 'auto',
        display: isHidden ? 'none' : 'block',
      }}
    >
      {/* Viewport stage — clips any overflow so border frame doesn't scroll */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#071126]">
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

          {/* LAYER 1: Full-screen border is now managed globally at the root layout (sticking to the whole screen) */}

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 2 — Floral toran canopy hanging from the top center
              Reference: wide decorative hanging arch with bells, spans ~52% of top
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute -top-[1.5%] left-1/2 z-[8] pointer-events-none"
            style={{
              width: '52%',
              maxWidth: '820px',
              minWidth: '320px',
              transform: `translateX(-50%) translateY(${logoProgress * -25}%)`,
              opacity: Math.max(0, 1 - logoProgress * 2.8),
            }}
          >
            <img
              src="/hero/02_floral_canopy.webp"
              alt="Floral Canopy"
              className="w-full h-auto object-contain block"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 3 & 4 — Transparent Gold Line-Art Clouds + Sparkle Stars
          ═══════════════════════════════════════════════════════════════ */}
          {/* Left Gold Cloud */}
          <div
            className="absolute z-[5] pointer-events-none"
            style={{
              left: '11%',
              top: '18%',
              width: '14%',
              maxWidth: '210px',
              minWidth: '110px',
              opacity: Math.max(0, 1 - logoProgress * 3),
              transform: `translate(${logoProgress * -10}vw, ${logoProgress * -4}vh)`,
            }}
          >
            <img src="/hero/03_gold_cloud_left.webp" alt="" className="w-full h-auto object-contain" loading="eager" draggable={false} />
          </div>

          {/* Right Gold Cloud */}
          <div
            className="absolute z-[5] pointer-events-none"
            style={{
              right: '11%',
              top: '18%',
              width: '14%',
              maxWidth: '210px',
              minWidth: '110px',
              opacity: Math.max(0, 1 - logoProgress * 3),
              transform: `translate(${logoProgress * 10}vw, ${logoProgress * -4}vh)`,
            }}
          >
            <img src="/hero/04_gold_cloud_right.webp" alt="" className="w-full h-auto object-contain" loading="eager" draggable={false} />
          </div>

          {/* Twinkling 4-Point Golden Sparkle Stars from Reference */}
          <div
            className="absolute z-[4] pointer-events-none transition-opacity duration-500"
            style={{
              left: '11.5%',
              top: '40%',
              opacity: Math.max(0, 1 - logoProgress * 3),
            }}
          >
            <svg viewBox="0 0 24 24" fill="#f8c12c" className="w-4 h-4 animate-pulse drop-shadow-[0_0_8px_rgba(248,193,44,0.8)]">
              <path d="M12 0C12 7.5 7.5 12 0 12C7.5 12 12 16.5 12 24C12 16.5 16.5 12 24 12C16.5 12 12 7.5 12 0Z" />
            </svg>
          </div>
          <div
            className="absolute z-[4] pointer-events-none transition-opacity duration-500"
            style={{
              left: '26.8%',
              top: '19%',
              opacity: Math.max(0, 1 - logoProgress * 3),
            }}
          >
            <svg viewBox="0 0 24 24" fill="#f8c12c" className="w-3.5 h-3.5 animate-pulse drop-shadow-[0_0_8px_rgba(248,193,44,0.8)]" style={{ animationDelay: '0.7s' }}>
              <path d="M12 0C12 7.5 7.5 12 0 12C7.5 12 12 16.5 12 24C12 16.5 16.5 12 24 12C16.5 12 12 7.5 12 0Z" />
            </svg>
          </div>
          <div
            className="absolute z-[4] pointer-events-none transition-opacity duration-500"
            style={{
              right: '28.8%',
              top: '23.5%',
              opacity: Math.max(0, 1 - logoProgress * 3),
            }}
          >
            <svg viewBox="0 0 24 24" fill="#f8c12c" className="w-3 h-3 animate-pulse drop-shadow-[0_0_8px_rgba(248,193,44,0.8)]" style={{ animationDelay: '1.4s' }}>
              <path d="M12 0C12 7.5 7.5 12 0 12C7.5 12 12 16.5 12 24C12 16.5 16.5 12 24 12C16.5 12 12 7.5 12 0Z" />
            </svg>
          </div>
          <div
            className="absolute z-[4] pointer-events-none transition-opacity duration-500"
            style={{
              right: '12%',
              top: '40.5%',
              opacity: Math.max(0, 1 - logoProgress * 3),
            }}
          >
            <svg viewBox="0 0 24 24" fill="#f8c12c" className="w-3.5 h-3.5 animate-pulse drop-shadow-[0_0_8px_rgba(248,193,44,0.8)]" style={{ animationDelay: '0.3s' }}>
              <path d="M12 0C12 7.5 7.5 12 0 12C7.5 12 12 16.5 12 24C12 16.5 16.5 12 24 12C16.5 12 12 7.5 12 0Z" />
            </svg>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 5 — Snowy mountains & forest, full-width bottom panorama
              Reference: mountains span the full width along the bottom ~35vh tall
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 left-0 right-0 z-[6] pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - logoProgress * 2),
              transform: `translateY(${logoProgress * 15}%)`,
            }}
          >
            <img
              src="/hero/05_mountains_and_forest.webp"
              alt=""
              style={{ width: '100%', height: 'auto', maxHeight: '42vh', objectFit: 'cover', objectPosition: 'center bottom', display: 'block' }}
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 6 — Jammu truck (Truck(Presents IIM Jammu))
              Positioned in bottom-left corner attached to left border,
              overlapping behind the bottom & left screen border layers
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[7] pointer-events-none"
            style={{
              left: '14px',
              bottom: '2px',
              width: '18%',
              minWidth: '180px',
              maxWidth: '310px',
              opacity: Math.max(0, 1 - logoProgress * 2.2),
              transform: `translateX(${logoProgress * -26}vw)`,
            }}
          >
            <img
              src="/hero/Truck(Presents%20IIM%20Jammu).webp"
              alt="IIM Jammu Presents - Jammu Truck Art"
              className="w-full h-auto object-contain block"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 7 — Vinyl record (disc touching right border, behind lotus)
              Shifted right to touch the right border
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[7] pointer-events-none"
            style={{
              right: '-10px',
              bottom: '0px',
              width: '18%',
              minWidth: '210px',
              maxWidth: '320px',
              opacity: Math.max(0, 1 - logoProgress * 2.5),
              transform: `translate(${logoProgress * 16}vw, ${logoProgress * 12}vh)`,
            }}
          >
            <img
              src="/hero/08_vinyl_record_cd.webp"
              alt="Vinyl Record"
              className="w-full h-auto object-contain block"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 8 — Vintage microphone (stands behind lotus, stem connects with vinyl)
              Tilted slightly left, positioned above vinyl
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[8] pointer-events-none"
            style={{
              right: '7.5%',
              bottom: '17%',
              width: '7%',
              minWidth: '80px',
              maxWidth: '115px',
              opacity: Math.max(0, 1 - logoProgress * 2.5),
              transform: `translate(${logoProgress * 14}vw, ${logoProgress * 10}vh) rotate(-14deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <img
              src="/hero/07_vintage_microphone.webp"
              alt="Vintage Microphone"
              className="w-full h-auto object-contain block"
              loading="eager"
              draggable={false}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LAYER 9 — Pink lotus (IN FOREGROUND, overlapping vinyl & mic stem)
              Reduced size slightly as requested
          ═══════════════════════════════════════════════════════════════ */}
          <div
            className="absolute z-[9] pointer-events-none"
            style={{
              right: '2%',
              bottom: '-4px',
              width: '19.5%',
              minWidth: '230px',
              maxWidth: '350px',
              opacity: Math.max(0, 1 - logoProgress * 2),
              transform: `translate(${logoProgress * 18}vw, ${logoProgress * 14}vh)`,
            }}
          >
            <img
              src="/hero/06_pink_lotus.webp"
              alt="Pink Lotus"
              className="w-full h-auto object-contain block drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
              loading="eager"
              draggable={false}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
