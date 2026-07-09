// ============================================================
// SILLAGE — Scent Finder (pure)
// Five answers -> the three scents in the atlas that fit best,
// each with human-readable reasons. Character carries the most
// weight; audience is a hard filter; skipped questions simply
// leave the scoreboard (match % renormalizes).
// ============================================================

import type { AccordFamily, FragranceNote, NotePosition, Perfume } from './types.ts';

export type Audience = 'him' | 'her' | 'any';
export type Climate = 'warm' | 'cold' | 'any';
export type Character = 'fresh' | 'warm-sweet' | 'dark-bold' | 'floral';
export type Loudness = 'soft' | 'balanced' | 'loud';

export interface FinderAnswers {
  audience: Audience;
  climate: Climate;
  character: Character;
  loudness: Loudness;
  lovedNoteId: string | null; // null = surprise me
}

export interface FinderPick {
  perfume: Perfume;
  matchPct: number; // 0..100
  reasons: string[];
}

const CHARACTER_FAMILIES: Record<Character, AccordFamily[]> = {
  fresh: ['citrus', 'fresh', 'aromatic'],
  'warm-sweet': ['amber', 'sweet'],
  'dark-bold': ['woody', 'leather', 'spicy'],
  floral: ['floral'],
};

const CHARACTER_WORD: Record<Character, string> = {
  fresh: 'fresh and clean',
  'warm-sweet': 'warm and sweet',
  'dark-bold': 'dark and bold',
  floral: 'romantic and floral',
};

const LOUDNESS_TARGET: Record<Loudness, number> = { soft: 4.5, balanced: 6.5, loud: 8.5 };
const TIER_WEIGHT: Record<NotePosition, number> = { heart: 1, base: 0.9, top: 0.7 };

const W_CHARACTER = 3;
const W_CLIMATE = 1.5;
const W_LOUDNESS = 1.5;
const W_NOTE = 2;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function familyShare(p: Perfume, families: AccordFamily[]): number {
  const set = new Set(families);
  return clamp01(
    p.accords.filter((a) => set.has(a.family)).reduce((s, a) => s + a.weight, 0),
  );
}

function seasonFit(p: Perfume, climate: Climate): number {
  if (climate === 'any') return 0;
  const wanted = climate === 'warm' ? ['spring', 'summer'] : ['autumn', 'winter'];
  return p.context.seasons.some((s) => (wanted as string[]).includes(s)) ? 1 : 0;
}

function notePresence(p: Perfume, noteId: string): number {
  let best = 0;
  for (const tier of ['top', 'heart', 'base'] as NotePosition[]) {
    for (const ref of p.pyramid[tier]) {
      if (ref.noteId === noteId) {
        best = Math.max(best, ref.intensity * TIER_WEIGHT[tier]);
      }
    }
  }
  return clamp01(best);
}

function noteTier(p: Perfume, noteId: string): NotePosition | null {
  for (const tier of ['heart', 'base', 'top'] as NotePosition[]) {
    if (p.pyramid[tier].some((r) => r.noteId === noteId)) return tier;
  }
  return null;
}

export function findScents(
  answers: FinderAnswers,
  perfumes: Perfume[],
  notes: Record<string, FragranceNote>,
  take = 3,
): FinderPick[] {
  // audience: hard filter (unisex always eligible)
  const pool = perfumes.filter((p) => {
    if (answers.audience === 'him') return p.gender !== 'feminine';
    if (answers.audience === 'her') return p.gender !== 'masculine';
    return true;
  });

  const possible =
    W_CHARACTER +
    (answers.climate !== 'any' ? W_CLIMATE : 0) +
    W_LOUDNESS +
    (answers.lovedNoteId ? W_NOTE : 0);

  const scored = pool.map((p) => {
    const character = familyShare(p, CHARACTER_FAMILIES[answers.character]);
    const climate = seasonFit(p, answers.climate);
    const loudness = clamp01(
      1 - Math.abs(p.performance.projection - LOUDNESS_TARGET[answers.loudness]) / 5,
    );
    const loved = answers.lovedNoteId ? notePresence(p, answers.lovedNoteId) : 0;

    const score =
      W_CHARACTER * character +
      (answers.climate !== 'any' ? W_CLIMATE * climate : 0) +
      W_LOUDNESS * loudness +
      (answers.lovedNoteId ? W_NOTE * loved : 0);

    return { p, score, character, climate, loudness, loved };
  });

  scored.sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name));

  return scored.slice(0, take).map(({ p, score, character, climate, loved }) => {
    const reasons: string[] = [];
    if (character > 0.45) {
      const lead = p.accords[0]?.family;
      reasons.push(
        `Strongly ${CHARACTER_WORD[answers.character]}${lead ? ` — its dominant accord is ${lead}` : ''}.`,
      );
    } else if (character > 0.2) {
      reasons.push(`Carries a clear ${CHARACTER_WORD[answers.character]} side.`);
    }
    if (answers.climate !== 'any' && climate > 0) {
      reasons.push(
        answers.climate === 'warm'
          ? 'Made for warm days in the sun.'
          : 'Built for cold evenings.',
      );
    }
    if (answers.lovedNoteId && loved > 0) {
      const noteName = notes[answers.lovedNoteId]?.name ?? answers.lovedNoteId;
      const tier = noteTier(p, answers.lovedNoteId);
      reasons.push(
        tier === 'heart'
          ? `${noteName} sits at its heart.`
          : tier === 'base'
            ? `${noteName} anchors its dry-down.`
            : `${noteName} lights up its opening.`,
      );
    }
    reasons.push(
      p.performance.projection >= 8
        ? 'It will announce you.'
        : p.performance.projection <= 5
          ? 'It wears close to the skin.'
          : 'It stays politely present.',
    );

    return {
      perfume: p,
      matchPct: Math.round(clamp01(score / possible) * 100),
      reasons: reasons.slice(0, 3),
    };
  });
}
