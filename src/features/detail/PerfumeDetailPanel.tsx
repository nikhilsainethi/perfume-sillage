// ============================================================
// SILLAGE — PerfumeDetailPanel (§4.2)
// Full profile in a right drawer (desktop) / bottom sheet
// (mobile). The bottle morphs in via shared layoutId; focus is
// trapped; Esc and backdrop close. Portaled above everything.
// ============================================================

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { Perfume } from '@/domain/types';
import { NOTES } from '@/data/notes';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import { spring } from '@/shared/motion/motion';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { OlfactoryPyramid } from './OlfactoryPyramid';
import { AccordBar } from './AccordBar';
import { PerformanceMeters } from './PerformanceMeters';
import { InspiredByLink } from './InspiredByLink';

const CONCENTRATION_LABEL: Record<string, string> = {
  extrait: 'Extrait',
  parfum: 'Parfum',
  edp: 'Eau de Parfum',
  edt: 'Eau de Toilette',
  edc: 'Eau de Cologne',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
        {title}
      </h3>
      {children}
    </section>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-chip border border-[var(--line)] px-3 py-1 font-sans text-[12px] capitalize text-parchment-dim">
      {children}
    </span>
  );
}

export function PerfumeDetailPanel({
  perfume,
  onClose,
  onOpen,
  onCompare,
}: {
  perfume: Perfume;
  onClose: () => void;
  onOpen: (id: string) => void;
  onCompare: (originalId: string, cloneId: string) => void;
}) {
  const isMobile = useIsMobile();
  const trapRef = useFocusTrap<HTMLDivElement>(true, onClose);

  // lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const meta = [
    perfume.concentration && CONCENTRATION_LABEL[perfume.concentration],
    perfume.year,
    perfume.gender,
  ].filter(Boolean);

  const slide = isMobile
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <motion.button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 cursor-default bg-[rgba(40,30,20,0.32)] backdrop-blur-sm outline-none"
      />

      {/* panel */}
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${perfume.name} by ${perfume.brand}`}
        {...slide}
        transition={spring.panel}
        className={`scrollbar-thin absolute overflow-y-auto bg-espresso shadow-e3 ${
          isMobile
            ? 'inset-x-0 bottom-0 max-h-[92vh] rounded-t-panel'
            : 'right-0 top-0 h-full w-[clamp(360px,42vw,560px)] border-l border-[var(--line)]'
        }`}
      >
        {isMobile && (
          <div className="sticky top-0 z-10 flex justify-center bg-espresso pt-3">
            <span className="h-1.5 w-12 rounded-full bg-[rgba(124,115,103,0.5)]" />
          </div>
        )}

        {/* close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-[#FFFFFF] text-parchment-dim outline-none transition-colors hover:text-champagne-bright"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col gap-9 p-6 sm:p-9">
          {/* hero */}
          <header className="flex flex-col items-center gap-4 text-center">
            <div
              className="relative flex w-full justify-center rounded-panel py-2"
              style={{
                background: perfume.accent
                  ? `radial-gradient(60% 70% at 50% 50%, ${perfume.accent}1f, transparent 72%)`
                  : undefined,
              }}
            >
              <motion.div
                layoutId={`bottle-${perfume.id}`}
                className="aspect-[4/5] w-[230px] overflow-hidden rounded-panel border border-[var(--line)] bg-white shadow-e1"
              >
                <BottleVisual perfume={perfume} variant="tile" />
              </motion.div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-parchment-dim">
                {perfume.brand}
              </span>
              <h2 className="font-display text-[clamp(34px,7vw,52px)] leading-[1.04] text-parchment">
                {perfume.name}
              </h2>
              <OriginalCloneBadge type={perfume.type} size="md" />
            </div>
            {meta.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {meta.map((m) => (
                  <MetaPill key={String(m)}>{m}</MetaPill>
                ))}
              </div>
            )}
          </header>

          <p className="text-balance text-center font-sans text-[16px] leading-relaxed text-parchment-dim">
            {perfume.description}
          </p>

          <Section title="The pyramid">
            <OlfactoryPyramid pyramid={perfume.pyramid} />
          </Section>

          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <Section title="Accord profile">
              <AccordBar accords={perfume.accords} />
            </Section>
            <Section title="Performance">
              <PerformanceMeters performance={perfume.performance} />
            </Section>
          </div>

          <Section title="When to wear">
            <div className="flex flex-wrap gap-2">
              {[...perfume.context.seasons, ...perfume.context.moods, ...perfume.context.occasions].map(
                (tag) => (
                  <MetaPill key={tag}>{tag}</MetaPill>
                ),
              )}
            </div>
          </Section>

          {perfume.perfumer && (
            <p className="font-sans text-[13px] text-muted">
              Composed by{' '}
              <span className="text-parchment-dim">{perfume.perfumer}</span>
              {perfume.house ? ` · ${perfume.house}` : ''}
            </p>
          )}

          <InspiredByLink perfume={perfume} onOpen={onOpen} onCompare={onCompare} />

          {/* note count footnote */}
          <p className="font-mono text-[11px] text-muted">
            {
              [...perfume.pyramid.top, ...perfume.pyramid.heart, ...perfume.pyramid.base].filter(
                (n) => NOTES[n.noteId],
              ).length
            }{' '}
            notes across three tiers
          </p>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
