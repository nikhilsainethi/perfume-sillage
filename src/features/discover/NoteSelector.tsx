// ============================================================
// SILLAGE — NoteSelector (cluster view, §4.2)
// Accord-grouped floating chips. The alternative to the wheel.
// ============================================================

import { useMemo } from 'react';
import type { AccordFamily, FragranceNote } from '@/domain/types';
import { FAMILY_COLOR, FAMILY_LABEL, FAMILY_ORDER } from '@/data/notes';
import { NoteChip } from './NoteChip';

export function NoteSelector({
  notes,
  selectedIds,
  onToggle,
}: {
  notes: FragranceNote[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<AccordFamily, FragranceNote[]>();
    for (const f of FAMILY_ORDER) map.set(f, []);
    for (const note of notes) map.get(note.family)?.push(note);
    return FAMILY_ORDER.map((family) => ({ family, items: map.get(family) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [notes]);

  const selected = new Set(selectedIds);

  return (
    <div className="flex flex-col gap-7">
      {grouped.map(({ family, items }) => (
        <div key={family}>
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: FAMILY_COLOR[family] }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {FAMILY_LABEL[family]}
            </span>
            <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((note) => (
              <NoteChip
                key={note.id}
                note={note}
                selected={selected.has(note.id)}
                onToggle={() => onToggle(note.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
