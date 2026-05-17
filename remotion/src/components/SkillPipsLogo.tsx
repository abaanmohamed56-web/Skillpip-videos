import React from "react";

/* ─────────────────────────────────────────────────────────
   SkillPips crest logo — hand-traced SVG recreation.
   ViewBox: 0 0 400 448
   uid prop ensures unique clipPath IDs when rendered
   multiple times in the same document.
───────────────────────────────────────────────────────── */

const G = "#E8CA6C"; // warm gold
const N = "#1B3554"; // dark navy
const C = "#8B2030"; // crimson red

const OUTER =
  "M62,24 L338,24 C355,24 364,40 364,60 L364,228 C364,316 200,381 200,381 C200,381 36,316 36,228 L36,60 C36,40 45,24 62,24 Z";
const INNER =
  "M70,33 L330,33 C344,33 353,48 353,67 L353,225 C353,310 200,368 200,368 C200,368 47,310 47,225 L47,67 C47,48 56,33 70,33 Z";

export const SkillPipsLogo: React.FC<{
  size?: number;
  uid?: string;
  style?: React.CSSProperties;
}> = ({ size = 400, uid = "spLogo0", style }) => {
  const clip = `${uid}Cl`;

  return (
    <svg
      viewBox="0 0 400 448"
      width={size}
      height={Math.round((size * 448) / 400)}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <defs>
        <clipPath id={clip}>
          <path d={INNER} />
        </clipPath>
      </defs>

      {/* ── Banner (behind shield) ────────────────── */}
      {/* Left curl flap */}
      <path
        d="M28,350 L20,360 L5,367 L7,380 L20,380 L28,428 L28,350 Z"
        fill={N}
        stroke={G}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right curl flap */}
      <path
        d="M372,350 L380,360 L395,367 L393,380 L380,380 L372,428 L372,350 Z"
        fill={N}
        stroke={G}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Main ribbon body */}
      <path
        d="M28,350 L372,350 L380,360 L380,418 L372,428 L28,428 L20,418 L20,360 Z"
        fill={N}
        stroke={G}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Fold lines */}
      <line x1="28" y1="350" x2="28" y2="428" stroke={G} strokeWidth="1.5" />
      <line x1="372" y1="350" x2="372" y2="428" stroke={G} strokeWidth="1.5" />

      {/* ── Shield gold border ────────────────────── */}
      <path d={OUTER} fill={G} />

      {/* ── Shield interior (clipped) ────────────── */}
      <g clipPath={`url(#${clip})`}>
        {/* Quadrant fills */}
        <rect x="0" y="0" width="200" height="204" fill={C} />
        <rect x="200" y="0" width="200" height="204" fill={N} />
        <rect x="0" y="204" width="200" height="200" fill={N} />
        <rect x="200" y="204" width="200" height="200" fill={C} />

        {/* Inner border */}
        <path d={INNER} fill="none" stroke={G} strokeWidth="2.5" />

        {/* Cross dividers */}
        <line x1="200" y1="33" x2="200" y2="368" stroke={G} strokeWidth="2.5" />
        <line x1="47" y1="204" x2="353" y2="204" stroke={G} strokeWidth="2.5" />

        {/* ── BEAR (top-left, facing right) ──────── */}
        <g fill={G}>
          {/* Body */}
          <ellipse cx="118" cy="138" rx="46" ry="27" />
          {/* Head */}
          <circle cx="76" cy="116" r="23" />
          {/* Ear left */}
          <ellipse cx="62" cy="98" rx="10" ry="9" />
          {/* Ear right */}
          <ellipse cx="83" cy="95" rx="9" ry="8" />
          {/* Muzzle / snout */}
          <ellipse cx="58" cy="122" rx="13" ry="9" />
          {/* Neck — connects head oval to body */}
          <path d="M93,113 C102,107 113,110 120,122 C116,136 106,144 95,143 C87,139 86,127 93,113 Z" />
          {/* Legs */}
          <rect x="84" y="158" width="14" height="25" rx="5" />
          <rect x="103" y="160" width="14" height="25" rx="5" />
          <rect x="127" y="160" width="14" height="25" rx="5" />
          <rect x="148" y="157" width="14" height="25" rx="5" />
          {/* Tail */}
          <ellipse cx="164" cy="127" rx="8" ry="7" />
        </g>

        {/* ── BULL (top-right, charging left) ─────── */}
        <g fill={G}>
          {/* Body */}
          <ellipse cx="284" cy="141" rx="50" ry="29" />
          {/* Head */}
          <ellipse cx="322" cy="120" rx="26" ry="22" />
          {/* Neck connects head to body */}
          <path d="M298,128 C308,115 320,113 326,122 C328,135 322,149 310,152 C302,148 294,140 298,128 Z" />
          {/* Horn 1 */}
          <path d="M314,105 C316,95 330,86 336,93 C328,97 320,102 314,105 Z" />
          {/* Horn 2 */}
          <path d="M325,102 C329,93 341,90 343,97 C335,101 327,103 325,102 Z" />
          {/* Muzzle */}
          <ellipse cx="340" cy="127" rx="14" ry="10" />
          {/* Legs (hind legs lifted — charging pose) */}
          <rect x="228" y="161" width="14" height="24" rx="5" />
          <rect x="248" y="163" width="14" height="22" rx="5" />
          <rect x="270" y="162" width="14" height="22" rx="5" />
          <rect x="293" y="158" width="14" height="19" rx="5" />
          {/* Tail */}
          <path
            d="M238,132 C226,120 222,107 231,103"
            stroke={G}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="231" cy="103" r="6" />
        </g>

        {/* ── S LETTERMARK (central, spans all 4 quadrants) ── */}
        <text
          x="200"
          y="222"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={G}
          fontSize="205"
          fontWeight="900"
          fontFamily="'Arial Black', 'Arial Bold', Arial, Impact, sans-serif"
        >
          S
        </text>

        {/* ── CHART ARROW (bottom-left) ────────────── */}
        <polyline
          points="60,318 82,294 104,308 128,272 152,287 172,252"
          fill="none"
          stroke={G}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrow head */}
        <polygon points="160,240 176,257 153,263" fill={G} />

        {/* ── CANDLESTICKS (bottom-right) ──────────── */}
        {/* Candle 1 — bearish (crimson body) */}
        <line x1="239" y1="255" x2="239" y2="322" stroke={G} strokeWidth="2" />
        <rect x="230" y="265" width="17" height="30" fill={C} stroke={G} strokeWidth="1.5" />
        {/* Candle 2 — bullish (gold body) */}
        <line x1="265" y1="249" x2="265" y2="308" stroke={G} strokeWidth="2" />
        <rect x="256" y="255" width="17" height="27" fill={G} />
        {/* Candle 3 — bearish */}
        <line x1="291" y1="243" x2="291" y2="300" stroke={G} strokeWidth="2" />
        <rect x="282" y="249" width="17" height="24" fill={C} stroke={G} strokeWidth="1.5" />
        {/* Candle 4 — bullish */}
        <line x1="317" y1="238" x2="317" y2="292" stroke={G} strokeWidth="2" />
        <rect x="308" y="244" width="17" height="22" fill={G} />
      </g>

      {/* ── Banner text (on top of everything) ───── */}
      <text
        x="200"
        y="393"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={G}
        fontSize="42"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="5"
      >
        SKILLPIPS
      </text>
    </svg>
  );
};
