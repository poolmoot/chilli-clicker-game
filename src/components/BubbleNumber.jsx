import React, { useMemo } from 'react';

/**
 * BubbleNumber Component
 * Renders vibrant graffiti cartoon bubble numbers matching the user's reference image:
 * - Ultra-chunky, bulbous bubble letter glyphs
 * - Multi-layer 3D extruded block shadow (deep crimson / amber / midnight navy)
 * - Heavy dark outline contour (black/maroon)
 * - Vibrant gradient fill (bubblegum candy pink, golden crit, electric frenzy cyan)
 * - Glossy white specular shine capsules & reflection dots on the top lobes of the bubbles
 * - Floating cartoon halo, bottom drip droplets, and 4-point comic sparkle stars
 */
export default function BubbleNumber({
  text = '+7.7',
  isCrit = false,
  isGolden = false,
  isFrenzy = false,
  rotation = 0,
}) {
  // Determine color scheme based on click state
  const { gradId, shadowColor, shadowDark, strokeColor, haloColor, dripColor } = useMemo(() => {
    if (isGolden) {
      return {
        gradId: 'bubble-grad-gold',
        shadowColor: '#d97706',
        shadowDark: '#78350f',
        strokeColor: '#451a03',
        haloColor: '#fde047',
        dripColor: '#f59e0b',
      };
    }
    if (isCrit) {
      return {
        gradId: 'bubble-grad-crit',
        shadowColor: '#ea580c',
        shadowDark: '#7c2d12',
        strokeColor: '#2b0c03',
        haloColor: '#fbbf24',
        dripColor: '#f97316',
      };
    }
    if (isFrenzy) {
      return {
        gradId: 'bubble-grad-frenzy',
        shadowColor: '#0284c7',
        shadowDark: '#082f49',
        strokeColor: '#021e33',
        haloColor: '#38bdf8',
        dripColor: '#06b6d4',
      };
    }
    // Default: Bubblegum Candy Pink (matches user reference "BUBBLE LETTERS" exactly!)
    return {
      gradId: 'bubble-grad-pink',
      shadowColor: '#be123c',
      shadowDark: '#700c28',
      strokeColor: '#1a030b',
      haloColor: '#f43f5e',
      dripColor: '#ec4899',
    };
  }, [isCrit, isGolden, isFrenzy]);

  // Clean label string and extract characters for positioning shine glints
  const label = String(text);
  const isSpecial = isCrit || isGolden || isFrenzy;
  const showHalo = isSpecial || label.length > 5;

  // Approximate dimensions based on text length
  const charCount = label.length;
  const svgWidth = Math.max(120, charCount * 22 + 40);
  const svgHeight = 76;
  const textX = svgWidth / 2;
  const textY = 48;

  // Compute 2-3 specular shine pill offsets across the text width
  const shinePills = useMemo(() => {
    const pills = [];
    const span = Math.min(svgWidth - 44, charCount * 18);
    const startX = textX - span / 2;
    const count = Math.min(4, Math.max(2, Math.floor(charCount * 0.75)));
    for (let i = 0; i < count; i++) {
      const px = startX + (i / Math.max(1, count - 1)) * span;
      pills.push({
        x: px + (i % 2 === 0 ? -2 : 4),
        y: 27 + (i % 2 === 0 ? 0 : 3),
        w: i === 0 ? 11 : 9,
        h: 4,
        dotX: px + 12,
        dotY: 34,
      });
    }
    return pills;
  }, [charCount, svgWidth, textX]);

  // Drip droplets hanging from bottom
  const drips = useMemo(() => {
    if (!isSpecial && Math.random() > 0.6) return [];
    return [
      { x: textX - 18, y: 55, h: 7 },
      { x: textX + 16, y: 56, h: 9 },
    ];
  }, [isSpecial, textX]);

  return (
    <div
      className="relative pointer-events-none select-none drop-shadow-xl inline-block"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Bubblegum Candy Pink (Image Reference match) */}
          <linearGradient id="bubble-grad-pink" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffa6d2" />
            <stop offset="30%" stopColor="#ff59a3" />
            <stop offset="75%" stopColor="#eb186f" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Golden Sunburst Crit */}
          <linearGradient id="bubble-grad-crit" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#facc15" />
            <stop offset="75%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Golden Floatie / Jackpot */}
          <linearGradient id="bubble-grad-gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Electric Frenzy Cyan */}
          <linearGradient id="bubble-grad-frenzy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          {/* Specular White Gloss Glint Filter */}
          <filter id="bubble-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Floating Cartoon Halo (from "BUBBLE" 'U' in Reference Image) --- */}
        {showHalo && (
          <g transform={`translate(${textX - 8}, 11) rotate(-8)`}>
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="4.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth="4.5"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="4.5"
              fill="none"
              stroke={haloColor}
              strokeWidth="2.8"
            />
            <ellipse
              cx="-4"
              cy="-1"
              rx="6"
              ry="1.8"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.9"
            />
          </g>
        )}

        {/* --- 3D Extruded Block Shadow (Layered offsets in dark crimson/amber) --- */}
        <text
          x={textX + 5}
          y={textY + 6}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "'Rubik Bubbles', 'DynaPuff', 'Fredoka', cursive, sans-serif",
            fontWeight: 900,
            fontSize: isSpecial ? '32px' : '28px',
          }}
          fill={shadowDark}
          stroke={shadowDark}
          strokeWidth="7"
          strokeLinejoin="round"
        >
          {label}
        </text>

        <text
          x={textX + 4}
          y={textY + 5}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "'Rubik Bubbles', 'DynaPuff', 'Fredoka', cursive, sans-serif",
            fontWeight: 900,
            fontSize: isSpecial ? '32px' : '28px',
          }}
          fill={shadowDark}
          stroke={shadowDark}
          strokeWidth="6"
          strokeLinejoin="round"
        >
          {label}
        </text>

        <text
          x={textX + 2}
          y={textY + 3}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "'Rubik Bubbles', 'DynaPuff', 'Fredoka', cursive, sans-serif",
            fontWeight: 900,
            fontSize: isSpecial ? '32px' : '28px',
          }}
          fill={shadowColor}
          stroke={shadowColor}
          strokeWidth="5"
          strokeLinejoin="round"
        >
          {label}
        </text>

        {/* --- Heavy Dark Outline Contour (Black/Maroon Comic Line) --- */}
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "'Rubik Bubbles', 'DynaPuff', 'Fredoka', cursive, sans-serif",
            fontWeight: 900,
            fontSize: isSpecial ? '32px' : '28px',
          }}
          fill={strokeColor}
          stroke={strokeColor}
          strokeWidth="7"
          strokeLinejoin="round"
        >
          {label}
        </text>

        {/* --- Main Gradient Body Fill --- */}
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "'Rubik Bubbles', 'DynaPuff', 'Fredoka', cursive, sans-serif",
            fontWeight: 900,
            fontSize: isSpecial ? '32px' : '28px',
          }}
          fill={`url(#${gradId})`}
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinejoin="round"
        >
          {label}
        </text>

        {/* --- Gloss Specular Shine Capsules & Dots (Key Signature from Image 2!) --- */}
        <g opacity="0.95">
          {shinePills.map((pill, idx) => (
            <React.Fragment key={idx}>
              {/* Curved glossy shine capsule on top lobe */}
              <rect
                x={pill.x}
                y={pill.y}
                width={pill.w}
                height={pill.h}
                rx={pill.h / 2}
                fill="#ffffff"
                opacity="0.95"
                transform={`rotate(-12, ${pill.x + pill.w / 2}, ${pill.y + pill.h / 2})`}
              />
              {/* Secondary white reflection dot */}
              <circle cx={pill.dotX} cy={pill.dotY} r="2.2" fill="#ffffff" opacity="0.9" />
            </React.Fragment>
          ))}
        </g>

        {/* --- Drip Droplets Hanging Off Bottom Curves --- */}
        {drips.map((drip, idx) => (
          <g key={idx} transform={`translate(${drip.x}, ${drip.y})`}>
            {/* Dark outline */}
            <path
              d={`M -3 0 C -3 ${drip.h * 0.7} -4 ${drip.h} 0 ${drip.h + 2} C 4 ${drip.h} 3 ${
                drip.h * 0.7
              } 3 0 Z`}
              fill={strokeColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Color fill */}
            <path
              d={`M -2 0 C -2 ${drip.h * 0.7} -3 ${drip.h} 0 ${drip.h + 1} C 3 ${drip.h} 2 ${
                drip.h * 0.7
              } 2 0 Z`}
              fill={dripColor}
            />
            {/* Tiny shine dot */}
            <circle cx="0.5" cy={drip.h * 0.65} r="1" fill="#ffffff" />
          </g>
        ))}

        {/* --- 4-Point Comic Sparkle Star Accent --- */}
        {isSpecial && (
          <path
            d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Q 0 0 0 -8 Z"
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth="1.2"
            transform={`translate(${textX + svgWidth * 0.38}, 22) scale(1.1)`}
            filter="url(#bubble-glow)"
          />
        )}
      </svg>
    </div>
  );
}
