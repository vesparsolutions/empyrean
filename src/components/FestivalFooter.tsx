import React from 'react';
import trikutaImg from '../assets/trikuta.png';
import {
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

interface FestivalFooterProps {
  onRegisterClick?: (tier?: string) => void;
}

export const FestivalFooter: React.FC<FestivalFooterProps> = ({
  onRegisterClick,
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* COLUMN 1: Brand & About (Span 4) */}
          <div className="lg:col-span-4 flex flex-col">
            {/* Mountain Brand Logo & Title */}
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-10 h-7 text-[#f8c12c] shrink-0"
                viewBox="0 0 40 28"
                fill="none"
              >
                <path
                  d="M20 2 L26 14 L32 8 L40 24 H0 L10 12 L16 18 Z"
                  stroke="#f8c12c"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill="rgba(248, 193, 44, 0.15)"
                />
                <circle cx="20" cy="2" r="1.5" fill="#f8c12c" />
              </svg>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-[0.22em] text-[#fff6e0] leading-none">
                EMPYREAN
              </h3>
            </div>

            <div className="text-[10px] font-mono tracking-[0.34em] text-[#f8c12c] font-semibold uppercase mb-4">
              ✦ AN ERA REIMAGINED ✦
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
                  href="https://instagram.com"
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
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-[#f8c12c] hover:scale-115 transition-all duration-200"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92m1.38 9.74v-8.37H5.08v8.37h2.76z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="hover:text-[#f8c12c] hover:scale-115 transition-all duration-200"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                {/* Custom X (Twitter) Vector */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="hover:text-[#f8c12c] hover:scale-115 transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Spotify Vector */}
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Spotify"
                  className="hover:text-[#f8c12c] hover:scale-115 transition-all duration-200"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10 5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.786-.964-.335.077-.67-.133-.746-.469-.077-.334.132-.67.467-.747 3.807-.87 7.076-.496 9.715 1.115.294.18.386.563.207.858zm1.226-2.724c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.849-.106-.974-.517-.126-.413.105-.849.518-.975 3.633-1.102 8.147-.568 11.236 1.33.366.225.482.705.257 1.071zm.105-2.835C14.692 9.08 8.46 8.877 4.887 9.963c-.534.161-1.099-.145-1.26-.679-.162-.533.145-1.1.679-1.26 4.108-1.247 10.999-1.01 14.542 1.094.48.285.637.903.352 1.382-.284.48-.902.636-1.281.365z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Vertical Divider 1 (Desktop) */}
          <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-[#f8c12c]/30 to-transparent self-stretch my-2" />

          {/* COLUMN 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2 flex flex-col">
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
          <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-[#f8c12c]/30 to-transparent self-stretch my-2" />

          {/* COLUMN 3: Explore (Span 2) */}
          <div className="lg:col-span-2 flex flex-col">
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
                  onClick={() => handleScrollTo('sponsors')}
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

          {/* Vertical Divider 3 (Desktop) */}
          <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-[#f8c12c]/30 to-transparent self-stretch my-2" />

          {/* COLUMN 4: Contact Us (Span 3) */}
          <div className="lg:col-span-3 flex flex-col">
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
                  href="mailto:empyrean@iimjammu.ac.in"
                  className="hover:text-[#f8c12c] transition-colors break-all"
                >
                  empyrean@iimjammu.ac.in
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
