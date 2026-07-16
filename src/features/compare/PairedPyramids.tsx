// ============================================================
// SILLAGE — PairedPyramids (§7.3)
// Two olfactory pyramids side by side; shared notes are ringed
// in both and joined by the NoteConnectionMap overlay. On
// mobile the drawn lines become a "shared notes" list (§10.1).
// ============================================================

import { useMemo, useRef } from 'react';
import type { ComparisonResult } from '@/domain/types';
import { NOTES } from '@/data/notes';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';
import { OlfactoryPyramid } from '@/features/detail/OlfactoryPyramid';
import { NoteConnectionMap } from './NoteConnectionMap';

export function PairedPyramids({ result }: { result: ComparisonResult }) {
  const { original, clone, layers } = result;
  const isMobile = useIsMobile();

  const containerRef = useRef<HTMLDivElement>(null);
  const originalRefs = useRef(new Map<string, HTMLElement>());
  const cloneRefs = useRef(new Map<string, HTMLElement>());

  const register =
    (which: 'original' | 'clone') => (noteId: string, el: HTMLElement | null) => {
      const map = which === 'original' ? originalRefs.current : cloneRefs.current;
      if (el) map.set(noteId, el);
      else map.delete(noteId);
    };

  const sharedIds = useMemo(
    () =>
      Array.from(new Set(layers.flatMap((l) => l.shared.map((n) => n.noteId)))),
    [layers],
  );

  const matches = useMemo(
    () => sharedIds.map((id) => ({ noteId: id, color: NOTES[id]?.color ?? '#B0843C' })),
    [sharedIds],
  );

  const sharedNames = sharedIds.map((id) => NOTES[id]?.name ?? id);
  const revision = `${original.id}-${clone.id}`;

  return (
    <div className="flex flex-col gap-6">
      <div ref={containerRef} className="relative">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16 lg:gap-28">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <OriginalCloneBadge type="original" />
              <span className="font-display text-[20px] text-parchment">{original.name}</span>
            </div>
            <OlfactoryPyramid
              pyramid={original.pyramid}
              side="original"
              highlightNoteIds={sharedIds}
              dimUnmatched
              registerNoteRef={register('original')}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <OriginalCloneBadge type="clone" />
              <span className="font-display text-[20px] text-parchment">{clone.name}</span>
            </div>
            <OlfactoryPyramid
              pyramid={clone.pyramid}
              side="clone"
              highlightNoteIds={sharedIds}
              dimUnmatched
              registerNoteRef={register('clone')}
            />
          </div>
        </div>

        {/* drawn connectors (desktop/tablet only) */}
        {!isMobile && (
          <NoteConnectionMap
            containerRef={containerRef}
            originalRefs={originalRefs.current}
            cloneRefs={cloneRefs.current}
            matches={matches}
            revision={revision}
          />
        )}
      </div>

      {/* shared-notes list — primary on mobile, also the a11y summary (§10.4) */}
      <div className={isMobile ? '' : 'sr-only'}>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne-bright">
          {sharedNames.length} shared notes
        </p>
        <div className="flex flex-wrap gap-2">
          {sharedNames.map((name) => (
            <span
              key={name}
              className="rounded-chip border border-champagne/40 px-3 py-1 font-sans text-[12px] text-champagne-bright"
              style={{ borderColor: 'rgba(176,132,60,0.45)' }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
