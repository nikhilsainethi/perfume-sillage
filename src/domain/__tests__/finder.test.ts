// ============================================================
// SILLAGE — Scent Finder tests (against the shipping catalog)
// ============================================================

import { describe, expect, it } from 'vitest';
import { findScents, type FinderAnswers } from '../finder.ts';
import { NOTES } from '../../data/notes';
import { PERFUMES } from '../../data/perfumes';

const base: FinderAnswers = {
  audience: 'any',
  climate: 'any',
  character: 'warm-sweet',
  loudness: 'balanced',
  lovedNoteId: null,
};

describe('findScents', () => {
  it('returns exactly three picks, sorted by match', () => {
    const picks = findScents(base, PERFUMES, NOTES);
    expect(picks).toHaveLength(3);
    expect(picks[0].matchPct).toBeGreaterThanOrEqual(picks[1].matchPct);
    expect(picks[1].matchPct).toBeGreaterThanOrEqual(picks[2].matchPct);
    for (const p of picks) {
      expect(p.matchPct).toBeGreaterThan(0);
      expect(p.matchPct).toBeLessThanOrEqual(100);
      expect(p.reasons.length).toBeGreaterThan(0);
    }
  });

  it('audience is a hard filter (unisex always eligible)', () => {
    const forHim = findScents({ ...base, audience: 'him' }, PERFUMES, NOTES, 50);
    expect(forHim.every((p) => p.perfume.gender !== 'feminine')).toBe(true);
    const forHer = findScents({ ...base, audience: 'her' }, PERFUMES, NOTES, 50);
    expect(forHer.every((p) => p.perfume.gender !== 'masculine')).toBe(true);
  });

  it('a loved note pulls carriers to the top', () => {
    const picks = findScents(
      { ...base, lovedNoteId: 'vanilla' },
      PERFUMES,
      NOTES,
    );
    const carries = (p: (typeof picks)[0]) =>
      ['top', 'heart', 'base'].some((t) =>
        p.perfume.pyramid[t as 'top'].some((r) => r.noteId === 'vanilla'),
      );
    expect(picks.some(carries)).toBe(true);
    expect(picks[0].reasons.join(' ')).toMatch(/Vanilla/);
  });

  it('character steers the profile', () => {
    const fresh = findScents({ ...base, character: 'fresh' }, PERFUMES, NOTES);
    const freshShare = fresh[0].perfume.accords
      .filter((a) => ['citrus', 'fresh', 'aromatic'].includes(a.family))
      .reduce((s, a) => s + a.weight, 0);
    expect(freshShare).toBeGreaterThan(0.45);

    const dark = findScents({ ...base, character: 'dark-bold' }, PERFUMES, NOTES);
    expect(dark[0].perfume.id).not.toBe(fresh[0].perfume.id);
  });

  it('cold climate excludes summer-only picks from reasons', () => {
    const picks = findScents({ ...base, climate: 'cold' }, PERFUMES, NOTES);
    for (const p of picks) {
      expect(
        p.perfume.context.seasons.some((s) => ['autumn', 'winter'].includes(s)),
      ).toBe(true);
    }
  });
});
