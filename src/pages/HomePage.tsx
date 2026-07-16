// ============================================================
// SILLAGE — Home (/)
// The overture, not the whole opera. A living 3D constellation
// under a giant wordmark (every orb is a real note — tap one to
// open its page), the atlas counted in motion, shelves of real
// bottles drifting on scroll, and four doors into the app.
// The catalog itself lives in the Library; the thinking acts in
// Discover. Capability-gated: no WebGL (or a phone) gets the
// daily photo star instead of the constellation.
// ============================================================

import { Suspense, lazy, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useHomeCinema } from './useHomeCinema';
import { WHEEL_NOTES, NOTES_LIST, FAMILY_ORDER } from '@/data/notes';
import { PERFUMES, PERFUME_BY_ID } from '@/data/perfumes';
import { PHOTO_IDS } from '@/data/photoIds';
import { RELATIONSHIPS } from '@/data/relationships';
import { useWebGLCapability } from '@/shared/webgl/useWebGLCapability';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';
import { SectionReveal } from '@/shared/ui/SectionReveal';
import { ease } from '@/shared/motion/motion';

const NoteConstellation = lazy(
  () => import('@/features/atelier/constellation/NoteConstellation'),
);

// the daily star — always a scent with a real, verified photo
const FEATURED_POOL = [...PHOTO_IDS];
const FEATURED_ID =
  FEATURED_POOL[Math.floor(Date.now() / 86_400_000) % FEATURED_POOL.length] ??
  'terre-dhermes';

const PHOTO_SHELF = FEATURED_POOL.map((id) => PERFUME_BY_ID[id]).filter(Boolean);

const DOORS = [
  {
    to: '/library',
    title: 'The Library',
    copy: `Every bottle in the atlas — ${PERFUMES.length} scents to search, filter and deal.`,
  },
  {
    to: '/discover',
    title: 'Discover',
    copy: 'Pick notes on the wheel and watch the atlas answer, ranked by olfactory relevance.',
  },
  {
    to: '/finder',
    title: 'The Finder',
    copy: 'Five questions, three scents. A quiz that reads like a fitting.',
  },
  {
    to: '/atelier',
    title: 'The Atelier',
    copy: 'Compose your own pyramid and see where it lands among the real ones.',
  },
];

