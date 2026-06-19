// ============================================================
// SILLAGE — Comparison engine (§7.2)
// Pure derivation of a ComparisonResult from an Original/Clone
// pair. Heart & base dominate the "smells the same" reading.
// ============================================================

import type {
  Accord,
  AccordFamily,
  AccordOverlapEntry,
  ComparisonResult,
  FragranceNote,
  LayerComparison,
  NotePosition,
  NoteRef,
  Perfume,
  RadarAxis,
} from './types';

// Families that read "warm" vs "fresh" on skin — used for radar axes.
const WARM_FAMILIES: AccordFamily[] = ['amber', 'sweet', 'spicy', 'woody', 'leather'];
const FRESH_FAMILIES: AccordFamily[] = ['citrus', 'fresh', 'aromatic', 'floral'];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Union of accord families with each side's weight (0 if absent). */
export function mergeAccords(a: Accord[], b: Accord[]): AccordOverlapEntry[] {
  const families = new Set<AccordFamily>([
    ...a.map((x) => x.family),
    ...b.map((x) => x.family),
  ]);
  const aMap = new Map(a.map((x) => [x.family, x.weight]));
  const bMap = new Map(b.map((x) => [x.family, x.weight]));

  return [...families]
    .map((family) => ({
      family,
      originalWeight: aMap.get(family) ?? 0,
      cloneWeight: bMap.get(family) ?? 0,
    }))
    .sort(
      (x, y) =>
        Math.max(y.originalWeight, y.cloneWeight) -
        Math.max(x.originalWeight, x.cloneWeight),
    );
}

/** Cosine similarity over the accord-weight vectors (0..1). */
export function cosineAccords(a: Accord[], b: Accord[]): number {
  const merged = mergeAccords(a, b);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const { originalWeight, cloneWeight } of merged) {
    dot += originalWeight * cloneWeight;
    magA += originalWeight * originalWeight;
    magB += cloneWeight * cloneWeight;
  }
  if (magA === 0 || magB === 0) return 0;
  return clamp01(dot / (Math.sqrt(magA) * Math.sqrt(magB)));
}

function familyWeightSum(accords: Accord[], families: AccordFamily[]): number {
  const set = new Set(families);
  return clamp01(
    accords.filter((a) => set.has(a.family)).reduce((s, a) => s + a.weight, 0),
  );
}

function noteCount(p: Perfume): number {
  return p.pyramid.top.length + p.pyramid.heart.length + p.pyramid.base.length;
}

/** Six-axis radar (§7.4). Performance is real; warmth/freshness/complexity derived. */
export function buildRadar(original: Perfume, clone: Perfume): RadarAxis[] {
  const axis = (
    name: RadarAxis['axis'],
    o: number,
    c: number,
  ): RadarAxis => ({ axis: name, original: clamp01(o), clone: clamp01(c) });

  return [
    axis('Longevity', original.performance.longevity / 10, clone.performance.longevity / 10),
    axis('Projection', original.performance.projection / 10, clone.performance.projection / 10),
    axis('Sillage', original.performance.sillage / 10, clone.performance.sillage / 10),
    axis(
      'Warmth',
      familyWeightSum(original.accords, WARM_FAMILIES),
      familyWeightSum(clone.accords, WARM_FAMILIES),
    ),
    axis(
      'Freshness',
      familyWeightSum(original.accords, FRESH_FAMILIES),
      familyWeightSum(clone.accords, FRESH_FAMILIES),
    ),
    axis('Complexity', noteCount(original) / 14, noteCount(clone) / 14),
  ];
}

// ---- editorial difference copy ----------------------------------

