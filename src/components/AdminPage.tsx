import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Check,
  X,
  RefreshCw,
  Search,
  LogOut,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Ticket,
  Download,
  ScanLine,
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import type { Session } from '@supabase/supabase-js';
import {
  supabase,
  fetchFestivalTickets,
  fetchAdminTableRecords,
  moveUnverifiedBooking,
  fetchIssuedQrTokens,
  ensureAndSaveTicketQrToken,
  type SupabaseTicketRow,
  type TicketRecordRow,
  type AdminTicketTable,
} from '../lib/supabase';

export interface AdminPageProps {
  onOpenScanner?: () => void;
  onBackToTickets?: () => void;
  onBackToHome?: () => void;
}

const formatINR = (amount: number) => {
  return `₹ ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

const DEFAULT_TICKET_CATALOG: Record<number, SupabaseTicketRow> = {
  1: { id: 1, ticket: 'All Days (All Access Pass)', price: 999 },
  2: { id: 2, ticket: 'Day 1', price: 499 },
  3: { id: 3, ticket: 'Day 2', price: 299 },
  4: { id: 4, ticket: 'Day 3', price: 699 },
  5: { id: 5, ticket: 'Couple Entry', price: 1799 },
  6: { id: 6, ticket: 'Buy 4 Get 1 FREE', price: 4000 },
};

const PoweredByVespar: React.FC = () => (
  <div className="pt-8 pb-6 flex flex-col items-center justify-center select-none">
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

export const AdminPage: React.FC<AdminPageProps> = ({
  onOpenScanner,
  onBackToTickets,
  onBackToHome,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTicketTable>('unverified');
  const [ticketCatalog, setTicketCatalog] = useState<Record<number, SupabaseTicketRow>>(
    DEFAULT_TICKET_CATALOG
  );
  const [unverifiedRows, setUnverifiedRows] = useState<TicketRecordRow[]>([]);
  const [verifiedRows, setVerifiedRows] = useState<TicketRecordRow[]>([]);
  const [rejectedRows, setRejectedRows] = useState<TicketRecordRow[]>([]);

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [actionBanner, setActionBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [issuedQrTokens, setIssuedQrTokens] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Check existing Supabase Auth session on mount & subscribe to changes
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
        setAuthChecking(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession ?? null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Load ticket catalog + all three tables whenever admin is signed in
  const loadDashboardData = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);

    const [catalogRows, unvRes, verRes, rejRes, issuedMap] = await Promise.all([
      fetchFestivalTickets(),
      fetchAdminTableRecords('unverified'),
      fetchAdminTableRecords('verified'),
      fetchAdminTableRecords('rejected'),
      fetchIssuedQrTokens(),
    ]);

    const catalogMap: Record<number, SupabaseTicketRow> = { ...DEFAULT_TICKET_CATALOG };
    catalogRows.forEach((row) => {
      catalogMap[Number(row.id)] = row;
    });
    setTicketCatalog(catalogMap);

    setUnverifiedRows(unvRes.rows);
    setVerifiedRows(verRes.rows);
    setRejectedRows(rejRes.rows);
    setIssuedQrTokens(issuedMap);

    const firstError = unvRes.errorMessage || verRes.errorMessage || rejRes.errorMessage;
    if (firstError) {
      setDataError(firstError);
    }

    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session, loadDashboardData]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLoading) return;
    setLoginError(null);
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    setLoginLoading(false);
    if (error) {
      setLoginError(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUnverifiedRows([]);
    setVerifiedRows([]);
    setRejectedRows([]);
    setActionBanner(null);
    setDataError(null);
  };

  const handleDecision = async (
    entry: TicketRecordRow,
    targetTable: 'verified' | 'rejected'
  ) => {
    if (processingId !== null) return;
    setProcessingId(entry.id);
    setActionBanner(null);

    const result = await moveUnverifiedBooking(entry, targetTable);
    setProcessingId(null);

    if (!result.success) {
      setActionBanner({
        type: 'error',
        message: result.errorMessage || `Failed to mark entry #${entry.id} as ${targetTable}.`,
      });
      return;
    }

    // Update local state immediately
    setUnverifiedRows((prev) => prev.filter((r) => r.id !== entry.id));

    if (result.insertedRow) {
      if (targetTable === 'verified') {
        setVerifiedRows((prev) => [result.insertedRow!, ...prev]);
      } else {
        setRejectedRows((prev) => [result.insertedRow!, ...prev]);
      }
    }

    const verb = targetTable === 'verified' ? 'Verified' : 'Rejected';
    const newIdText = result.insertedRow?.id ? ` (New ${targetTable} ID #${result.insertedRow.id})` : '';
    setActionBanner({
      type: 'success',
      message: `${verb} ${entry.name}${newIdText}.`,
    });
  };

  const handleDownloadTicket = async (entry: TicketRecordRow) => {
    if (downloadingId !== null) return;
    setDownloadingId(entry.id);
    setActionBanner(null);

    const ticketInfo = ticketCatalog[Number(entry.ticket_id)];
    const ticketName = ticketInfo?.ticket;

    const saveResult = await ensureAndSaveTicketQrToken(entry, ticketName);

    if (!saveResult.success || !saveResult.qrCodeId) {
      setDownloadingId(null);
      setActionBanner({
        type: 'error',
        message: saveResult.errorMessage || `Could not issue ticket QR for ${entry.name}.`,
      });
      return;
    }

    const token = saveResult.qrCodeId;
    setIssuedQrTokens((prev) => ({ ...prev, [entry.id]: token }));

    try {
      const qrCode = new QRCodeStyling({
        width: 1000,
        height: 1000,
        type: 'canvas',
        data: token,
        image: '/vespar-qr.png',
        margin: 36,
        qrOptions: {
          errorCorrectionLevel: 'H',
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.28,
          margin: 8,
          crossOrigin: 'anonymous',
        },
        dotsOptions: {
          color: '#0b1839',
          type: 'rounded',
        },
        cornersSquareOptions: {
          color: '#0b1839',
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: '#b48a3e',
          type: 'dot',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
      });

      const safeBuyerName =
        entry.name
          .trim()
          .replace(/[<>:"/\\|?*]+/g, '')
          .replace(/\s+/g, '_') || 'Delegate';

      await qrCode.download({
        name: `${safeBuyerName}_Empyrean`,
        extension: 'png',
      });

      setActionBanner({
        type: 'success',
        message: `${saveResult.alreadyIssued ? 'Re-downloaded' : 'Issued & saved'} QR pass in ${
          saveResult.table
        } for ${entry.name} (Token: ${token}).`,
      });
    } catch (err) {
      setActionBanner({
        type: 'error',
        message: `Saved token to ${saveResult.table}, but QR download failed: ${
          err instanceof Error ? err.message : 'Browser error'
        }`,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const currentTabRows = useMemo(() => {
    if (activeTab === 'unverified') return unverifiedRows;
    if (activeTab === 'verified') return verifiedRows;
    return rejectedRows;
  }, [activeTab, unverifiedRows, verifiedRows, rejectedRows]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentTabRows;
    return currentTabRows.filter((row) => {
      const ticketInfo = ticketCatalog[Number(row.ticket_id)];
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.mobile.toLowerCase().includes(q) ||
        row.college.toLowerCase().includes(q) ||
        row.utr_number.toLowerCase().includes(q) ||
        String(row.id).includes(q) ||
        (ticketInfo?.ticket.toLowerCase().includes(q) ?? false)
      );
    });
  }, [currentTabRows, searchQuery, ticketCatalog]);

  const sumAmounts = useCallback(
    (rows: TicketRecordRow[]) =>
      rows.reduce((sum, r) => sum + Number(ticketCatalog[Number(r.ticket_id)]?.price || 0), 0),
    [ticketCatalog]
  );

  // ---------------------------------------------------------------------------
  // AUTH LOADING SCREEN
  // ---------------------------------------------------------------------------
  if (authChecking) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-body flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking admin session...</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ADMIN SIGN-IN GATE
  // ---------------------------------------------------------------------------
  if (!session) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-body antialiased flex flex-col">
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
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </button>

            <div className="flex items-center gap-2.5">
              {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gate Scanner</span>
              </button>
            )}

            {onBackToTickets && (
                <button
                  type="button"
                  onClick={onBackToTickets}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Tickets Page</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Admin Verification Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in with your authorised Supabase admin account to verify or reject ticket UTR submissions.
            </p>

            {loginError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="empyrean@iimj.ac.in"
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 rounded-lg bg-[#0f172a] hover:bg-black disabled:bg-slate-600 text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </form>
          </div>

          <PoweredByVespar />
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white text-slate-900 font-body antialiased selection:bg-[#0f172a] selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center cursor-pointer focus:outline-none"
              title="Back to Empyrean Website"
            >
              <img
                src="/assets/empyrean/logo-empyrean.webp"
                alt="Empyrean — Annual Fest of IIM Jammu"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </button>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={loadDashboardData}
              disabled={dataLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh entries"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gate Scanner</span>
              </button>
            )}

            {onBackToTickets && (
              <button
                type="button"
                onClick={onBackToTickets}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tickets Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Ticket Verification Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review pending UTR submissions and move entries to Verified or Rejected.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Signed in as <span className="font-semibold text-slate-800">{session.user.email}</span>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Unverified Queue</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{unverifiedRows.length}</span>
              <span className="text-xs font-semibold text-slate-600">
                {formatINR(sumAmounts(unverifiedRows))}
              </span>
            </div>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Verified Passes</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{verifiedRows.length}</span>
              <span className="text-xs font-semibold text-emerald-700">
                {formatINR(sumAmounts(verifiedRows))}
              </span>
            </div>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Rejected Entries</span>
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{rejectedRows.length}</span>
            </div>
          </div>
        </div>

        {/* Permission / Error Alert */}
        {dataError && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Supabase Permission / Query Error: {dataError}</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">
              Make sure your <code className="font-mono bg-red-100 px-1 rounded">authenticated</code> role has{' '}
              <code className="font-mono bg-red-100 px-1 rounded">SELECT, INSERT, DELETE</code> on{' '}
              <code className="font-mono bg-red-100 px-1 rounded">unverified</code> and{' '}
              <code className="font-mono bg-red-100 px-1 rounded">SELECT, INSERT</code> on{' '}
              <code className="font-mono bg-red-100 px-1 rounded">verified</code> and{' '}
              <code className="font-mono bg-red-100 px-1 rounded">rejected</code> (plus RLS policies for{' '}
              <code className="font-mono bg-red-100 px-1 rounded">TO authenticated</code>).
            </p>
          </div>
        )}

        {/* Action Feedback Banner */}
        {actionBanner && (
          <div
            className={`mb-5 px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-3 ${
              actionBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <span>{actionBanner.message}</span>
            <button
              type="button"
              onClick={() => setActionBanner(null)}
              className="p-1 hover:opacity-70 cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs & Search Controls */}
        <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {/* Tabs */}
            <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 self-start">
              {(
                [
                  { id: 'unverified', label: 'Unverified', count: unverifiedRows.length },
                  { id: 'verified', label: 'Verified', count: verifiedRows.length },
                  { id: 'rejected', label: 'Rejected', count: rejectedRows.length },
                ] as { id: AdminTicketTable; label: string; count: number }[]
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#0f172a] text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, UTR, email, college..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Entries List / Table */}
          {dataLoading && currentTabRows.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading entries from {activeTab}...</span>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
              {searchQuery.trim()
                ? `No entries matching "${searchQuery.trim()}" in ${activeTab}.`
                : `No entries in ${activeTab} right now.`}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Name &amp; Contact</th>
                      <th className="py-3 px-4">Ticket Type</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">UTR / Reference</th>
                      {(activeTab === 'unverified' || activeTab === 'verified') && (
                        <th className="py-3 px-4 text-right">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredRows.map((row) => {
                      const ticketInfo = ticketCatalog[Number(row.ticket_id)];
                      const ticketName = ticketInfo?.ticket || `Ticket #${row.ticket_id}`;
                      const amountPaid = ticketInfo ? Number(ticketInfo.price) : 0;
                      const isRowBusy = processingId === row.id;
                      const isDownloadingRow = downloadingId === row.id;
                      const issuedToken = issuedQrTokens[row.id];

                      return (
                        <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-500 whitespace-nowrap">
                            #{row.id}
                          </td>

                          <td className="py-3.5 px-4 min-w-[210px]">
                            <div className="font-semibold text-slate-900">{row.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {row.email} • {row.mobile}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {row.college}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold">
                              {ticketName}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {ticketInfo ? formatINR(amountPaid) : '—'}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-block font-mono text-xs font-semibold bg-[#f8fafc] border border-slate-200 text-slate-800 px-2.5 py-1 rounded">
                              {row.utr_number}
                            </span>
                          </td>

                          {activeTab === 'unverified' && (
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  disabled={processingId !== null}
                                  onClick={() => handleDecision(row, 'verified')}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  {isRowBusy ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  )}
                                  <span>Accept</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={processingId !== null}
                                  onClick={() => handleDecision(row, 'rejected')}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 text-red-700 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </td>
                          )}

                          {activeTab === 'verified' && (
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center justify-end gap-2">
                                {issuedToken && (
                                  <span
                                    className="hidden xl:inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-semibold"
                                    title={`QR Token: ${issuedToken}`}
                                  >
                                    QR Issued
                                  </span>
                                )}
                                <button
                                  type="button"
                                  disabled={downloadingId !== null}
                                  onClick={() => handleDownloadTicket(row)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0f172a] hover:bg-black disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  {isDownloadingRow ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Generating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download Ticket</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <PoweredByVespar />
      </main>
    </div>
  );
};
