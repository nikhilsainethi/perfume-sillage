// ============================================================
// SILLAGE — InspiredByLink (§4.1)
// Surfaces the clone<->original relationship from inside the
// detail panel: jump to the counterpart, or open it in Compare.
// Clones are framed as interpretations, never as cheap copies.
// ============================================================

import type { Perfume } from '@/domain/types';
import { useCounterpart } from '@/store/selectors';

export function InspiredByLink({
  perfume,
  onOpen,
  onCompare,
}: {
  perfume: Perfume;
  onOpen: (id: string) => void;
  onCompare: (originalId: string, cloneId: string) => void;
}) {
  const link = useCounterpart(perfume);
  if (!link) return null;

  const { counterpart, relationship } = link;
  const isClone = perfume.type === 'clone';

  return (
    <div className="glass rounded-panel p-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {isClone ? 'Inspired by' : 'Has an interpretation'}
      </span>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-[22px] leading-tight text-parchment">
            {counterpart.name}
          </p>
          <p className="font-sans text-[13px] text-parchment-dim">{counterpart.brand}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpen(counterpart.id)}
            className="rounded-chip border border-[var(--line)] px-4 py-2 font-sans text-[12px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onCompare(relationship.originalId, relationship.cloneId)}
            className="rounded-chip bg-champagne px-4 py-2 font-sans text-[12px] font-medium text-obsidian outline-none transition-colors hover:bg-champagne-bright"
          >
            Compare the two
          </button>
        </div>
      </div>
      {relationship.commentary && (
        <p className="mt-4 border-t border-[var(--line)] pt-4 font-sans text-[14px] italic leading-relaxed text-parchment-dim">
          “{relationship.commentary}”
        </p>
      )}
    </div>
  );
}
