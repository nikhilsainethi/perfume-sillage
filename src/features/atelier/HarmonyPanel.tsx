// ============================================================
// SILLAGE — HarmonyPanel
// Sparks (pairs the atlas itself endorses) and cautions
// (structural balance) — the perfumer at your shoulder.
// ============================================================

import { AnimatePresence, motion } from 'framer-motion';
import type { Caution, Spark } from '@/domain/harmony';
import { ease } from '@/shared/motion/motion';

export function HarmonyPanel({ sparks, cautions }: { sparks: Spark[]; cautions: Caution[] }) {
  if (sparks.length === 0 && cautions.length === 0) return null;

  return (
    <section
      className="rounded-panel border border-[var(--line)] bg-smoke/60 p-6 sm:p-7"
      aria-label="Harmony guidance"
    >
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
        The perfumer&rsquo;s ear
      </h3>
      <ul className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {sparks.map((s) => (
            <motion.li
              key={`spark-${s.a}-${s.b}`}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: ease.enter }}
              className="flex items-start gap-2.5 font-sans text-[13.5px] leading-relaxed text-parchment-dim"
            >
              <span aria-hidden className="mt-0.5 text-[13px] text-champagne">✦</span>
              <span>{s.message}</span>
            </motion.li>
          ))}
          {cautions.map((c) => (
            <motion.li
              key={`caution-${c.kind}`}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: ease.enter }}
              className="flex items-start gap-2.5 font-sans text-[13.5px] leading-relaxed"
              style={{ color: '#9C5C50' }}
            >
              <span aria-hidden className="mt-0.5 text-[13px]">◦</span>
              <span>{c.message}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