export function HomePage() {
  const reduce = useReducedMotion() ?? false;
  const canRender3D = useWebGLCapability();
  const navigate = useNavigate();
  const featured = PERFUME_BY_ID[FEATURED_ID];

  const scope = useRef<HTMLDivElement>(null);
  useHomeCinema(scope);

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: ease.enter, delay },
  });

  return (
    <div ref={scope} className="relative">
      {/* champagne progress hairline */}
      <div
        data-scroll-progress
        aria-hidden
        className="fixed left-0 top-14 z-30 h-[2px] w-full origin-left"
        style={{
          background: 'linear-gradient(90deg, #B0702F, #B0843C 60%, #8A6526)',
          transform: 'scaleX(0)',
        }}
      />

      <main className="relative flex flex-col gap-28 pb-32 sm:gap-36">
        {/* ---- the overture ---- */}
        <header
          data-overture
          className="relative mx-auto flex min-h-[92vh] w-full max-w-[1180px] flex-col justify-center px-5 pt-10 sm:px-8"
        >
          <div className="relative">
            {/* the stage: a living constellation (or the daily star) */}
            <motion.div
              data-h1-stage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.2 }}
              className="relative"
            >
              {canRender3D ? (
                <Suspense
                  fallback={
                    <div className="grid h-[560px] w-full place-items-center rounded-panel border border-[var(--line)]">
                      <span className="animate-pulse font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                        Gathering the constellation…
                      </span>
                    </div>
                  }
                >
                  <NoteConstellation
                    notes={WHEEL_NOTES}
                    selectedIds={[]}
                    onToggle={(id) => navigate(`/n/${id}`)}
                    height={560}
                    hint=""
                  />
                </Suspense>
              ) : (
                featured && (
                  <div className="mx-auto flex max-w-[420px] flex-col items-center gap-4 pt-16">
                    <div className="aspect-[4/5] w-[76%] overflow-hidden rounded-panel border border-[var(--line)] bg-[#F5EFE3] shadow-e2">
                      <BottleVisual perfume={featured} variant="tile" />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                        Scent of the moment
                      </span>
                      <span className="font-display text-[24px] leading-tight text-parchment">
                        {featured.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-[13px] text-parchment-dim">
                          {featured.brand}
                        </span>
                        <OriginalCloneBadge type={featured.type} />
                      </div>
                    </div>
                  </div>
                )
              )}
            </motion.div>

            {/* the words float over the stage */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span
                {...rise(0.1)}
                className="font-mono text-[12px] uppercase tracking-[0.32em] text-champagne-bright"
              >
                An atlas of scent
              </motion.span>
              <h1 data-h1-title className="mt-3 font-display leading-[0.92]">
                <span className="block overflow-hidden">
                  <motion.span
                    initial={reduce ? { opacity: 0 } : { y: '110%' }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    transition={{ duration: 0.9, ease: ease.enter, delay: 0.15 }}
                    className="block text-[clamp(64px,13vw,140px)] tracking-[-0.02em] text-parchment"
                    style={{ textShadow: '0 2px 30px rgba(250,248,244,0.85)' }}
                  >
                    SILLAGE
                  </motion.span>
                </span>
              </h1>
              <motion.p
                {...rise(0.4)}
                data-h1-sub
                className="mt-4 max-w-[46ch] text-balance px-4 font-display text-[clamp(18px,2.4vw,26px)] italic leading-snug text-parchment-dim"
                style={{ textShadow: '0 1px 18px rgba(250,248,244,0.9)' }}
              >
                {PERFUMES.length} scents, {NOTES_LIST.length} raw materials, one map —
                read the trail a fragrance leaves behind.
              </motion.p>
              <motion.div
                {...rise(0.55)}
                data-h1-cta
                className="pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-4"
              >
                <Link
                  to="/library"
                  className="group inline-flex items-center gap-2.5 rounded-chip bg-champagne px-6 py-3 font-sans text-[14px] font-medium text-ink shadow-e2 outline-none transition-colors hover:bg-champagne-bright hover:text-white"
                >
                  Enter the Library
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  to="/discover"
                  className="rounded-chip border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-3 font-sans text-[14px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
                >
                  Discover by note
                </Link>
              </motion.div>
              {canRender3D && (
                <motion.span
                  {...rise(0.8)}
                  className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
                >
                  Drag the constellation · tap a note to meet it
                </motion.span>
              )}
            </div>
          </div>
        </header>

        {/* ---- the atlas, counted ---- */}
        <section aria-label="The atlas in numbers" className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
          <h2
            data-h2-counted
            className="max-w-[22ch] font-display text-[clamp(30px,5vw,48px)] leading-[1.06] text-parchment"
          >
            An atlas, counted.
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
            {[
              { n: PERFUMES.length, label: 'scents charted' },
              { n: NOTES_LIST.length, label: 'raw materials' },
              { n: RELATIONSHIPS.length, label: 'originals with echoes' },
              { n: FAMILY_ORDER.length, label: 'olfactive families' },
            ].map(({ n, label }) => (
              <SectionReveal key={label}>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-[clamp(40px,6vw,64px)] leading-none text-parchment">
                    <AnimatedNumber value={n} />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne-bright">
                    {label}
                  </span>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* shelves of real bottles, drifting apart as you scroll */}
          <div className="mt-14 flex flex-col gap-4 overflow-hidden">
            {[
              { key: 'a', items: PHOTO_SHELF.slice(0, Math.ceil(PHOTO_SHELF.length / 2)), attr: { 'data-strip-a': '' } },
              { key: 'b', items: PHOTO_SHELF.slice(Math.ceil(PHOTO_SHELF.length / 2)), attr: { 'data-strip-b': '' } },
            ].map(({ key, items, attr }) => (
              <div key={key} {...attr} className="flex w-max gap-4">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    to={`/s/${p.id}`}
                    title={`${p.name} — ${p.brand}`}
                    className="block h-32 w-28 shrink-0 overflow-hidden rounded-card border border-[var(--line)] bg-[#FFFFFF] shadow-e1 outline-none transition-shadow hover:shadow-e2"
                  >
                    <BottleVisual perfume={p} variant="thumb" />
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-3 font-sans text-[12px] text-muted">
            Every photo verified against the real bottle — the rest of the atlas
            wears honest renders until its portrait arrives.
          </p>
        </section>

        {/* ---- four doors ---- */}
        <section aria-label="Ways into the atlas" className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
          <h2
            data-h2-doors
            className="max-w-[22ch] font-display text-[clamp(30px,5vw,48px)] leading-[1.06] text-parchment"
          >
            Four doors in.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DOORS.map((d, i) => (
              <SectionReveal key={d.to} delay={i * 0.06}>
                <Link
                  to={d.to}
                  className="group flex h-full flex-col justify-between gap-8 rounded-card border border-[var(--line)] bg-[#FFFFFF] p-6 shadow-e1 outline-none transition-all hover:-translate-y-1 hover:shadow-e2"
                >
                  <div>
                    <span className="font-display text-[26px] leading-tight text-parchment">
                      {d.title}
                    </span>
                    <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-parchment-dim">
                      {d.copy}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-champagne-bright">
                    Enter
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </section>
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
    </div>
  );
}
