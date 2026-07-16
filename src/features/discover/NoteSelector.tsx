// ============================================================
// SILLAGE — NoteSelector (cluster view, §4.2)
// Accord-grouped floating chips. The alternative to the wheel.
// On mobile (`collapsible`) families fold to headers so the 108
// chips don't become a five-screen wall between the visitor and
// the bottles — the first family opens, the rest are one tap.
// ============================================================

import { useMemo, useState } from 'react';
import type { AccordFamily, FragranceNote } from '@/domain/types';
import { FAMILY_COLOR, FAMILY_LABEL, FAMILY_ORDER } from '@/data/notes';
import { NoteChip } from './NoteChip';

export function NoteSelector({
  notes,
  selectedIds,
  onToggle,
  collapsible = false,
}: {
  notes: FragranceNote[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  collapsible?: boolean;
}) {
  const grouped = useMemo(() => {
    const map = new Map<AccordFamily, FragranceNote[]>();
    for (const f of FAMILY_ORDER) map.set(f, []);
    for (const note of notes) map.get(note.family)?.push(note);
    return FAMILY_ORDER.map((family) => ({ family, items: map.get(family) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [notes]);

  const [openFamilies, setOpenFamilies] = useState<Set<AccordFamily>>(
    () => new Set(grouped[0] ? [grouped[0].family] : []),
  );
  const toggleFamily = (f: AccordFamily) =>
    setOpenFamilies((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });

  const selected = new Set(selectedIds);

  return (
    <div className="flex flex-col gap-7">
      {grouped.map(({ family, items }) => {
        const isOpen = !collapsible || openFamilies.has(family);
        const selectedInFamily = items.filter((n) => selected.has(n.id)).length;
        const header = (
          <>
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: FAMILY_COLOR[family] }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {FAMILY_LABEL[family]}
            </span>
            {collapsible && (
              <span className="font-mono text-[11px] text-muted">
                {selectedInFamily > 0 ? `${selectedInFamily} picked · ` : ''}
                {items.length}
              </span>
            )}
            <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
            {collapsible && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="shrink-0 transition-transform"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'none', color: '#7A7061' }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </>
        );
        return (
          <div key={family}>
            {collapsible ? (
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleFamily(family)}
                className="mb-3 flex w-full items-center gap-2.5 outline-none"
              >
                {header}
              </button>
            ) : (
              <div className="mb-3 flex items-center gap-2.5">{header}</div>
            )}
            {isOpen && (
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
            )}
          </div>
        );
      })}
    </div>
  );
}
