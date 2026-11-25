import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Info,
  Mail,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Ticket,
  Search,
  Users,
  QrCode,
  ShieldCheck,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  fetchFestivalTickets,
  insertUnverifiedBookings,
  checkTicketStatusByEmail,
  type SupabaseTicketRow,
  type UnverifiedBookingInput,
  type TicketStatusLookupResult,
} from '../lib/supabase';

export interface TicketsPageProps {
  onBackToHome?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

type FlowStep = 'overview' | 'tickets' | 'details' | 'checkout';
type TicketKind = 'standard' | 'couple' | 'group-bundle';

interface TicketTier {
  id: string;
  kind: TicketKind;
  name: string;
  tag: string;
  description: string;
  price: number;
  passesPerUnit: number;
  maxPerOrder: number;
  isEarlyBird?: boolean;
}

const EARLY_BIRD_DEADLINE_MS = new Date('2026-12-01T00:00:00+05:30').getTime();

function formatEarlyBirdCountdown(nowMs: number): { expired: boolean; text: string } {
  const diff = EARLY_BIRD_DEADLINE_MS - nowMs;
  if (diff <= 0) {
    return { expired: true, text: 'Ends Nov 30 Midnight' };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    expired: false,
    text: `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s left`,
  };
}

interface AttendeeSlot {
  key: string;
  ticketId: string;
  kind: TicketKind;
  ticketName: string;
  passesPerUnit: number;
  instanceIndex: number;
  totalOfType: number;
}

interface AttendeeDetails {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  // Couple Entry partner fields
  partnerName?: string;
  partnerEmail?: string;
  // Group bundle companion names (Buy 4 Get 1 Free -> Guests 2..5)
  guest2Name?: string;
  guest3Name?: string;
  guest4Name?: string;
  guest5Name?: string;
}

const FALLBACK_FEST_TICKETS: TicketTier[] = [
  {
    id: '7',
    kind: 'standard',
    name: 'Early Birds',
    tag: 'Early Bird Offer • Full 3-Day Access',
    description:
      'Limited-time early bird pass with full access across all 3 days of Empyrean 2026 — valid before 1st Dec.',
    price: 699,
    passesPerUnit: 1,
    maxPerOrder: 5,
    isEarlyBird: true,
  },
  {
    id: '1',
    kind: 'standard',
    name: 'All Days (All-Access Pass)',
    tag: 'Recommended • Full 3-Day Access',
    description:
      'Complete access across all 3 days of Empyrean 2026 — pronites, cultural showcases, sports & management events.',
    price: 999,
    passesPerUnit: 1,
    maxPerOrder: 5,
  },
  {
    id: '2',
    kind: 'standard',
    name: 'Day 1',
    tag: '1 Day Pass • Day 1 Access',
    description: 'Full access to all Day 1 events, showcases & campus arena.',
    price: 499,
    passesPerUnit: 1,
    maxPerOrder: 5,
  },
  {
    id: '3',
    kind: 'standard',
    name: 'Day 2',
    tag: '1 Day Pass • Day 2 Access',
    description: 'Full access to all Day 2 events, competitions & campus arena.',
    price: 299,
    passesPerUnit: 1,
    maxPerOrder: 5,
  },
  {
    id: '4',
    kind: 'standard',
    name: 'Day 3',
    tag: '1 Day Pass • Day 3 Access',
    description: 'Full access to Day 3 finale events, headline pronite & campus arena.',
    price: 699,
    passesPerUnit: 1,
    maxPerOrder: 5,
  },
  {
    id: '5',
    kind: 'couple',
    name: 'Couple Entry',
    tag: '2 Entries • 1 Male + 1 Female',
    description: 'Entry pass for 1 male and 1 female across Empyrean 2026.',
    price: 1799,
    passesPerUnit: 2,
    maxPerOrder: 3,
  },
  {
    id: '6',
    kind: 'group-bundle',
    name: 'Buy 4 get 1 FREE',
    tag: 'Group Bundle • 5 Tickets at ₹4,000',
    description: 'Squad value pack: get 5 delegate tickets for ₹4,000.',
    price: 4000,
    passesPerUnit: 5,
    maxPerOrder: 3,
  },
];

function mapSupabaseTicketRow(row: SupabaseTicketRow): TicketTier {
  const title = row.ticket.trim();
  const lower = title.toLowerCase();
  const price = Number(row.price);

  if (lower.includes('early')) {
    return {
      id: String(row.id),
      kind: 'standard',
      name: title,
      tag: 'Early Bird Offer • Full 3-Day Access',
      description:
        'Limited-time early bird pass with full access across all 3 days of Empyrean 2026 — valid before 1st Dec.',
      price,
      passesPerUnit: 1,
      maxPerOrder: 5,
      isEarlyBird: true,
    };
  }
  if (lower.includes('couple')) {
    return {
      id: String(row.id),
      kind: 'couple',
      name: title,
      tag: '2 Entries • 1 Male + 1 Female',
      description: 'Entry pass for 1 male and 1 female across Empyrean 2026.',
      price,
      passesPerUnit: 2,
      maxPerOrder: 3,
    };
  }
  if (lower.includes('buy 4') || lower.includes('4 get 1')) {
    return {
      id: String(row.id),
      kind: 'group-bundle',
      name: title,
      tag: 'Group Bundle • 5 Tickets',
      description: `Squad value pack: get 5 delegate tickets for ${formatINR(price)}.`,
      price,
      passesPerUnit: 5,
      maxPerOrder: 3,
    };
  }
  if (lower.includes('all')) {
    return {
      id: String(row.id),
      kind: 'standard',
      name: title,
      tag: 'Recommended • Full 3-Day Access',
      description:
        'Complete access across all 3 days of Empyrean 2026 — pronites, cultural showcases, sports & management events.',
      price,
      passesPerUnit: 1,
      maxPerOrder: 5,
    };
  }
  if (lower.includes('day 1')) {
    return {
      id: String(row.id),
      kind: 'standard',
      name: title,
      tag: '1 Day Pass • Day 1 Access',
      description: 'Full access to all Day 1 events, showcases & campus arena.',
      price,
      passesPerUnit: 1,
      maxPerOrder: 5,
    };
  }
  if (lower.includes('day 2')) {
    return {
      id: String(row.id),
      kind: 'standard',
      name: title,
      tag: '1 Day Pass • Day 2 Access',
      description: 'Full access to all Day 2 events, competitions & campus arena.',
      price,
      passesPerUnit: 1,
      maxPerOrder: 5,
    };
  }
  if (lower.includes('day 3')) {
    return {
      id: String(row.id),
      kind: 'standard',
      name: title,
      tag: '1 Day Pass • Day 3 Access',
      description: 'Full access to Day 3 finale events, headline pronite & campus arena.',
      price,
      passesPerUnit: 1,
      maxPerOrder: 5,
    };
  }

  return {
    id: String(row.id),
    kind: 'standard',
    name: title,
    tag: 'Empyrean 2026 Pass',
    description: 'Official delegate pass for Empyrean 2026 at IIM Jammu.',
    price,
    passesPerUnit: 1,
    maxPerOrder: 5,
  };
}

const formatINR = (amount: number) => {
  return `₹ ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const PoweredByVespar: React.FC = () => (
  <div className="pt-5 pb-2 flex flex-col items-center justify-center select-none">
    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-1">
      Powered By
    </span>
    <a
      href="https://vesparsolutions.in"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
      title="Powered by Vespar Solutions"
    >
      <img
        src="/sponsors/vespar-solutions.webp"
        alt="Vespar Solutions"
        className="h-11 sm:h-12 w-auto object-contain"
      />
    </a>
  </div>
);

/** Returns a concise validation message if the mobile input does not contain exactly 10 digits */
const validateTenDigitMobile = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Mobile number must be exactly 10 digits.';
  if (/[^\d\s-]/.test(trimmed)) {
    return 'Mobile number can only contain digits (10 digits required).';
  }
  const digitsCount = trimmed.replace(/\D/g, '').length;
  if (digitsCount !== 10) {
    return `Mobile number must be 10 digits (${digitsCount} entered).`;
  }
  return null;
};

export const TicketsPage: React.FC<TicketsPageProps> = ({
  onBackToHome,
  onOpenPrivacyPolicy,
  onOpenTerms,
}) => {
  const [tickets, setTickets] = useState<TicketTier[]>(FALLBACK_FEST_TICKETS);
  const [ticketsLoading, setTicketsLoading] = useState<boolean>(true);
  const [step, setStep] = useState<FlowStep>('overview');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [attendeeForms, setAttendeeForms] = useState<Record<string, AttendeeDetails>>({});
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
  const [customBuyerEnabled, setCustomBuyerEnabled] = useState<boolean>(false);
  const [buyerDetails, setBuyerDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [detailsAttempted, setDetailsAttempted] = useState<boolean>(false);
  const [utrError, setUtrError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccessOpen, setBookingSuccessOpen] = useState<boolean>(false);
  const [bookingRefId, setBookingRefId] = useState<string>('');
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [statusEmail, setStatusEmail] = useState<string>('');
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [statusResult, setStatusResult] = useState<TicketStatusLookupResult | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState<boolean>(false);
  const [earlyBirdNowMs, setEarlyBirdNowMs] = useState<number>(() => Date.now());

  // Live 1-second ticker for Early Birds countdown (till Nov 30 midnight / before Dec 1)
  useEffect(() => {
    if (step !== 'overview' && step !== 'tickets') return;
    const interval = window.setInterval(() => {
      setEarlyBirdNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, [step]);

  // Fetch ticket types and pricing live from Supabase `tickets` table
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await fetchFestivalTickets();
        if (mounted && rows.length > 0) {
          const mapped = rows
            .map(mapSupabaseTicketRow)
            .sort((a, b) => (a.isEarlyBird ? 0 : 1) - (b.isEarlyBird ? 0 : 1));
          setTickets(mapped);
        }
      } finally {
        if (mounted) setTicketsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Scroll to top cleanly when switching between flow views & close mobile summary sheet
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileSummaryOpen(false);
  }, [step]);

  // Countdown timer active during Attendee Details & Checkout steps
  useEffect(() => {
    if (step !== 'details' && step !== 'checkout') return;
    if (bookingSuccessOpen) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, bookingSuccessOpen]);

  // Selected tickets summary
  const selectedItems = useMemo(() => {
    return tickets
      .filter((t) => (quantities[t.id] || 0) > 0)
      .map((t) => ({
        ...t,
        qty: quantities[t.id] || 0,
        totalPasses: (quantities[t.id] || 0) * t.passesPerUnit,
        lineTotal: t.price * (quantities[t.id] || 0),
      }));
  }, [tickets, quantities]);

  const totalCount = useMemo(
    () => selectedItems.reduce((acc, item) => acc + item.qty, 0),
    [selectedItems]
  );

  const totalPassesCount = useMemo(
    () => selectedItems.reduce((acc, item) => acc + item.totalPasses, 0),
    [selectedItems]
  );

  const subTotal = useMemo(
    () => selectedItems.reduce((acc, item) => acc + item.lineTotal, 0),
    [selectedItems]
  );

  // Expanded per-ticket registration blocks
  const attendeeSlots: AttendeeSlot[] = useMemo(() => {
    const slots: AttendeeSlot[] = [];
    for (const item of selectedItems) {
      for (let i = 1; i <= item.qty; i++) {
        slots.push({
          key: `${item.id}-${i}`,
          ticketId: item.id,
          kind: item.kind,
          ticketName: item.name,
          passesPerUnit: item.passesPerUnit,
          instanceIndex: i,
          totalOfType: item.qty,
        });
      }
    }
    return slots;
  }, [selectedItems]);

  // Ensure first attendee card starts expanded when entering Attendee Details
  useEffect(() => {
    if (step === 'details' && attendeeSlots.length > 0) {
      setExpandedAccordions((prev) => {
        const next = { ...prev };
        attendeeSlots.forEach((slot, idx) => {
          if (next[slot.key] === undefined) {
            next[slot.key] = idx === 0;
          }
        });
        return next;
      });
    }
  }, [step, attendeeSlots]);

  // Resolved primary recipient email for booking confirmation popup
  const confirmationEmail = useMemo(() => {
    if (customBuyerEnabled && buyerDetails.email.trim()) {
      return buyerDetails.email.trim();
    }
    const firstKey = attendeeSlots[0]?.key;
    if (firstKey && attendeeForms[firstKey]?.email?.trim()) {
      return attendeeForms[firstKey].email.trim();
    }
    return 'your email address';
  }, [customBuyerEnabled, buyerDetails.email, attendeeSlots, attendeeForms]);

  const updateQuantity = (ticketId: string, delta: number, max = 5) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [ticketId]: next };
    });
  };

  const handleQuickSelectFromOverview = (ticketId?: string) => {
    if (ticketId) {
      setQuantities((prev) => ({
        ...prev,
        [ticketId]: Math.max(1, prev[ticketId] || 0),
      }));
    }
    setStep('tickets');
  };

  const handleProceedFromTickets = () => {
    if (totalCount === 0) return;
    setTimeLeft(600);
    setValidationError(null);
    setStep('details');
  };

  const handleAttendeeFieldChange = (
    slotKey: string,
    field: keyof AttendeeDetails,
    value: string
  ) => {
    setValidationError(null);
    setAttendeeForms((prev) => ({
      ...prev,
      [slotKey]: {
        fullName: prev[slotKey]?.fullName || '',
        email: prev[slotKey]?.email || '',
        phone: prev[slotKey]?.phone || '',
        college: prev[slotKey]?.college || '',
        partnerName: prev[slotKey]?.partnerName || '',
        partnerEmail: prev[slotKey]?.partnerEmail || '',
        guest2Name: prev[slotKey]?.guest2Name || '',
        guest3Name: prev[slotKey]?.guest3Name || '',
        guest4Name: prev[slotKey]?.guest4Name || '',
        guest5Name: prev[slotKey]?.guest5Name || '',
        [field]: value,
      },
    }));
  };

  const handleCopyFromFirst = (targetKey: string) => {
    if (attendeeSlots.length === 0) return;
    const firstKey = attendeeSlots[0].key;
    const firstData = attendeeForms[firstKey];
    if (!firstData) return;
    setAttendeeForms((prev) => ({
      ...prev,
      [targetKey]: {
        ...prev[targetKey],
        fullName: firstData.fullName,
        email: firstData.email,
        phone: firstData.phone,
        college: firstData.college,
      },
    }));
  };

  const handleProceedToCheckout = () => {
    setDetailsAttempted(true);
    for (const slot of attendeeSlots) {
      const data = attendeeForms[slot.key];
      if (
        !data?.fullName?.trim() ||
        !data?.email?.trim() ||
        !data?.phone?.trim() ||
        !data?.college?.trim()
      ) {
        setExpandedAccordions((prev) => ({ ...prev, [slot.key]: true }));
        setValidationError(
          `Please complete all required fields (*) for ${slot.ticketName} (${slot.instanceIndex} of ${slot.totalOfType}).`
        );
        return;
      }
      const phoneError = validateTenDigitMobile(data.phone);
      if (phoneError) {
        setExpandedAccordions((prev) => ({ ...prev, [slot.key]: true }));
        setValidationError(
          `${phoneError} (${slot.ticketName} ${slot.instanceIndex} of ${slot.totalOfType}).`
        );
        return;
      }
      if (slot.kind === 'couple' && !data?.partnerName?.trim()) {
        setExpandedAccordions((prev) => ({ ...prev, [slot.key]: true }));
        setValidationError(
          `Please enter the second guest name (Female entry) for ${slot.ticketName} (${slot.instanceIndex} of ${slot.totalOfType}).`
        );
        return;
      }
    }
    if (customBuyerEnabled) {
      if (!buyerDetails.fullName.trim() || !buyerDetails.email.trim()) {
        setValidationError('Please enter Buyer Name and Email Address for invoice delivery.');
        return;
      }
      if (buyerDetails.phone.trim()) {
        const buyerPhoneError = validateTenDigitMobile(buyerDetails.phone);
        if (buyerPhoneError) {
          setValidationError(`Buyer ${buyerPhoneError}`);
          return;
        }
      }
    }
    setDetailsAttempted(false);
    setValidationError(null);
    setUtrError(null);
    setStep('checkout');
  };

  const handleSubmitUtrPayment = async () => {
    if (isSubmitting) return;
    const cleaned = utrNumber.trim();
    if (!cleaned || cleaned.length < 6) {
      setUtrError('Please enter a valid UTR / UPI Transaction Reference Number (at least 6 characters).');
      return;
    }

    setUtrError(null);
    setIsSubmitting(true);

    const rowsToInsert: UnverifiedBookingInput[] = attendeeSlots.map((slot) => {
      const data = attendeeForms[slot.key];
      let formattedName = (data?.fullName || '').trim();

      if (slot.kind === 'couple' && data?.partnerName?.trim()) {
        formattedName = `${formattedName} & ${data.partnerName.trim()}`;
      } else if (slot.kind === 'group-bundle') {
        const companions = [
          data?.guest2Name,
          data?.guest3Name,
          data?.guest4Name,
          data?.guest5Name,
        ]
          .map((n) => n?.trim())
          .filter(Boolean);
        if (companions.length > 0) {
          formattedName = `${formattedName} (+ ${companions.join(', ')})`;
        }
      }

      return {
        name: formattedName,
        email: (data?.email || '').trim(),
        mobile: (data?.phone || '').replace(/\D/g, ''),
        college: (data?.college || '').trim(),
        ticket_id: Number(slot.ticketId),
        utr_number: cleaned,
      };
    });

    const result = await insertUnverifiedBookings(rowsToInsert);
    setIsSubmitting(false);

    if (!result.success) {
      setUtrError(
        `Could not save your booking (${result.errorMessage || 'Please try again'}).`
      );
      return;
    }

    const newRef = `EMPY-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefId(newRef);
    setBookingSuccessOpen(true);
  };

