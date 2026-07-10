// ============================================================
// SILLAGE — Perfume catalog (built from the compact source)
// Intensities, accords and the per-bottle accent are DERIVED
// here from catalogData.ts so there's a single source of truth
// and no hand-maintained accord tables to drift.
// ============================================================

import type {
  NotePosition,
  NotePyramid,
  NoteRef,
  Perfume,
  SeasonMood,
} from '../domain/types.ts';
import { deriveAccords, deriveContext, derivePerformance } from '../domain/derive.ts';
import { NOTES, FAMILY_COLOR } from './notes.ts';
import { RAW, type RawPerfume } from './catalogData.ts';
import { IMPORTED } from './catalogImported.ts';
import { PHOTO_IDS } from './photoIds.ts';
import { PERFUMER_CREDITS } from './perfumerCredits.ts';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Photo URLs are runtime strings, so Vite's --base does NOT rewrite them:
// prefix with BASE_URL ('/' in dev, '/perfume-sillage/' on GitHub Pages).
// The optional chain keeps this file importable from plain Node scripts,
// where import.meta.env doesn't exist.
const BASE = import.meta.env?.BASE_URL ?? '/';

// Perceived strength by tier + order: heart reads loudest, top is fleeting.
const LAYER_BASE: Record<NotePosition, number> = { top: 0.8, heart: 0.92, base: 0.85 };
const LAYER_STEP = 0.1;

function layerRefs(ids: string[], pos: NotePosition): NoteRef[] {
  return ids.map((noteId, i) => ({
    noteId,
    intensity: clamp(LAYER_BASE[pos] - i * LAYER_STEP, 0.42, 1),
  }));
}

const DEFAULT_SEASONS: SeasonMood['seasons'] = ['spring', 'autumn'];

/** Ids whose data came from the community import (Parfumo, CC0) — their
 *  performance is estimated from the pyramid, and the UI says so. */
export const IMPORTED_IDS = new Set(IMPORTED.map((p) => p.id));

function build(raw: RawPerfume): Perfume {
  const pyramid: NotePyramid = {
    top: layerRefs(raw.top, 'top'),
    heart: layerRefs(raw.heart, 'heart'),
    base: layerRefs(raw.base, 'base'),
  };
  const accords = deriveAccords(pyramid, NOTES);
  const accent = FAMILY_COLOR[accords[0]?.family ?? 'amber'];

  // curated entries keep their hand-authored performance; imported entries
  // get the shared estimator (same one the Atelier uses for creations)
  const performance = IMPORTED_IDS.has(raw.id)
    ? derivePerformance(pyramid, accords)
    : { longevity: raw.perf[0], projection: raw.perf[1], sillage: raw.perf[2] };

  // hand-authored moods/occasions win; otherwise infer them so
  // "When to wear" never renders as a bare season list
  const ctx = deriveContext(accords, performance);

  return {
    id: raw.id,
    name: raw.name,
    brand: raw.brand,
    house: raw.house,
    perfumer: raw.perfumer ?? PERFUMER_CREDITS[raw.id],
    type: raw.type,
    concentration: raw.conc,
    year: raw.year,
    gender: raw.gender,
    photo: PHOTO_IDS.has(raw.id) ? `${BASE}photos/${raw.id}.jpg` : undefined,
    accent,
    pyramid,
    accords,
    performance,
    context: {
      seasons: raw.seasons ?? DEFAULT_SEASONS,
      moods: raw.moods?.length ? raw.moods : ctx.moods,
      occasions: raw.occasions?.length ? raw.occasions : ctx.occasions,
    },
    description: raw.desc,
    inspiredByOriginalId: raw.inspiredBy,
  };
}

export const PERFUMES: Perfume[] = [...RAW, ...IMPORTED].map(build);

export const PERFUME_BY_ID: Record<string, Perfume> = Object.fromEntries(
  PERFUMES.map((p) => [p.id, p]),
);
