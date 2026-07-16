// ============================================================
// SILLAGE — PerfumeDiscoveryPage (§4.1)
// Route shell: ambient atmosphere, the three connected acts in
// a single scroll journey, and the detail-panel portal.
// ============================================================

import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAtlasCinema } from './useAtlasCinema';
import { useDiscovery } from '@/store/discoveryStore';
import { useActivePerfume, useOrderedPerfumes } from '@/store/selectors';
import { PERFUME_BY_ID } from '@/data/perfumes';
import { PHOTO_IDS } from '@/data/photoIds';
import { HeroExperience } from '@/shared/ui/HeroExperience';
import { SectionReveal } from '@/shared/ui/SectionReveal';
import { NotesMatchingEngine } from '@/features/discover/NotesMatchingEngine';
import { FanningCarousel } from '@/features/carousel/FanningCarousel';
import { ComparisonMatrix } from '@/features/compare/ComparisonMatrix';
import { PerfumeDetailPanel } from '@/features/detail/PerfumeDetailPanel';

// "Scent of the moment" means it: rotate daily through every scent that
// has a real, verified photo — the hero never shows a placeholder render.
const FEATURED_POOL = [...PHOTO_IDS];
const FEATURED_ID =
  FEATURED_POOL[Math.floor(Date.now() / 86_400_000) % FEATURED_POOL.length] ??
  'terre-dhermes';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function PerfumeDiscoveryPage() {
  const ordered = useOrderedPerfumes();
  const activePerfume = useActivePerfume();

  const closeDetail = useDiscovery((s) => s.closeDetail);
  const openDetail = useDiscovery((s) => s.openDetail);
  const setComparisonOriginal = useDiscovery((s) => s.setComparisonOriginal);
  const setComparisonClone = useDiscovery((s) => s.setComparisonClone);

  const featured = PERFUME_BY_ID[FEATURED_ID];

  // URL ⇄ panel sync. The URL is the source of truth for Back and deep
  // links; the store for in-app opens. Opening from anywhere (fan, grid,
  // twins) pushes /s/<id> so Back CLOSES the panel instead of leaving the
  // site, and the address bar is always shareable.
  const { scentId } = useParams<{ scentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const activeId = useDiscovery((s) => s.activePerfumeId);
  const prevActiveId = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevActiveId.current;
    prevActiveId.current = activeId;
    // Only STORE transitions may write the URL. When Back rewrites the URL
    // first, activeId === prev here, so we stay quiet and let the scentId
    // effect below close the panel — otherwise we'd re-push the panel URL
    // and the Back button would appear dead.
    if (activeId === prev) return;
    if (activeId && activeId !== scentId) {
      navigate(`/s/${activeId}`, { replace: Boolean(scentId) });
    } else if (!activeId && scentId) {
      navigate('/', { replace: true });
    }
  }, [activeId, scentId, navigate]);

  // Other pages (Houses, Finder, note pages, the detail panel) send the
  // reader here with a filter applied. They can't scroll us themselves —
  // AnimatePresence keeps this page unmounted until their exit finishes —
  // so they pass the target act via navigation state and WE scroll to it
  // once mounted (after ScrollRestorer's jump-to-top and the cinema pin
  // have settled). Without this, a filtered arrival lands on the hero and
  // reads as a broken redirect.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    const t = window.setTimeout(() => scrollToId(target), 350);
    return () => window.clearTimeout(t);
  }, [location.state]);
  useEffect(() => {
    if (scentId) {
      if (PERFUME_BY_ID[scentId]) openDetail(scentId);
      else navigate('/', { replace: true });
    } else {
      closeDetail(); // Back landed on the bare atlas — the panel follows
    }
  }, [scentId, openDetail, closeDetail, navigate]);

  const handleOpenDetail = (id: string) => openDetail(id);
  const handleCloseDetail = () => closeDetail();

  const onCompare = (originalId: string, cloneId: string) => {
    setComparisonOriginal(originalId);
    setComparisonClone(cloneId);
    closeDetail();
    // let the panel exit, then scroll to the comparison act
    window.setTimeout(() => scrollToId('compare'), 220);
  };

  const cinemaScope = useRef<HTMLDivElement>(null);
  useAtlasCinema(cinemaScope);

  return (
    <div ref={cinemaScope} className="relative">
      {/* champagne progress hairline (driven by ScrollTrigger) */}
      <div
        data-scroll-progress
        aria-hidden
        className="fixed left-0 top-14 z-30 h-[2px] w-full origin-left"
        style={{
          background: 'linear-gradient(90deg, #B0702F, #B0843C 60%, #8A6526)',
          transform: 'scaleX(0)',
        }}
      />
      <main className="relative flex flex-col gap-32 pb-40 sm:gap-40">
        {featured && <HeroExperience featured={featured} />}

        <SectionReveal>
          <NotesMatchingEngine />
        </SectionReveal>

        <SectionReveal>
          <FanningCarousel perfumes={ordered} />
        </SectionReveal>

        <SectionReveal>
          <ComparisonMatrix />
        </SectionReveal>
      </main>

      <footer className="relative border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-display text-[22px] tracking-[0.04em] text-parchment">
            SILLAGE
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            An interactive atlas of scent · Not for sale, only for study
          </span>
        </div>
      </footer>

      {/* detail panel portal (§4.2) — NO AnimatePresence: its exit tracking
          never completed for this portal'd child (React 19), which left a
          zombie panel + click-blocking overlay after every close. Entry
          animations still play; close is an instant, guaranteed unmount. */}
      {activePerfume && (
        <PerfumeDetailPanel
          key={activePerfume.id}
          perfume={activePerfume}
          onClose={handleCloseDetail}
          onOpen={handleOpenDetail}
          onCompare={onCompare}
        />
      )}
    </div>
  );
}
