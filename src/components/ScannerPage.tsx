import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  XCircle,
  Lock,
  Loader2,
  AlertCircle,
  LogOut,
  Upload,
  ShieldCheck,
  Users,
  X,
  ScanLine,
  LayoutDashboard,
  Ticket,
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import type { Session } from '@supabase/supabase-js';
import {
  supabase,
  verifyAndCheckInQr,
  type ScannerDay,
  type QrScanVerificationResult,
} from '../lib/supabase';

export interface ScannerPageProps {
  onOpenAdmin?: () => void;
  onBackToTickets?: () => void;
  onBackToHome?: () => void;
}

interface ScanHistoryEntry extends QrScanVerificationResult {
  scannedAt: string;
}

/** Picks the primary 1x rear camera instead of ultra-wide/telephoto/macro lenses on multi-camera phones. */
function pickMainRearCameraId(devices: { id: string; label: string }[]): string {
  if (devices.length === 0) return '';
  const rear = devices.filter((d) => /back|rear|environment/i.test(d.label));
  const pool = rear.length > 0 ? rear : devices;

  const scored = pool.map((cam, index) => {
    const label = cam.label.toLowerCase();
    let score = 0;
    if (/back|rear|environment/.test(label)) score += 10;
    if (/main|primary|wide|1x|camera2 0|camera 0/.test(label)) score += 6;
    if (/ultra|0\.5x|tele|macro|depth|ir|tof|zoom/.test(label)) score -= 12;
    return { id: cam.id, score, index };
  });

  scored.sort((a, b) => b.score - a.score || a.index - b.index);
  return scored[0]?.id || devices[0].id;
}

