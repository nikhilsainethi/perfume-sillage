// ============================================================
// SILLAGE — Zustand store (§8)
// The only state shared across the three acts. High-frequency
// note toggles and the carousel index live here; ephemeral UI
// (hover, focus) stays in local React state.
// ============================================================

import { create } from 'zustand';
import type {
  AccordFamily,
  CloneRelationship,
  FragranceNote,
  Perfume,
} from '@/domain/types';
import { PERFUMES } from '@/data/perfumes';
import { NOTES } from '@/data/notes';
import { RELATIONSHIPS } from '@/data/relationships';

export type TypeFilter = 'all' | 'original' | 'clone';
export type MatchMode = 'exact' | 'partial';
export type SortMode = 'relevance' | 'year' | 'name' | 'house';

export interface DiscoveryStore {
  // --- data (loaded once) ---
  perfumes: Perfume[];
  notes: Record<string, FragranceNote>;
  relationships: CloneRelationship[];

  // --- filters ---
  selectedNoteIds: string[];
  selectedAccords: AccordFamily[];
  searchQuery: string;
  typeFilter: TypeFilter;
  matchMode: MatchMode;
  linkClones: boolean;
  sortMode: SortMode;

  // --- view ---
  activeIndex: number;
  hoveredPerfumeId: string | null;
  activePerfumeId: string | null; // detail panel target
  comparison: { originalId: string | null; cloneId: string | null };
  isMobile: boolean;
  mobileCarousel: { snapIndex: number };

  // --- actions ---
  toggleNote(id: string): void;
  clearNotes(): void;
  toggleAccord(f: AccordFamily): void;
  setSearch(q: string): void;
  setTypeFilter(t: TypeFilter): void;
  setMatchMode(m: MatchMode): void;
  toggleLinkClones(): void;
  setSortMode(m: SortMode): void;
  setActiveIndex(i: number): void;
  next(): void;
  prev(): void;
  setHovered(id: string | null): void;
  openDetail(id: string): void;
  closeDetail(): void;
  setComparisonOriginal(id: string | null): void;
  setComparisonClone(id: string | null): void;
  swapComparison(): void;
  setIsMobile(b: boolean): void;
}

export const useDiscovery = create<DiscoveryStore>((set) => ({
  // data is local/static — seed once at creation
  perfumes: PERFUMES,
  notes: NOTES,
  relationships: RELATIONSHIPS,

  selectedNoteIds: [],
  selectedAccords: [],
  searchQuery: '',
  typeFilter: 'all',
  matchMode: 'partial',
  linkClones: false,
  sortMode: 'relevance',

  activeIndex: 0,
  hoveredPerfumeId: null,
  activePerfumeId: null,
  comparison: { originalId: null, cloneId: null },
  isMobile: false,
  mobileCarousel: { snapIndex: 0 },

  toggleNote: (id) =>
    set((s) => ({
      selectedNoteIds: s.selectedNoteIds.includes(id)
        ? s.selectedNoteIds.filter((n) => n !== id)
        : [...s.selectedNoteIds, id],
      activeIndex: 0,
    })),
  clearNotes: () => set({ selectedNoteIds: [], activeIndex: 0 }),
  toggleAccord: (f) =>
    set((s) => ({
      selectedAccords: s.selectedAccords.includes(f)
        ? s.selectedAccords.filter((a) => a !== f)
        : [...s.selectedAccords, f],
      activeIndex: 0,
    })),
  setSearch: (q) => set({ searchQuery: q, activeIndex: 0 }),
  setTypeFilter: (t) => set({ typeFilter: t, activeIndex: 0 }),
  setMatchMode: (m) => set({ matchMode: m, activeIndex: 0 }),
  toggleLinkClones: () => set((s) => ({ linkClones: !s.linkClones, activeIndex: 0 })),
  setSortMode: (m) => set({ sortMode: m, activeIndex: 0 }),

  setActiveIndex: (i) => set({ activeIndex: Math.max(0, i) }),
  next: () => set((s) => ({ activeIndex: s.activeIndex + 1 })),
  prev: () => set((s) => ({ activeIndex: Math.max(0, s.activeIndex - 1) })),
  setHovered: (id) => set({ hoveredPerfumeId: id }),
  openDetail: (id) => set({ activePerfumeId: id }),
  closeDetail: () => set({ activePerfumeId: null }),
  setComparisonOriginal: (id) =>
    set((s) => ({ comparison: { ...s.comparison, originalId: id } })),
  setComparisonClone: (id) =>
    set((s) => ({ comparison: { ...s.comparison, cloneId: id } })),
  swapComparison: () =>
    set((s) => ({
      comparison: { originalId: s.comparison.cloneId, cloneId: s.comparison.originalId },
    })),
  setIsMobile: (b) => set({ isMobile: b }),
}));
