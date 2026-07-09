// ============================================================
// SILLAGE — Derived selectors (§8.3)
// Pure, memoized reads over the store. The view never filters;
// it renders this output, so a toggle reflows everything once.
// ============================================================

import { useMemo } from 'react';
import type {
  ComparisonResult,
  FragranceNote,
  NoteMatch,
  Perfume,
} from '@/domain/types';
import { matchPerfumes } from '@/domain/matching';
import { compare } from '@/domain/comparison';
import { useDiscovery } from './discoveryStore';
import { PERFUME_BY_ID } from '@/data/perfumes';
import {
  RELATIONSHIP_BY_CLONE,
  RELATIONSHIP_BY_ORIGINAL,
} from '@/data/relationships';

const ACCORD_FLOOR = 0.15;

/** Search across name, brand, and the synonyms of the perfume's own notes. */
function matchesQuery(
  p: Perfume,
  q: string,
  notes: Record<string, FragranceNote>,
): boolean {
  if (!q) return true;
  if (`${p.name} ${p.brand} ${p.house ?? ''} ${p.perfumer ?? ''}`.toLowerCase().includes(q))
    return true;
  const allNoteIds = [
    ...p.pyramid.top,
    ...p.pyramid.heart,
    ...p.pyramid.base,
  ].map((n) => n.noteId);
  return allNoteIds.some((id) => {
    const note = notes[id];
    if (!note) return false;
    if (note.name.toLowerCase().includes(q)) return true;
    return (note.synonyms ?? []).some((s) => s.toLowerCase().includes(q));
  });
}

/**
 * The full Discover pipeline: search -> type -> accord pre-filter, then note
 * matching + weighted relevance sort, then optional clone-linking (§5.2).
 */
export function useMatches(): NoteMatch[] {
  const perfumes = useDiscovery((s) => s.perfumes);
  const notes = useDiscovery((s) => s.notes);
  const selectedNoteIds = useDiscovery((s) => s.selectedNoteIds);
  const selectedAccords = useDiscovery((s) => s.selectedAccords);
  const searchQuery = useDiscovery((s) => s.searchQuery);
  const typeFilter = useDiscovery((s) => s.typeFilter);
  const matchMode = useDiscovery((s) => s.matchMode);
  const linkClones = useDiscovery((s) => s.linkClones);

  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1) search -> 2) type -> 3) accord pre-filter
    const pre = perfumes.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (!matchesQuery(p, q, notes)) return false;
      if (selectedAccords.length) {
        const fams = new Set(
          p.accords.filter((a) => a.weight >= ACCORD_FLOOR).map((a) => a.family),
        );
        if (!selectedAccords.every((f) => fams.has(f))) return false;
      }
      return true;
    });

    // 4-5) note match + relevance sort
    const matches = matchPerfumes({ perfumes: pre, notes, selectedNoteIds, matchMode });

    // 6) optional: inject each result's counterpart adjacent to it
    if (!linkClones) return matches;

    const present = new Set(matches.map((m) => m.perfume.id));
    const linked: NoteMatch[] = [];
    for (const m of matches) {
      linked.push(m);
      const counterpartId =
        m.perfume.type === 'clone'
          ? m.perfume.inspiredByOriginalId
          : RELATIONSHIP_BY_ORIGINAL[m.perfume.id]?.cloneId;
      if (counterpartId && !present.has(counterpartId)) {
        const cp = PERFUME_BY_ID[counterpartId];
        if (cp) {
          present.add(counterpartId);
          linked.push({
            perfume: cp,
            relevance: m.relevance,
            coverage: 0,
            matchedNoteIds: [],
            matchType: 'partial',
          });
        }
      }
    }
    return linked;
  }, [
    perfumes,
    notes,
    selectedNoteIds,
    selectedAccords,
    searchQuery,
    typeFilter,
    matchMode,
    linkClones,
  ]);
}

/** Ordered perfumes for the carousel. */
export function useOrderedPerfumes(): Perfume[] {
  const matches = useMatches();
  return useMemo(() => matches.map((m) => m.perfume), [matches]);
}

export function useExactCount(): number {
  const matches = useMatches();
  return useMemo(
    () => matches.filter((m) => m.matchType === 'exact').length,
    [matches],
  );
}

export function useActivePerfume(): Perfume | null {
  const id = useDiscovery((s) => s.activePerfumeId);
  return id ? PERFUME_BY_ID[id] ?? null : null;
}

/** The Original/Clone pair currently chosen for comparison. */
export function useComparisonPair(): { original: Perfume | null; clone: Perfume | null } {
  const originalId = useDiscovery((s) => s.comparison.originalId);
  const cloneId = useDiscovery((s) => s.comparison.cloneId);
  return useMemo(
    () => ({
      original: originalId ? PERFUME_BY_ID[originalId] ?? null : null,
      clone: cloneId ? PERFUME_BY_ID[cloneId] ?? null : null,
    }),
    [originalId, cloneId],
  );
}

/** Full ComparisonResult for the chosen pair, or null until both are set. */
export function useComparison(): ComparisonResult | null {
  const notes = useDiscovery((s) => s.notes);
  const { original, clone } = useComparisonPair();
  return useMemo(() => {
    if (!original || !clone) return null;
    return compare(original, clone, notes);
  }, [original, clone, notes]);
}

/** For the "inspired by" link: a perfume's counterpart + its relationship. */
export function useCounterpart(perfume: Perfume | null) {
  return useMemo(() => {
    if (!perfume) return null;
    const rel =
      perfume.type === 'clone'
        ? RELATIONSHIP_BY_CLONE[perfume.id]
        : RELATIONSHIP_BY_ORIGINAL[perfume.id];
    if (!rel) return null;
    const counterpartId = perfume.type === 'clone' ? rel.originalId : rel.cloneId;
    const counterpart = PERFUME_BY_ID[counterpartId] ?? null;
    return counterpart ? { counterpart, relationship: rel } : null;
  }, [perfume]);
}
