import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import ThreeStage from './components/ThreeStage.jsx';
import ShopPanel, { calculateBulkHelperPurchase } from './components/ShopPanel.jsx';
import BubbleNumber from './components/BubbleNumber.jsx';
import ComicToast from './components/ComicToast.jsx';
import AlanyaWelcomeScreen from './components/AlanyaWelcomeScreen.jsx';
import { GameIcon } from './components/GameIcons.jsx';
import {
  EVOLUTIONS,
  CLICK_UPGRADES,
  HELPERS,
  WEATHERS,
  ACHIEVEMENTS,
  NEWS_HEADLINES,
  CAPY_QUOTES,
  MILESTONE_THRESHOLDS,
  formatNumber,
} from './data/gameData.js';
import { soundEngine } from './audio/soundEngine.js';

const SAVE_KEY = 'capy_chill_clicker_save_v1';

/**
 * Active Skills for the Center Vertical Skill Column (Clicker Heroes style, Pool-Splash edition!)
 * Uses custom vector GameIcon artwork — zero standard OS emojis.
 */
const ACTIVE_SKILLS = [
  {
    id: 'auto_storm',
    name: 'Splashstorm',
    icon: 'skill_splashstorm',
    desc: 'Auto-boops 10 times per second for 10s!',
    duration: 10,
    cooldown: 35,
    bg: 'from-cyan-400 via-sky-500 to-blue-600',
  },
  {
    id: 'boop_rage',
    name: 'Sunburn Surge',
    icon: 'skill_sunburn',
    desc: '2x All Vibes & CPS for 15s!',
    duration: 15,
    cooldown: 45,
    bg: 'from-rose-500 via-orange-500 to-amber-600',
  },
  {
    id: 'lucky_yuzu',
    name: 'Cannonball Crit',
    icon: 'skill_cannonball',
    desc: '+50% Critical Boop Chance for 12s!',
    duration: 12,
    cooldown: 55,
    bg: 'from-amber-400 via-yellow-500 to-orange-600',
  },
  {
    id: 'golden_taps',
    name: 'Golden Floatie',
    icon: 'skill_floatie',
    desc: '+1% of CPS per click for 12s!',
    duration: 12,
    cooldown: 65,
    bg: 'from-pink-400 via-rose-500 to-rose-700',
  },
  {
    id: 'super_boop',
    name: 'Tidal Wave',
    icon: 'skill_tidal',
    desc: '+300% Critical Boop Damage for 12s!',
    duration: 12,
    cooldown: 75,
    bg: 'from-fuchsia-500 via-purple-600 to-indigo-800',
  },
  {
    id: 'instant_frenzy',
    name: 'Yuzu Smoothie',
    icon: 'skill_smoothie',
    desc: 'Instantly fills Fever Bar to 100% Frenzy!',
    duration: 1,
    cooldown: 90,
    bg: 'from-emerald-400 via-teal-500 to-cyan-700',
  },
];

/**
 * Full-Viewport Drifting Sky Clouds (Spanning the ENTIRE screen from left to right)
 */
const FULL_SCREEN_CLOUDS = [
  { top: '4%', width: 250, dur: '68s', delay: '-8s', opacity: 0.85 },
  { top: '9%', width: 190, dur: '82s', delay: '-38s', opacity: 0.72 },
  { top: '14%', width: 310, dur: '94s', delay: '-62s', opacity: 0.88 },
  { top: '20%', width: 220, dur: '74s', delay: '-22s', opacity: 0.68 },
  { top: '27%', width: 270, dur: '88s', delay: '-51s', opacity: 0.78 },
  { top: '34%', width: 180, dur: '64s', delay: '-15s', opacity: 0.62 },
  { top: '41%', width: 240, dur: '98s', delay: '-74s', opacity: 0.65 },
  { top: '48%', width: 200, dur: '79s', delay: '-31s', opacity: 0.55 },
];

/**
 * Decorative Floating Pool & Soap Bubbles across the whole screen
 */
const POOL_BUBBLES = [
  { left: '12%', size: 20, delay: '0.5s', dur: '7.5s' },
  { left: '34%', size: 16, delay: '1.8s', dur: '6.4s' },
  { left: '54%', size: 22, delay: '0s', dur: '7s' },
  { left: '63%', size: 14, delay: '1.5s', dur: '6s' },
  { left: '72%', size: 28, delay: '0.8s', dur: '8.5s' },
  { left: '81%', size: 18, delay: '2.3s', dur: '6.8s' },
  { left: '89%', size: 24, delay: '0.4s', dur: '7.6s' },
  { left: '94%', size: 15, delay: '3.1s', dur: '5.9s' },
];

/**
 * Helper to Attach Fallback Light-Dismiss to Native <dialog> Elements
 * per modern-web-guidance `light-dismiss-a-dialog`
 */
function attachDialogLightDismissFallback(dialogEl, onCloseCallback) {
  if (!dialogEl) return () => {};
  const handleClick = (event) => {
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      if (event.target !== dialogEl) return;
      const rect = dialogEl.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (isDialogContent) return;
      dialogEl.close();
    }
  };
  const handleClose = () => {
    if (onCloseCallback) onCloseCallback();
  };
  dialogEl.addEventListener('click', handleClick);
  dialogEl.addEventListener('close', handleClose);
  return () => {
    dialogEl.removeEventListener('click', handleClick);
    dialogEl.removeEventListener('close', handleClose);
  };
}

