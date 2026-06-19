// ============================================================
// SILLAGE — KeyDifferencesList (§4.1)
// The editorial "where it drifts" lines, staggered in.
// ============================================================

import { motion } from 'framer-motion';
import { ease } from '@/shared/motion/motion';

export function KeyDifferencesList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.42, ease: ease.enter, delay: i * 0.07 }}
          className="flex gap-3 font-sans text-[15px] leading-relaxed text-parchment-dim"
        >
          <span
            aria-hidden
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne"
          />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
