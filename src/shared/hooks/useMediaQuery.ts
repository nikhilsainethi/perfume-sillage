// ============================================================
// SILLAGE — responsive helpers (§10.1)
// ============================================================

import { useEffect, useState } from 'react';

/** Subscribe to a media query, SSR-safe and reactive. */
export function useMediaQuery(query: string): boolean {
  const get = () =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Named breakpoints from §10.1. */
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () =>
  useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
