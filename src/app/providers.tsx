// ============================================================
// SILLAGE — app providers
// MotionConfig honors the OS reduced-motion setting globally,
// and we keep the store's isMobile flag in sync with the
// viewport for components that read it.
// ============================================================

import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { useDiscovery } from '@/store/discoveryStore';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';

export function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const setIsMobile = useDiscovery((s) => s.setIsMobile);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
