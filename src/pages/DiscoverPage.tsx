// ============================================================
// SILLAGE — Discover (/discover)
// The two thinking acts on their own page: compose a scent
// profile on the wheel and read the atlas's answer, then set
// two scents side by side in the comparison engine. Results
// live in the Library — the CTA carries the filter across.
// ============================================================

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDiscovery } from '@/store/discoveryStore';
import { useActivePerfume, useMatches } from '@/store/selectors';
import { SectionReveal } from '@/shared/ui/SectionReveal';
import { NotesMatchingEngine } from '@/features/discover/NotesMatchingEngine';
import { ComparisonMatrix } from '@/features/compare/ComparisonMatrix';
import { PerfumeDetailPanel } from '@/features/detail/PerfumeDetailPanel';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function DiscoverPage() {
  const location = useLocation();
  const total = useMatches().length;
  const selectedNoteIds = useDiscovery((s) => s.selectedNoteIds);
  const activePerfume = useActivePerfume();
  const openDetail = useDiscovery((s) => s.openDetail);
  const closeDetail = useDiscovery((s) => s.closeDetail);
  const setComparisonOriginal = useDiscovery((s) => s.setComparisonOriginal);
  const setComparisonClone = useDiscovery((s) => s.setComparisonClone);

  // the Finder's "compare my top two" arrives with a target act
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    const t = window.setTimeout(() => scrollToId(target), 350);
    return () => window.clearTimeout(t);
  }, [location.state]);

  const onCompare = (originalId: string, cloneId: string) => {
    setComparisonOriginal(originalId);
    setComparisonClone(cloneId);
    closeDetail();
    window.setTimeout(() => scrollToId('compare'), 120);
  };

  return (
    <div className="relative">
      <main className="relative flex flex-col gap-28 pb-32 pt-10 sm:gap-36">
        <SectionReveal>
          <NotesMatchingEngine />
        </SectionReveal>

        {/* the bridge: composed profile → the Library, filter intact */}
        <div className="mx-auto -mt-12 w-full max-w-[1180px] px-5 sm:px-8">
          <Link
            to="/library"
            className="group inline-flex items-center gap-2.5 rounded-chip bg-champagne px-6 py-3 font-sans text-[14px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
          >
            {selectedNoteIds.length > 0
              ? `Open the ${total} matches in the Library`
              : 'Browse the full Library'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <SectionReveal>
          <ComparisonMatrix />
        </SectionReveal>
      </main>

      {/* local panel host (twins etc.) — no URL sync here; /s/ links live
          on the Library. Instant unmount on close, same as everywhere. */}
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