export default function App() {
  // --- Core Persisted Game State ---
  const [vibes, setVibes] = useState(0);
  const [lifetimeVibes, setLifetimeVibes] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [upgradeLevels, setUpgradeLevels] = useState({});
  const [helperCounts, setHelperCounts] = useState({});
  const [selectedEvolution, setSelectedEvolution] = useState(0);
  const [unlockedEvolutionMax, setUnlockedEvolutionMax] = useState(0);
  const [weatherId, setWeatherId] = useState('sunny_onsen');
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [ascensionTokens, setAscensionTokens] = useState(0);
  const [ascensionCount, setAscensionCount] = useState(0);
  const [frenzyCount, setFrenzyCount] = useState(0);
  const [goldenCatches, setGoldenCatches] = useState(0);

  // --- UI & Transient Gameplay State ---
  const [buyMode, setBuyMode] = useState(1);
  const [muted, setMuted] = useState(false);
  const [screenShakeEnabled, setScreenShakeEnabled] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [feverPct, setFeverPct] = useState(0);
  const [frenzyRemaining, setFrenzyRemaining] = useState(0); // seconds
  const [goldenBuff, setGoldenBuff] = useState(null); // { type: 'click_7x' | 'cps_3x', label, mult, remaining }
  const [goldenSpawn, setGoldenSpawn] = useState({ id: 0, active: false });
  const [externalClickPulse, setExternalClickPulse] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [splashParticles, setSplashParticles] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [capyQuote, setCapyQuote] = useState('No drama, just a chilled pool llama.');
  const [, setNewsIndex] = useState(0);
  const [offlineEarnings, setOfflineEarnings] = useState(null);
  const [rebirthModalOpen, setRebirthModalOpen] = useState(false);
  const [showAlanyaWelcome, setShowAlanyaWelcome] = useState(true);

  // --- Live Facial Expression Mood State (`chill` | `happy` | `crit` | `frenzy`) ---
  const [transientMood, setTransientMood] = useState(null);
  const moodTimeoutRef = useRef(null);

  // --- Active Skills State (`{ [skillId]: { activeRem: 0, cdRem: 0 } }`) ---
  const [skillTimers, setSkillTimers] = useState({});

  // --- Refs for Native <dialog> Modals ---
  const rebirthDialogRef = useRef(null);
  const offlineDialogRef = useRef(null);

  // --- Load Saved Game on Mount ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.vibes === 'number') setVibes(saved.vibes);
        if (typeof saved.lifetimeVibes === 'number') setLifetimeVibes(saved.lifetimeVibes);
        if (typeof saved.totalClicks === 'number') setTotalClicks(saved.totalClicks);
        if (saved.upgradeLevels) setUpgradeLevels(saved.upgradeLevels);
        if (saved.helperCounts) setHelperCounts(saved.helperCounts);
        if (typeof saved.selectedEvolution === 'number') setSelectedEvolution(saved.selectedEvolution);
        if (typeof saved.unlockedEvolutionMax === 'number') setUnlockedEvolutionMax(saved.unlockedEvolutionMax);
        if (saved.weatherId) setWeatherId(saved.weatherId);
        if (Array.isArray(saved.unlockedAchievements)) setUnlockedAchievements(saved.unlockedAchievements);
        if (typeof saved.ascensionTokens === 'number') setAscensionTokens(saved.ascensionTokens);
        if (typeof saved.ascensionCount === 'number') setAscensionCount(saved.ascensionCount);
        if (typeof saved.frenzyCount === 'number') setFrenzyCount(saved.frenzyCount);
        if (typeof saved.goldenCatches === 'number') setGoldenCatches(saved.goldenCatches);

        if (saved.lastSavedAt && saved.lastCps > 0) {
          const elapsedSec = Math.min(86400, (Date.now() - saved.lastSavedAt) / 1000);
          if (elapsedSec > 15) {
            const earnedOffline = Math.floor(saved.lastCps * elapsedSec * 0.65);
            if (earnedOffline > 0) {
              setVibes((v) => v + earnedOffline);
              setLifetimeVibes((lv) => lv + earnedOffline);
              setOfflineEarnings({
                seconds: Math.floor(elapsedSec),
                amount: earnedOffline,
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to parse save state:', err);
    }
  }, []);

  // --- Prevent accidental browser smart-zoom, double-tap zoom & trackpad pinch-zoom ---
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };
    const handleGesture = (e) => e.preventDefault();
    const handleDblClick = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gesturestart', handleGesture);
    window.addEventListener('gesturechange', handleGesture);
    window.addEventListener('gestureend', handleGesture);
    document.addEventListener('dblclick', handleDblClick, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGesture);
      window.removeEventListener('gesturechange', handleGesture);
      window.removeEventListener('gestureend', handleGesture);
      document.removeEventListener('dblclick', handleDblClick);
    };
  }, []);

  // --- Toast Helper ---
  const pushToast = useCallback((title, subtitle, icon = 'sparkle', accent = 'from-amber-400 to-orange-500') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, title, subtitle, icon, accent }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  // --- Computed Multipliers, CPS, and CPC ---
  const stats = useMemo(() => {
    const evoObj = EVOLUTIONS[unlockedEvolutionMax] || EVOLUTIONS[0];
    const evoMult = evoObj.mult || 1;

    const weatherObj = WEATHERS.find((w) => w.id === weatherId) || WEATHERS[0];
    const weatherMult = weatherObj.mult || 1;

    const achievementMult = 1 + unlockedAchievements.length * 0.02;
    const ascensionMult = 1 + ascensionTokens * 0.25;

    const isFrenzy = frenzyRemaining > 0;
    const frenzyPowerLevel = upgradeLevels.frenzy_boost || 0;
    const frenzyMult = isFrenzy ? 2.0 + frenzyPowerLevel * 0.5 : 1.0;

    // Active skill buffs
    const rageActive = (skillTimers.boop_rage?.activeRem || 0) > 0;
    const luckyActive = (skillTimers.lucky_yuzu?.activeRem || 0) > 0;
    const goldenTapsActive = (skillTimers.golden_taps?.activeRem || 0) > 0;
    const superBoopActive = (skillTimers.super_boop?.activeRem || 0) > 0;

    const skillGlobalMult = rageActive ? 2.0 : 1.0;

    const goldenCpsMult = goldenBuff?.type === 'cps_3x' ? goldenBuff.mult : 1.0;
    const goldenClickMult = goldenBuff?.type === 'click_7x' ? goldenBuff.mult : 1.0;

    const globalMultiplier =
      evoMult * weatherMult * achievementMult * ascensionMult * frenzyMult * skillGlobalMult;

    let rawCps = 0;
    let totalHelpersOwned = 0;
    for (const h of HELPERS) {
      const count = helperCounts[h.id] || 0;
      totalHelpersOwned += count;
      if (count > 0) {
        let surges = 0;
        for (const t of MILESTONE_THRESHOLDS) {
          if (count >= t) surges++;
        }
        const milestoneMult = Math.pow(2, surges);
        rawCps += count * h.baseCps * milestoneMult;
      }
    }

    const totalCps = rawCps * globalMultiplier * goldenCpsMult;

    let flatClickBonus = 1;
    let critChance = 0.05 + (luckyActive ? 0.5 : 0);
    let critMult = 4.0 + (superBoopActive ? 3.0 : 0);
    let cpsToClickPct = goldenTapsActive ? 0.01 : 0;

    for (const u of CLICK_UPGRADES) {
      const lvl = upgradeLevels[u.id] || 0;
      if (lvl <= 0) continue;
      if (u.type === 'flat_click') flatClickBonus += lvl * u.value;
      if (u.type === 'crit_chance') critChance += lvl * u.value;
      if (u.type === 'crit_mult') critMult += lvl * u.value;
      if (u.type === 'cps_to_click') cpsToClickPct += lvl * u.value;
    }

    const baseAndSynergyClick = flatClickBonus + totalCps * cpsToClickPct;
    const totalCpc = Math.max(1, baseAndSynergyClick * globalMultiplier * goldenClickMult);

    const totalPotentialTokens = Math.floor(Math.sqrt(lifetimeVibes / 50000));
    const pendingAscensionTokens = Math.max(0, totalPotentialTokens - ascensionTokens);

    // Calculate a virtual "Stage Level" like "Lagoon Lvl 125" in Clicker Heroes!
    const stageLevel = Math.max(1, Math.floor(Math.log10(Math.max(10, lifetimeVibes + 10)) * 18) - 17);

    return {
      totalCps,
      totalCpc,
      critChance: Math.min(0.85, critChance),
      critMult,
      globalMultiplier,
      isFrenzy,
      frenzyMult,
      rageActive,
      totalHelpersOwned,
      pendingAscensionTokens,
      stageLevel,
    };
  }, [
    unlockedEvolutionMax,
    weatherId,
    unlockedAchievements.length,
    ascensionTokens,
    frenzyRemaining,
    goldenBuff,
    helperCounts,
    upgradeLevels,
    lifetimeVibes,
    skillTimers,
  ]);

  // --- Computed Live Expression Mood Badge ---
  const expressionBadge = useMemo(() => {
    if (stats.isFrenzy || stats.rageActive) {
      return {
        icon: 'flame',
        label: 'RAGE FRENZY!',
        bg: 'from-[#f43f5e] via-[#f97316] to-[#eab308]',
        border: 'border-[#fef08a]',
      };
    }
    if (transientMood === 'crit') {
      return {
        icon: 'skill_tidal',
        label: 'MEGA CRIT!',
        bg: 'from-[#fde047] via-[#f59e0b] to-[#ea580c]',
        border: 'border-white',
      };
    }
    if (transientMood === 'happy') {
      return {
        icon: 'skill_splashstorm',
        label: 'Wave Splash!',
        bg: 'from-[#34d399] via-[#10b981] to-[#059669]',
        border: 'border-[#a7f3d0]',
      };
    }
    return {
      icon: 'llama',
      label: 'Chilled Llama',
      bg: 'from-[#0ea5e9] via-[#0284c7] to-[#0369a1]',
      border: 'border-[#7dd3fc]',
    };
  }, [stats.isFrenzy, stats.rageActive, transientMood]);

  // --- Sync Native <dialog> Modals (`showModal()` + `closedby="any"` + fallback) ---
  useEffect(() => {
    const dialogEl = rebirthDialogRef.current;
    if (!dialogEl) return;
    const cleanup = attachDialogLightDismissFallback(dialogEl, () => setRebirthModalOpen(false));
    if (rebirthModalOpen && !dialogEl.open) {
      dialogEl.showModal();
    } else if (!rebirthModalOpen && dialogEl.open) {
      dialogEl.close();
    }
    return cleanup;
  }, [rebirthModalOpen]);

  useEffect(() => {
    const dialogEl = offlineDialogRef.current;
    if (!dialogEl) return;
    const cleanup = attachDialogLightDismissFallback(dialogEl, () => setOfflineEarnings(null));
    if (offlineEarnings && !dialogEl.open) {
      dialogEl.showModal();
    } else if (!offlineEarnings && dialogEl.open) {
      dialogEl.close();
    }
    return cleanup;
  }, [offlineEarnings]);

  // --- Check Evolution Unlocks ---
  useEffect(() => {
    let highestUnlocked = unlockedEvolutionMax;
    for (let i = unlockedEvolutionMax + 1; i < EVOLUTIONS.length; i++) {
      if (lifetimeVibes >= EVOLUTIONS[i].minVibes) {
        highestUnlocked = i;
      }
    }
    if (highestUnlocked > unlockedEvolutionMax) {
      setUnlockedEvolutionMax(highestUnlocked);
      setSelectedEvolution(highestUnlocked);
      const newEvo = EVOLUTIONS[highestUnlocked];
      soundEngine.playMilestone();
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { x: 0.72, y: 0.5 },
      });
      pushToast(
        `NEW 3D EVOLUTION: ${newEvo.name}!`,
        `${newEvo.bonusText} — ${newEvo.title}`,
        'crown',
        'from-amber-400 via-yellow-500 to-orange-500'
      );
    }
  }, [lifetimeVibes, unlockedEvolutionMax, pushToast]);

  // --- Check Achievements ---
  useEffect(() => {
    const newlyUnlocked = [];
    for (const ach of ACHIEVEMENTS) {
      if (unlockedAchievements.includes(ach.id)) continue;
      let currentVal = 0;
      if (ach.conditionType === 'clicks') currentVal = totalClicks;
      else if (ach.conditionType === 'lifetimeVibes') currentVal = lifetimeVibes;
      else if (ach.conditionType === 'totalHelpers') currentVal = stats.totalHelpersOwned;
      else if (ach.conditionType === 'frenzyCount') currentVal = frenzyCount;
      else if (ach.conditionType === 'goldenCatches') currentVal = goldenCatches;
      else if (ach.conditionType === 'ascensions') currentVal = ascensionCount;

      if (currentVal >= ach.threshold) {
        newlyUnlocked.push(ach);
      }
    }

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...newlyUnlocked.map((a) => a.id)]);
      soundEngine.playMilestone();
      newlyUnlocked.forEach((ach) => {
        pushToast(
          `BADGE UNLOCKED: ${ach.name}`,
          `${ach.desc} (+2% Global Vibes!)`,
          ach.icon || 'badge',
          'from-emerald-400 to-teal-500'
        );
      });
    }
  }, [
    totalClicks,
    lifetimeVibes,
    stats.totalHelpersOwned,
    frenzyCount,
    goldenCatches,
    ascensionCount,
    unlockedAchievements,
    pushToast,
  ]);

  // --- Spawn Floating Cartoon Bubble Numbers & Splash Particles Matching Image Reference ---
  const spawnFloatingText = useCallback(
    (x, y, text, isCrit = false, isGolden = false) => {
      const id = Date.now() + Math.random();
      const jitterX = (Math.random() - 0.5) * 44;
      const jitterY = (Math.random() - 0.5) * 18;
      const rotation = (Math.random() - 0.5) * 14;
      const isFrenzy = frenzyRemaining > 0;

      setFloatingTexts((prev) => [
        ...prev.slice(-18),
        {
          id,
          x: x + jitterX,
          y: y + jitterY,
          text,
          isCrit,
          isGolden,
          isFrenzy,
          rotation,
        },
      ]);

      // Spawn 4-6 splash micro-bubble burst particles around the click!
      const burstCount = isCrit ? 6 : 4;
      const newParticles = [];
      const particleBg = isGolden
        ? 'bg-amber-300'
        : isCrit
        ? 'bg-rose-400'
        : isFrenzy
        ? 'bg-cyan-300'
        : 'bg-pink-400';

      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 24 + Math.random() * 32;
        newParticles.push({
          id: id + i + 1,
          x,
          y,
          vx: Math.cos(angle) * dist,
          vy: Math.sin(angle) * dist,
          size: 6 + Math.random() * 6,
          color: particleBg,
        });
      }

      setSplashParticles((prev) => [...prev.slice(-24), ...newParticles]);

      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
      }, 950);

      setTimeout(() => {
        setSplashParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
      }, 650);
    },
    [frenzyRemaining]
  );

  // --- Handle Clicking the 3D Chilled Llama (or pressing Spacebar) ---
  const handleMascotClick = useCallback(
    (clientX, clientY) => {
      const isCrit = Math.random() < stats.critChance;
      const gain = isCrit ? stats.totalCpc * stats.critMult : stats.totalCpc;

      setVibes((v) => v + gain);
      setLifetimeVibes((lv) => lv + gain);
      setTotalClicks((c) => c + 1);

      soundEngine.playClick(isCrit, stats.isFrenzy);

      // Update live facial expression mood badge
      if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
      setTransientMood(isCrit ? 'crit' : 'happy');
      moodTimeoutRef.current = setTimeout(() => {
        setTransientMood(null);
      }, isCrit ? 900 : 550);

      if (isCrit && screenShakeEnabled) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 220);
      }

      if (Math.random() < 0.22 || isCrit) {
        const randomQuote = CAPY_QUOTES[Math.floor(Math.random() * CAPY_QUOTES.length)];
        setCapyQuote(isCrit ? `CRIT SPLASH! ${randomQuote}` : randomQuote);
      }

      if (frenzyRemaining <= 0) {
        setFeverPct((prev) => {
          const next = Math.min(100, prev + (isCrit ? 14 : 9));
          if (next >= 100) {
            setFrenzyRemaining(9.0);
            setFrenzyCount((fc) => fc + 1);
            soundEngine.playFrenzyStart();
            pushToast(
              'POOL PARTY FRENZY!',
              `${stats.frenzyMult.toFixed(1)}x ALL VIBES & TIDAL SPLASH FOR 9s!`,
              'flame',
              'from-fuchsia-500 via-rose-500 to-amber-400'
            );
          }
          return next;
        });
      }

      const label = isCrit ? `CRIT +${formatNumber(gain)}!` : `+${formatNumber(gain)}`;
      spawnFloatingText(clientX, clientY, label, isCrit, false);
    },
    [
      stats.critChance,
      stats.totalCpc,
      stats.critMult,
      stats.isFrenzy,
      stats.frenzyMult,
      screenShakeEnabled,
      frenzyRemaining,
      pushToast,
      spawnFloatingText,
    ]
  );

  // --- Main 20Hz Game Tick (CPS accumulation, Fever decay, Buff & Skill timers, Splashstorm) ---
  const clickStormTickRef = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const dt = 0.05; // 50ms tick
      if (stats.totalCps > 0) {
        const gain = stats.totalCps * dt;
        setVibes((v) => v + gain);
        setLifetimeVibes((lv) => lv + gain);
      }

      // Decay fever bar if not in frenzy
      setFrenzyRemaining((rem) => {
        if (rem > 0) {
          const next = Math.max(0, rem - dt);
          if (next === 0) {
            setFeverPct(0);
          }
          return next;
        } else {
          setFeverPct((f) => Math.max(0, f - 11 * dt));
          return 0;
        }
      });

      // Tick down Golden Llama buff
      setGoldenBuff((buff) => {
        if (!buff) return null;
        const nextRem = buff.remaining - dt;
        if (nextRem <= 0) return null;
        return { ...buff, remaining: nextRem };
      });

      // Tick down Active Skills & Cooldowns
      setSkillTimers((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          const entry = next[key];
          if (entry.activeRem > 0 || entry.cdRem > 0) {
            changed = true;
            next[key] = {
              activeRem: Math.max(0, entry.activeRem - dt),
              cdRem: Math.max(0, entry.cdRem - dt),
            };
          }
        }
        return changed ? next : prev;
      });

      // Splashstorm auto-booper (10 boops/sec when active)
      if ((skillTimers.auto_storm?.activeRem || 0) > 0) {
        clickStormTickRef.current += 1;
        if (clickStormTickRef.current % 2 === 0) {
          setExternalClickPulse(Date.now());
          const stageX = window.innerWidth * 0.75;
          const stageY = window.innerHeight * 0.52;
          handleMascotClick(stageX, stageY);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [stats.totalCps, skillTimers.auto_storm?.activeRem, handleMascotClick]);

  // --- Trigger an Active Skill from the Center Vertical Skill Bar ---
  const handleTriggerSkill = useCallback(
    (skill) => {
      const cur = skillTimers[skill.id] || { activeRem: 0, cdRem: 0 };
      if (cur.cdRem > 0 || cur.activeRem > 0) return;

      soundEngine.playMilestone();

      if (skill.id === 'instant_frenzy') {
        setFeverPct(100);
        setFrenzyRemaining(9.0);
        setFrenzyCount((fc) => fc + 1);
        soundEngine.playFrenzyStart();
      }

      setSkillTimers((prev) => ({
        ...prev,
        [skill.id]: {
          activeRem: skill.duration,
          cdRem: skill.cooldown,
        },
      }));

      pushToast(`${skill.name.toUpperCase()}!`, skill.desc, skill.icon);
    },
    [skillTimers, pushToast]
  );

  // --- Auto-Save Every 4 Seconds ---
  const stateSnapshotRef = useRef({});
  useEffect(() => {
    stateSnapshotRef.current = {
      vibes,
      lifetimeVibes,
      totalClicks,
      upgradeLevels,
      helperCounts,
      selectedEvolution,
      unlockedEvolutionMax,
      weatherId,
      unlockedAchievements,
      ascensionTokens,
      ascensionCount,
      frenzyCount,
      goldenCatches,
      lastCps: stats.totalCps,
      lastSavedAt: Date.now(),
    };
  });

  useEffect(() => {
    const saveTimer = setInterval(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateSnapshotRef.current));
      } catch (e) {
        // ignore quota errors
      }
    }, 4000);
    return () => clearInterval(saveTimer);
  }, []);

  // --- Periodic Golden Winged Piñata Llama Spawner ---
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      setGoldenSpawn((prev) => {
        if (prev.active) return prev;
        soundEngine.playGoldenSpawn();
        return { id: Date.now(), active: true };
      });

      setTimeout(() => {
        setGoldenSpawn((prev) => (prev.active ? { ...prev, active: false } : prev));
      }, 12000);
    }, 42000);

    return () => clearInterval(spawnTimer);
  }, []);

  // --- Rotate News Ticker ---
  const availableHeadlines = useMemo(() => {
    const filtered = NEWS_HEADLINES.filter((h) => lifetimeVibes >= (h.minVibes || 0));
    return filtered.length > 0 ? filtered : NEWS_HEADLINES.slice(0, 3);
  }, [lifetimeVibes]);

  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setNewsIndex((i) => (i + 1) % availableHeadlines.length);
    }, 6500);
    return () => clearInterval(tickerTimer);
  }, [availableHeadlines.length]);

  // --- Spacebar & Number Keys (1-6) Shortcut ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || rebirthModalOpen || offlineEarnings) return;

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setExternalClickPulse(Date.now());
        const stageCenterX = window.innerWidth * 0.74;
        const stageCenterY = window.innerHeight * 0.52;
        handleMascotClick(stageCenterX, stageCenterY);
      } else if (e.key >= '1' && e.key <= '6') {
        const idx = parseInt(e.key, 10) - 1;
        if (ACTIVE_SKILLS[idx]) {
          handleTriggerSkill(ACTIVE_SKILLS[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMascotClick, handleTriggerSkill, rebirthModalOpen, offlineEarnings]);

  // --- Handle Catching the 3D Flying Golden Piñata Llama ---
  const handleGoldenClick = useCallback(
    (clientX, clientY) => {
      setGoldenSpawn({ id: 0, active: false });
      setGoldenCatches((gc) => gc + 1);
      soundEngine.playGoldenCatch();

      confetti({
        particleCount: 95,
        spread: 80,
        origin: {
          x: Math.min(0.9, Math.max(0.1, clientX / window.innerWidth)),
          y: Math.min(0.9, Math.max(0.1, clientY / window.innerHeight)),
        },
      });

      const roll = Math.random();
      if (roll < 0.4) {
        const jackpot = Math.max(250, stats.totalCps * 22 + stats.totalCpc * 35);
        setVibes((v) => v + jackpot);
        setLifetimeVibes((lv) => lv + jackpot);
        spawnFloatingText(clientX, clientY, `GOLDEN JACKPOT +${formatNumber(jackpot)}!`, true, true);
        pushToast(
          'GOLDEN PIÑATA LLAMA JACKPOT!',
          `Instant +${formatNumber(jackpot)} Vibes!`,
          'coin',
          'from-yellow-300 via-amber-400 to-orange-500'
        );
      } else if (roll < 0.72) {
        setGoldenBuff({
          type: 'click_7x',
          label: '7x SPLASH POWER',
          mult: 7,
          remaining: 12,
        });
        spawnFloatingText(clientX, clientY, `7x SPLASH POWER (12s)!`, true, true);
      } else {
        setGoldenBuff({
          type: 'cps_3x',
          label: '3x LAGOON STREAM',
          mult: 3,
          remaining: 18,
        });
        spawnFloatingText(clientX, clientY, `3x CPS OVERDRIVE (18s)!`, true, true);
      }
    },
    [stats.totalCps, stats.totalCpc, spawnFloatingText, pushToast]
  );

  // --- Buy Click Upgrade ---
  const handleBuyUpgrade = useCallback(
    (upgradeId) => {
      const upg = CLICK_UPGRADES.find((u) => u.id === upgradeId);
      if (!upg) return;
      const currentLevel = upgradeLevels[upgradeId] || 0;
      if (upg.maxLevel && currentLevel >= upg.maxLevel) return;

      const cost = Math.ceil(upg.baseCost * Math.pow(upg.costMult, currentLevel));
      if (vibes < cost) return;

      setVibes((v) => v - cost);
      setUpgradeLevels((prev) => ({
        ...prev,
        [upgradeId]: currentLevel + 1,
      }));
      soundEngine.playBuy();
    },
    [upgradeLevels, vibes]
  );

  // --- Buy Automated Helper ---
  const handleBuyHelper = useCallback(
    (helperId, quantityArg, totalCostArg) => {
      const helper = HELPERS.find((h) => h.id === helperId);
      if (!helper) return;
      const currentCount = helperCounts[helperId] || 0;

      const { quantity, totalCost, canAfford } =
        typeof quantityArg === 'number' && typeof totalCostArg === 'number'
          ? { quantity: quantityArg, totalCost: totalCostArg, canAfford: vibes >= totalCostArg }
          : calculateBulkHelperPurchase(helper.baseCost, currentCount, buyMode, vibes);

      if (!canAfford || quantity <= 0) return;

      const newCount = currentCount + quantity;
      setVibes((v) => v - totalCost);
      setHelperCounts((prev) => ({
        ...prev,
        [helperId]: newCount,
      }));

      const crossedMilestone = MILESTONE_THRESHOLDS.find(
        (t) => currentCount < t && newCount >= t
      );

      if (crossedMilestone) {
        soundEngine.playMilestone();
        pushToast(
          `2x SPLASH SURGE: ${helper.name}!`,
          `Reached ${crossedMilestone} owned — CPS DOUBLED!`,
          helper.icon,
          'from-amber-400 to-orange-500'
        );
      } else {
        soundEngine.playBuy();
      }
    },
    [helperCounts, buyMode, vibes, pushToast]
  );

  // --- Perform Rebirth ---
  const handleConfirmRebirth = useCallback(() => {
    if (stats.pendingAscensionTokens <= 0) return;
    const claimed = stats.pendingAscensionTokens;
    if (soundEngine.playRebirth) {
      soundEngine.playRebirth();
    } else {
      soundEngine.playAscend();
    }
    confetti({
      particleCount: 140,
      spread: 110,
      origin: { x: 0.5, y: 0.45 },
    });

    setAscensionTokens((t) => t + claimed);
    setAscensionCount((c) => c + 1);
    setVibes(0);
    setUpgradeLevels({});
    setHelperCounts({});
    setFeverPct(0);
    setFrenzyRemaining(0);
    setRebirthModalOpen(false);

    pushToast(
      `REBIRTHED (+${claimed} GOLDEN CITRUS)!`,
      `Permanent +${(ascensionTokens + claimed) * 25}% Global Vibes!`,
      'yuzu',
      'from-amber-300 via-yellow-400 to-orange-500'
    );
  }, [stats.pendingAscensionTokens, ascensionTokens, pushToast]);

  // --- Toggle Mute ---
  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  // --- Current & Next Evolution Metadata ---
  const currentEvoObj = EVOLUTIONS[selectedEvolution] || EVOLUTIONS[0];
  const nextEvoObj = EVOLUTIONS[unlockedEvolutionMax + 1] || null;
  const prevEvoThreshold = EVOLUTIONS[unlockedEvolutionMax]?.minVibes || 0;
  const nextEvoPct = nextEvoObj
    ? Math.min(
        100,
        Math.max(
          0,
          ((lifetimeVibes - prevEvoThreshold) / (nextEvoObj.minVibes - prevEvoThreshold)) * 100
        )
      )
    : 100;

  // Visible 5-slot carousel window around `selectedEvolution` (like 100..120 in Clicker Heroes!)
  const carouselStart = Math.max(0, Math.min(EVOLUTIONS.length - 5, selectedEvolution - 2));
  const visibleEvos = EVOLUTIONS.slice(carouselStart, carouselStart + 5).map((evo, idx) => ({
    ...evo,
    evoIndex: carouselStart + idx,
  }));

  return (
    <div
      className={`h-dvh w-dvw overflow-hidden relative select-none flex flex-col lg:flex-row bg-gradient-to-b from-[#0284c7] via-[#38bdf8] to-[#bae6fd] ${
        isShaking ? 'shake-active' : ''
      }`}
    >
      {/* ==================== FULL-SCREEN ATMOSPHERIC SKY & DRIFTING CLOUDS BACKDROP (Spans 100dvw) ==================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {/* Warm Tropical Sunburst & Sunbeams across the Sky */}
        <div
          className={`absolute right-[-8%] -top-28 w-[980px] h-[980px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(254,240,138,0.48)_34%,rgba(56,189,248,0.18)_66%,transparent_76%)] ${
            stats.isFrenzy ? 'animate-pulse scale-110' : ''
          }`}
        />
        <div className="absolute left-[18%] -top-24 w-[680px] h-[680px] rounded-full bg-[radial-gradient(circle,rgba(224,242,254,0.42)_0%,rgba(125,211,252,0.22)_50%,transparent_72%)]" />

        {/* Diagonal Sunbeams across Both Sides of the Sky */}
        <div className="absolute left-[15%] -top-16 w-44 h-[120%] rotate-[22deg] bg-gradient-to-b from-white/20 via-yellow-100/10 to-transparent blur-xl" />
        <div className="absolute right-[8%] -top-16 w-48 h-[120%] rotate-[24deg] bg-gradient-to-b from-white/25 via-yellow-200/10 to-transparent blur-xl" />
        <div className="absolute right-[28%] -top-16 w-36 h-[120%] rotate-[24deg] bg-gradient-to-b from-white/20 via-yellow-100/10 to-transparent blur-xl" />

        {/* Full-Screen Slowly Moving Cumulus Sky Clouds (Drifting from left edge across the whole screen) */}
        {FULL_SCREEN_CLOUDS.map((cloud, idx) => (
          <div
            key={idx}
            style={{
              top: cloud.top,
              width: `${cloud.width}px`,
              opacity: cloud.opacity,
              animationDuration: cloud.dur,
              animationDelay: cloud.delay,
            }}
            className="absolute left-0 animate-cloud-drift pointer-events-none"
          >
            <svg viewBox="0 0 260 110" fill="none" className="w-full h-auto drop-shadow-[0_10px_16px_rgba(2,132,199,0.22)]">
              <path
                d="M46 92 H214 C236 92 250 78 248 58 C246 41 232 30 214 31 C206 14 188 4 166 6 C147 8 131 19 124 35 C115 27 101 24 88 28 C71 33 60 47 59 63 C40 63 26 75 28 86 C29 90 36 92 46 92 Z"
                fill="white"
              />
              <path
                d="M52 92 H210 C226 92 238 83 240 71 C215 78 118 80 42 74 C36 82 41 92 52 92 Z"
                fill="#e0f2fe"
              />
            </svg>
          </div>
        ))}

        {/* Shimmering Caustic Lagoon Water Reflections Along Bottom Half */}
        <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-[#0284c7]/45 via-[#22d3ee]/25 to-transparent" />
        <div className="absolute right-[-6%] bottom-[-6%] w-[62%] h-[36%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(103,232,249,0.55)_0%,rgba(14,165,233,0.25)_55%,transparent_75%)] blur-2xl animate-pulse" />

        {/* Floating Iridescent Soap / Pool Bubbles across the Viewport */}
        {POOL_BUBBLES.map((b, idx) => (
          <div
            key={idx}
            style={{
              left: b.left,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDelay: b.delay,
              animationDuration: b.dur,
            }}
            className="absolute bottom-8 rounded-full bg-gradient-to-tr from-cyan-200/30 via-white/50 to-pink-200/40 border border-white/70 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] animate-float-bob"
          />
        ))}
      </div>

      {/* ==================== FULL-VIEWPORT UNCLIPPED 3D THREE.JS WORLD (100dvw x 100dvh) ==================== */}
      {/* Mounted across the entire screen so 3D clouds, flying objects, splash waves, and droplets span everywhere unclipped! */}
      <div className="fixed inset-0 z-[5]">
        <ThreeStage
          evolutionIndex={selectedEvolution}
          helperCounts={helperCounts}
          weatherId={weatherId}
          isFrenzy={stats.isFrenzy}
          goldenSpawn={goldenSpawn}
          screenShakeEnabled={screenShakeEnabled}
          externalClickPulse={externalClickPulse}
          onMascotClick={handleMascotClick}
          onGoldenClick={handleGoldenClick}
        />
      </div>

      {/* ==================== LEFT COLUMN (46% WIDTH): SUNLIT TROPICAL GOLD SCORE PLAQUE + CABANA SHOP PANEL ==================== */}
      <section className="relative z-10 w-full lg:w-[46%] h-[54dvh] lg:h-full flex flex-col p-2 sm:p-3 gap-2 shrink-0 pointer-events-none">
        {/* TOP-LEFT SUNLIT TROPICAL GOLD & POOL-FLOAT SCORE BANNER */}
        <div className="pointer-events-auto relative mx-auto w-full max-w-[560px] shrink-0">
          {/* Decorative Left & Right Coral/Gold Pool-Float Ears */}
          <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-10 rounded-l-full bg-gradient-to-b from-[#fb7185] via-[#f43f5e] to-[#be123c] border-2 border-[#fde047] shadow-md" />
          <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 rounded-r-full bg-gradient-to-b from-[#fb7185] via-[#f43f5e] to-[#be123c] border-2 border-[#fde047] shadow-md" />

          {/* Outer Beveled Sunlit Tropical Gold Frame */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#d97706] p-1.5 border-[3px] border-[#78350f] shadow-[0_5px_0_#78350f,0_8px_18px_rgba(8,47,73,0.45)]">
            {/* Inner Sunlit Gold & Aqua-Trimmed Plaque */}
            <div className="rounded-xl bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#b45309] border-2 border-[#fef08a] shadow-[inset_0_3px_6px_rgba(0,0,0,0.28)] py-2 px-5 flex items-center justify-center gap-3.5 relative overflow-hidden">
              {/* Glossy Water-Droplet Specular Highlights */}
              <div className="pointer-events-none absolute inset-x-3 top-0.5 h-2.5 rounded-full bg-white/35" />

              {/* Custom Vector Golden Yuzu Emblem */}
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-b from-[#fef08a] via-[#facc15] to-[#ea580c] border-[3px] border-white shadow-[0_3px_0_#78350f,inset_0_2px_4px_#fff] flex items-center justify-center shrink-0">
                <GameIcon name="yuzu" size={36} />
              </div>

              {/* Bold Black-Outlined White Score Counter (Fluid clamp typography) */}
              <span className="font-display font-black text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] tracking-tight text-white font-mono-num leading-none [text-shadow:0_3px_0_#2e1805,0_-1.5px_0_#2e1805,2px_0_0_#2e1805,-2px_0_0_#2e1805,0_5px_10px_rgba(0,0,0,0.45)]">
                {formatNumber(vibes)}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN LEFT SHOP PANEL (Folder Tabs + Sunlit Cabana Wood Frame + Tropical Pool-Stone Cards) */}
        <div className="pointer-events-auto flex-1 min-h-0 w-full max-w-[560px] mx-auto overflow-hidden">
          <ShopPanel
            vibes={vibes}
            lifetimeVibes={lifetimeVibes}
            cps={stats.totalCps}
            cpc={stats.totalCpc}
            upgradeLevels={upgradeLevels}
            helperCounts={helperCounts}
            selectedEvolution={selectedEvolution}
            unlockedEvolutionMax={unlockedEvolutionMax}
            weatherId={weatherId}
            unlockedAchievements={unlockedAchievements}
            ascensionTokens={ascensionTokens}
            pendingAscensionTokens={stats.pendingAscensionTokens}
            buyMode={buyMode}
            onSetBuyMode={setBuyMode}
            onBuyUpgrade={handleBuyUpgrade}
            onBuyHelper={handleBuyHelper}
            onSelectEvolution={setSelectedEvolution}
            onSelectWeather={setWeatherId}
            onOpenRebirthModal={() => setRebirthModalOpen(true)}
            onOpenAscendModal={() => setRebirthModalOpen(true)}
          />
        </div>
      </section>

      {/* ==================== CENTER VERTICAL ACTIVE SKILL COLUMN (Enlarged Buttons, Icons & Hotkey Badges!) ==================== */}
      <aside className="hidden lg:flex flex-col items-center justify-center z-20 py-4 px-1.5 shrink-0 pointer-events-none">
        <div className="pointer-events-auto relative flex flex-col items-center gap-2.5 py-5 px-2.5 rounded-full bg-gradient-to-b from-[#0ea5e9]/65 via-[#0284c7]/65 to-[#0ea5e9]/65 border-[3px] border-[#fde047] shadow-[inset_0_2px_6px_rgba(255,255,255,0.55),0_8px_18px_rgba(8,47,73,0.45)] backdrop-blur-xs">
          {/* Top Golden Bamboo Cap */}
          <div className="w-10 h-4 rounded-t-full bg-gradient-to-b from-[#fde047] to-[#d97706] border-2 border-[#78350f] -mt-6 mb-0.5 shadow" />

          {ACTIVE_SKILLS.map((skill, idx) => {
            const st = skillTimers[skill.id] || { activeRem: 0, cdRem: 0 };
            const isActive = st.activeRem > 0;
            const onCooldown = !isActive && st.cdRem > 0;

            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleTriggerSkill(skill)}
                title={`${skill.name} (Key ${idx + 1}): ${skill.desc}`}
                className={`group relative w-15 h-15 xl:w-16 xl:h-16 rounded-2xl border-[3px] transition-transform active:scale-95 flex items-center justify-center shadow-[0_4px_0_#082f49,0_6px_12px_rgba(0,0,0,0.4)] cursor-pointer overflow-hidden ${
                  isActive
                    ? 'border-[#fde047] ring-3 ring-[#22d3ee] scale-105 animate-pulse'
                    : onCooldown
                    ? 'border-[#475569] opacity-85 cursor-not-allowed'
                    : 'border-[#fef08a] hover:scale-105 hover:border-white'
                } bg-gradient-to-br ${skill.bg}`}
              >
                {/* Glossy Top Water-Bubble Bevel */}
                <div className="pointer-events-none absolute inset-x-1.5 top-0.5 h-3.5 rounded-t-xl bg-white/35" />

                <GameIcon
                  name={skill.icon}
                  size={44}
                  className="drop-shadow-[0_3px_3px_rgba(0,0,0,0.65)] transition-transform group-hover:scale-110"
                />

                {/* Bold High-Contrast Hotkey Badge (1..6) */}
                <span className="absolute top-1 left-1 min-w-5 h-5 px-1 rounded-md bg-[#082f49]/90 border border-[#fde047] text-xs font-mono-num font-black text-[#fef08a] flex items-center justify-center leading-none shadow">
                  {idx + 1}
                </span>

                {/* Active or Cooldown Countdown Overlay */}
                {(isActive || onCooldown) && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center font-mono-num font-black text-sm sm:text-base [text-shadow:0_2px_2px_#000] ${
                      isActive ? 'bg-emerald-500/40 text-[#fef08a]' : 'bg-slate-950/70 text-white'
                    }`}
                  >
                    {isActive ? `${Math.ceil(st.activeRem)}s` : `${Math.ceil(st.cdRem)}s`}
                  </div>
                )}
              </button>
            );
          })}

          {/* Bottom Golden Bamboo Cap */}
          <div className="w-10 h-4 rounded-b-full bg-gradient-to-t from-[#fde047] to-[#d97706] border-2 border-[#78350f] -mb-6 mt-0.5 shadow" />
        </div>
      </aside>

      {/* ==================== RIGHT COLUMN: ENLARGED STAGE CAROUSEL + HUD OVER FULL-SCREEN 3D RESORT ISLAND ==================== */}
      <main className="pointer-events-none relative flex-1 h-[46dvh] lg:h-full flex flex-col justify-between overflow-visible z-10">
        {/* ---------- TOP-CENTER ENLARGED STAGE CAROUSEL + STATUS STRIP ---------- */}
        <div className="relative z-10 pt-2 sm:pt-3 px-3 flex flex-col items-center pointer-events-none">
          {/* Ornate Sunlit Gold Stage Selector Frame (Enlarged Cards, Icons & Text!) */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#d97706] px-3.5 py-2 rounded-3xl border-[3px] border-[#78350f] shadow-[0_4px_0_#78350f,0_8px_18px_rgba(8,47,73,0.4)]">
            {/* Prev Evolution Arrow (44px touch target) */}
            <button
              type="button"
              disabled={selectedEvolution <= 0}
              onClick={() => setSelectedEvolution((s) => Math.max(0, s - 1))}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[2.5px] border-[#78350f] flex items-center justify-center shadow-md transition cursor-pointer ${
                selectedEvolution > 0
                  ? 'bg-gradient-to-b from-white to-[#fde047] text-[#78350f] hover:brightness-110 active:scale-95'
                  : 'bg-[#b45309] text-[#fde68a]/50 cursor-not-allowed'
              }`}
              title="Previous 3D Evolution Stage"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>

            {/* 5 Large, Roomy Isometric Pool Island Stage Cards */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-1">
              {visibleEvos.map((evo) => {
                const isSelected = evo.evoIndex === selectedEvolution;
                const isUnlocked = evo.evoIndex <= unlockedEvolutionMax;
                const stageNum = 100 + evo.evoIndex * 5;

                return (
                  <button
                    key={evo.id}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && setSelectedEvolution(evo.evoIndex)}
                    title={
                      isUnlocked
                        ? `${evo.name} (${evo.bonusText})`
                        : `Locked: Requires ${formatNumber(evo.minVibes)} Lifetime Vibes`
                    }
                    className={`relative w-15 h-17 sm:w-18 sm:h-20 rounded-2xl border-[2.5px] flex flex-col items-center justify-between py-1.5 px-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#22d3ee] to-[#0284c7] border-white scale-105 shadow-[0_0_12px_rgba(254,240,138,0.95)]'
                        : isUnlocked
                        ? 'bg-gradient-to-b from-[#38bdf8] to-[#0369a1] border-[#0c4a6e] hover:brightness-110'
                        : 'bg-gradient-to-b from-[#475569] to-[#1e293b] border-[#0f172a] opacity-75 cursor-not-allowed'
                    }`}
                  >
                    {/* Downward White Arrow Indicator Above Active Stage */}
                    {isSelected && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white drop-shadow-[0_2px_1px_#000] text-xs font-black animate-bounce">
                        ▼
                      </div>
                    )}

                    {/* Enlarged Stage Icon + Mini Island Plinth */}
                    <div className="flex flex-col items-center justify-center pt-0.5">
                      <GameIcon name={evo.icon || 'palm'} size={34} />
                      <div
                        className={`w-8 h-2 rotate-3 rounded-full border border-[#082f49]/70 -mt-1 shadow-2xs ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-[#fde047] to-[#22d3ee]'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>

                    {/* Bold Stage Number or Lock Icon at Bottom */}
                    <span className="font-display font-black text-xs sm:text-sm leading-none text-[#fef08a] [text-shadow:0_1.5px_0_#000] flex items-center justify-center">
                      {isUnlocked ? stageNum : <GameIcon name="lock" size={18} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Evolution Arrow (44px touch target) */}
            <button
              type="button"
              disabled={selectedEvolution >= unlockedEvolutionMax}
              onClick={() =>
                setSelectedEvolution((s) => Math.min(unlockedEvolutionMax, s + 1))
              }
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[2.5px] border-[#78350f] flex items-center justify-center shadow-md transition cursor-pointer ${
                selectedEvolution < unlockedEvolutionMax
                  ? 'bg-gradient-to-b from-white to-[#fde047] text-[#78350f] hover:brightness-110 active:scale-95'
                  : 'bg-[#b45309] text-[#fde68a]/50 cursor-not-allowed'
              }`}
              title="Next Unlocked 3D Evolution Stage"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* ENLARGED TOP STATUS STRIP: Stage Name + Fever/Frenzy Timer + Live Llama Mood Badge */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 max-w-xl">
            {/* Stage Name Badge */}
            <div className="px-3.5 py-1 rounded-full bg-[#0c4a6e]/90 border-2 border-[#fde047] shadow-md flex items-center gap-2">
              <GameIcon name="palm" size={22} />
              <span className="font-display font-black text-sm sm:text-base tracking-wide text-white [text-shadow:0_1.5px_0_#000]">
                {WEATHERS.find((w) => w.id === weatherId)?.name.split(' ')[0] || 'Lagoon'} Lvl{' '}
                {100 + selectedEvolution * 5 + stats.stageLevel}
              </span>
            </div>

            {/* Fever / Frenzy Timer Pill */}
            <div className="px-3.5 py-1 rounded-full bg-gradient-to-b from-[#082f49]/90 to-[#0f172a]/90 border-2 border-[#38bdf8] shadow-md flex items-center gap-2">
              <GameIcon name="clock" size={22} />
              <span className="font-display font-black text-sm sm:text-base text-[#fde047] font-mono-num [text-shadow:0_1.5px_0_#000]">
                {stats.isFrenzy
                  ? `${frenzyRemaining.toFixed(1)}s FRENZY (${stats.frenzyMult.toFixed(1)}x!)`
                  : goldenBuff
                  ? `${goldenBuff.remaining.toFixed(1)}s (${goldenBuff.label})`
                  : `Fever ${Math.round(feverPct)}%`}
              </span>
            </div>

            {/* Live Llama Expression Mood Badge */}
            <div
              className={`px-3.5 py-1 rounded-full bg-gradient-to-r ${expressionBadge.bg} border-2 ${expressionBadge.border} shadow-md flex items-center gap-2 transition-all duration-200`}
            >
              <GameIcon name={expressionBadge.icon} size={22} />
              <span className="font-display font-black text-sm sm:text-base text-white [text-shadow:0_1.5px_0_#000]">
                {expressionBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* ---------- DOCKED UPPER-LEFT SPEECH BUBBLE (Enlarged text & Llama icon) ---------- */}
        <div className="pointer-events-none absolute left-3 top-32 sm:top-36 z-20 max-w-[230px] sm:max-w-[270px]">
          <div className="px-3.5 py-2 rounded-2xl rounded-br-xs bg-white/95 text-[#082f49] font-display font-black text-xs sm:text-sm shadow-[0_4px_0_#0284c7,0_6px_12px_rgba(0,0,0,0.25)] border-2 border-[#0284c7] leading-snug flex items-center gap-2">
            <GameIcon name="llama" size={28} className="shrink-0" />
            <span>“{capyQuote}”</span>
          </div>
        </div>

        {/* ---------- FAR-RIGHT VERTICAL ROUND CABANA GOLD UTILITY BUTTONS (Enlarged to 48px) ---------- */}
        <div className="pointer-events-auto absolute right-3 top-3 z-20 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleToggleMute}
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="w-12 h-12 rounded-full bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#b45309] border-[2.5px] border-[#78350f] shadow-[0_3px_0_#78350f] flex items-center justify-center text-[#451a03] hover:brightness-110 transition cursor-pointer"
          >
            {muted ? <VolumeX className="w-6 h-6 stroke-[2.5]" /> : <Volume2 className="w-6 h-6 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={() => setScreenShakeEnabled((s) => !s)}
            title={`Splash Screen Shake: ${screenShakeEnabled ? 'ON' : 'OFF'}`}
            className={`w-12 h-12 rounded-full border-[2.5px] border-[#78350f] shadow-[0_3px_0_#78350f] flex items-center justify-center transition cursor-pointer ${
              screenShakeEnabled
                ? 'bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#b45309] text-[#451a03]'
                : 'bg-gradient-to-b from-[#94a3b8] to-[#475569] text-slate-900'
            }`}
          >
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => {
              const currentIdx = WEATHERS.findIndex((w) => w.id === weatherId);
              const unlockedWeathers = WEATHERS.filter((w) => lifetimeVibes >= w.unlockVibes);
              const nextWeather =
                unlockedWeathers[(currentIdx + 1) % unlockedWeathers.length] || WEATHERS[0];
              setWeatherId(nextWeather.id);
              pushToast(
                `WEATHER: ${nextWeather.name}`,
                nextWeather.bonusText,
                nextWeather.icon
              );
            }}
            title="Cycle Unlocked 3D Waterpark Weather Realm"
            className="w-12 h-12 rounded-full bg-gradient-to-b from-[#22d3ee] via-[#0ea5e9] to-[#0284c7] border-[2.5px] border-[#fde047] shadow-[0_3px_0_#0c4a6e] flex items-center justify-center hover:brightness-110 transition cursor-pointer"
          >
            <GameIcon
              name={WEATHERS.find((w) => w.id === weatherId)?.icon || 'sunny_onsen'}
              size={28}
            />
          </button>

          <button
            type="button"
            onClick={() => setRebirthModalOpen(true)}
            title="Open Alanya Lagoon Rebirth"
            className="w-12 h-12 rounded-full bg-gradient-to-b from-[#fb7185] via-[#f43f5e] to-[#be123c] border-[2.5px] border-[#fde047] shadow-[0_3px_0_#881337] flex items-center justify-center hover:brightness-110 transition cursor-pointer"
          >
            <GameIcon name="tab_rebirth" size={28} />
          </button>
        </div>

        {/* ---------- BOTTOM-RIGHT BEACH MYSTERY GIFT BOX ---------- */}
        <div className="pointer-events-auto absolute right-3 bottom-3 z-20 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={(e) => {
              if (goldenSpawn.active) {
                handleGoldenClick(e.clientX, e.clientY);
              } else {
                soundEngine.playGoldenSpawn();
                setGoldenSpawn({ id: Date.now(), active: true });
                pushToast(
                  'GOLDEN PIÑATA LLAMA SUMMONED!',
                  'Click the flying golden Llama in the 3D pool sky!',
                  'gift'
                );
              }
            }}
            title="Summon / Claim Golden Flying Piñata Llama!"
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-rose-700 border-[3px] border-white shadow-[0_4px_0_#881337,0_6px_14px_rgba(0,0,0,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer animate-float-bob"
          >
            <GameIcon name="gift" size={40} />
            <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-[#fde047] border-2 border-[#451a03] text-[#451a03] font-display font-black text-xs flex items-center justify-center shadow">
              !
            </span>
          </button>
        </div>

        {/* ---------- BOTTOM-CENTER PET NAME, EVOLUTION PROGRESS BAR & GLOSSY SPLASH BOOP BUTTON ---------- */}
        <div className="relative z-10 pb-3 px-4 flex flex-col items-center pointer-events-none">
          {/* Bold Outlined White Character Title */}
          <p className="font-display font-black text-[clamp(1.15rem,0.9rem+0.9vw,1.5rem)] text-white tracking-wide text-center [text-shadow:0_2px_0_#082f49,0_-1.5px_0_#082f49,2px_0_0_#082f49,-2px_0_0_#082f49,0_4px_8px_rgba(0,0,0,0.5)]">
            {currentEvoObj.name} — {currentEvoObj.bonusText}
          </p>

          {/* Bold Coral-Red Outlined XP Readout */}
          <p className="font-display font-black text-[clamp(1.25rem,1rem+1.1vw,1.75rem)] text-[#fb7185] font-mono-num tracking-tight [text-shadow:0_2px_0_#082f49,0_-1.5px_0_#082f49,2px_0_0_#082f49,-2px_0_0_#082f49]">
            {nextEvoObj
              ? `${formatNumber(lifetimeVibes)} / ${formatNumber(nextEvoObj.minVibes)} XP`
              : `${formatNumber(lifetimeVibes)} MAX VIBES`}
          </p>

          {/* Ornate Gold-Winged Tropical Green Progress Bar with Yuzu Emblem Below Center */}
          <div className="relative w-full max-w-[350px] mt-1.5 flex items-center justify-center">
            {/* Left Ornate Gold Wing Tip */}
            <div className="w-6 h-6 rotate-45 rounded-xs bg-gradient-to-br from-[#fef08a] to-[#d97706] border-2 border-[#78350f] -mr-3 z-10 shadow" />

            {/* Bar Track */}
            <div className="flex-1 h-6 rounded-full bg-[#082f49] border-[3px] border-[#fde047] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_3px_0_#041e30] overflow-hidden p-0.5 relative">
              <div
                className="h-full rounded-full bg-gradient-to-b from-[#84cc16] via-[#22c55e] to-[#15803d] transition-all duration-200 shadow-[inset_0_2px_0_rgba(255,255,255,0.45)]"
                style={{ width: `${nextEvoObj ? nextEvoPct : 100}%` }}
              />
            </div>

            {/* Right Ornate Gold Wing Tip */}
            <div className="w-6 h-6 rotate-45 rounded-xs bg-gradient-to-br from-[#fef08a] to-[#d97706] border-2 border-[#78350f] -ml-3 z-10 shadow" />

            {/* Center Bottom Emblem */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-b from-[#fef08a] to-[#f59e0b] border-2 border-[#78350f] flex items-center justify-center shadow">
              <GameIcon name="yuzu" size={22} />
            </div>
          </div>

          {/* Glossy Bright-Green Pill Button with Crystal Gem ("Splash Boop!") */}
          <button
            type="button"
            onClick={(e) => {
              setExternalClickPulse(Date.now());
              handleMascotClick(
                e.clientX || window.innerWidth * 0.72,
                (e.clientY || window.innerHeight * 0.5) - 120
              );
            }}
            className="pointer-events-auto mt-3.5 px-7 py-2 rounded-2xl bg-gradient-to-b from-[#84cc16] via-[#22c55e] to-[#15803d] border-[3px] border-[#fde047] shadow-[inset_0_2px_0_rgba(255,255,255,0.6),0_4px_0_#14532d,0_6px_12px_rgba(0,0,0,0.35)] hover:brightness-110 active:translate-y-0.5 transition flex items-center gap-3 cursor-pointer"
          >
            <span className="font-display font-black text-lg sm:text-xl text-white tracking-wide [text-shadow:0_2px_0_#14532d,1.5px_0_0_#14532d,-1.5px_0_0_#14532d]">
              Splash Boop! (+{formatNumber(stats.totalCpc)})
            </span>
            <span className="w-8 h-8 rounded-full bg-gradient-to-b from-[#fb7185] to-[#be123c] border-2 border-white shadow-inner flex items-center justify-center">
              <GameIcon name="gem" size={20} />
            </span>
          </button>
        </div>

        {/* ---------- FLOATING CARTOON COMIC SPLASH NOTIFICATIONS (TOP RIGHT) ---------- */}
        <div className="pointer-events-none absolute top-20 right-4 sm:right-10 z-40 flex flex-col items-end gap-2 max-w-xs sm:max-w-md">
          {toasts.map((t) => (
            <ComicToast key={t.id} toast={t} />
          ))}
        </div>
      </main>

      {/* ==================== 2D FLOATING CARTOON BUBBLE NUMBERS & SPLASH PARTICLES OVERLAY ==================== */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {/* Water Splash Micro-Bubble Burst Particles */}
        {splashParticles.map((sp) => (
          <div
            key={sp.id}
            style={{
              left: sp.x,
              top: sp.y,
              '--burst-x': `${sp.vx}px`,
              '--burst-y': `${sp.vy}px`,
            }}
            className="fixed rounded-full animate-splash-burst pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            <div
              style={{ width: `${sp.size}px`, height: `${sp.size}px` }}
              className={`rounded-full ${sp.color} border border-white/80 shadow-md opacity-90`}
            />
          </div>
        ))}

        {/* Floating Bubble Letters Numbers (Matching User Reference Image) */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            style={{ left: ft.x, top: ft.y }}
            className="fixed -translate-x-1/2 -translate-y-1/2 animate-bubble-pop will-change-transform"
          >
            <BubbleNumber
              text={ft.text}
              isCrit={ft.isCrit}
              isGolden={ft.isGolden}
              isFrenzy={ft.isFrenzy}
              rotation={ft.rotation || 0}
            />
          </div>
        ))}
      </div>

      {/* ==================== NATIVE <dialog closedby="any"> REBIRTH MODAL ==================== */}
      <dialog
        ref={rebirthDialogRef}
        {...{ closedby: 'any' }}
        aria-labelledby="rebirthDialogTitle"
        className="m-auto rounded-3xl bg-gradient-to-b from-[#0c4a6e] to-[#082f49] text-white border-[4px] border-[#fde047] shadow-2xl p-0 max-w-md w-[92vw] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 mx-auto flex items-center justify-center border-2 border-[#fde047] shadow-lg mb-4">
            <GameIcon name="tab_rebirth" size={42} />
          </div>
          <h2
            id="rebirthDialogTitle"
            className="text-2xl font-display font-black text-[#fde047] [text-shadow:0_2px_0_#000]"
          >
            Rebirth in the Alanya VIP Paradise?
          </h2>
          <p className="text-sm font-bold text-[#e0f2fe] mt-2 leading-relaxed">
            Rebirth resets your current Vibes, Click Upgrades, and Helpers in exchange for{' '}
            <strong className="text-[#fde047]">Permanent Golden Citrus</strong> (+25% Global Vibes
            each). You keep all unlocked 3D Llama Evolutions & Badges!
          </p>

          <div className="mt-4 p-4 rounded-2xl bg-[#041e30] border-2 border-[#38bdf8] flex items-center justify-around">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#bae6fd] font-bold">
                Current Bonus
              </p>
              <p className="text-xl font-mono-num font-black text-white">
                +{ascensionTokens * 25}%
              </p>
            </div>
            <div className="text-[#fde047] font-black text-2xl">→</div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#fde047] font-bold">
                New Permanent Bonus
              </p>
              <p className="text-2xl font-mono-num font-black text-emerald-400">
                +{(ascensionTokens + stats.pendingAscensionTokens) * 25}%
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRebirthModalOpen(false)}
              className="flex-1 py-3 rounded-xl bg-[#1e3a5f] hover:bg-[#1e40af] border-2 border-[#38bdf8] text-white font-black text-sm transition cursor-pointer"
            >
              Keep Splashing
            </button>
            <button
              type="button"
              disabled={stats.pendingAscensionTokens <= 0}
              onClick={handleConfirmRebirth}
              className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition cursor-pointer ${
                stats.pendingAscensionTokens > 0
                  ? 'bg-gradient-to-b from-[#22d3ee] to-[#0284c7] border-[#fde047] text-white shadow-lg hover:brightness-110'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Claim +{stats.pendingAscensionTokens} Golden Citrus
            </button>
          </div>
        </div>
      </dialog>

      {/* ==================== NATIVE <dialog closedby="any"> OFFLINE EARNINGS MODAL ==================== */}
      <dialog
        ref={offlineDialogRef}
        {...{ closedby: 'any' }}
        aria-labelledby="offlineDialogTitle"
        className="m-auto rounded-3xl bg-gradient-to-b from-[#0c4a6e] to-[#082f49] text-white border-[4px] border-[#fde047] shadow-2xl p-0 max-w-md w-[92vw] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {offlineEarnings && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mx-auto flex items-center justify-center border-2 border-white shadow-lg mb-4">
              <GameIcon name="palm" size={42} />
            </div>
            <h2
              id="offlineDialogTitle"
              className="text-2xl font-display font-black text-[#fde047] [text-shadow:0_2px_0_#000]"
            >
              Welcome Back to the Pool Party!
            </h2>
            <p className="text-sm font-bold text-[#e0f2fe] mt-2">
              While you were away for{' '}
              <strong className="text-white">{offlineEarnings.seconds}s</strong>, your pool helpers
              splashed up:
            </p>
            <p className="my-4 text-3xl font-display font-black font-mono-num text-[#fde047] [text-shadow:0_2px_0_#000]">
              +{formatNumber(offlineEarnings.amount)} VIBES
            </p>
            <button
              type="button"
              onClick={() => setOfflineEarnings(null)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-b from-[#84cc16] via-[#22c55e] to-[#15803d] border-2 border-[#fde047] text-white font-black text-base shadow-lg hover:brightness-110 transition cursor-pointer [text-shadow:0_1.5px_0_#000] flex items-center justify-center gap-2"
            >
              <span>Collect & Keep Splashing</span>
              <GameIcon name="yuzu" size={24} />
            </button>
          </div>
        )}
      </dialog>

      {/* ==================== "WELCOME TO ALANYA" SUMMER RESORT LOADING SCREEN ==================== */}
      {showAlanyaWelcome && (
        <AlanyaWelcomeScreen onComplete={() => setShowAlanyaWelcome(false)} />
      )}
    </div>
  );
}
