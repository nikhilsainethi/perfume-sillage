// ============================================================
// SILLAGE — OlfactoryPyramid (§12.7)
// Top / heart / base in three tiers, notes sized by intensity
// and accord-colored. Registers each note element so the
// comparison's NoteConnectionMap can draw between matches.
// Each chip navigates to the note's own page (/n/<id>).
// ============================================================

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { NotePosition, NotePyramid } from '@/domain/types';
import { NOTES } from '@/data/notes';
import { useDiscovery } from '@/store/discoveryStore';
import { ease, stagger } from '@/shared/motion/motion';

const TIERS: NotePosition[] = ['top', 'heart', 'base'];
const TIER_LABEL: Record<NotePosition, string> = {
  top: 'Top',
  heart: 'Heart',
  base: 'Base',
};

export function OlfactoryPyramid({
  pyramid,
  side,
  highlightNoteIds = [],
  dimUnmatched = false,
  registerNoteRef,
}: {
  pyramid: NotePyramid;
  side?: 'original' | 'clone';
  highlightNoteIds?: string[];
  /** In comparison: fade notes that aren't shared toward the side's temperature. */
  dimUnmatched?: boolean;
  registerNoteRef?: (noteId: string, el: HTMLElement | null) => void;
}) {
  const highlight = new Set(highlightNoteIds);
  const dimColor = side === 'clone' ? 'rgba(201,154,146,0.5)' : 'rgba(184,118,62,0.5)';
  const navigate = useNavigate();
  const closeDetail = useDiscovery((s) => s.closeDetail);
  const openNote = (noteId: string) => {
    closeDetail(); // leaving the atlas — don't reopen the panel on return
    navigate(`/n/${noteId}`);
  };

  return (
    <div className="flex flex-col items-stretch gap-5">
      {TIERS.map((tier, ti) => (
        <div key={tier} className="text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {TIER_LABEL[tier]}
          </span>
          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            {pyramid[tier].length === 0 && (
              <span className="font-sans text-[12px] italic text-muted">—</span>
            )}
            {pyramid[tier].map((n, ni) => {
              const note = NOTES[n.noteId];
              const name = note?.name ?? n.noteId;
              const shared = highlight.has(n.noteId);
              const faded = dimUnmatched && !shared;
              return (
                <motion.button
                  key={n.noteId}
                  type="button"
                  ref={(el) => registerNoteRef?.(n.noteId, el)}
                  onClick={() => openNote(n.noteId)}
                  title={`Every scent that carries ${name}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: faded ? 0.55 : 1, scale: 1 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{
                    delay: ti * 0.12 + ni * stagger.notes,
                    duration: 0.42,
                    ease: ease.enter,
                  }}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-chip px-3 py-1 font-sans outline-none"
                  style={{
                    fontSize: 12 + n.intensity * 4,
                    border: shared
                      ? '1px solid #B0843C'
                      : `1px solid ${faded ? dimColor : 'var(--line)'}`,
                    color: shared ? '#8A6526' : faded ? dimColor : '#6E6456',
                    background: shared ? 'rgba(176,132,60,0.14)' : 'transparent',
                    boxShadow: shared ? '0 0 14px rgba(176,132,60,0.22)' : 'none',
                  }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: note?.color ?? '#9A9082' }}
                  />
                  {name}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
