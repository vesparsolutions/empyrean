import React from 'react';
import trikutaImg from '../assets/trikuta.png';
import {
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

interface FestivalFooterProps {
  onRegisterClick?: (tier?: string) => void;
  onPartnersClick?: () => void;
}

export const FestivalFooter: React.FC<FestivalFooterProps> = ({
  onRegisterClick,
  onPartnersClick,
}) => {
  const handleScrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="festival-footer"
      className="relative z-20 w-full bg-[#071026] text-[#e2e8f0] select-none overflow-hidden pt-16 sm:pt-20 md:pt-24 pb-6"
    >
      {/* 
        1. Trikuta Mountain Layer across the bottom of the footer (Full Bleed)
        The glowing Trikuta peaks rise along the bottom beneath the links, matching the user reference.
      */}
      <div className="absolute inset-x-0 bottom-0 w-full pointer-events-none select-none z-0 overflow-hidden flex justify-center">
        <div className="relative w-full min-w-full">
          <picture className="w-full min-w-full block">
            <source srcSet="/trikuta.png" type="image/png" />
            <img
              src={trikutaImg || '/trikuta.png'}
              alt="Trikuta Mountain Range"
              className="w-full min-w-full h-auto object-cover object-bottom block opacity-70"
              style={{
                filter: 'contrast(1.15) saturate(1.2) brightness(0.85)',
              }}
            />
          </picture>

          {/* Atmospheric Dark Sky Vignette so footer text and links remain 100% crisp & readable */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(7, 16, 38, 0.95) 0%, rgba(7, 16, 38, 0.60) 40%, rgba(7, 16, 38, 0.88) 100%)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 
        2. Subtle Mughal Palace Gateway Architectural Silhouette (Bottom-Right, matching reference)
      */}
      <div className="absolute right-0 bottom-8 pointer-events-none select-none z-[1] opacity-20 hidden lg:block">
        <svg
          width="260"
          height="180"
          viewBox="0 0 260 180"
          fill="none"
          stroke="#f8c12c"
          strokeWidth="1.2"
        >
          {/* Outer Gateway Structure */}
          <rect x="30" y="50" width="180" height="130" strokeDasharray="4 2" />
          <path d="M30 50 L120 15 L210 50" />
          <circle cx="120" cy="15" r="4" fill="#f8c12c" />
          {/* Main Central Mughal Arch */}
          <path d="M70 180 V105 Q120 70 170 105 V180" />
          <path d="M80 180 V112 Q120 85 160 112 V180" strokeWidth="0.8" />
          {/* Side Jharokha Arches */}
          <path d="M35 120 V95 Q48 80 60 95 V120" strokeWidth="0.8" />
          <path d="M180 120 V95 Q193 80 205 95 V120" strokeWidth="0.8" />
          {/* Top Decorative Finials & Cornices */}
          <line x1="20" y1="50" x2="220" y2="50" strokeWidth="1.5" />
          <line x1="25" y1="55" x2="215" y2="55" strokeWidth="0.8" />
        </svg>
      </div>

      {/* 
        3. Main Footer Content (4 Columns with subtle gold vertical dividers)
      */}
      <div className="relative z-10 max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row items-start gap-10 md:gap-8 lg:gap-6 xl:gap-8">
          {/* COLUMN 1: Brand & About */}
          <div className="w-full lg:w-[32%] xl:w-[30%] lg:max-w-md flex flex-col">
            {/* Empyrean Main Logo */}
            <div className="mb-4">
              <picture>
                <source srcSet="/assets/empyrean/logo-empyrean.webp" type="image/webp" />
                <img
                  src="/assets/empyrean/logo-empyrean.png"
                  alt="EMPYREAN - An Era Reimagined"
                  className="w-44 sm:w-52 md:w-56 h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                  loading="lazy"
                />
              </picture>
            </div>

            <p className="text-xs sm:text-sm text-[#cbd5e1]/80 leading-relaxed max-w-sm mb-6 font-body">
              The annual cultural and management festival of IIM Jammu, where
              ideas, art and culture come together for three unforgettable days.
            </p>

            {/* Social Links: "STAY IN THE LOOP" */}
            <div className="mt-auto">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#f8c12c] font-semibold block mb-3">
                STAY IN THE LOOP
              </span>
              <div className="flex items-center gap-4 text-[#cbd5e1]/80">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/empyrean_iimj/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="hover:text-[#f8c12c] hover:scale-115 transition-all duration-200"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/empyrean-iimj"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-[#f8c12c] hover:scale-115 transition-all duration-200"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92m1.38 9.74v-8.37H5.08v8.37h2.76z" />
                  </svg>
                </a>
                {/* Gmail compose preset to empyrean@iimj.ac.in */}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=empyrean@iimj.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Send email to empyrean@iimj.ac.in via Gmail"
                  className="hover:text-[#f8c12c] hover:scale-115 transition-all duration-200"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              {/* Designed with ❤️ by Vespar */}
              <div className="mt-4">
                <a
                  href="https://vesparsolutions.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center flex-wrap gap-2 text-[11px] sm:text-xs text-[#cbd5e1]/80 hover:text-[#f8c12c] transition-colors group cursor-pointer"
                >
                  <span className="font-body">Designed with</span>
                  <span
                    className="inline-block text-xs group-hover:scale-125 transition-transform duration-200"
                    role="img"
                    aria-label="love"
                  >
                    ❤️
                  </span>
                  <span className="font-body">by</span>
                  <img
                    src="/vespar.png"
                    alt="Vespar"
                    className="h-[9px] sm:h-[10.5px] w-auto object-contain inline-block transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Vertical Divider 1 (Desktop) */}
          <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-[#f8c12c]/30 to-transparent self-stretch min-h-[170px] my-2 shrink-0" />

          {/* COLUMN 2: Quick Links */}
          <div className="w-full sm:w-auto lg:w-[15%] xl:w-[14%] flex flex-col">
            <h4 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#f8c12c] mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#cbd5e1]/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('top')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('artists')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  About Empyrean
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('artists')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Artists
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('hero-scroll-container')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Experience
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onRegisterClick?.()}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Schedule
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onRegisterClick?.('Gold All-Access Pass')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Passes
                </button>
              </li>
            </ul>
          </div>

          {/* Vertical Divider 2 (Desktop) */}
          <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-[#f8c12c]/30 to-transparent self-stretch min-h-[170px] my-2 shrink-0" />

          {/* COLUMN 3: Explore */}
          <div className="w-full sm:w-auto lg:w-[15%] xl:w-[14%] flex flex-col">
            <h4 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#f8c12c] mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#cbd5e1]/80">
              <li>
                <button
                  type="button"
                  onClick={() => onRegisterClick?.()}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Competitions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onRegisterClick?.()}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Workshops
                </button>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=IIM+Jammu+Jagti"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 block text-left"
                >
                  Campus Map
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('hero-scroll-container')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => (onPartnersClick ? onPartnersClick() : handleScrollTo('sponsors'))}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Partners
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onRegisterClick?.()}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Vertical Divider 3 (Desktop, shifted to the right with Contact Us) */}
          <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-[#f8c12c]/30 to-transparent self-stretch min-h-[170px] my-2 shrink-0 lg:ml-auto" />

          {/* COLUMN 4: Contact Us (Shifted to rightmost side) */}
          <div className="w-full sm:w-auto lg:min-w-[240px] xl:min-w-[280px] flex flex-col">
            <h4 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#f8c12c] mb-4">
              CONTACT US
            </h4>
            <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1]/85">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#f8c12c] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#fff6e0]">IIM Jammu</p>
                  <p className="text-xs text-[#cbd5e1]/75 leading-relaxed">
                    Jagti, Jammu – 181221
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#f8c12c] shrink-0" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=empyrean@iimj.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f8c12c] transition-colors break-all"
                >
                  empyrean@iimj.ac.in
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#f8c12c] shrink-0" />
                <a
                  href="tel:+918899012345"
                  className="hover:text-[#f8c12c] transition-colors"
                >
                  +91 88990 12345
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 
          4. Bottom Copyright & Legal Links Bar (matching reference layout)
        */}
        <div className="border-t border-[#f8c12c]/20 mt-14 sm:mt-18 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
          <div>
            © 2026 EMPYREAN, IIM JAMMU. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-3 text-[#cbd5e1]/65">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                alert('Empyrean 2026 Privacy Policy: We respect your privacy and protect all festival attendee registration details.');
              }}
              className="hover:text-[#f8c12c] transition-colors"
            >
              PRIVACY POLICY
            </a>
            <span className="text-[#f8c12c]/40">|</span>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                alert('Empyrean 2026 Terms of Use: Standard festival admission guidelines and event security regulations apply.');
              }}
              className="hover:text-[#f8c12c] transition-colors"
            >
              TERMS OF USE
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};