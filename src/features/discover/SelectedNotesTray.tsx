// ============================================================
// SILLAGE — SelectedNotesTray (§4.2)
// The glass tray holding the composed scent profile. Tokens
// arrive via shared layout, leave via AnimatePresence, and the
// tray reflows with a spring.
// ============================================================

import { AnimatePresence, motion } from 'framer-motion';
import type { FragranceNote } from '@/domain/types';
import { ease } from '@/shared/motion/motion';
import { ActiveNoteToken } from '../discover/ActiveNoteToken';

export function SelectedNotesTray({
  selected,
  onRemove,
  onClear,
}: {
  selected: FragranceNote[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const isEmpty = selected.length === 0;

  return (
    <div className="glass rounded-panel p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-parchment-dim">
          Your scent profile
        </h3>
        <AnimatePresence>
          {!isEmpty && (
            <motion.button
              type="button"
              onClick={onClear}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-chip px-2.5 py-1 font-sans text-[11px] uppercase tracking-[0.1em] text-muted outline-none transition-colors hover:text-champagne-bright"
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <motion.div layout className="flex min-h-[44px] flex-wrap items-center gap-2">
        <AnimatePresence mode="popLayout">
          {isEmpty ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.enter }}
              className="font-sans text-[14px] italic text-muted"
            >
              Choose notes to compose a scent — bergamot, oud, vanilla, vetiver…
            </motion.p>
          ) : (
            selected.map((note) => (
              <ActiveNoteToken
                key={note.id}
                note={note}
                onRemove={() => onRemove(note.id)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