  const handleResetFlowAfterSuccess = () => {
    setBookingSuccessOpen(false);
    setQuantities({});
    setUtrNumber('');
    setAttendeeForms({});
    setBuyerDetails({ fullName: '', email: '', phone: '' });
    setCustomBuyerEnabled(false);
    setStep('overview');
  };

  const handleStepBack = () => {
    setValidationError(null);
    setUtrError(null);
    if (step === 'tickets') setStep('overview');
    else if (step === 'details') setStep('tickets');
    else if (step === 'checkout') setStep('details');
  };

  // Horizontal Ticket Row Card Renderer (clean KonfHub-style rectangular card)
  const renderPassCard = (ticket: TicketTier, mode: 'overview' | 'selector') => {
    const qty = quantities[ticket.id] || 0;
    const isSelected = mode === 'selector' && qty > 0;
    const isEarly = Boolean(ticket.isEarlyBird);
    const countdown = isEarly ? formatEarlyBirdCountdown(earlyBirdNowMs) : null;

    return (
      <div
        key={ticket.id}
        className={`border rounded-xl p-5 sm:p-6 transition-colors ${
          isEarly
            ? isSelected
              ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 border-amber-500 ring-1 ring-amber-400/40 shadow-[0_3px_12px_rgba(245,158,11,0.12)]'
              : 'bg-gradient-to-br from-amber-50/65 via-white to-amber-50/25 border-amber-300/90 hover:border-amber-400 shadow-[0_2px_8px_rgba(245,158,11,0.08)]'
            : isSelected
            ? 'bg-white border-slate-900/40 ring-1 ring-slate-900/10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">{ticket.name}</h3>

          {countdown && (
            <span
              className="inline-flex items-center gap-1.5 bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums shrink-0 whitespace-nowrap"
              title="Offer closes 30 Nov, 11:59 PM IST"
            >
              <Clock className="w-3 h-3 text-amber-700 shrink-0" />
              <span>{countdown.text}</span>
            </span>
          )}
        </div>

        <p className="text-xs sm:text-[13px] text-slate-500 mt-1 max-w-xl leading-relaxed">
          {ticket.description}
        </p>
        <div className="mt-2.5">
          <span
            className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded ${
              isEarly
                ? 'bg-amber-100/80 text-amber-900 border border-amber-200/80'
                : 'bg-[#f1f5f9] text-slate-600'
            }`}
          >
            {ticket.tag}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-xl font-bold text-slate-900">{formatINR(ticket.price)}</div>

          {mode === 'overview' ? (
            <button
              type="button"
              onClick={() => handleQuickSelectFromOverview(ticket.id)}
              className="px-5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] text-slate-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Select Ticket
            </button>
          ) : qty === 0 ? (
            <button
              type="button"
              onClick={() => updateQuantity(ticket.id, 1, ticket.maxPerOrder)}
              className="px-5 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-slate-900 hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors cursor-pointer"
            >
              Add
            </button>
          ) : (
            <div className="inline-flex items-center border border-slate-900 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => updateQuantity(ticket.id, -1, ticket.maxPerOrder)}
                className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label={`Decrease quantity for ${ticket.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1 text-sm font-semibold text-slate-900 min-w-[32px] text-center">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(ticket.id, 1, ticket.maxPerOrder)}
                disabled={qty >= ticket.maxPerOrder}
                className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label={`Increase quantity for ${ticket.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // VIEW 0: EVENT OVERVIEW PAGE
  // ---------------------------------------------------------------------------
  if (step === 'overview') {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-body antialiased selection:bg-[#0f172a] selection:text-white">
        {/* Top Navbar */}
        <header className="w-full bg-white border-b border-slate-100">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2.5 cursor-pointer group focus:outline-none"
              title="Back to Empyrean Website"
            >
              <img
                src="/assets/empyrean/logo-empyrean.webp"
                alt="Empyrean — Annual Fest of IIM Jammu"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </button>

            <div className="flex items-center gap-3">
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Fest Site</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setStatusResult(null);
                  setStatusModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:border-slate-900 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Check Ticket Status</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: Banner + Stacked Tickets List */}
            <div className="lg:col-span-8">
              {/* Event Banner Card */}
              <div className="rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(15,23,42,0.1)] border border-slate-100 bg-[#071026] aspect-[16/9]">
                <img
                  src="/assets/empyrean/test_ideal_composite.png"
                  alt="Empyrean 2026 — An Era Reimagined, Annual Fest of IIM Jammu"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TICKETS Section */}
              <section id="overview-tickets-list" className="mt-10 sm:mt-12">
                <h2 className="text-base sm:text-lg font-bold tracking-wide text-slate-900 uppercase mb-4">
                  Tickets
                </h2>

                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 sm:p-5 space-y-3.5">
                  {ticketsLoading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 animate-pulse space-y-3"
                        >
                          <div className="h-4 w-44 bg-slate-200 rounded" />
                          <div className="h-3 w-3/4 bg-slate-100 rounded" />
                          <div className="h-5 w-24 bg-slate-200 rounded mt-3" />
                        </div>
                      ))
                    : tickets.map((ticket) => renderPassCard(ticket, 'overview'))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Event Info + Register CTA + Hosted By + Powered By */}
            <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-8">
              {/* Top Info Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <h1 className="text-xl sm:text-[22px] font-bold text-slate-900 leading-snug">
                  Empyrean 2026 — Annual Fest of IIM Jammu
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-slate-400" />
                    In-person
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-slate-400" />
                    Paid
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600 leading-relaxed space-y-1">
                  <p className="font-medium text-slate-800">
                    IIM Jammu, Jagti Campus, NH-44
                  </p>
                  <p className="text-slate-500">
                    3 Days of Culture, Sports &amp; Management • (GMT+05:30)
                  </p>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={() => handleQuickSelectFromOverview()}
                className="w-full py-3 rounded-lg bg-[#0f172a] hover:bg-black text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Register Now
              </button>

              {/* Hosted By Card */}
              <div className="pt-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
                  Hosted by
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src="/assets/empyrean/iim-jammu-logo-clean.png"
                      alt="IIM Jammu Logo"
                      className="w-10 h-11 object-contain shrink-0"
                    />
                    <span className="font-semibold text-slate-900 text-sm sm:text-[15px]">
                      Indian Institute of Management Jammu
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    Empyrean is the flagship annual cultural, sports, and management fest of the Indian Institute of Management Jammu (IIM Jammu). Held across the scenic 200-acre Jagti campus in the foothills of the Trikutas, Empyrean brings together 25,000+ footfall, 20+ flagship events, headline pronites, and college contingents from across India.
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-3">
                      Contact Us On
                    </p>
                    <div className="flex items-center gap-2.5">
                      <a
                        href="mailto:empyrean@iimj.ac.in"
                        className="w-8 h-8 rounded-full bg-[#0f172a] hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
                        title="Email empyrean@iimj.ac.in"
                        aria-label="Email Empyrean Organizing Team"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href="tel:+918899012345"
                        className="w-8 h-8 rounded-full bg-[#0f172a] hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
                        title="Call +91 88990 12345"
                        aria-label="Call Empyrean Organizing Team"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Powered By pinned cleanly at bottom of right sidebar */}
              <PoweredByVespar />
            </aside>
          </div>
        </main>

        {/* Check Ticket Status Modal */}
        {statusModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-status-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setStatusModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close status lookup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h2
                    id="ticket-status-modal-title"
                    className="text-lg font-bold text-slate-900 leading-tight"
                  >
                    Check Ticket Status
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track your UTR verification &amp; pass issuance
                  </p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!statusEmail.trim() || statusLoading) return;
                  setStatusLoading(true);
                  const res = await checkTicketStatusByEmail(statusEmail);
                  setStatusResult(res);
                  setStatusLoading(false);
                }}
                className="mt-5 space-y-3"
              >
                <div>
                  <label
                    htmlFor="ticket-status-email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Enter your Registered Gmail / Email Address
                  </label>
                  <input
                    id="ticket-status-email"
                    type="email"
                    required
                    value={statusEmail}
                    onChange={(e) => {
                      setStatusEmail(e.target.value);
                      if (statusResult) setStatusResult(null);
                    }}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={statusLoading}
                  className="w-full py-2.5 rounded-lg bg-[#0f172a] hover:bg-black disabled:bg-slate-600 text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {statusLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>Check Status</span>
                  )}
                </button>
              </form>

              {statusResult && (
                <div className="mt-5">
                  {statusResult.status === 'verified' && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-emerald-900">
                          Ticket Status
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      </div>

                      {statusResult.entries && statusResult.entries.length > 0 && (
                        <div className="pt-2 border-t border-emerald-200/70 space-y-1 text-xs text-emerald-900">
                          {statusResult.entries.map((entry, idx) => {
                            const matchedTicket = tickets.find(
                              (t) => Number(t.id) === Number(entry.ticket_id)
                            );
                            return (
                              <div key={idx} className="flex items-center justify-between gap-2">
                                <span className="font-medium truncate">{entry.name}</span>
                                <span className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-emerald-200/70 shrink-0">
                                  {matchedTicket?.name || `Ticket #${entry.ticket_id}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <p className="pt-2 border-t border-emerald-200/70 text-[11px] text-emerald-800">
                        Didn&apos;t Receive Ticket? Reach out at{' '}
                        <a
                          href="mailto:empyrean@iimj.ac.in"
                          className="font-semibold underline underline-offset-2 hover:text-emerald-950"
                        >
                          empyrean@iimj.ac.in
                        </a>
                      </p>
                    </div>
                  )}

                  {statusResult.status === 'unverified' && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-amber-900">
                          Ticket Status
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Verification
                        </span>
                      </div>

                      {statusResult.entries && statusResult.entries.length > 0 && (
                        <div className="pt-2 border-t border-amber-200/70 space-y-1 text-xs text-amber-900">
                          {statusResult.entries.map((entry, idx) => {
                            const matchedTicket = tickets.find(
                              (t) => Number(t.id) === Number(entry.ticket_id)
                            );
                            return (
                              <div key={idx} className="flex items-center justify-between gap-2">
                                <span className="font-medium truncate">{entry.name}</span>
                                <span className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-amber-200/70 shrink-0">
                                  {matchedTicket?.name || `Ticket #${entry.ticket_id}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <p className="pt-2 border-t border-amber-200/70 text-[11px] text-amber-800 leading-relaxed">
                        Your payment verification is currently in progress. You will receive your ticket on{' '}
                        <span className="font-semibold">{statusResult.email}</span> as soon as we verify. Need help?{' '}
                        <a
                          href="mailto:empyrean@iimj.ac.in"
                          className="font-semibold underline underline-offset-2 hover:text-amber-950"
                        >
                          empyrean@iimj.ac.in
                        </a>
                      </p>
                    </div>
                  )}

                  {statusResult.status === 'rejected' && (
                    <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-red-900">
                          Ticket Status
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      </div>

                      <p className="pt-2 border-t border-red-200/70 text-xs text-red-800 leading-relaxed">
                        Report your problems at{' '}
                        <a
                          href="mailto:empyrean@iimj.ac.in"
                          className="font-semibold underline underline-offset-2 hover:text-red-950"
                        >
                          empyrean@iimj.ac.in
                        </a>
                      </p>
                    </div>
                  )}

                  {statusResult.status === 'not-found' && (
                    <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 space-y-1.5 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">
                        No Booking Found
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        No booking was found for{' '}
                        <span className="font-medium text-slate-700">{statusResult.email}</span>{' '}
                        across verified, pending, or rejected records. Need help? Reach out at{' '}
                        <a
                          href="mailto:empyrean@iimj.ac.in"
                          className="font-semibold text-slate-800 underline underline-offset-2"
                        >
                          empyrean@iimj.ac.in
                        </a>
                      </p>
                    </div>
                  )}

                  {statusResult.status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2 text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Unable to check status right now ({statusResult.errorMessage}).
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STEPS 1, 2, 3: TICKETS SELECTION -> ATTENDEE DETAILS -> CHECKOUT (QR + UTR)
  // ---------------------------------------------------------------------------
  const isStep1Done = step === 'details' || step === 'checkout';
  const isStep2Done = step === 'checkout';

  return (
    <div className="min-h-screen bg-white text-slate-900 font-body antialiased selection:bg-[#0f172a] selection:text-white flex flex-col">
      {/* Top Checkout Bar */}
      <header className="w-full bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={handleStepBack}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <div>
              <h1 className="font-semibold text-slate-900 text-base sm:text-lg leading-tight">
                Empyrean 2026 — Annual Fest of IIM Jammu
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>IIM Jammu, Jagti Campus • In-person Event (IST)</span>
              </p>
            </div>
          </div>

          {/* Right Red Countdown Pill on Steps 2 & 3 */}
          {(step === 'details' || step === 'checkout') && (
            <div className="inline-flex items-center gap-1.5 bg-[#e11d48] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Left: {formatTimer(timeLeft)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={`flex-1 max-w-[1160px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 ${
          totalCount > 0 ? 'pb-28 lg:pb-12' : 'pb-12'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* LEFT COLUMN: Stepper + Step Body */}
          <div className="lg:col-span-8">
            {/* Stepper Pill Bar */}
            <nav
              aria-label="Ticket checkout progress"
              className="bg-[#f8fafc] border border-slate-100 rounded-xl px-4 sm:px-6 py-3 mb-6 flex items-center justify-between text-xs sm:text-[13px]"
            >
              {/* Step 1: Tickets */}
              <button
                type="button"
                onClick={() => setStep('tickets')}
                className="flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none"
              >
                {isStep1Done ? (
                  <span className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-[#0f172a] text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                )}
                <span className={step === 'tickets' ? 'font-semibold text-slate-900' : 'text-slate-600 font-medium'}>
                  Tickets
                </span>
              </button>

              <div className="flex-1 border-t border-dashed border-slate-300 mx-2.5 sm:mx-5" />

              {/* Step 2: Attendee Details */}
              <button
                type="button"
                onClick={() => {
                  if (totalCount > 0 && (step === 'checkout' || step === 'details')) {
                    setStep('details');
                  }
                }}
                className={`flex items-center gap-2 shrink-0 focus:outline-none ${
                  step === 'checkout' ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {isStep2Done ? (
                  <span className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                ) : (
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      step === 'details'
                        ? 'bg-[#0f172a] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    2
                  </span>
                )}
                <span
                  className={
                    step === 'details'
                      ? 'font-semibold text-slate-900'
                      : 'text-slate-500 font-medium'
                  }
                >
                  Attendee Details
                </span>
              </button>

              <div className="flex-1 border-t border-dashed border-slate-300 mx-2.5 sm:mx-5" />

              {/* Step 3: Checkout */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    step === 'checkout'
                      ? 'bg-[#0f172a] text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  3
                </span>
                <span
                  className={
                    step === 'checkout'
                      ? 'font-semibold text-slate-900'
                      : 'text-slate-500 font-medium'
                  }
                >
                  Checkout
                </span>
              </div>
            </nav>

            {/* STEP 1 BODY: TICKETS LIST */}
            {step === 'tickets' && (
              <div className="space-y-4">
                {ticketsLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 animate-pulse space-y-3"
                      >
                        <div className="h-4 w-44 bg-slate-200 rounded" />
                        <div className="h-3 w-3/4 bg-slate-100 rounded" />
                        <div className="h-5 w-24 bg-slate-200 rounded mt-3" />
                      </div>
                    ))
                  : tickets.map((ticket) => renderPassCard(ticket, 'selector'))}
              </div>
            )}

            {/* STEP 2 BODY: ATTENDEE DETAILS (Without Course & Academic Year) */}
            {step === 'details' && (
              <div className="space-y-4">
                {validationError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
                    {validationError}
                  </div>
                )}

                {attendeeSlots.map((slot, index) => {
                  const isOpen = expandedAccordions[slot.key] ?? index === 0;
                  const data = attendeeForms[slot.key] || {
                    fullName: '',
                    email: '',
                    phone: '',
                    college: '',
                    partnerName: '',
                    partnerEmail: '',
                    guest2Name: '',
                    guest3Name: '',
                    guest4Name: '',
                    guest5Name: '',
                  };

                  const isCouple = slot.kind === 'couple';
                  const isGroupBundle = slot.kind === 'group-bundle';

                  return (
                    <div
                      key={slot.key}
                      className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden"
                    >
                      {/* Accordion Header */}
                      <div className="px-5 py-3.5 bg-[#f8fafc] border-b border-slate-100 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedAccordions((prev) => ({
                              ...prev,
                              [slot.key]: !isOpen,
                            }))
                          }
                          className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
                        >
                          <span className="text-sm font-bold text-slate-800">
                            {slot.ticketName} ({slot.instanceIndex} of {slot.totalOfType})
                          </span>
                          {slot.passesPerUnit > 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 text-[10px] font-semibold">
                              <Users className="w-3 h-3" />
                              {slot.passesPerUnit} Entries
                            </span>
                          )}
                        </button>

                        <div className="flex items-center gap-3">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleCopyFromFirst(slot.key)}
                              className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                            >
                              Copy from Ticket 1
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedAccordions((prev) => ({
                                ...prev,
                                [slot.key]: !isOpen,
                              }))
                            }
                            className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                            aria-label="Toggle attendee form"
                          >
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Accordion Body */}
                      {isOpen && (
                        <div className="p-5 space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                              {isCouple
                                ? 'Guest 1 Full Name (Male Entry)'
                                : isGroupBundle
                                ? 'Primary Delegate / Group Lead Name (Ticket 1 of 5)'
                                : 'Full Name'}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={data.fullName}
                              onChange={(e) =>
                                handleAttendeeFieldChange(slot.key, 'fullName', e.target.value)
                              }
                              placeholder="Enter full name"
                              className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Email Address<span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                  handleAttendeeFieldChange(slot.key, 'email', e.target.value)
                                }
                                placeholder="name@college.edu"
                                className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Mobile Number<span className="text-red-500">*</span>
                              </label>
                              {(() => {
                                const phoneErr =
                                  data.phone.trim() || detailsAttempted
                                    ? validateTenDigitMobile(data.phone)
                                    : null;
                                return (
                                  <>
                                    <input
                                      type="tel"
                                      inputMode="numeric"
                                      value={data.phone}
                                      onChange={(e) =>
                                        handleAttendeeFieldChange(slot.key, 'phone', e.target.value)
                                      }
                                      placeholder="10-digit mobile number"
                                      className={`w-full h-10 px-3.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                                        phoneErr
                                          ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                                          : 'border-slate-300 focus:border-slate-900'
                                      }`}
                                    />
                                    {phoneErr && (
                                      <p className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        <span>{phoneErr}</span>
                                      </p>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                              College / University Name<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={data.college}
                              onChange={(e) =>
                                handleAttendeeFieldChange(slot.key, 'college', e.target.value)
                              }
                              placeholder="e.g. IIM Jammu, IIT Jammu, JU"
                              className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                            />
                          </div>

                          {/* Couple Entry Partner Row */}
                          {isCouple && (
                            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                  Guest 2 Full Name (Female Entry)
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={data.partnerName || ''}
                                  onChange={(e) =>
                                    handleAttendeeFieldChange(
                                      slot.key,
                                      'partnerName',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter partner full name"
                                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                  Guest 2 Email (Optional)
                                </label>
                                <input
                                  type="email"
                                  value={data.partnerEmail || ''}
                                  onChange={(e) =>
                                    handleAttendeeFieldChange(
                                      slot.key,
                                      'partnerEmail',
                                      e.target.value
                                    )
                                  }
                                  placeholder="partner@college.edu"
                                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                                />
                              </div>
                            </div>
                          )}

                          {/* Buy 4 Get 1 Free: Co-Attendees 2..5 */}
                          {isGroupBundle && (
                            <div className="pt-3 border-t border-slate-100 space-y-2.5">
                              <p className="text-xs font-semibold text-slate-700">
                                Additional Group Members (Tickets 2 – 5 of this bundle)
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={data.guest2Name || ''}
                                  onChange={(e) =>
                                    handleAttendeeFieldChange(slot.key, 'guest2Name', e.target.value)
                                  }
                                  placeholder="Ticket 2 Delegate Name"
                                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={data.guest3Name || ''}
                                  onChange={(e) =>
                                    handleAttendeeFieldChange(slot.key, 'guest3Name', e.target.value)
                                  }
                                  placeholder="Ticket 3 Delegate Name"
                                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={data.guest4Name || ''}
                                  onChange={(e) =>
                                    handleAttendeeFieldChange(slot.key, 'guest4Name', e.target.value)
                                  }
                                  placeholder="Ticket 4 Delegate Name"
                                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={data.guest5Name || ''}
                                  onChange={(e) =>
                                    handleAttendeeFieldChange(slot.key, 'guest5Name', e.target.value)
                                  }
                                  placeholder="Ticket 5 Delegate Name (FREE)"
                                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Buyer Details Toggle Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs sm:text-sm text-slate-800">
                      <span className="font-bold">Buyer Details</span>{' '}
                      <span className="text-slate-500 text-xs">
                        (Invoice/Receipt will be sent to the below details)
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={customBuyerEnabled}
                      onClick={() => setCustomBuyerEnabled(!customBuyerEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        customBuyerEnabled ? 'bg-[#0f172a]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          customBuyerEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {customBuyerEnabled && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Buyer Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={buyerDetails.fullName}
                          onChange={(e) =>
                            setBuyerDetails((p) => ({ ...p, fullName: e.target.value }))
                          }
                          placeholder="Full Name"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Buyer Email<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={buyerDetails.email}
                          onChange={(e) =>
                            setBuyerDetails((p) => ({ ...p, email: e.target.value }))
                          }
                          placeholder="Email Address"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Mobile Number
                        </label>
                        {(() => {
                          const buyerPhoneErr = buyerDetails.phone.trim()
                            ? validateTenDigitMobile(buyerDetails.phone)
                            : null;
                          return (
                            <>
                              <input
                                type="tel"
                                inputMode="numeric"
                                value={buyerDetails.phone}
                                onChange={(e) => {
                                  setValidationError(null);
                                  setBuyerDetails((p) => ({ ...p, phone: e.target.value }));
                                }}
                                placeholder="10-digit mobile number"
                                className={`w-full h-9 px-3 rounded-lg border text-xs sm:text-sm text-slate-900 focus:outline-none ${
                                  buyerPhoneErr
                                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                                    : 'border-slate-300 focus:border-slate-900'
                                }`}
                              />
                              {buyerPhoneErr && (
                                <p className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{buyerPhoneErr}</span>
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 BODY: SINGLE UPI QR PAYMENT + UTR REFERENCE SUBMISSION */}
            {step === 'checkout' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  Scan &amp; Pay via UPI QR
                </h2>

                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
                  {/* Single QR Code + Instructions */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    {/* QR Container */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-44 h-44 sm:w-48 sm:h-48 p-2 rounded-xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden flex items-center justify-center">
                        <img
                          src="/payment-qr.png"
                          alt="Official Empyrean UPI Payment QR Code"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        <QrCode className="w-3.5 h-3.5 text-slate-500" />
                        <span>Official Empyrean UPI QR</span>
                      </span>
                    </div>

                    {/* Instructions & Payable Amount */}
                    <div className="flex-1 text-center sm:text-left space-y-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Amount to Pay
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                          {formatINR(subTotal)}
                        </p>
                      </div>

                      <ol className="text-xs sm:text-[13px] text-slate-600 space-y-1.5 text-left list-decimal list-inside leading-relaxed">
                        <li>Open Google Pay, PhonePe, Paytm, or any UPI app.</li>
                        <li>
                          Scan this QR code and transfer exactly{' '}
                          <span className="font-semibold text-slate-900">{formatINR(subTotal)}</span>.
                        </li>
                        <li>
                          Enter your <span className="font-semibold text-slate-900">UTR / Reference Number</span> below to submit for verification.
                        </li>
                      </ol>

                      <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-semibold text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">GPay</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">PhonePe</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Paytm</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">BHIM UPI</span>
                      </div>
                    </div>
                  </div>

                  {/* UTR / Transaction Reference Number Field */}
                  <div className="pt-5 border-t border-slate-100">
                    <label
                      htmlFor="utr-reference-input"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      UTR / Transaction Reference Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="utr-reference-input"
                      type="text"
                      value={utrNumber}
                      onChange={(e) => {
                        setUtrNumber(e.target.value);
                        if (utrError) setUtrError(null);
                      }}
                      placeholder="Enter 12-digit UTR / Reference Number (e.g. 432910485921)"
                      className={`w-full h-11 px-3.5 rounded-lg border text-sm font-mono tracking-wide text-slate-900 placeholder:font-body placeholder:tracking-normal placeholder-slate-400 focus:outline-none transition-colors ${
                        utrError
                          ? 'border-red-400 bg-red-50/40 focus:border-red-600'
                          : 'border-slate-300 focus:border-slate-900'
                      }`}
                    />
                    {utrError ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{utrError}</p>
                    ) : (
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        You can find the 12-digit UTR / UPI Ref ID in your UPI payment receipt.
                      </p>
                    )}
                  </div>
                </div>

                {/* Security Notice Banner */}
                <div className="bg-[#f1f5f9] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-700">
                  <Info className="w-4 h-4 text-slate-800 shrink-0" />
                  <span>
                    Empyrean does not collect UPI PINs, banking passwords, card details, or OTPs.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY CART SUMMARY + POWERED BY VESPAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-6">
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4 sm:p-5">
              {totalCount === 0 ? (
                /* Empty Cart Summary State */
                <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
                  <ShoppingCart className="w-10 h-10 text-slate-400 mx-auto mb-3 stroke-[1.5]" />
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[230px] mx-auto">
                    You haven&apos;t selected any ticket. Select a ticket to see the ticket summary.
                  </p>
                </div>
              ) : (
                /* Populated Cart Summary Card */
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Cart Summary
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400">
                      {totalPassesCount} Pass{totalPassesCount > 1 ? 'es' : ''}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 text-xs sm:text-[13px] text-slate-800"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-800">{item.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#0f172a] text-white text-[10px] font-semibold leading-none">
                            x{item.qty}
                          </span>
                        </div>
                        <span className="font-medium text-slate-700 shrink-0">
                          {formatINR(item.lineTotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Sub Total</span>
                      <span>{formatINR(subTotal)}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-base sm:text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatINR(subTotal)}</span>
                  </div>
                </div>
              )}

              {/* Step Action Button */}
              {step === 'tickets' && (
                <button
                  type="button"
                  disabled={totalCount === 0}
                  onClick={handleProceedFromTickets}
                  className={`w-full mt-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    totalCount === 0
                      ? 'bg-[#52525b] text-white/90 cursor-not-allowed'
                      : 'bg-[#0f172a] hover:bg-black text-white cursor-pointer shadow-sm'
                  }`}
                >
                  Proceed
                </button>
              )}

              {step === 'details' && (
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full mt-4 py-3 rounded-lg bg-[#0f172a] hover:bg-black text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Checkout
                </button>
              )}

              {step === 'checkout' && (
                <>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitUtrPayment}
                    className="w-full mt-4 py-3 rounded-lg bg-[#0f172a] hover:bg-black disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Booking...</span>
                      </>
                    ) : (
                      <span>Submit UTR &amp; Complete Booking</span>
                    )}
                  </button>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500 text-center">
                    By clicking Submit UTR &amp; Complete Booking, you acknowledge that you have read our{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacyPolicy}
                      className="text-blue-600 hover:underline cursor-pointer font-medium"
                    >
                      Privacy Policy
                    </button>{' '}
                    and agree to the{' '}
                    <button
                      type="button"
                      onClick={onOpenTerms}
                      className="text-blue-600 hover:underline cursor-pointer font-medium"
                    >
                      Terms of Service
                    </button>
                    . You authorise IIM Jammu (Empyrean Organising Team) and Vespar Solutions to verify your UTR and issue your festival passes.
                  </p>
                </>
              )}
            </div>

            {/* Powered By always pinned on the bottom of the right sidebar */}
            <PoweredByVespar />
          </aside>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* MOBILE STICKY BOTTOM CHECKOUT BAR (matches KonfHub mobile bar)        */}
      {/* Appears automatically on mobile once 1+ ticket is selected            */}
      {/* ===================================================================== */}
      {totalCount > 0 && !bookingSuccessOpen && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-slate-200 shadow-[0_-6px_24px_rgba(15,23,42,0.08)] px-4 py-3 animate-fadeIn"
          style={{
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="max-w-[1160px] mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
                {formatINR(subTotal)}
                {step === 'details' ? '*' : ''}
              </div>
              <button
                type="button"
                onClick={() => setMobileSummaryOpen(true)}
                className="text-xs font-medium text-blue-600 hover:underline cursor-pointer mt-0.5 block text-left"
              >
                View Summary
              </button>
            </div>

            <button
              type="button"
              disabled={step === 'checkout' && isSubmitting}
              onClick={() => {
                setMobileSummaryOpen(false);
                if (step === 'tickets') handleProceedFromTickets();
                else if (step === 'details') handleProceedToCheckout();
                else if (step === 'checkout') handleSubmitUtrPayment();
              }}
              className="px-7 py-2.5 rounded-lg bg-black hover:bg-slate-900 disabled:bg-slate-600 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer shrink-0 inline-flex items-center justify-center gap-2"
            >
              {step === 'tickets' && <span>Proceed</span>}
              {step === 'details' && <span>Checkout</span>}
              {step === 'checkout' &&
                (isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Complete Booking</span>
                ))}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MOBILE "VIEW SUMMARY" BOTTOM SHEET MODAL                              */}
      {/* ===================================================================== */}
      {mobileSummaryOpen && totalCount > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-cart-summary-title"
          className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
          onClick={() => setMobileSummaryOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl p-5 sm:p-6 shadow-2xl border-t border-slate-100 max-h-[82vh] overflow-y-auto"
            style={{
              paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3
                  id="mobile-cart-summary-title"
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Cart Summary
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {totalPassesCount} Pass{totalPassesCount > 1 ? 'es' : ''} Selected
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileSummaryOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Close summary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm text-slate-800"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0f172a] text-white text-[10px] font-semibold leading-none">
                      x{item.qty}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800 shrink-0">
                    {formatINR(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Sub Total</span>
                <span>{formatINR(subTotal)}</span>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>
                {formatINR(subTotal)}
                {step === 'details' ? '*' : ''}
              </span>
            </div>

            <button
              type="button"
              disabled={step === 'checkout' && isSubmitting}
              onClick={() => {
                setMobileSummaryOpen(false);
                if (step === 'tickets') handleProceedFromTickets();
                else if (step === 'details') handleProceedToCheckout();
                else if (step === 'checkout') handleSubmitUtrPayment();
              }}
              className="w-full mt-5 py-3 rounded-lg bg-black hover:bg-slate-900 disabled:bg-slate-600 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {step === 'tickets'
                ? 'Proceed'
                : step === 'details'
                ? 'Checkout'
                : isSubmitting
                ? 'Submitting...'
                : 'Submit UTR & Complete Booking'}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* RAZORPAY-STYLE ANIMATED GREEN TICK POPUP MODAL ON BOOKING SUBMISSION */}
      {/* ===================================================================== */}
      {bookingSuccessOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl p-7 sm:p-8 shadow-2xl border border-slate-100 text-center animate-scaleUp">
            {/* Close button */}
            <button
              type="button"
              onClick={handleResetFlowAfterSuccess}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close confirmation popup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Razorpay-style Animated Green Checkmark */}
            <div className="relative flex items-center justify-center mx-auto w-20 h-20 mb-5">
              <span
                className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"
                style={{ animationIterationCount: 2, animationDuration: '1.2s' }}
                aria-hidden="true"
              />
              <svg
                className="rzp-checkmark relative z-10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                aria-hidden="true"
              >
                <circle className="rzp-checkmark-circle" cx="26" cy="26" r="24" fill="none" />
                <path className="rzp-checkmark-check" fill="none" d="M15 27l7 7 15-16" />
              </svg>
            </div>

            <h2
              id="booking-success-title"
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            >
              Thank you for booking!
            </h2>

            <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
              You will receive your ticket on{' '}
              <span className="font-semibold text-slate-900 break-all">
                {confirmationEmail}
              </span>{' '}
              as soon as we verify.
            </p>

            {/* Verification Reference Summary Box */}
            <div className="mt-5 bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Reference ID</span>
                <span className="font-mono font-semibold text-slate-800">{bookingRefId}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>UTR Submitted</span>
                <span className="font-mono font-semibold text-slate-800">{utrNumber.trim()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pt-1.5 border-t border-slate-200/80">
                <span>Total Amount</span>
                <span className="font-bold text-slate-900 text-sm">{formatINR(subTotal)}</span>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>UTR queued for verification by IIM Jammu team</span>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleResetFlowAfterSuccess}
                className="w-full py-2.5 rounded-lg bg-[#0f172a] hover:bg-black text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
              {onBackToHome && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetFlowAfterSuccess();
                    onBackToHome();
                  }}
                  className="w-full py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  Return to Empyrean Home
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
