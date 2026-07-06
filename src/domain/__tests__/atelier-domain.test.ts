// ============================================================
// SILLAGE — domain tests for the Atelier (pure modules only)
// ============================================================

import { describe, expect, it } from 'vitest';
import type { NotePyramid } from '../types';
import { toPerfume, emptyPyramid, tierOf } from '../creation';
import { deriveAccords, derivePerformance, deriveSeasons } from '../derive';
import { buildHarmonyModel, cautionsFor } from '../harmony';
import { encodeCreation, decodeCreation } from '../shareCodec';
import { characterLine } from '../creationInsights';
import { compare } from '../comparison';
import { NOTES, FAMILY_COLOR } from '../../data/notes';
import { PERFUMES, PERFUME_BY_ID } from '../../data/perfumes';

const amberGourmand: NotePyramid = {
  top: [{ noteId: 'bergamot', intensity: 0.7 }],
  heart: [
    { noteId: 'rose', intensity: 0.8 },
    { noteId: 'saffron', intensity: 0.7 },
  ],
  base: [
    { noteId: 'vanilla', intensity: 0.9 },
    { noteId: 'amber', intensity: 0.8 },
  ],
};

describe('derive', () => {
  it('accord weights are normalized and sorted', () => {
    const accords = deriveAccords(amberGourmand, NOTES);
    const total = accords.reduce((s, a) => s + a.weight, 0);
    expect(total).toBeGreaterThan(0.9);
    expect(total).toBeLessThanOrEqual(1.001);
    for (let i = 1; i < accords.length; i++) {
      expect(accords[i - 1].weight).toBeGreaterThanOrEqual(accords[i].weight);
    }
  });

  it('warm compositions land in cold seasons', () => {
    const accords = deriveAccords(amberGourmand, NOTES);
    const seasons = deriveSeasons(accords);
    expect(seasons).toContain('autumn');
  });

  it('performance stays within 2..10', () => {
    const accords = deriveAccords(amberGourmand, NOTES);
    const perf = derivePerformance(amberGourmand, accords);
    for (const v of [perf.longevity, perf.projection, perf.sillage]) {
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(10);
    }
  });
});

describe('creation adapter', () => {
  it('toPerfume produces an engine-compatible Perfume', () => {
    const p = toPerfume(
      { id: 'x1', name: 'Nocturne', pyramid: amberGourmand },
      NOTES,
      FAMILY_COLOR,
    );
    expect(p.id).toBe('creation:x1');
    expect(p.accords.length).toBeGreaterThan(0);
    expect(p.accent).toMatch(/^#/);
    // the whole point: compare() works against a real catalog scent
    const result = compare(PERFUME_BY_ID['baccarat-rouge-540'], p, NOTES);
    expect(result.similarity.overall).toBeGreaterThan(0);
    expect(result.layers).toHaveLength(3);
  });

  it('tierOf finds notes and emptyPyramid is empty', () => {
    expect(tierOf(amberGourmand, 'vanilla')).toBe('base');
    expect(tierOf(amberGourmand, 'oud')).toBeNull();
    expect(tierOf(emptyPyramid(), 'rose')).toBeNull();
  });
});

describe('harmony', () => {
  const model = buildHarmonyModel(PERFUMES);

  it('PMI is symmetric and evidence-gated', () => {
    const ab = model.pairPMI('bergamot', 'ambroxan');
    const ba = model.pairPMI('ambroxan', 'bergamot');
    expect(ab?.score).toBe(ba?.score);
    expect(model.pairPMI('bergamot', 'bergamot')).toBeNull();
  });

  it('sparks only reference the provided notes', () => {
    const ids = ['rose', 'saffron', 'oud', 'vanilla'];
    for (const s of model.sparksFor(ids, NOTES)) {
      expect(ids).toContain(s.a);
      expect(ids).toContain(s.b);
      expect(s.support).toBeGreaterThanOrEqual(2);
    }
  });

  it('flags a top-heavy composition', () => {
    const topHeavy: NotePyramid = {
      top: [
        { noteId: 'lemon', intensity: 0.9 },
        { noteId: 'bergamot', intensity: 0.9 },
        { noteId: 'grapefruit', intensity: 0.9 },
      ],
      heart: [{ noteId: 'jasmine', intensity: 0.3 }],
      base: [],
    };
    const kinds = cautionsFor(topHeavy, NOTES).map((c) => c.kind);
    expect(kinds).toContain('top-heavy');
    expect(kinds).toContain('no-base');
  });

  it('is quiet on a balanced composition', () => {
    const kinds = cautionsFor(amberGourmand, NOTES).map((c) => c.kind);
    expect(kinds).not.toContain('top-heavy');
    expect(kinds).not.toContain('muddy');
  });
});

describe('share codec', () => {
  it('round-trips a creation', () => {
    const code = encodeCreation({
      name: 'Ambre Nocturne',
      description: 'First sketch',
      pyramid: amberGourmand,
    });
    expect(code).toMatch(/^[A-Za-z0-9+\-$]+$/);
    const decoded = decodeCreation(code, NOTES);
    expect(decoded).not.toBeNull();
    expect(decoded!.name).toBe('Ambre Nocturne');
    expect(decoded!.pyramid.base.map((n) => n.noteId)).toEqual(['vanilla', 'amber']);
    expect(decoded!.droppedNoteIds).toHaveLength(0);
  });

  it('drops unknown note ids gracefully', () => {
    const code = encodeCreation({
      name: 'Future Juice',
      pyramid: {
        top: [{ noteId: 'bergamot', intensity: 0.8 }],
        heart: [{ noteId: 'note-from-2031', intensity: 0.8 }],
        base: [],
      },
    });
    const decoded = decodeCreation(code, NOTES);
    expect(decoded!.pyramid.heart).toHaveLength(0);
    expect(decoded!.droppedNoteIds).toEqual(['note-from-2031']);
  });

  it('rejects garbage', () => {
    expect(decodeCreation('not-a-real-code!!!', NOTES)).toBeNull();
    expect(decodeCreation('', NOTES)).toBeNull();
  });
});

describe('character line', () => {
  it('writes an editorial line for a real composition', () => {
    const accords = deriveAccords(amberGourmand, NOTES);
    const line = characterLine(amberGourmand, accords, deriveSeasons(accords), NOTES);
    expect(line).toMatch(/^A (warm|luminous) /);
    expect(line).toMatch(/—/);
  });

  it('stays silent on an empty pyramid', () => {
    expect(characterLine(emptyPyramid(), [], [], NOTES)).toBe('');
  });
});
