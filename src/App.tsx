import { useState, useEffect } from 'react';
import { FestPreloader } from './components/FestPreloader';
import { FestivalNavbar } from './components/FestivalNavbar';
import { EmpyreanHero } from './components/EmpyreanHero';
import { DiscoverEmpyrean } from './components/DiscoverEmpyrean';
import { SponsorsSection } from './components/SponsorsSection';
import { FestivalFooter } from './components/FestivalFooter';
import { RegistrationModal } from './components/RegistrationModal';

export function App() {
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('Gold All-Access Pass');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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

  return (
    <div className="relative min-h-screen bg-[#0b1839] text-[#f8fafc] font-body selection:bg-[#f8c12c] selection:text-[#0b1839]">
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
          />

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

          {/* Section 3: Our Sponsors Section (Dark Background with Royal Patrons) */}
          <SponsorsSection onRegisterClick={handleOpenRegistration} />

          {/* Section 4: Grand Festival Footer */}
          <FestivalFooter onRegisterClick={handleOpenRegistration} />
        </main>
      )}

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
