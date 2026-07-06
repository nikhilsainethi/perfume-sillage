// ============================================================
// SILLAGE — harmony engine (pure)
// Note-pair affinity learned from the catalog itself: pairs
// that co-occur across the 127 real scents more often than
// chance (PMI-style) are "sparks". Balance heuristics on the
// composition produce "cautions". No hand-authored data.
// ============================================================

import type { FragranceNote, NotePyramid, Perfume } from './types.ts';
import { TIER_CAP, allRefs } from './creation.ts';

export interface Spark {
  a: string; // note id
  b: string;
  score: number; // PMI, > 0 means "more than chance"
  support: number; // how many catalog scents carry both
  message: string;
}

export interface Caution {
  kind: 'top-heavy' | 'no-base' | 'muddy' | 'tier-overflow' | 'thin';
  message: string;
}

export interface HarmonyModel {
  pairPMI(a: string, b: string): { score: number; support: number } | null;
  sparksFor(noteIds: string[], notes: Record<string, FragranceNote>): Spark[];
}

/** Build the affinity model from a catalog. Call once at module scope. */
export function buildHarmonyModel(perfumes: Perfume[]): HarmonyModel {
  const N = perfumes.length || 1;
  const single = new Map<string, number>();
  const pair = new Map<string, number>();
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

  for (const p of perfumes) {
    const ids = [...new Set(allRefs(p.pyramid).map((n) => n.noteId))];
    for (const id of ids) single.set(id, (single.get(id) ?? 0) + 1);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const k = key(ids[i], ids[j]);
        pair.set(k, (pair.get(k) ?? 0) + 1);
      }
    }
  }

  const pairPMI = (a: string, b: string) => {
    if (a === b) return null;
    const cab = pair.get(key(a, b)) ?? 0;
    if (cab < 2) return null; // demand real evidence
    const ca = single.get(a) ?? 0;
    const cb = single.get(b) ?? 0;
    if (!ca || !cb) return null;
    return { score: Math.log((cab * N) / (ca * cb)), support: cab };
  };

  const sparksFor = (noteIds: string[], notes: Record<string, FragranceNote>) => {
    const out: Spark[] = [];
    for (let i = 0; i < noteIds.length; i++) {
      for (let j = i + 1; j < noteIds.length; j++) {
        const hit = pairPMI(noteIds[i], noteIds[j]);
        if (!hit || hit.score <= 0.35) continue;
        const an = notes[noteIds[i]]?.name ?? noteIds[i];
        const bn = notes[noteIds[j]]?.name ?? noteIds[j];
        out.push({
          a: noteIds[i],
          b: noteIds[j],
          score: hit.score,
          support: hit.support,
          message: `${an} sings with ${bn} — ${hit.support} scents in the atlas agree.`,
        });
      }
    }
    return out.sort((x, y) => y.score - x.score).slice(0, 4);
  };

  return { pairPMI, sparksFor };
}

/** Structural balance cautions on the composition itself. */
export function cautionsFor(
  pyramid: NotePyramid,
  notes: Record<string, FragranceNote>,
): Caution[] {
  const out: Caution[] = [];
  const w = (tier: 'top' | 'heart' | 'base') =>
    pyramid[tier].reduce((s, n) => s + n.intensity, 0);
  const top = w('top');
  const heart = w('heart');
  const base = w('base');
  const total = top + heart + base;
  const count = allRefs(pyramid).length;

  if (count === 0) return out;
  if (count <= 2) {
    out.push({ kind: 'thin', message: 'A very sparse sketch — add a heart to give it character.' });
  }
  if (total > 0 && top / total > 0.55 && base < 0.4) {
    out.push({ kind: 'top-heavy', message: 'Top-heavy: this will sparkle, then vanish within the hour. Anchor the base.' });
  }
  if (count >= 3 && pyramid.base.length === 0) {
    out.push({ kind: 'no-base', message: 'No base notes — nothing to hold the dry-down.' });
  }
  for (const tier of ['top', 'heart', 'base'] as const) {
    if (pyramid[tier].length > TIER_CAP) {
      out.push({ kind: 'tier-overflow', message: `The ${tier} is crowded (${pyramid[tier].length} notes) — great blends edit.` });
      break;
    }
  }
  // muddy: too many *perceptual blocks* pulling with real weight.
  // Kindred families blend rather than compete (amber+sweet read as one
  // oriental block; citrus+fresh+aromatic as one freshness block).
  const BLOCK: Record<string, string> = {
    amber: 'oriental', sweet: 'oriental',
    woody: 'dark', leather: 'dark',
    citrus: 'freshness', fresh: 'freshness', aromatic: 'freshness',
    floral: 'floral',
    spicy: 'spice',
  };
  const blockWeight = new Map<string, number>();
  for (const ref of allRefs(pyramid)) {
    const fam = notes[ref.noteId]?.family;
    if (!fam) continue;
    const block = BLOCK[fam] ?? fam;
    blockWeight.set(block, (blockWeight.get(block) ?? 0) + ref.intensity);
  }
  const blockTotal = [...blockWeight.values()].reduce((a, b) => a + b, 0) || 1;
  const loud = [...blockWeight.values()].filter((v) => v / blockTotal >= 0.18).length;
  if (loud >= 4) {
    out.push({ kind: 'muddy', message: `${loud} scent directions competing at full voice — it may turn muddy on skin.` });
  }
  return out;
}
