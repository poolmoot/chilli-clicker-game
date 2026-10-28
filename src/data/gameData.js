/**
 * ALANYA LLAMA CLICKER — Complete Game Design Data & Rebirth Economy Balancing
 * High-replayability idle clicker curve with rich Alanya street food, Turkish Riviera beach culture,
 * and hilarious modern internet humor (Kebab, Dürüm, Pizza, Baklava, Maraş Ice Cream, Cleopatra Beach, Rizz).
 */

const SUFFIXES = [
  { value: 1e33, symbol: 'Dc' }, // Decillion
  { value: 1e30, symbol: 'No' }, // Nonillion
  { value: 1e27, symbol: 'Oc' }, // Octillion
  { value: 1e24, symbol: 'Sp' }, // Septillion
  { value: 1e21, symbol: 'Sx' }, // Sextillion
  { value: 1e18, symbol: 'Qi' }, // Quintillion
  { value: 1e15, symbol: 'Qa' }, // Quadrillion
  { value: 1e12, symbol: 'T' },  // Trillion
  { value: 1e9, symbol: 'B' },   // Billion
  { value: 1e6, symbol: 'M' },   // Million
  { value: 1e3, symbol: 'K' },   // Thousand
];

export function formatNumber(num) {
  if (num === null || num === undefined || Number.isNaN(num)) return '0';
  if (!Number.isFinite(num)) return '∞';
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (abs < 1000) {
    if (abs < 10 && abs !== Math.floor(abs)) {
      return sign + abs.toFixed(1).replace(/\.0$/, '');
    }
    return sign + Math.floor(abs).toString();
  }

  for (let i = 0; i < SUFFIXES.length; i++) {
    const { value, symbol } = SUFFIXES[i];
    if (abs >= value) {
      const scaled = abs / value;
      const decimals = scaled >= 100 ? 1 : 2;
      return `${sign}${scaled.toFixed(decimals)}${symbol}`;
    }
  }

  return sign + abs.toExponential(2);
}

export const formatCompact = formatNumber;

export const MILESTONE_THRESHOLDS = [10, 25, 50, 100, 200];

/**
 * 3D LLAMA EVOLUTIONS
 * Stretched progression curve requiring significant playtime & Rebirth tokens to reach the high tiers!
 */
