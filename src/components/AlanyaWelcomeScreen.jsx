import React, { useState, useEffect } from 'react';
import { GameIcon } from './GameIcons.jsx';

/**
 * AlanyaWelcomeScreen Component
 * A full-viewport sunny summer resort welcome & loading screen:
 * - "WELCOME TO ALANYA" in cartoon bubble lettering
 * - Dynamic animated water/sun shimmer wave sweeping continuously THROUGH the text
 * - Mediterranean Turkish Riviera summer aesthetic with sun, palms, and floaties
 * - Travertine pool loading progress bar with a sliding donut floatie
 * - Rotating summer resort status messages and smooth entrance transition into the game
 */
export default function AlanyaWelcomeScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const SUMMER_TIPS = [
    'Heating up the Mediterranean sunshine over Alanya Castle...',
    'Blending fresh ice-cold yuzu smoothies at the cabana bar...',
    'Inflating the strawberry sprinkle donut floaties...',
    'Tuning the 3D tropical lagoon waves & infinity pool...',
    'Applying SPF 50 sunscreen to the chilled llama...',
    'Paradise is ready! Dive right in!',
  ];

  // Animate loading progress over ~2.4 seconds
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2400; // 2.4s smooth load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);

      const tipIdx = Math.min(
        SUMMER_TIPS.length - 1,
        Math.floor((elapsed / duration) * SUMMER_TIPS.length)
      );
      setTipIndex(tipIdx);

      if (p >= 100) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 550);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-hidden select-none transition-opacity duration-500 bg-gradient-to-b from-[#0284c7] via-[#0ea5e9] to-[#0369a1] ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* --- Sun-Drenched Mediterranean Summer Background Decor --- */}
      {/* Rotating Summer Sun with Glow Rays */}
      <div className="absolute -top-16 -right-16 w-72 h-72 pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full animate-spin-slow opacity-90 drop-shadow-[0_0_35px_#fde047]"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2="100"
              y2="10"
              stroke="#fde047"
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="50" fill="#facc15" stroke="#ea580c" strokeWidth="4" />
          <circle cx="90" cy="85" r="16" fill="#fef08a" opacity="0.6" />
        </svg>
      </div>

      {/* Floating Animated Summer Clouds */}
      <div className="absolute top-12 left-8 w-44 h-18 opacity-75 animate-float-bob pointer-events-none">
        <svg viewBox="0 0 160 60" fill="white">
          <circle cx="40" cy="40" r="25" />
          <circle cx="75" cy="28" r="30" />
          <circle cx="115" cy="38" r="24" />
          <rect x="35" y="35" width="85" height="25" rx="10" />
        </svg>
      </div>
      <div className="absolute top-28 right-24 w-32 h-14 opacity-60 animate-float-bob [animation-delay:-2s] pointer-events-none">
        <svg viewBox="0 0 160 60" fill="white">
          <circle cx="45" cy="40" r="22" />
          <circle cx="80" cy="30" r="26" />
          <circle cx="115" cy="38" r="20" />
          <rect x="40" y="35" width="75" height="22" rx="10" />
        </svg>
      </div>

      {/* Tropical Palm Frond Silhouette Accents (Left & Right Top Corners) */}
      <div className="absolute -top-6 -left-6 w-48 h-48 pointer-events-none opacity-40 text-emerald-950">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M 0 0 C 40 10 70 40 85 85 C 65 65 35 45 0 35 Z" />
          <path d="M 0 10 C 50 25 80 55 95 95 C 75 75 45 55 0 45 Z" />
          <path d="M 10 0 C 35 40 55 70 65 100 C 50 75 30 50 15 25 Z" />
        </svg>
      </div>

      {/* Ambient Rising Water Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { x: '15%', size: 16, dur: '4s', delay: '0s' },
          { x: '28%', size: 22, dur: '5.2s', delay: '1.2s' },
          { x: '45%', size: 14, dur: '3.8s', delay: '0.5s' },
          { x: '72%', size: 28, dur: '4.8s', delay: '2s' },
          { x: '88%', size: 18, dur: '4.2s', delay: '1.8s' },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              left: b.x,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: b.dur,
              animationDelay: b.delay,
            }}
            className="absolute bottom-0 rounded-full border border-white/60 bg-white/20 animate-bubble-float shadow-inner"
          />
        ))}
      </div>

      {/* --- TOP BADGE: TURKISH RIVIERA EMBLEM --- */}
      <div className="relative z-10 pt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#082f49]/80 border-2 border-[#fde047] shadow-lg backdrop-blur-sm animate-wiggle-soft">
        <span className="text-xl">☀️</span>
        <span className="font-display font-black text-xs sm:text-sm text-[#fde047] uppercase tracking-wider [text-shadow:0_1px_2px_#000]">
          Turkish Riviera • Summer Paradise
        </span>
        <span className="text-xl">🌊</span>
      </div>

      {/* --- CENTER SECTION: "WELCOME TO ALANYA" WITH ANIMATED TEXT SHIMMER --- */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4 max-w-2xl">
        {/* Animated Summer Mascot Icon */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4">
          <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl animate-pulse" />
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#fde047] via-[#fb923c] to-[#f43f5e] border-4 border-white shadow-2xl flex items-center justify-center transform -rotate-3 animate-float-bob">
            <GameIcon name="donut" size={72} />
          </div>
          {/* Sunglasses on floatie badge */}
          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-[#082f49] border-2 border-[#fde047] shadow text-xs font-black text-[#fde047]">
            CHILL 100%
          </div>
        </div>

        {/* 🌟 MAIN TITLE: "WELCOME TO ALANYA" WITH CONTINUOUS SUMMER SHIMMER WAVE 🌟 */}
        <div className="relative">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none uppercase drop-shadow-[0_6px_0_#082f49] [text-shadow:0_4px_0_#082f49,3px_3px_0_#082f49,-3px_3px_0_#082f49,3px_-3px_0_#082f49,-3px_-3px_0_#082f49,0_8px_18px_rgba(0,0,0,0.65)]"
            style={{
              fontFamily: "'Rubik Bubbles', 'DynaPuff', 'Fredoka', cursive, sans-serif",
            }}
          >
            {/* The animated shimmer text wave running continuously THROUGH the letters! */}
            <span className="animate-summer-text-shimmer bg-gradient-to-r from-yellow-200 via-white via-cyan-200 via-amber-200 to-yellow-200 bg-[length:250%_auto] bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="animate-summer-text-shimmer bg-gradient-to-r from-amber-300 via-yellow-100 via-sky-200 via-rose-300 to-amber-300 bg-[length:250%_auto] bg-clip-text text-transparent">
              Alanya
            </span>
          </h1>

          {/* Sparkle Glints on the Text */}
          <div className="absolute -top-3 -right-3 text-2xl animate-pulse">✨</div>
          <div className="absolute -bottom-2 -left-4 text-2xl animate-pulse [animation-delay:0.8s]">
            ⭐
          </div>
        </div>

        {/* Luxury Resort Subtitle */}
        <p className="mt-4 text-base sm:text-xl font-display font-black text-[#e0f2fe] tracking-wide [text-shadow:0_2px_4px_rgba(0,0,0,0.6)]">
          Bask in the Sun • Boop the Llama • Catch the Waves
        </p>
      </div>

      {/* --- BOTTOM SECTION: SUMMER LOADING BAR & DIVE IN BUTTON --- */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center pb-6">
        {/* Dynamic Summer Resort Tip */}
        <p className="text-xs sm:text-sm font-bold text-[#fef08a] mb-2 text-center h-6 animate-fade-in [text-shadow:0_1px_2px_#000]">
          {SUMMER_TIPS[tipIndex]}
        </p>

        {/* Travertine Pool Style Progress Track */}
        <div className="relative w-full h-8 sm:h-9 rounded-full bg-[#082f49]/90 border-4 border-[#fef3c7] shadow-[0_4px_0_#021e33,0_8px_20px_rgba(0,0,0,0.4)] p-0.5 overflow-hidden">
          {/* Animated Water Fill with Wave Pattern */}
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#0284c7] transition-all duration-150 relative overflow-hidden shadow-inner"
          >
            {/* Shimmer wave sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>

          {/* Sliding Donut Floatie Icon on top of progress */}
          <div
            style={{ left: `calc(${progress}% - 14px)` }}
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 border-2 border-white shadow-md flex items-center justify-center text-xs animate-spin-slow">
              🍩
            </div>
          </div>
        </div>

        {/* Progress % Display */}
        <div className="flex items-center justify-between w-full mt-2 px-2 text-xs sm:text-sm font-black text-[#fef3c7] [text-shadow:0_1px_2px_#000]">
          <span>RESORT PREPARATION</span>
          <span>{progress}%</span>
        </div>

        {/* DIVE IN / START BUTTON (Available when ready or automatically after load) */}
        {isReady && (
          <button
            type="button"
            onClick={handleStart}
            className="mt-4 px-8 py-3.5 rounded-2xl bg-gradient-to-b from-[#fde047] via-[#facc15] to-[#ea580c] border-[3px] border-white shadow-[0_6px_0_#7c2d12,0_10px_25px_rgba(0,0,0,0.5)] font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase hover:scale-105 active:scale-95 transition cursor-pointer animate-bounce [text-shadow:0_2px_0_#7c2d12]"
          >
            🌊 Dive Into Alanya! ☀️
          </button>
        )}
      </div>
    </div>
  );
}
