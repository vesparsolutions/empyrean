import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface EventsSectionProps {
  onRegisterClick?: (tier?: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onRegisterClick }) => {
  return (
    <section
      id="events"
      className="relative w-full text-[#f8fafc] overflow-hidden select-none"
      style={{
        backgroundColor: '#071026',
        backgroundImage: `
          radial-gradient(circle at 50% 35%, rgba(11, 24, 57, 0.85) 0%, transparent 70%),
          radial-gradient(circle at 15% 75%, rgba(224, 36, 117, 0.05) 0%, transparent 55%),
          radial-gradient(circle at 85% 75%, rgba(248, 193, 44, 0.05) 0%, transparent 55%)
        `,
      }}
      aria-label="Events"
    >
      {/* 1. Indian Jali Grid Texture (matching Artists section foothill background) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045] z-0"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23f8c12c' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23f8c12c' stroke-width='1'/%3E%3C/svg%3E"),
            linear-gradient(to right, rgba(248, 193, 44, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(248, 193, 44, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px, 54px 54px, 54px 54px',
        }}
        aria-hidden="true"
      />

      {/* 2. Atmospheric Ambient Halo */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[450px] sm:h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(248, 193, 44, 0.08) 0%, rgba(224, 36, 117, 0.04) 45%, transparent 75%)',
          filter: 'blur(75px)',
        }}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-32 pb-28 sm:pb-36 md:pb-44">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#fff6e0] drop-shadow-[0_4px_24px_rgba(248,193,44,0.25)] mb-3">
            Events
          </h2>
          <p className="font-editorial italic text-lg sm:text-xl text-[#f8c12c]/75 max-w-md mx-auto leading-snug">
            Three arenas of excellence
          </p>
        </div>

        {/* 3 Equal-Sized Event Cards with Silhouettes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch">
          {/* 1. CULTURAL CARD (SINGER SILHOUETTE) */}
          <div className="group relative flex flex-col h-full">
            <div
              className="relative flex-1 flex flex-col justify-between rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'linear-gradient(180deg, rgba(14, 28, 64, 0.90) 0%, rgba(7, 16, 38, 0.98) 100%)',
                border: '1.5px solid rgba(224, 36, 117, 0.35)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Top Art Container with Singer Silhouette */}
              <div
                className="relative h-64 sm:h-72 w-full overflow-hidden flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 50% 60%, rgba(224, 36, 117, 0.20) 0%, transparent 70%)',
                }}
              >
                {/* SVG Singer Silhouette */}
                <svg
                  viewBox="0 0 320 280"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="singer-glow" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="#ff4088" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#e02475" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#071026" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="singer-beam" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#ff75a0" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#ff4088" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="singer-body" x1="20%" y1="0%" x2="80%" y2="100%">
                      <stop offset="0%" stopColor="#ff75a0" />
                      <stop offset="40%" stopColor="#e02475" />
                      <stop offset="100%" stopColor="#3d051c" />
                    </linearGradient>
                  </defs>

                  {/* Spotlight Beam Cone */}
                  <polygon points="120,0 200,0 300,280 20,280" fill="url(#singer-beam)" />
                  <circle cx="160" cy="130" r="105" fill="url(#singer-glow)" />

                  {/* Soundwave Aura */}
                  <circle cx="195" cy="115" r="30" stroke="#ff4088" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
                  <circle cx="195" cy="115" r="52" stroke="#ff4088" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

                  {/* Microphone Stand & Vintage Capsule */}
                  <g opacity="0.9">
                    <line x1="195" y1="128" x2="195" y2="280" stroke="#ff9eaa" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="195" cy="128" r="3.5" fill="#ff4088" />
                    {/* Vintage Capsule */}
                    <rect x="187" y="100" width="16" height="24" rx="8" fill="#13244d" stroke="#ff9eaa" strokeWidth="1.8" />
                    <line x1="190" y1="107" x2="200" y2="107" stroke="#ff9eaa" strokeWidth="1.2" />
                    <line x1="189" y1="112" x2="201" y2="112" stroke="#ff9eaa" strokeWidth="1.2" />
                    <line x1="190" y1="117" x2="200" y2="117" stroke="#ff9eaa" strokeWidth="1.2" />
                  </g>

                  {/* Singer Silhouette: Profile facing mic */}
                  <path
                    d="
                      M 70 280
                      C 75 240, 85 205, 105 180
                      C 96 165, 94 145, 102 128
                      C 95 110, 102 88, 120 72
                      C 136 58, 160 62, 170 78
                      C 176 88, 174 98, 166 106
                      C 172 109, 170 115, 164 119
                      C 156 124, 152 132, 152 142
                      C 152 152, 162 164, 172 176
                      C 182 188, 188 215, 190 240
                      L 192 280
                      Z
                    "
                    fill="url(#singer-body)"
                  />

                  {/* Arm & Hand Grasping Microphone Stand */}
                  <path
                    d="
                      M 158 168
                      C 170 156, 184 146, 193 138
                      C 197 135, 203 138, 199 144
                      C 194 151, 182 163, 168 178
                      Z
                    "
                    fill="#ff9eaa"
                    opacity="0.95"
                  />

                  {/* Sparkle Particles */}
                  <circle cx="215" cy="85" r="2" fill="#fff" opacity="0.8" />
                  <circle cx="135" cy="55" r="1.5" fill="#ff4088" opacity="0.9" />
                  <circle cx="230" cy="140" r="2" fill="#ff9eaa" opacity="0.6" />
                  <circle cx="105" cy="110" r="1.5" fill="#fff" opacity="0.7" />
                </svg>
              </div>

              {/* Minimal Text Info */}
              <div className="relative z-10 p-6 sm:p-7 pt-2 flex flex-col items-center text-center flex-1 justify-between">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#ff4088] tracking-wide mb-1.5">
                    Cultural
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#cbd5e1]/75 mb-6">
                    Music, Dance & Dramatics
                  </p>
                </div>

                <button
                  onClick={() => onRegisterClick?.('cultural')}
                  className="w-full h-11 sm:h-12 rounded-xl flex items-center justify-center gap-2 font-sub text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-300"
                  style={{
                    background: 'rgba(224, 36, 117, 0.15)',
                    border: '1px solid rgba(224, 36, 117, 0.55)',
                    color: '#ff9eaa',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e02475';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(224, 36, 117, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(224, 36, 117, 0.15)';
                    e.currentTarget.style.color = '#ff9eaa';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>Explore Events</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. SPORTS CARD (PLAYER SILHOUETTE) */}
          <div className="group relative flex flex-col h-full">
            <div
              className="relative flex-1 flex flex-col justify-between rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'linear-gradient(180deg, rgba(14, 28, 64, 0.90) 0%, rgba(7, 16, 38, 0.98) 100%)',
                border: '1.5px solid rgba(15, 184, 162, 0.35)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Top Art Container with Player Silhouette */}
              <div
                className="relative h-64 sm:h-72 w-full overflow-hidden flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 50% 60%, rgba(15, 184, 162, 0.20) 0%, transparent 70%)',
                }}
              >
                {/* SVG Player Silhouette */}
                <svg
                  viewBox="0 0 320 280"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="player-glow" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="#00f5b8" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#0fb8a2" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#071026" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="player-beam" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5eead4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0fb8a2" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="player-body" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5eead4" />
                      <stop offset="50%" stopColor="#0fb8a2" />
                      <stop offset="100%" stopColor="#043831" />
                    </linearGradient>
                  </defs>

                  {/* Stadium Floodlight Beams */}
                  <polygon points="0,0 60,0 200,280 0,280" fill="url(#player-beam)" opacity="0.4" />
                  <polygon points="320,0 260,0 120,280 320,280" fill="url(#player-beam)" opacity="0.3" />
                  <circle cx="160" cy="140" r="105" fill="url(#player-glow)" />

                  {/* Athlete Striker Silhouette */}
                  {/* Head */}
                  <circle cx="120" cy="85" r="15" fill="url(#player-body)" />

                  {/* Torso */}
                  <path
                    d="
                      M 115 100
                      C 130 102, 148 112, 160 128
                      C 165 135, 162 145, 150 152
                      C 138 158, 125 152, 115 140
                      C 105 128, 102 112, 115 100
                      Z
                    "
                    fill="url(#player-body)"
                  />

                  {/* Trailing Left Arm */}
                  <path
                    d="
                      M 112 110
                      C 95 105, 80 115, 68 128
                      C 64 132, 68 136, 72 134
                      C 82 124, 96 118, 112 116
                      Z
                    "
                    fill="#5eead4"
                    opacity="0.9"
                  />

                  {/* Forward Right Arm */}
                  <path
                    d="
                      M 145 118
                      C 162 112, 180 114, 192 122
                      C 196 125, 194 130, 188 128
                      C 178 122, 162 122, 146 126
                      Z
                    "
                    fill="#5eead4"
                    opacity="0.95"
                  />

                  {/* Striking Leg */}
                  <path
                    d="
                      M 148 145
                      C 170 135, 195 120, 218 100
                      C 224 95, 232 98, 228 105
                      C 208 128, 180 148, 152 160
                      Z
                    "
                    fill="url(#player-body)"
                  />
                  {/* Striking Foot */}
                  <path
                    d="
                      M 224 98
                      L 242 86
                      C 246 88, 244 94, 238 98
                      L 226 106
                      Z
                    "
                    fill="#5eead4"
                  />

                  {/* Trailing Support Leg */}
                  <path
                    d="
                      M 125 150
                      C 120 170, 115 190, 108 208
                      C 104 216, 96 214, 98 205
                      C 104 188, 112 168, 120 152
                      Z
                    "
                    fill="url(#player-body)"
                    opacity="0.9"
                  />
                  <path
                    d="
                      M 100 206
                      L 92 222
                      C 90 225, 96 226, 100 222
                      L 106 210
                      Z
                    "
                    fill="#5eead4"
                  />

                  {/* Ball with Kinetic Motion */}
                  <circle cx="260" cy="72" r="14" fill="#071026" stroke="#00f5b8" strokeWidth="2.5" />
                  <path d="M 252 68 L 260 62 L 268 68 L 264 78 L 256 78 Z" fill="#00f5b8" opacity="0.8" />
                  <path d="M 220 115 C 240 100, 250 88, 254 84" stroke="#00f5b8" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" opacity="0.8" />
                  <path d="M 205 135 C 230 115, 245 98, 250 92" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />

                  {/* Stadium Pitch Baseline */}
                  <line x1="40" y1="260" x2="280" y2="260" stroke="#0fb8a2" strokeWidth="1.5" opacity="0.4" />
                </svg>
              </div>

              {/* Minimal Text Info */}
              <div className="relative z-10 p-6 sm:p-7 pt-2 flex flex-col items-center text-center flex-1 justify-between">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#00f5b8] tracking-wide mb-1.5">
                    Sports
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#cbd5e1]/75 mb-6">
                    Athletics & Team Battles
                  </p>
                </div>

                <button
                  onClick={() => onRegisterClick?.('sports')}
                  className="w-full h-11 sm:h-12 rounded-xl flex items-center justify-center gap-2 font-sub text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-300"
                  style={{
                    background: 'rgba(15, 184, 162, 0.15)',
                    border: '1px solid rgba(15, 184, 162, 0.55)',
                    color: '#5eead4',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0fb8a2';
                    e.currentTarget.style.color = '#071026';
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(15, 184, 162, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(15, 184, 162, 0.15)';
                    e.currentTarget.style.color = '#5eead4';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>Explore Events</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. MANAGEMENT CARD (BUILDING SILHOUETTE) */}
          <div className="group relative flex flex-col h-full">
            <div
              className="relative flex-1 flex flex-col justify-between rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'linear-gradient(180deg, rgba(14, 28, 64, 0.90) 0%, rgba(7, 16, 38, 0.98) 100%)',
                border: '1.5px solid rgba(248, 193, 44, 0.35)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Top Art Container with Building Skyline Silhouette */}
              <div
                className="relative h-64 sm:h-72 w-full overflow-hidden flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 50% 60%, rgba(248, 193, 44, 0.20) 0%, transparent 70%)',
                }}
              >
                {/* SVG Building Silhouette */}
                <svg
                  viewBox="0 0 320 280"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="bldg-glow" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="#f8c12c" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#c98c11" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#071026" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="bldg-beam" x1="50%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor="#f8c12c" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ffd15c" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="bldg-tower-main" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffd15c" />
                      <stop offset="40%" stopColor="#f8c12c" />
                      <stop offset="100%" stopColor="#3d2c05" />
                    </linearGradient>
                    <linearGradient id="bldg-tower-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c98c11" />
                      <stop offset="100%" stopColor="#140f03" />
                    </linearGradient>
                  </defs>

                  {/* Upward Searchlight Beams */}
                  <polygon points="150,260 170,260 210,0 110,0" fill="url(#bldg-beam)" opacity="0.5" />
                  <circle cx="160" cy="140" r="105" fill="url(#bldg-glow)" />

                  {/* Background Distant Towers */}
                  <rect x="50" y="160" width="30" height="100" fill="#1e1808" opacity="0.6" />
                  <rect x="240" y="150" width="35" height="110" fill="#1e1808" opacity="0.6" />
                  <polygon points="50,160 65,140 80,160" fill="#1e1808" opacity="0.6" />

                  {/* Left Modern Tiered Skyscraper */}
                  <g>
                    <rect x="75" y="110" width="55" height="150" fill="url(#bldg-tower-dark)" stroke="#f8c12c" strokeWidth="1.2" strokeOpacity="0.4" />
                    <polygon points="85,110 85,85 120,85 120,110" fill="url(#bldg-tower-dark)" stroke="#f8c12c" strokeWidth="1.2" strokeOpacity="0.5" />
                    {/* Lit Windows */}
                    <g fill="#ffd15c" opacity="0.75">
                      <rect x="85" y="125" width="6" height="4" rx="1" />
                      <rect x="98" y="125" width="6" height="4" rx="1" />
                      <rect x="111" y="125" width="6" height="4" rx="1" />
                      <rect x="85" y="145" width="6" height="4" rx="1" />
                      <rect x="98" y="145" width="6" height="4" rx="1" />
                      <rect x="111" y="145" width="6" height="4" rx="1" />
                      <rect x="85" y="165" width="6" height="4" rx="1" />
                      <rect x="98" y="165" width="6" height="4" rx="1" />
                      <rect x="111" y="165" width="6" height="4" rx="1" />
                      <rect x="85" y="185" width="6" height="4" rx="1" />
                      <rect x="98" y="185" width="6" height="4" rx="1" />
                      <rect x="111" y="185" width="6" height="4" rx="1" />
                    </g>
                  </g>

                  {/* Right Angled Contemporary Tower */}
                  <g>
                    <path d="M 195 260 L 195 125 L 245 95 L 245 260 Z" fill="url(#bldg-tower-dark)" stroke="#f8c12c" strokeWidth="1.2" strokeOpacity="0.4" />
                    <line x1="195" y1="130" x2="245" y2="160" stroke="#f8c12c" strokeWidth="1" strokeOpacity="0.4" />
                    <line x1="195" y1="160" x2="245" y2="190" stroke="#f8c12c" strokeWidth="1" strokeOpacity="0.4" />
                    <line x1="195" y1="190" x2="245" y2="220" stroke="#f8c12c" strokeWidth="1" strokeOpacity="0.4" />
                    <g fill="#ffd15c" opacity="0.7">
                      <rect x="205" y="145" width="5" height="5" rx="1" />
                      <rect x="225" y="145" width="5" height="5" rx="1" />
                      <rect x="205" y="175" width="5" height="5" rx="1" />
                      <rect x="225" y="175" width="5" height="5" rx="1" />
                      <rect x="205" y="205" width="5" height="5" rx="1" />
                      <rect x="225" y="205" width="5" height="5" rx="1" />
                    </g>
                  </g>

                  {/* Center Hero Skyscraper */}
                  <g>
                    {/* Spire Needle */}
                    <line x1="160" y1="20" x2="160" y2="55" stroke="#ffe27a" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="160" cy="20" r="3" fill="#fff" />
                    <circle cx="160" cy="20" r="6" stroke="#ffd15c" strokeWidth="1" opacity="0.6" />

                    {/* Faceted Body */}
                    <polygon points="140,260 140,75 160,55 180,75 180,260" fill="url(#bldg-tower-main)" stroke="#ffd15c" strokeWidth="1.5" />
                    <line x1="160" y1="55" x2="160" y2="260" stroke="#ffe27a" strokeWidth="1.2" opacity="0.6" />

                    {/* Windows Left */}
                    <g fill="#fff" opacity="0.85">
                      <rect x="146" y="90" width="4" height="6" rx="0.5" />
                      <rect x="152" y="90" width="4" height="6" rx="0.5" />
                      <rect x="146" y="110" width="4" height="6" rx="0.5" />
                      <rect x="152" y="110" width="4" height="6" rx="0.5" />
                      <rect x="146" y="130" width="4" height="6" rx="0.5" />
                      <rect x="152" y="130" width="4" height="6" rx="0.5" />
                      <rect x="146" y="150" width="4" height="6" rx="0.5" />
                      <rect x="152" y="150" width="4" height="6" rx="0.5" />
                      <rect x="146" y="170" width="4" height="6" rx="0.5" />
                      <rect x="152" y="170" width="4" height="6" rx="0.5" />
                      <rect x="146" y="195" width="4" height="6" rx="0.5" />
                      <rect x="152" y="195" width="4" height="6" rx="0.5" />
                    </g>
                    {/* Windows Right */}
                    <g fill="#ffd15c" opacity="0.8">
                      <rect x="164" y="90" width="4" height="6" rx="0.5" />
                      <rect x="170" y="90" width="4" height="6" rx="0.5" />
                      <rect x="164" y="110" width="4" height="6" rx="0.5" />
                      <rect x="170" y="110" width="4" height="6" rx="0.5" />
                      <rect x="164" y="130" width="4" height="6" rx="0.5" />
                      <rect x="170" y="130" width="4" height="6" rx="0.5" />
                      <rect x="164" y="150" width="4" height="6" rx="0.5" />
                      <rect x="170" y="150" width="4" height="6" rx="0.5" />
                      <rect x="164" y="170" width="4" height="6" rx="0.5" />
                      <rect x="170" y="170" width="4" height="6" rx="0.5" />
                      <rect x="164" y="195" width="4" height="6" rx="0.5" />
                      <rect x="170" y="195" width="4" height="6" rx="0.5" />
                    </g>
                  </g>

                  {/* Baseline */}
                  <line x1="30" y1="260" x2="290" y2="260" stroke="#f8c12c" strokeWidth="1.5" opacity="0.5" />
                </svg>
              </div>

              {/* Minimal Text Info */}
              <div className="relative z-10 p-6 sm:p-7 pt-2 flex flex-col items-center text-center flex-1 justify-between">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#ffd15c] tracking-wide mb-1.5">
                    Management
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#cbd5e1]/75 mb-6">
                    Strategy & Case Wars
                  </p>
                </div>

                <button
                  onClick={() => onRegisterClick?.('management')}
                  className="w-full h-11 sm:h-12 rounded-xl flex items-center justify-center gap-2 font-sub text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-300"
                  style={{
                    background: 'rgba(248, 193, 44, 0.15)',
                    border: '1px solid rgba(248, 193, 44, 0.55)',
                    color: '#ffd15c',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8c12c';
                    e.currentTarget.style.color = '#071026';
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(248, 193, 44, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(248, 193, 44, 0.15)';
                    e.currentTarget.style.color = '#ffd15c';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>Explore Events</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Gradient: Seamlessly dissolve dark navy #071026 into light parchment #FAF4E8 for Sponsors */}
      <div
        className="absolute inset-x-0 bottom-0 h-[120px] sm:h-[160px] pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(250, 244, 232, 0.08) 30%, rgba(250, 244, 232, 0.35) 60%, #FAF4E8 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
};