export const EVOLUTIONS = [
  {
    id: 'wet_capy',
    name: 'Alanya Rookie Llama',
    icon: 'llama',
    minVibes: 0,
    minLifetimeVibes: 0,
    title: 'Lounging on the Sprinkle Donut',
    desc: 'Just checked into the Cleopatra Beach all-inclusive resort. Zero thoughts, head empty, soaking in the travertine lagoon.',
    accent: '#f59e0b',
    bonusText: 'Base Vibes (1.0x)',
    mult: 1.0,
  },
  {
    id: 'chill_bro',
    name: 'Dürüm-Fueled Beach Llama',
    icon: 'durum',
    minVibes: 50000, // 50K
    minLifetimeVibes: 50000,
    title: 'Smells Like Garlic Sumac Rizz',
    desc: 'Equipped with 3D pixel sunglasses and fueled by 3 tight lamb dürüm wraps. Immune to vacation sunburn.',
    accent: '#38bdf8',
    bonusText: '+20% Global Vibes',
    mult: 1.2,
  },
  {
    id: 'tinfoil_capy',
    name: 'Mewing Cleopatra Mogger',
    icon: 'tinfoil_capy',
    minVibes: 2500000, // 2.5M
    minLifetimeVibes: 2500000,
    title: 'Locked-In Canthal Tilt',
    desc: 'Maintains absolute mewing jawline discipline on the floatie. Intimidates seagull drone spies with pure aura.',
    accent: '#a3e635',
    bonusText: '+50% Global Vibes',
    mult: 1.5,
  },
  {
    id: 'wizard_capy',
    name: 'Cleopatra Jet Ski Sultan',
    icon: 'jet_ski',
    minVibes: 150000000, // 150M
    minLifetimeVibes: 150000000,
    title: 'Blasting Turkish Phonk at 80 Knots',
    desc: 'Rides waves past the Red Tower with an enchanted wizard hat and golden life jacket. Splashes the entire Mediterranean.',
    accent: '#c084fc',
    bonusText: '+120% Global Vibes',
    mult: 2.2,
  },
  {
    id: 'baron_capy',
    name: 'Baklava Overlord Llama-illionaire',
    icon: 'baklava',
    minVibes: 10000000000, // 10 Billion
    minLifetimeVibes: 10000000000,
    title: 'Too Sticky To Fail',
    desc: 'Bathed in 40 layers of Antep honey syrup and 24K edible gold foil. Owns 14 fake Gucci boutiques in the Grand Bazaar.',
    accent: '#fbbf24',
    bonusText: '+300% Global Vibes',
    mult: 4.0,
  },
  {
    id: 'cyber_capy',
    name: 'Alanya Castle Cyber-Pirate 2099',
    icon: 'cyber_capy',
    minVibes: 1000000000000, // 1 Trillion
    minLifetimeVibes: 1000000000000,
    title: 'Neon Scimitar Overclock',
    desc: 'Synthesized cyber-llama overlooking the 13th-century fortress. Mines crypto vibes directly on the Red Tower blockchain.',
    accent: '#2dd4bf',
    bonusText: '+750% Global Vibes',
    mult: 8.5,
  },
  {
    id: 'biblical_capy',
    name: 'Biblically Accurate Maraş Dondurma God',
    icon: 'ice_cream',
    minVibes: 100000000000000, // 100 Trillion
    minLifetimeVibes: 100000000000000,
    title: 'YOU WILL NEVER GET THE CONE',
    desc: 'Surrounded by spinning metal ice cream poles, interlocking seraphim floatie rings, and all-seeing eyes. Pure cosmic trickery.',
    accent: '#f43f5e',
    bonusText: '+2,000% Global Vibes',
    mult: 21.0,
  },
];

/**
 * CLICK UPGRADES
 * Deep progression curve spanning from 40 to 100 Trillion vibes.
 * Loaded with hilarious Alanya foods, beach rizz, and brainrot humor!
 */
