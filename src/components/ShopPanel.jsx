import React, { useState, useMemo } from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import GameIcon from './GameIcons.jsx';
import {
  CLICK_UPGRADES,
  HELPERS,
  EVOLUTIONS,
  WEATHERS,
  ACHIEVEMENTS,
  MILESTONE_THRESHOLDS,
  formatNumber,
  getRebirthThreshold,
} from '../data/gameData.js';

const HELPER_COST_GROWTH = 1.15;

/**
 * Calculates bulk purchase quantity and total cost for a helper.
 */
export function calculateBulkHelperPurchase(baseCost, currentCount, buyMode, currentVibes) {
  if (buyMode === 1) {
    const cost = Math.floor(baseCost * Math.pow(HELPER_COST_GROWTH, currentCount));
    return { quantity: 1, totalCost: cost, canAfford: currentVibes >= cost };
  }

  if (buyMode === 10) {
    let totalCost = 0;
    for (let i = 0; i < 10; i++) {
      totalCost += Math.floor(baseCost * Math.pow(HELPER_COST_GROWTH, currentCount + i));
    }
    return { quantity: 10, totalCost, canAfford: currentVibes >= totalCost };
  }

  // buyMode === 'MAX'
  let quantity = 0;
  let totalCost = 0;
  const firstUnitCost = Math.floor(baseCost * Math.pow(HELPER_COST_GROWTH, currentCount));

  if (currentVibes < firstUnitCost) {
    return { quantity: 1, totalCost: firstUnitCost, canAfford: false };
  }

  while (quantity < 1000) {
    const nextCost = Math.floor(baseCost * Math.pow(HELPER_COST_GROWTH, currentCount + quantity));
    if (totalCost + nextCost > currentVibes) break;
    totalCost += nextCost;
    quantity++;
  }

  return { quantity: Math.max(1, quantity), totalCost, canAfford: quantity > 0 };
}

/**
 * Returns milestone multiplier (2^k) and progress toward the next milestone threshold.
 */
