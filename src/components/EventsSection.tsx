import React, { useEffect, useRef, useState } from 'react';

interface EventsSectionProps {
  onRegisterClick?: (tier?: string) => void;
}

interface MetricItem {
  id: string;
  targetNumber: number;
  label: string;
  format: (value: number) => string;
  finalDisplay: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'footfall',
    targetNumber: 25000,
    label: 'Footfall',
    format: (val) => `${Math.round(val).toLocaleString('en-IN')}+`,
    finalDisplay: '25,000+',
  },
  {
    id: 'events',
    targetNumber: 20,
    label: 'Events',
    format: (val) => `${Math.round(val)}+`,
    finalDisplay: '20+',
  },
  {
    id: 'prizepool',
    targetNumber: 200000,
    label: 'Prize Pool',
    format: (val) => `₹${Math.round(val).toLocaleString('en-IN')}+`,
    finalDisplay: '₹2,00,000+',
  },
];

// Luxury quartic ease-out for silky-smooth deceleration
const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

export const EventsSection: React.FC<EventsSectionProps> = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const num0Ref = useRef<HTMLSpanElement>(null);
  const num1Ref = useRef<HTMLSpanElement>(null);
  const num2Ref = useRef<HTMLSpanElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const animRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setIsVisible(true);

          const refs = [num0Ref.current, num1Ref.current, num2Ref.current];
          const startTime = performance.now();

          // Elegant staggered durations and offsets
          const config = [
            { delay: 100, duration: 1600 },
            { delay: 250, duration: 1400 },
            { delay: 400, duration: 1700 },
          ];

          const tick = (now: number) => {
            const elapsed = now - startTime;
            let allDone = true;

            for (let i = 0; i < METRICS.length; i++) {
              const el = refs[i];
              if (!el) continue;

              const { delay, duration } = config[i];
              const metric = METRICS[i];

              if (elapsed < delay) {
                allDone = false;
                el.textContent = metric.format(0);
              } else if (elapsed >= delay + duration) {
                el.textContent = metric.finalDisplay;
              } else {
                allDone = false;
                const progress = easeOutQuart((elapsed - delay) / duration);
                const currentVal = metric.targetNumber * progress;
                el.textContent = metric.format(currentVal);
              }
            }

            if (!allDone) {
              animRef.current = requestAnimationFrame(tick);
            } else {
              animRef.current = null;
              // Guarantee exact final strings
              for (let i = 0; i < METRICS.length; i++) {
                if (refs[i]) refs[i]!.textContent = METRICS[i].finalDisplay;
              }
            }
          };

          animRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
      // Strictly maintain exact targets on cleanup
      if (num0Ref.current) num0Ref.current.textContent = METRICS[0].finalDisplay;
      if (num1Ref.current) num1Ref.current.textContent = METRICS[1].finalDisplay;
      if (num2Ref.current) num2Ref.current.textContent = METRICS[2].finalDisplay;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="events"
      className="relative z-20 w-full text-[#f8fafc] overflow-hidden select-none -mt-px"
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
      {/* 0. Top Atmospheric Fog Dissolve: Seamless bridging from Trikuta mountain foothills */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-[#071026] via-[#071026]/80 to-transparent z-1"
        aria-hidden="true"
      />

      {/* 1. Subtle Jali Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045] z-0"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23f8c12c' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23f8c12c' stroke-width='1'/%3E%3C/svg%3E"),
            linear-gradient(to right, rgba(248, 193, 44, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(248, 193, 44, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px, 54px 54px, 54px 54px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 100%)',
        }}
        aria-hidden="true"
      />

      {/* 2. Atmospheric Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1100px] h-[500px] sm:h-[650px] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(248, 193, 44, 0.08) 0%, rgba(224, 36, 117, 0.03) 45%, transparent 75%)',
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-22 md:pt-28 pb-24 sm:pb-32 md:pb-40">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-14 sm:mb-20 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="font-sub text-xs sm:text-sm uppercase tracking-[0.35em] text-[#f8c12c]/90 font-medium inline-block mb-3">
            Arenas of Excellence
          </span>
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#fff6e0] drop-shadow-[0_4px_30px_rgba(248,193,44,0.25)] mb-4">
            Events
          </h2>
          <p className="font-editorial italic text-lg sm:text-xl md:text-2xl text-[#f8c12c]/75 max-w-lg mx-auto leading-relaxed mt-1">
            Three days across Cultural, Sports & Management
          </p>
          {/* Subtle Warm Divider */}
          <div
            className="w-20 h-px bg-gradient-to-r from-transparent via-[#f8c12c]/40 to-transparent mx-auto mt-6"
            aria-hidden="true"
          />
        </div>

        {/* Pure Open Editorial Stats with Smooth Luxury Count-Up & Reveal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 max-w-5xl mx-auto">
          {/* Stat 1: Footfall (Target: 25,000+) */}
          <div
            className={`flex-1 text-center w-full transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="relative inline-block">
              <span
                ref={num0Ref}
                className="block font-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[96px] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fff4e0] to-[#e5c57b] tracking-tight leading-none tabular-nums drop-shadow-[0_4px_30px_rgba(255,255,255,0.18)]"
              >
                25,000+
              </span>
            </div>
            <span className="block font-sub text-xs sm:text-sm uppercase tracking-[0.35em] text-[#f8c12c] font-semibold mt-4">
              Footfall
            </span>
          </div>

          {/* Plain Divider 1 (Desktop) */}
          <div
            className={`hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-white/15 to-transparent transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '250ms' }}
            aria-hidden="true"
          />
          {/* Plain Divider 1 (Mobile) */}
          <div
            className={`md:hidden w-32 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />

          {/* Stat 2: Events (Target: 20+) */}
          <div
            className={`flex-1 text-center w-full transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            <div className="relative inline-block">
              <span
                ref={num1Ref}
                className="block font-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[96px] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fff4e0] to-[#e5c57b] tracking-tight leading-none tabular-nums drop-shadow-[0_4px_30px_rgba(255,255,255,0.18)]"
              >
                20+
              </span>
            </div>
            <span className="block font-sub text-xs sm:text-sm uppercase tracking-[0.35em] text-[#f8c12c] font-semibold mt-4">
              Events
            </span>
          </div>

          {/* Plain Divider 2 (Desktop) */}
          <div
            className={`hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-white/15 to-transparent transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
            aria-hidden="true"
          />
          {/* Plain Divider 2 (Mobile) */}
          <div
            className={`md:hidden w-32 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />

          {/* Stat 3: Prize Pool (Target: ₹2,00,000+) */}
          <div
            className={`flex-1 text-center w-full transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="relative inline-block">
              <span
                ref={num2Ref}
                className="block font-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[96px] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fff4e0] to-[#e5c57b] tracking-tight leading-none tabular-nums drop-shadow-[0_4px_30px_rgba(255,255,255,0.18)]"
              >
                ₹2,00,000+
              </span>
            </div>
            <span className="block font-sub text-xs sm:text-sm uppercase tracking-[0.35em] text-[#f8c12c] font-semibold mt-4">
              Prize Pool
            </span>
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
