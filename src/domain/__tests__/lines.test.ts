// ============================================================
// SILLAGE — fragrance-line detection tests
// ============================================================

import { describe, expect, it } from 'vitest';
import type { Perfume } from '../types.ts';
import { buildLines } from '../lines.ts';
import { PERFUMES } from '../../data/perfumes';

const stub = (id: string, name: string, brand: string, year?: number): Perfume => ({
  id,
  name,
  brand,
  type: 'original',
  year,
  pyramid: { top: [], heart: [], base: [] },
  accords: [],
  performance: { longevity: 5, projection: 5, sillage: 5 },
  context: { seasons: [], moods: [], occasions: [] },
  description: '',
});

describe('buildLines', () => {
  it('groups word-boundary flankers under the shortest root', () => {
    const lines = buildLines([
      stub('cw', 'Cool Water', 'Davidoff', 1988),
      stub('cwi', 'Cool Water Intense', 'Davidoff', 2019),
      stub('cwp', 'Cool Water Parfum', 'Davidoff', 2021),
      stub('other', 'Hot Water', 'Davidoff', 2000),
    ]);
    const line = lines.get('cw');
    expect(line?.rootId).toBe('cw');
    expect(line?.memberIds).toEqual(['cw', 'cwi', 'cwp']);
    expect(lines.get('cwi')?.rootId).toBe('cw');
    expect(lines.has('other')).toBe(false);
  });

  it('requires the SAME brand and a word boundary', () => {
    const lines = buildLines([
      stub('a', 'Eros', 'Versace'),
      stub('b', 'Eros Flame', 'Versace'),
      stub('c', 'Eros Flame', 'NotVersace'),
      stub('d', 'Erosion', 'Versace'), // no word boundary — not a flanker
    ]);
    expect(lines.get('a')?.memberIds).toEqual(['a', 'b']);
    expect(lines.has('c')).toBe(false);
    expect(lines.has('d')).toBe(false);
  });

  it('never lets a too-short name own a line', () => {
    const lines = buildLines([
      stub('y', 'Y', 'YSL'),
      stub('y2', 'Y Le Parfum', 'YSL'),
    ]);
    expect(lines.has('y')).toBe(false);
    expect(lines.has('y2')).toBe(false);
  });

  it('finds real lines in the shipping catalog', () => {
    const lines = buildLines(PERFUMES);
    const cw = lines.get('cool-water');
    expect(cw).toBeDefined();
    expect(cw!.memberIds.length).toBeGreaterThanOrEqual(2);
    expect(cw!.rootId).toBe('cool-water');
  });
});
