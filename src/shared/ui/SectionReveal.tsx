// ============================================================
// SILLAGE — SectionReveal
// Quiet fade + rise as each act scrolls into view. Honors
// reduced motion by collapsing to a plain fade.
// ============================================================

import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '@/shared/motion/motion';

export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: ease.enter, delay }}
    >
      {children}
    </motion.div>
  );
}
