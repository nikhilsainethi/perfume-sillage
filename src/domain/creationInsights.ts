// ============================================================
// SILLAGE — editorial insights for compositions (pure)
// Turns a derived profile into one quiet, human line of copy:
// "a warm amber-woody with a bright citrus opening —
//  nocturnal, cold-weather."
// ============================================================

import type { Accord, AccordFamily, FragranceNote, NotePyramid, Season } from './types.ts';

const FAMILY_WORD: Record<AccordFamily, string> = {
  citrus: 'citrus',
  fresh: 'fresh',
  floral: 'floral',
  aromatic: 'aromatic',
  spicy: 'spicy',
  sweet: 'gourmand',
  amber: 'amber',
  woody: 'woody',
  leather: 'leather',
};

const FAMILY_MOOD: Record<AccordFamily, string> = {
  citrus: 'sunlit',
  fresh: 'breezy',
  floral: 'romantic',
  aromatic: 'clean-cut',
  spicy: 'bold',
  sweet: 'indulgent',
  amber: 'sensual',
  woody: 'composed',
  leather: 'nocturnal',
};

const WARM_SET = new Set<AccordFamily>(['amber', 'sweet', 'spicy', 'woody', 'leather']);

function seasonWord(seasons: Season[]): string {
  const s = new Set(seasons);
  if (s.has('winter') && s.has('autumn')) return 'cold-weather';
  if (s.has('summer') && s.has('spring')) return 'warm-weather';
  return 'all-season';
}

/** One editorial line describing the composition. Empty string if too sparse. */
export function characterLine(
  pyramid: NotePyramid,
  accords: Accord[],
  seasons: Season[],
  notes: Record<string, FragranceNote>,
): string {
  if (accords.length === 0) return '';
  const [first, second] = accords;
  const temperature = WARM_SET.has(first.family) ? 'warm' : 'luminous';
  const core = second
    ? `${FAMILY_WORD[first.family]}-${FAMILY_WORD[second.family]}`
    : FAMILY_WORD[first.family];

  // opening = dominant family among top notes
  let opening = '';
  if (pyramid.top.length > 0) {
    const tally = new Map<AccordFamily, number>();
    for (const ref of pyramid.top) {
      const fam = notes[ref.noteId]?.family;
      if (fam) tally.set(fam, (tally.get(fam) ?? 0) + ref.intensity);
    }
    const lead = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
    if (lead && lead[0] !== first.family) {
      opening = ` with a ${FAMILY_MOOD[lead[0]]} ${FAMILY_WORD[lead[0]]} opening`;
    }
  }

  return `A ${temperature} ${core} composition${opening} — ${FAMILY_MOOD[first.family]}, ${seasonWord(seasons)}.`;
}