function getMilestoneInfo(count) {
  let reachedCount = 0;
  let prevThreshold = 0;
  let nextThreshold = null;

  for (const threshold of MILESTONE_THRESHOLDS) {
    if (count >= threshold) {
      reachedCount++;
      prevThreshold = threshold;
    } else if (nextThreshold === null) {
      nextThreshold = threshold;
    }
  }

  const mult = Math.pow(2, reachedCount);
  const progressPct =
    nextThreshold !== null
      ? Math.min(100, Math.max(0, ((count - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
      : 100;

  return {
    mult,
    reachedCount,
    nextThreshold,
    prevThreshold,
    progressPct,
  };
}

/**
 * Reusable Vector Game Statue on a Mini Inflatable Pool Float Ring / Sunlit Coral Pedestal
 * Scaled up for clear visibility and zero cramped badges.
 */
function PedestalStatue({ icon, accentColor = '#fbbf24', badgeText = null, grayscale = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center shrink-0 w-20 sm:w-22 pt-1 select-none ${
        grayscale ? 'grayscale opacity-55' : ''
      }`}
    >
      {/* Floating Custom SVG Vector Game Icon */}
      <div
        className="relative z-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5"
        style={{
          filter: grayscale
            ? undefined
            : `drop-shadow(0 4px 3px rgba(0,0,0,0.75)) drop-shadow(0 0 8px ${accentColor}55)`,
        }}
      >
        <GameIcon name={icon} size={48} />
        {badgeText && (
          <span className="absolute -top-2 -right-2.5 px-2 py-0.5 rounded-full bg-gradient-to-b from-[#fde047] to-[#ca8a04] border-2 border-[#2e1805] text-[#1c1917] font-mono-num font-black text-xs leading-none shadow-md">
            {badgeText}
          </span>
        )}
      </div>

      {/* Mini Inflatable Pool Float Ring Pedestal */}
      <div className="w-16 h-5 rounded-full bg-gradient-to-b from-[#fb7185] via-[#f43f5e] to-[#be123c] border-2 border-[#fde047] shadow-[inset_0_2px_0_rgba(255,255,255,0.65),0_3px_0_#4c0519] -mt-1.5 relative flex items-center justify-center overflow-hidden">
        <div className="absolute left-2 inset-y-0 w-2 bg-white/45 rotate-12 pointer-events-none" />
        <div className="absolute right-2 inset-y-0 w-2 bg-white/45 -rotate-12 pointer-events-none" />
        <div className="w-9 h-2 rounded-full bg-gradient-to-b from-[#0284c7] to-[#38bdf8] border-t border-[#082f49]/80 z-10" />
      </div>
    </div>
  );
}

function ShopPanel({
  vibes = 0,
  lifetimeVibes = 0,
  runVibes = 0,
  cps = 0,
  cpc = 1,
  upgradeLevels = {},
  helperCounts = {},
  selectedEvolution = 0,
  unlockedEvolutionMax = 0,
  weatherId = 'sunny_onsen',
  unlockedAchievements = [],
  ascensionTokens = 0,
  ascensionCount = 0,
  pendingAscensionTokens = 0,
  buyMode = 1,
  onSetBuyMode,
  onBuyUpgrade,
  onBuyHelper,
  onSelectEvolution,
  onSelectWeather,
  onOpenRebirthModal,
  onOpenAscendModal,
}) {
  const [activeTab, setActiveTab] = useState('upgrades');

  const unlockedAchievementSet = useMemo(() => {
    if (unlockedAchievements instanceof Set) return unlockedAchievements;
    if (Array.isArray(unlockedAchievements)) return new Set(unlockedAchievements);
    return new Set();
  }, [unlockedAchievements]);

  const affordableUpgradesCount = useMemo(() => {
    return CLICK_UPGRADES.reduce((acc, upg) => {
      const level = upgradeLevels?.[upg.id] || 0;
      const isMaxed = upg.maxLevel ? level >= upg.maxLevel : false;
      if (isMaxed) return acc;
      const cost = Math.floor(upg.baseCost * Math.pow(upg.costMult, level));
      return vibes >= cost ? acc + 1 : acc;
    }, 0);
  }, [vibes, upgradeLevels]);

  const affordableHelpersCount = useMemo(() => {
    return HELPERS.reduce((acc, helper) => {
      const count = helperCounts?.[helper.id] || 0;
      const singleCost = Math.floor(helper.baseCost * Math.pow(HELPER_COST_GROWTH, count));
      return vibes >= singleCost ? acc + 1 : acc;
    }, 0);
  }, [vibes, helperCounts]);

  const unlockedCosmeticsCount = useMemo(() => {
    const evoCount = EVOLUTIONS.filter(
      (e, idx) => idx <= unlockedEvolutionMax || lifetimeVibes >= e.minLifetimeVibes
    ).length;
    const weatherCount = WEATHERS.filter((w) => lifetimeVibes >= w.unlockVibes).length;
    return evoCount + weatherCount;
  }, [unlockedEvolutionMax, lifetimeVibes]);

  const rebirthThreshold = useMemo(() => {
    return getRebirthThreshold(ascensionCount);
  }, [ascensionCount]);

  const nextTokenProgress = useMemo(() => {
    const currentRun = Math.max(0, runVibes);
    const threshold = rebirthThreshold;
    const isUnlocked = currentRun >= threshold;
    const pct = isUnlocked ? 100 : Math.min(100, Math.max(0, (currentRun / threshold) * 100));
    return {
      pct,
      nextThresholdVibes: threshold,
      remainingVibes: Math.max(0, threshold - currentRun),
      isUnlocked,
    };
  }, [runVibes, rebirthThreshold]);

  const tabs = [
    {
      id: 'upgrades',
      label: 'Upgrades',
      iconKey: 'tab_upgrades',
      badge: affordableUpgradesCount > 0 ? affordableUpgradesCount : null,
      badgeColor: 'bg-gradient-to-b from-[#fb7185] to-[#e11d48] text-white border-[#fef08a]',
    },
    {
      id: 'helpers',
      label: 'Helpers',
      iconKey: 'tab_helpers',
      badge: affordableHelpersCount > 0 ? affordableHelpersCount : null,
      badgeColor: 'bg-gradient-to-b from-[#fb7185] to-[#e11d48] text-white border-[#fef08a]',
    },
    {
      id: 'evolutions',
      label: 'Realms',
      iconKey: 'tab_realms',
      badge: unlockedCosmeticsCount > 2 ? `${unlockedCosmeticsCount}` : null,
      badgeColor: 'bg-gradient-to-b from-[#f59e0b] to-[#b45309] text-white border-[#fef08a]',
    },
    {
      id: 'badges',
      label: 'Badges',
      iconKey: 'tab_badges',
      badge: `${unlockedAchievementSet.size}/${ACHIEVEMENTS.length}`,
      badgeColor: 'bg-gradient-to-b from-[#10b981] to-[#047857] text-white border-[#a7f3d0]',
    },
    {
      id: 'rebirth',
      label: 'Rebirth',
      iconKey: 'tab_rebirth',
      badge:
        pendingAscensionTokens > 0
          ? '+1'
          : `${Math.floor(nextTokenProgress.pct)}%`,
      badgeColor:
        pendingAscensionTokens > 0
          ? 'bg-gradient-to-b from-[#10b981] to-[#047857] text-white border-[#a7f3d0] animate-bounce'
          : 'bg-[#0f172a] text-[#7dd3fc] border-[#38bdf8]',
    },
  ];

  const highestUnlockedEvo =
    EVOLUTIONS[Math.min(EVOLUTIONS.length - 1, Math.max(0, unlockedEvolutionMax))] || EVOLUTIONS[0];

  return (
    <aside
      aria-label="Llama Splash Summer Pool Shop and Progression"
      className="flex flex-col h-full w-full p-1 sm:p-1.5 text-white select-none overflow-hidden"
    >
      {/* 1. TOP FOLDER-STYLE ICON TABS (Enlarged icons & rem-based labels) */}
      <nav
        aria-label="Shop Categories"
        className="grid grid-cols-5 gap-1.5 px-1.5 pt-1.5 shrink-0 items-end z-20 -mb-[3px]"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              title={tab.label}
              className={`relative group flex flex-col items-center justify-center rounded-t-2xl transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#fef08a] ${
                isActive
                  ? 'h-15 sm:h-16 bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#d97706] border-t-[3px] border-x-[3px] border-[#fef08a] shadow-[inset_0_2px_0_rgba(255,255,255,0.65)] z-20 pb-1'
                  : 'h-13 sm:h-14 bg-gradient-to-b from-[#b45309] to-[#78350f] hover:from-[#d97706] hover:to-[#92400e] border-t-2 border-x-2 border-[#f59e0b]/70 text-[#fef3c7] opacity-95 hover:opacity-100 pb-0.5'
              }`}
            >
              {tab.badge !== null && (
                <span
                  className={`absolute -top-2 -right-1 z-30 px-2 min-w-6 h-6 rounded-full text-xs font-mono-num font-black flex items-center justify-center border-2 shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:0_1px_1px_#000] ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}

              <div
                className={`transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              >
                <GameIcon name={tab.iconKey} size={30} />
              </div>
              <span
                className={`text-xs font-display font-black tracking-tight leading-none mt-1 truncate max-w-full px-1 [text-shadow:0_1.5px_0_#451a03] ${
                  isActive ? 'text-white' : 'text-[#fde68a]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 2. OUTER SUNLIT CABANA WOOD & GOLDEN BAMBOO BEVELED FRAME */}
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#b45309] border-[3px] border-[#fde047] rounded-b-2xl rounded-tr-xl outline outline-2 outline-[#78350f] shadow-[inset_0_2px_0_rgba(255,255,255,0.45),0_10px_25px_rgba(8,47,73,0.55)] p-2.5 sm:p-3 overflow-hidden relative z-10">
        {/* DEEP OCEAN LAGOON TEAL-BLUE SUMMARY HEADER BOX */}
        <div className="bg-gradient-to-b from-[#0c4a6e] to-[#082f49] border-2 border-[#38bdf8] rounded-xl px-3.5 py-2.5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.65),0_1px_0_rgba(255,255,255,0.3)] shrink-0 mb-2.5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm sm:text-base font-display font-black leading-snug [text-shadow:0_2px_0_#041e30]">
            <div className="flex items-center gap-1.5 text-white truncate">
              <span className="text-[#fde047] font-mono-num">{formatNumber(cps)}/s</span>
              <span className="text-[#bae6fd] text-xs sm:text-sm font-bold">Vibes/s</span>
            </div>

            <div className="flex items-center justify-end gap-1.5 text-right truncate">
              <span className="text-[#fde047] font-mono-num">{formatNumber(ascensionTokens)}</span>
              <span className="text-white text-xs sm:text-sm font-bold">
                Golden Fruits (+{formatNumber(ascensionTokens * 25)}%)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-white truncate">
              <span className="text-[#22d3ee] font-mono-num">{formatNumber(cpc)}</span>
              <span className="text-[#e0f2fe] text-xs sm:text-sm font-bold">Splash Power</span>
            </div>

            <div className="flex items-center justify-end gap-1.5 text-right truncate">
              <button
                type="button"
                onClick={() => setActiveTab('rebirth')}
                className="text-xs sm:text-sm font-bold text-[#fda4af] hover:text-[#fecdd3] transition-colors cursor-pointer truncate"
              >
                {pendingAscensionTokens > 0 ? (
                  <span className="text-[#4ade80] font-black animate-pulse">Rebirth Ready! (+1)</span>
                ) : (
                  <span>Rebirth #{ascensionCount + 1}: <span className="font-mono-num text-[#fde047]">{Math.floor(nextTokenProgress.pct)}%</span></span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#0284c7]/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-display font-black [text-shadow:0_1.5px_0_#041e30]">
              <GameIcon name="yuzu" size={24} />
              <span className="text-[#fde047] font-mono-num text-base sm:text-lg">{formatNumber(vibes)}</span>
              <span className="text-[#7dd3fc] text-xs uppercase tracking-wider font-bold">
                Pool Vibes
              </span>
            </div>

            {activeTab === 'helpers' ? (
              <div
                role="group"
                aria-label="Bulk Purchase Multiplier"
                className="flex items-center bg-[#041e30] p-1 rounded-xl border border-[#38bdf8]/60 gap-1"
              >
                {[1, 10, 'MAX'].map((mode) => {
                  const active = buyMode === mode;
                  return (
                    <button
                      key={String(mode)}
                      type="button"
                      onClick={() => onSetBuyMode && onSetBuyMode(mode)}
                      className={`px-3 py-1 rounded-lg font-mono-num text-xs sm:text-sm font-black transition-all cursor-pointer [text-shadow:0_1px_0_#000] ${
                        active
                          ? 'bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#ca8a04] text-[#1c1917] [text-shadow:none] border border-[#fef08a] shadow-sm'
                          : 'text-[#bae6fd] hover:text-white hover:bg-[#0c4a6e]'
                      }`}
                    >
                      {mode === 'MAX' ? 'MAX' : `${mode}x`}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs font-mono-num font-bold text-[#7dd3fc] [text-shadow:0_1px_0_#041e30]">
                Lifetime: {formatNumber(lifetimeVibes)}
              </span>
            )}
          </div>
        </div>

        {/* 3. SCROLLABLE TROPICAL POOL-STONE PLAQUE LIST */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
          {/* TAB 1: UPGRADES */}
          {activeTab === 'upgrades' && (
            <div className="space-y-2.5 pb-2">
              {CLICK_UPGRADES.map((upg) => {
                const level = upgradeLevels?.[upg.id] || 0;
                const isMaxed = Boolean(upg.maxLevel && level >= upg.maxLevel);
                const cost = Math.floor(upg.baseCost * Math.pow(upg.costMult, level));
                const canAfford = !isMaxed && vibes >= cost;
                const progressPct = isMaxed
                  ? 100
                  : Math.min(100, Math.max(0, (vibes / Math.max(1, cost)) * 100));

                let effectBonus = '';
                if (upg.type === 'flat_click')
                  effectBonus = `+${formatNumber(upg.value)} Splash Boop Power`;
                else if (upg.type === 'crit_chance')
                  effectBonus = `+${Math.round(upg.value * 100)}% Crit Splash Chance`;
                else if (upg.type === 'crit_mult')
                  effectBonus = `+${upg.value}x Critical Splash Multiplier`;
                else if (upg.type === 'cps_to_click')
                  effectBonus = `+${Math.round(upg.value * 100)}% of Idle Vibes/s per Click`;
                else if (upg.type === 'frenzy_power')
                  effectBonus = `+${upg.value}x Frenzy Wave Power`;

                return (
                  <div
                    key={upg.id}
                    onClick={() => canAfford && onBuyUpgrade && onBuyUpgrade(upg.id)}
                    role="button"
                    tabIndex={canAfford ? 0 : -1}
                    aria-disabled={!canAfford || isMaxed}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && canAfford) {
                        e.preventDefault();
                        onBuyUpgrade && onBuyUpgrade(upg.id);
                      }
                    }}
                    className={`group relative rounded-xl p-3 sm:p-3.5 transition-all duration-150 overflow-hidden bg-gradient-to-b from-[#1e3a5f] via-[#172554] to-[#0f172a] border-[2.5px] border-[#38bdf8]/60 shadow-[inset_0_2px_0_rgba(125,211,252,0.45),0_4px_0_#090d16] ${
                      canAfford
                        ? 'hover:from-[#1e40af] hover:via-[#1e3a8a] hover:to-[#0f172a] hover:border-[#7dd3fc] cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5">
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <div className="text-[#fde047] font-display font-black text-base sm:text-lg tracking-wide leading-none mb-1.5 [text-shadow:0_2px_2px_rgba(0,0,0,0.95)]">
                          {upg.maxLevel ? `Lvl ${level}/${upg.maxLevel}` : `Lvl ${level}`}
                        </div>

                        {isMaxed ? (
                          <div className="bg-gradient-to-b from-[#10b981] to-[#047857] border-[2.5px] border-[#fde047] shadow-[inset_0_2px_0_rgba(255,255,255,0.45),0_3px_0_#064e3b] rounded-xl px-3.5 py-2 min-w-[7rem] flex flex-col items-center justify-center">
                            <span className="text-[#fef08a] font-display font-black text-xs sm:text-sm uppercase [text-shadow:0_1.5px_0_#000]">
                              MAX LVL
                            </span>
                            <span className="text-white font-mono-num font-black text-xs sm:text-sm mt-0.5 [text-shadow:0_1.5px_0_#000]">
                              DONE
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (canAfford && onBuyUpgrade) onBuyUpgrade(upg.id);
                            }}
                            className={`relative overflow-hidden rounded-xl px-3 py-2 min-w-[7rem] flex flex-col items-center justify-center transition-transform ${
                              canAfford
                                ? 'bg-gradient-to-b from-[#22d3ee] via-[#0ea5e9] to-[#0284c7] hover:from-[#67e8f9] hover:via-[#22d3ee] hover:to-[#0369a1] border-[2.5px] border-[#fde047] shadow-[inset_0_2px_0_rgba(255,255,255,0.75),0_3px_0_#0369a1] cursor-pointer active:translate-y-0.5'
                                : 'bg-gradient-to-b from-[#475569] to-[#334155] border-[2.5px] border-[#64748b] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_0_#0f172a] opacity-80 cursor-not-allowed'
                            }`}
                          >
                            <div className="pointer-events-none absolute inset-x-1.5 top-0.5 h-2 rounded-full bg-white/35" />
                            <span
                              className={`font-display font-black text-xs sm:text-sm uppercase leading-none [text-shadow:0_1.5px_0_#000] ${
                                canAfford ? 'text-[#fef08a]' : 'text-[#cbd5e1]'
                              }`}
                            >
                              LVL UP
                            </span>
                            <span className="text-white font-mono-num font-black text-sm sm:text-base leading-tight mt-1 flex items-center gap-1.5 [text-shadow:0_1.5px_0_#000]">
                              <GameIcon name="yuzu" size={20} />
                              {formatNumber(cost)}
                            </span>
                          </button>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-right pr-1">
                        <h3 className="text-white font-display font-black text-base sm:text-lg leading-tight truncate [text-shadow:0_2px_0_#082f49,0_-1px_0_#082f49,1.5px_0_0_#082f49,-1.5px_0_0_#082f49,0_3px_6px_rgba(0,0,0,0.85)]">
                          {upg.name}
                        </h3>

                        <div className="text-[#fde047] font-display font-black text-xs sm:text-sm leading-snug mt-0.5 [text-shadow:0_1.5px_1px_rgba(0,0,0,0.95)]">
                          {effectBonus}
                        </div>

                        <p className="text-[#e0f2fe] font-bold text-xs sm:text-sm leading-snug mt-0.5 line-clamp-2 [text-shadow:0_1.5px_1px_rgba(0,0,0,0.9)]">
                          {upg.desc}
                        </p>
                      </div>

                      <PedestalStatue
                        icon={upg.icon}
                        accentColor="#22d3ee"
                        badgeText={level > 0 ? `+${level}` : null}
                      />
                    </div>

                    {!isMaxed && !canAfford && (
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#090d16]/90 overflow-hidden border-t border-black/40">
                        <div
                          className="h-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#fde047] transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: HELPERS */}
          {activeTab === 'helpers' && (
            <div className="space-y-2.5 pb-2">
              {HELPERS.map((helper) => {
                const count = helperCounts?.[helper.id] || 0;
                const { quantity, totalCost, canAfford } = calculateBulkHelperPurchase(
                  helper.baseCost,
                  count,
                  buyMode,
                  vibes
                );
                const milestone = getMilestoneInfo(count);
                const unitEffectiveCps = helper.baseCps * milestone.mult;
                const totalHelperCps = unitEffectiveCps * count;
                const progressPct = Math.min(
                  100,
                  Math.max(0, (vibes / Math.max(1, totalCost)) * 100)
                );

                return (
                  <div
                    key={helper.id}
                    onClick={() =>
                      canAfford && onBuyHelper && onBuyHelper(helper.id, quantity, totalCost)
                    }
                    role="button"
                    tabIndex={canAfford ? 0 : -1}
                    aria-disabled={!canAfford}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && canAfford) {
                        e.preventDefault();
                        onBuyHelper && onBuyHelper(helper.id, quantity, totalCost);
                      }
                    }}
                    className={`group relative rounded-xl p-3 sm:p-3.5 transition-all duration-150 overflow-hidden bg-gradient-to-b from-[#1e3a5f] via-[#172554] to-[#0f172a] border-[2.5px] border-[#38bdf8]/60 shadow-[inset_0_2px_0_rgba(125,211,252,0.45),0_4px_0_#090d16] ${
                      canAfford
                        ? 'hover:from-[#1e40af] hover:via-[#1e3a8a] hover:to-[#0f172a] hover:border-[#7dd3fc] cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5">
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <div className="text-[#fde047] font-display font-black text-base sm:text-lg tracking-wide leading-none mb-1.5 [text-shadow:0_2px_2px_rgba(0,0,0,0.95)]">
                          Lvl {count}
                        </div>

                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (canAfford && onBuyHelper) {
                              onBuyHelper(helper.id, quantity, totalCost);
                            }
                          }}
                          className={`relative overflow-hidden rounded-xl px-3 py-2 min-w-[7rem] flex flex-col items-center justify-center transition-transform ${
                            canAfford
                              ? 'bg-gradient-to-b from-[#22d3ee] via-[#0ea5e9] to-[#0284c7] hover:from-[#67e8f9] hover:via-[#22d3ee] hover:to-[#0369a1] border-[2.5px] border-[#fde047] shadow-[inset_0_2px_0_rgba(255,255,255,0.75),0_3px_0_#0369a1] cursor-pointer active:translate-y-0.5'
                              : 'bg-gradient-to-b from-[#475569] to-[#334155] border-[2.5px] border-[#64748b] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_0_#0f172a] opacity-80 cursor-not-allowed'
                          }`}
                        >
                          <div className="pointer-events-none absolute inset-x-1.5 top-0.5 h-2 rounded-full bg-white/35" />
                          <span
                            className={`font-display font-black text-xs sm:text-sm uppercase leading-none [text-shadow:0_1.5px_0_#000] ${
                              canAfford ? 'text-[#fef08a]' : 'text-[#cbd5e1]'
                            }`}
                          >
                            {quantity > 1 ? `BUY +${quantity}` : 'LVL UP'}
                          </span>
                          <span className="text-white font-mono-num font-black text-sm sm:text-base leading-tight mt-1 flex items-center gap-1.5 [text-shadow:0_1.5px_0_#000]">
                            <GameIcon name="yuzu" size={20} />
                            {formatNumber(totalCost)}
                          </span>
                        </button>
                      </div>

                      <div className="flex-1 min-w-0 text-right pr-1">
                        <h3 className="text-white font-display font-black text-base sm:text-lg leading-tight truncate [text-shadow:0_2px_0_#082f49,0_-1px_0_#082f49,1.5px_0_0_#082f49,-1.5px_0_0_#082f49,0_3px_6px_rgba(0,0,0,0.85)]">
                          {helper.name}
                        </h3>

                        <div className="text-white font-bold text-xs sm:text-sm leading-snug mt-0.5 [text-shadow:0_1.5px_1px_rgba(0,0,0,0.95)]">
                          <span className="text-[#fde047] font-mono-num font-black">
                            +{formatNumber(unitEffectiveCps)}/s
                          </span>{' '}
                          each{' '}
                          {count > 0 && (
                            <span className="text-[#67e8f9] font-mono-num">
                              (Total: {formatNumber(totalHelperCps)}/s)
                            </span>
                          )}
                        </div>

                        <p className="text-[#bae6fd] font-bold text-xs leading-snug mt-0.5 line-clamp-1 [text-shadow:0_1px_1px_rgba(0,0,0,0.9)]">
                          {helper.desc}
                        </p>

                        <div className="mt-1.5 bg-[#082f49]/90 rounded-lg px-2.5 py-1 border border-[#38bdf8]/40 shadow-inner">
                          <div className="flex items-center justify-between text-xs font-display font-black [text-shadow:0_1px_0_#000] mb-0.5">
                            <span className="text-[#fde047]">
                              {milestone.nextThreshold
                                ? `Next 2x Splash Surge: ${count}/${milestone.nextThreshold}`
                                : 'MAX 16x SURGE!'}
                            </span>
                            <span className="text-[#4ade80] font-mono-num">
                              {milestone.mult}x Mult
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#041e30] rounded-full overflow-hidden border border-black/50">
                            <div
                              className="h-full bg-gradient-to-r from-[#22d3ee] via-[#4ade80] to-[#fde047] transition-all duration-300"
                              style={{ width: `${milestone.progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <PedestalStatue
                        icon={helper.icon}
                        accentColor={helper.color}
                        badgeText={milestone.mult > 1 ? `${milestone.mult}x` : null}
                      />
                    </div>

                    {!canAfford && (
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#090d16]/90 overflow-hidden border-t border-black/40">
                        <div
                          className="h-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#fde047] transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: EVOLUTIONS & REALMS */}
          {activeTab === 'evolutions' && (
            <div className="space-y-3 pb-2">
              <div className="p-3 rounded-xl bg-gradient-to-b from-[#0c4a6e] to-[#082f49] border-2 border-[#fde047]/80 shadow-inner flex items-center justify-between gap-2 [text-shadow:0_1.5px_0_#000]">
                <div>
                  <div className="text-sm font-display font-black text-[#fde047] flex items-center gap-2">
                    <GameIcon name="crown" size={22} />
                    <span>3D LLAMA POOL EVOLUTIONS</span>
                  </div>
                  <p className="text-xs text-[#e0f2fe] font-bold mt-0.5">
                    Highest unlocked bonus ({highestUnlockedEvo.bonusText}) stays active forever!
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#f59e0b] to-[#b45309] border border-[#fef08a] text-white font-mono-num font-black text-xs sm:text-sm shrink-0">
                  {highestUnlockedEvo.mult}x Mult
                </span>
              </div>

              <div className="space-y-2.5">
                {EVOLUTIONS.map((evo, idx) => {
                  const isUnlocked =
                    idx <= unlockedEvolutionMax || lifetimeVibes >= evo.minLifetimeVibes;
                  const isSelected = selectedEvolution === idx;
                  const unlockPct = Math.min(
                    100,
                    Math.max(0, (lifetimeVibes / Math.max(1, evo.minLifetimeVibes)) * 100)
                  );

                  return (
                    <div
                      key={evo.id}
                      onClick={() => isUnlocked && onSelectEvolution && onSelectEvolution(idx)}
                      role="button"
                      tabIndex={isUnlocked ? 0 : -1}
                      className={`group relative rounded-xl p-3 sm:p-3.5 transition-all duration-150 overflow-hidden bg-gradient-to-b from-[#1e3a5f] via-[#172554] to-[#0f172a] border-[2.5px] shadow-[inset_0_2px_0_rgba(125,211,252,0.45),0_4px_0_#090d16] ${
                        isSelected
                          ? 'border-[#fde047] ring-2 ring-[#22d3ee]/60'
                          : 'border-[#38bdf8]/60'
                      } ${isUnlocked ? 'cursor-pointer hover:brightness-110' : 'opacity-80 cursor-not-allowed'}`}
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <div className="flex flex-col items-center justify-center shrink-0">
                          <div className="text-[#fde047] font-display font-black text-sm sm:text-base tracking-wide leading-none mb-1.5 [text-shadow:0_2px_2px_rgba(0,0,0,0.95)]">
                            Tier #{idx + 1}
                          </div>

                          {isSelected ? (
                            <div className="bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#ca8a04] border-[2.5px] border-white shadow-[inset_0_2px_0_rgba(255,255,255,0.6),0_3px_0_#854d0e] rounded-xl px-3 py-2 min-w-[6.75rem] flex flex-col items-center justify-center">
                              <span className="text-[#1c1917] font-display font-black text-xs sm:text-sm uppercase">
                                EQUIPPED
                              </span>
                              <span className="text-[#2e1805] font-mono-num font-black text-xs">
                                {evo.mult}x Power
                              </span>
                            </div>
                          ) : isUnlocked ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectEvolution && onSelectEvolution(idx);
                              }}
                              className="bg-gradient-to-b from-[#22d3ee] via-[#0ea5e9] to-[#0284c7] border-[2.5px] border-[#fde047] shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_3px_0_#0369a1] rounded-xl px-3 py-2 min-w-[6.75rem] flex flex-col items-center justify-center cursor-pointer active:translate-y-0.5"
                            >
                              <span className="text-[#fef08a] font-display font-black text-xs sm:text-sm uppercase [text-shadow:0_1.5px_0_#000]">
                                EQUIP 3D
                              </span>
                              <span className="text-white font-mono-num font-black text-xs [text-shadow:0_1.5px_0_#000]">
                                {evo.mult}x Boost
                              </span>
                            </button>
                          ) : (
                            <div className="bg-gradient-to-b from-[#475569] to-[#334155] border-[2.5px] border-[#64748b] rounded-xl px-3 py-2 min-w-[6.75rem] flex flex-col items-center justify-center opacity-85">
                              <span className="text-[#cbd5e1] font-display font-black text-xs uppercase flex items-center gap-1 [text-shadow:0_1px_0_#000]">
                                <GameIcon name="lock" size={16} /> LOCKED
                              </span>
                              <span className="text-white font-mono-num font-black text-xs sm:text-sm mt-0.5 [text-shadow:0_1px_0_#000]">
                                {formatNumber(evo.minLifetimeVibes)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-right pr-1">
                          <h4 className="text-white font-display font-black text-base sm:text-lg leading-tight truncate [text-shadow:0_2px_0_#082f49,0_3px_6px_rgba(0,0,0,0.9)]">
                            {evo.name}
                          </h4>
                          <div className="text-[#fde047] font-display font-black text-xs sm:text-sm mt-0.5 [text-shadow:0_1.5px_0_#000]">
                            {evo.bonusText}
                          </div>
                          <p className="text-[#e0f2fe] font-bold text-xs leading-snug mt-0.5 line-clamp-2 [text-shadow:0_1px_1px_#000]">
                            {evo.desc}
                          </p>
                        </div>

                        <PedestalStatue
                          icon={evo.icon || 'llama'}
                          accentColor={evo.accent}
                          grayscale={!isUnlocked}
                        />
                      </div>

                      {!isUnlocked && (
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#090d16] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#22d3ee] to-[#fde047]"
                            style={{ width: `${unlockPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Weather Realms Section */}
              <div className="pt-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#0c4a6e] to-[#082f49] border-2 border-[#38bdf8] mb-2 flex items-center justify-between [text-shadow:0_1.5px_0_#000]">
                  <span className="text-sm font-display font-black text-[#fde047] flex items-center gap-2">
                    <GameIcon name="palm" size={22} />
                    <span>3D WATERPARK WEATHER REALMS</span>
                  </span>
                  <span className="text-xs font-bold text-[#bae6fd]">Click to switch sky</span>
                </div>

                <div className="space-y-2.5">
                  {WEATHERS.map((w) => {
                    const isUnlocked = lifetimeVibes >= w.unlockVibes;
                    const isSelected = weatherId === w.id;
                    return (
                      <div
                        key={w.id}
                        onClick={() => isUnlocked && onSelectWeather && onSelectWeather(w.id)}
                        role="button"
                        tabIndex={isUnlocked ? 0 : -1}
                        className={`group relative rounded-xl p-3 bg-gradient-to-b from-[#1e3a5f] via-[#172554] to-[#0f172a] border-[2.5px] shadow-[inset_0_2px_0_rgba(125,211,252,0.45),0_4px_0_#090d16] flex items-center justify-between gap-3 ${
                          isSelected ? 'border-[#fde047]' : 'border-[#38bdf8]/60'
                        } ${isUnlocked ? 'cursor-pointer hover:brightness-110' : 'opacity-75 cursor-not-allowed'}`}
                      >
                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#fde047] to-[#ca8a04] border-2 border-white text-[#1c1917] font-display font-black text-xs sm:text-sm">
                              ACTIVE SKY
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#0284c7] border-2 border-[#fde047] text-[#fef08a] font-display font-black text-xs sm:text-sm [text-shadow:0_1px_0_#000]">
                              ACTIVATE
                            </span>
                          ) : (
                            <span className="px-3 py-2 rounded-xl bg-[#475569] border-2 border-[#64748b] text-white font-mono-num font-black text-xs sm:text-sm flex items-center gap-1.5 [text-shadow:0_1px_0_#000]">
                              <GameIcon name="lock" size={16} /> {formatNumber(w.unlockVibes)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-right">
                          <div className="text-white font-display font-black text-base sm:text-lg [text-shadow:0_2px_0_#082f49,0_3px_5px_rgba(0,0,0,0.9)]">
                            {w.name}
                          </div>
                          <div className="text-[#fde047] font-bold text-xs sm:text-sm [text-shadow:0_1px_0_#000]">
                            {w.bonusText}
                          </div>
                        </div>

                        <PedestalStatue icon={w.icon} grayscale={!isUnlocked} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-2.5 pb-2">
              <div className="p-3 rounded-xl bg-gradient-to-b from-[#0c4a6e] to-[#082f49] border-2 border-[#38bdf8] shadow-inner [text-shadow:0_1.5px_0_#000]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-display font-black text-[#fde047] flex items-center gap-2">
                    <GameIcon name="tab_badges" size={22} />
                    <span>POOL PARTY TROPHY CABINET</span>
                  </span>
                  <span className="font-mono-num font-black text-xs sm:text-sm text-[#4ade80]">
                    {unlockedAchievementSet.size}/{ACHIEVEMENTS.length} (+
                    {unlockedAchievementSet.size * 2}% Vibes)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#041e30] rounded-full overflow-hidden mt-2 border border-[#0284c7]">
                  <div
                    className="h-full bg-gradient-to-r from-[#22d3ee] via-[#4ade80] to-[#fde047] transition-all duration-500"
                    style={{
                      width: `${(unlockedAchievementSet.size / ACHIEVEMENTS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {ACHIEVEMENTS.map((ach) => {
                const unlocked = unlockedAchievementSet.has(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`rounded-xl p-3 bg-gradient-to-b from-[#1e3a5f] via-[#172554] to-[#0f172a] border-[2.5px] border-[#38bdf8]/60 shadow-[inset_0_2px_0_rgba(125,211,252,0.45),0_4px_0_#090d16] flex items-center justify-between gap-3 ${
                      unlocked ? '' : 'opacity-75'
                    }`}
                  >
                    <div className="shrink-0">
                      {unlocked ? (
                        <span className="px-3 py-2 rounded-xl bg-gradient-to-b from-[#10b981] to-[#047857] border-2 border-[#fde047] text-[#fef08a] font-display font-black text-xs sm:text-sm [text-shadow:0_1px_0_#000]">
                          +2% VIBES
                        </span>
                      ) : (
                        <span className="px-3 py-2 rounded-xl bg-[#475569] border-2 border-[#64748b] text-[#cbd5e1] font-display font-black text-xs sm:text-sm [text-shadow:0_1px_0_#000]">
                          LOCKED
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <h4 className="text-white font-display font-black text-base sm:text-lg truncate [text-shadow:0_2px_0_#082f49,0_3px_5px_rgba(0,0,0,0.9)]">
                        {ach.name}
                      </h4>
                      <p className="text-[#e0f2fe] font-bold text-xs sm:text-sm leading-snug mt-0.5 [text-shadow:0_1px_1px_#000]">
                        {ach.desc}
                      </p>
                    </div>

                    <PedestalStatue icon={ach.icon} grayscale={!unlocked} />
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: REBIRTH */}
          {activeTab === 'rebirth' && (
            <div className="space-y-3 pb-2">
              <div className="rounded-xl p-4 bg-gradient-to-b from-[#1e3a5f] via-[#172554] to-[#0f172a] border-[2.5px] border-[#38bdf8]/60 shadow-[inset_0_2px_0_rgba(125,211,252,0.45),0_4px_0_#090d16]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs font-mono-num uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#0c4a6e] text-[#fde047] border border-[#38bdf8] font-black">
                      Alanya VIP Resort • Rebirth #{ascensionCount + 1}
                    </span>
                    <h3 className="text-white font-display font-black text-lg sm:text-xl mt-1.5 [text-shadow:0_2px_0_#082f49,0_3px_6px_rgba(0,0,0,0.9)]">
                      Alanya Lagoon Rebirth
                    </h3>
                  </div>
                  <PedestalStatue icon="tab_rebirth" accentColor="#fde047" />
                </div>

                <p className="text-[#e0f2fe] font-bold text-xs sm:text-sm leading-relaxed mt-2 [text-shadow:0_1.5px_1px_#000]">
                  Reach the target of <span className="text-[#fde047] font-mono-num font-black">{formatNumber(rebirthThreshold)} Vibes</span> in this run to unlock <span className="text-[#fde047] font-black">+1 Golden Citrus</span> (+25% Global Vibes).
                  Rebirths do <strong className="text-white underline">not stack</strong> — you can only earn 1 Rebirth per run. Rebirth to claim and begin working toward Rebirth #{ascensionCount + 2}!
                </p>

                <div className="grid grid-cols-2 gap-2.5 mt-3">
                  <div className="p-3 rounded-xl bg-[#082f49] border-2 border-[#fde047]/80 [text-shadow:0_1.5px_0_#000]">
                    <div className="text-xs uppercase text-[#bae6fd] font-bold">
                      Owned Golden Fruits
                    </div>
                    <div className="font-mono-num font-black text-xl text-[#fde047] mt-1 flex items-center gap-2">
                      <GameIcon name="yuzu" size={24} />
                      <span>{formatNumber(ascensionTokens)}</span>
                    </div>
                    <div className="text-xs font-bold text-[#4ade80] mt-0.5">
                      +{formatNumber(ascensionTokens * 25)}% All Vibes
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl bg-[#082f49] border-2 ${pendingAscensionTokens > 0 ? 'border-emerald-400' : 'border-[#38bdf8]'} [text-shadow:0_1.5px_0_#000]`}>
                    <div className="text-xs uppercase text-[#bae6fd] font-bold">
                      Available This Run
                    </div>
                    <div className={`font-mono-num font-black text-xl mt-1 flex items-center gap-2 ${pendingAscensionTokens > 0 ? 'text-[#4ade80]' : 'text-[#67e8f9]'}`}>
                      <GameIcon name="sparkle" size={24} />
                      <span>{pendingAscensionTokens > 0 ? '+1' : '0'}</span>
                    </div>
                    <div className={`text-xs font-bold mt-0.5 ${pendingAscensionTokens > 0 ? 'text-[#4ade80]' : 'text-[#fde047]'}`}>
                      {pendingAscensionTokens > 0 ? '+25% Ready to Claim!' : `Need ${formatNumber(nextTokenProgress.remainingVibes)}`}
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-[#082f49] border border-[#38bdf8]/50 [text-shadow:0_1px_0_#000]">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-display font-black mb-1.5">
                    <span className="text-white">Rebirth #{ascensionCount + 1} Progress</span>
                    <span className="font-mono-num text-[#fde047]">
                      {Math.floor(nextTokenProgress.pct)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#041e30] rounded-full overflow-hidden border border-black">
                    <div
                      className="h-full bg-gradient-to-r from-[#22d3ee] via-[#4ade80] to-[#fde047] transition-all duration-300"
                      style={{ width: `${nextTokenProgress.pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#bae6fd] font-mono-num font-bold mt-1.5">
                    <span>This Run: {formatNumber(runVibes)}</span>
                    <span>Target: {formatNumber(nextTokenProgress.nextThresholdVibes)}</span>
                  </div>
                </div>

                {/* Banner explaining non-stacking cap */}
                {pendingAscensionTokens > 0 ? (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border-2 border-emerald-400 text-xs text-emerald-200 font-bold leading-snug">
                    <span className="text-amber-300 font-black">⭐ REBIRTH READY (+1)!</span> Milestone reached for this run! Additional vibes in this run will <span className="text-white underline">not</span> give more rebirth value. Rebirth now to claim your +1 Golden Citrus and advance to Rebirth #{ascensionCount + 2}!
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-[#041e30]/80 border border-[#38bdf8]/40 text-xs text-[#bae6fd] font-medium leading-tight">
                    🌴 Earn <span className="text-[#fde047] font-mono-num font-bold">{formatNumber(nextTokenProgress.remainingVibes)}</span> more Vibes in this life to unlock Rebirth #{ascensionCount + 1}.
                  </div>
                )}

                <button
                  type="button"
                  disabled={pendingAscensionTokens <= 0}
                  onClick={() => {
                    if (onOpenRebirthModal) onOpenRebirthModal();
                    else if (onOpenAscendModal) onOpenAscendModal();
                  }}
                  className={`mt-3.5 w-full py-3.5 px-4 rounded-xl border-[2.5px] font-display font-black text-base tracking-wide flex items-center justify-center gap-2 transition-all ${
                    pendingAscensionTokens > 0
                      ? 'bg-gradient-to-b from-[#22d3ee] via-[#0ea5e9] to-[#0284c7] hover:from-[#67e8f9] hover:to-[#0369a1] border-[#fde047] shadow-[inset_0_2px_0_rgba(255,255,255,0.75),0_4px_0_#0369a1] text-[#fef08a] [text-shadow:0_2px_0_#000] cursor-pointer active:translate-y-0.5 animate-pulse'
                      : 'bg-[#1e293b] border-[#475569] text-[#94a3b8] cursor-not-allowed opacity-75'
                  }`}
                >
                  <Flame className={`w-5 h-5 ${pendingAscensionTokens > 0 ? 'text-[#fde047]' : 'text-slate-500'}`} />
                  <span>
                    {pendingAscensionTokens > 0
                      ? `REBIRTH IN ALANYA (+1 GOLDEN CITRUS)`
                      : `REBIRTH LOCKED (${Math.floor(nextTokenProgress.pct)}%)`}
                  </span>
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default React.memo(ShopPanel);
