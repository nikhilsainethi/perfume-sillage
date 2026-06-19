// ============================================================
// SILLAGE — AccordOverlap (§4.1, §7.4)
// Shared vs divergent accords as opposed bars: the original
// grows left (amber), the inspired grows right (rose), around a
// shared family label. Bars grow from 0 on reveal.
// ============================================================

import { motion } from 'framer-motion';
import type { AccordOverlapEntry } from '@/domain/types';
import { FAMILY_LABEL } from '@/data/notes';
import { ease } from '@/shared/motion/motion';

export function AccordOverlap({ overlap }: { overlap: AccordOverlapEntry[] }) {
  const max =
    overlap.reduce((m, o) => Math.max(m, o.originalWeight, o.cloneWeight), 0) || 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_88px_1fr] items-center text-center">
        <span className="text-right font-mono text-[10px] uppercase tracking-[0.12em] text-amber">
          Original
        </span>
        <span />
        <span className="text-left font-mono text-[10px] uppercase tracking-[0.12em] text-rose">
          Inspired
        </span>
      </div>

      {overlap.map((o, i) => (
        <div key={o.family} className="grid grid-cols-[1fr_88px_1fr] items-center gap-2">
          {/* original — grows left */}
          <div className="flex h-2.5 justify-end overflow-hidden rounded-chip bg-[rgba(124,115,103,0.14)]">
            <motion.span
              className="h-full rounded-chip"
              style={{ background: 'linear-gradient(90deg, rgba(184,118,62,0.5), #B0702F)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(o.originalWeight / max) * 100}%` }}
              transition={{ duration: 0.45, ease: ease.move, delay: 0.1 + i * 0.04 }}
            />
          </div>

          <span className="text-center font-mono text-[11px] uppercase tracking-[0.08em] text-parchment-dim">
            {FAMILY_LABEL[o.family]}
          </span>

          {/* clone — grows right */}
          <div className="flex h-2.5 justify-start overflow-hidden rounded-chip bg-[rgba(124,115,103,0.14)]">
            <motion.span
              className="h-full rounded-chip"
              style={{ background: 'linear-gradient(90deg, #B5786E, rgba(201,154,146,0.5))' }}
              initial={{ width: 0 }}
              animate={{ width: `${(o.cloneWeight / max) * 100}%` }}
              transition={{ duration: 0.45, ease: ease.move, delay: 0.1 + i * 0.04 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
