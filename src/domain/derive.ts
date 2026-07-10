// ============================================================
// SILLAGE — shared derivation (pure)
// Accords, accent, seasons and performance derived from a note
// pyramid. Used by BOTH the catalog builder (data/perfumes.ts)
// and user creations (domain/creation.ts) so a home-made blend
// flows through exactly the same engines as a real scent.
// ============================================================

import type {
  Accord,
  AccordFamily,
  FragranceNote,
  NotePosition,
  NotePyramid,
  PerformanceProfile,
  Season,
} from './types.ts';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Accords are the overall character; heart & base weigh a touch more than top.
const POS_WEIGHT: Record<NotePosition, number> = { top: 0.8, heart: 1.0, base: 0.95 };

export function deriveAccords(
  pyramid: NotePyramid,
  notes: Record<string, FragranceNote>,
): Accord[] {
  const tally = new Map<AccordFamily, number>();
  (['top', 'heart', 'base'] as NotePosition[]).forEach((pos) => {
    for (const ref of pyramid[pos]) {
      const fam = notes[ref.noteId]?.family;
      if (!fam) continue;
      tally.set(fam, (tally.get(fam) ?? 0) + ref.intensity * POS_WEIGHT[pos]);
    }
  });
  const total = [...tally.values()].reduce((a, b) => a + b, 0) || 1;
  return [...tally.entries()]
    .map(([family, w]) => ({ family, weight: w / total }))
    .sort((a, b) => b.weight - a.weight)
    .filter((a) => a.weight >= 0.04)
    .slice(0, 6);
}

const WARM: AccordFamily[] = ['amber', 'sweet', 'spicy', 'woody', 'leather'];
const FRESH: AccordFamily[] = ['citrus', 'fresh', 'aromatic'];

function familyShare(accords: Accord[], fams: AccordFamily[]): number {
  const set = new Set(fams);
  return accords.filter((a) => set.has(a.family)).reduce((s, a) => s + a.weight, 0);
}

/** Seasons inferred from the accord temperature. */
export function deriveSeasons(accords: Accord[]): Season[] {
  const warm = familyShare(accords, WARM);
  const fresh = familyShare(accords, FRESH);
  if (warm > 0.6) return ['autumn', 'winter'];
  if (fresh > 0.55) return ['spring', 'summer'];
  if (warm > fresh) return ['autumn', 'spring'];
  return ['spring', 'autumn'];
}

/** Rough-but-honest performance heuristic for compositions & imported scents.
 *  Freshness actively PENALIZES longevity/projection — a featherweight citrus
 *  must not read like an amber bomb just because the math centered it. */
export function derivePerformance(
  pyramid: NotePyramid,
  accords: Accord[],
): PerformanceProfile {
  const tierWeight = (pos: NotePosition) =>
    pyramid[pos].reduce((s, n) => s + n.intensity, 0);
  const top = tierWeight('top');
  const heart = tierWeight('heart');
  const base = tierWeight('base');
  const total = top + heart + base || 1;
  const count =
    pyramid.top.length + pyramid.heart.length + pyramid.base.length || 1;
  const avgIntensity = total / count;
  const warm = familyShare(accords, WARM);
  const fresh = familyShare(accords, FRESH);

  const longevity = clamp(
    Math.round(2.5 + 6 * (base / total) + 3 * warm - 2.5 * fresh),
    2,
    10,
  );
  const projection = clamp(
    Math.round(
      2 +
        4.5 * avgIntensity +
        3 * familyShare(accords, ['amber', 'sweet', 'spicy']) -
        1.5 * fresh,
    ),
    2,
    10,
  );
  const sillage = clamp(Math.round((longevity + projection) / 2), 2, 10);
  return { longevity, projection, sillage };
}
