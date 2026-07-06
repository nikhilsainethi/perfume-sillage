// ============================================================
// SILLAGE — WebGL capability gate
// 3D is an enhancement, never a requirement: we only offer it
// when WebGL2 exists, the user hasn't asked for reduced
// motion, and the device isn't small/low-powered.
// ============================================================

import { useMemo } from 'react';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';

let cachedWebGL2: boolean | null = null;

function hasWebGL2(): boolean {
  if (cachedWebGL2 !== null) return cachedWebGL2;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    cachedWebGL2 = !!gl;
    if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cachedWebGL2 = false;
  }
  return cachedWebGL2;
}

export function useWebGLCapability(): boolean {
  const isMobile = useIsMobile();
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    if (isMobile) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const cores = navigator.hardwareConcurrency ?? 4;
    if (cores <= 2) return false;
    return hasWebGL2();
  }, [isMobile]);
}
