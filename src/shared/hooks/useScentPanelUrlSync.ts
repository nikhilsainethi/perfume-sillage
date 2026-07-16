// ============================================================
// SILLAGE — URL ⇄ detail-panel sync (Library route)
// The URL is the source of truth for Back and deep links; the
// store for in-app opens. Opening any scent pushes /s/<id> so
// Back CLOSES the panel instead of leaving the site, and the
// address bar is always shareable. Only STORE transitions may
// write the URL — when Back rewrites the URL first, the store
// effect stays quiet and the URL effect closes the panel, or
// the two would fight and Back would appear dead.
// ============================================================

import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDiscovery } from '@/store/discoveryStore';
import { PERFUME_BY_ID } from '@/data/perfumes';

export function useScentPanelUrlSync(basePath: string) {
  const { scentId } = useParams<{ scentId: string }>();
  const navigate = useNavigate();
  const openDetail = useDiscovery((s) => s.openDetail);
  const closeDetail = useDiscovery((s) => s.closeDetail);
  const activeId = useDiscovery((s) => s.activePerfumeId);
  const prevActiveId = useRef<string | null>(null);

  // store → URL (store transitions only)
  useEffect(() => {
    const prev = prevActiveId.current;
    prevActiveId.current = activeId;
    if (activeId === prev) return;
    if (activeId && activeId !== scentId) {
      navigate(`/s/${activeId}`, { replace: Boolean(scentId) });
    } else if (!activeId && scentId) {
      navigate(basePath, { replace: true });
    }
  }, [activeId, scentId, navigate, basePath]);

  // URL → store (deep links, Back)
  useEffect(() => {
    if (scentId) {
      if (PERFUME_BY_ID[scentId]) openDetail(scentId);
      else navigate(basePath, { replace: true });
    } else {
      closeDetail(); // Back landed on the bare library — the panel follows
    }
  }, [scentId, openDetail, closeDetail, navigate, basePath]);
}
