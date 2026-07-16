// ============================================================
// SILLAGE — App root (routes + page transitions)
// Hash routing so share links work on any static host; routes
// cross-fade through AnimatePresence. The Atlas route's
// transition is opacity-only ON PURPOSE: a transformed ancestor
// would break ScrollTrigger's pinned hero. Scroll resets when a
// new page mounts — so the Atlas ↔ /s/<id> pair (same key)
// keeps its scroll position while the detail panel opens.
// ============================================================

import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Providers } from './providers';
import { HomePage } from '@/pages/HomePage';
import { LibraryPage } from '@/pages/LibraryPage';
import { AmbientBackground } from '@/shared/ui/AmbientBackground';
import { NavBar } from '@/shared/ui/NavBar';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { useWebGLCapability } from '@/shared/webgl/useWebGLCapability';
import { ease } from '@/shared/motion/motion';

const AmbientWebGL = lazy(() => import('@/shared/ui/AmbientWebGL'));
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
const HousesPage = lazy(() =>
  import('@/features/houses/HousesPage').then((m) => ({ default: m.HousesPage })),
);
const FinderPage = lazy(() =>
  import('@/features/finder/FinderPage').then((m) => ({ default: m.FinderPage })),
);
const DiscoverPage = lazy(() =>
  import('@/pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage })),
);
const NotePage = lazy(() =>
  import('@/features/notes/NotePage').then((m) => ({ default: m.NotePage })),
);

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <span className="animate-pulse font-display text-[22px] tracking-[0.1em] text-muted">
        SILLAGE
      </span>
    </div>
  );
}

/** Scrolls to top when a NEW page mounts (not on atlas ↔ /s/<id> swaps). */
function ScrollRestorer() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);
  return null;
}

function Atmosphere() {
  const canRender3D = useWebGLCapability();
  return (
    <>
      <AmbientBackground />
      {canRender3D && (
        <Suspense fallback={null}>
          <AmbientWebGL />
        </Suspense>
      )}
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion() ?? false;
  // /library and /s/<id> are ONE surface: opening a scent must not remount
  // the page (the panel slides over the grid, scroll position intact).
  const isLibrary =
    location.pathname === '/library' || location.pathname.startsWith('/s/');
  const pageKey = isLibrary ? 'library' : location.pathname;

  // Home hosts a ScrollTrigger PIN: its entrance must be opacity-only, a
  // transformed ancestor would corrupt the pin's measurements.
  const slide = !reduce && location.pathname !== '/';

  // NO AnimatePresence here — mode="wait" makes mounting the NEXT page
  // depend on the OLD page's exit callback, and framer's exit completion
  // proved unreliable (stuck routes: URL changes, page doesn't). A keyed
  // remount with an entrance animation is just as polished and can't hang.
  return (
    <motion.div
      key={pageKey}
      initial={slide ? { opacity: 0, y: 16 } : { opacity: 0 }}
      animate={slide ? { opacity: 1, y: 0 } : { opacity: 1 }}
      transition={{ duration: reduce ? 0.15 : 0.26, ease: ease.enter }}
    >
      <ScrollRestorer />
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/s/:scentId" element={<LibraryPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/finder" element={<FinderPage />} />
          <Route path="/n/:noteId" element={<NotePage />} />
          <Route path="/houses" element={<HousesPage mode="maisons" />} />
          <Route path="/perfumers" element={<HousesPage mode="noses" />} />
          <Route path="/atelier" element={<AtelierPage />} />
          <Route path="/shelf" element={<ShelfPage />} />
          <Route path="/c/:code" element={<SharedCreationPage />} />
        </Routes>
      </Suspense>
    </motion.div>
  );
}

export default function App() {
  return (
    <Providers>
      <HashRouter>
        <div className="relative min-h-screen">
          <Atmosphere />
          <NavBar />
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </div>
      </HashRouter>
    </Providers>
  );
}
