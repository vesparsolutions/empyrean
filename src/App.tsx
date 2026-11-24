import { useState, useEffect } from 'react';
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
import { LegalModal, type LegalTab } from './components/LegalModal';
import { updateDocumentSEO } from './utils/seo';

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('Gold All-Access Pass');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'partners'>(() => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/partners' || hash === '#partners' ? 'partners' : 'home';
  });
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(() => {
    if (typeof window === 'undefined') return null;
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/privacy' || hash === '#privacy' || hash === '#privacy-policy') return 'privacy';
    if (path === '/terms' || hash === '#terms' || hash === '#terms-of-service' || hash === '#terms-of-use') return 'terms';
    return null;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Synchronize document SEO (title, description, canonical, OG, Twitter) on route/modal changes
  useEffect(() => {
    if (legalModalTab === 'privacy') {
      updateDocumentSEO('privacy');
    } else if (legalModalTab === 'terms') {
      updateDocumentSEO('terms');
    } else if (currentPage === 'partners') {
      updateDocumentSEO('partners');
    } else {
      updateDocumentSEO('home');
    }
  }, [currentPage, legalModalTab]);

  // Listen to browser navigation (back/forward buttons, hash changes, popstate)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === '/partners' || hash === '#partners') {
        setCurrentPage('partners');
      } else {
        setCurrentPage('home');
      }

      if (path === '/privacy' || hash === '#privacy' || hash === '#privacy-policy') {
        setLegalModalTab('privacy');
      } else if (path === '/terms' || hash === '#terms' || hash === '#terms-of-service' || hash === '#terms-of-use') {
        setLegalModalTab('terms');
      } else {
        setLegalModalTab(null);
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleCloseLegalModal = () => {
    setLegalModalTab(null);
    const targetPath = currentPage === 'partners' ? '/partners' : '/';
    if (window.location.pathname === '/privacy' || window.location.pathname === '/terms') {
      window.history.pushState(null, '', targetPath);
    } else if (
      window.location.hash === '#privacy' ||
      window.location.hash === '#privacy-policy' ||
      window.location.hash === '#terms' ||
      window.location.hash === '#terms-of-service' ||
      window.location.hash === '#terms-of-use'
    ) {
      window.history.replaceState(null, '', targetPath);
    }
  };

  const handleOpenLegalModal = (tab: LegalTab) => {
    window.history.pushState(null, '', `/${tab}`);
    setLegalModalTab(tab);
  };

  const handleOpenRegistration = (tier?: string) => {
    if (tier) setSelectedTier(tier);
    window.open('https://forms.gle/iZxtVb1twASMDSQv7', '_blank', 'noopener,noreferrer');
  };

  const handleScrollToRibbon = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigate = (page: 'home' | 'partners', section?: string) => {
    if (page === 'partners') {
      if (window.location.pathname !== '/partners') {
        window.history.pushState(null, '', '/partners');
      }
      setCurrentPage('partners');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
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
      } else if (section === 'gallery' || section === 'aftermovie' || section === 'memories') {
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
      {/* Main Experience: Direct Instant Load with No Preloader Screen */}
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
            onOpenPrivacyPolicy={() => handleOpenLegalModal('privacy')}
            onOpenTerms={() => handleOpenLegalModal('terms')}
          />
        ) : (
          /* HOME LANDING VIEW */
          <>
            {/* Section 1: Grand Hero with Scroll-Driven Transition */}
            <EmpyreanHero
              onProgressChange={setHeroProgress}
              onExploreClick={handleScrollToRibbon}
              prefersReducedMotion={prefersReducedMotion}
            />

              {/* Section 2: Complete Cinematic Video + Dual-Row Infinite Photo Gallery (Moments & Reveries) */}
              <CinematicGallerySection
                prefersReducedMotion={prefersReducedMotion}
                onRegisterClick={handleOpenRegistration}
              />

              {/* Section 3: Discover Empyrean (Artists Section with Trikuta Mountain) */}
              <DiscoverEmpyrean
                onRegisterClick={handleOpenRegistration}
                isRibbonActive={heroProgress >= 0.5}
              />

              {/* Section 4: Events Section (Cultural, Sports, Management) — Dark navy continuation of the mountains */}
              <EventsSection
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
                onOpenPrivacyPolicy={() => handleOpenLegalModal('privacy')}
                onOpenTerms={() => handleOpenLegalModal('terms')}
              />
            </>
          )}
        </main>

      {/* 4. Global Fixed Screen Border: Present in hero entrance, fades out on first scroll */}
      <div
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden transition-opacity duration-500 ease-out"
        style={{
          opacity: Math.max(0, 1 - heroProgress * 2.5),
          display: heroProgress >= 0.99 ? 'none' : 'block',
        }}
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

      {/* 5. Legal Modal (Privacy Policy & Terms of Service) */}
      <LegalModal
        isOpen={legalModalTab !== null}
        activeTab={legalModalTab || 'privacy'}
        onClose={handleCloseLegalModal}
        onTabChange={(tab) => {
          window.history.replaceState(null, '', `/${tab}`);
          setLegalModalTab(tab);
        }}
      />
    </div>
  );
}

export default App;