export const CLICK_UPGRADES = [
  {
    id: 'kebab_rizz',
    name: 'Unspoken Maraş Ice Cream Rizz',
    icon: 'ice_cream',
    baseCost: 35,
    costMult: 1.5,
    type: 'flat_click',
    value: 3,
    desc: 'The ice cream guy spins the cone for 45 seconds, mogging everyone at the beach. +3 Vibes per splash.',
  },
  {
    id: 'durum_wrap',
    name: 'Double-Wrapped Lamb Dürüm',
    icon: 'durum',
    baseCost: 240,
    costMult: 1.55,
    type: 'flat_click',
    value: 15,
    desc: 'Tight lavash roll loaded with spiced lamb and garlic sumac sauce. Fueled by pure Turkish street energy. +15 Vibes per splash.',
  },
  {
    id: 'cleopatra_mewing',
    name: 'Mewing at Cleopatra Beach',
    icon: 'llama',
    baseCost: 1200,
    costMult: 1.6,
    type: 'flat_click',
    value: 70,
    desc: 'Locked-in jawline posture while floating in the turquoise shallows. Absolute chad energy. +70 Vibes per click.',
  },
  {
    id: 'crispy_baklava',
    name: '40-Layer Pistachio Baklava',
    icon: 'baklava',
    baseCost: 6500,
    costMult: 1.65,
    type: 'flat_click',
    value: 320,
    desc: 'Paper-thin phyllo pastry drenched in hot Antep honey syrup. Instant sugar overdrive. +320 Vibes per click.',
  },
  {
    id: 'sucuk_pizza',
    name: 'Wood-Fired Alanya Beach Pizza',
    icon: 'pizza',
    baseCost: 32000,
    costMult: 1.68,
    type: 'flat_click',
    value: 1450,
    desc: 'Charred bubbly crust loaded with spicy garlic Turkish sucuk sausage and molten cheese. +1,450 Vibes per click.',
  },
  {
    id: 'urfa_crit',
    name: 'Blazing Urfa Chili Pepper Crunch',
    icon: 'citrus_crit',
    baseCost: 95000,
    costMult: 1.85,
    maxLevel: 10,
    type: 'crit_chance',
    value: 0.04,
    desc: 'Dark sun-dried isot pepper flakes so fiery your screen starts sweating. +4% Critical Splash Chance per level.',
  },
  {
    id: 'bazaar_rolex',
    name: 'Grand Bazaar "Genuine Fake" Rolex',
    icon: 'coin',
    baseCost: 280000,
    costMult: 1.7,
    type: 'flat_click',
    value: 8200,
    desc: '100% authentic imitation Swiss chronometer haggled down after 3 glasses of apple tea. +8,200 Vibes per click.',
  },
  {
    id: 'tea_rush',
    name: 'Skibidi Turkish Çay Overdose',
    icon: 'tea',
    baseCost: 1200000,
    costMult: 1.72,
    type: 'flat_click',
    value: 38000,
    desc: 'Consuming 35 scalding-hot tulip glasses of black Rize tea per hour. Your clicking finger vibrates through space. +38,000 Vibes per click.',
  },
  {
    id: 'coffee_crit_mult',
    name: 'Turkish Coffee Fortune Reading',
    icon: 'crit_damage',
    baseCost: 4500000,
    costMult: 2.0,
    maxLevel: 10,
    type: 'crit_mult',
    value: 2.5,
    desc: 'Flipping the coffee cup to reveal the ancient prophecy of devastating critical splats. +2.5x Critical Splash Multiplier.',
  },
  {
    id: 'dimcay_dip',
    name: 'Dimçay Mountain River Ice Dip',
    icon: 'water_bottle',
    baseCost: 18000000,
    costMult: 1.75,
    type: 'flat_click',
    value: 240000,
    desc: 'Submerging your hooves in 4°C mountain runoff while eating grilled trout on a floating river bed. +240,000 Vibes per click.',
  },
  {
    id: 'teleferik_gondola',
    name: 'Alanya Teleferik High-Altitude Mog',
    icon: 'cable_car',
    baseCost: 95000000,
    costMult: 1.76,
    type: 'flat_click',
    value: 1200000,
    desc: 'Riding the cable car 300 meters above the sea cliffs, looking down at mortals with zero rizz. +1.2M Vibes per click.',
  },
  {
    id: 'cps_kinetic_doner',
    name: 'Giant Döner Spit Kinetic Dynamo',
    icon: 'kebab',
    baseCost: 450000000,
    costMult: 2.15,
    maxLevel: 10,
    type: 'cps_to_click',
    value: 0.025,
    desc: 'Hooking the 200kg rotating döner meat spit to your click motor. Each click harvests +2.5% of total passive CPS!',
  },
  {
    id: 'red_tower_cannonball',
    name: 'Red Tower Fortress Cannonball Dive',
    icon: 'pirate_ship',
    baseCost: 2500000000, // 2.5B
    costMult: 1.8,
    type: 'flat_click',
    value: 18000000,
    desc: 'Jumping off the 13th-century Seljuk castle battlements directly into the lagoon. +18M Vibes per click.',
  },
  {
    id: 'brap_frenzy',
    name: 'Brap Taurine Pool Party Bomb',
    icon: 'frenzy_boost',
    baseCost: 14000000000, // 14B
    costMult: 2.2,
    maxLevel: 10,
    type: 'frenzy_power',
    value: 0.8,
    desc: 'Suspicious 1000mg taurine energy drink from an Alanya night store. Increases Frenzy Multiplier by +0.8x!',
  },
  {
    id: 'sultan_gold_hoof',
    name: 'Seljuk Sultan 24K Golden Horseshoe',
    icon: 'crown',
    baseCost: 85000000000, // 85B
    costMult: 1.85,
    type: 'flat_click',
    value: 320000000,
    desc: 'Hand-hammered gold shoes engraved with ancient Ottoman water blessing runes. +320M Vibes per click.',
  },
  {
    id: 'cleopatra_mud',
    name: 'Cleopatra Mineral Mud Armor',
    icon: 'gem',
    baseCost: 600000000000, // 600B
    costMult: 1.9,
    type: 'flat_click',
    value: 2800000000,
    desc: 'Thick volcanic mineral mud straight from Damlataş caves. +2.8B Vibes per click.',
  },
  {
    id: 'shisha_cloud',
    name: 'Apple-Mint Shisha Tornado Vapor',
    icon: 'cloud',
    baseCost: 4500000000000, // 4.5T
    costMult: 1.95,
    type: 'flat_click',
    value: 24000000000,
    desc: 'Puffing thick minty clouds by the infinity pool. The Llama achieves omnipotence. +24B Vibes per click.',
  },
  {
    id: 'quantum_laser_doner',
    name: 'Quantum Laser Döner Carver 3000',
    icon: 'kebab',
    baseCost: 35000000000000, // 35T
    costMult: 2.0,
    type: 'flat_click',
    value: 220000000000,
    desc: 'Subatomic laser beams slicing döner meat at relativistic speeds. +220B Vibes per click.',
  },
];

