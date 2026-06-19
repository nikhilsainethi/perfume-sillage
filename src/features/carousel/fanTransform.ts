// ============================================================
// SILLAGE — Fan transform engine (§6.2, §12.4)
// Every card derives its full transform purely from
// offset = index - activeIndex. A coverflow depth fan crossed
// with a hand-of-cards tilt.
// ============================================================

export const MAX_VISIBLE = 4; // cards each side before fully hidden

export interface FanTarget {
  rotateY: number;
  rotateZ: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  zIndex: number;
  opacity: number;
  blur: number;
}

export function fanTransform(offset: number, maxVisible = MAX_VISIBLE): FanTarget {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);
  const c = Math.min(abs, maxVisible);

  return {
    // coverflow depth: neighbors angle away from the viewer
    rotateY: sign * Math.min(abs * 9, 32),
    // hand-of-cards fan tilt: progressive rotation
    rotateZ: sign * Math.min(abs * 4, 14),
    // horizontal spread, compressed for far cards (sqrt easing)
    x: sign * (120 * Math.sqrt(c)),
    // far cards sink slightly (the fan's pivot is low)
    y: c * 14,
    // push neighbors back in Z for real depth
    z: -c * 60,
    scale: Math.max(1 - abs * 0.08, 0.72),
    zIndex: 100 - c,
    opacity: abs > maxVisible ? 0 : 1 - c * 0.12,
    blur: Math.min(abs * 1.6, 6),
  };
}

/**
 * Reduced-motion / mobile coverflow (§10.2): no rotateZ, gentle rotateY,
 * blur capped, depth reduced — preserves the feel without GPU cost.
 */
export function flatTransform(offset: number, maxVisible = 1): FanTarget {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);
  const c = Math.min(abs, maxVisible);
  return {
    rotateY: sign * Math.min(abs * 12, 12),
    rotateZ: 0,
    x: sign * (150 * c + Math.max(0, abs - maxVisible) * 40),
    y: 0,
    z: -c * 40,
    scale: Math.max(1 - abs * 0.1, 0.8),
    zIndex: 100 - c,
    opacity: abs > maxVisible ? 0 : 1 - c * 0.3,
    blur: Math.min(abs * 1, 2),
  };
}
