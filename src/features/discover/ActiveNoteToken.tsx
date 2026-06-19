// ============================================================
// SILLAGE — ActiveNoteToken (§4.2)
// A removable pill inside the glass tray. Receives the shared
// layoutId from NoteChip so a selected note flies here, and
// leaves via AnimatePresence shrink + fade.
// ============================================================

import { motion } from 'framer-motion';
import type { FragranceNote } from '@/domain/types';
import { spring } from '@/shared/motion/motion';

export function ActiveNoteToken({
  note,
  onRemove,
}: {
  note: FragranceNote;
  onRemove: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout="position"
      layoutId={`note-${note.id}`}
      onClick={onRemove}
      aria-label={`Remove ${note.name}`}
      title={`Remove ${note.name}`}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={spring.chip}
      whileHover={{ y: -2 }}
      className="group inline-flex items-center gap-2 rounded-chip px-3 py-1.5 font-sans text-[13px]
                 text-parchment outline-none"
      style={{
        background: 'rgba(176,132,60,0.16)',
        border: '1px solid rgba(176,132,60,0.45)',
      }}
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{ background: note.color, boxShadow: `0 0 8px ${note.color}` }}
      />
      {note.name}
      <span
        aria-hidden
        className="ml-0.5 text-[14px] leading-none text-parchment-dim transition-colors group-hover:text-champagne-bright"
      >
        ×
      </span>
    </motion.button>
  );
}
