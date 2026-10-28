import React from 'react';
import { GameIcon } from './GameIcons.jsx';

/**
 * ComicToast Component
 * Replaces the generic dark-blue toast rectangle with a high-impact Cartoon Comic Splash Banner,
 * directly inspired by user reference Image 2 ("SPLASH!" comic action) and Image 3 ("AQUATIC FONT"):
 * - Organic comic water splash silhouette with sharp liquid spikes & flying droplets
 * - Halftone dot comic shading pattern
 * - Chunky 3D block-extruded bubble typography with white specular gloss shine
 * - Floating cartoon bubbles & animated entrance bounce
 */
export default function ComicToast({ toast }) {
  if (!toast) return null;
  const { title, subtitle, icon = 'sparkle', accent = 'from-amber-400 to-orange-500' } = toast;

  // Determine theme colors based on toast title / type
  const isFrenzy = title.includes('FRENZY') || title.includes('RAGE');
  const isGolden = title.includes('GOLDEN') || title.includes('ASCEND') || title.includes('YUZU');
  const isBadge = title.includes('BADGE') || title.includes('UNLOCKED');

  const { splashFill, splashDark, splashOutline, bannerGradient, haloGlow } = (() => {
    if (isFrenzy) {
      return {
        splashFill: '#f43f5e',
        splashDark: '#9f1239',
        splashOutline: '#4c0519',
        bannerGradient: 'from-rose-500 via-orange-500 to-amber-400',
        haloGlow: 'rgba(244, 63, 94, 0.45)',
      };
    }
    if (isGolden) {
      return {
        splashFill: '#fbbf24',
        splashDark: '#b45309',
        splashOutline: '#451a03',
        bannerGradient: 'from-amber-300 via-yellow-400 to-orange-500',
        haloGlow: 'rgba(251, 191, 36, 0.45)',
      };
    }
    if (isBadge) {
      return {
        splashFill: '#10b981',
        splashDark: '#047857',
        splashOutline: '#064e3b',
        bannerGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
        haloGlow: 'rgba(16, 185, 129, 0.45)',
      };
    }
    // Default: Electric Summer Comic Blue Splash (Matches Image 2 & 3)
    return {
      splashFill: '#38bdf8',
      splashDark: '#0284c7',
      splashOutline: '#082f49',
      bannerGradient: 'from-cyan-400 via-sky-500 to-blue-600',
      haloGlow: 'rgba(56, 189, 248, 0.45)',
    };
  })();

  return (
    <div className="relative pointer-events-auto select-none transition-all duration-300 animate-comic-pop my-1 max-w-[340px] sm:max-w-[400px]">
      {/* SVG Cartoon Liquid Splash Backdrop (Inspired directly by Image 2!) */}
      <svg
        viewBox="0 0 380 120"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Comic Halftone Dot Pattern */}
          <pattern id={`halftone-${toast.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.8" fill="rgba(255,255,255,0.25)" />
          </pattern>

          {/* Dynamic Liquid Splash Gradient */}
          <linearGradient id={`splash-grad-${toast.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="25%" stopColor={splashFill} />
            <stop offset="85%" stopColor={splashDark} />
            <stop offset="100%" stopColor={splashOutline} />
          </linearGradient>

          {/* White Gloss Specular Rim */}
          <linearGradient id={`gloss-rim-${toast.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- Outermost Dark Comic Shadow Extrusion --- */}
        <path
          d="M 32 30 C 18 10 38 -5 65 14 C 95 -12 135 6 155 18 C 190 -16 245 -4 265 20 C 300 0 345 8 355 36 C 378 52 388 84 362 102 C 342 118 308 112 290 122 C 260 134 220 120 185 124 C 145 130 110 118 85 122 C 55 125 24 116 12 94 C 2 74 12 48 32 30 Z"
          fill={splashOutline}
          transform="translate(4, 6)"
        />

        {/* --- Main Liquid Water Splash Body --- */}
        <path
          d="M 32 30 C 18 10 38 -5 65 14 C 95 -12 135 6 155 18 C 190 -16 245 -4 265 20 C 300 0 345 8 355 36 C 378 52 388 84 362 102 C 342 118 308 112 290 122 C 260 134 220 120 185 124 C 145 130 110 118 85 122 C 55 125 24 116 12 94 C 2 74 12 48 32 30 Z"
          fill={`url(#splash-grad-${toast.id})`}
          stroke={splashOutline}
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* --- Halftone Dot Comic Overlay --- */}
        <path
          d="M 45 40 C 35 25 50 15 72 25 C 100 5 130 18 150 28 C 180 5 230 12 250 30 C 280 18 320 22 332 46 C 350 60 358 85 338 98 C 322 108 295 104 280 112 C 252 120 220 110 190 114 C 155 118 125 108 102 112 C 78 114 52 108 42 90 C 34 75 40 55 45 40 Z"
          fill={`url(#halftone-${toast.id})`}
          opacity="0.65"
        />

        {/* --- Flying Cartoon Water Droplets Spreading Outward (Image 2 signature!) --- */}
        {/* Top-Left Droplets */}
        <circle cx="15" cy="18" r="4.5" fill={splashFill} stroke={splashOutline} strokeWidth="2" />
        <circle cx="13" cy="16" r="1.5" fill="#ffffff" />
        <circle cx="38" cy="-2" r="3.2" fill={splashFill} stroke={splashOutline} strokeWidth="1.8" />
        <path d="M 98 -4 C 102 -10 108 -6 104 -1 Z" fill={splashFill} stroke={splashOutline} strokeWidth="1.5" />

        {/* Top-Right Droplets */}
        <circle cx="365" cy="12" r="5" fill={splashFill} stroke={splashOutline} strokeWidth="2" />
        <circle cx="363" cy="10" r="1.8" fill="#ffffff" />
        <circle cx="340" cy="-6" r="3.5" fill={splashFill} stroke={splashOutline} strokeWidth="1.8" />

        {/* Bottom Droplets */}
        <circle cx="25" cy="115" r="4.2" fill={splashFill} stroke={splashOutline} strokeWidth="2" />
        <circle cx="360" cy="118" r="4.8" fill={splashFill} stroke={splashOutline} strokeWidth="2" />
        <circle cx="358" cy="116" r="1.6" fill="#ffffff" />

        {/* Gloss Specular Shine Curves on Splash Crests */}
        <path
          d="M 52 24 C 65 18 80 20 92 28"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 160 22 C 180 12 210 14 235 24"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M 280 24 C 300 20 320 28 335 40"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </svg>

      {/* --- Overlay Content (Aquatic Bubble Letters Title + Subtitle) --- */}
      <div className="absolute inset-0 flex items-center px-6 sm:px-8 py-3 gap-3 z-10">
        {/* Animated 3D Floating Icon Badge */}
        <div
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${bannerGradient} flex items-center justify-center shrink-0 border-[2.5px] border-white shadow-[0_4px_0_rgba(0,0,0,0.35)] transform -rotate-3 animate-wiggle-soft`}
        >
          <GameIcon name={icon} size={34} />
        </div>

        {/* Comic Aquatic Text Layout */}
        <div className="min-w-0 flex-1">
          {/* Main Title: Chunky Comic 3D Block Text (Image 2 "SPLASH!" & Image 3 "AQUATIC FONT") */}
          <h3
            className="text-base sm:text-lg font-black tracking-wide leading-tight truncate font-display text-white [text-shadow:0_3px_0_#082f49,2px_2px_0_#082f49,-2px_2px_0_#082f49,2px_-2px_0_#082f49,-2px_-2px_0_#082f49,0_4px_8px_rgba(0,0,0,0.6)]"
            style={{
              fontFamily: "'Rubik Bubbles', 'DynaPuff', 'Fredoka', cursive, sans-serif",
            }}
          >
            {title}
          </h3>

          {/* Subtitle Comic Caption Pill */}
          <div className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-[#082f49]/80 border border-white/40 shadow-sm max-w-full">
            <p className="text-xs sm:text-sm font-black text-[#fef08a] truncate [text-shadow:0_1px_2px_#000]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
