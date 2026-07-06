// ============================================================
// SILLAGE — fragrance-line singleton (derived once at load)
// ============================================================

// relative import keeps the data layer importable from plain Node scripts
import { buildLines } from '../domain/lines.ts';
import { PERFUMES } from './perfumes.ts';

export const LINES = buildLines(PERFUMES);