/**
 * HELPERS / ALANYA BUSINESSES (Passive CPS Empire)
 * 16 Deep Tiers scaling from 30 Vibes up to 15 Quadrillion (15Qa) Vibes!
 */
export const HELPERS = [
  {
    id: 'maras_guy',
    name: 'Maraş Dondurma Trickster',
    icon: 'ice_cream',
    baseCost: 30,
    baseCps: 1,
    color: '#38bdf8',
    desc: 'Clangs his brass bell and tricks sunburnt tourists with the metal stick. The Llama watches in silent awe.',
  },
  {
    id: 'doner_spit',
    name: 'Rotating Döner Kebab Spit',
    icon: 'kebab',
    baseCost: 200,
    baseCps: 7,
    color: '#fb923c',
    desc: 'Slow-spinning vertical meat tower shaved with an electric trimmer. The aroma drives the entire beach wild.',
  },
  {
    id: 'durum_shack',
    name: '5 AM Alanya Dürüm Shack',
    icon: 'durum',
    baseCost: 1600,
    baseCps: 42,
    color: '#facc15',
    desc: 'Open all night feeding partygoers sizzling grilled meat wraps dripping in garlic sauce. Pure profit.',
  },
  {
    id: 'pide_pizza_oven',
    name: 'Beachside Pide & Pizza Oven',
    icon: 'pizza',
    baseCost: 14000,
    baseCps: 260,
    color: '#f97316',
    desc: 'Wood-fired canoe flatbreads bubbling with kasar cheese, spicy sucuk, and cracked egg yolks.',
  },
  {
    id: 'baklava_palace',
    name: 'Grand Antep Baklava Palace',
    icon: 'baklava',
    baseCost: 110000,
    baseCps: 1600,
    color: '#a3e635',
    desc: 'Tourists buying 10-kilo tin boxes of sticky green pistachio diamonds to pack into their overhead luggage.',
  },
  {
    id: 'banana_boat',
    name: 'Cleopatra Beach Banana Boat Driver',
    icon: 'rubber_duck',
    baseCost: 850000,
    baseCps: 11000,
    color: '#fbbf24',
    desc: 'Speedboat pilot whose personal mission in life is flipping 8 Danish teenagers into the sea at 45 mph.',
  },
  {
    id: 'bazaar_boutique',
    name: 'Grand Bazaar "Good Price" Boutique',
    icon: 'coin',
    baseCost: 6800000, // 6.8M
    baseCps: 75000,
    color: '#ec4899',
    desc: 'Gucci, Prada, Balenciaga sewn down the alley. "100% genuine fake for you my brother!"',
  },
  {
    id: 'dimcay_raft',
    name: 'Dimçay River Floating Picnic Raft',
    icon: 'water_bottle',
    baseCost: 55000000, // 55M
    baseCps: 520000,
    color: '#22d3ee',
    desc: 'Floating dining tables anchored in icy mountain rapids. Feet frozen, belly full of buttered river trout.',
  },
  {
    id: 'pirate_ship',
    name: 'Red Tower Pirate Foam Party Ship',
    icon: 'pirate_ship',
    baseCost: 480000000, // 480M
    baseCps: 3800000,
    color: '#a855f7',
    desc: 'Triple-decker wooden galleon blasting 2012 festival EDM while coating 300 tourists in industrial soap bubbles.',
  },
  {
    id: 'damlatas_cave',
    name: 'Damlataş Healing Salt Cave Spa',
    icon: 'gem',
    baseCost: 4200000000, // 4.2B
    baseCps: 29000000,
    color: '#10b981',
    desc: '15,000-year-old stalactites and 95% humidity. Breathing the mineral air cures all mundane stress.',
  },
  {
    id: 'teleferik_system',
    name: 'Alanya Teleferik Cableway Grid',
    icon: 'cable_car',
    baseCost: 38000000000, // 38B
    baseCps: 220000000,
    color: '#06b6d4',
    desc: 'Hundreds of glass gondolas soaring up to the castle crags carrying legions of selfie-taking vibe seekers.',
  },
  {
    id: 'tea_monolith',
    name: 'Turkish Rize Çay Megaplant',
    icon: 'tea',
    baseCost: 350000000000, // 350B
    baseCps: 1800000000,
    color: '#ef4444',
    desc: 'Industrial brass samovars brewing 50,000 liters of scalding black tea every second. Absolute national pride.',
  },
  {
    id: 'superyacht_fleet',
    name: 'Mediterranean Superyacht Fleet',
    icon: 'jet_ski',
    baseCost: 4000000000000, // 4T
    baseCps: 16000000000,
    color: '#fbbf24',
    desc: 'Golden superyachts anchored off Cleopatra headland with helipads, jet skis, and iced champagne.',
  },
  {
    id: 'salt_crypto_vault',
    name: 'Subterranean Salt Cave Crypto Vault',
    icon: 'tinfoil_capy',
    baseCost: 55000000000000, // 55T
    baseCps: 180000000000,
    color: '#8b5cf6',
    desc: 'Mining Proof-of-Chill tokens cooled by ancient stalactite mineral springs beneath the Seljuk fortress.',
  },
  {
    id: 'cosmic_bazaar',
    name: 'Cosmic Sultan Hover-Bazaar',
    icon: 'crown',
    baseCost: 800000000000000, // 800T
    baseCps: 2200000000000,
    color: '#f43f5e',
    desc: 'Interdimensional flying bazaars selling döner and baklava to alien tourists across 12 dimensions.',
  },
  {
    id: 'sun_dyson',
    name: 'Dyson Sphere Mediterranean Sun Engine',
    icon: 'sun',
    baseCost: 15000000000000000, // 15Qa
    baseCps: 35000000000000,
    color: '#f59e0b',
    desc: 'Enclosing the sun in solar mirrors to direct 100% of solar radiation exclusively to the Alanya infinity pool.',
  },
];

