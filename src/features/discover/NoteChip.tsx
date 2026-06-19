// ============================================================
// SILLAGE — NoteChip (§4.2, §12.6)
// The most-reused atom. Toggles a note in the scent profile.
// Shared-layout flight to the tray: the chip carries the
// layoutId only while UNSELECTED, the tray token carries it
// while SELECTED — so exactly one element owns it at a time
// and Framer Motion animates the hand-off cleanly.
// ============================================================

import { motion } from 'framer-motion';
import type { FragranceNote } from '@/domain/types';
import { spring } from '@/shared/motion/motion';

export function NoteChip({
  note,
  selected,
  onToggle,
}: {
  note: FragranceNote;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout="position"
      layoutId={selected ? undefined : `note-${note.id}`}
      aria-pressed={selected}
      aria-label={`${note.name}, ${note.family} note`}
      title={note.description}
      onClick={onToggle}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -2 }}
      transition={spring.chip}
      className="inline-flex items-center gap-2 rounded-chip px-4 py-2 font-sans text-[13px]
                 outline-none transition-colors"
      style={{
        background: selected ? 'rgba(176,132,60,0.16)' : '#FFFFFF',
        border: `1px solid ${selected ? '#B0843C' : 'var(--line)'}`,
        color: selected ? '#8A6526' : '#6E6456',
        minHeight: 36,
      }}
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{
          background: note.color,
          boxShadow: selected ? `0 0 8px ${note.color}` : 'none',
        }}
      />
      {note.name}
    </motion.button>
  );
}
