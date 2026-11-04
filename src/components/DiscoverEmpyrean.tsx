import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Music,
  Briefcase,
  Users,
  Award,
  Compass,
  ArrowRight,
  CheckCircle,
  MapPin,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';

interface DiscoverEmpyreanProps {
  onRegisterClick: (tier?: string) => void;
}

export const DiscoverEmpyrean: React.FC<DiscoverEmpyreanProps> = ({
  onRegisterClick,
}) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'schedule' | 'campus'>('pillars');
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  const stats = [
    { label: 'Days of Grandeur', value: '03', icon: Calendar, color: '#f8c12c' },
    { label: 'Flagship Competitions', value: '50+', icon: Award, color: '#ff4088' },
    { label: 'Nationwide Footfall', value: '25K+', icon: Users, color: '#0fb8a2' },
    { label: 'Total Prize Pool', value: '₹12L+', icon: Sparkles, color: '#f8c12c' },
  ];

  const pillars = [
    {
      id: 'pronites',
      title: 'Pronites & Celebrity Arena',
      subtitle: 'Echoes under the Himalayan Sky',
      icon: Music,
      color: 'from-[#ff4088] to-[#9b0d38]',
      tag: 'HEADLINE NIGHTS',
      desc: 'High-octane musical showdowns, Bollywood headliners, celebrity stand-up comedy, and heart-thumping electronic music sets under Jammu’s twilight peaks.',
      highlights: ['Bollywood Star Night', 'Battle of the Bands Finale', 'EDM Sunburn Campus Drop', 'Stand-up Comedy Arena'],
    },
    {
      id: 'cultural',
      title: 'Cultural Panache & Arts',
      subtitle: 'Where Heritage Meets Contemporary Flare',
      icon: Flame,
      color: 'from-[#f8c12c] to-[#e02475]',
      tag: 'STAGE & DRAMA',
      desc: 'Celebrate diversity with classical Dogra & Kashmiri folk performances, high-fashion runway shows, street theater (Nukkad Natak), and fine arts competitions.',
      highlights: ['Vogue: The Grand Fashion Walk', 'Natyam: Solo & Group Dance', 'Hallabol: Street Theater', 'Acoustic Unplugged Jam'],
    },
    {
      id: 'management',
      title: 'Management Conclaves',
      subtitle: 'Intellect, Strategy & Innovation',
      icon: Briefcase,
      color: 'from-[#0fb8a2] to-[#075985]',
      tag: 'LEADERSHIP SUMMIT',
      desc: 'Empowering future business leaders through live corporate case challenges, venture capital pitching, strategic simulations, and debates with industry titans.',
      highlights: ['Chanakya: Best Manager Hunt', 'Venture Nexus: Startup Pitch', 'Brand-O-Mania: Marketing War', 'FinQuest: Equity Valuation'],
    },
    {
      id: 'flavors',
      title: 'Bazaar & Flavors of Jammu',
      subtitle: 'Truck Art, Crafts & Culinary Heritage',
      icon: UtensilsCrossed,
      color: 'from-[#f59e0b] to-[#dc2626]',
      tag: 'CRAFT & TASTE',
      desc: 'Savor regional culinary gems including crispy Kachoris, Jammu Kalari Kulcha, Kashmiri Kahwa, alongside live folk handicraft workshops and truck art mural painting.',
      highlights: ['Local Street Food Alley', 'Live Truck-Art Murals', 'Artisanal Handloom Bazaar', 'Pottery & Craft Workshop'],
    },
  ];

  const scheduleDays = {
    1: [
      { time: '10:00 AM', title: 'Grand Inaugural Ceremony & Traditional Lamp Lighting', venue: 'Main Auditorium', type: 'Ceremony' },
      { time: '12:30 PM', title: 'Chanakya: National Best Manager Prelims', venue: 'MDP Hall', type: 'Management' },
      { time: '02:30 PM', title: 'Hallabol: Street Play (Nukkad Natak) Competition', venue: 'Central Amphitheater', type: 'Cultural' },
      { time: '05:30 PM', title: 'Sufi & Folk Fusion Symphony', venue: 'Open Air Stage', type: 'Pronite' },
      { time: '07:30 PM', title: 'Band Wars: National Rock & Fusion Battle', venue: 'Main Stage', type: 'Flagship' },
    ],
    2: [
      { time: '09:30 AM', title: 'Venture Nexus: Angel Investor Pitch Finale', venue: 'Incubation Center', type: 'Management' },
      { time: '11:30 AM', title: 'Classical & Fusion Solo Dance Championship', venue: 'Auditorium', type: 'Cultural' },
      { time: '02:00 PM', title: 'Brand-O-Mania: Live Advertising & Marketing War', venue: 'MDP Hall', type: 'Management' },
      { time: '05:00 PM', title: 'Vogue: Inter-College Fashion & Couture Runway', venue: 'Main Stage', type: 'Cultural' },
      { time: '08:00 PM', title: 'Celebrity Comedy & Bollywood Pronite', venue: 'Main Grounds', type: 'Pronite' },
    ],
    3: [
      { time: '10:00 AM', title: 'FinQuest: National Financial Modeling Hackathon', venue: 'Computer Center', type: 'Management' },
      { time: '01:00 PM', title: 'Step-Up: Western Street Dance Crew Battles', venue: 'Central Arena', type: 'Cultural' },
      { time: '04:00 PM', title: 'Grand Valedictory Ceremony & Prize Distribution', venue: 'Main Auditorium', type: 'Awards' },
      { time: '07:30 PM', title: 'Mega Star EDM Pronite & Grand Fest Finale', venue: 'Main Festival Grounds', type: 'Pronite' },
    ],
  };

  const passTiers = [
    {
      id: 'student-pass',
      name: 'Student Cultural Pass',
      price: '₹499',
      tag: 'ENTRY LEVEL',
      popular: false,
      features: ['Access to all Cultural Competitions', 'Admission to Food & Craft Bazaar', 'General Admission to Star Nights', 'Official Fest Delegate Kit'],
    },
    {
      id: 'all-access',
      name: 'Gold All-Access Pass',
      price: '₹999',
      tag: 'MOST POPULAR',
      popular: true,
      features: ['Full 3-Day All-Access Entry', 'Priority Seating for Star Pronites', 'Entry to all Management Competitions', 'Exclusive Workshop Access', 'Fest Souvenir Pack & Merchandise'],
    },
    {
      id: 'conclave-pass',
      name: 'Platinum Conclave Pass',
      price: '₹1,499',
      tag: 'DELEGATE EXCLUSIVE',
      popular: false,
      features: ['VIP Seating at All Pronites', 'CXO & Investor Networking Luncheon', 'Direct Access to Case Challenge Finals', 'Deluxe Hospitality & Kit', 'Certificate of Delegate Participation'],
    },
  ];

  return (
    <section
      id="about-fest"
      className="relative z-30 min-h-screen py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-[#f8fafc] fest-bg-pattern border-t border-[#f8c12c]/20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f8c12c]/10 border border-[#f8c12c]/30 text-[#f8c12c] text-xs font-sub uppercase tracking-[0.22em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f8c12c]" />
            <span>An Era Reimagined</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#fff7e6] tracking-tight mb-4 drop-shadow-md">
            Discover <span className="text-[#f8c12c] font-heading">Empyrean</span>
          </h2>

          <p className="text-base sm:text-lg text-[#cbd5e1] font-body leading-relaxed text-balance">
            Where Jammu’s majestic heritage converges with contemporary cultural dynamism, management intellect, dramatic spectacle, and artistic celebration at the Indian Institute of Management Jammu.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-[#f8c12c] via-[#ff4088] to-[#0fb8a2] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-5 sm:p-6 rounded-2xl bg-[#0f1f45]/70 border border-[#f8c12c]/20 backdrop-blur-md shadow-xl flex flex-col items-center text-center group hover:border-[#f8c12c]/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${s.color}20`, color: s.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#fff8e7] mb-1">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-sub tracking-wider uppercase text-[#94a3b8]">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12 border-b border-[#ffffff]/10 pb-4">
          <button
            onClick={() => setActiveTab('pillars')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-sub tracking-widest uppercase transition-all duration-300 ${
              activeTab === 'pillars'
                ? 'bg-gradient-to-r from-[#f8c12c] to-[#e02475] text-[#071026] font-bold shadow-lg'
                : 'text-[#94a3b8] hover:text-[#f8c12c]'
            }`}
          >
            Festival Pillars
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-sub tracking-widest uppercase transition-all duration-300 ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-[#f8c12c] to-[#e02475] text-[#071026] font-bold shadow-lg'
                : 'text-[#94a3b8] hover:text-[#f8c12c]'
            }`}
          >
            3-Day Schedule
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-sub tracking-widest uppercase transition-all duration-300 ${
              activeTab === 'campus'
                ? 'bg-gradient-to-r from-[#f8c12c] to-[#e02475] text-[#071026] font-bold shadow-lg'
                : 'text-[#94a3b8] hover:text-[#f8c12c]'
            }`}
          >
            Campus & Jammu
          </button>
        </div>

        {/* TAB 1: FESTIVAL PILLARS */}
        {activeTab === 'pillars' && (
          <div id="events-section" className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20 animate-fadeIn">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="group relative p-6 sm:p-8 rounded-3xl bg-[#0e1d44]/80 border border-[#ffffff]/10 hover:border-[#f8c12c]/50 backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Decorative corner glow */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#f8c12c]/10 to-transparent rounded-bl-full pointer-events-none"></div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-sub font-bold tracking-[0.25em] px-3 py-1 rounded-full bg-[#f8c12c]/15 text-[#f8c12c] border border-[#f8c12c]/30 uppercase">
                      {p.tag}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f8c12c]/20 to-[#e02475]/20 flex items-center justify-center text-[#f8c12c]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#fff8e7] mb-1">
                    {p.title}
                  </h3>
                  <div className="text-xs font-sub text-[#0fb8a2] tracking-wider uppercase mb-3">
                    {p.subtitle}
                  </div>

                  <p className="text-sm text-[#cbd5e1] leading-relaxed mb-6 font-body">
                    {p.desc}
                  </p>

                  <div className="space-y-2 mb-6">
                    {p.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#e2e8f0]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#0fb8a2] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onRegisterClick(p.title)}
                    className="inline-flex items-center gap-2 text-xs font-sub tracking-widest text-[#f8c12c] group-hover:text-[#ff4088] uppercase transition-colors"
                  >
                    <span>Register For Events</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="mb-20 animate-fadeIn">
            {/* Day Selector */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {[1, 2, 3].map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day as 1 | 2 | 3)}
                  className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-sub tracking-wider uppercase transition-all ${
                    activeDay === day
                      ? 'bg-[#f8c12c] text-[#071026] font-bold shadow-md'
                      : 'bg-[#13244d] text-[#cbd5e1] hover:bg-[#1a336b]'
                  }`}
                >
                  Day 0{day}
                </button>
              ))}
            </div>

            {/* Timeline List */}
            <div className="max-w-3xl mx-auto space-y-4">
              {scheduleDays[activeDay].map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-[#0f1f45]/80 border border-[#f8c12c]/15 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#f8c12c]/40 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#f8c12c] px-3 py-1 rounded-lg bg-[#f8c12c]/10 border border-[#f8c12c]/30 shrink-0">
                      {item.time}
                    </span>
                    <div>
                      <h4 className="font-display font-semibold text-sm sm:text-base text-[#fff9eb]">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-[#94a3b8] mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0fb8a2]" />
                          {item.venue}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-[10px] font-sub uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#ff4088]/15 text-[#ff4088] border border-[#ff4088]/30">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CAMPUS SPOTLIGHT */}
        {activeTab === 'campus' && (
          <div id="campus-section" className="mb-20 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#0f1f45]/80 border border-[#ffffff]/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-2xl bg-[#0fb8a2]/20 flex items-center justify-center text-[#0fb8a2] mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#fff8e7] mb-2">
                  Jagti Foothills Campus
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-body">
                  Set amidst the breathtaking foothills of the Trikuta Mountain range, IIM Jammu offers a world-class, sustainably designed 200-acre campus combining modern academic infrastructure with peaceful Himalayan vistas.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0f1f45]/80 border border-[#ffffff]/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-2xl bg-[#f8c12c]/20 flex items-center justify-center text-[#f8c12c] mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#fff8e7] mb-2">
                  The Dogra Heritage
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-body">
                  Empyrean pays homage to Jammu’s timeless history: the Bahu Fort, the ornate Mubarak Mandi palace complex, and centuries-old Dogra folk music and miniature painting traditions reinterpreted for a new era.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0f1f45]/80 border border-[#ffffff]/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-2xl bg-[#ff4088]/20 flex items-center justify-center text-[#ff4088] mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#fff8e7] mb-2">
                  Hospitality & Stay
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-body">
                  Outstation student contingents from over 100 premier institutes receive campus accommodation, continuous shuttle connectivity from Jammu Tawi station & airport, and authentic Dogri hospitality throughout the fest.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* REGISTRATION PASS TIERS */}
        <div className="mt-20 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0fb8a2]/15 text-[#0fb8a2] border border-[#0fb8a2]/30 text-xs font-sub uppercase tracking-widest mb-3">
            <span>Festival Passes</span>
          </div>
          <h3 className="font-display font-bold text-3xl sm:text-4xl text-[#fff8e7] mb-3">
            Choose Your <span className="text-[#f8c12c]">Empyrean Experience</span>
          </h3>
          <p className="text-sm text-[#94a3b8] max-w-xl mx-auto mb-10">
            Secure early bird access to star pronites, flagship competitions, and all festival arenas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {passTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-8 rounded-3xl backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                  tier.popular
                    ? 'bg-gradient-to-b from-[#13285c] to-[#0a1533] border-2 border-[#f8c12c] shadow-[0_16px_36px_rgba(248,193,44,0.25)]'
                    : 'bg-[#0f1f45]/70 border border-[#ffffff]/10 hover:border-[#f8c12c]/40 shadow-xl'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#f8c12c] to-[#e02475] text-[#071026] text-[10px] font-sub font-black tracking-widest uppercase shadow-md">
                    {tier.tag}
                  </div>
                )}

                <div>
                  <h4 className="font-display font-bold text-xl text-[#fff9eb] mb-1">
                    {tier.name}
                  </h4>
                  <div className="flex items-baseline justify-center gap-1 my-5">
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-[#f8c12c]">
                      {tier.price}
                    </span>
                    <span className="text-xs text-[#94a3b8]">/ student</span>
                  </div>

                  <div className="w-full h-[1px] bg-[#ffffff]/10 mb-6"></div>

                  <div className="space-y-3 text-left mb-8">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cbd5e1]">
                        <CheckCircle className="w-4 h-4 text-[#0fb8a2] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onRegisterClick(tier.name)}
                  className={`w-full py-3 rounded-full text-xs font-sub font-bold tracking-widest uppercase transition-all shadow-md ${
                    tier.popular
                      ? 'bg-gradient-to-r from-[#f8c12c] via-[#f5a623] to-[#f8c12c] text-[#80072b] hover:shadow-[0_8px_20px_rgba(248,193,44,0.4)]'
                      : 'bg-[#1a336b] text-[#f8c12c] hover:bg-[#23458e] border border-[#f8c12c]/30'
                  }`}
                >
                  Select Pass
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsors Showcase */}
        <div id="sponsors-section" className="pt-16 border-t border-[#ffffff]/10 text-center">
          <div className="text-xs font-sub tracking-[0.25em] text-[#94a3b8] uppercase mb-8">
            Festival Partners & Sponsors
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center">
              <span className="font-display font-extrabold text-2xl tracking-wider text-[#d82333]">Coca-Cola</span>
              <span className="text-[9px] uppercase tracking-widest text-[#94a3b8] mt-0.5">Title Beverage Partner</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-xl tracking-wider text-[#f8c12c]">Jammu & Kashmir Tourism</span>
              <span className="text-[9px] uppercase tracking-widest text-[#94a3b8] mt-0.5">Heritage Partner</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-xl tracking-wider text-[#0fb8a2]">State Bank of India</span>
              <span className="text-[9px] uppercase tracking-widest text-[#94a3b8] mt-0.5">Banking Partner</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-xl tracking-wider text-[#ff4088]">Red FM 93.5</span>
              <span className="text-[9px] uppercase tracking-widest text-[#94a3b8] mt-0.5">Official Radio Partner</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-8 border-t border-[#f8c12c]/10 text-center text-xs text-[#64748b]">
          <p>© 2026 EMPYREAN — Indian Institute of Management Jammu. All rights reserved.</p>
          <p className="mt-1 text-[11px] text-[#94a3b8]">Jagti Campus, PO Nagrota, NH-44, Jammu 181221, J&K, India</p>
        </div>
      </div>
    </section>
  );
};
