// ============================================================
// SILLAGE — CarouselEmptyState (§5.4)
// Floats in when nothing matches. Offers a one-tap recovery
// suited to *why* it's empty (too-strict "all", or filters).
// ============================================================

import { motion } from 'framer-motion';
import { ease } from '@/shared/motion/motion';

export function CarouselEmptyState({
  matchMode,
  onMatchAny,
  onClear,
}: {
  matchMode: 'exact' | 'partial';
  onMatchAny: () => void;
  onClear: () => void;
}) {
  const exact = matchMode === 'exact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.52, ease: ease.enter }}
      className="mx-auto flex max-w-[46ch] flex-col items-center gap-5 px-6 text-center"
    >
      <span
        aria-hidden
        className="grid h-16 w-16 place-items-center rounded-full border border-[var(--line)] text-champagne-bright"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <p className="font-display text-[22px] leading-snug text-parchment">
        {exact
          ? 'No fragrances carry all of these notes yet.'
          : 'Nothing in the atlas matches that combination.'}
      </p>
      <p className="font-sans text-[15px] leading-relaxed text-parchment-dim">
        {exact
          ? 'Try fewer notes, or switch to partial matches to see everything that shares at least one.'
          : 'Try loosening the search or clearing a filter.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {exact && (
          <button
            type="button"
            onClick={onMatchAny}
            className="rounded-chip bg-champagne px-5 py-2.5 font-sans text-[13px] font-medium text-obsidian outline-none transition-colors hover:bg-champagne-bright"
          >
            Match any
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          className="rounded-chip border border-[var(--line)] px-5 py-2.5 font-sans text-[13px] text-parchment-dim outline-none transition-colors hover:text-champagne-bright hover:border-champagne"
        >
          Clear notes
        </button>
      </div>
    </motion.div>
  );
}