const PoweredByVespar: React.FC = () => (
  <div className="pt-6 pb-4 flex flex-col items-center justify-center select-none">
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

export const ScannerPage: React.FC<ScannerPageProps> = ({
  onOpenAdmin,
  onBackToTickets,
  onBackToHome,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<ScannerDay>(1);
  const selectedDayRef = useRef<ScannerDay>(1);
  useEffect(() => {
    selectedDayRef.current = selectedDay;
  }, [selectedDay]);

  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraStarting, setCameraStarting] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showSlowVerifyPopup, setShowSlowVerifyPopup] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<QrScanVerificationResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);

  const qrInstanceRef = useRef<Html5Qrcode | null>(null);
  const isBusyRef = useRef<boolean>(false);
  const userPickedCameraRef = useRef<boolean>(false);
  const slowVerifyTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync Supabase Auth session
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

  // Load camera list once authenticated
  useEffect(() => {
    if (!session) return;
    let mounted = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!mounted) return;
        const list = devices.map((d) => ({ id: d.id, label: d.label || 'Camera' }));
        setCameras(list);
        if (list.length > 0) {
          setSelectedCameraId(pickMainRearCameraId(list));
        }
      })
      .catch(() => {
        // User may not have granted permission until Start Camera is clicked
      });
    return () => {
      mounted = false;
    };
  }, [session]);

  const stopCamera = useCallback(async () => {
    const qr = qrInstanceRef.current;
    if (qr) {
      try {
        if (qr.isScanning) {
          await qr.stop();
        }
        qr.clear();
      } catch {
        // Ignore cleanup errors
      }
      qrInstanceRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      const qr = qrInstanceRef.current;
      if (qr) {
        if (qr.isScanning) {
          qr.stop().catch(() => {});
        }
        try {
          qr.clear();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const processDecodedToken = useCallback(async (decodedText: string) => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    setIsVerifying(true);
    setShowSlowVerifyPopup(false);
    setCameraError(null);

    if (slowVerifyTimerRef.current !== null) {
      window.clearTimeout(slowVerifyTimerRef.current);
    }
    slowVerifyTimerRef.current = window.setTimeout(() => {
      setShowSlowVerifyPopup(true);
    }, 2000);

    try {
      const result = await verifyAndCheckInQr(decodedText, selectedDayRef.current);
      setScanResult(result);

      const timeStr = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setScanHistory((prev) => [{ ...result, scannedAt: timeStr }, ...prev].slice(0, 15));
    } catch (err) {
      setScanResult({
        valid: false,
        status: 'error',
        day: selectedDayRef.current,
        qrCodeId: decodedText.trim(),
        reason: err instanceof Error ? err.message : 'Unexpected error verifying QR code.',
      });
    } finally {
      if (slowVerifyTimerRef.current !== null) {
        window.clearTimeout(slowVerifyTimerRef.current);
        slowVerifyTimerRef.current = null;
      }
      setShowSlowVerifyPopup(false);
      setIsVerifying(false);
    }
  }, []);

  const handleDismissResultAndResume = () => {
    setScanResult(null);
    isBusyRef.current = false;
  };

  const startCamera = async (cameraIdOverride?: string) => {
    if (cameraStarting) return;
    setCameraError(null);
    setCameraStarting(true);
    isBusyRef.current = false;

    try {
      await stopCamera();
      const qr = new Html5Qrcode('empyrean-qr-reader', {
        verbose: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        useBarCodeDetectorIfSupported: true,
      });
      qrInstanceRef.current = qr;

      // Unless user explicitly switched lenses, let the OS pick the primary rear 1x camera via facingMode
      const explicitId = cameraIdOverride || (userPickedCameraRef.current ? selectedCameraId : '');
      const cameraConfig: string | MediaTrackConstraints = explicitId || {
        facingMode: 'environment',
      };

      await qr.start(
        cameraConfig,
        {
          fps: 15,
          disableFlip: false,
          videoConstraints: explicitId
            ? {
                deviceId: { exact: explicitId },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }
            : {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
        },
        (decodedText) => {
          processDecodedToken(decodedText);
        },
        () => {
          // Ignore per-frame decode misses
        }
      );

      // Enable continuous autofocus where supported (helps close-up phone screen QR reads)
      try {
        await qr.applyVideoConstraints({
          advanced: [{ focusMode: 'continuous' } as unknown as MediaTrackConstraintSet],
        });
      } catch {
        // Ignore on browsers/cameras that do not expose focusMode
      }

      setIsScanning(true);

      // Refresh available camera labels once permission is granted
      if (cameras.length === 0) {
        Html5Qrcode.getCameras()
          .then((devices) => {
            const list = devices.map((d) => ({ id: d.id, label: d.label || 'Camera' }));
            setCameras(list);
            if (list.length > 0 && !selectedCameraId) {
              setSelectedCameraId(pickMainRearCameraId(list));
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      setCameraError(
        err instanceof Error
          ? err.message
          : 'Could not start camera. Please grant camera permission or scan a QR image.'
      );
      setIsScanning(false);
    } finally {
      setCameraStarting(false);
    }
  };

  const handleCameraSwitch = async (nextId: string) => {
    userPickedCameraRef.current = true;
    setSelectedCameraId(nextId);
    if (isScanning) {
      await startCamera(nextId);
    }
  };

  const handleScanImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setCameraError(null);
    try {
      const fileQr = new Html5Qrcode('empyrean-qr-file-reader', {
        verbose: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        useBarCodeDetectorIfSupported: true,
      });
      const decodedText = await fileQr.scanFile(file, false);
      fileQr.clear();
      await processDecodedToken(decodedText);
    } catch {
      setCameraError('Could not detect a valid QR code in that image file.');
    }
  };

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
    if (error) setLoginError(error.message);
  };

  const handleSignOut = async () => {
    await stopCamera();
    await supabase.auth.signOut();
    setScanResult(null);
    setScanHistory([]);
  };

  const acceptedTodayCount = scanHistory.filter((h) => h.valid && h.day === selectedDay).length;
  const rejectedTodayCount = scanHistory.filter((h) => !h.valid && h.day === selectedDay).length;

  // ---------------------------------------------------------------------------
  // AUTH CHECKING
  // ---------------------------------------------------------------------------
  if (authChecking) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-body flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking scanner session...</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SIGN IN GATE
  // ---------------------------------------------------------------------------
  if (!session) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-body antialiased flex flex-col">
        <header className="w-full bg-white border-b border-slate-100">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
              title="Back to Empyrean Website"
            >
              <img
                src="/assets/empyrean/logo-empyrean.webp"
                alt="Empyrean — Annual Fest of IIM Jammu"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </button>

            <div className="flex items-center gap-2.5">
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
              Gate QR Scanner Access
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in with your authorised Empyrean admin / volunteer credentials to scan delegate QR passes.
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
                  htmlFor="scanner-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Staff / Admin Email
                </label>
                <input
                  id="scanner-email"
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
                  htmlFor="scanner-password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="scanner-password"
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
                  <span>Open Gate Scanner</span>
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
  // AUTHENTICATED QR SCANNER INTERFACE
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white text-slate-900 font-body antialiased selection:bg-[#0f172a] selection:text-white flex flex-col">
      {/* Hidden mount node dedicated to image-file QR scans */}
      <div id="empyrean-qr-file-reader" className="hidden" aria-hidden="true" />

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
              Gate Scanner
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Portal</span>
              </button>
            )}

            {onBackToTickets && (
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onBackToTickets();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
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
      <main className="flex-1 max-w-[1160px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header & Day Selector Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Festival Entry QR Scanner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select the active fest day below and scan attendee QR passes to verify &amp; check in.
            </p>
          </div>

          {/* 3-Day Segmented Selector: Day 1 | Day 2 | Day 3 */}
          <div
            role="group"
            aria-label="Select Check-in Day"
            className="inline-flex items-center bg-[#f8fafc] border border-slate-200 rounded-xl p-1 gap-1 self-start md:self-auto"
          >
            {([1, 2, 3] as ScannerDay[]).map((dayNum) => {
              const active = selectedDay === dayNum;
              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => {
                    setSelectedDay(dayNum);
                    setScanResult(null);
                    isBusyRef.current = false;
                  }}
                  className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0f172a] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  Day {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Scanner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* LEFT COLUMN: Custom Html5Qrcode Viewfinder + Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 sm:p-5">
              {/* Top Camera Status Strip */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isScanning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                    }`}
                  />
                  <span>
                    {isScanning
                      ? `Live Camera • Checking in for Day ${selectedDay}`
                      : `Camera Standby • Selected Day ${selectedDay}`}
                  </span>
                </div>

                {cameras.length > 1 && (
                  <select
                    value={selectedCameraId}
                    onChange={(e) => handleCameraSwitch(e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:border-slate-900 focus:outline-none max-w-[180px]"
                    aria-label="Select camera device"
                  >
                    {cameras.map((cam) => (
                      <option key={cam.id} value={cam.id}>
                        {cam.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Custom Viewfinder Box */}
              <div className="relative w-full aspect-square sm:aspect-[4/3] max-h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                <div id="empyrean-qr-reader" className="w-full h-full [&_video]:object-cover" />

                {/* Idle Standby Overlay when camera is stopped */}
                {!isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-3">
                      <ScanLine className="w-7 h-7 text-white/90" />
                    </div>
                    <p className="text-sm font-semibold">
                      Ready to Scan Day {selectedDay} Passes
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Click Start Camera below or upload a downloaded ticket QR image.
                    </p>
                  </div>
                )}

                {/* Corner Scan Guide Reticle when active */}
                {isScanning && !isVerifying && (
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="w-56 h-56 sm:w-60 sm:h-60 relative">
                      <span className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                      <span className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                      <span className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                      <span className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                    </div>
                  </div>
                )}

                {/* Verifying Overlay */}
                {isVerifying && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span className="text-xs font-semibold tracking-wide">
                      Verifying pass for Day {selectedDay}...
                    </span>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Primary Action Controls */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {!isScanning ? (
                  <button
                    type="button"
                    disabled={cameraStarting}
                    onClick={() => startCamera()}
                    className="flex-1 min-w-[160px] py-2.5 px-4 rounded-lg bg-[#0f172a] hover:bg-black disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    {cameraStarting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Starting Camera...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span>Start Camera</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex-1 min-w-[160px] py-2.5 px-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <CameraOff className="w-4 h-4" />
                    <span>Stop Camera</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScanImageFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:border-slate-900 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Scan QR Image</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Session Counters + Recent Check-In Log + Powered By */}
          <aside className="lg:col-span-5 space-y-5">
            {/* Session Counters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Day {selectedDay} Checked In
                </span>
                <div className="mt-1.5 text-2xl font-bold text-emerald-700">
                  {acceptedTodayCount}
                </div>
              </div>
              <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Day {selectedDay} Rejected
                </span>
                <div className="mt-1.5 text-2xl font-bold text-red-600">
                  {rejectedTodayCount}
                </div>
              </div>
            </div>

            {/* Recent Gate Scans Feed */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Gate Scans
                </h2>
                <span className="text-[11px] text-slate-400">Day {selectedDay} Active</span>
              </div>

              {scanHistory.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-100 p-6 text-center text-xs text-slate-500">
                  No QR codes scanned in this session yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {scanHistory.map((item, idx) => (
                    <div
                      key={`${item.qrCodeId}-${item.scannedAt}-${idx}`}
                      className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3"
                    >
                      {item.valid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.attendeeName || 'Unknown Pass'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {item.scannedAt}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.ticketLabel ? `${item.ticketLabel} • ` : ''}
                          Day {item.day}
                        </div>
                        <p
                          className={`text-[11px] mt-1 font-medium ${
                            item.valid ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <PoweredByVespar />
          </aside>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* SLOW NETWORK (>2s) FLOATING VERIFYING POPUP                           */}
      {/* ===================================================================== */}
      {isVerifying && showSlowVerifyPopup && !scanResult && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm bg-[#0f172a] text-white rounded-xl px-4 py-3 shadow-2xl border border-white/10 flex items-center gap-3 animate-fadeIn"
        >
          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold leading-tight">
              Verifying QR pass...
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Checking Day {selectedDay} access, please wait
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ANIMATED GREEN TICK / RED CROSS CHECK-IN RESULT POPUP MODAL           */}
      {/* ===================================================================== */}
      {scanResult && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scan-result-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-scaleUp">
            <button
              type="button"
              onClick={handleDismissResultAndResume}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close scan result"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animated SVG Symbol */}
            <div className="relative flex items-center justify-center mx-auto w-20 h-20 mb-5">
              {scanResult.valid ? (
                <>
                  <span
                    className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"
                    style={{ animationIterationCount: 2, animationDuration: '1.1s' }}
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
                </>
              ) : (
                <>
                  <span
                    className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"
                    style={{ animationIterationCount: 2, animationDuration: '1.1s' }}
                    aria-hidden="true"
                  />
                  <svg
                    className="rzp-crossmark relative z-10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    aria-hidden="true"
                  >
                    <circle className="rzp-crossmark-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="rzp-crossmark-line" fill="none" d="M17 17l18 18" />
                    <path className="rzp-crossmark-line" fill="none" d="M35 17l-18 18" />
                  </svg>
                </>
              )}
            </div>

            {scanResult.valid ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Day {scanResult.day} Check-In Verified</span>
                </span>

                <h2
                  id="scan-result-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900"
                >
                  Access Granted
                </h2>

                {scanResult.ticketLabel && (
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {scanResult.ticketLabel}
                  </p>
                )}

                {/* Allowed People Box */}
                <div className="mt-5 bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 text-left">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      People Allowed to Enter
                    </span>
                    <span className="text-emerald-700">
                      {scanResult.allowedNames?.length || 1} Guest
                      {(scanResult.allowedNames?.length || 1) > 1 ? 's' : ''}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {(scanResult.allowedNames || [scanResult.attendeeName || 'Delegate']).map(
                      (person, idx) => (
                        <li
                          key={`${person}-${idx}`}
                          className="flex items-center gap-2.5 bg-white border border-slate-200/70 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{person}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200/80 text-xs font-semibold mb-2">
                  <span>Day {scanResult.day} Verification Failed</span>
                </span>

                <h2
                  id="scan-result-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900"
                >
                  Entry Denied
                </h2>

                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-xs sm:text-sm font-medium text-red-800 leading-relaxed">
                  {scanResult.reason}
                </div>

                {scanResult.attendeeName && (
                  <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-left text-xs text-slate-600 flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">
                      {scanResult.attendeeName}
                    </span>
                    {scanResult.ticketLabel && (
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-semibold text-[11px]">
                        {scanResult.ticketLabel}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handleDismissResultAndResume}
              className="mt-6 w-full py-3 rounded-lg bg-[#0f172a] hover:bg-black text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Scan Next Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
