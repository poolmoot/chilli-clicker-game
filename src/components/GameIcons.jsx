import React, { useId } from 'react';

/**
 * Custom Multi-Layered Glossy Cartoon Vector SVG Game Icon Library
 * Zero OS text emojis — 100% bespoke vector game art with gradients,
 * dark comic outlines, and specular highlights.
 */
export function GameIcon({ name = 'yuzu', className = '', size = 28 }) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  const renderArtwork = () => {
    switch (name) {
      // ======================================================================
      // CURRENCIES & CORE ICONS
      // ======================================================================
      case 'yuzu':
      case 'yuzu_polish':
      case 'soggy_hundredaire':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-yuzu`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#facc15" />
                <stop offset="85%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </radialGradient>
              <linearGradient id={`${uid}-leaf`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>
            </defs>
            {/* Drop shadow */}
            <ellipse cx="32" cy="56" rx="18" ry="4" fill="rgba(0,0,0,0.35)" />
            {/* Main Citrus Body */}
            <ellipse
              cx="32"
              cy="35"
              rx="21"
              ry="19"
              fill={`url(#${uid}-yuzu)`}
              stroke="#2a1205"
              strokeWidth="3.5"
            />
            {/* Citrus dimples */}
            <circle cx="22" cy="40" r="1.3" fill="#c2410c" opacity="0.7" />
            <circle cx="27" cy="45" r="1.2" fill="#c2410c" opacity="0.7" />
            <circle cx="38" cy="43" r="1.4" fill="#c2410c" opacity="0.7" />
            <circle cx="43" cy="36" r="1.2" fill="#c2410c" opacity="0.7" />
            {/* Stem */}
            <path
              d="M32 17 C32 12, 35 10, 36 8"
              stroke="#3f2305"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Glossy Leaf */}
            <path
              d="M33 15 C40 8, 52 10, 49 19 C46 25, 36 22, 33 15 Z"
              fill={`url(#${uid}-leaf)`}
              stroke="#14532d"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Specular Shine */}
            <ellipse
              cx="23"
              cy="27"
              rx="7"
              ry="4"
              transform="rotate(-28 23 27)"
              fill="rgba(255,255,255,0.75)"
            />
            <circle cx="17" cy="34" r="2" fill="rgba(255,255,255,0.55)" />
            {name === 'yuzu_polish' && (
              <path
                d="M48 16 L50 22 L56 24 L50 26 L48 32 L46 26 L40 24 L46 22 Z"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
            )}
          </>
        );

      case 'coin':
      case 'gold_rain':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-coin-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <radialGradient id={`${uid}-coin-in`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
            </defs>
            <circle
              cx="32"
              cy="32"
              r="23"
              fill={`url(#${uid}-coin-rim)`}
              stroke="#2a1205"
              strokeWidth="3.5"
            />
            <circle
              cx="32"
              cy="32"
              r="17"
              fill={`url(#${uid}-coin-in)`}
              stroke="#78350f"
              strokeWidth="2"
            />
            {/* Inner Star / Llama Crest */}
            <path
              d="M32 19 L35.5 27.5 L44.5 28.5 L37.5 34.5 L39.5 43.5 L32 38.5 L24.5 43.5 L26.5 34.5 L19.5 28.5 L28.5 27.5 Z"
              fill="#fef08a"
              stroke="#78350f"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Specular highlight */}
            <path
              d="M17 20 A19 19 0 0 1 38 14"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'llama':
      case 'wet_capy':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-llama-fur`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id={`${uid}-shades`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            {/* Tall Banana Ears */}
            <path
              d="M19 26 C15 11, 19 6, 24 10 C27 14, 26 22, 25 26 Z"
              fill={`url(#${uid}-llama-fur)`}
              stroke="#2a1205"
              strokeWidth="3"
            />
            <path
              d="M45 26 C49 11, 45 6, 40 10 C37 14, 38 22, 39 26 Z"
              fill={`url(#${uid}-llama-fur)`}
              stroke="#2a1205"
              strokeWidth="3"
            />
            {/* Inner Ears */}
            <path d="M21 23 C19 14, 21 11, 23 13" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M43 23 C45 14, 43 11, 41 13" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Neck & Fluffy Head */}
            <rect
              x="22"
              y="36"
              width="20"
              height="20"
              rx="8"
              fill={`url(#${uid}-llama-fur)`}
              stroke="#2a1205"
              strokeWidth="3"
            />
            <circle
              cx="32"
              cy="32"
              r="16"
              fill={`url(#${uid}-llama-fur)`}
              stroke="#2a1205"
              strokeWidth="3.2"
            />
            {/* Fluffy Wool Top */}
            <path
              d="M21 22 Q25 16 32 19 Q39 16 43 22"
              fill="#fef3c7"
              stroke="#2a1205"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Snout */}
            <ellipse
              cx="32"
              cy="37"
              rx="8"
              ry="6"
              fill="#fef3c7"
              stroke="#2a1205"
              strokeWidth="2.5"
            />
            {/* Cute Llama Smile */}
            <path
              d="M29 38 Q32 41 35 38"
              stroke="#2a1205"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cool Pool Shades */}
            <rect x="17" y="25" width="13" height="8" rx="2" fill={`url(#${uid}-shades)`} stroke="#111827" strokeWidth="2.2" />
            <rect x="34" y="25" width="13" height="8" rx="2" fill={`url(#${uid}-shades)`} stroke="#111827" strokeWidth="2.2" />
            <line x1="30" y1="28" x2="34" y2="28" stroke="#111827" strokeWidth="2.5" />
            <line x1="20" y1="27" x2="25" y2="27" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="37" y1="27" x2="42" y2="27" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          </>
        );

      case 'gem':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-gem`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="45%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            <polygon
              points="18,14 46,14 56,26 32,54 8,26"
              fill={`url(#${uid}-gem)`}
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polyline
              points="8,26 56,26"
              stroke="#bae6fd"
              strokeWidth="2.2"
            />
            <polyline
              points="18,14 25,26 32,54 39,26 46,14"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon points="20,16 32,16 25,24" fill="rgba(255,255,255,0.75)" />
          </>
        );

      case 'gift':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-gift`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <rect x="12" y="26" width="40" height="28" rx="4" fill={`url(#${uid}-gift)`} stroke="#2a1205" strokeWidth="3.2" />
            <rect x="9" y="18" width="46" height="10" rx="3" fill="#f43f5e" stroke="#2a1205" strokeWidth="3.2" />
            <rect x="28" y="18" width="8" height="36" fill="#fde047" stroke="#2a1205" strokeWidth="2.5" />
            <rect x="12" y="36" width="40" height="7" fill="#fde047" stroke="#2a1205" strokeWidth="2.5" />
            <path d="M32 18 C22 8, 16 14, 24 18 Z" fill="#fde047" stroke="#2a1205" strokeWidth="2.8" />
            <path d="M32 18 C42 8, 48 14, 40 18 Z" fill="#fde047" stroke="#2a1205" strokeWidth="2.8" />
          </>
        );

      case 'clock':
      case 'time_tub':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-clock`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="34" r="21" fill={`url(#${uid}-clock)`} stroke="#042f2e" strokeWidth="3.5" />
            <circle cx="32" cy="34" r="15" fill="#ecfdf5" stroke="#047857" strokeWidth="2" />
            <rect x="27" y="7" width="10" height="5" rx="2" fill="#fde047" stroke="#042f2e" strokeWidth="2.5" />
            <polyline points="32,24 32,34 40,38" fill="none" stroke="#042f2e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="34" r="3" fill="#f59e0b" />
          </>
        );

      case 'crown':
      case 'tab_realms':
      case 'capy_millionaire':
      case 'baron_capy':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-crown`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <path
              d="M10 46 L14 20 L25 31 L32 14 L39 31 L50 20 L54 46 Z"
              fill={`url(#${uid}-crown)`}
              stroke="#2a1205"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <rect x="9" y="45" width="46" height="8" rx="3" fill="#d97706" stroke="#2a1205" strokeWidth="3.2" />
            <circle cx="14" cy="17" r="3.5" fill="#38bdf8" stroke="#2a1205" strokeWidth="2" />
            <circle cx="32" cy="11" r="4" fill="#fb7185" stroke="#2a1205" strokeWidth="2" />
            <circle cx="50" cy="17" r="3.5" fill="#38bdf8" stroke="#2a1205" strokeWidth="2" />
            <circle cx="32" cy="39" r="3.5" fill="#f43f5e" stroke="#2a1205" strokeWidth="1.8" />
            <circle cx="21" cy="40" r="2.5" fill="#22d3ee" stroke="#2a1205" strokeWidth="1.5" />
            <circle cx="43" cy="40" r="2.5" fill="#22d3ee" stroke="#2a1205" strokeWidth="1.5" />
          </>
        );

      case 'lock':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-lock`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <path
              d="M21 28 V19 A11 11 0 0 1 43 19 V28"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M21 28 V19 A11 11 0 0 1 43 19 V28"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect
              x="14"
              y="26"
              width="36"
              height="28"
              rx="6"
              fill={`url(#${uid}-lock)`}
              stroke="#2a1205"
              strokeWidth="3.5"
            />
            <circle cx="32" cy="38" r="4" fill="#2a1205" />
            <path d="M30 39 L29 47 H35 L34 39 Z" fill="#2a1205" />
          </>
        );

      case 'sparkle':
      case 'golden_hunter':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-spark`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>
            </defs>
            <path
              d="M32 6 L38 24 L56 30 L38 36 L32 54 L26 36 L8 30 L26 24 Z"
              fill={`url(#${uid}-spark)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path
              d="M49 10 L51 16 L57 18 L51 20 L49 26 L47 20 L41 18 L47 16 Z"
              fill="#fef08a"
              stroke="#2a1205"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="48" r="3.5" fill="#67e8f9" stroke="#2a1205" strokeWidth="2" />
          </>
        );

      case 'flame':
      case 'frenzy_boost':
      case 'frenzy_starter':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-flame`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <path
              d="M33 7 C33 7, 52 21, 49 39 C47 50, 39 56, 31 56 C21 56, 14 48, 15 37 C16 29, 23 25, 22 18 C22 18, 28 22, 29 27 C29 20, 33 7, 33 7 Z"
              fill={`url(#${uid}-flame)`}
              stroke="#2a1205"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M32 25 C32 25, 41 33, 39 44 C38 50, 34 52, 31 52 C26 52, 23 47, 25 41 C27 36, 32 33, 32 25 Z"
              fill="#fef08a"
            />
          </>
        );

      case 'palm':
      case 'touch_grass_never':
      case 'skill_cannonball':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-palm-leaf`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            {/* Island sandbar */}
            <ellipse cx="32" cy="53" rx="20" ry="6" fill="#fde047" stroke="#2a1205" strokeWidth="3" />
            {/* Curved Trunk */}
            <path
              d="M30 52 Q36 36 32 21 L38 21 Q43 36 37 52 Z"
              fill="#b45309"
              stroke="#2a1205"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Tropical Fronds */}
            <path
              d="M34 20 C22 12, 11 17, 9 26 C18 22, 26 22, 34 20 Z"
              fill={`url(#${uid}-palm-leaf)`}
              stroke="#14532d"
              strokeWidth="2.8"
            />
            <path
              d="M35 20 C47 12, 56 17, 57 26 C49 22, 42 22, 35 20 Z"
              fill={`url(#${uid}-palm-leaf)`}
              stroke="#14532d"
              strokeWidth="2.8"
            />
            <path
              d="M34 19 C26 7, 15 7, 13 14 C22 13, 28 15, 34 19 Z"
              fill={`url(#${uid}-palm-leaf)`}
              stroke="#14532d"
              strokeWidth="2.8"
            />
            <path
              d="M35 19 C43 7, 53 8, 54 15 C46 13, 40 15, 35 19 Z"
              fill={`url(#${uid}-palm-leaf)`}
              stroke="#14532d"
              strokeWidth="2.8"
            />
            <circle cx="31" cy="23" r="3.5" fill="#78350f" stroke="#2a1205" strokeWidth="1.8" />
            <circle cx="37" cy="24" r="3.5" fill="#78350f" stroke="#2a1205" strokeWidth="1.8" />
          </>
        );

      case 'shrine':
      case 'yuzu_shrine':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-shrine`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            {/* Pillars */}
            <rect x="17" y="22" width="6" height="32" rx="1.5" fill={`url(#${uid}-shrine)`} stroke="#2a1205" strokeWidth="3" />
            <rect x="41" y="22" width="6" height="32" rx="1.5" fill={`url(#${uid}-shrine)`} stroke="#2a1205" strokeWidth="3" />
            {/* Lower Beam */}
            <rect x="12" y="27" width="40" height="5" rx="2" fill={`url(#${uid}-shrine)`} stroke="#2a1205" strokeWidth="2.8" />
            {/* Curved Top Torii Roof */}
            <path
              d="M7 16 Q32 23 57 16 L54 23 Q32 28 10 23 Z"
              fill={`url(#${uid}-shrine)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Golden plaque */}
            <rect x="28" y="20" width="8" height="8" rx="1.5" fill="#fde047" stroke="#2a1205" strokeWidth="2.2" />
          </>
        );

      // ======================================================================
      // SHOP FOLDER TABS & SKILLS
      // ======================================================================
      case 'tab_upgrades':
      case 'cps_synergy_1':
      case 'skill_splashstorm':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-wave`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="55%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            <path
              d="M8 42 C14 24, 28 14, 43 18 C34 22, 33 32, 42 33 C49 34, 54 28, 56 38 C58 49, 44 55, 26 54 C14 53, 7 48, 8 42 Z"
              fill={`url(#${uid}-wave)`}
              stroke="#082f49"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* White Foam Crest */}
            <circle cx="43" cy="17" r="4.5" fill="#ffffff" stroke="#082f49" strokeWidth="2.5" />
            <circle cx="35" cy="14" r="3.5" fill="#ffffff" stroke="#082f49" strokeWidth="2.2" />
            <circle cx="51" cy="24" r="3.5" fill="#e0f2fe" stroke="#082f49" strokeWidth="2.2" />
            <path d="M16 44 Q28 38 42 44" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );

      case 'tab_helpers':
      case 'pelican':
      case 'pelican_hr':
      case 'skill_floatie':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-flam`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>
            </defs>
            {/* Inflatable Pool Ring Base */}
            <ellipse
              cx="32"
              cy="44"
              rx="20"
              ry="10"
              fill={`url(#${uid}-flam)`}
              stroke="#2a1205"
              strokeWidth="3.2"
            />
            <ellipse cx="32" cy="43" rx="8" ry="3.5" fill="#38bdf8" stroke="#2a1205" strokeWidth="2.2" />
            {/* Flamingo Neck & Head */}
            <path
              d="M21 40 C16 29, 18 14, 27 14 C33 14, 35 20, 31 25 C28 29, 27 35, 29 40 Z"
              fill={`url(#${uid}-flam)`}
              stroke="#2a1205"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Flamingo Beak */}
            <path
              d="M32 16 C38 16, 41 20, 39 24 L32 21 Z"
              fill="#fde047"
              stroke="#2a1205"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="27" cy="18" r="2" fill="#ffffff" />
            <circle cx="27.5" cy="18" r="1" fill="#000000" />
            {/* Highlight */}
            <path d="M18 44 Q24 49 34 49" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );

      case 'tab_badges':
      case 'badge':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-cup`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            {/* Handles */}
            <path
              d="M18 18 H10 C9 28, 14 34, 21 34"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M46 18 H54 C55 28, 50 34, 43 34"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Cup Body */}
            <path
              d="M17 12 H47 V27 C47 38, 39 43, 32 43 C25 43, 17 38, 17 27 Z"
              fill={`url(#${uid}-cup)`}
              stroke="#2a1205"
              strokeWidth="3.4"
              strokeLinejoin="round"
            />
            {/* Stem & Pedestal */}
            <rect x="28" y="42" width="8" height="8" fill="#d97706" stroke="#2a1205" strokeWidth="2.8" />
            <rect x="19" y="49" width="26" height="7" rx="3" fill="#fde047" stroke="#2a1205" strokeWidth="3" />
            {/* Star Emblem */}
            <polygon
              points="32,18 34.5,23.5 40.5,24 36,28 37.5,34 32,30.5 26.5,34 28,28 23.5,24 29.5,23.5"
              fill="#ffffff"
            />
          </>
        );

      case 'tab_rebirth':
      case 'tab_ascend':
      case 'skill_smoothie':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-rebirth-wing`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <radialGradient id={`${uid}-rebirth-core`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>
            {/* Radiant Sunburst Rays */}
            <circle cx="32" cy="32" r="28" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="3 4" opacity="0.6" />
            {/* Phoenix / Rebirth Rising Wings */}
            <path
              d="M18 46 C12 36, 10 22, 22 14 C25 24, 28 32, 32 38 C28 39, 22 43, 18 46 Z"
              fill={`url(#${uid}-rebirth-wing)`}
              stroke="#2a1205"
              strokeWidth="2.8"
            />
            <path
              d="M46 46 C52 36, 54 22, 42 14 C39 24, 36 32, 32 38 C36 39, 42 43, 46 46 Z"
              fill={`url(#${uid}-rebirth-wing)`}
              stroke="#2a1205"
              strokeWidth="2.8"
            />
            {/* Rebirth Ascending Crown / Diamond Flame */}
            <path
              d="M32 10 L37 24 L48 27 L38 34 L40 46 L32 40 L24 46 L26 34 L16 27 L27 24 Z"
              fill={`url(#${uid}-rebirth-core)`}
              stroke="#2a1205"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Central Rebirth Orb */}
            <circle cx="32" cy="30" r="7" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
            <circle cx="32" cy="30" r="3" fill="#facc15" />
            {/* Sparkle sparkles */}
            <polygon points="32,4 34,8 38,10 34,12 32,16 30,12 26,10 30,8" fill="#ffffff" />
          </>
        );

      case 'kebab':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-kebab-meat`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="25%" stopColor="#9a3412" />
                <stop offset="55%" stopColor="#d97706" />
                <stop offset="85%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#2a1205" />
              </linearGradient>
              <linearGradient id={`${uid}-spit-pole`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
            {/* Stainless Steel Spit Shaft */}
            <rect x="30" y="4" width="4" height="56" rx="2" fill={`url(#${uid}-spit-pole)`} stroke="#1e293b" strokeWidth="1.5" />
            {/* Giant Stacked Doner Cone */}
            <path
              d="M16 16 C16 13, 48 13, 48 16 L44 48 C44 52, 20 52, 20 48 Z"
              fill={`url(#${uid}-kebab-meat)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Stacked Meat Layer Grooves */}
            <path d="M17 22 Q32 26 47 22" stroke="#451a03" strokeWidth="2.5" fill="none" />
            <path d="M18 29 Q32 33 46 29" stroke="#451a03" strokeWidth="2.5" fill="none" />
            <path d="M19 36 Q32 40 45 36" stroke="#451a03" strokeWidth="2.5" fill="none" />
            <path d="M21 43 Q32 47 43 43" stroke="#451a03" strokeWidth="2.5" fill="none" />
            {/* Juicy Meat Highlights */}
            <ellipse cx="26" cy="25" rx="5" ry="1.8" fill="rgba(254,240,138,0.4)" />
            <ellipse cx="27" cy="33" rx="5" ry="1.8" fill="rgba(254,240,138,0.4)" />
            {/* Red Bell Pepper / Tomato Cap on top */}
            <ellipse cx="32" cy="15" rx="14" ry="4.5" fill="#dc2626" stroke="#2a1205" strokeWidth="2.5" />
            <circle cx="32" cy="14" r="2.5" fill="#15803d" />
            {/* Bottom Catch Tray */}
            <ellipse cx="32" cy="53" rx="18" ry="4" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
          </>
        );

      case 'durum':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-wrap-pita`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="50%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id={`${uid}-foil`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
            {/* Angled Durum Wrap Body */}
            <g transform="rotate(-25 32 32)">
              {/* Foil bottom */}
              <path d="M20 32 L44 32 L41 54 C40 56, 24 56, 23 54 Z" fill={`url(#${uid}-foil)`} stroke="#1e293b" strokeWidth="2.8" />
              <line x1="22" y1="42" x2="42" y2="42" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Lavas Bread Wrap upper */}
              <path d="M19 14 C19 10, 45 10, 45 14 L44 34 L20 34 Z" fill={`url(#${uid}-wrap-pita)`} stroke="#2a1205" strokeWidth="3" />
              {/* Toast Grill Marks */}
              <line x1="23" y1="18" x2="41" y2="20" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
              <line x1="22" y1="25" x2="42" y2="27" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
              {/* Fillings protruding from the top */}
              <ellipse cx="32" cy="14" rx="11" ry="5" fill="#78350f" stroke="#2a1205" strokeWidth="2" />
              <circle cx="27" cy="12" r="3.5" fill="#ef4444" />
              <circle cx="36" cy="11" r="3" fill="#22c55e" />
              <ellipse cx="32" cy="13" rx="3" ry="2" fill="#eab308" />
            </g>
          </>
        );

      case 'pizza':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-pizza-crust`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id={`${uid}-pizza-cheese`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {/* Slice Drop Shadow */}
            <path d="M10 16 L54 16 L32 58 Z" fill="rgba(0,0,0,0.3)" />
            {/* Puffy Golden Crust Top */}
            <path
              d="M10 16 C16 9, 48 9, 54 16 C55 21, 51 22, 47 21 C41 20, 23 20, 17 21 C13 22, 9 21, 10 16 Z"
              fill={`url(#${uid}-pizza-crust)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Melted Cheese Slice Body */}
            <path
              d="M13 20 L51 20 L32 58 Z"
              fill={`url(#${uid}-pizza-cheese)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Turkish Sucuk / Pepperoni slices */}
            <circle cx="28" cy="27" r="5" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <circle cx="27" cy="26" r="1.5" fill="#f87171" />
            <circle cx="39" cy="32" r="4.5" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <circle cx="38" cy="31" r="1.3" fill="#f87171" />
            <circle cx="31" cy="42" r="3.8" fill="#991b1b" stroke="#450a0a" strokeWidth="1.8" />
            {/* Oregano & Cheese String Drip */}
            <circle cx="22" cy="34" r="1" fill="#15803d" />
            <circle cx="36" cy="24" r="1" fill="#15803d" />
            <circle cx="34" cy="48" r="0.9" fill="#15803d" />
            <path d="M30 56 Q32 62 33 58" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
          </>
        );

      case 'baklava':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-baklava-pastry`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id={`${uid}-pistachio`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            {/* Diamond Cut Baklava (Isometric) */}
            {/* Bottom Shadow */}
            <polygon points="32,58 54,44 54,48 32,62 10,48 10,44" fill="rgba(0,0,0,0.35)" />
            {/* Flaky Layers Base */}
            <path
              d="M10 32 L32 44 L54 32 L54 48 L32 60 L10 48 Z"
              fill={`url(#${uid}-baklava-pastry)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Layer Lines (40 phyllo layers) */}
            <line x1="10" y1="36" x2="32" y2="48" stroke="#78350f" strokeWidth="1.6" />
            <line x1="32" y1="48" x2="54" y2="36" stroke="#78350f" strokeWidth="1.6" />
            <line x1="10" y1="41" x2="32" y2="53" stroke="#78350f" strokeWidth="1.6" />
            <line x1="32" y1="53" x2="54" y2="41" stroke="#78350f" strokeWidth="1.6" />
            {/* Diamond Top Surface */}
            <polygon
              points="32,16 54,30 32,44 10,30"
              fill="#fef08a"
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Honey Syrup Gloss */}
            <polygon points="32,20 48,30 32,38 16,30" fill="#fde047" opacity="0.6" />
            {/* Bright Crushed Antep Pistachio Mountain */}
            <ellipse cx="32" cy="29" rx="10" ry="5.5" fill={`url(#${uid}-pistachio)`} stroke="#14532d" strokeWidth="2" />
            <circle cx="28" cy="27" r="1.3" fill="#ffffff" />
            <circle cx="34" cy="28" r="1.4" fill="#ffffff" />
            <circle cx="31" cy="31" r="1.2" fill="#ffffff" />
            {/* Sweet Honey Drip */}
            <path d="M22 40 C22 45, 25 45, 25 40" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          </>
        );

      case 'ice_cream':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-cone`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <radialGradient id={`${uid}-scoop`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#fef08a" />
                <stop offset="85%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </radialGradient>
            </defs>
            {/* Long Maras Trickster Metal Scoop Stick */}
            <line x1="12" y1="8" x2="52" y2="52" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="12" y1="8" x2="22" y2="18" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            {/* Waffle Cone */}
            <polygon points="18,32 46,32 32,60" fill={`url(#${uid}-cone)`} stroke="#2a1205" strokeWidth="3" strokeLinejoin="round" />
            <line x1="23" y1="37" x2="39" y2="47" stroke="#92400e" strokeWidth="1.6" />
            <line x1="28" y1="44" x2="35" y2="53" stroke="#92400e" strokeWidth="1.6" />
            <line x1="41" y1="37" x2="25" y2="47" stroke="#92400e" strokeWidth="1.6" />
            {/* Maraş Stretchy Ice Cream Scoop with Twirl */}
            <path
              d="M17 32 C13 25, 17 14, 28 14 C30 9, 42 9, 44 16 C50 18, 51 28, 46 32 C43 35, 37 32, 32 34 C27 32, 21 35, 17 32 Z"
              fill={`url(#${uid}-scoop)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Swirl Stretch Lines */}
            <path d="M22 22 Q32 16 40 24" stroke="#d97706" strokeWidth="2" fill="none" />
            <ellipse cx="26" cy="18" rx="4" ry="2" fill="rgba(255,255,255,0.7)" />
          </>
        );

      case 'tea':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-tea-red`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="40%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <linearGradient id={`${uid}-glass-edge`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
              </linearGradient>
            </defs>
            {/* Glass Saucer with Turkish Red Pattern */}
            <ellipse cx="32" cy="54" rx="24" ry="6" fill="#f8fafc" stroke="#2a1205" strokeWidth="3" />
            <ellipse cx="32" cy="54" rx="20" ry="4.5" fill="#ef4444" stroke="#dc2626" strokeWidth="1.2" />
            <ellipse cx="32" cy="54" rx="14" ry="3" fill="#f8fafc" />
            {/* Ince Belli Turkish Glass Waistline */}
            <path
              d="M21 16 Q20 28 26 34 Q32 40 24 50 L40 50 Q32 40 38 34 Q44 28 43 16 Z"
              fill={`url(#${uid}-tea-red)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Glass Rim Top */}
            <ellipse cx="32" cy="16" rx="11" ry="3.5" fill="#fca5a5" stroke="#2a1205" strokeWidth="2.8" />
            {/* Glass Reflection Highlight */}
            <path d="M23 20 Q22 28 27 34 Q29 36 27 46" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Rising Steam Swirls */}
            <path d="M30 11 Q28 6 31 2" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M35 12 Q38 7 35 3" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        );

      case 'jet_ski':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-jetski-hull`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
            </defs>
            {/* Sea Splash Wake */}
            <path d="M6 46 Q14 42 18 48 Q22 44 28 48" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" fill="none" />
            <ellipse cx="12" cy="46" rx="4" ry="2" fill="#cffafe" />
            {/* Jet Ski Sleek Body */}
            <path
              d="M10 44 L48 44 C54 44 58 40 54 36 L44 32 L22 32 L14 38 Z"
              fill={`url(#${uid}-jetski-hull)`}
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Orange Neon Accent & Seat */}
            <path d="M20 32 L34 32 L38 36 L18 36 Z" fill="#f97316" stroke="#2a1205" strokeWidth="2" />
            {/* Windshield & Handlebars */}
            <path d="M36 32 L44 24 L48 27 L43 32 Z" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
            <line x1="34" y1="26" x2="37" y2="22" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            {/* Speed Waves below */}
            <path d="M14 50 Q28 46 42 50 Q52 46 58 50" stroke="#0284c7" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </>
        );

      case 'cable_car':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-gondola`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            {/* Overhead Steel Wire */}
            <line x1="4" y1="10" x2="60" y2="18" stroke="#475569" strokeWidth="3" />
            {/* Trolley Wheel & Arm */}
            <circle cx="32" cy="14" r="3.5" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
            <path d="M32 17 L32 26 L26 28" stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Rounded Gondola Cabin */}
            <rect
              x="16"
              y="28"
              width="32"
              height="28"
              rx="8"
              fill={`url(#${uid}-gondola)`}
              stroke="#2a1205"
              strokeWidth="3.2"
            />
            {/* Panoramic Cyan Windows */}
            <rect x="20" y="32" width="10" height="12" rx="3" fill="#bae6fd" stroke="#0369a1" strokeWidth="1.8" />
            <rect x="34" y="32" width="10" height="12" rx="3" fill="#bae6fd" stroke="#0369a1" strokeWidth="1.8" />
            <line x1="22" y1="41" x2="28" y2="35" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="36" y1="41" x2="42" y2="35" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );

      case 'pirate_ship':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-ship-wood`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#92400e" />
                <stop offset="60%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>
            {/* Galleon Wooden Hull */}
            <path
              d="M10 40 C14 52, 46 52, 54 40 L58 36 L8 36 Z"
              fill={`url(#${uid}-ship-wood)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Portholes */}
            <circle cx="20" cy="42" r="2" fill="#facc15" stroke="#2a1205" strokeWidth="1.2" />
            <circle cx="32" cy="42" r="2" fill="#facc15" stroke="#2a1205" strokeWidth="1.2" />
            <circle cx="44" cy="42" r="2" fill="#facc15" stroke="#2a1205" strokeWidth="1.2" />
            {/* Mast */}
            <line x1="32" y1="10" x2="32" y2="36" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
            {/* White Billowed Sail */}
            <path
              d="M20 16 Q32 12 44 16 Q38 28 32 30 Q24 28 20 16 Z"
              fill="#f8fafc"
              stroke="#2a1205"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Pirate Flag with Skull */}
            <rect x="32" y="8" width="12" height="7" fill="#0f172a" stroke="#2a1205" strokeWidth="1.5" />
            <circle cx="37" cy="11.5" r="1.5" fill="#ffffff" />
            {/* Waves */}
            <path d="M6 50 Q16 46 26 50 Q36 46 46 50 Q56 46 62 50" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );

      case 'sun':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-warm-sun`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="85%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#c2410c" />
              </radialGradient>
            </defs>
            {/* 8 Bold Comic Rays */}
            <path d="M32 4 L32 10 M32 54 L32 60 M4 32 L10 32 M54 32 L60 32 M12 12 L16 16 M48 48 L52 52 M12 52 L16 48 M48 16 L52 12" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
            {/* Central Sun Circle */}
            <circle cx="32" cy="32" r="16" fill={`url(#${uid}-warm-sun)`} stroke="#2a1205" strokeWidth="3.2" />
            {/* Cool Sunglasses */}
            <rect x="22" y="27" width="9" height="7" rx="3" fill="#0f172a" />
            <rect x="33" y="27" width="9" height="7" rx="3" fill="#0f172a" />
            <line x1="31" y1="30" x2="33" y2="30" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="23" y1="28" x2="29" y2="33" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
            {/* Big Grin */}
            <path d="M27 38 Q32 42 37 38" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        );

      case 'cloud':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-cloud`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>
            <path
              d="M18 44 L46 44 C53 44 56 38 52 32 C54 24 45 18 38 22 C34 14 22 14 18 22 C10 23 9 34 16 38 Z"
              fill={`url(#${uid}-cloud)`}
              stroke="#0284c7"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <ellipse cx="25" cy="24" rx="4" ry="2" fill="#ffffff" opacity="0.8" />
          </>
        );

      case 'cherry_blossom':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-sakura-petal`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf2f8" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
            {/* 5 Distinct Petals */}
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <path
                key={idx}
                d="M32 32 C26 18, 38 18, 32 32 Z"
                transform={`rotate(${angle} 32 32)`}
                fill={`url(#${uid}-sakura-petal)`}
                stroke="#831843"
                strokeWidth="2.2"
              />
            ))}
            <circle cx="32" cy="32" r="5" fill="#fde047" stroke="#831843" strokeWidth="2" />
          </>
        );

      case 'aurora_borealis':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-aurora`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <rect x="8" y="10" width="48" height="44" rx="8" fill="#0f172a" stroke="#2a1205" strokeWidth="2.8" />
            <path d="M12 44 Q24 20 36 34 Q48 22 52 40" stroke={`url(#${uid}-aurora)`} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M14 36 Q26 16 38 28 Q46 18 50 32" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
            <circle cx="20" cy="18" r="1.5" fill="#ffffff" />
            <circle cx="44" cy="16" r="1.5" fill="#ffffff" />
          </>
        );

      case 'cosmic_nebula':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-nebula`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="45%" stopColor="#818cf8" />
                <stop offset="85%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="24" fill={`url(#${uid}-nebula)`} stroke="#2a1205" strokeWidth="3" />
            <path d="M18 32 Q32 20 46 32 Q32 44 18 32 Z" fill="none" stroke="#67e8f9" strokeWidth="2.5" transform="rotate(35 32 32)" />
            <circle cx="32" cy="32" r="4" fill="#ffffff" />
            <polygon points="32,24 33,28 37,29 33,30 32,34 31,30 27,29 31,28" fill="#fef08a" />
          </>
        );

      case 'water_bottle':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-bottle`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="40%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Sports Cap */}
            <rect x="28" y="10" width="8" height="6" rx="2" fill="#f97316" stroke="#2a1205" strokeWidth="2.2" />
            {/* Bottle Body */}
            <rect x="22" y="16" width="20" height="38" rx="6" fill={`url(#${uid}-bottle)`} stroke="#2a1205" strokeWidth="3.2" />
            {/* Grip Ribs */}
            <line x1="25" y1="28" x2="39" y2="28" stroke="#0284c7" strokeWidth="1.8" />
            <line x1="25" y1="34" x2="39" y2="34" stroke="#0284c7" strokeWidth="1.8" />
            <line x1="25" y1="40" x2="39" y2="40" stroke="#0284c7" strokeWidth="1.8" />
            {/* Gloss shine */}
            <path d="M25 20 L25 48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          </>
        );

      case 'skill_sunburn':
      case 'dyson_sphere':
      case 'sunny_onsen':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-sun`} cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="85%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>
            {/* Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <polygon
                key={deg}
                points="32,4 36,13 28,13"
                fill="#fde047"
                stroke="#2a1205"
                strokeWidth="2.2"
                transform={`rotate(${deg} 32 32)`}
              />
            ))}
            <circle cx="32" cy="32" r="16" fill={`url(#${uid}-sun)`} stroke="#2a1205" strokeWidth="3.2" />
            {/* Cool Sunglasses on Sun */}
            <rect x="21" y="27" width="9" height="6" rx="1.5" fill="#0f172a" />
            <rect x="34" y="27" width="9" height="6" rx="1.5" fill="#0f172a" />
            <line x1="30" y1="29" x2="34" y2="29" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M27 38 Q32 42 37 38" stroke="#2a1205" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );

      case 'skill_tidal':
      case 'crit_damage':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-boom`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="80%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>
            </defs>
            <polygon
              points="32,6 39,19 54,12 46,27 59,35 44,41 49,56 34,47 22,57 23,42 8,40 19,29 12,15 26,20"
              fill={`url(#${uid}-boom)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <polygon
              points="32,16 36,24 45,21 40,29 48,34 39,38 41,46 33,40 26,46 27,37 18,35 25,29 21,22 29,25"
              fill="#fef08a"
            />
          </>
        );

      // ======================================================================
      // CLICK UPGRADES & HELPERS
      // ======================================================================
      case 'double_boop':
      case 'first_boop':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-paw`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            {/* Golden Llama Hoof / Boop Hand */}
            <circle cx="32" cy="38" r="15" fill={`url(#${uid}-paw)`} stroke="#2a1205" strokeWidth="3.2" />
            <ellipse cx="19" cy="21" rx="5" ry="7" transform="rotate(-20 19 21)" fill={`url(#${uid}-paw)`} stroke="#2a1205" strokeWidth="2.8" />
            <ellipse cx="32" cy="17" rx="5.5" ry="7.5" fill={`url(#${uid}-paw)`} stroke="#2a1205" strokeWidth="2.8" />
            <ellipse cx="45" cy="21" rx="5" ry="7" transform="rotate(20 45 21)" fill={`url(#${uid}-paw)`} stroke="#2a1205" strokeWidth="2.8" />
            <ellipse cx="32" cy="39" rx="8" ry="6" fill="#fb7185" stroke="#2a1205" strokeWidth="2" />
          </>
        );

      case 'citrus_crit':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-chili`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>
            <path
              d="M22 18 C16 28, 22 48, 48 52 C40 42, 36 28, 34 18 Z"
              fill={`url(#${uid}-chili)`}
              stroke="#2a1205"
              strokeWidth="3.4"
              strokeLinejoin="round"
            />
            <path
              d="M28 18 C28 11, 35 9, 39 12"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path d="M25 25 Q26 36 35 44" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );

      case 'quantum_cursor':
      case 'carpal_intern':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-cursor`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <polygon
              points="16,10 50,28 35,34 44,50 36,54 27,38 16,47"
              fill={`url(#${uid}-cursor)`}
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polygon points="20,16 42,28 32,31 20,40" fill="rgba(255,255,255,0.45)" />
          </>
        );

      case 'cosmic_boop':
      case 'cosmic':
      case 'transcendental_rodent':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-planet`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="55%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#311042" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="16" fill={`url(#${uid}-planet)`} stroke="#1e1b4b" strokeWidth="3.2" />
            <ellipse
              cx="32"
              cy="32"
              rx="26"
              ry="8"
              transform="rotate(-22 32 32)"
              fill="none"
              stroke="#fde047"
              strokeWidth="4.5"
            />
            <ellipse
              cx="32"
              cy="32"
              rx="26"
              ry="8"
              transform="rotate(-22 32 32)"
              fill="none"
              stroke="#2a1205"
              strokeWidth="1.5"
            />
            <circle cx="26" cy="26" r="4" fill="rgba(255,255,255,0.6)" />
          </>
        );

      case 'rubber_duck':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-duck`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ca8a04" />
              </radialGradient>
            </defs>
            {/* Duck Body */}
            <path
              d="M14 40 C12 31, 20 28, 28 31 C36 32, 45 27, 49 32 C53 38, 49 50, 32 50 C18 50, 15 45, 14 40 Z"
              fill={`url(#${uid}-duck)`}
              stroke="#2a1205"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Duck Head */}
            <circle cx="26" cy="22" r="11" fill={`url(#${uid}-duck)`} stroke="#2a1205" strokeWidth="3.2" />
            {/* Orange Bill */}
            <path
              d="M16 21 C10 21, 9 26, 16 27 L20 24 Z"
              fill="#f97316"
              stroke="#2a1205"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="20" r="2.2" fill="#1c1917" />
            <circle cx="23.5" cy="19.2" r="0.8" fill="#ffffff" />
            {/* Wing */}
            <path d="M27 37 Q36 34 40 41 Q33 45 27 37 Z" fill="#fde047" stroke="#2a1205" strokeWidth="2.4" />
          </>
        );

      case 'intern':
      case 'chill_bro':
      case 'ok_i_pull_up':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-visor`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Cool Deal-With-It Shades Badge */}
            <circle cx="32" cy="32" r="21" fill="#fde047" stroke="#2a1205" strokeWidth="3.5" />
            <polygon
              points="11,24 31,24 31,34 27,38 15,38 11,34"
              fill={`url(#${uid}-visor)`}
              stroke="#0f172a"
              strokeWidth="2.8"
            />
            <polygon
              points="33,24 53,24 53,34 49,38 37,38 33,34"
              fill={`url(#${uid}-visor)`}
              stroke="#0f172a"
              strokeWidth="2.8"
            />
            <line x1="15" y1="28" x2="25" y2="28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="37" y1="28" x2="47" y2="28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 44 Q32 49 40 44" stroke="#2a1205" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );

      case 'slop_server':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-boombox`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>
            </defs>
            <path d="M22 20 V13 H42 V20" fill="none" stroke="#2a1205" strokeWidth="4" strokeLinejoin="round" />
            <rect x="10" y="20" width="44" height="30" rx="6" fill={`url(#${uid}-boombox)`} stroke="#2a1205" strokeWidth="3.4" />
            <circle cx="22" cy="35" r="8" fill="#1e1b4b" stroke="#fde047" strokeWidth="2.5" />
            <circle cx="22" cy="35" r="3" fill="#22d3ee" />
            <circle cx="42" cy="35" r="8" fill="#1e1b4b" stroke="#fde047" strokeWidth="2.5" />
            <circle cx="42" cy="35" r="3" fill="#22d3ee" />
          </>
        );

      case 'influencer':
        return (
          <>
            <defs>
              <linearGradient id={`${uid}-phone`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#db2777" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <rect x="18" y="8" width="28" height="48" rx="6" fill={`url(#${uid}-phone)`} stroke="#1e1b4b" strokeWidth="3.5" />
            <rect x="22" y="14" width="20" height="34" rx="3" fill="#0f172a" />
            {/* Heart notification */}
            <path
              d="M32 39 C32 39, 24 33, 24 27 C24 23, 29 22, 32 26 C35 22, 40 23, 40 27 C40 33, 32 39, 32 39 Z"
              fill="#fb7185"
              stroke="#ffffff"
              strokeWidth="1.8"
            />
          </>
        );

      case 'collider':
        return (
          <>
            <circle cx="32" cy="32" r="6" fill="#22d3ee" stroke="#082f49" strokeWidth="2.5" />
            <ellipse cx="32" cy="32" rx="24" ry="9" transform="rotate(30 32 32)" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <ellipse cx="32" cy="32" rx="24" ry="9" transform="rotate(-30 32 32)" fill="none" stroke="#fde047" strokeWidth="3" />
            <ellipse cx="32" cy="32" rx="24" ry="9" transform="rotate(90 32 32)" fill="none" stroke="#f472b6" strokeWidth="3" />
          </>
        );

      case 'sakura':
        return (
          <>
            <defs>
              <radialGradient id={`${uid}-sakura`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#db2777" />
              </radialGradient>
            </defs>
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="32"
                cy="18"
                rx="8"
                ry="12"
                fill={`url(#${uid}-sakura)`}
                stroke="#831843"
                strokeWidth="2.4"
                transform={`rotate(${deg} 32 32)`}
              />
            ))}
            <circle cx="32" cy="32" r="6" fill="#fde047" stroke="#831843" strokeWidth="2" />
          </>
        );

      case 'matrix':
      case 'cyber_capy':
        return (
          <>
            <rect x="10" y="14" width="44" height="32" rx="5" fill="#0f172a" stroke="#2dd4bf" strokeWidth="3.5" />
            <rect x="15" y="19" width="34" height="22" rx="2" fill="#042f2e" />
            <path d="M21 26 L26 30 L21 34" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="30" y1="34" x2="39" y2="34" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            <rect x="22" y="47" width="20" height="5" rx="2" fill="#2dd4bf" stroke="#0f172a" strokeWidth="2" />
          </>
        );

      case 'tinfoil_capy':
        return (
          <>
            <polygon
              points="32,10 54,48 10,48"
              fill="#cbd5e1"
              stroke="#1e293b"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polygon points="32,10 42,48 32,48" fill="#94a3b8" />
            <circle cx="32" cy="10" r="4" fill="#a3e635" stroke="#1e293b" strokeWidth="2" />
          </>
        );

      case 'wizard_capy':
        return (
          <>
            <path
              d="M10 48 Q32 54 54 48 L43 40 L34 10 L21 40 Z"
              fill="#9333ea"
              stroke="#1e1b4b"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polygon points="32,24 34,29 39,29 35,32 36,37 32,34 28,37 29,32 25,29 30,29" fill="#fde047" />
          </>
        );

      case 'biblical_capy':
      case 'biblically_chill':
        return (
          <>
            <ellipse cx="32" cy="32" rx="25" ry="11" transform="rotate(25 32 32)" fill="none" stroke="#fde047" strokeWidth="4" />
            <ellipse cx="32" cy="32" rx="25" ry="11" transform="rotate(-25 32 32)" fill="none" stroke="#f59e0b" strokeWidth="4" />
            <ellipse cx="32" cy="32" rx="13" ry="9" fill="#ffffff" stroke="#2a1205" strokeWidth="3" />
            <circle cx="32" cy="32" r="5" fill="#f43f5e" stroke="#2a1205" strokeWidth="2" />
            <circle cx="30.5" cy="30.5" r="1.8" fill="#ffffff" />
          </>
        );

      case 'middle_management':
        return (
          <>
            <rect x="10" y="12" width="44" height="40" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="3.2" />
            <polyline
              points="16,42 27,31 35,36 48,20"
              fill="none"
              stroke="#4ade80"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon points="48,18 49,27 40,20" fill="#4ade80" />
          </>
        );

      default:
        // Fallback to glossy Golden Yuzu icon
        return (
          <>
            <circle cx="32" cy="34" r="19" fill="#facc15" stroke="#2a1205" strokeWidth="3.5" />
            <path d="M32 15 C38 9, 48 11, 45 19 C42 24, 34 21, 32 15 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.5" />
            <ellipse cx="24" cy="27" rx="6" ry="3.5" transform="rotate(-25 24 27)" fill="rgba(255,255,255,0.75)" />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {renderArtwork()}
    </svg>
  );
}

export default GameIcon;
