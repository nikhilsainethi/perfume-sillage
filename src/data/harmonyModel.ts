// ============================================================
// SILLAGE — harmony model singleton
// Pair-affinity learned from the built catalog, computed once
// at module load (127 scents × ~10 notes — trivial).
// ============================================================

import { buildHarmonyModel } from '@/domain/harmony';
import { PERFUMES } from './perfumes';

export const HARMONY = buildHarmonyModel(PERFUMES);
