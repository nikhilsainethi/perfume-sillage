// ============================================================
// SILLAGE — NoteConnectionMap (§7.3, §12.8)
// SVG overlay that measures matching note elements in the two
// pyramids and draws a bézier between each shared note. Edge x
// is derived from offsetWidth (layout, not transformed) so the
// reveal scale-in never distorts the anchor points.
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ease, stagger } from '@/shared/motion/motion';

interface Line {
  id: string;
  d: string;
  color: string;
}

export function NoteConnectionMap({
  containerRef,
  originalRefs,
  cloneRefs,
  matches,
  revision,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  originalRefs: Map<string, HTMLElement>;
  cloneRefs: Map<string, HTMLElement>;
  matches: { noteId: string; color: string }[];
  /** Changes when the pair switches, forcing a re-measure. */
  revision: string;
}) {
  const [lines, setLines] = useState<Line[]>([]);

  const measure = useCallback(() => {
    const host = containerRef.current;
    if (!host) return;
    const box = host.getBoundingClientRect();
    const next: Line[] = [];
    for (const m of matches) {
      const a = originalRefs.get(m.noteId);
      const b = cloneRefs.get(m.noteId);
      if (!a || !b) continue;
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      // centers are stable under transform-scale; widths come from layout
      const ax = ra.left + ra.width / 2 - box.left + a.offsetWidth / 2;
      const ay = ra.top + ra.height / 2 - box.top;
      const bx = rb.left + rb.width / 2 - box.left - b.offsetWidth / 2;
      const by = rb.top + rb.height / 2 - box.top;
      const mx = (ax + bx) / 2;
      next.push({
        id: m.noteId,
        color: m.color,
        d: `M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`,
      });
    }
    setLines(next);
  }, [containerRef, originalRefs, cloneRefs, matches]);

  useEffect(() => {
    measure();
    // re-measure after the pyramid reveal staggers settle
    const raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 350);
    const t2 = window.setTimeout(measure, 750);

    const host = containerRef.current;
    const ro = new ResizeObserver(measure);
    if (host) ro.observe(host);
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, revision, containerRef]);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {lines.map((l, i) => (
        <motion.path
          key={`${revision}-${l.id}`}
          d={l.d}
          fill="none"
          stroke={l.color}
          strokeWidth={1.5}
          strokeOpacity={0.75}
          style={{ filter: 'drop-shadow(0 0 4px rgba(176,132,60,0.4))' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.52, ease: ease.enter, delay: i * stagger.connectors }}
        />
      ))}
    </svg>
  );
}
