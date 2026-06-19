// ============================================================
// SILLAGE — PerfumeFanCard (§6, §12.4)
// One bottle card. Derives its visuals purely from `offset`;
// the parent owns ordering. The bottle carries a shared
// layoutId so a click morphs it into the detail panel.
// ============================================================

import { motion } from 'framer-motion';
import type { Perfume } from '@/domain/types';
import { NOTES } from '@/data/notes';
import { spring } from '@/shared/motion/motion';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { fanTransform, flatTransform, MAX_VISIBLE } from './fanTransform';

export function PerfumeFanCard({
  perfume,
  offset,
  isActive,
  variant = 'fan',
  maxVisible = MAX_VISIBLE,
  reduce = false,
  onSelect,
  onHover,
}: {
  perfume: Perfume;
  offset: number;
  isActive: boolean;
  variant?: 'fan' | 'flat';
  maxVisible?: number;
  reduce?: boolean;
  onSelect: () => void;
  onHover: (h: boolean) => void;
}) {
  const t = variant === 'flat' ? flatTransform(offset, maxVisible) : fanTransform(offset, maxVisible);
  const hidden = Math.abs(offset) > maxVisible;
  const blur = reduce ? 0 : t.blur;

  const dominant = Array.from(
    new Set([...perfume.pyramid.top, ...perfume.pyramid.heart].map((n) => n.noteId)),
  )
    .slice(0, 3)
    .map((id) => NOTES[id]?.name ?? id);

  return (
    <motion.article
      role="option"
      aria-selected={isActive}
      aria-label={`${perfume.name} by ${perfume.brand}, ${perfume.type === 'original' ? 'original' : 'inspired'}`}
      aria-hidden={hidden}
      tabIndex={isActive ? 0 : -1}
      className="absolute left-1/2 top-1/2 w-[clamp(248px,74vw,300px)] cursor-pointer
                 rounded-card outline-none focus-visible:shadow-focus"
      style={{
        zIndex: t.zIndex,
        transformOrigin: 'bottom center',
        x: '-50%',
        y: '-50%',
        pointerEvents: hidden ? 'none' : 'auto',
        background: 'linear-gradient(180deg, #FFFFFF, #FBF9F5)',
        border: '1px solid var(--line)',
      }}
      animate={{
        translateX: t.x,
        translateY: t.y,
        translateZ: t.z,
        rotateY: reduce ? 0 : t.rotateY,
        rotateZ: reduce ? 0 : t.rotateZ,
        scale: t.scale,
        opacity: t.opacity,
        filter: `blur(${blur}px)`,
        boxShadow: isActive
          ? '0 26px 60px rgba(60,45,30,0.16), 0 0 40px rgba(176,132,60,0.10)'
          : '0 12px 30px rgba(60,45,30,0.10)',
      }}
      transition={spring.card}
      initial={{ opacity: 0, scale: 0.9 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
      whileHover={
        isActive && !reduce
          ? { translateY: t.y - 16, scale: t.scale + 0.04, filter: 'blur(0px)' }
          : undefined
      }
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      onClick={onSelect}
    >
      {/* bottle photo */}
      <motion.div
        layoutId={`bottle-${perfume.id}`}
        className="relative h-[290px] overflow-hidden rounded-t-card bg-white"
      >
        <BottleVisual perfume={perfume} variant="tile" className="pointer-events-none" />
        {/* soft fade into the card so the photo blends with the white panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: 'linear-gradient(to top, #FFFFFF, transparent)' }}
        />
      </motion.div>

      <div className="px-6 pb-6 pt-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.16em] text-parchment-dim">
            {perfume.brand}
          </span>
          <OriginalCloneBadge type={perfume.type} />
        </div>
        <h3 className="mt-1.5 font-display text-[clamp(26px,3.4vw,32px)] leading-[1.08] text-parchment">
          {perfume.name}
        </h3>

        {/* dominant notes — revealed when active */}
        <motion.ul
          aria-hidden={!isActive}
          initial={false}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {dominant.map((name) => (
            <li
              key={name}
              className="rounded-chip border border-[var(--line)] px-3 py-1 font-sans text-[12px] text-parchment-dim"
            >
              {name}
            </li>
          ))}
        </motion.ul>
      </div>
    </motion.article>
  );
}
