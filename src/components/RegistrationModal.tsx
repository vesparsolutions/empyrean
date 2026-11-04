import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultTier = 'Gold All-Access Pass',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    tier: defaultTier,
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Trigger colorful festive celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f8c12c', '#ff4088', '#0fb8a2', '#d82333', '#ffffff'],
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071026]/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c183a] border-2 border-[#f8c12c]/40 p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.7)] text-[#f8fafc] overflow-hidden">
        {/* Top Ornate Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f8c12c] via-[#ff4088] to-[#0fb8a2]"></div>

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full text-[#94a3b8] hover:text-[#fff] hover:bg-[#1a2f60] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8c12c]/15 text-[#f8c12c] text-[10px] font-sub uppercase tracking-widest mb-2 border border-[#f8c12c]/30">
                <Sparkles className="w-3 h-3 text-[#f8c12c]" />
                <span>Empyrean 2026 Registration</span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#fff8e7]">
                Claim Your Delegate Pass
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 font-body">
                Join thousands of students at IIM Jammu for an era reimagined.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sub uppercase tracking-wider text-[#cbd5e1] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#13244d] border border-[#f8c12c]/20 text-[#f8fafc] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#f8c12c] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sub uppercase tracking-wider text-[#cbd5e1] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#13244d] border border-[#f8c12c]/20 text-[#f8fafc] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#f8c12c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sub uppercase tracking-wider text-[#cbd5e1] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#13244d] border border-[#f8c12c]/20 text-[#f8fafc] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#f8c12c] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sub uppercase tracking-wider text-[#cbd5e1] mb-1">
                  College / Institute Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Delhi, Delhi University, IIM Jammu"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#13244d] border border-[#f8c12c]/20 text-[#f8fafc] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#f8c12c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-sub uppercase tracking-wider text-[#cbd5e1] mb-1">
                  Selected Experience Pass
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#13244d] border border-[#f8c12c]/20 text-[#f8fafc] text-sm focus:outline-none focus:border-[#f8c12c] transition-colors"
                >
                  <option value="Student Cultural Pass">Student Cultural Pass — ₹499</option>
                  <option value="Gold All-Access Pass">Gold All-Access Pass (Recommended) — ₹999</option>
                  <option value="Platinum Conclave Pass">Platinum Conclave Pass — ₹1,499</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#f8c12c] via-[#f5a623] to-[#f8c12c] text-[#9b0d38] font-bold text-sm uppercase tracking-wider shadow-[0_8px_20px_rgba(248,193,44,0.4)] hover:shadow-[0_10px_25px_rgba(248,193,44,0.6)] hover:scale-[1.02] active:scale-95 transition-all mt-4"
              >
                Confirm & Receive Digital Pass
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#0fb8a2]/20 text-[#0fb8a2] flex items-center justify-center mx-auto mb-4 border border-[#0fb8a2]/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display font-bold text-2xl text-[#fff8e7] mb-2">
              Registration Confirmed!
            </h3>
            <p className="text-sm text-[#cbd5e1] max-w-sm mx-auto mb-6">
              Welcome to Empyrean 2026, <span className="text-[#f8c12c] font-semibold">{formData.name}</span>! Your entry pass confirmation has been logged.
            </p>

            <div className="p-4 rounded-2xl bg-[#13244d]/90 border border-[#f8c12c]/30 text-left mb-6 max-w-sm mx-auto">
              <div className="flex items-center gap-2 text-xs font-sub text-[#f8c12c] uppercase tracking-wider mb-2">
                <Ticket className="w-4 h-4" />
                <span>Digital Delegate Pass</span>
              </div>
              <div className="font-display font-bold text-base text-[#fff9eb]">
                {formData.tier}
              </div>
              <div className="text-xs text-[#94a3b8] mt-1">
                College: {formData.college || 'Verified Contingent'}
              </div>
              <div className="text-xs font-mono text-[#0fb8a2] mt-2">
                Pass ID: EMPY-2026-{Math.floor(100000 + Math.random() * 900000)}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-2.5 rounded-full bg-[#f8c12c] text-[#071026] font-bold text-xs uppercase tracking-wider hover:bg-[#ffd154] transition-colors"
            >
              Back to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
