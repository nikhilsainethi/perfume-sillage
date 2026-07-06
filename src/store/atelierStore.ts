// ============================================================
// SILLAGE — Atelier store
// The composer's draft + the shelf of saved creations,
// persisted to localStorage (versioned). Storage is the only
// impure edge; swap the persist storage adapter to move to a
// backend later without touching any UI.
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NotePosition, NotePyramid } from '@/domain/types';
import {
  TIER_CAP,
  creationId,
  emptyPyramid,
  tierOf,
  type UserCreation,
} from '@/domain/creation';
import type { DecodedShare } from '@/domain/shareCodec';

export interface AtelierDraft {
  id: string | null; // set when editing a saved creation
  name: string;
  description: string;
  pyramid: NotePyramid;
  activeTier: NotePosition;
}

const freshDraft = (): AtelierDraft => ({
  id: null,
  name: '',
  description: '',
  pyramid: emptyPyramid(),
  activeTier: 'top',
});

const DEFAULT_INTENSITY = 0.7;

interface AtelierStore {
  draft: AtelierDraft;
  creations: UserCreation[];

  toggleDraftNote(noteId: string): void;
  setNoteTier(noteId: string, tier: NotePosition): void;
  setNoteIntensity(noteId: string, intensity: number): void;
  setActiveTier(tier: NotePosition): void;
  setDraftName(name: string): void;
  setDraftDescription(d: string): void;
  clearDraft(): void;

  saveDraft(): string | null; // returns creation id (null if empty)
  loadCreation(id: string): void;
  loadDecoded(decoded: DecodedShare): void; // remix a shared creation
  deleteCreation(id: string): void;
  duplicateCreation(id: string): void;
  importCreations(json: string): { added: number; skipped: number };
}

function mutatePyramid(
  pyramid: NotePyramid,
  fn: (p: NotePyramid) => NotePyramid,
): NotePyramid {
  return fn({
    top: [...pyramid.top],
    heart: [...pyramid.heart],
    base: [...pyramid.base],
  });
}

export const useAtelier = create<AtelierStore>()(
  persist(
    (set, get) => ({
      draft: freshDraft(),
      creations: [],

      toggleDraftNote: (noteId) =>
        set((s) => {
          const existing = tierOf(s.draft.pyramid, noteId);
          if (existing) {
            return {
              draft: {
                ...s.draft,
                pyramid: mutatePyramid(s.draft.pyramid, (p) => ({
                  ...p,
                  [existing]: p[existing].filter((n) => n.noteId !== noteId),
                })),
              },
            };
          }
          const tier = s.draft.activeTier;
          if (s.draft.pyramid[tier].length >= TIER_CAP) return s; // tier full
          return {
            draft: {
              ...s.draft,
              pyramid: mutatePyramid(s.draft.pyramid, (p) => ({
                ...p,
                [tier]: [...p[tier], { noteId, intensity: DEFAULT_INTENSITY }],
              })),
            },
          };
        }),

      setNoteTier: (noteId, tier) =>
        set((s) => {
          const from = tierOf(s.draft.pyramid, noteId);
          if (!from || from === tier) return s;
          if (s.draft.pyramid[tier].length >= TIER_CAP) return s;
          const ref = s.draft.pyramid[from].find((n) => n.noteId === noteId)!;
          return {
            draft: {
              ...s.draft,
              pyramid: mutatePyramid(s.draft.pyramid, (p) => ({
                ...p,
                [from]: p[from].filter((n) => n.noteId !== noteId),
                [tier]: [...p[tier], ref],
              })),
            },
          };
        }),

      setNoteIntensity: (noteId, intensity) =>
        set((s) => {
          const tier = tierOf(s.draft.pyramid, noteId);
          if (!tier) return s;
          const v = Math.max(0.1, Math.min(1, intensity));
          return {
            draft: {
              ...s.draft,
              pyramid: mutatePyramid(s.draft.pyramid, (p) => ({
                ...p,
                [tier]: p[tier].map((n) =>
                  n.noteId === noteId ? { ...n, intensity: v } : n,
                ),
              })),
            },
          };
        }),

      setActiveTier: (tier) => set((s) => ({ draft: { ...s.draft, activeTier: tier } })),
      setDraftName: (name) => set((s) => ({ draft: { ...s.draft, name: name.slice(0, 60) } })),
      setDraftDescription: (d) =>
        set((s) => ({ draft: { ...s.draft, description: d.slice(0, 280) } })),
      clearDraft: () => set({ draft: freshDraft() }),

      saveDraft: () => {
        const s = get();
        const count =
          s.draft.pyramid.top.length +
          s.draft.pyramid.heart.length +
          s.draft.pyramid.base.length;
        if (count === 0) return null;
        const now = Date.now();
        const name =
          s.draft.name.trim() || `Untitled Nº ${s.creations.length + 1}`;

        if (s.draft.id) {
          const id = s.draft.id;
          set({
            creations: s.creations.map((c) =>
              c.id === id
                ? { ...c, name, description: s.draft.description || undefined, pyramid: s.draft.pyramid, updatedAt: now }
                : c,
            ),
            draft: { ...s.draft, name },
          });
          return id;
        }
        const id = creationId();
        const creation: UserCreation = {
          id,
          name,
          description: s.draft.description || undefined,
          pyramid: s.draft.pyramid,
          createdAt: now,
          updatedAt: now,
        };
        set({ creations: [creation, ...s.creations], draft: { ...s.draft, id, name } });
        return id;
      },

      loadCreation: (id) => {
        const c = get().creations.find((x) => x.id === id);
        if (!c) return;
        set({
          draft: {
            id: c.id,
            name: c.name,
            description: c.description ?? '',
            pyramid: c.pyramid,
            activeTier: 'top',
          },
        });
      },

      loadDecoded: (decoded) =>
        set({
          draft: {
            id: null, // a remix is a new creation
            name: decoded.name,
            description: decoded.description ?? '',
            pyramid: decoded.pyramid,
            activeTier: 'top',
          },
        }),

      deleteCreation: (id) =>
        set((s) => ({
          creations: s.creations.filter((c) => c.id !== id),
          draft: s.draft.id === id ? { ...s.draft, id: null } : s.draft,
        })),

      duplicateCreation: (id) =>
        set((s) => {
          const c = s.creations.find((x) => x.id === id);
          if (!c) return s;
          const now = Date.now();
          const copy: UserCreation = {
            ...c,
            id: creationId(),
            name: `${c.name} (variation)`.slice(0, 60),
            createdAt: now,
            updatedAt: now,
          };
          return { creations: [copy, ...s.creations] };
        }),

      importCreations: (json) => {
        let added = 0;
        let skipped = 0;
        try {
          const rows = JSON.parse(json) as unknown;
          if (!Array.isArray(rows)) return { added, skipped: 1 };
          const existing = new Set(get().creations.map((c) => c.id));
          const incoming: UserCreation[] = [];
          for (const row of rows) {
            const c = row as UserCreation;
            if (
              c && typeof c.id === 'string' && typeof c.name === 'string' &&
              c.pyramid && Array.isArray(c.pyramid.top) &&
              Array.isArray(c.pyramid.heart) && Array.isArray(c.pyramid.base) &&
              !existing.has(c.id)
            ) {
              incoming.push(c);
              added++;
            } else {
              skipped++;
            }
          }
          if (incoming.length) {
            set((s) => ({ creations: [...incoming, ...s.creations] }));
          }
        } catch {
          skipped++;
        }
        return { added, skipped };
      },
    }),
    {
      name: 'sillage-atelier-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ draft: s.draft, creations: s.creations }),
    },
  ),
);
