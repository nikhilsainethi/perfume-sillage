// ============================================================
// SILLAGE — ComparisonMatrix (ACT 3, container, §7)
// Pairs one Original with one Inspired scent and tells the
// story visually: where the interpretation lands, and where it
// drifts. All derivations come from the memoized selector.
// ============================================================

import { motion } from 'framer-motion';
import { useDiscovery } from '@/store/discoveryStore';
import { useComparison } from '@/store/selectors';
import { ease } from '@/shared/motion/motion';
import { PerfumeSelector } from './PerfumeSelector';
import { PairedPyramids } from './PairedPyramids';
import { SimilarityRadarChart } from './SimilarityRadarChart';
import { AccordOverlap } from './AccordOverlap';
import { SimilarityReadout } from './SimilarityReadout';
import { KeyDifferencesList } from './KeyDifferencesList';

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-panel border border-[var(--line)] bg-smoke/60 p-6 sm:p-7 ${className ?? ''}`}>
      <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ComparisonMatrix() {
  const originalId = useDiscovery((s) => s.comparison.originalId);
  const cloneId = useDiscovery((s) => s.comparison.cloneId);
  const setOriginal = useDiscovery((s) => s.setComparisonOriginal);
  const setClone = useDiscovery((s) => s.setComparisonClone);
  const swap = useDiscovery((s) => s.swapComparison);

  const result = useComparison();

  return (
    <section
      id="compare"
      aria-labelledby="compare-title"
      className="mx-auto w-full max-w-[1180px] px-5 sm:px-8"
    >
      <header className="mb-9 flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
          Act III — Compare
        </span>
        <h2
          id="compare-title"
          className="max-w-[20ch] font-display text-[clamp(32px,6vw,52px)] leading-[1.05] text-parchment"
        >
          Read where two scents meet, and where they drift.
        </h2>
        <p className="max-w-[54ch] font-sans text-[16px] leading-relaxed text-parchment-dim">
          Pair any two scents in the atlas — an original with its interpretation, a
          flanker with its parent, or two rivals. Matching notes are drawn together;
          the radar shows how they perform. The story is visual first.
        </p>
      </header>

      {/* selector header (glass) */}
      <div className="glass mb-10 rounded-panel p-5 sm:p-6">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <PerfumeSelector role="original" value={originalId} onChange={setOriginal} />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap original and inspired"
            className="mx-auto grid h-11 w-11 shrink-0 place-items-center self-center rounded-full border border-[var(--line)] bg-[#FFFFFF] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright sm:mb-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 10l-3-3 3-3M4 7h11M17 14l3 3-3 3M20 17H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <PerfumeSelector role="clone" value={cloneId} onChange={setClone} />
        </div>
      </div>

      {result ? (
        <motion.div
          key={`${result.original.id}-${result.clone.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.enter }}
          className="flex flex-col gap-7"
        >
          <Panel title="The olfactory map">
            <PairedPyramids result={result} />
          </Panel>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <Panel title="Performance profile">
              <div className="flex flex-col items-center gap-5">
                <SimilarityRadarChart axes={result.radar} />
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-parchment-dim">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber" /> Original
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-parchment-dim">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose" /> Inspired
                  </span>
                </div>
              </div>
            </Panel>

            <div className="flex flex-col gap-7">
              <Panel title="Similarity">
                <SimilarityReadout score={result.similarity} />
              </Panel>
              <Panel title="Accord overlap">
                <AccordOverlap overlap={result.accordOverlap} />
              </Panel>
            </div>
          </div>

          <Panel title="Where it drifts">
            <KeyDifferencesList items={result.keyDifferences} />
          </Panel>
        </motion.div>
      ) : (
        <div className="rounded-panel border border-dashed border-[var(--line)] px-6 py-16 text-center">
          <p className="font-display text-[22px] text-parchment">
            Choose an original and an interpretation to begin.
          </p>
          <p className="mx-auto mt-3 max-w-[42ch] font-sans text-[15px] text-parchment-dim">
            Try a famous pairing to see the full comparison in motion.
          </p>
          <button
            type="button"
            onClick={() => {
              setOriginal('aventus');
              setClone('club-de-nuit-intense');
            }}
            className="mt-6 rounded-chip bg-champagne px-5 py-2.5 font-sans text-[13px] font-medium text-obsidian outline-none transition-colors hover:bg-champagne-bright"
          >
            Load Aventus × Club de Nuit
          </button>
        </div>
      )}
    </section>
  );
}
