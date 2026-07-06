// ============================================================
// SILLAGE — share codec (pure)
// Creation -> minimal JSON -> lz-string -> URL-safe code, and
// back. Decode validates every note id against the dictionary
// and degrades gracefully (unknown notes dropped, reported).
// ============================================================

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import type { FragranceNote, NotePyramid, NoteRef } from './types.ts';

const clamp01 = (v: number) => Math.max(0.05, Math.min(1, v));

interface WireV1 {
  v: 1;
  n: string; // name
  d?: string; // description
  t: [string, number][]; // [noteId, intensity] per tier
  h: [string, number][];
  b: [string, number][];
}

export interface DecodedShare {
  name: string;
  description?: string;
  pyramid: NotePyramid;
  droppedNoteIds: string[]; // ids we didn't recognize
}

function pack(refs: NoteRef[]): [string, number][] {
  return refs.map((r) => [r.noteId, Math.round(r.intensity * 100) / 100]);
}

export function encodeCreation(input: {
  name: string;
  description?: string;
  pyramid: NotePyramid;
}): string {
  const wire: WireV1 = {
    v: 1,
    n: input.name,
    ...(input.description ? { d: input.description } : {}),
    t: pack(input.pyramid.top),
    h: pack(input.pyramid.heart),
    b: pack(input.pyramid.base),
  };
  return compressToEncodedURIComponent(JSON.stringify(wire));
}

export function decodeCreation(
  code: string,
  notes: Record<string, FragranceNote>,
): DecodedShare | null {
  let wire: WireV1;
  try {
    const json = decompressFromEncodedURIComponent(code);
    if (!json) return null;
    wire = JSON.parse(json) as WireV1;
  } catch {
    return null;
  }
  if (!wire || wire.v !== 1 || typeof wire.n !== 'string') return null;

  const dropped: string[] = [];
  const unpack = (rows: unknown): NoteRef[] => {
    if (!Array.isArray(rows)) return [];
    const out: NoteRef[] = [];
    for (const row of rows) {
      if (!Array.isArray(row) || typeof row[0] !== 'string') continue;
      const id = row[0];
      const intensity = typeof row[1] === 'number' ? clamp01(row[1]) : 0.7;
      if (!notes[id]) {
        dropped.push(id);
        continue;
      }
      if (!out.some((r) => r.noteId === id)) out.push({ noteId: id, intensity });
    }
    return out;
  };

  return {
    name: wire.n.slice(0, 60) || 'Untitled',
    description: typeof wire.d === 'string' ? wire.d.slice(0, 280) : undefined,
    pyramid: { top: unpack(wire.t), heart: unpack(wire.h), base: unpack(wire.b) },
    droppedNoteIds: dropped,
  };
}
