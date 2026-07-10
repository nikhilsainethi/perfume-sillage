// ============================================================
// SILLAGE — PerfumeDiscoveryPage (§4.1)
// Route shell: ambient atmosphere, the three connected acts in
// a single scroll journey, and the detail-panel portal.
// ============================================================

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtlasCinema } from './useAtlasCinema';
import { useDiscovery } from '@/store/discoveryStore';
import { useActivePerfume, useOrderedPerfumes } from '@/store/selectors';
import { PERFUME_BY_ID } from '@/data/perfumes';
import { HeroExperience } from '@/shared/ui/HeroExperience';
import { SectionReveal } from '@/shared/ui/SectionReveal';
import { NotesMatchingEngine } from '@/features/discover/NotesMatchingEngine';
import { FanningCarousel } from '@/features/carousel/FanningCarousel';
import { ComparisonMatrix } from '@/features/compare/ComparisonMatrix';
import { PerfumeDetailPanel } from '@/features/detail/PerfumeDetailPanel';

const FEATURED_ID = 'terre-dhermes';

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

  // deep link: /#/s/<id> opens that scent's detail over the atlas
  const { scentId } = useParams<{ scentId: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!scentId) return;
    if (PERFUME_BY_ID[scentId]) openDetail(scentId);
    else navigate('/', { replace: true });
  }, [scentId, openDetail, navigate]);

  const handleOpenDetail = (id: string) => {
    openDetail(id);
    if (scentId) navigate(`/s/${id}`, { replace: true });
  };
  const handleCloseDetail = () => {
    closeDetail();
    if (scentId) navigate('/', { replace: true });
  };

  const onCompare = (originalId: string, cloneId: string) => {
    setComparisonOriginal(originalId);
    setComparisonClone(cloneId);
    closeDetail();
    if (scentId) navigate('/', { replace: true });
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

      {/* detail panel portal (§4.2) */}
      <AnimatePresence>
        {activePerfume && (
          <PerfumeDetailPanel
            key={activePerfume.id}
            perfume={activePerfume}
            onClose={handleCloseDetail}
            onOpen={handleOpenDetail}
            onCompare={onCompare}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
