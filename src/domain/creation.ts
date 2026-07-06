// ============================================================
// SILLAGE — user creations (The Atelier)
// A UserCreation is deliberately Perfume-shaped: toPerfume()
// adapts it so EVERY existing engine — compare(), matching,
// radar, BottleVisual, the olfactory pyramid — works on a
// home-made blend with zero changes.
// ============================================================

import type {
  FragranceNote,
  NotePosition,
  NotePyramid,
  NoteRef,
  Perfume,
} from './types.ts';
import { deriveAccords, derivePerformance, deriveSeasons } from './derive.ts';

export interface UserCreation {
  id: string; // 'crn-...'
  name: string;
  description?: string;
  pyramid: NotePyramid;
  createdAt: number; // epoch ms
  updatedAt: number;
}

export const TIER_CAP = 6; // soft perfumery sanity cap per tier
export const TIERS: NotePosition[] = ['top', 'heart', 'base'];

export function emptyPyramid(): NotePyramid {
  return { top: [], heart: [], base: [] };
}

export function creationId(): string {
  return `crn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function allRefs(pyramid: NotePyramid): NoteRef[] {
  return [...pyramid.top, ...pyramid.heart, ...pyramid.base];
}

export function noteCount(pyramid: NotePyramid): number {
  return allRefs(pyramid).length;
}

export function tierOf(pyramid: NotePyramid, noteId: string): NotePosition | null {
  for (const tier of TIERS) {
    if (pyramid[tier].some((n) => n.noteId === noteId)) return tier;
  }
  return null;
}

/** Adapt a creation into a full Perfume so all engines apply. */
export function toPerfume(
  creation: Pick<UserCreation, 'id' | 'name' | 'description' | 'pyramid'>,
  notes: Record<string, FragranceNote>,
  familyColor: Record<string, string>,
): Perfume {
  const accords = deriveAccords(creation.pyramid, notes);
  const seasons = deriveSeasons(accords);
  return {
    id: `creation:${creation.id}`,
    name: creation.name || 'Untitled',
    brand: 'Your Atelier',
    type: 'original',
    pyramid: creation.pyramid,
    accords,
    accent: familyColor[accords[0]?.family ?? 'amber'],
    performance: derivePerformance(creation.pyramid, accords),
    context: { seasons, moods: [], occasions: [] },
    description: creation.description ?? '',
  };
}
