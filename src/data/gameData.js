/**
 * LLAMA SPLASH CLICKER — Complete Game Design Data & Balancing
 * Zero OS text emojis — all icons map to custom vector SVG keys in GameIcons.jsx
 */

const SUFFIXES = [
  { value: 1e27, symbol: 'Oc' },
  { value: 1e24, symbol: 'Sp' },
  { value: 1e21, symbol: 'Sx' },
  { value: 1e18, symbol: 'Qi' },
  { value: 1e15, symbol: 'Qa' },
  { value: 1e12, symbol: 'T' },
  { value: 1e9, symbol: 'B' },
  { value: 1e6, symbol: 'M' },
  { value: 1e3, symbol: 'K' },
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

export const MILESTONE_THRESHOLDS = [10, 25, 50, 100];

export const EVOLUTIONS = [
  {
    id: 'wet_capy',
    name: 'Poolside Chill Llama',
    icon: 'llama',
    minVibes: 0,
    minLifetimeVibes: 0,
    title: 'Lounging in the Donut Float',
    desc: 'Fluffy Andean wool soaked in warm lagoon water inside a strawberry-frosted donut ring. Zero thoughts, head empty.',
    accent: '#f59e0b',
    bonusText: 'Base Vibes (1.0x)',
    mult: 1,
  },
  {
    id: 'chill_bro',
    name: 'VIP Cabana Llama',
    icon: 'llama',
    minVibes: 250,
    minLifetimeVibes: 250,
    title: 'Unbothered & Sun-Kissed',
    desc: 'Equips 3D pixel Deal-With-It shades and a chunky gold chain. Immune to Monday morning emails.',
    accent: '#38bdf8',
    bonusText: '+15% Global Vibes',
    mult: 1.15,
  },
  {
    id: 'tinfoil_capy',
    name: 'Tin-Foil Truther Llama',
    icon: 'tinfoil_capy',
    minVibes: 3500,
    minLifetimeVibes: 3500,
    title: 'The Pelicans Are Drones',
    desc: 'Wears a spinning 3D tin-foil pyramid hat. Knows what really happened to the resort wave machine.',
    accent: '#a3e635',
    bonusText: '+35% Global Vibes',
    mult: 1.35,
  },
  {
    id: 'wizard_capy',
    name: 'Grand Arch-Mage Llama',
    icon: 'wizard_capy',
    minVibes: 45000,
    minLifetimeVibes: 45000,
    title: 'Pondering The Tidal Orb',
    desc: '3D enchanted wizard hat with orbiting arcane runes. Casts "Tsunami Cannonball" at 9th level.',
    accent: '#c084fc',
    bonusText: '+75% Global Vibes',
    mult: 1.75,
  },
  {
    id: 'baron_capy',
    name: '24K Monopoly Llama-illionaire',
    icon: 'crown',
    minVibes: 600000,
    minLifetimeVibes: 600000,
    title: 'Too Fluffy To Fail',
    desc: 'Solid 24-karat gold metallic fleece, floating royal crown, and offshore waterpark tax shelters.',
    accent: '#fbbf24',
    bonusText: '+150% Global Vibes',
    mult: 2.5,
  },
  {
    id: 'cyber_capy',
    name: 'Cyber-Llama 2099',
    icon: 'cyber_capy',
    minVibes: 10000000,
    minLifetimeVibes: 10000000,
    title: 'Overclocked Serotonin',
    desc: 'Neon synthwave visor and holographic wireframe aura. Mines tropical vibes directly on the blockchain.',
    accent: '#2dd4bf',
    bonusText: '+300% Global Vibes',
    mult: 4.0,
  },
  {
    id: 'biblical_capy',
    name: 'Biblically Accurate Llama',
    icon: 'biblical_capy',
    minVibes: 250000000,
    minLifetimeVibes: 250000000,
    title: 'BE NOT STRESSED',
    desc: 'Surrounded by 3 interlocking spinning golden seraphim rings studded with all-seeing eyes. Pure cosmic peace.',
    accent: '#f43f5e',
    bonusText: '+700% Global Vibes',
    mult: 8.0,
  },
];

export const CLICK_UPGRADES = [
  {
    id: 'yuzu_polish',
    name: 'Artisanal Fleece Conditioner',
    icon: 'yuzu_polish',
    baseCost: 20,
    costMult: 1.45,
    type: 'flat_click',
    value: 2,
    desc: 'Fluffs the Llama wool to cloud-nine softness. +2 Vibes per splash boop.',
  },
  {
    id: 'double_boop',
    name: 'Double-Hoof Splash Technique',
    icon: 'double_boop',
    baseCost: 120,
    costMult: 1.55,
    type: 'flat_click',
    value: 8,
    desc: 'Ancient poolside martial art passed down by Andean monks. +8 Vibes per boop.',
  },
  {
    id: 'citrus_crit',
    name: 'Spicy Chili Mango Smoothie',
    icon: 'citrus_crit',
    baseCost: 450,
    costMult: 1.75,
    maxLevel: 10,
    type: 'crit_chance',
    value: 0.03,
    desc: 'Increases Critical Splash chance by +3% per level.',
  },
  {
    id: 'crit_damage',
    name: 'Acoustic Wave Resonance',
    icon: 'crit_damage',
    baseCost: 1200,
    costMult: 1.8,
    maxLevel: 10,
    type: 'crit_mult',
    value: 2,
    desc: 'Critical Splashes trigger massive pool waves. +2x Critical multiplier.',
  },
  {
    id: 'cps_synergy_1',
    name: 'Hydro-Kinetic Wave Turbine',
    icon: 'cps_synergy_1',
    baseCost: 3000,
    costMult: 1.85,
    maxLevel: 10,
    type: 'cps_to_click',
    value: 0.02,
    desc: 'Each click also harvests +2% of your total passive Vibes/sec (CPS)!',
  },
  {
    id: 'frenzy_boost',
    name: 'Double-Espresso Pool Bomb',
    icon: 'frenzy_boost',
    baseCost: 9500,
    costMult: 1.75,
    maxLevel: 8,
    type: 'frenzy_power',
    value: 0.5,
    desc: 'Increases Frenzy multiplier by +0.5x when the Fever bar hits 100%.',
  },
  {
    id: 'quantum_cursor',
    name: 'Bionic Splash Wristbrace',
    icon: 'quantum_cursor',
    baseCost: 42000,
    costMult: 1.6,
    type: 'flat_click',
    value: 450,
    desc: 'Waterproof RGB ergonomic support. +450 Base Vibes per click.',
  },
  {
    id: 'cosmic_boop',
    name: 'Tectonic Cannonball Dive',
    icon: 'cosmic_boop',
    baseCost: 500000,
    costMult: 1.65,
    type: 'flat_click',
    value: 6500,
    desc: 'Registers on the Richter scale. +6,500 Base Vibes per click.',
  },
];

export const HELPERS = [
  {
    id: 'rubber_duck',
    name: 'Sentient Rubber Duck',
    icon: 'rubber_duck',
    baseCost: 15,
    baseCps: 1,
    color: '#fbbf24',
    desc: 'Squeaks encouragingly in the lagoon waves. Emotional support pool navigator.',
  },
  {
    id: 'intern',
    name: 'Unpaid Cabana Lifeguard',
    icon: 'intern',
    baseCost: 100,
    baseCps: 8,
    color: '#38bdf8',
    desc: 'Paid entirely in college credit and melted popsicles. Keeps the donut inflated.',
  },
  {
    id: 'pelican',
    name: 'Confused Pelican Courier',
    icon: 'pelican',
    baseCost: 1100,
    baseCps: 65,
    color: '#fb923c',
    desc: 'Tries to land on the Llama, slips off the donut float, and generates Vibes instead.',
  },
  {
    id: 'slop_server',
    name: 'Tropical Lo-Fi Boombox Rig',
    icon: 'slop_server',
    baseCost: 12000,
    baseCps: 480,
    color: '#a855f7',
    desc: '10,000 waterproof subwoofers blasting 24/7 "chill llama beats to float to".',
  },
  {
    id: 'influencer',
    name: 'TikTok Llama Pool Cult',
    icon: 'influencer',
    baseCost: 130000,
    baseCps: 3800,
    color: '#ec4899',
    desc: 'Millions of mesmerized viewers livestreaming the Llama lounging in HD.',
  },
  {
    id: 'yuzu_shrine',
    name: 'Offshore Resort Tax Haven',
    icon: 'yuzu_shrine',
    baseCost: 1400000,
    baseCps: 32000,
    color: '#ef4444',
    desc: 'Sacred Cayman Islands lagoon where Vibes compound completely tax-free.',
  },
  {
    id: 'collider',
    name: 'Large Hadron Wave Collider',
    icon: 'collider',
    baseCost: 20000000,
    baseCps: 380000,
    color: '#06b6d4',
    desc: 'Smashes subatomic water droplets together at 99.99% the speed of chill.',
  },
  {
    id: 'time_tub',
    name: '4D Relativistic Lazy River',
    icon: 'time_tub',
    baseCost: 330000000,
    baseCps: 5200000,
    color: '#10b981',
    desc: 'Harvests retroactive summer vacations from alternate timelines.',
  },
  {
    id: 'dyson_sphere',
    name: 'Dyson Sphere Waterpark',
    icon: 'dyson_sphere',
    baseCost: 5500000000,
    baseCps: 75000000,
    color: '#f59e0b',
    desc: 'Encloses an entire star inside a colossal inflatable pool donut.',
  },
];

export const WEATHERS = [
  {
    id: 'sunny_onsen',
    name: 'Tropical Tradewind Breeze',
    icon: 'sunny_onsen',
    unlockVibes: 0,
    bonusText: 'Default Lagoon Ambiance',
    mult: 1.0,
  },
  {
    id: 'sakura',
    name: 'Hibiscus Petal Storm',
    icon: 'sakura',
    unlockVibes: 1000,
    bonusText: '+5% Global Vibes',
    mult: 1.05,
  },
  {
    id: 'gold_rain',
    name: 'Tax-Free Coin Shower',
    icon: 'gold_rain',
    unlockVibes: 25000,
    bonusText: '+10% Global Vibes',
    mult: 1.1,
  },
  {
    id: 'matrix',
    name: 'Synthwave Cyber Grid',
    icon: 'matrix',
    unlockVibes: 500000,
    bonusText: '+15% Global Vibes',
    mult: 1.15,
  },
  {
    id: 'cosmic',
    name: 'Astral Nebula Lagoon',
    icon: 'cosmic',
    unlockVibes: 15000000,
    bonusText: '+25% Global Vibes',
    mult: 1.25,
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'first_boop',
    name: 'First Splash',
    desc: 'Boop the Pool Llama for the very first time.',
    icon: 'double_boop',
    conditionType: 'clicks',
    threshold: 1,
  },
  {
    id: 'carpal_intern',
    name: 'Wave Maker Intern',
    desc: 'Splash the Llama 100 times.',
    icon: 'skill_splashstorm',
    conditionType: 'clicks',
    threshold: 100,
  },
  {
    id: 'touch_grass',
    name: 'Pruned Fingers',
    desc: 'Splash the Llama 500 times without leaving the pool.',
    icon: 'palm',
    conditionType: 'clicks',
    threshold: 500,
  },
  {
    id: 'soggy_hundredaire',
    name: 'Lagoon Thousand-aire',
    desc: 'Earn 1,000 Lifetime Vibes.',
    icon: 'yuzu',
    conditionType: 'lifetimeVibes',
    threshold: 1000,
  },
  {
    id: 'ok_i_pull_up',
    name: 'VIP Cabana Club',
    desc: 'Earn 100,000 Lifetime Vibes.',
    icon: 'llama',
    conditionType: 'lifetimeVibes',
    threshold: 100000,
  },
  {
    id: 'biblically_chill',
    name: 'Biblically Chill Llama',
    desc: 'Reach 100,000,000 Lifetime Vibes.',
    icon: 'biblical_capy',
    conditionType: 'lifetimeVibes',
    threshold: 100000000,
  },
  {
    id: 'pelican_hr',
    name: 'Lifeguard Recruitment',
    desc: 'Own 10 total Pool Helpers.',
    icon: 'pelican',
    conditionType: 'totalHelpers',
    threshold: 10,
  },
  {
    id: 'middle_management',
    name: 'Resort Conglomerate',
    desc: 'Own 50 total Pool Helpers.',
    icon: 'middle_management',
    conditionType: 'totalHelpers',
    threshold: 50,
  },
  {
    id: 'max_overchill',
    name: 'Tidal Wave Frenzy',
    desc: 'Fill the Fever Bar to 100% and trigger Frenzy Mode.',
    icon: 'frenzy_boost',
    conditionType: 'frenzyCount',
    threshold: 1,
  },
  {
    id: 'frenzy_addict',
    name: 'Permanent Sunburn',
    desc: 'Trigger Frenzy Mode 5 times.',
    icon: 'skill_sunburn',
    conditionType: 'frenzyCount',
    threshold: 5,
  },
  {
    id: 'golden_hunter',
    name: 'Golden Pinata Hunter',
    desc: 'Catch 1 Flying Golden Pinata Llama in the 3D sky.',
    icon: 'gift',
    conditionType: 'goldenCatches',
    threshold: 1,
  },
  {
    id: 'transcendental_rodent',
    name: 'Astral Lagoon VIP',
    desc: 'Ascend at least once at the Ascension Shrine.',
    icon: 'tab_ascend',
    conditionType: 'ascensions',
    threshold: 1,
  },
];

export const NEWS_HEADLINES = [
  {
    minVibes: 0,
    text: 'BREAKING: Local Llama refuses to exit inflatable strawberry donut ring; claims water temperature is "immaculate."',
  },
  {
    minVibes: 50,
    text: 'POOL REPORT: Sentient rubber ducks form synchronized swimming union around the island.',
  },
  {
    minVibes: 250,
    text: 'FASHION ALERT: Llama puts on pixel sunglasses; global stress levels plummet by 42%.',
  },
  {
    minVibes: 1500,
    text: 'ORNITHOLOGY NEWS: Confused pelicans attempt to land on Llama donut float, bounce off into orbit.',
  },
  {
    minVibes: 8000,
    text: 'WALL STREET: S&P 500 officially replaced by the Llama Splash Index (LSI).',
  },
  {
    minVibes: 50000,
    text: 'ARCANE UPDATE: Grand Arch-Mage Llama summons a 9th-level Tsunami Wave just to cool his hooves.',
  },
  {
    minVibes: 500000,
    text: 'ECONOMIC SUMMIT: 94% of global GDP is now stored in offshore tropical lazy rivers.',
  },
  {
    minVibes: 10000000,
    text: 'CYBERPUNK 2099: Humanity uploads consciousness into a shared holographic pool floatie.',
  },
  {
    minVibes: 250000000,
    text: 'COSMIC BULLETIN: Biblically Accurate Llama appears in sky with golden rings; tells humanity "BE NOT STRESSED."',
  },
];

export const CAPY_QUOTES = [
  'no drama just llama',
  'zero thoughts head empty',
  'donut floatie supremacy',
  'tax evasion is a mindset',
  'make some waves bro',
  'more mango smoothies pls',
  'im literally just floating',
  'vibes compounding nicely',
  '100% organic alpaca wool',
  'monday is a social construct',
  'unbothered. moisturized.',
  'splash me for good luck',
  'water temp: immaculate',
  'sunscreen? my wool is SPF 500',
  'no talk me im lounging',
  'my lawyer is a rubber duck',
  'vibe check: passed',
  'do not disturb (ever)',
  'reject hustle embrace floatie',
  'pelican tried it again smh',
  'in my tropical lagoon era',
  'BE NOT STRESSED',
];
