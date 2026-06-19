// ============================================================
// SILLAGE — SimilarityReadout (§7.3)
// One restrained reading. Similarity is communicated first by
// the density of drawn connections; this soft bar is the quiet
// second voice — number, never a verdict.
// ============================================================

import { motion } from 'framer-motion';
import type { SimilarityScore } from '@/domain/types';
import { ease } from '@/shared/motion/motion';

export function SimilarityReadout({ score }: { score: SimilarityScore }) {
  const pct = Math.round(score.overall);
  const layers: { label: string; value: number }[] = [
    { label: 'Top', value: score.byLayer.top },
    { label: 'Heart', value: score.byLayer.heart },
    { label: 'Base', value: score.byLayer.base },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Overall similarity
        </span>
        <span
          className="font-display text-[40px] leading-none text-champagne"
          aria-label={`Overall similarity ${pct} percent`}
        >
          {pct}
          <span className="ml-0.5 font-sans text-[16px] text-parchment-dim">%</span>
        </span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-chip bg-[rgba(124,115,103,0.18)]">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-chip"
          style={{
            background: 'linear-gradient(90deg, #B0702F, #B0843C 70%, #8A6526)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: ease.move }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 pt-1">
        {layers.map((l) => (
          <div key={l.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {l.label}
              </span>
              <span className="font-mono text-[11px] text-parchment-dim">
                {Math.round(l.value * 100)}%
              </span>
            </div>
            <div className="relative h-1 overflow-hidden rounded-chip bg-[rgba(124,115,103,0.18)]">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-chip bg-champagne"
                initial={{ width: 0 }}
                animate={{ width: `${l.value * 100}%` }}
                transition={{ duration: 0.6, ease: ease.move, delay: 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
