import React, { useState, useEffect } from 'react';
import { getBucketImageUrls } from '../lib/supabase';
import { DEFAULT_PROJECTS } from './CinematicRibbonGallery';

interface FestPreloaderProps {
  onLoaded: (urls: string[]) => void;
}

export const FestPreloader: React.FC<FestPreloaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Connecting to festival archive...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function preloadAll() {
      try {
        // Step 1: Fetch all image URLs from Supabase Memory bucket
        setStatusText('Fetching festival memories from Supabase...');
        setProgress(35);

        // Fetch bucket URLs with timeout fallback so slow networks never block the user
        const fetchPromise = getBucketImageUrls('Memory');
        const timeoutPromise = new Promise<string[]>((resolve) =>
          setTimeout(() => resolve([]), 4500)
        );
        let urls = await Promise.race([fetchPromise, timeoutPromise]);

        if (!urls || urls.length === 0) {
          urls = DEFAULT_PROJECTS.map((p) => p.url);
        }

        if (!isMounted) return;
        setProgress(55);
        setStatusText('Preloading festival gallery assets...');

        // Step 2: Concurrently preload all image files into memory
        let loadedCount = 0;
        const total = urls.length;

        await Promise.all(
          urls.map(
            (url) =>
              new Promise<void>((resolve) => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                  loadedCount++;
                  if (isMounted) {
                    setProgress(55 + Math.round((loadedCount / total) * 40));
                  }
                  resolve();
                };
                img.onerror = () => {
                  loadedCount++;
                  if (isMounted) {
                    setProgress(55 + Math.round((loadedCount / total) * 40));
                  }
                  resolve();
                };
              })
          )
        );

        if (!isMounted) return;
        setProgress(100);
        setStatusText('Welcome to EMPYREAN');

        // Smooth transition out
        setTimeout(() => {
          if (!isMounted) return;
          setIsFading(true);
          setTimeout(() => {
            if (isMounted) {
              onLoaded(urls);
            }
          }, 600);
        }, 400);
      } catch (err) {
        console.error('[Preloader] Error loading assets:', err);
        const fallbackUrls = DEFAULT_PROJECTS.map((p) => p.url);
        if (isMounted) {
          setIsFading(true);
          setTimeout(() => onLoaded(fallbackUrls), 500);
        }
      }
    }

    preloadAll();

    return () => {
      isMounted = false;
    };
  }, [onLoaded]);

  return (
    <div
      id="fest-preloader"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b1839] select-none transition-opacity duration-600 ease-out"
      style={{
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial from-[#f8c12c]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Presenter Pre-title */}
        <div className="flex items-center gap-2 text-[#f8c12c] text-xs font-sub tracking-[0.28em] uppercase mb-4 drop-shadow-md">
          <span className="w-6 h-[1px] bg-[#f8c12c]/60"></span>
          <span>✦</span>
          <span className="font-semibold text-[#f8e5b0]">IIM Jammu Presents</span>
          <span>✦</span>
          <span className="w-6 h-[1px] bg-[#f8c12c]/60"></span>
        </div>

        {/* Empyrean Emblem Logo */}
        <div className="relative w-48 sm:w-56 mb-6">
          <picture>
            <source srcSet="/assets/empyrean/logo-empyrean.webp" type="image/webp" />
            <img
              src="/assets/empyrean/logo-empyrean.png"
              alt="EMPYREAN"
              className="w-full h-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
            />
          </picture>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3.5 border border-[#f8c12c]/20">
          <div
            className="h-full bg-gradient-to-r from-[#f8c12c] via-[#ffd56b] to-[#f8c12c] rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(248,193,44,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <div className="text-[#cbd5e1]/80 text-xs font-sans tracking-[0.08em] transition-all duration-200">
          {statusText}
        </div>
      </div>
    </div>
  );
};

