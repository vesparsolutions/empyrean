import React from 'react';
import trikutaImg from '../assets/trikuta.png';
import {
  MapPin,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface FestivalFooterProps {
  onRegisterClick?: (tier?: string) => void;
  onPartnersClick?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

export const FestivalFooter: React.FC<FestivalFooterProps> = ({
  onRegisterClick,
  onPartnersClick,
  onOpenPrivacyPolicy,
  onOpenTerms,
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
      className="relative z-20 w-full bg-[#071026] text-[#e2e8f0] select-none overflow-hidden pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16"
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
                  Artists
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('events')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('gallery')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Moments &amp; Memories
                </button>
              </li>
              <li className="pt-1">
                <a
                  href="/tickets"
                  onClick={(e) => {
                    if (onRegisterClick) {
                      e.preventDefault();
                      onRegisterClick();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-[#f8c12c] font-semibold hover:translate-x-1 transition-all duration-200 cursor-pointer group"
                >
                  <span>Register Now</span>
                  <ExternalLink className="w-3 h-3 text-[#f8c12c] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Vertical Divider 2 (Desktop) */}
          <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-[#f8c12c]/30 to-transparent self-stretch min-h-[170px] my-2 shrink-0" />

          {/* COLUMN 3: Explore */}
          <div className="w-full sm:w-auto lg:w-[17%] xl:w-[16%] flex flex-col">
            <h4 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#f8c12c] mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#cbd5e1]/80">
              <li>
                <a
                  href="https://www.iimj.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 text-left text-[#cbd5e1]/85 group"
                >
                  <span>IIM Jammu Website</span>
                  <ExternalLink className="w-3 h-3 text-[#f8c12c]/70 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </a>
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
                  onClick={() => handleScrollTo('sponsors')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Our Sponsors
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('visit-us')}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left"
                >
                  Visit Campus
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPrivacyPolicy) onOpenPrivacyPolicy();
                    else window.location.hash = '#privacy';
                  }}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left text-[#cbd5e1]/70"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenTerms) onOpenTerms();
                    else window.location.hash = '#terms';
                  }}
                  className="hover:text-[#f8c12c] hover:translate-x-1 transition-all duration-200 cursor-pointer text-left text-[#cbd5e1]/70"
                >
                  Terms of Service
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

              {/* Instagram */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-[#f8c12c] shrink-0 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <a
                  href="https://www.instagram.com/iimj_jammu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f8c12c] transition-colors"
                >
                  @iimj_jammu
                </a>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-[#f8c12c] shrink-0 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <a
                  href="https://www.linkedin.com/school/iimjammu/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f8c12c] transition-colors"
                >
                  IIM Jammu (LinkedIn)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links (Shifted to bottom-right, no top border line) */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
          <div>
            © 2026 EMPYREAN, IIM JAMMU. ALL RIGHTS RESERVED.
          </div>
          <span className="hidden sm:inline text-[#f8c12c]/40">•</span>
          <div className="flex items-center gap-2.5 text-[#cbd5e1]/65">
            <button
              type="button"
              onClick={() => {
                if (onOpenPrivacyPolicy) {
                  onOpenPrivacyPolicy();
                } else {
                  window.location.hash = '#privacy';
                }
              }}
              className="hover:text-[#f8c12c] transition-colors uppercase cursor-pointer"
            >
              PRIVACY POLICY
            </button>
            <span className="text-[#f8c12c]/40">|</span>
            <button
              type="button"
              onClick={() => {
                if (onOpenTerms) {
                  onOpenTerms();
                } else {
                  window.location.hash = '#terms';
                }
              }}
              className="hover:text-[#f8c12c] transition-colors uppercase cursor-pointer"
            >
              TERMS OF SERVICE
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};