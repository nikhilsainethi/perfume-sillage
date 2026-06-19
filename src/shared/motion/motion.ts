// ============================================================
// SILLAGE — Motion tokens (§9.1)
// Single source of truth for easings, springs, durations and
// stagger. Slow, weighted, intentional — never bouncy.
// ============================================================

import type { Transition } from 'framer-motion';

export const ease = {
  enter: [0.22, 1, 0.36, 1] as const, // expo-out — reveals
  move: [0.65, 0, 0.35, 1] as const, // in-out — positional
};

export const spring = {
  card: { type: 'spring', stiffness: 200, damping: 30, mass: 1 } as Transition, // carousel/layout
  panel: { type: 'spring', stiffness: 130, damping: 22 } as Transition, // drawers/soft UI
  chip: { type: 'spring', stiffness: 260, damping: 18 } as Transition, // pops
  hover: { type: 'spring', stiffness: 320, damping: 24 } as Transition, // card hover
};

export const duration = {
  reveal: 0.56,
  move: 0.42,
  micro: 0.24,
  draw: 0.52,
};

export const stagger = {
  notes: 0.04,
  cards: 0.018,
  axes: 0.03,
  connectors: 0.06,
};
