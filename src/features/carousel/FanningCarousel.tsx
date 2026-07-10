// ============================================================
// SILLAGE — FanningCarousel (ACT 2, container, §6, §12.5)
// Reads the ordered matches, computes per-card transforms from
// activeIndex, and hosts drag + keyboard. Drag lives in Framer
// gesture state; only the settled activeIndex hits the store.
// ============================================================

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { Perfume } from '@/domain/types';
import { useDiscovery, type SortMode } from '@/store/discoveryStore';
import { useIsDesktop, useIsTablet } from '@/shared/hooks/useMediaQuery';
import { PerfumeFanCard } from './PerfumeFanCard';
import { CarouselControls } from './CarouselControls';
import { CarouselEmptyState } from './CarouselEmptyState';

const DRAG_THRESHOLD = 130; // px per index step

const SORTS: { value: SortMode; label: string; dealtBy: string }[] = [
  { value: 'relevance', label: 'Relevance', dealtBy: 'relevance' },
  { value: 'year', label: 'Year', dealtBy: 'vintage' },
  { value: 'name', label: 'A–Z', dealtBy: 'name' },
  { value: 'house', label: 'House', dealtBy: 'house' },
];

export function FanningCarousel({ perfumes }: { perfumes: Perfume[] }) {
  const activeIndex = useDiscovery((s) => s.activeIndex);
  const setActiveIndex = useDiscovery((s) => s.setActiveIndex);
  const next = useDiscovery((s) => s.next);
  const prev = useDiscovery((s) => s.prev);
  const openDetail = useDiscovery((s) => s.openDetail);
  const setHovered = useDiscovery((s) => s.setHovered);
  const matchMode = useDiscovery((s) => s.matchMode);
  const setMatchMode = useDiscovery((s) => s.setMatchMode);
  const clearNotes = useDiscovery((s) => s.clearNotes);
  const sortMode = useDiscovery((s) => s.sortMode);
  const setSortMode = useDiscovery((s) => s.setSortMode);
  const searchQuery = useDiscovery((s) => s.searchQuery);
  const setSearch = useDiscovery((s) => s.setSearch);
  const selectedNoteIds = useDiscovery((s) => s.selectedNoteIds);

  // arriving from Houses / a note page / a perfumer credit, the fan is
  // filtered — say so, or the deal looks arbitrary
  const filterLabel = [
    searchQuery.trim() && `“${searchQuery.trim()}”`,
    selectedNoteIds.length > 0 &&
      `${selectedNoteIds.length} note${selectedNoteIds.length > 1 ? 's' : ''}`,
  ]
    .filter(Boolean)
    .join(' + ');
  const clearFilters = () => {
    setSearch('');
    clearNotes();
  };

  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();
  const maxVisible = isDesktop ? 4 : isTablet ? 2 : 1;
  const variant: 'fan' | 'flat' = reduce || (!isDesktop && !isTablet) ? 'flat' : 'fan';

  const total = perfumes.length;
  const clamp = (i: number) => Math.max(0, Math.min(i, total - 1));

  // Safety: keep activeIndex inside range when the result set shrinks.
  useEffect(() => {
    if (total > 0 && activeIndex > total - 1) setActiveIndex(total - 1);
  }, [total, activeIndex, setActiveIndex]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (total === 0) return;
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setActiveIndex(clamp(activeIndex + 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActiveIndex(clamp(activeIndex - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(total - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        openDetail(perfumes[activeIndex].id);
        break;
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const distance = -info.offset.x - info.velocity.x * 0.08;
    const step = Math.round(distance / DRAG_THRESHOLD);
    if (step !== 0) setActiveIndex(clamp(activeIndex + step));
  };

  // trackpad horizontal scroll → step through the fan (ignores vertical so
  // the page still scrolls normally past the carousel)
  const wheelTs = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    if (total <= 1) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const now = Date.now();
    if (now - wheelTs.current < 200) return;
    wheelTs.current = now;
    setActiveIndex(clamp(activeIndex + (e.deltaX > 0 ? 1 : -1)));
  };

  const railRef = useRef<HTMLDivElement>(null);
  const active = perfumes[activeIndex];

  return (
    <section
      id="browse"
      aria-roledescription="carousel"
      aria-label="Fragrance carousel"
      className="relative w-full"
    >
      <div className="mx-auto mb-2 flex max-w-[1180px] flex-wrap items-end justify-between gap-x-8 gap-y-4 px-5 sm:px-8">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
            Act II — Browse
          </span>
          <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(28px,5vw,46px)] leading-[1.07] text-parchment">
            A fan of bottles, dealt by{' '}
            {SORTS.find((s) => s.value === sortMode)?.dealtBy ?? 'relevance'}.
          </h2>
          {filterLabel && (
            <button
              type="button"
              onClick={clearFilters}
              title="Clear this filter and show the whole atlas"
              className="mt-3 inline-flex items-center gap-2 rounded-chip border border-champagne bg-[rgba(176,132,60,0.1)] px-3.5 py-1.5 font-sans text-[13px] text-champagne-bright outline-none transition-colors hover:bg-[rgba(176,132,60,0.18)]"
            >
              Filtered by {filterLabel} · {total} match{total === 1 ? '' : 'es'}
              <span aria-hidden className="font-mono text-[12px]">✕</span>
            </button>
          )}
        </div>
        <div
          role="radiogroup"
          aria-label="Sort order"
          className="mb-1 flex items-center gap-1 rounded-full border border-[var(--line)] bg-[#FFFFFF] p-1"
        >
          {SORTS.map((s) => (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={sortMode === s.value}
              onClick={() => setSortMode(s.value)}
              className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] outline-none transition-colors ${
                sortMode === s.value
                  ? 'bg-champagne text-[#FFFDF8]'
                  : 'text-parchment-dim hover:text-champagne-bright'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="listbox"
        aria-label="Matching fragrances"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        className="relative h-[clamp(470px,68vh,640px)] w-full select-none outline-none"
        style={{ perspective: 2000 }}
      >
        <AnimatePresence mode="wait">
          {total === 0 ? (
            <div
              key="empty"
              className="absolute inset-0 grid place-items-center"
            >
              <CarouselEmptyState
                matchMode={matchMode}
                onMatchAny={() => setMatchMode('partial')}
                onClear={clearNotes}
              />
            </div>
          ) : (
            <motion.div
              key="rail"
              ref={railRef}
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
              drag={total > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              onDragEnd={onDragEnd}
            >
              <AnimatePresence initial={false}>
                {perfumes.map((p, i) =>
                  // window: with a large catalog, only mount cards near the
                  // active index (they're invisible beyond maxVisible anyway)
                  Math.abs(i - activeIndex) <= maxVisible + 6 ? (
                    <PerfumeFanCard
                      key={p.id}
                      perfume={p}
                      offset={i - activeIndex}
                      isActive={i === activeIndex}
                      variant={variant}
                      maxVisible={maxVisible}
                      reduce={reduce}
                      onSelect={() =>
                        i === activeIndex ? openDetail(p.id) : setActiveIndex(i)
                      }
                      onHover={(h) => setHovered(h ? p.id : null)}
                    />
                  ) : null,
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {total > 0 && (
        <div className="mx-auto mt-2 max-w-[1180px] px-5 sm:px-8">
          <CarouselControls
            total={total}
            activeIndex={activeIndex}
            onPrev={prev}
            onNext={next}
            onJump={setActiveIndex}
          />
        </div>
      )}

      {/* screen-reader live region (§6.5) */}
      <p className="sr-only" aria-live="polite">
        {active ? `Showing ${active.name} by ${active.brand}, ${activeIndex + 1} of ${total}` : 'No fragrances match'}
      </p>
    </section>
  );
}
