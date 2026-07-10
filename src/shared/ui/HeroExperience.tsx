// ============================================================
// SILLAGE — HeroExperience (§4.2)
// Editorial opener: large display title with a mask-up reveal,
// one "scent of the moment" bottle that fades and rises, and a
// single CTA that scrolls to the engine.
// ============================================================

import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Perfume } from '@/domain/types';
import { ease } from '@/shared/motion/motion';
import { OriginalCloneBadge } from './OriginalCloneBadge';
import { BottleVisual } from './BottleVisual';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function HeroExperience({ featured }: { featured: Perfume }) {
  const reduce = useReducedMotion() ?? false;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: ease.enter, delay },
  });

  return (
    <header
      data-hero
      className="relative mx-auto flex min-h-[88vh] w-full max-w-[1180px] flex-col justify-center px-5 py-24 sm:px-8"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* editorial column */}
        <div className="flex flex-col gap-7">
          <motion.span {...rise(0.1)} className="font-mono text-[12px] uppercase tracking-[0.32em] text-champagne">
            An Atlas of Scent
          </motion.span>

          {/* title mask-up */}
          <h1 data-hero-title className="font-display leading-[0.92]">
            <span className="block overflow-hidden">
              <motion.span
                initial={reduce ? { opacity: 0 } : { y: '110%' }}
                animate={reduce ? { opacity: 1 } : { y: 0 }}
                transition={{ duration: 0.9, ease: ease.enter, delay: 0.15 }}
                className="block text-[clamp(64px,15vw,148px)] tracking-[-0.02em] text-parchment"
              >
                SILLAGE
              </motion.span>
            </span>
          </h1>

          <motion.p
            {...rise(0.4)}
            data-hero-sub
            className="max-w-[44ch] text-balance font-display text-[clamp(20px,2.6vw,28px)] italic leading-snug text-parchment-dim"
          >
            Read the trail a fragrance leaves behind — discover by note, browse the
            collection, and compare an original with its interpretation.
          </motion.p>

          <motion.div {...rise(0.55)} data-hero-cta className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/atelier"
              className="group inline-flex items-center gap-2.5 rounded-chip bg-champagne px-6 py-3 font-sans text-[14px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
            >
              Compose your own scent
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => scrollToId('discover')}
              className="rounded-chip border border-[var(--line)] px-6 py-3 font-sans text-[14px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
            >
              Explore the atlas
            </button>
          </motion.div>
        </div>

        {/* scent of the moment */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: ease.enter, delay: 0.35 }}
          data-hero-bottle
          className="relative mx-auto flex w-full max-w-[420px] flex-col items-center"
        >
          <div className="relative grid w-full place-items-center">
            {/* decorative slow ring behind the frame */}
            <div
              className="absolute h-[112%] w-[112%] rounded-full border border-[var(--line)]"
              style={{
                animation: reduce ? undefined : 'hero-spin 80s linear infinite',
                maskImage: 'conic-gradient(from 0deg, transparent, #000 30%, transparent 70%)',
                WebkitMaskImage: 'conic-gradient(from 0deg, transparent, #000 30%, transparent 70%)',
              }}
            />
            <div
              className="absolute h-[80%] w-[80%] rounded-full"
              style={{
                background: `radial-gradient(circle, ${featured.accent ?? '#B0843C'}26, transparent 70%)`,
              }}
            />
            {/* framed product photo */}
            <div className="relative aspect-[4/5] w-[78%] overflow-hidden rounded-panel border border-[var(--line)] bg-white shadow-e2">
              <BottleVisual perfume={featured} variant="tile" />
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center gap-2 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Scent of the moment
            </span>
            <span className="font-display text-[26px] leading-tight text-parchment">
              {featured.name}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-sans text-[13px] text-parchment-dim">{featured.brand}</span>
              <OriginalCloneBadge type={featured.type} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        {...rise(0.9)}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Scroll to begin
        </span>
      </motion.div>
    </header>
  );
}
