// ============================================================
// SILLAGE — AnalysisPanel
// The composition read back to you, live: an editorial
// character line, the accord profile forming, performance and
// seasons — every engine the catalog uses, applied to yours.
// ============================================================

import { AnimatePresence, motion } from 'framer-motion';
import type { Perfume } from '@/domain/types';
import { AccordBar } from '@/features/detail/AccordBar';
import { PerformanceMeters } from '@/features/detail/PerformanceMeters';
import { ease } from '@/shared/motion/motion';

export function AnalysisPanel({
  perfume,
  count,
  line,
}: {
  perfume: Perfume;
  count: number;
  line: string;
}) {
  return (
    <section
      className="rounded-panel border border-[var(--line)] bg-smoke/60 p-6 sm:p-7"
      aria-label="Live analysis"
    >
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne-bright">
        The reading
      </h3>

      {count === 0 ? (
        <p className="font-sans text-[14px] italic leading-relaxed text-muted">
          Your scent has no notes yet. Choose a first note and watch its character
          form here — accords, seasons, performance, all read live.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.enter }}
              className="text-balance font-display text-[clamp(19px,2.4vw,24px)] italic leading-snug text-parchment"
            >
              {line || 'A sketch, still finding its voice…'}
            </motion.p>
          </AnimatePresence>

          <div>
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Accord profile
            </span>
            <AccordBar accords={perfume.accords} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Projected performance
              </span>
              <PerformanceMeters performance={perfume.performance} />
            </div>
            <div>
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Wears best in
              </span>
              <div className="flex flex-wrap gap-2">
                {perfume.context.seasons.map((s) => (
                  <span
                    key={s}
                    className="rounded-chip border border-[var(--line)] px-3 py-1 font-sans text-[12px] capitalize text-parchment-dim"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
