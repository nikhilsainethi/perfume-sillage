// ============================================================
// SILLAGE — Note page (/n/<noteId>)
// One raw material, everywhere it appears in the atlas: the
// note's story, how the catalog uses it (opener / heart /
// anchor), every scent that carries it, and kindred materials
// from the same family. Reached by tapping any pyramid chip.
// ============================================================

import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NotePosition, Perfume } from '@/domain/types';
import { NOTES, NOTES_LIST, FAMILY_LABEL } from '@/data/notes';
import { PERFUMES } from '@/data/perfumes';
import { useDiscovery } from '@/store/discoveryStore';
import { useAtelier } from '@/store/atelierStore';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { ease } from '@/shared/motion/motion';

const TIER_WEIGHT: Record<NotePosition, number> = { heart: 1, base: 0.9, top: 0.7 };
const TIER_BADGE: Record<NotePosition, string> = { top: 'Top', heart: 'Heart', base: 'Base' };
const INITIAL_VISIBLE = 24;

interface Carrier {
  perfume: Perfume;
  tier: NotePosition;
  strength: number;
}

function carriersOf(noteId: string): Carrier[] {
  const out: Carrier[] = [];
  for (const p of PERFUMES) {
    let best: Carrier | null = null;
    for (const tier of ['top', 'heart', 'base'] as NotePosition[]) {
      for (const ref of p.pyramid[tier]) {
        if (ref.noteId !== noteId) continue;
        const strength = ref.intensity * TIER_WEIGHT[tier];
        if (!best || strength > best.strength) best = { perfume: p, tier, strength };
      }
    }
    if (best) out.push(best);
  }
  return out.sort(
    (a, b) => b.strength - a.strength || a.perfume.name.localeCompare(b.perfume.name),
  );
}

export function NotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const clearNotes = useDiscovery((s) => s.clearNotes);
  const toggleNote = useDiscovery((s) => s.toggleNote);
  const draft = useAtelier((s) => s.draft);
  const toggleDraftNote = useAtelier((s) => s.toggleDraftNote);

  const note = noteId ? NOTES[noteId] : undefined;

  const carriers = useMemo(() => (note ? carriersOf(note.id) : []), [note]);
  const [showAll, setShowAll] = useState(false);

  if (!note) return <Navigate to="/" replace />;

  const tierCounts = carriers.reduce(
    (acc, c) => ((acc[c.tier] += 1), acc),
    { top: 0, heart: 0, base: 0 } as Record<NotePosition, number>,
  );
  const kindred = NOTES_LIST.filter((n) => n.family === note.family && n.id !== note.id).slice(0, 8);
  const visible = showAll ? carriers : carriers.slice(0, INITIAL_VISIBLE);
  const inDraft = (['top', 'heart', 'base'] as NotePosition[]).some((t) =>
    draft.pyramid[t].some((n) => n.noteId === note.id),
  );

  const traceInAtlas = () => {
    clearNotes();
    toggleNote(note.id);
    navigate('/');
  };
  const composeWithIt = () => {
    if (!inDraft) toggleDraftNote(note.id);
    navigate('/atelier');
  };

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-10 sm:px-8">
      {/* ---- header ---- */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease.enter }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
          Raw material
        </span>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <span
            aria-hidden
            className="h-12 w-12 shrink-0 rounded-full shadow-e1"
            style={{
              background: `radial-gradient(circle at 35% 30%, #FFFFFF55, transparent 55%), ${note.color}`,
            }}
          />
          <h1 className="font-display text-[clamp(34px,6vw,56px)] leading-[1.05] text-parchment">
            {note.name}
          </h1>
          <span
            className="rounded-chip border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ borderColor: note.color, color: note.color }}
          >
            {FAMILY_LABEL[note.family]}
          </span>
        </div>
        <p className="mt-4 max-w-[58ch] font-sans text-[16px] leading-relaxed text-parchment-dim">
          {note.description}
        </p>
        {(note.synonyms?.length ?? 0) > 0 && (
          <p className="mt-2 font-sans text-[13px] text-muted">
            Also listed as {note.synonyms!.join(', ')}.
          </p>
        )}

        {/* ---- how the atlas uses it ---- */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] tracking-[0.06em] text-parchment-dim">
          <span>
            <span className="text-champagne">{carriers.length}</span> of {PERFUMES.length}{' '}
            scents carry it
          </span>
          <span aria-hidden className="hidden h-3 w-px bg-[var(--line)] sm:inline-block" />
          <span>opens {tierCounts.top}</span>
          <span>at the heart of {tierCounts.heart}</span>
          <span>anchors {tierCounts.base}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={traceInAtlas}
            className="rounded-full bg-champagne px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#FFFDF8] shadow-e1 outline-none transition-transform hover:scale-[1.03]"
          >
            Trace it in the Atlas
          </button>
          <button
            type="button"
            onClick={composeWithIt}
            className="rounded-full border border-[var(--line)] bg-[#FFFFFF] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
          >
            {inDraft ? 'Already on your organ — open Atelier' : 'Compose with it'}
          </button>
        </div>
      </motion.header>

      {/* ---- carriers ---- */}
      <section className="mt-14">
        <h2 className="font-display text-[clamp(22px,3.4vw,30px)] leading-tight text-parchment">
          Where it appears
        </h2>
        {carriers.length === 0 ? (
          <p className="mt-4 font-sans text-[14px] italic text-muted">
            No scent in the atlas lists it yet — be the first, in the Atelier.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map(({ perfume, tier }, i) => (
              <motion.button
                key={perfume.id}
                type="button"
                onClick={() => navigate(`/s/${perfume.id}`)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 12) * 0.03, duration: 0.4, ease: ease.enter }}
                className="group overflow-hidden rounded-card border border-[var(--line)] bg-[#FFFFFF] text-left shadow-e1 outline-none transition-shadow hover:shadow-e2"
              >
                <span className="block h-28 w-full overflow-hidden bg-[#FBF7F0]">
                  <BottleVisual perfume={perfume} variant="thumb" className="transition-transform duration-500 group-hover:scale-[1.05]" />
                </span>
                <span className="block px-3.5 pb-3.5 pt-3">
                  <span className="block truncate font-display text-[15px] leading-snug text-parchment">
                    {perfume.name}
                  </span>
                  <span className="mt-0.5 block truncate font-sans text-[12px] text-muted">
                    {perfume.brand}
                    {perfume.year ? ` · ${perfume.year}` : ''}
                  </span>
                  <span
                    className="mt-2 inline-block rounded-chip border border-[var(--line)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-dim"
                  >
                    {TIER_BADGE[tier]} note
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        )}
        {!showAll && carriers.length > INITIAL_VISIBLE && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-full border border-[var(--line)] bg-[#FFFFFF] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
            >
              Show all {carriers.length}
            </button>
          </div>
        )}
      </section>

      {/* ---- kindred materials ---- */}
      {kindred.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-[clamp(22px,3.4vw,30px)] leading-tight text-parchment">
            Kindred materials
          </h2>
          <p className="mt-1 font-sans text-[13px] text-muted">
            More from the {FAMILY_LABEL[note.family].toLowerCase()} family.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {kindred.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => navigate(`/n/${k.id}`)}
                className="inline-flex items-center gap-1.5 rounded-chip border border-[var(--line)] bg-[#FFFFFF] px-3 py-1.5 font-sans text-[13px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
              >
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: k.color }}
                />
                {k.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
