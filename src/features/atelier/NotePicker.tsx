// ============================================================
// SILLAGE — NotePicker
// The note space: Orbit (3D constellation, lazy, gated),
// Wheel (2D radial) or List (accessible cluster). All three
// are prop-driven views over the same selection.
// ============================================================

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { FragranceNote } from '@/domain/types';
import { FragranceWheel } from '@/features/discover/FragranceWheel';
import { NoteSelector } from '@/features/discover/NoteSelector';
import { useWebGLCapability } from '@/shared/webgl/useWebGLCapability';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { ease } from '@/shared/motion/motion';

const NoteConstellation = lazy(() => import('./constellation/NoteConstellation'));

type PickerView = 'orbit' | 'wheel' | 'list';

function useInView<T extends HTMLElement>(margin = '160px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

export function NotePicker({
  notes,
  wheelNotes,
  selectedIds,
  onToggle,
}: {
  notes: FragranceNote[]; // full dictionary (list view)
  wheelNotes: FragranceNote[]; // curated set (wheel + orbit)
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const canRender3D = useWebGLCapability();
  const isMobile = useIsMobile();
  const [view, setView] = useState<PickerView | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>();

  const effective: PickerView =
    view ?? (canRender3D ? 'orbit' : isMobile ? 'list' : 'wheel');
  const options: PickerView[] = canRender3D
    ? ['orbit', 'wheel', 'list']
    : ['wheel', 'list'];

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div
        role="radiogroup"
        aria-label="Note picker view"
        className="inline-flex self-start rounded-chip border border-[var(--line)] bg-white p-0.5"
      >
        {options.map((v) => {
          const active = effective === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setView(v)}
              className="relative rounded-chip px-4 py-1.5 font-sans text-[12px] capitalize outline-none transition-colors"
              style={{ color: active ? '#1B1611' : '#6E6456' }}
            >
              {active && (
                <motion.span
                  layoutId="picker-view"
                  className="absolute inset-0 rounded-chip"
                  style={{ background: '#B0843C' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative z-10">{v === 'orbit' ? 'Orbit' : v}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={effective}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: ease.enter }}
      >
        {effective === 'orbit' ? (
          inView ? (
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
                notes={wheelNotes}
                selectedIds={selectedIds}
                onToggle={onToggle}
              />
            </Suspense>
          ) : (
            <div className="h-[560px] w-full rounded-panel border border-[var(--line)]" />
          )
        ) : effective === 'wheel' ? (
          <FragranceWheel notes={wheelNotes} selectedIds={selectedIds} onToggle={onToggle} />
        ) : (
          <div className="scrollbar-thin max-h-[620px] overflow-y-auto pr-2">
            <NoteSelector
              notes={notes}
              selectedIds={selectedIds}
              onToggle={onToggle}
              collapsible={isMobile}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
