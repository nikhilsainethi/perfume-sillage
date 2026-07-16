// ============================================================
// SILLAGE — BrowseGrid (ACT 2, the workhorse view)
// The fan is theater; this is the library. Every match at once
// in a responsive grid, cheap to scan, cheap to render
// (content-visibility skips offscreen cards). Default on mobile.
// ============================================================

import type { Perfume } from '@/domain/types';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';

export function BrowseGrid({
  perfumes,
  onOpen,
}: {
  perfumes: Perfume[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {perfumes.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpen(p.id)}
            style={{ contentVisibility: 'auto', containIntrinsicSize: '260px' }}
            className="group overflow-hidden rounded-card border border-[var(--line)] bg-[#FFFFFF] text-left shadow-e1 outline-none transition-shadow hover:shadow-e2 focus-visible:shadow-focus"
          >
            <span className="block h-36 w-full overflow-hidden sm:h-40">
              <BottleVisual
                perfume={p}
                variant="thumb"
                className="transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </span>
            <span className="block px-3.5 pb-3.5 pt-3">
              <span className="block truncate font-display text-[15px] leading-snug text-parchment">
                {p.name}
              </span>
              <span className="mt-0.5 block truncate font-sans text-[12px] text-muted">
                {p.brand}
                {p.year ? ` · ${p.year}` : ''}
              </span>
              <span className="mt-2 inline-flex">
                <OriginalCloneBadge type={p.type} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
