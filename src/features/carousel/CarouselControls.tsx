// ============================================================
// SILLAGE — CarouselControls (§4.1)
// Prev/next + a compact position counter and a clickable
// progress track (scales cleanly to a large catalog — no more
// one-dot-per-card). Keyboard lives on the carousel section.
// ============================================================

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CarouselControls({
  total,
  activeIndex,
  onPrev,
  onNext,
  onJump,
}: {
  total: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}) {
  if (total === 0) return null;
  const atStart = activeIndex <= 0;
  const atEnd = activeIndex >= total - 1;
  const pct = total > 1 ? (activeIndex / (total - 1)) * 100 : 0;

  const btn =
    'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[#FFFFFF] text-parchment-dim outline-none transition-colors hover:text-champagne-bright hover:border-champagne disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-parchment-dim disabled:hover:border-[var(--line)]';

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onJump(Math.round(frac * (total - 1)));
  };

  return (
    <div className="flex items-center justify-center gap-5">
      <button type="button" className={btn} onClick={onPrev} disabled={atStart} aria-label="Previous fragrance">
        <Arrow dir="left" />
      </button>

      <div className="flex w-[min(60vw,420px)] flex-col items-center gap-2">
        <span className="font-mono text-[12px] tracking-[0.08em] text-parchment-dim">
          <span className="text-champagne">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="mx-1.5 text-muted">/</span>
          {total}
        </span>
        <div
          role="slider"
          aria-label="Carousel position"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={activeIndex + 1}
          onClick={seek}
          className="group relative h-3 w-full cursor-pointer"
        >
          {/* track */}
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[rgba(124,115,103,0.25)]" />
          {/* fill */}
          <span
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-champagne transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
          {/* thumb */}
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne shadow-e1 transition-[left] duration-300"
            style={{ left: `${pct}%` }}
          />
        </div>
      </div>

      <button type="button" className={btn} onClick={onNext} disabled={atEnd} aria-label="Next fragrance">
        <Arrow dir="right" />
      </button>
    </div>
  );
}