/**
 * REBIRTH PROGRESSION THRESHOLDS
 * Strict single-rebirth non-stacking system:
 * - Each life has a determined threshold of vibes to unlock Rebirth.
 * - Players earn exactly +1 Rebirth token upon reaching the threshold.
 * - If players continue playing past the threshold without rebirthing,
 *   the pending token is strictly capped at 1 (no stacking).
 * - Rebirthing resets the current run vibes and advances to the next tier!
 */
export const REBIRTH_THRESHOLDS = [
  5000000, // Rebirth 1: 5M
  30000000, // Rebirth 2: 30M
  250000000, // Rebirth 3: 250M
  2500000000, // Rebirth 4: 2.5B
  35000000000, // Rebirth 5: 35B
  500000000000, // Rebirth 6: 500B
  8000000000000, // Rebirth 7: 8T
  150000000000000, // Rebirth 8: 150T
  2500000000000000, // Rebirth 9: 2.5Qa
  50000000000000000, // Rebirth 10: 50Qa
];

export function getRebirthThreshold(rebirthCount = 0) {
  const safeCount = Math.max(0, Math.floor(rebirthCount));
  if (safeCount < REBIRTH_THRESHOLDS.length) {
    return REBIRTH_THRESHOLDS[safeCount];
  }
  const maxDefined = REBIRTH_THRESHOLDS[REBIRTH_THRESHOLDS.length - 1];
  const excess = safeCount - (REBIRTH_THRESHOLDS.length - 1);
  return maxDefined * Math.pow(15, excess);
}

