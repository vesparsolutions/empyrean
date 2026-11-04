import React, { useState } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

interface HeroHeaderProps {
  onRegisterClick: () => void;
  onNavigate: (sectionId: string) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onRegisterClick,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'The Fest', id: 'about-fest' },
    { label: 'Events', id: 'events-section' },
    { label: 'Campus', id: 'campus-section' },
    { label: 'Sponsors', id: 'sponsors-section' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        id="hero-header"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#071026]/75 border-b border-[#f8c12c]/20 shadow-lg"
      >
        {/* Top Ornate Gold Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#f8c12c] via-[#ff4088] to-[#0fb8a2] shadow-[0_0_10px_rgba(248,193,44,0.6)] pointer-events-none z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Left Brand: IIM Jammu Emblem & Wordmark */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            aria-label="IIM Jammu Empyrean Home"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center p-0.5 bg-gradient-to-tr from-[#f8c12c] via-[#ff4088] to-[#0fb8a2] shadow-[0_0_12px_rgba(248,193,44,0.35)] group-hover:scale-105 transition-transform">
              <img
                src="/assets/empyrean/iim-jammu-emblem.webp"
                alt="IIM Jammu Emblem"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold text-sm sm:text-base md:text-lg tracking-[0.2em] text-[#fff6e0] drop-shadow-sm group-hover:text-[#f8c12c] transition-colors uppercase">
                IIM Jammu
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-[#0fb8a2] font-semibold uppercase -mt-0.5">
                Empyrean 2026
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="relative text-xs lg:text-sm font-sub uppercase tracking-[0.18em] text-[#e2e8f0] hover:text-[#f8c12c] transition-colors py-1 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#f8c12c] to-[#e02475] group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* Right Header CTAs: Register Now Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="register-now-btn"
              onClick={onRegisterClick}
              className="group relative inline-flex items-center gap-2 px-5 lg:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#f8c12c] via-[#f5a623] to-[#f8c12c] text-[#9b0d38] font-body font-bold text-xs sm:text-xs tracking-wider uppercase shadow-[0_4px_16px_rgba(248,193,44,0.4)] hover:shadow-[0_6px_22px_rgba(248,193,44,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#ffe082]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9b0d38] animate-pulse" />
              <span>Register Now</span>
              <span className="w-5 h-5 rounded-full bg-[#9b0d38] text-[#f8c12c] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onRegisterClick}
              className="px-3 py-1.5 rounded-full bg-[#f8c12c] text-[#9b0d38] font-bold text-[10px] uppercase tracking-wider shadow-sm"
            >
              Register
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#f8c12c] hover:bg-[#13244d] rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#071026]/95 border-b border-[#f8c12c]/30 px-6 py-5 flex flex-col gap-4 animate-fadeIn backdrop-blur-xl">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left font-sub uppercase tracking-[0.2em] text-sm text-[#f1f5f9] hover:text-[#f8c12c] py-2 border-b border-[#ffffff]/10"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRegisterClick();
              }}
              className="mt-2 w-full py-3 rounded-full bg-gradient-to-r from-[#f8c12c] to-[#e02475] text-[#071026] font-bold text-xs uppercase tracking-widest text-center shadow-lg"
            >
              Register for Empyrean 2026
            </button>
          </div>
        )}
      </header>
    </>
  );
};
