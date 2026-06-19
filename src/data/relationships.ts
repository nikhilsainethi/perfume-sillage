// ============================================================
// SILLAGE — Original <-> Clone graph (derived)
// One relationship per dupe, built from its inspiredBy link.
// Similarity, shared and divergent note sets all come from
// compare() so they can never drift from the comparison engine.
// ============================================================

import type { CloneRelationship } from '@/domain/types';
import { compare } from '@/domain/comparison';
import { NOTES } from './notes';
import { PERFUMES, PERFUME_BY_ID } from './perfumes';

export const RELATIONSHIPS: CloneRelationship[] = PERFUMES.filter(
  (p) => p.type === 'clone' && p.inspiredByOriginalId,
)
  .map((clone, i): CloneRelationship | null => {
    const original = PERFUME_BY_ID[clone.inspiredByOriginalId!];
    if (!original) return null;
    const result = compare(original, clone, NOTES);
    const sharedNoteIds = Array.from(
      new Set(result.layers.flatMap((l) => l.shared.map((nr) => nr.noteId))),
    );
    const divergentNoteIds = Array.from(
      new Set(
        result.layers.flatMap((l) =>
          [...l.uniqueToOriginal, ...l.uniqueToClone].map((nr) => nr.noteId),
        ),
      ),
    );
    return {
      id: `rel-${i + 1}`,
      originalId: original.id,
      cloneId: clone.id,
      similarity: result.similarity,
      sharedNoteIds,
      divergentNoteIds,
      // the dupe's own description reads as the editorial commentary
      commentary: clone.description,
    } satisfies CloneRelationship;
  })
  .filter((r): r is CloneRelationship => r !== null);

/** Quick lookups in both directions. */
export const RELATIONSHIP_BY_CLONE: Record<string, CloneRelationship> = Object.fromEntries(
  RELATIONSHIPS.map((rel) => [rel.cloneId, rel]),
);

// An original can have several interpretations; keep the first for the
// "has an interpretation" hint in the detail panel.
export const RELATIONSHIP_BY_ORIGINAL: Record<string, CloneRelationship> = {};
for (const rel of RELATIONSHIPS) {
  if (!RELATIONSHIP_BY_ORIGINAL[rel.originalId]) {
    RELATIONSHIP_BY_ORIGINAL[rel.originalId] = rel;
  }
}
