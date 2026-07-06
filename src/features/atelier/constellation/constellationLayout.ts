// ============================================================
// SILLAGE — constellation layout (pure)
// Places the wheel notes in 3D: nine accord-family lobes
// arranged around a champagne core, each note jittered
// deterministically (hash of its id) within its lobe.
// ============================================================

import type { AccordFamily, FragranceNote } from '@/domain/types';
import { FAMILY_ORDER } from '@/data/notes';

export interface OrbPlacement {
  note: FragranceNote;
  position: [number, number, number];
  familyCenter: [number, number, number];
}

const LOBE_RADIUS = 5.2; // distance of family centers from core
const SPREAD = 1.9; // jitter radius within a lobe

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic pseudo-random in [-1, 1) from a string + salt. */
function jitter(id: string, salt: number): number {
  return ((hash(id + ':' + salt) % 10000) / 10000) * 2 - 1;
}

export function layoutConstellation(notes: FragranceNote[]): OrbPlacement[] {
  const families = FAMILY_ORDER.filter((f) => notes.some((n) => n.family === f));
  const centers = new Map<AccordFamily, [number, number, number]>();

  families.forEach((family, i) => {
    const angle = (i / families.length) * Math.PI * 2 - Math.PI / 2;
    // alternate lobes slightly above/below the equator for depth
    const y = (i % 2 === 0 ? 1 : -1) * (0.9 + 0.5 * ((i % 3) / 2));
    centers.set(family, [
      Math.cos(angle) * LOBE_RADIUS,
      y,
      Math.sin(angle) * LOBE_RADIUS,
    ]);
  });

  return notes.map((note) => {
    const center = centers.get(note.family) ?? [0, 0, 0];
    const position: [number, number, number] = [
      center[0] + jitter(note.id, 1) * SPREAD,
      center[1] + jitter(note.id, 2) * SPREAD * 0.85,
      center[2] + jitter(note.id, 3) * SPREAD,
    ];
    return { note, position, familyCenter: center };
  });
}

export function familyCenters(notes: FragranceNote[]): Map<AccordFamily, [number, number, number]> {
  const map = new Map<AccordFamily, [number, number, number]>();
  for (const p of layoutConstellation(notes)) {
    if (!map.has(p.note.family)) map.set(p.note.family, p.familyCenter);
  }
  return map;
}
