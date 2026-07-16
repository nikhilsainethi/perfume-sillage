// ============================================================
// SILLAGE — shared creation ("the scent card")
// Anyone with the link sees the composition rendered live —
// flacon, character line, pyramid, accords — and can remix it
// into their own Atelier. No backend involved: the URL is the
// database.
// ============================================================

import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { decodeCreation } from '@/domain/shareCodec';
import { toPerfume } from '@/domain/creation';
import { characterLine } from '@/domain/creationInsights';
import { NOTES, FAMILY_COLOR } from '@/data/notes';
import { useAtelier } from '@/store/atelierStore';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { OlfactoryPyramid } from '@/features/detail/OlfactoryPyramid';
import { AccordBar } from '@/features/detail/AccordBar';
import { PerformanceMeters } from '@/features/detail/PerformanceMeters';
import { ease } from '@/shared/motion/motion';

export function SharedCreationPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const loadDecoded = useAtelier((s) => s.loadDecoded);

  const decoded = useMemo(
    () => (code ? decodeCreation(code, NOTES) : null),
    [code],
  );

  if (!decoded) {
    return (
      <main className="mx-auto grid min-h-[70vh] w-full max-w-[640px] place-items-center px-5">
        <div className="rounded-panel border border-dashed border-[var(--line)] px-8 py-16 text-center">
          <p className="font-display text-[26px] text-parchment">This trail has faded.</p>
          <p className="mx-auto mt-3 max-w-[40ch] font-sans text-[15px] text-parchment-dim">
            The share link couldn&rsquo;t be read — it may be incomplete or from a
            newer bottle of SILLAGE.
          </p>
          <Link
            to="/atelier"
            className="mt-6 inline-block rounded-chip bg-champagne px-6 py-3 font-sans text-[13px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
          >
            Compose your own instead
          </Link>
        </div>
      </main>
    );
  }

  const perfume = toPerfume(
    { id: 'shared', name: decoded.name, description: decoded.description, pyramid: decoded.pyramid },
    NOTES,
    FAMILY_COLOR,
  );
  const line = characterLine(decoded.pyramid, perfume.accords, perfume.context.seasons, NOTES);

  const remix = () => {
    loadDecoded(decoded);
    navigate('/atelier');
  };

  return (
    <main className="mx-auto w-full max-w-[880px] px-5 pb-28 pt-12 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: ease.enter }}
        className="overflow-hidden rounded-panel border border-[var(--line)] bg-white shadow-e2"
      >
        {/* card header */}
        <div className="flex flex-col items-center gap-5 px-6 pb-8 pt-10 text-center sm:px-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
            A composition shared with you
          </span>
          <div className="h-[240px] w-[186px] overflow-hidden rounded-[18px] border border-[var(--line)] shadow-e1">
            <BottleVisual perfume={perfume} variant="tile" />
          </div>
          <div>
            <h1 className="font-display text-[clamp(32px,6vw,48px)] leading-[1.05] text-parchment">
              {decoded.name}
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              from someone&rsquo;s atelier
            </p>
          </div>
          {line && (
            <p className="max-w-[46ch] text-balance font-display text-[clamp(17px,2.4vw,21px)] italic leading-snug text-parchment-dim">
              {line}
            </p>
          )}
          {decoded.description && (
            <p className="max-w-[52ch] font-sans text-[14px] leading-relaxed text-parchment-dim">
              &ldquo;{decoded.description}&rdquo;
            </p>
          )}
          {decoded.droppedNoteIds.length > 0 && (
            <p className="font-sans text-[12px] italic text-muted">
              ({decoded.droppedNoteIds.length} note
              {decoded.droppedNoteIds.length === 1 ? '' : 's'} from a newer atlas
              couldn&rsquo;t be rendered)
            </p>
          )}
        </div>

        <div className="border-t border-[var(--line)] px-6 py-8 sm:px-12">
          <h2 className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-champagne-bright">
            The pyramid
          </h2>
          <OlfactoryPyramid pyramid={decoded.pyramid} />
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-[var(--line)] px-6 py-8 sm:grid-cols-2 sm:px-12">
          <div>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne-bright">
              Accord profile
            </h2>
            <AccordBar accords={perfume.accords} />
          </div>
          <div>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne-bright">
              Projected performance
            </h2>
            <PerformanceMeters performance={perfume.performance} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-[var(--line)] px-6 py-8">
          <button
            type="button"
            onClick={remix}
            className="rounded-chip bg-champagne px-6 py-3 font-sans text-[13px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
          >
            Remix in the Atelier
          </button>
          <Link
            to="/"
            className="rounded-chip border border-[var(--line)] px-6 py-3 font-sans text-[13px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
          >
            Explore the atlas
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
