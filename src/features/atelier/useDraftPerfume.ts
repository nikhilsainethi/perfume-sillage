// ============================================================
// SILLAGE — Atelier draft analysis hook
// One memoized pipeline: draft pyramid -> Perfume adapter ->
// character line, harmony, and nearest neighbors in the atlas.
// All derived; recomputes only when the pyramid changes.
// ============================================================

import { useDeferredValue, useMemo } from 'react';
import type { Perfume } from '@/domain/types';
import { toPerfume, allRefs, noteCount } from '@/domain/creation';
import { characterLine } from '@/domain/creationInsights';
import { cautionsFor, type Caution, type Spark } from '@/domain/harmony';
import { compare } from '@/domain/comparison';
import { NOTES, FAMILY_COLOR } from '@/data/notes';
import { PERFUMES } from '@/data/perfumes';
import { HARMONY } from '@/data/harmonyModel';
import { useAtelier } from '@/store/atelierStore';

export interface Neighbor {
  perfume: Perfume;
  overall: number; // 0..100
}

export interface DraftAnalysis {
  perfume: Perfume; // the draft, engine-shaped
  count: number;
  line: string;
  sparks: Spark[];
  cautions: Caution[];
  neighbors: Neighbor[];
}

export function useDraftPerfume(): DraftAnalysis {
  const pyramid = useAtelier((s) => s.draft.pyramid);
  const name = useAtelier((s) => s.draft.name);
  const id = useAtelier((s) => s.draft.id);

  // Fast lane: accords, character line, harmony — cheap, updates every tick.
  const immediate = useMemo(() => {
    const perfume = toPerfume(
      { id: id ?? 'draft', name: name || 'Untitled', pyramid },
      NOTES,
      FAMILY_COLOR,
    );
    const count = noteCount(pyramid);
    const line = characterLine(pyramid, perfume.accords, perfume.context.seasons, NOTES);
    const ids = allRefs(pyramid).map((n) => n.noteId);
    const sparks = count >= 2 ? HARMONY.sparksFor(ids, NOTES) : [];
    const cautions = cautionsFor(pyramid, NOTES);
    return { perfume, count, line, sparks, cautions };
  }, [pyramid, name, id]);

  // Slow lane: ranking the whole atlas (378 full comparisons) is deferred so
  // dragging an intensity slider never blocks the frame.
  const deferredPyramid = useDeferredValue(pyramid);
  const neighbors = useMemo<Neighbor[]>(() => {
    if (noteCount(deferredPyramid) < 2) return [];
    const draftPerfume = toPerfume(
      { id: 'draft-rank', name: 'draft', pyramid: deferredPyramid },
      NOTES,
      FAMILY_COLOR,
    );
    return PERFUMES.map((p) => ({
      perfume: p,
      overall: compare(p, draftPerfume, NOTES).similarity.overall,
    }))
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 4);
  }, [deferredPyramid]);

  return { ...immediate, neighbors };
}
