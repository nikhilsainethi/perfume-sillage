// ============================================================
// SILLAGE — AnimatedNumber
// A small number that rolls when its value changes (§4.2,
// MatchResultsSummary "number roll"). Crossfades vertically.
// ============================================================

import { AnimatePresence, motion } from 'framer-motion';
import { ease } from '@/shared/motion/motion';

export function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-grid overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '0.7em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.7em', opacity: 0 }}
          transition={{ duration: 0.32, ease: ease.enter }}
          className="tabular-nums"
          style={{ gridArea: '1 / 1' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
