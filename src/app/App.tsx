// ============================================================
// SILLAGE — App root (routes)
// Hash routing so share links work on any static host.
// The Atelier / Shelf / Share pages are code-split.
// ============================================================

import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Providers } from './providers';
import { PerfumeDiscoveryPage } from '@/pages/PerfumeDiscoveryPage';
import { AmbientBackground } from '@/shared/ui/AmbientBackground';
import { NavBar } from '@/shared/ui/NavBar';

const AtelierPage = lazy(() =>
  import('@/features/atelier/AtelierPage').then((m) => ({ default: m.AtelierPage })),
);
const ShelfPage = lazy(() =>
  import('@/features/shelf/ShelfPage').then((m) => ({ default: m.ShelfPage })),
);
const SharedCreationPage = lazy(() =>
  import('@/features/share/SharedCreationPage').then((m) => ({
    default: m.SharedCreationPage,
  })),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <span className="animate-pulse font-display text-[22px] tracking-[0.1em] text-muted">
        SILLAGE
      </span>
    </div>
  );
}

export default function App() {
  return (
    <Providers>
      <HashRouter>
        <ScrollToTop />
        <div className="relative min-h-screen">
          <AmbientBackground />
          <NavBar />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<PerfumeDiscoveryPage />} />
              <Route path="/atelier" element={<AtelierPage />} />
              <Route path="/shelf" element={<ShelfPage />} />
              <Route path="/c/:code" element={<SharedCreationPage />} />
            </Routes>
          </Suspense>
        </div>
      </HashRouter>
    </Providers>
  );
}
