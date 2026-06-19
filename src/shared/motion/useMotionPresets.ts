// ============================================================
// SILLAGE — Reduced-motion presets (§10.5)
// Swaps the house springs for instant/crossfade transitions
// when prefers-reduced-motion is set. Functionality is
// identical — only the choreography is removed.
// ============================================================

import { useReducedMotion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { ease, spring } from './motion';

export interface MotionPresets {
  reduce: boolean;
  card: Transition;
  panel: Transition;
  chip: Transition;
  hover: Transition;
  reveal: Transition;
}

export function useMotionPresets(): MotionPresets {
  const reduce = useReducedMotion() ?? false;

  if (reduce) {
    const quick: Transition = { duration: 0.2, ease: ease.move };
    return {
      reduce,
      card: quick,
      panel: { duration: 0.24, ease: ease.move },
      chip: { duration: 0.12, ease: ease.move },
      hover: { duration: 0.12, ease: ease.move },
      reveal: { duration: 0.24, ease: ease.enter },
    };
  }

  return {
    reduce,
    card: spring.card,
    panel: spring.panel,
    chip: spring.chip,
    hover: spring.hover,
    reveal: { duration: 0.56, ease: ease.enter },
  };
}
