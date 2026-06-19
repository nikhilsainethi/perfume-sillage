// ============================================================
// SILLAGE — AccordBar (§4.1)
// The overall accord profile as labelled, family-colored bars.
// Color is never the only signal — every bar carries its label.
// ============================================================

import { motion } from 'framer-motion';
import type { Accord } from '@/domain/types';
import { FAMILY_COLOR, FAMILY_LABEL } from '@/data/notes';
import { ease } from '@/shared/motion/motion';

export function AccordBar({ accords }: { accords: Accord[] }) {
  const sorted = [...accords].sort((a, b) => b.weight - a.weight);
  const max = sorted[0]?.weight || 1;

  return (
    <ul className="flex flex-col gap-2.5">
      {sorted.map((accord, i) => (
        <li key={accord.family} className="flex items-center gap-3">
          <span className="w-[68px] shrink-0 text-right font-mono text-[11px] uppercase tracking-[0.1em] text-parchment-dim">
            {FAMILY_LABEL[accord.family]}
          </span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-chip bg-[rgba(124,115,103,0.16)]">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-chip"
              style={{ background: FAMILY_COLOR[accord.family] }}
              initial={{ width: 0 }}
              animate={{ width: `${(accord.weight / max) * 100}%` }}
              transition={{ duration: 0.6, ease: ease.move, delay: 0.1 + i * 0.05 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
