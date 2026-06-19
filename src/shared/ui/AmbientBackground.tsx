// ============================================================
// SILLAGE — AmbientBackground (§2.5, §4.2)
// The lit-from-within atmosphere: a fixed grain layer over two
// slow drifting radial glows ("the ambient sillage"). Drift is
// pure CSS so prefers-reduced-motion disables it for free.
// ============================================================

import { useReducedMotion } from 'framer-motion';

// 2.5% noise via feTurbulence, inlined so there's no asset to load.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function AmbientBackground({
  intensity = 1,
  paused,
}: {
  intensity?: number;
  paused?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const isPaused = paused ?? reduce;
  const playState = isPaused ? 'paused' : 'running';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      {/* glow A — champagne wash, drifts top-left quadrant */}
      <div
        className="absolute left-[-12%] top-[-18%] h-[72vmax] w-[72vmax] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(196,158,92,${0.16 * intensity}) 0%, transparent 60%)`,
          animation: 'sillage-drift-a 52s ease-in-out infinite',
          animationPlayState: playState,
          filter: 'blur(40px)',
        }}
      />
      {/* glow B — warm rose/amber, drifts bottom-right quadrant */}
      <div
        className="absolute bottom-[-22%] right-[-12%] h-[64vmax] w-[64vmax] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(201,154,146,${0.14 * intensity}) 0%, transparent 62%)`,
          animation: 'sillage-drift-b 60s ease-in-out infinite',
          animationPlayState: playState,
          filter: 'blur(50px)',
        }}
      />
      {/* soft warm vignette so the ivory deepens slightly toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 110% at 50% 0%, transparent 55%, rgba(120,96,64,0.06) 100%)',
        }}
      />
      {/* grain — subtle tactility, kept faint on light */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundRepeat: 'repeat',
          opacity: 0.04,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
