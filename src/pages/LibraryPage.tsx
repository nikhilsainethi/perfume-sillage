// ============================================================
// SILLAGE — The Library (/library and /s/<id>)
// Every bottle in the atlas as a first-class page: search, type
// and family filters, sort, fan/grid views, and detail panels
// with shareable /s/<id> URLs. Houses, note pages, perfumer
// credits and the nav search all land HERE, already filtered —
// no more bouncing to a homepage.
// ============================================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDiscovery } from '@/store/discoveryStore';
import { useActivePerfume, useExactCount, useMatches, useOrderedPerfumes } from '@/store/selectors';
import { useScentPanelUrlSync } from '@/shared/hooks/useScentPanelUrlSync';
import { ease } from '@/shared/motion/motion';
import { FanningCarousel } from '@/features/carousel/FanningCarousel';
import { MatchResultsSummary } from '@/features/discover/MatchResultsSummary';
import { PerfumeDetailPanel } from '@/features/detail/PerfumeDetailPanel';

export function LibraryPage() {
  const ordered = useOrderedPerfumes();
  const activePerfume = useActivePerfume();
  const navigate = useNavigate();

  const searchQuery = useDiscovery((s) => s.searchQuery);
  const setSearch = useDiscovery((s) => s.setSearch);
  const openDetail = useDiscovery((s) => s.openDetail);
  const closeDetail = useDiscovery((s) => s.closeDetail);
  const matchMode = useDiscovery((s) => s.matchMode);
  const setMatchMode = useDiscovery((s) => s.setMatchMode);
  const typeFilter = useDiscovery((s) => s.typeFilter);
  const setTypeFilter = useDiscovery((s) => s.setTypeFilter);
  const linkClones = useDiscovery((s) => s.linkClones);
  const toggleLinkClones = useDiscovery((s) => s.toggleLinkClones);
  const selectedAccords = useDiscovery((s) => s.selectedAccords);
  const toggleAccord = useDiscovery((s) => s.toggleAccord);
  const setComparisonOriginal = useDiscovery((s) => s.setComparisonOriginal);
  const setComparisonClone = useDiscovery((s) => s.setComparisonClone);

  const total = useMatches().length;
  const exactCount = useExactCount();

  useScentPanelUrlSync('/library');

  const onCompare = (originalId: string, cloneId: string) => {
    setComparisonOriginal(originalId);
    setComparisonClone(cloneId);
    closeDetail();
    navigate('/discover', { state: { scrollTo: 'compare' } });
  };

  return (
    <div className="relative">
      <main className="relative flex flex-col gap-12 pb-32 pt-8">
        {/* control deck: search + the full filter set */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.enter }}
          aria-label="Library filters"
          className="mx-auto w-full max-w-[1180px] px-5 sm:px-8"
        >
          <div className="grid grid-cols-1 items-start gap-x-14 gap-y-6 lg:grid-cols-[1fr_1.2fr]">
            <label className="relative block">
              <span className="sr-only">Search the library</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a scent, house, nose or note…"
                className="w-full rounded-input border border-[var(--line)] bg-[#FFFFFF] px-4 py-3 font-sans text-[15px] text-parchment placeholder:text-muted outline-none transition-colors focus:border-champagne"
              />
            </label>
            <MatchResultsSummary
              total={total}
              exactCount={exactCount}
              matchMode={matchMode}
              typeFilter={typeFilter}
              linkClones={linkClones}
              selectedAccords={selectedAccords}
              onMatchMode={setMatchMode}
              onTypeFilter={setTypeFilter}
              onToggleLink={toggleLinkClones}
              onToggleAccord={toggleAccord}
            />
          </div>
        </motion.section>

        <FanningCarousel
          perfumes={ordered}
          eyebrow="The Library"
          titlePrefix="Every bottle, dealt by"
        />
      </main>

      {/* detail panel — instant unmount on close (no AnimatePresence:
          its exit tracking proved unreliable and left zombie overlays) */}
      {activePerfume && (
        <PerfumeDetailPanel
          key={activePerfume.id}
          perfume={activePerfume}
          onClose={closeDetail}
          onOpen={openDetail}
          onCompare={onCompare}
        />
      )}
    </div>
  );
}
