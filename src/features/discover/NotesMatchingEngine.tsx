// ============================================================
// SILLAGE — NotesMatchingEngine (ACT 1, container, §4.2)
// Owns the Discover layout and wires selector -> store ->
// summary. No filtering logic of its own — that lives in the
// memoized selectors.
// ============================================================

import { Suspense, lazy, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDiscovery } from '@/store/discoveryStore';
import { useMatches, useExactCount } from '@/store/selectors';
import { NOTES_LIST, WHEEL_NOTES } from '@/data/notes';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { useWebGLCapability } from '@/shared/webgl/useWebGLCapability';
import { ease } from '@/shared/motion/motion';
import { FragranceWheel } from './FragranceWheel';
import { NoteSelector } from './NoteSelector';
import { SelectedNotesTray } from './SelectedNotesTray';
import { MatchResultsSummary } from './MatchResultsSummary';

const NoteConstellation = lazy(
  () => import('@/features/atelier/constellation/NoteConstellation'),
);

type ViewMode = 'orbit' | 'wheel' | 'cluster';
const VIEW_LABEL: Record<ViewMode, string> = {
  orbit: 'Orbit',
  wheel: 'Wheel',
  cluster: 'List',
};

export function NotesMatchingEngine() {
  const selectedNoteIds = useDiscovery((s) => s.selectedNoteIds);
  const toggleNote = useDiscovery((s) => s.toggleNote);
  const clearNotes = useDiscovery((s) => s.clearNotes);
  const searchQuery = useDiscovery((s) => s.searchQuery);
  const setSearch = useDiscovery((s) => s.setSearch);
  const matchMode = useDiscovery((s) => s.matchMode);
  const setMatchMode = useDiscovery((s) => s.setMatchMode);
  const typeFilter = useDiscovery((s) => s.typeFilter);
  const setTypeFilter = useDiscovery((s) => s.setTypeFilter);
  const linkClones = useDiscovery((s) => s.linkClones);
  const toggleLinkClones = useDiscovery((s) => s.toggleLinkClones);

  const total = useMatches().length;
  const exactCount = useExactCount();

  const isMobile = useIsMobile();
  const canRender3D = useWebGLCapability();
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const effectiveView: ViewMode = isMobile
    ? 'cluster'
    : viewMode ?? (canRender3D ? 'orbit' : 'wheel');
  const viewOptions: ViewMode[] = canRender3D
    ? ['orbit', 'wheel', 'cluster']
    : ['wheel', 'cluster'];

  const selectedNotes = useMemo(
    () =>
      selectedNoteIds
        .map((id) => NOTES_LIST.find((n) => n.id === id))
        .filter((n): n is NonNullable<typeof n> => Boolean(n)),
    [selectedNoteIds],
  );

  return (
    <section
      id="discover"
      aria-labelledby="discover-title"
      className="mx-auto w-full max-w-[1180px] px-5 sm:px-8"
    >
      <header className="mb-10 flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
          Act I — Discover
        </span>
        <h2
          id="discover-title"
          className="max-w-[18ch] font-display text-[clamp(32px,6vw,52px)] leading-[1.05] text-parchment"
        >
          Compose a scent, and watch the atlas answer.
        </h2>
        <p className="max-w-[52ch] font-sans text-[16px] leading-relaxed text-parchment-dim">
          Select notes from the wheel. Results rank by olfactory relevance, live —
          a note in the heart counts for more than one that merely flickers on top.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* selector column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="relative flex-1 min-w-[200px]">
              <span className="sr-only">Search fragrances or notes</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a house, name or note…"
                className="w-full rounded-input border border-[var(--line)] bg-[#FFFFFF] px-4 py-2.5 font-sans text-[14px] text-parchment placeholder:text-muted outline-none transition-colors focus:border-champagne"
              />
            </label>

            {!isMobile && (
              <div
                role="radiogroup"
                aria-label="Selector view"
                className="inline-flex rounded-chip border border-[var(--line)] bg-[#FFFFFF] p-0.5"
              >
                {viewOptions.map((mode) => {
                  const active = effectiveView === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setViewMode(mode)}
                      className="relative rounded-chip px-3.5 py-1.5 font-sans text-[12px] outline-none transition-colors"
                      style={{ color: active ? '#1B1611' : '#6E6456' }}
                    >
                      {active && (
                        <motion.span
                          layoutId="view-toggle"
                          className="absolute inset-0 rounded-chip"
                          style={{ background: '#B0843C' }}
                          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{VIEW_LABEL[mode]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <motion.div
            key={effectiveView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: ease.enter }}
          >
            {effectiveView === 'orbit' ? (
              <Suspense
                fallback={
                  <div className="grid h-[520px] w-full place-items-center rounded-panel border border-[var(--line)]">
                    <span className="animate-pulse font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                      Gathering the constellation…
                    </span>
                  </div>
                }
              >
                <NoteConstellation
                  notes={WHEEL_NOTES}
                  selectedIds={selectedNoteIds}
                  onToggle={toggleNote}
                  height={520}
                />
              </Suspense>
            ) : effectiveView === 'wheel' ? (
              <FragranceWheel
                notes={WHEEL_NOTES}
                selectedIds={selectedNoteIds}
                onToggle={toggleNote}
              />
            ) : (
              <NoteSelector
                notes={NOTES_LIST}
                selectedIds={selectedNoteIds}
                onToggle={toggleNote}
              />
            )}
          </motion.div>
        </div>

        {/* tray + summary column */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-8 lg:self-start">
          <SelectedNotesTray
            selected={selectedNotes}
            onRemove={toggleNote}
            onClear={clearNotes}
          />
          <MatchResultsSummary
            total={total}
            exactCount={exactCount}
            matchMode={matchMode}
            typeFilter={typeFilter}
            linkClones={linkClones}
            onMatchMode={setMatchMode}
            onTypeFilter={setTypeFilter}
            onToggleLink={toggleLinkClones}
          />
        </div>
      </div>
    </section>
  );
}
