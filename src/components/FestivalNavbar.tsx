import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

interface FestivalNavbarProps {
  progress: number; // 0 (dead center in hero) to 1 (docked at top)
  prefersReducedMotion?: boolean;
  onExploreClick?: () => void;
  onRegisterClick?: (tier?: string) => void;
  currentPage?: 'home' | 'partners';
  onNavigate?: (page: 'home' | 'partners', section?: string) => void;
}

export const FestivalNavbar: React.FC<FestivalNavbarProps> = ({
  progress = 0,
  prefersReducedMotion = false,
  onExploreClick,
  onRegisterClick,
  currentPage = 'home',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Normalise progress between 0 and 1; on partners page, always docked at top (progress = 1)
  const effectiveProgress = currentPage === 'partners' ? 1 : progress;
  const logoProgress = Math.min(1, Math.max(0, effectiveProgress));
  const isDocked = logoProgress >= 0.95;

  // Idle subtle mouse parallax when logo is centered in hero phase
  useEffect(() => {
    if (prefersReducedMotion || currentPage === 'partners') return;
    const handleMouseMove = (e: MouseEvent) => {
      if (logoProgress > 0.05) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, logoProgress, currentPage]);

  // Smooth Scroll Navigation Handlers
  const handleNavigate = useCallback(
    (
      target:
        | 'artists'
        | 'events'
        | 'experience'
        | 'partners'
        | 'register'
        | 'top'
        | 'sponsors'
        | 'gallery'
        | 'memories'
        | 'aftermovie'
    ) => {
      setMobileMenuOpen(false);

      if (target === 'partners') {
        if (currentPage === 'partners') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          onNavigate?.('partners');
        }
        return;
      }

      if (target === 'register') {
        onRegisterClick?.();
        return;
      }

      // If on Partners page and user clicks a Home section:
      if (currentPage === 'partners') {
        onNavigate?.('home', target);
        return;
      }

      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (target === 'sponsors') {
        document.getElementById('sponsors')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // If user is still in hero phase (progress < 1), trigger transition first
      if (logoProgress < 0.95) {
        window.dispatchEvent(new CustomEvent('empyrean:trigger-moments'));
        window.dispatchEvent(new CustomEvent('empyrean:trigger-ribbon'));
        if (target === 'artists') {
          setTimeout(() => {
            document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' });
          }, 1300);
        } else if (target === 'events') {
          setTimeout(() => {
            document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
          }, 1300);
        } else if (target === 'gallery' || target === 'memories' || target === 'aftermovie') {
          setTimeout(() => {
            document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
          }, 1300);
        } else if (target === 'experience') {
          setTimeout(() => {
            window.scrollTo({ top: window.innerHeight * 0.45, behavior: 'smooth' });
          }, 1300);
        }
        return;
      }

      if (target === 'artists') {
        document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'events') {
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'gallery' || target === 'memories' || target === 'aftermovie') {
        document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'experience') {
        window.scrollTo({ top: window.innerHeight * 0.45, behavior: 'smooth' });
      }
    },
    [logoProgress, onRegisterClick, currentPage, onNavigate]
  );

  const handleHeroLogoClick = () => {
    if (currentPage === 'partners') {
      onNavigate?.('home', 'top');
      return;
    }
    if (logoProgress < 0.95) {
      window.dispatchEvent(new CustomEvent('empyrean:trigger-moments'));
      window.dispatchEvent(new CustomEvent('empyrean:trigger-ribbon'));
      onExploreClick?.();
    } else {
      if (typeof window !== 'undefined' && window.scrollY <= 10) {
        window.dispatchEvent(new CustomEvent('empyrean:return-to-hero'));
      } else {
        handleNavigate('top');
      }
    }
  };

  // -------------------------------------------------------------
  // Animation Interpolation for Logo Travel
  // At progress = 0: dead center of viewport (50vh)
  // At progress = 1: docked in navbar (vertical center ~38px from top)
  // -------------------------------------------------------------
  // Base upward offset at progress 0 so logo sits close to canopy
  const baseUpwardOffsetVh = -7;
  const currentBaseY = baseUpwardOffsetVh * (1 - logoProgress);
  const scale = prefersReducedMotion ? 1 : 1.0 - logoProgress * 0.76;
  const ty = prefersReducedMotion ? 0 : currentBaseY - logoProgress * 50;
  const targetPx = prefersReducedMotion ? 0 : logoProgress * 38;

  const logoTransform = prefersReducedMotion
    ? 'none'
    : logoProgress <= 0.05
    ? `translate3d(${mousePos.x * -4}px, calc(${baseUpwardOffsetVh}vh + ${mousePos.y * -2}px), 0)`
    : `translate3d(0, calc(${ty}vh + ${targetPx}px), 0) scale(${scale})`;

  // Headings & Navbar background opacity (fades in as logo approaches top)
  const navContentOpacity = Math.max(0, Math.min(1, (logoProgress - 0.72) / 0.28));

  // Theme styles: light parchment theme throughout
  const isParchment = true;

  return (
    <>
      {/* 
        ========================================================================
        1. FLOATING ROUNDED-PILL TOP NAVBAR
        Docked at top-center. Rounded edges with dynamic theme switching
        between Deep Navy and Warm Parchment to match the underlying section.
        Fades and scales in smoothly as the central logo docks at the top.
        ========================================================================
      */}
      <header
        id="festival-fixed-navbar"
        className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center pointer-events-none select-none px-3 sm:px-4"
        style={{
          opacity: navContentOpacity > 0.02 ? 1 : 0,
          pointerEvents: isDocked ? 'auto' : 'none',
        }}
      >
        <div
          className={`relative pointer-events-auto rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-6 md:gap-10 transition-all duration-500 shadow-2xl backdrop-blur-xl ${
            isParchment
              ? 'bg-[#FAF4E8]/92 border border-[#b45309]/25 shadow-[0_8px_32px_rgba(90,40,10,0.12)] text-[#1a0f05]'
              : 'bg-[#071026]/85 border border-[#f8c12c]/20 shadow-[0_8px_32px_rgba(2,6,18,0.55)] text-[#fef3c7]'
          }`}
          style={{
            transform: `scale(${0.92 + navContentOpacity * 0.08})`,
            transition: 'opacity 0.4s ease, transform 0.4s ease, background-color 0.5s ease, border-color 0.5s ease',
          }}
        >
          {/* MOBILE LEFT SPACER: Balances the right-side hamburger button on small screens */}
          <div className="w-8 h-8 md:hidden pointer-events-none" aria-hidden="true" />

          {/* LEFT HEADINGS: Artists & Events */}
          <nav className="hidden md:flex items-center justify-end gap-[90px] lg:gap-[106px] flex-1">
            <button
              type="button"
              onClick={() => handleNavigate('artists')}
              className="group relative text-xs sm:text-sm font-sub uppercase tracking-[0.24em] transition-all cursor-pointer text-[#1a0f05] hover:text-[#991b1b] font-bold"
            >
              <span>Artists</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full bg-[#991b1b]" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('events')}
              className="group relative text-xs sm:text-sm font-sub uppercase tracking-[0.24em] transition-all cursor-pointer text-[#1a0f05] hover:text-[#991b1b] font-bold"
            >
              <span>Events</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full bg-[#991b1b]" />
            </button>
          </nav>

          {/* CENTER DOCK SPACER: Reserve hit area for the docked logo */}
          <div
            className="w-28 sm:w-36 md:w-44 h-8 sm:h-9 flex items-center justify-center cursor-pointer pointer-events-auto flex-shrink-0"
            onClick={handleHeroLogoClick}
            title="Empyrean - Return to Top"
          >
            {/* Hit area for clicking the docked logo */}
          </div>

          {/* RIGHT 2 HEADINGS: Partners & Register (Desktop) */}
          <nav className="hidden md:flex items-center justify-start gap-5 lg:gap-8 flex-1">
            <button
              type="button"
              onClick={() => handleNavigate('partners')}
              className={`group relative text-xs sm:text-sm font-sub uppercase tracking-[0.24em] transition-all cursor-pointer ${
                currentPage === 'partners'
                  ? 'text-[#991b1b] font-bold'
                  : 'text-[#1a0f05] hover:text-[#991b1b] font-bold'
              }`}
            >
              <span>Partners</span>
              <span
                className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-300 ${
                  currentPage === 'partners' ? 'w-full' : 'w-0 group-hover:w-full'
                } bg-[#991b1b]`}
              />
            </button>

            <a
              href="/tickets"
              onClick={(e) => {
                if (onRegisterClick) {
                  e.preventDefault();
                  onRegisterClick();
                }
              }}
              className="inline-flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer -my-8 sm:-my-11 md:-my-12 -mr-3 sm:-mr-5"
              title="Register & Book Tickets for Empyrean"
            >
              <img
                src="/register.png"
                alt="Register"
                className="h-[120px] sm:h-[135px] md:h-[142px] w-auto object-contain select-none filter drop-shadow-[0_4px_16px_rgba(153,27,27,0.35)]"
                loading="eager"
              />
            </a>
          </nav>

          {/* MOBILE MENU TOGGLE (Screen < 768px) */}
          <div className="flex md:hidden items-center justify-end w-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full transition-colors cursor-pointer text-[#1a0f05] hover:bg-[#b45309]/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER (Centered Rounded Card) */}
        {mobileMenuOpen && (
          <div
            className="absolute top-full mt-2 inset-x-4 max-w-sm mx-auto rounded-2xl p-5 border backdrop-blur-2xl transition-all shadow-2xl pointer-events-auto bg-[#FAF4E8]/98 border-[#b45309]/20 text-[#1a0f05]"
          >
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleNavigate('artists')}
                className="text-left font-sub uppercase tracking-[0.2em] text-sm py-1.5 font-semibold text-[#1a0f05] hover:text-[#991b1b]"
              >
                Artists
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('events')}
                className="text-left font-sub uppercase tracking-[0.2em] text-sm py-1.5 font-semibold text-[#1a0f05] hover:text-[#991b1b]"
              >
                Events
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('partners')}
                className={`text-left font-sub uppercase tracking-[0.2em] text-sm py-1.5 font-semibold ${
                  currentPage === 'partners' ? 'text-[#991b1b] font-bold' : 'text-[#1a0f05] hover:text-[#991b1b]'
                }`}
              >
                Partners
              </button>
              <a
                href="/tickets"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (onRegisterClick) {
                    e.preventDefault();
                    onRegisterClick();
                  }
                }}
                className="w-full flex items-center justify-center pt-2 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                title="Register & Book Tickets for Empyrean"
              >
                <img
                  src="/register.png"
                  alt="Register Now"
                  className="h-[120px] sm:h-[144px] w-auto object-contain select-none filter drop-shadow-[0_4px_16px_rgba(153,27,27,0.35)]"
                />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 
        ========================================================================
        2. CENTRAL / DOCKED EMPYREAN LOGO SYSTEM
        Starts dead center in the hero; smoothly glides and scales up into
        the top navbar; stays pinned at the top always as user scrolls down!
        ========================================================================
      */}
      <div
        id="central-logo-lockup"
        className={`fixed inset-0 flex flex-col items-center justify-center text-center z-50 pointer-events-none px-4 select-none`}
        style={{
          transform: logoTransform,
          willChange: 'transform',
        }}
      >
        <div className="flex flex-col items-center max-w-[960px] w-full pt-2 sm:pt-4 md:pt-6">
          {/* Main Logo Emblem */}
          <div
            className="relative w-[88%] sm:w-[80%] md:w-[72%] lg:w-[65%] max-w-[380px] sm:max-w-[480px] md:max-w-[580px] lg:max-w-[660px] xl:max-w-[720px] my-1 sm:my-2 cursor-pointer pointer-events-auto"
            onClick={handleHeroLogoClick}
          >
            {/* Ambient Warm Aura Glow (Subtle and clean as earlier) */}
            <div
              className={`absolute inset-0 rounded-full blur-3xl pointer-events-none -z-10 scale-95 transition-opacity ${
                isParchment ? 'bg-[#b45309]/15' : 'bg-[#f8c12c]/20'
              }`}
              style={{
                opacity: 1 - logoProgress * 0.45,
              }}
            />

            <picture>
              <source srcSet="/assets/empyrean/logo-empyrean.webp" type="image/webp" />
              <img
                src="/assets/empyrean/logo-empyrean.png"
                alt="EMPYREAN - An Era Reimagined - Annual Fest of IIM Jammu"
                className="w-full h-auto object-contain block drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        3. MOBILE FLOATING REGISTER BUTTON (Screen < 768px)
        Fixed in the bottom-right corner (0.7x scale, shifted 10% right, with ambient glow).
        ========================================================================
      */}
      <aside
        id="mobile-floating-register"
        aria-label="Register for Empyrean"
        className="fixed bottom-3 sm:bottom-5 z-40 md:hidden pointer-events-auto select-none"
        style={{
          right: 'calc(-5% + 0.25rem + env(safe-area-inset-right, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <a
          href="/tickets"
          className="group relative block transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
          title="Register & Book Tickets for Empyrean"
          onClick={(e) => {
            if (onRegisterClick) {
              e.preventDefault();
              onRegisterClick();
            }
          }}
        >
          {/* Ambient Background Aura Glow */}
          <div
            className="absolute inset-x-2 inset-y-2 bg-gradient-to-r from-[#f8c12c]/45 via-[#f59e0b]/35 to-[#e11d48]/40 rounded-full blur-lg pointer-events-none scale-105 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />

          <img
            src="/register.png"
            alt="Register for Empyrean"
            className="relative h-[92px] sm:h-[105px] w-auto object-contain select-none filter drop-shadow-[0_0_14px_rgba(248,193,44,0.55)] drop-shadow-[0_0_28px_rgba(245,158,11,0.35)] drop-shadow-[0_6px_20px_rgba(0,0,0,0.65)] transition-transform duration-300"
            loading="eager"
          />
        </a>
      </aside>
    </>
  );
};
