import { describe, expect, it } from 'vitest';
import { deriveContext } from '../derive.ts';
import type { Accord } from '../types.ts';

const perf = (projection: number) => ({ longevity: 7, projection, sillage: 7 });

describe('deriveContext', () => {
  it('reads an amber-sweet bomb as sensual evening wear', () => {
    const accords: Accord[] = [
      { family: 'amber', weight: 0.4 },
      { family: 'sweet', weight: 0.3 },
      { family: 'woody', weight: 0.3 },
    ];
    const ctx = deriveContext(accords, perf(9));
    expect(ctx.moods).toContain('sensual');
    expect(ctx.occasions).toContain('evenings out');
  });

  it('reads a soft citrus as crisp office wear', () => {
    const accords: Accord[] = [
      { family: 'citrus', weight: 0.5 },
      { family: 'fresh', weight: 0.3 },
      { family: 'aromatic', weight: 0.2 },
    ];
    const ctx = deriveContext(accords, perf(4));
    expect(ctx.moods).toContain('crisp');
    expect(ctx.occasions).toContain('the office');
  });

  it('never returns empty moods or occasions', () => {
    const ctx = deriveContext([], perf(6));
    expect(ctx.moods.length).toBeGreaterThan(0);
    expect(ctx.occasions.length).toBeGreaterThan(0);
  });
});
