// ============================================================
// SILLAGE — AtlasPlacement
// The payoff: where does YOUR creation live among 127 real
// scents? Nearest neighbors ranked; one click opens the full
// comparison machinery with your blend as one side.
// ============================================================

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Perfume } from '@/domain/types';
import { compare } from '@/domain/comparison';
import { NOTES } from '@/data/notes';
import type { Neighbor } from './useDraftPerfume';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';
import { PairedPyramids } from '@/features/compare/PairedPyramids';
import { SimilarityRadarChart } from '@/features/compare/SimilarityRadarChart';
import { SimilarityReadout } from '@/features/compare/SimilarityReadout';
import { KeyDifferencesList } from '@/features/compare/KeyDifferencesList';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import { spring } from '@/shared/motion/motion';

function CompareModal({
  catalog,
  creation,
  onClose,
}: {
  catalog: Perfume;
  creation: Perfume;
  onClose: () => void;
}) {
  const trapRef = useFocusTrap<HTMLDivElement>(true, onClose);
  const result = compare(catalog, creation, NOTES);

  return createPortal(
    <div className="fixed inset-0 z-50">
      <motion.button
        type="button"
        aria-label="Close comparison"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 cursor-default bg-[rgba(40,30,20,0.32)] backdrop-blur-sm outline-none"
      />
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Your creation compared with ${catalog.name}`}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
        transition={spring.panel}
        className="scrollbar-thin absolute inset-x-3 top-[4vh] bottom-[4vh] mx-auto max-w-[1020px] overflow-y-auto rounded-panel border border-[var(--line)] bg-espresso p-6 shadow-e3 sm:inset-x-6 sm:p-9"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Your creation, in the atlas
            </span>
            <h2 className="mt-1 font-display text-[clamp(22px,3.6vw,32px)] leading-tight text-parchment">
              {creation.name} × {catalog.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white text-parchment-dim outline-none transition-colors hover:text-champagne-bright"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-8">
          <PairedPyramids result={result} />
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center gap-3">
              <SimilarityRadarChart axes={result.radar} />
              <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.1em] text-parchment-dim">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" /> {catalog.name}</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose" /> Yours</span>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <SimilarityReadout score={result.similarity} />
              <KeyDifferencesList items={result.keyDifferences} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

export function AtlasPlacement({
  neighbors,
  creation,
}: {
  neighbors: Neighbor[];
  creation: Perfume;
}) {
  const [compareId, setCompareId] = useState<string | null>(null);
  if (neighbors.length === 0) return null;
  const comparing = neighbors.find((n) => n.perfume.id === compareId)?.perfume ?? null;

  return (
    <section
      className="rounded-panel border border-[var(--line)] bg-smoke/60 p-6 sm:p-7"
      aria-label="Your place in the atlas"
    >
      <h3 className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne-bright">
        Your place in the atlas
      </h3>
      <p className="mb-5 font-sans text-[13px] text-muted">
        The real scents your composition sits closest to.
      </p>

      <ul className="flex flex-col gap-2.5">
        {neighbors.map(({ perfume, overall }, i) => (
          <motion.li
            key={perfume.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3.5 rounded-input border border-[var(--line)] bg-white/80 px-3.5 py-2.5"
          >
            <span className="h-12 w-9 shrink-0 overflow-hidden rounded-[8px]">
              <BottleVisual perfume={perfume} variant="thumb" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-display text-[17px] leading-tight text-parchment">
                  {perfume.name}
                </span>
                <OriginalCloneBadge type={perfume.type} />
              </div>
              <span className="font-sans text-[12px] text-muted">{perfume.brand}</span>
            </div>
            <span className="shrink-0 font-display text-[22px] text-champagne-bright">
              {overall}
              <span className="ml-0.5 font-sans text-[11px] text-muted">%</span>
            </span>
            <button
              type="button"
              onClick={() => setCompareId(perfume.id)}
              className="shrink-0 rounded-chip border border-[var(--line)] px-3.5 py-1.5 font-sans text-[12px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
            >
              Compare
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {comparing && (
          <CompareModal
            catalog={comparing}
            creation={creation}
            onClose={() => setCompareId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
