// ============================================================
// SILLAGE — Notes matching engine (§5)
// Pure, memoizable relevance/ranking logic. The view never
// filters; it dispatches toggles and renders this output.
// ============================================================

import type { Perfume, FragranceNote, NoteMatch, NotePosition } from './types.ts';

// Heart defines character, base lingers, top is fleeting (§5.2).
const POSITION_WEIGHT: Record<NotePosition, number> = {
  heart: 1.0,
  base: 0.9,
  top: 0.7,
};

const W_COVERAGE = 0.55;
const W_INTENSITY = 0.3;
const W_ACCORD = 0.15;

export interface MatchInput {
  perfumes: Perfume[];
  notes: Record<string, FragranceNote>;
  selectedNoteIds: string[];
  matchMode: 'exact' | 'partial';
}

/**
 * Score and rank perfumes against a composed scent profile.
 *
 * An exact match (coverage === 1) always outranks a partial one because
 * coverage dominates the formula; but among partials a perfume where your
 * notes sit in the *heart* and project strongly beats one where they are
 * fleeting top notes — which is how a perfumer ranks "closeness".
 */
export function matchPerfumes({
  perfumes,
  notes,
  selectedNoteIds,
  matchMode,
}: MatchInput): NoteMatch[] {
  // No selection: surface everything, unranked, so the carousel has stock.
  if (selectedNoteIds.length === 0) {
    return perfumes.map((p) => ({
      perfume: p,
      relevance: 0,
      coverage: 0,
      matchedNoteIds: [],
      matchType: 'partial' as const,
    }));
  }

  const selectedFamilies = new Set(
    selectedNoteIds.map((id) => notes[id]?.family).filter(Boolean),
  );

  const scored = perfumes.map<NoteMatch>((p) => {
    const positionOf = new Map<string, NotePosition>();
    (['top', 'heart', 'base'] as NotePosition[]).forEach((pos) =>
      p.pyramid[pos].forEach((n) => positionOf.set(n.noteId, pos)),
    );
    const intensityOf = new Map(
      [...p.pyramid.top, ...p.pyramid.heart, ...p.pyramid.base].map((n) => [
        n.noteId,
        n.intensity,
      ]),
    );

    const matched = selectedNoteIds.filter((id) => positionOf.has(id));
    const coverage = matched.length / selectedNoteIds.length;

    let noteScore = 0;
    matched.forEach((id) => {
      noteScore += (intensityOf.get(id) ?? 0) * POSITION_WEIGHT[positionOf.get(id)!];
    });
    const intensityN = noteScore / selectedNoteIds.length;

    const perfumeFamilies = new Set(p.accords.map((a) => a.family));
    const famOverlap = [...selectedFamilies].filter((f) =>
      perfumeFamilies.has(f!),
    ).length;
    const accordN = selectedFamilies.size ? famOverlap / selectedFamilies.size : 0;

    const relevance =
      W_COVERAGE * coverage + W_INTENSITY * intensityN + W_ACCORD * accordN;

    return {
      perfume: p,
      relevance,
      coverage,
      matchedNoteIds: matched,
      matchType: coverage === 1 ? 'exact' : 'partial',
    };
  });

  return scored
    .filter((m) =>
      matchMode === 'exact' ? m.coverage === 1 : m.matchedNoteIds.length > 0,
    )
    .sort((a, b) => b.relevance - a.relevance);
}
