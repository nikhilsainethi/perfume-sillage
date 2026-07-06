// ============================================================
// SILLAGE — Atelier draft analysis hook
// One memoized pipeline: draft pyramid -> Perfume adapter ->
// character line, harmony, and nearest neighbors in the atlas.
// All derived; recomputes only when the pyramid changes.
// ============================================================

import { useMemo } from 'react';
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

  return useMemo(() => {
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

    let neighbors: Neighbor[] = [];
    if (count >= 2) {
      neighbors = PERFUMES.map((p) => ({
        perfume: p,
        overall: compare(p, perfume, NOTES).similarity.overall,
      }))
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 4);
    }

    return { perfume, count, line, sparks, cautions, neighbors };
  }, [pyramid, name, id]);
}
