import { useState, useEffect } from 'react';
import { FestPreloader } from './components/FestPreloader';
import { FestivalNavbar } from './components/FestivalNavbar';
import { EmpyreanHero } from './components/EmpyreanHero';
import { DiscoverEmpyrean } from './components/DiscoverEmpyrean';
import { EventsSection } from './components/EventsSection';
import { SponsorsSection } from './components/SponsorsSection';
import { VisitUsSection } from './components/VisitUsSection';
import { FestivalFooter } from './components/FestivalFooter';
import { RegistrationModal } from './components/RegistrationModal';
import { PartnersPage } from './components/PartnersPage';
import { CinematicGallerySection } from './components/CinematicGallerySection';

export function App() {
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('Gold All-Access Pass');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'partners'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#partners'
      ? 'partners'
      : 'home';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen to browser hash changes (e.g. back button, forward button, direct link)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#partners') {
        setCurrentPage('partners');
        window.scrollTo(0, 0);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenRegistration = (tier?: string) => {
    if (tier) setSelectedTier(tier);
    setModalOpen(true);
  };

  const handleScrollToRibbon = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  };

  const handleNavigate = (page: 'home' | 'partners', section?: string) => {
    if (page === 'partners') {
      window.location.hash = '#partners';
      setCurrentPage('partners');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
      setCurrentPage('home');
      if (section === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (section === 'artists') {
        setTimeout(() => {
          document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (section === 'events') {
        setTimeout(() => {
          document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (section === 'gallery' || section === 'aftermovie') {
        setTimeout(() => {
          document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (section === 'experience') {
        setTimeout(() => {
          window.scrollTo({ top: window.innerHeight * 0.45, behavior: 'smooth' });
        }, 150);
      } else if (section === 'sponsors') {
        setTimeout(() => {
          document.getElementById('sponsors')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (section === 'visit-us' || section === 'visitus') {
        setTimeout(() => {
          document.getElementById('visit-us')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  return (
    <div
      className={`relative min-h-screen ${
        currentPage === 'partners' ? 'bg-[#FAF5EB]' : 'bg-[#0b1839]'
      } text-[#f8fafc] font-body selection:bg-[#f8c12c] selection:text-[#0b1839]`}
    >
      {/* 1. Global Luxury Preloader: Gated until Supabase bucket images are completely loaded */}
      {!isAssetsLoaded && (
        <FestPreloader
          onLoaded={(urls) => {
            setImageUrls(urls);
            setIsAssetsLoaded(true);
          }}
        />
      )}

      {/* 2. Main Experience (Only loaded once Supabase images are ready) */}
      {isAssetsLoaded && (
        <main id="main-content" className="relative w-full">
          {/* Persistent Festival Navbar: Central Logo docks at top + 2-2 headings on each side */}
          <FestivalNavbar
            progress={heroProgress}
            prefersReducedMotion={prefersReducedMotion}
            onExploreClick={handleScrollToRibbon}
            onRegisterClick={handleOpenRegistration}
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />

          {/* DEDICATED PARTNERS PAGE VIEW */}
          {currentPage === 'partners' ? (
            <PartnersPage
              onBackToHome={() => handleNavigate('home')}
              onRegisterClick={handleOpenRegistration}
            />
          ) : (
            /* HOME LANDING VIEW */
            <>
              {/* Section 1: Grand Hero with Scroll-Driven Transition into 3D Ribbon */}
              <EmpyreanHero
                onProgressChange={setHeroProgress}
                onExploreClick={handleScrollToRibbon}
                prefersReducedMotion={prefersReducedMotion}
                imageUrls={imageUrls}
              />

              {/* Section 2: Discover Empyrean (Artists Section with Trikuta Mountain) */}
              <DiscoverEmpyrean
                onRegisterClick={handleOpenRegistration}
                isRibbonActive={heroProgress >= 0.5}
              />

              {/* Section 3: Events Section (Cultural, Sports, Management) — Dark navy continuation of the mountains */}
              <EventsSection
                onRegisterClick={handleOpenRegistration}
              />

              {/* Section 4: Complete Cinematic Video + Dual-Row Infinite Photo Gallery */}
              <CinematicGallerySection
                prefersReducedMotion={prefersReducedMotion}
                onRegisterClick={handleOpenRegistration}
              />

              {/* Section 5: Our Sponsors Section (Light Parchment Background with Rotating Sponsors) */}
              <SponsorsSection
                onViewPartners={() => handleNavigate('partners')}
                onRegisterClick={handleOpenRegistration}
              />

              {/* Section 5: Visit Us (Google Maps & IIM Jammu Jagti Campus Directions) */}
              <VisitUsSection />

              {/* Section 6: Grand Festival Footer */}
              <FestivalFooter
                onPartnersClick={() => handleNavigate('partners')}
                onRegisterClick={handleOpenRegistration}
              />
            </>
          )}
        </main>
      )}

      {/* 4. Global Fixed Screen Border: Sticks to the whole screen */}
      <div
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/hero/screen-border.webp"
          alt=""
          className="w-full h-full object-fill pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* 3. Interactive Registration Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTier={selectedTier}
      />
    </div>
  );
}

export default App;
