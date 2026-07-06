// ============================================================
// SILLAGE — My Shelf
// The collector's cabinet: every saved creation as a bottled
// card — open, vary, share, or let one go. Export/import keeps
// the shelf portable (localStorage is honest about itself).
// ============================================================

import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toPerfume, noteCount } from '@/domain/creation';
import { encodeCreation } from '@/domain/shareCodec';
import { NOTES, FAMILY_COLOR, FAMILY_LABEL } from '@/data/notes';
import { useAtelier } from '@/store/atelierStore';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { ease, spring } from '@/shared/motion/motion';

export function ShelfPage() {
  const creations = useAtelier((s) => s.creations);
  const loadCreation = useAtelier((s) => s.loadCreation);
  const deleteCreation = useAtelier((s) => s.deleteCreation);
  const duplicateCreation = useAtelier((s) => s.duplicateCreation);
  const importCreations = useAtelier((s) => s.importCreations);
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [importNote, setImportNote] = useState('');

  const openInAtelier = (id: string) => {
    loadCreation(id);
    navigate('/atelier');
  };

  const share = async (id: string) => {
    const c = creations.find((x) => x.id === id);
    if (!c) return;
    const code = encodeCreation({ name: c.name, description: c.description, pyramid: c.pyramid });
    const url = `${window.location.origin}${window.location.pathname}#/c/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.prompt('Copy your share link:', url);
    }
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(creations, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sillage-creations.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onImportFile = async (file: File) => {
    const text = await file.text();
    const { added, skipped } = importCreations(text);
    setImportNote(
      added > 0
        ? `Imported ${added} creation${added === 1 ? '' : 's'}${skipped ? ` (${skipped} skipped)` : ''}.`
        : 'Nothing new to import.',
    );
    window.setTimeout(() => setImportNote(''), 3500);
  };

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-10 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.enter }}
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
      >
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
            My Shelf
          </span>
          <h1 className="font-display text-[clamp(34px,6vw,56px)] leading-[1.03] text-parchment">
            {creations.length === 0
              ? 'An empty cabinet, for now.'
              : `${creations.length} creation${creations.length === 1 ? '' : 's'}, bottled.`}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          {importNote && (
            <span className="font-sans text-[12px] italic text-champagne">{importNote}</span>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-chip border border-[var(--line)] px-4 py-2 font-sans text-[12px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
          >
            Import
          </button>
          {creations.length > 0 && (
            <button
              type="button"
              onClick={exportAll}
              className="rounded-chip border border-[var(--line)] px-4 py-2 font-sans text-[12px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
            >
              Export all
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImportFile(f);
              e.target.value = '';
            }}
          />
        </div>
      </motion.header>

      {creations.length === 0 ? (
        <div className="rounded-panel border border-dashed border-[var(--line)] px-6 py-20 text-center">
          <p className="font-display text-[22px] text-parchment">
            Your first composition is waiting.
          </p>
          <p className="mx-auto mt-3 max-w-[44ch] font-sans text-[15px] text-parchment-dim">
            Compose a scent in the Atelier and bottle it — it will live here.
          </p>
          <Link
            to="/atelier"
            className="mt-6 inline-block rounded-chip bg-champagne px-6 py-3 font-sans text-[13px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
          >
            Enter the Atelier
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {creations.map((c) => {
              const perfume = toPerfume(c, NOTES, FAMILY_COLOR);
              return (
                <motion.li
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={spring.card}
                  className="overflow-hidden rounded-panel border border-[var(--line)] bg-white shadow-e1"
                >
                  <button
                    type="button"
                    onClick={() => openInAtelier(c.id)}
                    className="block h-[190px] w-full cursor-pointer overflow-hidden outline-none"
                    aria-label={`Open ${c.name} in the Atelier`}
                  >
                    <BottleVisual perfume={perfume} variant="tile" />
                  </button>
                  <div className="flex flex-col gap-3 p-5">
                    <div>
                      <h2 className="truncate font-display text-[22px] leading-tight text-parchment">
                        {c.name}
                      </h2>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {noteCount(c.pyramid)} notes ·{' '}
                        {new Date(c.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {perfume.accords.slice(0, 3).map((a) => (
                        <span
                          key={a.family}
                          className="rounded-chip px-2.5 py-0.5 font-sans text-[11px]"
                          style={{
                            color: FAMILY_COLOR[a.family],
                            background: `${FAMILY_COLOR[a.family]}1A`,
                          }}
                        >
                          {FAMILY_LABEL[a.family]}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 flex items-center gap-2 border-t border-[var(--line)] pt-3">
                      <button
                        type="button"
                        onClick={() => openInAtelier(c.id)}
                        className="rounded-chip bg-champagne px-3.5 py-1.5 font-sans text-[12px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => share(c.id)}
                        className="rounded-chip border border-[var(--line)] px-3 py-1.5 font-sans text-[12px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
                      >
                        {copiedId === c.id ? 'Copied ✓' : 'Share'}
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateCreation(c.id)}
                        className="rounded-chip border border-[var(--line)] px-3 py-1.5 font-sans text-[12px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
                      >
                        Vary
                      </button>
                      {confirmingId === c.id ? (
                        <button
                          type="button"
                          onClick={() => deleteCreation(c.id)}
                          onBlur={() => setConfirmingId(null)}
                          className="ml-auto rounded-chip px-3 py-1.5 font-sans text-[12px] font-medium outline-none"
                          style={{ color: '#9C5C50', background: 'rgba(181,120,110,0.14)' }}
                        >
                          Sure?
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingId(c.id)}
                          aria-label={`Delete ${c.name}`}
                          className="ml-auto rounded-chip px-2.5 py-1.5 font-sans text-[12px] text-muted outline-none transition-colors hover:text-[#9C5C50]"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </main>
  );
}