/**
 * Returns pending tokens (strictly 0 or 1) based on current run vibes and rebirth count.
 * Never stacks beyond 1!
 */
export function calculateRebirthTokens(runVibes = 0, rebirthCount = 0) {
  const threshold = getRebirthThreshold(rebirthCount);
  return runVibes >= threshold ? 1 : 0;
}

// Backwards-compatibility alias
export const calculateAscensionTokens = calculateRebirthTokens;

export const WEATHERS = [
  {
    id: 'sunny_onsen',
    name: 'Alanya High Noon Sun',
    icon: 'sun',
    unlockVibes: 0,
    bonusText: 'Base Mediterranean Sun (1.0x)',
    mult: 1.0,
    skyColor: 0x38bdf8,
    ambientColor: 0xffffff,
  },
  {
    id: 'cherry_blossom',
    name: 'Cleopatra Golden Hour',
    icon: 'cherry_blossom',
    unlockVibes: 100000, // 100K
    bonusText: '+25% All Vibes & Golden Gleam',
    mult: 1.25,
    skyColor: 0xfb7185,
    ambientColor: 0xfef08a,
  },
  {
    id: 'aurora_borealis',
    name: 'Red Tower Midnight Rave',
    icon: 'aurora_borealis',
    unlockVibes: 10000000, // 10M
    bonusText: '+60% All Vibes & Neon Foam',
    mult: 1.6,
    skyColor: 0x064e3b,
    ambientColor: 0x22d3ee,
  },
  {
    id: 'cosmic_nebula',
    name: 'Dimçay Cosmic Starlight',
    icon: 'cosmic_nebula',
    unlockVibes: 1000000000, // 1B
    bonusText: '+150% All Vibes & Zero Gravity',
    mult: 2.5,
    skyColor: 0x312e81,
    ambientColor: 0xc084fc,
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'click_1',
    name: 'First Splash in Alanya',
    desc: 'Booped the Llama once in the turquoise pool.',
    conditionType: 'clicks',
    threshold: 1,
    icon: 'sparkle',
  },
  {
    id: 'click_100',
    name: 'Cleopatra Beach Regular',
    desc: 'Clicked 100 times. Sunscreen is starting to absorb.',
    conditionType: 'clicks',
    threshold: 100,
    icon: 'rubber_duck',
  },
  {
    id: 'click_1000',
    name: 'Mewing Master',
    desc: 'Clicked 1,000 times. Jawline is sharp enough to slice döner.',
    conditionType: 'clicks',
    threshold: 1000,
    icon: 'kebab',
  },
  {
    id: 'click_10000',
    name: 'Unspoken Turkish Rizz',
    desc: 'Clicked 10,000 times. Even the Maraş ice cream guy respected you.',
    conditionType: 'clicks',
    threshold: 10000,
    icon: 'ice_cream',
  },
  {
    id: 'vibes_10k',
    name: 'Baklava Beginner',
    desc: 'Amassed 10,000 Lifetime Vibes.',
    conditionType: 'lifetimeVibes',
    threshold: 10000,
    icon: 'baklava',
  },
  {
    id: 'vibes_1m',
    name: 'Alanya Millionaire',
    desc: 'Reached 1,000,000 Lifetime Vibes. Ready for your first Rebirth!',
    conditionType: 'lifetimeVibes',
    threshold: 1000000,
    icon: 'coin',
  },
  {
    id: 'vibes_100m',
    name: 'Grand Bazaar Mogul',
    desc: 'Reached 100,000,000 Lifetime Vibes.',
    conditionType: 'lifetimeVibes',
    threshold: 100000000,
    icon: 'gem',
  },
  {
    id: 'vibes_1b',
    name: 'Teleferik Sultan',
    desc: 'Reached 1,000,000,000 Lifetime Vibes.',
    conditionType: 'lifetimeVibes',
    threshold: 1000000000,
    icon: 'cable_car',
  },
  {
    id: 'vibes_1t',
    name: 'Mediterranean Emperor',
    desc: 'Reached 1,000,000,000,000 Lifetime Vibes.',
    conditionType: 'lifetimeVibes',
    threshold: 1000000000000,
    icon: 'crown',
  },
  {
    id: 'helpers_25',
    name: 'Dürüm Cartel',
    desc: 'Own 25 total Alanya businesses and helpers.',
    conditionType: 'totalHelpers',
    threshold: 25,
    icon: 'durum',
  },
  {
    id: 'helpers_100',
    name: 'Cleopatra Beach Syndicate',
    desc: 'Own 100 total Alanya businesses and helpers.',
    conditionType: 'totalHelpers',
    threshold: 100,
    icon: 'pizza',
  },
  {
    id: 'helpers_250',
    name: 'Turkish Riviera Monopoly',
    desc: 'Own 250 total Alanya businesses and helpers.',
    conditionType: 'totalHelpers',
    threshold: 250,
    icon: 'pirate_ship',
  },
  {
    id: 'frenzy_5',
    name: 'Foam Party Demon',
    desc: 'Triggered Pool Party Frenzy 5 times.',
    conditionType: 'frenzy',
    threshold: 5,
    icon: 'flame',
  },
  {
    id: 'golden_5',
    name: 'Flying Piñata Hunter',
    desc: 'Caught 5 Golden Flying Piñata Llamas in the Alanya sky.',
    conditionType: 'golden',
    threshold: 5,
    icon: 'gift',
  },
  {
    id: 'rebirth_1',
    name: 'The First Rebirth',
    desc: 'Rebirthed your empire to gain permanent Golden Citrus tokens.',
    conditionType: 'rebirth',
    threshold: 1,
    icon: 'tab_rebirth',
  },
];

