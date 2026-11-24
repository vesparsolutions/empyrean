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
  const [currentTheme, setCurrentTheme] = useState<'navy' | 'parchment'>(
    currentPage === 'partners' ? 'parchment' : 'navy'
  );
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

  // Dynamic Background Theme Detection based on scroll position:
  // Detects whether the navbar is currently over the Navy Hero/Ribbon, Warm Parchment Artists section, or Dark Sponsors section
  useEffect(() => {
    if (currentPage === 'partners') {
      setCurrentTheme('parchment');
      return;
    }

    const handleScroll = () => {
      const artistsSection = document.getElementById('artists');
      const eventsSection = document.getElementById('events');
      const gallerySection = document.getElementById('gallery');
      const sponsorsSection = document.getElementById('sponsors');
      const visitUsSection = document.getElementById('visit-us');

      // The navbar has height ~76px.
      // 1. If user scrolled into dark Visit Us section, switch to 'navy'
      if (visitUsSection && visitUsSection.getBoundingClientRect().top <= 72) {
        setCurrentTheme('navy');
      }
      // 2. If user scrolled into light parchment Sponsors section, switch to 'parchment'
      else if (sponsorsSection && sponsorsSection.getBoundingClientRect().top <= 72) {
        setCurrentTheme('parchment');
      }
      // 3. If user is over dark Gallery/Aftermovie section, switch to 'navy'
      else if (gallerySection && gallerySection.getBoundingClientRect().top <= 72) {
        setCurrentTheme('navy');
      }
      // 4. If user is over dark Events section, switch to 'navy'
      else if (eventsSection && eventsSection.getBoundingClientRect().top <= 72) {
        setCurrentTheme('navy');
      }
      // 3. If user is over warm parchment Artists section, switch to 'parchment'
      else if (artistsSection && artistsSection.getBoundingClientRect().top <= 72) {
        setCurrentTheme('parchment');
      }
      // 4. Otherwise default to 'navy' (Hero / Ribbon section)
      else {
        setCurrentTheme('navy');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

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

  // Theme-specific styles
  const isParchment = currentTheme === 'parchment';

  return (
    <>
      {/* 
        ========================================================================
        1. FIXED TOP NAVBAR BAR
        Always on top of the viewport. Background & text dynamically shift
        between Deep Navy and Warm Parchment to match the underlying section.
        ========================================================================
      */}
      <header
        id="festival-fixed-navbar"
        className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 transition-all duration-500 select-none ${
          navContentOpacity > 0.02
            ? isParchment
              ? 'bg-[#FAF4E8]/88 backdrop-blur-md border-b border-[#b45309]/20 shadow-[0_4px_24px_rgba(90,40,10,0.08)]'
              : 'bg-[#071026]/75 backdrop-blur-md border-b border-[#f8c12c]/15 shadow-[0_8px_32px_rgba(2,6,18,0.45)]'
            : 'bg-transparent border-b border-transparent pointer-events-none'
        }`}
        style={{
          opacity: navContentOpacity > 0.02 ? 1 : 0,
          pointerEvents: isDocked ? 'auto' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* LEFT HEADINGS: Artists & Events */}
          <nav className="flex-1 hidden md:flex items-center justify-end gap-6 lg:gap-10 pr-6 lg:pr-10">
            <button
              type="button"
              onClick={() => handleNavigate('artists')}
              className={`group relative text-xs sm:text-sm font-sub uppercase tracking-[0.24em] transition-all cursor-pointer ${
                isParchment
                  ? 'text-[#1a0f05] hover:text-[#991b1b] font-bold'
                  : 'text-[#fef3c7]/85 hover:text-[#f8c12c] font-semibold'
              }`}
            >
              <span>Artists</span>
              <span
                className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                  isParchment ? 'bg-[#991b1b]' : 'bg-[#f8c12c]'
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('events')}
              className={`group relative text-xs sm:text-sm font-sub uppercase tracking-[0.24em] transition-all cursor-pointer ${
                isParchment
                  ? 'text-[#1a0f05] hover:text-[#991b1b] font-bold'
                  : 'text-[#fef3c7]/85 hover:text-[#f8c12c] font-semibold'
              }`}
            >
              <span>Events</span>
              <span
                className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                  isParchment ? 'bg-[#991b1b]' : 'bg-[#f8c12c]'
                }`}
              />
            </button>
          </nav>

          {/* CENTER DOCK SPACER: Reserve hit area for the docked logo */}
          <div
            className="w-36 sm:w-44 md:w-56 h-full flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={handleHeroLogoClick}
            title="Empyrean - Return to Top"
          >
            {/* Hit area for clicking the docked logo */}
          </div>

          {/* RIGHT 2 HEADINGS: Partners & Register */}
          <nav className="flex-1 hidden md:flex items-center justify-start gap-6 lg:gap-10 pl-6 lg:pr-10">
            <button
              type="button"
              onClick={() => handleNavigate('partners')}
              className={`group relative text-xs sm:text-sm font-sub uppercase tracking-[0.24em] transition-all cursor-pointer ${
                isParchment
                  ? currentPage === 'partners'
                    ? 'text-[#991b1b] font-bold'
                    : 'text-[#1a0f05] hover:text-[#991b1b] font-bold'
                  : currentPage === 'partners'
                  ? 'text-[#f8c12c] font-bold'
                  : 'text-[#fef3c7]/85 hover:text-[#f8c12c] font-semibold'
              }`}
            >
              <span>Partners</span>
              <span
                className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-300 ${
                  currentPage === 'partners' ? 'w-full' : 'w-0 group-hover:w-full'
                } ${isParchment ? 'bg-[#991b1b]' : 'bg-[#f8c12c]'}`}
              />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('register')}
              className={`px-5 py-2 rounded-full text-xs font-sub font-bold tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer ${
                isParchment
                  ? 'bg-gradient-to-r from-[#991b1b] via-[#b45309] to-[#991b1b] text-[#fff8ed] hover:shadow-[0_4px_16px_rgba(153,27,27,0.35)] hover:scale-[1.03]'
                  : 'bg-gradient-to-r from-[#d82333] via-[#b45309] to-[#f8c12c] text-[#0b1839] hover:shadow-[0_4px_18px_rgba(248,193,44,0.4)] hover:scale-[1.03]'
              }`}
            >
              Register
            </button>
          </nav>

          {/* MOBILE CONTROLS (Screen < 768px): Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isParchment
                  ? 'text-[#1a0f05] hover:bg-[#b45309]/10'
                  : 'text-[#fef3c7] hover:bg-white/10'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden px-6 py-5 border-b backdrop-blur-xl transition-all shadow-xl ${
              isParchment
                ? 'bg-[#FAF4E8]/98 border-[#b45309]/20 text-[#1a0f05]'
                : 'bg-[#071026]/98 border-[#f8c12c]/20 text-[#fef3c7]'
            }`}
          >
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => handleNavigate('artists')}
                className="text-left font-sub uppercase tracking-[0.2em] text-sm py-1 font-semibold"
              >
                Artists
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('events')}
                className="text-left font-sub uppercase tracking-[0.2em] text-sm py-1 font-semibold"
              >
                Events
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('partners')}
                className={`text-left font-sub uppercase tracking-[0.2em] text-sm py-1 font-semibold ${
                  currentPage === 'partners' ? 'text-[#991b1b] font-bold' : ''
                }`}
              >
                Partners
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('register')}
                className={`w-full py-2.5 rounded-full text-xs font-sub font-bold tracking-widest uppercase text-center mt-2 shadow-md ${
                  isParchment
                    ? 'bg-gradient-to-r from-[#991b1b] via-[#b45309] to-[#991b1b] text-[#fff8ed]'
                    : 'bg-gradient-to-r from-[#d82333] via-[#b45309] to-[#f8c12c] text-[#0b1839]'
                }`}
              >
                Register Now
              </button>
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
    </>
  );
};