function listNames(
  refs: NoteRef[],
  notes: Record<string, FragranceNote>,
  max = 3,
): string {
  const names = refs.slice(0, max).map((r) => notes[r.noteId]?.name ?? r.noteId);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

/** Human-readable "where it's close / where it drifts" lines. */
export function deriveDifferences(
  layers: LayerComparison[],
  original: Perfume,
  clone: Perfume,
  notes: Record<string, FragranceNote>,
): string[] {
  const out: string[] = [];
  const byPos = (pos: NotePosition) => layers.find((l) => l.position === pos)!;

  const heart = byPos('heart');
  if (heart.uniqueToClone.length || heart.uniqueToOriginal.length) {
    const adds = listNames(heart.uniqueToClone, notes);
    const drops = listNames(heart.uniqueToOriginal, notes);
    if (adds && drops) {
      out.push(`In the heart, the interpretation leans into ${adds} where the original holds ${drops}.`);
    } else if (adds) {
      out.push(`The interpretation adds ${adds} to the heart that the original never carries.`);
    } else if (drops) {
      out.push(`The original's heart of ${drops} goes missing in the interpretation.`);
    }
  }

  const base = byPos('base');
  if (base.uniqueToClone.length || base.uniqueToOriginal.length) {
    const adds = listNames(base.uniqueToClone, notes);
    const drops = listNames(base.uniqueToOriginal, notes);
    if (adds && drops) {
      out.push(`The dry-down diverges: it settles on ${adds} rather than the original's ${drops}.`);
    } else if (adds) {
      out.push(`A new ${adds} base lengthens the dry-down beyond the original.`);
    } else if (drops) {
      out.push(`It thins out the base, dropping the original's ${drops}.`);
    }
  }

  const top = byPos('top');
  if (top.uniqueToClone.length || top.uniqueToOriginal.length) {
    const adds = listNames(top.uniqueToClone, notes, 2);
    if (adds) out.push(`The opening reads differently, with ${adds} up top.`);
  }

  const dLong = clone.performance.longevity - original.performance.longevity;
  if (dLong <= -2) out.push('Noticeably shorter on skin — the original simply lasts longer.');
  else if (dLong >= 2) out.push('Actually outlasts the original through the day.');

  const dProj = clone.performance.projection - original.performance.projection;
  if (dProj <= -2) out.push('Projects softer; this is the quieter, closer-to-skin reading.');
  else if (dProj >= 2) out.push('Projects harder — a louder, more announced wake.');

  return out.slice(0, 5);
}

/** Build the full ComparisonResult for a chosen pair. */
export function compare(
  original: Perfume,
  clone: Perfume,
  notes: Record<string, FragranceNote>,
): ComparisonResult {
  const layers: LayerComparison[] = (['top', 'heart', 'base'] as NotePosition[]).map(
    (pos) => {
      const o = original.pyramid[pos];
      const c = clone.pyramid[pos];
      const oIds = new Set(o.map((n) => n.noteId));
      const cIds = new Set(c.map((n) => n.noteId));
      return {
        position: pos,
        shared: c.filter((n) => oIds.has(n.noteId)),
        uniqueToOriginal: o.filter((n) => !cIds.has(n.noteId)),
        uniqueToClone: c.filter((n) => !oIds.has(n.noteId)),
      };
    },
  );

  // per-layer Jaccard similarity
  const layerSim = (l: LayerComparison) => {
    const union =
      l.shared.length + l.uniqueToOriginal.length + l.uniqueToClone.length;
    return union === 0 ? 0 : l.shared.length / union;
  };
  const byLayer = {
    top: layerSim(layers[0]),
    heart: layerSim(layers[1]),
    base: layerSim(layers[2]),
  };

  const accordOverlap = mergeAccords(original.accords, clone.accords);
  const accordSim = cosineAccords(original.accords, clone.accords);

  // heart & base matter most for "smelling the same"
  const overall = Math.round(
    (0.45 * byLayer.heart + 0.3 * byLayer.base + 0.15 * byLayer.top + 0.1 * accordSim) *
      100,
  );

  return {
    original,
    clone,
    similarity: { overall, byLayer, accordOverlap: accordSim },
    layers,
    accordOverlap,
    radar: buildRadar(original, clone),
    keyDifferences: deriveDifferences(layers, original, clone, notes),
  };
}
