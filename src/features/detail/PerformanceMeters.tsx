// ============================================================
// SILLAGE — PerformanceMeters (§4.1)
// Longevity / projection / sillage as quiet 0..10 meters.
// ============================================================

import { motion } from 'framer-motion';
import type { PerformanceProfile } from '@/domain/types';
import { ease } from '@/shared/motion/motion';

const METRICS: { key: keyof PerformanceProfile; label: string }[] = [
  { key: 'longevity', label: 'Longevity' },
  { key: 'projection', label: 'Projection' },
  { key: 'sillage', label: 'Sillage' },
];

export function PerformanceMeters({ performance }: { performance: PerformanceProfile }) {
  return (
    <ul className="flex flex-col gap-4">
      {METRICS.map(({ key, label }) => {
        const value = performance[key];
        return (
          <li key={key} className="flex items-center gap-4">
            <span className="w-[78px] shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-parchment-dim">
              {label}
            </span>
            <div className="flex flex-1 gap-1" aria-hidden>
              {Array.from({ length: 10 }).map((_, dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 flex-1 rounded-full"
                  initial={{ opacity: 0.25, background: 'rgba(124,115,103,0.3)' }}
                  animate={{
                    opacity: 1,
                    background:
                      dot < value ? '#B0843C' : 'rgba(124,115,103,0.22)',
                  }}
                  transition={{ duration: 0.3, ease: ease.move, delay: 0.15 + dot * 0.02 }}
                />
              ))}
            </div>
            <span className="w-7 shrink-0 text-right font-mono text-[12px] text-champagne">
              {value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
