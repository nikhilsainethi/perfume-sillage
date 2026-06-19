// ============================================================
// SILLAGE — TypeScript data model (§3)
// A clean, normalized model. Notes live in a dictionary keyed
// by id; perfumes reference notes by id with an intensity;
// clone <-> original links are first-class.
// ============================================================

// ---------- Primitives ----------
export type AccordFamily =
  | 'citrus'
  | 'fresh'
  | 'floral'
  | 'woody'
  | 'spicy'
  | 'sweet'
  | 'aromatic'
  | 'amber'
  | 'leather';

export type NotePosition = 'top' | 'heart' | 'base';
export type PerfumeType = 'original' | 'clone';
export type Concentration = 'extrait' | 'parfum' | 'edp' | 'edt' | 'edc';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Gender = 'masculine' | 'feminine' | 'unisex';

// ---------- Notes & accords ----------
export interface FragranceNote {
  id: string; // 'bergamot'
  name: string; // 'Bergamot'
  family: AccordFamily; // drives color coding
  color: string; // resolved accent (token value)
  synonyms?: string[]; // search aliases ('bergamotto')
  description?: string; // short editorial line
  wheel?: boolean; // surfaced on the curated fragrance wheel
}

/** A note as it appears inside one perfume, with its weight in the blend. */
export interface NoteRef {
  noteId: string;
  intensity: number; // 0..1 — perceived strength of this note
}

export interface NotePyramid {
  top: NoteRef[];
  heart: NoteRef[];
  base: NoteRef[];
}

export interface Accord {
  family: AccordFamily;
  weight: number; // 0..1 — share of the overall accord profile
}

// ---------- Performance & context ----------
export interface PerformanceProfile {
  longevity: number; // 0..10
  projection: number; // 0..10
  sillage: number; // 0..10
}

export interface SeasonMood {
  seasons: Season[];
  moods: string[]; // 'sensual', 'office', 'nocturnal'
  occasions: string[]; // 'evening', 'signature', 'special'
}

// ---------- The perfume ----------
export interface Perfume {
  id: string;
  name: string;
  brand: string;
  house?: string; // niche house / parent
  perfumer?: string;
  type: PerfumeType;
  concentration?: Concentration;
  year?: number;
  gender?: Gender;
  photo?: string; // real name-matched product photo, when one exists
  accent?: string; // per-bottle accent (derived from dominant accord) for the rendered fallback
  pyramid: NotePyramid;
  accords: Accord[]; // sorted desc by weight
  performance: PerformanceProfile;
  context: SeasonMood;
  description: string;
  inspiredByOriginalId?: string; // set on clones; mirror of CloneRelationship
}

// ---------- Original <-> Clone graph ----------
export interface SimilarityScore {
  overall: number; // 0..100 (shown sparingly, as a soft bar)
  byLayer: { top: number; heart: number; base: number }; // each 0..1
  accordOverlap: number; // 0..1
}

export interface CloneRelationship {
  id: string;
  originalId: string;
  cloneId: string;
  similarity: SimilarityScore;
  sharedNoteIds: string[];
  divergentNoteIds: string[];
  commentary?: string; // editorial: where it's close / where it drifts
}

// ---------- Comparison output ----------
export interface LayerComparison {
  position: NotePosition;
  shared: NoteRef[]; // present in both (intensity = clone's, for display)
  uniqueToOriginal: NoteRef[];
  uniqueToClone: NoteRef[];
}

export type RadarAxisName =
  | 'Longevity'
  | 'Projection'
  | 'Sillage'
  | 'Warmth'
  | 'Freshness'
  | 'Complexity';

export interface RadarAxis {
  axis: RadarAxisName;
  original: number; // 0..1
  clone: number; // 0..1
}

export interface AccordOverlapEntry {
  family: AccordFamily;
  originalWeight: number;
  cloneWeight: number;
}

export interface ComparisonResult {
  original: Perfume;
  clone: Perfume;
  similarity: SimilarityScore;
  layers: LayerComparison[]; // [top, heart, base]
  accordOverlap: AccordOverlapEntry[];
  radar: RadarAxis[];
  keyDifferences: string[];
}

// ---------- Notes matching engine output ----------
export type MatchType = 'exact' | 'partial';

export interface NoteMatch {
  perfume: Perfume;
  relevance: number; // 0..1 — ranking key
  coverage: number; // 0..1 — fraction of selected notes present
  matchedNoteIds: string[];
  matchType: MatchType;
}