export const NEWS_HEADLINES = [
  'BREAKING: Local Alanya Llama achieves maximum unspoken rizz after consuming 4 Antep baklavas.',
  'TOURIST ALERT: Danish family still waiting for ice cream cone after 45 minutes of Maraş tricks.',
  'CLEOPATRA BEACH: Jet skis confirmed to be 400% louder than commercial NASA rockets.',
  'DIMÇAY RIVER: Trout reportedly vibing to 24/7 Turkish phonk bassline at floating tables.',
  'ALANYA CASTLE GONDOLA: Cable cars delayed as passengers refuse to stop booping the llama.',
  'GRAND BAZAAR: Merchant awards "Honorary Genuine Fake Gucci" diploma to local floatie llama.',
  'RED TOWER PIRATE FOAM PARTY: 300 tourists declare sovereign micronation of pure foam.',
  'HEALTH UPDATE: Drinking 40 tulip glasses of hot black çay per day linked to infinite CPS.',
  'WEATHER REPORT: 100% chance of sun, turquoise waves, and zero Monday morning thoughts in Alanya.',
  'ECONOMY SHOCK: Dürüm wrap prices surge as Llama purchases 500,000 units in bulk.',
];

export const CAPY_QUOTES = [
  'Unspoken Maraş ice cream rizz in the air.',
  'Extra garlic sumac sauce on the dürüm, bro. Don’t be shy.',
  'Mewing on the sprinkle donut floatie since 8 AM.',
  'The pelican tried to steal my baklava. He paid the price.',
  'Good price for you my friend, 100% genuine fake.',
  'Skibidi beach waves crashing on Cleopatra sand.',
  'One more glass of hot Turkish çay and I will ascend to nirvana.',
  'Alanya Castle is mogging the entire Mediterranean bay right now.',
  'The banana boat captain took a personal vendetta against my floatie.',
  'Floating at Dimçay. Water is 4°C, vibes are 100°C.',
  'Bro is literally locked in on the luxury pool floatie.',
  'No thoughts, just 40 layers of crispy Antep pistachio baklava.',
];
