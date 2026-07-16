// ============================================================
// SILLAGE — The Atelier (the fourth act, full-screen route)
// Compose your own fragrance: pull notes from the constellation
// into a living pyramid, hear it read back, take the
// perfumer's counsel, and find your place in the atlas.
// ============================================================

import { motion } from 'framer-motion';
import type { NotePyramid } from '@/domain/types';
import { NOTES, NOTES_LIST, WHEEL_NOTES } from '@/data/notes';
import { PERFUMES } from '@/data/perfumes';
import { TIER_CAP } from '@/domain/creation';
import { useAtelier } from '@/store/atelierStore';
import { ease } from '@/shared/motion/motion';
import { useDraftPerfume } from './useDraftPerfume';
import { NotePicker } from './NotePicker';
import { CompositionPanel } from './CompositionPanel';
import { AnalysisPanel } from './AnalysisPanel';
import { HarmonyPanel } from './HarmonyPanel';
import { AtlasPlacement } from './AtlasPlacement';

export function AtelierPage() {
  const toggleDraftNote = useAtelier((s) => s.toggleDraftNote);
  const draftPyramid = useAtelier((s) => s.draft.pyramid);
  const loadDecoded = useAtelier((s) => s.loadDecoded);
  const analysis = useDraftPerfume();

  // seed the draft from a real scent's pyramid — a starting point to bend
  const remixClassic = () => {
    const p = PERFUMES[Math.floor(Math.random() * PERFUMES.length)];
    loadDecoded({
      name: `Variation on ${p.name}`.slice(0, 60),
      description: undefined,
      pyramid: {
        top: p.pyramid.top.slice(0, TIER_CAP).map((n) => ({ ...n })),
        heart: p.pyramid.heart.slice(0, TIER_CAP).map((n) => ({ ...n })),
        base: p.pyramid.base.slice(0, TIER_CAP).map((n) => ({ ...n })),
      },
      droppedNoteIds: [],
    });
  };

  const selectedIds = [
    ...draftPyramid.top,
    ...draftPyramid.heart,
    ...draftPyramid.base,
  ].map((n) => n.noteId);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-5 pb-28 pt-10 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.enter }}
        className="mb-10 flex flex-col gap-3"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne-bright">
          The Atelier
        </span>
        <h1 className="max-w-[16ch] font-display text-[clamp(36px,6.4vw,60px)] leading-[1.02] text-parchment">
          Compose your signature.
        </h1>
        <p className="max-w-[56ch] font-sans text-[16px] leading-relaxed text-parchment-dim">
          Draw notes from the constellation into a living pyramid. The atlas reads
          your blend as you work — its character, its balance, and the real scents
          it sits beside.
        </p>
        <button
          type="button"
          onClick={remixClassic}
          className="self-start rounded-chip border border-[var(--line)] px-4 py-2 font-sans text-[13px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
        >
          ↺ Not sure where to begin? Remix a classic
        </button>
      </motion.header>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        {/* the note space */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: ease.enter, delay: 0.12 }}
          className="lg:sticky lg:top-20"
        >
          <NotePicker
            notes={NOTES_LIST}
            wheelNotes={WHEEL_NOTES}
            selectedIds={selectedIds}
            onToggle={toggleDraftNote}
          />
        </motion.div>

        {/* the living composition */}
        <motion.div
          id="composition"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: ease.enter, delay: 0.22 }}
          className="flex flex-col gap-6"
          style={{ scrollMarginTop: 72 }}
        >
          <CompositionPanel draftPerfume={analysis.perfume} />
          <AnalysisPanel perfume={analysis.perfume} count={analysis.count} line={analysis.line} />
          <HarmonyPanel sparks={analysis.sparks} cautions={analysis.cautions} />
          <AtlasPlacement neighbors={analysis.neighbors} creation={analysis.perfume} />
        </motion.div>
      </div>

      <MobileComposeBar pyramid={draftPyramid} />
    </main>
  );
}

/** On a phone the composition panel lives below the whole note picker, so a
 *  tap up top gave zero feedback — you scrolled five screens to see it land.
 *  This fixed bar mirrors the pyramid live and jumps to the panel on tap. */
function MobileComposeBar({ pyramid }: { pyramid: NotePyramid }) {
  const total = pyramid.top.length + pyramid.heart.length + pyramid.base.length;
  const lastAdded = [...pyramid.top, ...pyramid.heart, ...pyramid.base].at(-1);
  const lastName = lastAdded ? NOTES[lastAdded.noteId]?.name : undefined;
  return (
    <div className="glass-nav fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] lg:hidden">
      <button
        type="button"
        onClick={() =>
          document.getElementById('composition')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="mx-auto flex h-14 w-full max-w-[640px] items-center justify-between gap-3 px-5 outline-none"
      >
        <span className="min-w-0 truncate text-left font-sans text-[13px] text-parchment-dim">
          {total === 0
            ? 'Tap notes above to compose'
            : lastName
              ? `Added ${lastName}`
              : `${total} note${total > 1 ? 's' : ''} placed`}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.08em] text-champagne-bright">
            T{pyramid.top.length} · H{pyramid.heart.length} · B{pyramid.base.length}
          </span>
          <span className="rounded-chip bg-champagne px-3 py-1.5 font-sans text-[12px] font-medium text-ink">
            View ↓
          </span>
        </span>
      </button>
    </div>
  );
}
