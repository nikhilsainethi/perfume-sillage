// ============================================================
// SILLAGE — BottleVisual
// Renders a perfume's real name-matched photo when one exists,
// otherwise an elegant rendered flacon tinted to the scent's
// dominant accord, with a monogram. The rendered silhouette
// varies by scent (5 shapes) so the fallback reads as a real,
// distinct bottle rather than a repeated placeholder.
// ============================================================

import type { Perfume } from '@/domain/types';

type Variant = 'tile' | 'thumb';

// hex lighten/darken toward white (amt>0) or black (amt<0)
function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const mix = (c: number) => Math.round(c + (t - c) * p);
  const to2 = (c: number) => mix(c).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

interface Shape {
  leftX: number;
  rightX: number;
  baseL: number;
  baseR: number;
  bodyTop: number;
  bodyBot: number;
  shoulder: number;
  neckBottom: number;
  capW: number;
  capH: number;
  capY: number;
}

const NECK_W = 13;

// five flacon silhouettes — rectangular, tall, wide flask, tapered, rounded
const SHAPES: Shape[] = [
  { leftX: 96, rightX: 204, baseL: 96, baseR: 204, bodyTop: 152, bodyBot: 300, shoulder: 24, neckBottom: 120, capW: 42, capH: 34, capY: 82 },
  { leftX: 108, rightX: 192, baseL: 108, baseR: 192, bodyTop: 146, bodyBot: 306, shoulder: 20, neckBottom: 118, capW: 34, capH: 42, capY: 74 },
  { leftX: 86, rightX: 214, baseL: 92, baseR: 208, bodyTop: 174, bodyBot: 300, shoulder: 30, neckBottom: 150, capW: 52, capH: 28, capY: 118 },
  { leftX: 100, rightX: 200, baseL: 118, baseR: 182, bodyTop: 150, bodyBot: 300, shoulder: 26, neckBottom: 122, capW: 40, capH: 34, capY: 86 },
  { leftX: 96, rightX: 204, baseL: 96, baseR: 204, bodyTop: 162, bodyBot: 300, shoulder: 46, neckBottom: 122, capW: 46, capH: 30, capY: 88 },
];

