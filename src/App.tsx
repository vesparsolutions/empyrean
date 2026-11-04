import { useState, useEffect } from 'react';
import { HeroHeader } from './components/HeroHeader';
import { EmpyreanHero } from './components/EmpyreanHero';
import { DiscoverEmpyrean } from './components/DiscoverEmpyrean';
import { RegistrationModal } from './components/RegistrationModal';

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('Gold All-Access Pass');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
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

  const handleScrollToDiscover = () => {
    const nextSec = document.getElementById('about-fest');
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#071026] text-[#f8fafc] font-body selection:bg-[#f8c12c] selection:text-[#071026]">
      {/* 1. Refined Navigation Bar */}
      <HeroHeader
        onRegisterClick={() => handleOpenRegistration()}
        onNavigate={handleNavigate}
      />

      {/* 2. Pinned Scroll-Driven Hero Section */}
      <main id="hero" className="relative w-full">
        <EmpyreanHero
          onExploreClick={handleScrollToDiscover}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* 3. Discover Empyrean Section */}
        <DiscoverEmpyrean onRegisterClick={handleOpenRegistration} />
      </main>

      {/* 4. Interactive Registration Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTier={selectedTier}
      />
    </div>
  );
}

export default App;