function bodyPath(s: Shape): string {
  const cx = 150;
  const r = 16;
  return [
    `M ${cx - NECK_W} ${s.neckBottom}`,
    `C ${cx - NECK_W} ${s.neckBottom + 12} ${s.leftX} ${s.bodyTop - s.shoulder} ${s.leftX} ${s.bodyTop}`,
    `L ${s.baseL} ${s.bodyBot - r}`,
    `Q ${s.baseL} ${s.bodyBot} ${s.baseL + r} ${s.bodyBot}`,
    `L ${s.baseR - r} ${s.bodyBot}`,
    `Q ${s.baseR} ${s.bodyBot} ${s.baseR} ${s.bodyBot - r}`,
    `L ${s.rightX} ${s.bodyTop}`,
    `C ${s.rightX} ${s.bodyTop - s.shoulder} ${cx + NECK_W} ${s.neckBottom + 12} ${cx + NECK_W} ${s.neckBottom}`,
    'Z',
  ].join(' ');
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function RenderedBottle({ perfume, variant }: { perfume: Perfume; variant: Variant }) {
  const accent = perfume.accent ?? '#B5803F';
  const light = shade(accent, 0.5);
  const mid = shade(accent, 0.12);
  const dark = shade(accent, -0.42);
  const capLight = shade(accent, 0.32);
  const capDark = shade(accent, -0.3);
  const uid = perfume.id;
  const initial = perfume.name.trim().charAt(0).toUpperCase();
  const isTile = variant === 'tile';

  const s = SHAPES[hash(uid) % SHAPES.length];
  const d = bodyPath(s);
  const cx = 150;
  const midY = (s.bodyTop + s.bodyBot) / 2;

  return (
    <svg
      viewBox="0 0 300 360"
      preserveAspectRatio={isTile ? 'xMidYMid slice' : 'xMidYMid meet'}
      className="h-full w-full"
      role="img"
      aria-label={`${perfume.name} by ${perfume.brand}`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FCFAF6" />
          <stop offset="1" stopColor="#F0EAE0" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.58" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.22" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${uid}`} x1={s.leftX} y1={s.bodyTop} x2={s.rightX} y2={s.bodyBot} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={light} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1={s.capY} x2="0" y2={s.capY + s.capH} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={capLight} />
          <stop offset="1" stopColor={capDark} />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <path d={d} />
        </clipPath>
      </defs>

      {isTile && <rect x="0" y="0" width="300" height="360" fill={`url(#bg-${uid})`} />}
      {isTile && <rect x="0" y="0" width="300" height="360" fill={`url(#glow-${uid})`} />}

      {/* floor shadow */}
      <ellipse cx={cx} cy={s.bodyBot + 6} rx={(s.baseR - s.baseL) / 2 + 6} ry="8" fill="#2A2018" opacity="0.12" />

      {/* cap + neck */}
      <rect x={cx - s.capW / 2} y={s.capY} width={s.capW} height={s.capH} rx="6" fill={`url(#cap-${uid})`} />
      <rect x={cx - s.capW / 2 + 5} y={s.capY + 4} width="6" height={s.capH - 10} rx="3" fill="#FFFFFF" opacity="0.25" />
      <rect x={cx - NECK_W} y={s.capY + s.capH - 4} width={NECK_W * 2} height={s.neckBottom - (s.capY + s.capH) + 8} fill={dark} />
      <rect x={cx - NECK_W - 2} y={s.neckBottom - 6} width={(NECK_W + 2) * 2} height="6" rx="2" fill={shade(accent, 0.45)} opacity="0.85" />

      {/* body */}
      <path d={d} fill={`url(#body-${uid})`} />
      <path d={d} fill="none" stroke={shade(accent, 0.5)} strokeOpacity="0.4" strokeWidth="1.1" />

      <g clipPath={`url(#clip-${uid})`}>
        <rect x="0" y={s.bodyTop} width="300" height="22" fill={shade(accent, 0.3)} opacity="0.18" />
        <rect x={s.leftX + 12} y={s.bodyTop + 16} width="9" height={s.bodyBot - s.bodyTop - 40} rx="4.5" fill="#FFFFFF" opacity="0.22" />
        <rect x={s.leftX + 27} y={s.bodyTop + 26} width="4" height={s.bodyBot - s.bodyTop - 64} rx="2" fill="#FFFFFF" opacity="0.14" />
        <rect x={cx - 34} y={midY - 26} width="68" height="52" rx="7" fill="#FFFFFF" opacity="0.16" />
        <rect x={cx - 34} y={midY - 26} width="68" height="52" rx="7" fill="none" stroke={shade(accent, 0.5)} strokeOpacity="0.45" />
        <text
          x={cx}
          y={midY + 8}
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="32"
          fill={shade(accent, -0.25)}
          fillOpacity="0.65"
        >
          {initial}
        </text>
      </g>
    </svg>
  );
}

export function BottleVisual({
  perfume,
  variant = 'tile',
  className,
}: {
  perfume: Perfume;
  variant?: Variant;
  className?: string;
}) {
  if (perfume.photo) {
    return (
      <img
        src={perfume.photo}
        alt={`${perfume.name} by ${perfume.brand}`}
        draggable={false}
        loading="lazy"
        decoding="async"
        className={`h-full w-full ${variant === 'thumb' ? 'object-contain' : 'object-cover'} ${className ?? ''}`}
      />
    );
  }
  return (
    <span className={`block h-full w-full ${className ?? ''}`}>
      <RenderedBottle perfume={perfume} variant={variant} />
    </span>
  );
}
